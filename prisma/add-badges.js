const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Adding new unique badges...");

  const newBadges = [
    {
      name: "Social Butterfly",
      description: "Sangat aktif membagikan progres di Social Feed.",
      image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=social&backgroundColor=ffdfbf",
      type: "special",
      requirement: {
        condition: "post_count",
        value: 10
      }
    },
    {
      name: "Night Owl",
      description: "Sering belajar dan menyelesaikan tugas di atas jam 12 malam.",
      image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=owl&backgroundColor=c0aede",
      type: "special",
      requirement: {
        condition: "night_activity",
        value: 5
      }
    },
    {
      name: "Community Helper",
      description: "Menjawab lebih dari 20 pertanyaan dari pengguna lain di grup diskusi.",
      image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=helper&backgroundColor=b6e3f4",
      type: "special",
      requirement: {
        condition: "comment_count",
        value: 20
      }
    },
    {
      name: "Speed Runner",
      description: "Menyelesaikan kuis harian dalam waktu kurang dari 1 menit dengan nilai sempurna.",
      image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=speed&backgroundColor=ffd5dc",
      type: "special",
      requirement: {
        condition: "quiz_speed",
        value: 60
      }
    },
    {
      name: "Curious Explorer",
      description: "Bertanya kepada AI Mentor lebih dari 50 kali.",
      image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=explorer&backgroundColor=d1d4f9",
      type: "special",
      requirement: {
        condition: "ai_mentor_uses",
        value: 50
      }
    }
  ];

  for (const badge of newBadges) {
    await prisma.badge.create({
      data: badge
    });
    console.log(`Created badge: ${badge.name}`);
  }

  console.log("All badges added successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
