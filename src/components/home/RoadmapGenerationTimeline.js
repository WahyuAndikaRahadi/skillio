"use client";

import { BadgeCheck, BookOpenText, Bot, BrainCircuit, ClipboardCheck, Milestone, Sparkles, Target, Users } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";

const roadmapMoments = [
  {
    step: "01",
    title: "Kenali Potensi Dirimu",
    description: "Mulailah dengan menjawab pertanyaan cerdas yang dirancang khusus untuk memahami minat, kekuatan, dan gaya belajarmu yang unik.",
    icon: BrainCircuit,
    highlights: ["Pertanyaan adaptif", "Analisis minat", "Pemetaan kekuatan"],
    color: "bg-blue-50 text-blue-800",
    stepColor: "text-blue-200",
  },
  {
    step: "02",
    title: "Penentuan Jalur Terbaik",
    description: "Berdasarkan profilmu, kami menyarankan bidang karier yang paling sesuai agar kamu tidak membuang waktu di jalur yang kurang tepat.",
    icon: Target,
    highlights: ["Fokus pada hasil", "Logika pemilihan jelas", "Arah lebih terjamin"],
    color: "bg-teal-50 text-teal-800",
    stepColor: "text-teal-200",
  },
  {
    step: "03",
    title: "Penyusunan Rencana Belajar",
    description: "Dapatkan jadwal belajar 30 hari yang realistis. Materi disusun secara bertahap mulai dari fondasi hingga tantangan nyata.",
    icon: Milestone,
    highlights: ["Kurikulum terukur", "Target harian", "Progres bertahap"],
    color: "bg-indigo-50 text-indigo-800",
    stepColor: "text-indigo-200",
  },
  {
    step: "04",
    title: "Mulai Belajar Setiap Hari",
    description: "Setiap hari kamu akan mendapatkan paket belajar lengkap: materi singkat, tugas praktis, dan quiz untuk menguji pemahamanmu.",
    icon: BookOpenText,
    highlights: ["Tugas praktis", "Materi ringkas", "Quiz konfirmasi"],
    color: "bg-amber-50 text-amber-900",
    stepColor: "text-amber-200",
  },
  {
    step: "05",
    title: "Gabung Komunitas Belajar",
    description: "Terhubung dengan pelajar lain di bidang yang sama. Berbagi progres, bertanya, dan saling mendukung untuk menjaga semangat.",
    icon: Users,
    highlights: ["Grup bidang sama", "Diskusi interaktif", "Dukungan sesama"],
    color: "bg-rose-50 text-rose-800",
    stepColor: "text-rose-200",
  },
  {
    step: "06",
    title: "Cetak Bukti Keberhasilan",
    description: "Progresmu berubah menjadi kartu capaian dan badge digital yang membuktikan keahlianmu. Kamu juga didampingi AI Mentor di setiap langkah.",
    icon: BadgeCheck,
    highlights: ["Badge digital", "Kartu capaian", "Bantuan AI Mentor"],
    color: "bg-emerald-50 text-emerald-800",
    stepColor: "text-emerald-200",
  },
];

export default function RoadmapGenerationTimeline() {
  return (
    <section id="roadmap-generation" className="relative px-5 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-5 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <Reveal direction="right" className="max-w-3xl space-y-4">
            <p className="section-kicker">Proses Skillio</p>
            <h2 className="font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Cara Skillio mengubah potensimu <br />
              jadi <span className="text-skillio-500">roadmap belajar <CountUp from={0} to={30} separator="," direction="up" duration={1} className="count-up-text" delay={0} /> hari.</span>
            </h2>
          </Reveal>
          <Reveal direction="left" delay={0.1} className="rounded-[24px] border border-white/70 bg-white/72 p-5 text-sm leading-7 text-slate-600 shadow-[0_18px_50px_rgba(31,84,126,0.08)] backdrop-blur lg:max-w-sm">
            Visual ini menjelaskan fitur inti Skillio: proses yang bergerak dari
            identifikasi potensi sampai output belajar harian yang siap dijalani.
          </Reveal>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {roadmapMoments.map((moment, index) => (
            <Reveal key={moment.step} direction="up" delay={index * 0.08} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)]">
              <article className="group relative h-full overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 p-6 sm:rounded-[3rem] sm:p-8">
                <div className={`absolute -right-2 -top-4 select-none font-display text-[7rem] font-black ${moment.stepColor} opacity-[0.25] sm:-right-4 sm:-top-8 sm:text-[10rem]`}>
                  {moment.step}
                </div>
                <div className="relative z-10">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${moment.color} shadow-lg shadow-current/10 sm:mb-8 sm:h-16 sm:w-16 sm:rounded-[2rem]`}>
                    <moment.icon className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-skillio-500">
                      <Sparkles className="h-3 w-3" />
                      Tahap {moment.step}
                    </span>
                    <h3 className="font-display text-xl font-bold tracking-wide leading-relaxed text-slate-900 sm:text-2xl">
                      {moment.title}
                    </h3>
                    <p className="text-sm tracking-wide leading-relaxed text-slate-500 sm:text-[15px]">
                      {moment.description}
                    </p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-2 sm:mt-10">
                    {moment.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold tracking-wide text-slate-500 sm:text-[11px]">
                        <div className="h-1 w-1 rounded-full bg-current" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-skillio-500 transition-all duration-500 group-hover:w-full" />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal direction="zoom" delay={0.1}>
          <div className="mt-24 rounded-[3rem] border border-skillio-100 bg-slate-50/50 p-8 sm:p-12">
            <div className="grid gap-12 sm:grid-cols-3">
              <div className="space-y-4 text-center sm:text-left">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-skillio-600 shadow-sm sm:mx-0">
                  <Bot className="h-6 w-6" />
                </div>
                <h4 className="font-display text-xl font-bold text-slate-900">Cerdas & Adaptif</h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  Setiap materi dan tantangan menyesuaikan dengan kecepatan belajarmu secara personal.
                </p>
              </div>
              <div className="space-y-4 text-center sm:text-left">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-skillio-600 shadow-sm sm:mx-0">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <h4 className="font-display text-xl font-bold text-slate-900">Langsung Praktek</h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  Tidak ada teori yang menguap. Begitu belajar, kamu langsung diberi tantangan untuk mencoba.
                </p>
              </div>
              <div className="space-y-4 text-center sm:text-left">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-skillio-600 shadow-sm sm:mx-0">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="font-display text-xl font-bold text-slate-900">Motivasi Terjaga</h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  Sistem streak dan badge kami dirancang agar kamu tetap semangat menyelesaikan setiap hari.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
