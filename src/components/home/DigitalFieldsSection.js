"use client";

import { motion } from "framer-motion";

const allDigitalFields = [
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

const colorPalette = [
  "bg-blue-50 border-blue-100 text-blue-700 hover:border-blue-300",
  "bg-emerald-50 border-emerald-100 text-emerald-700 hover:border-emerald-300",
  "bg-amber-50 border-amber-100 text-amber-700 hover:border-amber-300",
  "bg-rose-50 border-rose-100 text-rose-700 hover:border-rose-300",
  "bg-indigo-50 border-indigo-100 text-indigo-700 hover:border-indigo-300",
  "bg-purple-50 border-purple-100 text-purple-700 hover:border-purple-300",
  "bg-teal-50 border-teal-100 text-teal-700 hover:border-teal-300",
  "bg-orange-50 border-orange-100 text-orange-700 hover:border-orange-300",
  "bg-sky-50 border-sky-100 text-sky-700 hover:border-sky-300"
];

const coloredFields = allDigitalFields.map((item, index) => ({
  name: item,
  colorClass: colorPalette[index % colorPalette.length]
}));

// Split into 3 rows for the marquee
const row1 = coloredFields.slice(0, 17);
const row2 = coloredFields.slice(17, 34);
const row3 = coloredFields.slice(34, 50);

function FieldMarqueeRow({ items, direction = "left", duration = 40 }) {
  return (
    <div className="flex w-full overflow-hidden">
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex gap-4 whitespace-nowrap py-3"
      >
        {[...items, ...items].map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className={`flex shrink-0 items-center justify-center rounded-full border px-6 py-3 shadow-sm transition-colors hover:shadow-md ${item.colorClass}`}
          >
            <span className="text-sm font-semibold">
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function DigitalFieldsSection() {
  return (
    <section id="digital-fields" className="relative overflow-hidden border-y border-slate-100 bg-slate-50/50 py-24">
      <div className="mx-auto mb-16 max-w-6xl px-5 text-center sm:px-6 lg:px-8">
        <p className="section-kicker mx-auto">Katalog Bidang</p>
        <h2 className="font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Eksklusif Hanya Untuk <br className="hidden sm:block" />
          <span className="text-skillio-500">50 Bidang Digital.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
          Skillio saat ini didesain <strong>khusus dan hanya berlaku</strong> untuk karir di industri digital. Kami mengkurasi 50 profesi paling relevan untuk kamu kuasai.
        </p>
      </div>

      <div className="relative flex flex-col gap-2">
        <FieldMarqueeRow items={row1} direction="left" duration={50} />
        <FieldMarqueeRow items={row2} direction="right" duration={60} />
        <FieldMarqueeRow items={row3} direction="left" duration={45} />

        {/* Fade Overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-slate-50/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-slate-50/50 to-transparent" />
      </div>
    </section>
  );
}
