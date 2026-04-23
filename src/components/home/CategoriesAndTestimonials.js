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

export default function CategoriesAndTestimonials() {
  return (
    <>
      <section className="py-24">
        <ClientFeedback />
      </section>

      <section className="px-5 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[3rem] bg-[linear-gradient(135deg,#102233_0%,#1f547e_52%,#2b6ea6_100%)] px-8 py-12 text-white shadow-[0_40px_100px_rgba(13,33,51,0.2)] lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-16 lg:py-20">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">
              Start your 30-day reset
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Saatnya berhenti bingung dan mulai punya arah yang nyata.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-lg">
              Temukan bidang yang cocok, mulai roadmap 30 hari, dan bangun
              portofolio progres yang benar-benar terasa milikmu.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:mt-0">
            <a
              href="/auth/register"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-white px-8 text-base font-bold text-skillio-700 shadow-xl shadow-white/10 transition-transform hover:scale-105 active:scale-95"
            >
              Mulai Sekarang — Gratis
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
