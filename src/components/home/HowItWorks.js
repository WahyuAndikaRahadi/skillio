"use client";

import {
  Brain,
  Compass,
  FolderKanban,
  Sparkles,
  Trophy,
} from "lucide-react";

const steps = [
  {
    icon: Brain,
    title: "Jawab 30 pertanyaan yang makin tajam",
    desc: "Skillio membaca preferensi, pola belajar, dan arah minatmu dengan pertanyaan yang terasa personal, bukan formulir generik.",
    accent: "from-skillio-500 to-sky-300",
  },
  {
    icon: Compass,
    title: "Dapatkan bidang yang paling masuk akal",
    desc: "Begitu kecocokan terbaca, kamu langsung masuk ke jalur yang sesuai dengan kemampuan dan target perkembanganmu.",
    accent: "from-skillio-600 to-skillio-500",
  },
  {
    icon: FolderKanban,
    title: "Jalani roadmap 30 hari yang terstruktur",
    desc: "Setiap hari sudah berisi materi, tugas nyata, dan quiz untuk menjaga pemahaman tetap nempel dan progres terus maju.",
    accent: "from-cyan-400 to-skillio-500",
  },
  {
    icon: Trophy,
    title: "Bangun bukti kemampuanmu secara publik",
    desc: "Progress harian berubah jadi kartu capaian, badge, streak, dan skill tree yang bisa kamu bagikan sebagai portofolio hidup.",
    accent: "from-skillio-700 to-skillio-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-y border-slate-100 bg-white/40 px-5 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="section-kicker">Alur Belajar</p>
            <h2 className="font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Dari kebingungan arah hidup <br />
              menjadi <span className="text-skillio-500">progres yang nyata.</span>
            </h2>
          </div>
          <div className="max-w-md text-sm leading-relaxed text-slate-500 lg:text-base">
            Sistem kami dirancang untuk menghilangkan hambatan belajar. 
            Fokus pada aksi nyata, bukan sekadar teori yang membosankan.
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, desc, accent }, index) => (
            <div key={title} className="group relative">
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="absolute right-[-1.5rem] top-10 hidden h-px w-8 bg-slate-200 lg:block" />
              )}
              
              <article className="h-full rounded-[2.5rem] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300">
                <div className="mb-8 flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg shadow-current/10`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-sm font-black text-slate-300">
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold leading-tight text-slate-900">
                    {title}
                  </h3>
                  <p className="text-sm tracking-wide leading-relaxed text-slate-500">
                    {desc}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
