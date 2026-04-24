import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Code2, Database, Palette, Video, TrendingUp, Scale, CheckCircle2 } from "lucide-react";

const categories = [
  {
    title: "Teknologi & Pengembangan",
    icon: Code2,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    items: [
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
      "Pemrograman Tertanam & Internet of Things"
    ]
  },
  {
    title: "Data & Kecerdasan Buatan",
    icon: Database,
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    items: [
      "Analisis Data",
      "Ilmu Data",
      "Rekayasa Data",
      "Kecerdasan Buatan & Pembelajaran Mesin",
      "Prompt Engineering & AI Tools",
      "Visualisasi Data",
      "Riset & Eksperimen Pengguna",
      "Otomasi & No-Code Development"
    ]
  },
  {
    title: "Desain & Kreativitas",
    icon: Palette,
    color: "bg-rose-50 text-rose-600 border-rose-100",
    items: [
      "Desain UI/UX",
      "Desain Grafis",
      "Desain Produk Digital",
      "Desain Gerak & Animasi",
      "Desain Karakter & Ilustrasi",
      "Desain 3D & Pemodelan",
      "Desain Antarmuka Game",
      "Tipografi & Identitas Visual",
      "Desain Presentasi & Infografis",
      "Desain Augmented Reality & Virtual Reality"
    ]
  },
  {
    title: "Konten & Media Digital",
    icon: Video,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    items: [
      "Pembuatan Konten & Kreator Digital",
      "Penulisan Kreatif & Copywriting",
      "Penulisan Teknis & Dokumentasi",
      "Produksi Podcast",
      "Produksi & Pengeditan Video",
      "Fotografi Digital",
      "Manajemen Media Sosial",
      "Penyiaran & Streaming Digital"
    ]
  },
  {
    title: "Bisnis & Pemasaran Digital",
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    items: [
      "Pemasaran Digital",
      "Optimasi Mesin Pencari",
      "Periklanan Digital & Manajemen Iklan",
      "Manajemen Produk Digital",
      "Pertumbuhan & Pemasaran Berbasis Data",
      "Perdagangan Elektronik & Toko Online",
      "Afiliasi & Monetisasi Digital",
      "Hubungan Masyarakat Digital",
      "Kewirausahaan Digital & Rintisan Teknologi"
    ]
  },
  {
    title: "Keuangan & Legalitas Digital",
    icon: Scale,
    color: "bg-slate-100 text-slate-600 border-slate-200",
    items: [
      "Keuangan Pribadi & Investasi Digital",
      "Hukum & Regulasi Teknologi Digital",
      "Kepatuhan & Tata Kelola Data"
    ]
  }
];

export default function BidangDigitalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-grow pt-28 pb-20 sm:pt-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          
          <div className="mb-16 max-w-3xl space-y-6">
            <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              50 Bidang Digital <br className="hidden sm:block" />
              <span className="text-skillio-500">untuk Skillio.</span>
            </h1>
            <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
              Temukan berbagai macam bidang digital yang bisa kamu pelajari dan kuasai melalui roadmap terstruktur dari kami.
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((category, idx) => (
              <section key={category.title} className="scroll-mt-32" id={`category-${idx}`}>
                <div className="mb-8 flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${category.color} shadow-sm`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-slate-900">{category.title}</h2>
                    <p className="text-sm text-slate-500">{category.items.length} Bidang</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.items.map((item) => (
                    <div 
                      key={item}
                      className="group flex h-full cursor-default items-start gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-skillio-300 hover:shadow-md"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-skillio-400 transition-colors group-hover:text-skillio-500" />
                      <span className="text-sm font-medium leading-relaxed text-slate-700 group-hover:text-slate-900">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
