const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const badges = [
    {
      name: "Pelopor Masa Depan",
      description: "Menyelesaikan Orientasi Karier pertama kali.",
      image_url: "https://cdn-icons-png.flaticon.com/512/610/610333.png",
      type: "special",
      requirement: { type: "orientation_complete" }
    },
    {
      name: "Pejuang Harian",
      description: "Mencapai 7 hari streak belajar beruntun.",
      image_url: "https://cdn-icons-png.flaticon.com/512/426/426833.png",
      type: "streak",
      requirement: { type: "streak_count", value: 7 }
    },
    {
      name: "Master Kuis",
      description: "Mendapatkan skor 100 pada kuis harian.",
      image_url: "https://cdn-icons-png.flaticon.com/512/1426/1426735.png",
      type: "quiz",
      requirement: { type: "perfect_score" }
    },
    {
      name: "Penjelajah Karier",
      description: "Menyelesaikan roadmap 30 hari pertama Anda.",
      image_url: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      type: "completion",
      requirement: { type: "roadmap_complete" }
    },
    {
      name: "Kolektor Ilmu",
      description: "Mencapai total 1000 XP.",
      image_url: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png",
      type: "xp",
      requirement: { type: "xp_count", value: 1000 }
    }
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { id: badge.name.toLowerCase().replace(/ /g, "-") },
      update: badge,
      create: {
        id: badge.name.toLowerCase().replace(/ /g, "-"),
        ...badge
      }
    });
  }

  console.log("✅ Badges seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
