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
    <section id="how-it-works" className="px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-5 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="section-kicker">How It Works</p>
            <h2 className="font-display text-3xl leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Bukan sekadar belajar online. Ini alur yang memindahkan kamu dari
              bingung ke terarah.
            </h2>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/70 p-5 text-sm leading-7 text-slate-600 shadow-[0_18px_50px_rgba(16,68,140,0.08)] backdrop-blur lg:max-w-sm">
            Setiap tahap dibuat untuk menekan friksi: lebih sedikit overthinking,
            lebih banyak langkah konkret yang bisa diselesaikan hari ini juga.
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map(({ icon: Icon, title, desc, accent }, index) => (
            <article
              key={title}
              className="blueprint-panel group rounded-[30px] p-6 sm:p-7"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-[0_16px_40px_rgba(15,91,216,0.22)] transition duration-300 group-hover:scale-105 group-hover:rotate-3`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-skillio-500" />
                  Step {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <h3 className="mb-4 text-2xl font-semibold leading-tight text-slate-950">
                {title}
              </h3>
              <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                {desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
