const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Menjalankan seeder Admin...");

  const email = "admin@skillio.com";
  const password = await bcrypt.hash("adminskilliogalatea", 10);

  const admin = await prisma.user.upsert({
    where: { email: email },
    update: {
      role: "admin",
      password: password,
      name: "Skillio Administrator",
      is_pro: true,
      emailVerified: new Date()
    },
    create: {
      email: email,
      password: password,
      name: "Skillio Administrator",
      role: "admin",
      is_pro: true,
      emailVerified: new Date()
    }
  });

  console.log("✅ Admin berhasil disemai:");
  console.log("- Email:", admin.email);
  console.log("- Role:", admin.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
