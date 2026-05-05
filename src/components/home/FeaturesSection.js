"use client";

import { Sparkles, Target, Users, Zap, BarChart3, Globe } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const features = [
  {
    icon: Target,
    title: "Pahami Dirimu Lebih Dalam",
    description: "Kenali potensi dan minatmu melalui serangkaian pertanyaan cerdas yang dirancang khusus untuk memetakan jalur karier terbaikmu.",
    color: "bg-blue-50 text-blue-800",
  },
  {
    icon: Zap,
    title: "Langkah Nyata Setiap Hari",
    description: "Dapatkan roadmap belajar 30 hari yang terstruktur. Bukan sekadar teori, tapi langkah konkret yang bisa langsung kamu kerjakan.",
    color: "bg-amber-50 text-amber-900",
  },
  {
    icon: Sparkles,
    title: "Bimbingan AI Mentor 24/7",
    description: "Ada kesulitan? AI Mentor kami siap membantu menjawab pertanyaanmu kapan saja dengan konteks materi yang sedang kamu pelajari.",
    color: "bg-teal-50 text-teal-800",
  },
  {
    icon: BarChart3,
    title: "Pantau Progres Belajarmu",
    description: "Lihat perkembangan skill-mu setiap hari melalui visualisasi yang menarik. Jaga streak-mu dan rasakan kemajuan yang nyata.",
    color: "bg-indigo-50 text-indigo-800",
  },
  {
    icon: Globe,
    title: "Bukti Hasil yang Nyata",
    description: "Tunjukkan pencapaianmu ke dunia dengan kartu capaian digital dan badge yang mencerminkan perjalanan belajar aslimu.",
    color: "bg-emerald-50 text-emerald-800",
  },
  {
    icon: Users,
    title: "Komunitas yang Mendukung",
    description: "Belajar tidak sendirian. Terhubung dengan ribuan pelajar lainnya yang memiliki minat dan tujuan yang sama denganmu.",
    color: "bg-rose-50 text-rose-800",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative px-5 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col items-center text-center">
          <Reveal direction="down">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-skillio-600 px-4 py-1.5 text-sm font-bold text-white shadow-sm">
              Kenapa Skillio?
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="max-w-3xl font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Sistem Belajar yang Mengubah <br className="hidden sm:block" />
              <span className="text-skillio-500">Kebingungan Jadi Aksi Nyata.</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg text-slate-600">
              Kami tidak hanya memberikan materi, kami memberikan arah.
              Membantumu menemukan passion dan memberimu jalan untuk menguasainya.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, color }, index) => (
            <Reveal key={title} direction="up" delay={index * 0.08}>
              <article className="group relative h-full rounded-[2.5rem] border border-skillio-200 bg-slate-100/50 p-8 transition-all duration-300 hover:border-skillio-400 hover:bg-slate-100/80 hover:shadow-2xl hover:shadow-skillio-500/5">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${color} shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold text-slate-900">{title}</h3>
                <p className="text-base leading-relaxed text-slate-600">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
