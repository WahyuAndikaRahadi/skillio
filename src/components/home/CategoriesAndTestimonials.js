"use client";

import ClientFeedback from "@/components/ui/testimonial";
import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChartColumn,
  Code2,
  Megaphone,
  PencilRuler,
  Video,
} from "lucide-react";

const categories = [
  {
    name: "UI/UX Design",
    icon: PencilRuler,
    detail: "Cocok untuk yang kuat di empati, visual, dan alur berpikir pengguna.",
    vibe: "Visual thinker",
    focus: "Riset, wireframe, design system",
    demand: "High demand",
    accent:
      "bg-[radial-gradient(circle_at_top_left,rgba(104,185,178,0.28),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,247,251,0.92))]",
    iconBg: "bg-[linear-gradient(135deg,#2b6ea6,#68b9b2)]",
    featured: true,
  },
  {
    name: "Web Development",
    icon: Code2,
    detail: "Untuk kamu yang suka membangun, memecahkan masalah, dan melihat hasil secara konkret.",
    vibe: "Builder mindset",
    focus: "Frontend, backend, deployment",
    demand: "Portfolio friendly",
    accent: "bg-white/88",
    iconBg: "bg-[linear-gradient(135deg,#173d5c,#2b6ea6)]",
  },
  {
    name: "Digital Marketing",
    icon: Megaphone,
    detail: "Belajar strategi, konten, dan eksperimen yang dekat dengan dunia nyata bisnis.",
    vibe: "Growth oriented",
    focus: "Campaign, funnel, content",
    demand: "Fast-moving field",
    accent: "bg-white/88",
    iconBg: "bg-[linear-gradient(135deg,#1f547e,#68b9b2)]",
  },
  {
    name: "Data & Analytics",
    icon: ChartColumn,
    detail: "Pas untuk yang suka pola, logika, dan mengubah angka menjadi keputusan.",
    vibe: "Logic driven",
    focus: "Insight, dashboard, analysis",
    demand: "Decision-making skill",
    accent: "bg-white/88",
    iconBg: "bg-[linear-gradient(135deg,#102233,#2b6ea6)]",
  },
  {
    name: "Content Creation",
    icon: Video,
    detail: "Bangun gaya, ritme, dan sistem produksi konten yang relevan dengan audiensmu.",
    vibe: "Creative engine",
    focus: "Script, editing, consistency",
    demand: "Social-ready output",
    accent: "bg-white/88",
    iconBg: "bg-[linear-gradient(135deg,#2b6ea6,#7ac8bf)]",
  },
  {
    name: "Product Thinking",
    icon: BriefcaseBusiness,
    detail: "Gabungkan riset, prioritas, dan eksekusi untuk membentuk produk yang dipakai banyak orang.",
    vibe: "Strategic lens",
    focus: "Problem framing, roadmap, prioritization",
    demand: "Leadership track",
    accent: "bg-white/88",
    iconBg: "bg-[linear-gradient(135deg,#173d5c,#68b9b2)]",
  },
];

export default function CategoriesAndTestimonials() {
  return (
    <>
      <section id="categories" className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl space-y-4">
              <p className="section-kicker">Kategori</p>
              <h2 className="font-display text-3xl leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Pilih medan belajar yang terasa klik dengan cara berpikirmu.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Setiap kategori dirancang bukan cuma sebagai topik belajar,
                tapi sebagai jalur berkembang. Kamu bisa mulai dari yang paling
                relevan, lalu membangun bukti kemampuan sedikit demi sedikit.
              </p>
            </div>

            <div className="blueprint-panel rounded-[28px] p-5 sm:p-6">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-skillio-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-skillio-700">
                    Discovery lens
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    6 jalur utama
                  </span>
                </div>
                <p className="text-sm leading-7 text-slate-600">
                  Biar tidak terasa seperti daftar kursus yang generik, tiap
                  card menonjolkan karakter bidang, fokus belajarnya, dan rasa
                  progres yang akan dibangun.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map(
              ({ name, icon: Icon, detail, vibe, focus, demand, accent, iconBg, featured }) => (
                <article
                  key={name}
                  className={`group relative overflow-hidden rounded-[30px] border border-white/75 p-6 shadow-[0_18px_60px_rgba(31,84,126,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_90px_rgba(31,84,126,0.14)] sm:p-7 ${
                    featured ? "md:col-span-2 xl:col-span-1" : ""
                  } ${accent}`}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-skillio-300 to-transparent opacity-80" />
                  <div className="absolute -right-10 top-8 h-28 w-28 rounded-full bg-skillio-100/40 blur-3xl transition duration-300 group-hover:scale-125" />

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className={`flex h-15 w-15 items-center justify-center rounded-[22px] text-white shadow-[0_16px_40px_rgba(31,84,126,0.22)] ${iconBg}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          <BadgeCheck className="h-3.5 w-3.5 text-teal-500" />
                          {vibe}
                        </span>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/72 text-slate-500 transition duration-300 group-hover:text-skillio-600">
                        <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    <div className="mb-5 space-y-3">
                      <h3 className="text-2xl font-semibold text-slate-950">
                        {name}
                      </h3>
                      <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                        {detail}
                      </p>
                    </div>

                    <div className="mt-auto space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/80 bg-white/74 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Fokus
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {focus}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/80 bg-slate-950/[0.03] p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Nilai
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {demand}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/68 px-4 py-3">
                        <span className="text-sm font-medium text-slate-600">
                          Cocok untuk jalur belajar 30 hari
                        </span>
                        <span className="rounded-full bg-skillio-50 px-2.5 py-1 text-xs font-semibold text-skillio-700">
                          Explore
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:px-8">
        <ClientFeedback />
      </section>

      <section className="px-5 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-6xl rounded-[36px] bg-[linear-gradient(135deg,#102233_0%,#1f547e_52%,#68b9b2_100%)] px-6 py-10 text-white shadow-[0_30px_120px_rgba(13,33,51,0.28)] sm:px-8 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
              Start your 30-day reset
            </p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Saatnya berhenti bingung dan mulai punya arah yang bisa kamu
              jalani setiap hari.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/74 sm:text-base">
              Temukan bidang yang cocok, mulai roadmap 30 hari, dan bangun
              portofolio progres yang benar-benar terasa milikmu.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-semibold text-skillio-700 shadow-[0_16px_40px_rgba(255,255,255,0.16)]"
            >
              Daftar gratis sekarang
            </a>
            <a
              href="#categories"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-6 py-4 text-sm font-semibold text-white/90 backdrop-blur"
            >
              Lihat kategori bidang
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
