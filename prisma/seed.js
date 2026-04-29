const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const CATEGORIES = [

  "Pengembangan Web Frontend",
  "Pengembangan Web Backend",
  "Pengembangan Aplikasi Mobile Android",
  "Pengembangan Aplikasi Mobile iOS",
  "Pengembangan Fullstack",
  "Rekayasa Perangkat Lunak",
  "Pengujian & Jaminan Kualitas Perangkat Lunak",
  "Keamanan Siber",
  "Jaringan & Infrastruktur",
  "Komputasi Awan",
  "Pengembangan Game",
  "Pemrograman Tertanam & Internet of Things",

  "Analisis Data",
  "Ilmu Data",
  "Rekayasa Data",
  "Kecerdasan Buatan & Pembelajaran Mesin",
  "Prompt Engineering & AI Tools",
  "Visualisasi Data",
  "Riset & Eksperimen Pengguna",
  "Otomasi & No-Code Development",

  "Desain UI/UX",
  "Desain Grafis",
  "Desain Produk Digital",
  "Desain Gerak & Animasi",
  "Desain Karakter & Ilustrasi",
  "Desain 3D & Pemodelan",
  "Desain Antarmuka Game",
  "Tipografi & Identitas Visual",
  "Desain Presentasi & Infografis",
  "Desain Augmented Reality & Virtual Reality",

  "Pembuatan Konten & Kreator Digital",
  "Penulisan Kreatif & Copywriting",
  "Penulisan Teknis & Dokumentasi",
  "Produksi Podcast",
  "Produksi & Pengeditan Video",
  "Fotografi Digital",
  "Manajemen Media Sosial",
  "Penyiaran & Streaming Digital",

  "Pemasaran Digital",
  "Optimasi Mesin Pencari",
  "Periklanan Digital & Manajemen Iklan",
  "Manajemen Produk Digital",
  "Pertumbuhan & Pemasaran Berbasis Data",
  "Perdagangan Elektronik & Toko Online",
  "Afiliasi & Monetisasi Digital",
  "Hubungan Masyarakat Digital",
  "Kewirausahaan Digital & Rintisan Teknologi",

  "Keuangan Pribadi & Investasi Digital",
  "Hukum & Regulasi Teknologi Digital",
  "Kepatuhan & Tata Kelola Data"
];

async function main() {
  console.log('🌱 Memulai proses seeding database fresh...');

  const adminPassword = await bcrypt.hash('adminskilliogalatea', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillio.com' },
    update: {
      emailVerified: new Date(),
      password: adminPassword,
    },
    create: {
      email: 'admin@skillio.com',
      name: 'Skillio Admin',
      password: adminPassword,
      role: 'admin',
      is_pro: true,
      xp: 999999,
      emailVerified: new Date()
    },
  });
  console.log(`✅ Admin terbuat: ${admin.email}`);

  let seededCount = 0;
  for (const name of CATEGORIES) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await prisma.category.upsert({
      where: { slug: slug },
      update: {},
      create: {
        name: name,
        slug: slug,
        description: `Kategori resmi untuk bidang ${name}`,
        is_generated: false
      }
    });
    seededCount++;
  }
  console.log(`✅ Berhasil melakukan seed untuk ${seededCount} Kategori Digital.`);

  const newBadges = [
    {
      name: "Social Butterfly",
      description: "Sangat aktif membagikan progres di Social Feed.",
      image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=social&backgroundColor=ffdfbf",
      type: "special",
      requirement: { condition: "post_count", value: 10 }
    },
    {
      name: "Night Owl",
      description: "Sering belajar dan menyelesaikan tugas di atas jam 12 malam.",
      image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=owl&backgroundColor=c0aede",
      type: "special",
      requirement: { condition: "night_activity", value: 5 }
    },
    {
      name: "Community Helper",
      description: "Menjawab lebih dari 20 pertanyaan dari pengguna lain di grup diskusi.",
      image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=helper&backgroundColor=b6e3f4",
      type: "special",
      requirement: { condition: "comment_count", value: 20 }
    },
    {
      name: "Speed Runner",
      description: "Menyelesaikan kuis harian dalam waktu kurang dari 1 menit dengan nilai sempurna.",
      image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=speed&backgroundColor=ffd5dc",
      type: "special",
      requirement: { condition: "quiz_speed", value: 60 }
    },
    {
      name: "Curious Explorer",
      description: "Bertanya kepada AI Mentor lebih dari 50 kali.",
      image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=explorer&backgroundColor=d1d4f9",
      type: "special",
      requirement: { condition: "ai_mentor_uses", value: 50 }
    }
  ];

  for (const badge of newBadges) {

    const exist = await prisma.badge.findFirst({ where: { name: badge.name } });
    if (!exist) {
      await prisma.badge.create({ data: badge });
    }
  }
  console.log(`✅ Berhasil melakukan seed untuk ${newBadges.length} Lencana (Badges).`);

  console.log('🎉 Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
