const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  console.log("🚀 Creating 30-Day Completed Test User...");

  const hashedPassword = await bcrypt.hash("expert123", 10);

  const user = await prisma.user.upsert({
    where: { email: "test-expert@skillio.com" },
    update: {
        password: hashedPassword,
        emailVerified: new Date(),
    },
    create: {
      name: "Andika Expert",
      email: "test-expert@skillio.com",
      password: hashedPassword,
      emailVerified: new Date(),
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andika",
      xp: 15000,
    }
  });

  await prisma.streak.upsert({
    where: { user_id: user.id },
    update: {
      current_streak: 30,
      longest_streak: 30,
      last_active: new Date()
    },
    create: {
      user_id: user.id,
      current_streak: 30,
      longest_streak: 30,
      last_active: new Date()
    }
  });

  const category = await prisma.category.findFirst();
  if (!category) {
    console.error("❌ No categories found. Run main seeder first.");
    return;
  }

  const roadmap = await prisma.roadmap.upsert({
    where: { category_id: category.id },
    update: {},
    create: {
      category_id: category.id,
      title: `Mastery of ${category.name}`,
      description: "A comprehensive 30-day journey to mastery.",
      difficulty: "Advanced",
      estimated_time: "30 Days",
      published: true
    }
  });

  const userRoadmap = await prisma.userRoadmap.create({
    data: {
      user_id: user.id,
      roadmap_id: roadmap.id,
      category_id: category.id,
      status: "completed",
      current_day: 30,
      started_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      completed_at: new Date()
    }
  });

  console.log("  📝 Creating 30 days of progress...");
  const progressEntries = [];
  for (let i = 1; i <= 30; i++) {
    progressEntries.push({
      user_roadmap_id: userRoadmap.id,
      day_number: i,
      quiz_passed: true,
      quiz_score: 100,
      completed_tasks: ["Task 1", "Task 2"]
    });
  }
  await prisma.userDayProgress.createMany({ data: progressEntries });

  const badge = await prisma.badge.findFirst({ where: { name: "Sertifikat Kelulusan" } });
  if (badge) {

    await prisma.userBadge.deleteMany({ where: { user_id: user.id } });

    await prisma.userBadge.create({
      data: {
        user_id: user.id,
        badge_id: badge.id
      }
    });
  }

  console.log(`✅ Success! Login with:`);
  console.log(`📧 Email: test-expert@skillio.com`);
  console.log(`🔑 Password: expert123`);
  console.log(`🔗 Certificate ID: ${userRoadmap.id}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
