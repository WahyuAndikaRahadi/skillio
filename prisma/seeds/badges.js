const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const BADGES = [
  {
    name: "Kupu Kupu Sosial",
    description: "Sangat aktif membagikan progres di Social Feed.",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=social&backgroundColor=ffdfbf",
    type: "community",
    requirement: { type: "community_posts", count: 10 }
  },
  {
    name: "Burung Hantu Malam",
    description: "Sering belajar dan menyelesaikan tugas di atas jam 12 malam.",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=owl&backgroundColor=c0aede",
    type: "special",
    requirement: { type: "night_activity", count: 5 }
  },
  {
    name: "Penolong Komunitas",
    description: "Menjawab lebih dari 20 pertanyaan dari pengguna lain di grup diskusi.",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=helper&backgroundColor=b6e3f4",
    type: "community",
    requirement: { type: "community_comments", count: 20 }
  },
  {
    name: "Pelari Cepat",
    description: "Menyelesaikan kuis harian dalam waktu kurang dari 1 menit dengan nilai sempurna.",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=speed&backgroundColor=ffd5dc",
    type: "quiz",
    requirement: { type: "quiz_speed", seconds: 60 }
  },
  {
    name: "Penjelajah Hebat",
    description: "Bertanya kepada AI Mentor lebih dari 50 kali.",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=explorer&backgroundColor=d1d4f9",
    type: "engagement",
    requirement: { type: "ai_messages", count: 50 }
  },
  {
    name: "Pemula Berani",
    description: "Kamu berani memulai! Selesaikan hari pertama belajarmu.",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=seedling&backgroundColor=b6e3f4",
    type: "milestone",
    requirement: { type: "day_complete", day: 1 }
  },
  {
    name: "Konsisten 7 Hari",
    description: "Tujuh hari berturut-turut! Kamu sedang membangun kebiasaan hebat.",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=fire&backgroundColor=ffdfbf",
    type: "streak",
    requirement: { type: "streak", days: 7 }
  },
  {
    name: "Penyelesai Pertama",
    description: "Luar biasa! Kamu telah menyelesaikan roadmap pertamamu di Skillio.",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=trophy&backgroundColor=ffd5dc",
    type: "completion",
    requirement: { type: "roadmaps_completed", count: 1 }
  },
  {
    name: "Master Trilogi",
    description: "Tiga roadmap selesai! Kamu semakin mendekati level master.",
    image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=king&backgroundColor=c0aede",
    type: "multi_roadmap",
    requirement: { type: "roadmaps_completed", count: 3 }
  }
];

async function main() {
  console.log("🌱 Cleaning and Seeding Indonesian Badges...");
  
  // Wipe old badges to ensure clean names
  await prisma.userBadge.deleteMany({});
  await prisma.badge.deleteMany({});
  
  let created = 0;
  for (const badgeData of BADGES) {
    await prisma.badge.create({ data: badgeData });
    console.log(`  ✅ Created: ${badgeData.name}`);
    created++;
  }
  console.log(`\nDone! Created: ${created} badges.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
