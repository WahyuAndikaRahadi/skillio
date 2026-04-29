const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding default profile pictures for existing users...");

  const usersWithoutImage = await prisma.user.findMany({
    where: {
      OR: [
        { image: null },
        { image: "" }
      ]
    }
  });

  console.log(`Found ${usersWithoutImage.length} users without profile pictures.`);

  for (const user of usersWithoutImage) {
    const defaultImage = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(user.name || 'User')}&backgroundColor=0a5a97,0d76c6,12a1ef`;

    await prisma.user.update({
      where: { id: user.id },
      data: { image: defaultImage }
    });
    console.log(`Updated user: ${user.name || user.email}`);
  }

  console.log("Profile picture seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
