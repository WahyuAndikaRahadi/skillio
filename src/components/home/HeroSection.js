"use client";

import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

const credibility = [
  "Tes minat & bakat cerdas",
  "Roadmap belajar 30 hari",
  "Pendampingan AI Mentor",
];

export default function HeroSection() {
  const HeroImage = ({ className }) => (
    <div className={`fade-up relative ${className}`} style={{ animationDelay: "150ms" }}>
      <div className="relative z-10 mx-auto aspect-square max-w-[280px] overflow-hidden rounded-full border-8 border-slate-100 bg-slate-50 shadow-2xl sm:max-w-[400px] sm:border-[12px] lg:max-w-[500px]">
        <Image
          src="/images/karir.jpg"
          alt="Skillio Learning Journey"
          width={1000}
          height={1000}
          className="h-full w-full object-cover brightness-[0.96] transition-transform duration-700 hover:scale-105"
          priority
        />
      </div>
      
      {/* Background Decorations */}
      <div className="absolute -right-8 -top-8 -z-10 h-32 w-32 rounded-full bg-teal-200/30 blur-2xl" />
      <div className="absolute -bottom-10 -right-10 -z-10 h-64 w-64 rounded-full bg-skillio-200/20 blur-3xl" />
    </div>
  );

  return (
    <section className="relative overflow-hidden px-5 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24">
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 -z-10 h-full w-full opacity-60">
        <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-skillio-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-teal-50/50 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="fade-up space-y-8">
            <div className="section-kicker">Temukan Jalanmu Bersama Skillio</div>

            {/* Image for Mobile only - between Kicker and Title */}
            <HeroImage className="lg:hidden my-6" />

            <div className="space-y-6">
              <h1 className="font-display text-3xl font-bold leading-[1.1] text-slate-950 sm:text-4xl lg:text-5xl">
                Bingung arah karir? <br />
                <span className="text-skillio-500">Ubah jadi progres nyata.</span>
              </h1>
              
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                Skillio membantu anak muda Indonesia menemukan bidang yang paling sesuai, 
                lalu memberikan roadmap 30 hari yang terstruktur untuk benar-benar menguasainya.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#start"
                className="shine-line group inline-flex items-center justify-center gap-2 rounded-2xl bg-skillio-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-skillio-500/20 transition-all hover:bg-skillio-700 hover:shadow-skillio-500/30"
              >
                Mulai Eksplorasi
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-200 bg-white/80 px-8 py-4 text-base font-bold text-slate-700 backdrop-blur-sm transition-all hover:border-skillio-200 hover:bg-skillio-50"
              >
                Lihat Cara Kerja
              </a>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {credibility.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image for Desktop only */}
          <HeroImage className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
