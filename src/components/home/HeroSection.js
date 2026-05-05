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

const HeroImage = ({ className }) => (
  <div className={`relative ${className}`} data-aos="fade-left" data-aos-delay="150">
    <div className="relative z-10 mx-auto max-w-[280px] sm:max-w-[400px] lg:max-w-[500px]">
      <Image
        src="/images/karir2.png"
        alt="Skillio hero"
        width={500}
        height={500}
        priority
        fetchPriority="high"
        className="h-auto w-full object-contain transition-transform duration-700 hover:scale-105"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  </div>
);

export default function HeroSection() {

  return (
    <section className="relative overflow-hidden px-5 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24">
      {}
      <div className="absolute top-0 right-0 -z-10 h-full w-full opacity-60">
        <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-skillio-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-teal-50/50 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-center space-y-8 text-center lg:items-start lg:text-left">
            <div className="section-kicker mx-auto lg:mx-0" data-aos="fade-up">Temukan Jalanmu Bersama Skillio</div>

            {}
            <HeroImage className="my-6 lg:hidden" />

            <div className="space-y-6" data-aos="fade-up" data-aos-delay="100">
              <h1 className="font-display text-3xl font-bold leading-[1.1] text-slate-950 sm:text-4xl lg:text-5xl">
                Bingung arah karir? <br />
                <span className="text-skillio-500">Ubah jadi progres nyata.</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                Skillio membantu anak muda Indonesia menemukan bidang yang paling sesuai,
                lalu memberikan roadmap 30 hari yang terstruktur untuk benar-benar menguasainya.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start" data-aos="fade-up" data-aos-delay="200">
              <a
                href="/auth/login"
                className="shine-line group inline-flex items-center justify-center gap-2 rounded-2xl bg-skillio-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-skillio-500/20 transition-all hover:bg-skillio-700 hover:shadow-skillio-500/30"
              >
                Mulai Eksplorasi
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start" data-aos="fade-up" data-aos-delay="300">
              {credibility.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {}
          <HeroImage className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
