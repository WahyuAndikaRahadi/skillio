"use client";

import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  ChartNoAxesCombined,
  Sparkles,
} from "lucide-react";

const credibility = [
  "Tes minat berbasis AI",
  "Roadmap harian 30 hari",
  "AI Mentor yang kontekstual",
];

const snapshots = [
  { label: "User match rate", value: "96%" },
  { label: "Rata-rata streak aktif", value: "21 hari" },
  { label: "Kartu capaian dibagikan", value: "18K+" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24">
      <div className="hero-orb left-[-6rem] top-24 h-44 w-44 bg-cyan-200/45 sm:h-60 sm:w-60" />
      <div className="hero-orb right-[-4rem] top-16 h-52 w-52 bg-skillio-300/35 sm:h-72 sm:w-72" />
      <div className="soft-ring right-[8%] top-28 h-40 w-40 sm:h-56 sm:w-56" />
      <div className="soft-ring bottom-16 left-[6%] h-28 w-28 sm:h-36 sm:w-36" />

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <div className="fade-up space-y-8">
          <div className="section-kicker">Career clarity for Gen Z</div>

          <div className="space-y-5">
            <h1 className="max-w-3xl font-display text-[2.75rem] leading-[0.94] text-slate-950 sm:text-6xl lg:text-[5.4rem]">
              Bingung arah hidup?
              <span className="mt-2 block text-skillio-500">
                Ubah jadi progres 30 hari.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Skillio membantu anak muda Indonesia menemukan bidang yang paling
              sesuai, lalu menjalani perjalanan belajar harian yang terstruktur,
              realistis, dan bisa dibuktikan ke dunia.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#features"
              className="shine-line inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(31,84,126,0.24)]"
            >
              Mulai eksplor perjalananmu
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-skillio-200 bg-white/70 px-6 py-4 text-sm font-semibold text-slate-700 backdrop-blur hover:border-skillio-300 hover:text-skillio-600"
            >
              Lihat cara kerjanya
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            {credibility.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-[0_8px_30px_rgba(31,84,126,0.08)] backdrop-blur"
              >
                <BadgeCheck className="h-4 w-4 text-skillio-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-up relative" style={{ animationDelay: "140ms" }}>
          <div className="blueprint-panel rounded-[30px] p-4 sm:p-5">
            <div className="rounded-[26px] bg-[linear-gradient(160deg,#16334a_0%,#1f547e_48%,#68b9b2_100%)] p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] sm:p-7">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.28em] text-white/65">
                    Skillio Compass
                  </p>
                  <h2 className="max-w-xs font-display text-3xl leading-none sm:text-4xl">
                    Belajar yang punya arah, ritme, dan bukti.
                  </h2>
                </div>
                <div className="glass rounded-2xl px-3 py-2 text-right text-[11px] font-semibold text-slate-800">
                  12.000+ learner aktif
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {snapshots.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur"
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">
                      {item.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[24px] border border-white/18 bg-slate-950/18 p-5 backdrop-blur">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
                      <BrainCircuit className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                        Hari 01
                      </p>
                      <p className="text-sm font-semibold">
                        AI menemukan pola kecocokanmu
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 rounded-[22px] bg-white/10 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">UX Research</span>
                      <span className="font-semibold">98%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/15">
                      <div className="h-full w-[98%] rounded-full bg-white" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Product Design</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/15">
                      <div className="h-full w-[92%] rounded-full bg-teal-200" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="float-gentle rounded-[24px] border border-white/20 bg-white/14 p-5 backdrop-blur">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.24em] text-white/60">
                        Mentor
                      </span>
                      <Sparkles className="h-4 w-4 text-teal-100" />
                    </div>
                    <p className="text-sm leading-7 text-white/88">
                      &ldquo;Kamu cocok di jalur UI/UX karena kuat di empati
                      visual dan struktur berpikir.&rdquo;
                    </p>
                  </div>

                  <div className="float-slow rounded-[24px] border border-white/20 bg-white/88 p-5 text-slate-900 shadow-[0_18px_60px_rgba(13,33,51,0.16)]">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-skillio-100 text-skillio-600">
                        <ChartNoAxesCombined className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Progress
                        </p>
                        <p className="text-sm font-semibold">Roadmap hari ke-12</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Belajar design system</span>
                        <span className="font-semibold text-slate-900">Selesai</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tantangan redesign landing page</span>
                        <span className="rounded-full bg-skillio-100 px-2.5 py-1 text-xs font-semibold text-skillio-700">
                          Berjalan
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
