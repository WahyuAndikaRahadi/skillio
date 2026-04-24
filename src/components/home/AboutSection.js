"use client";

import { Heart, Target, Zap } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="relative border-y border-slate-100 bg-white/40 px-5 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Image Placeholder (Left) */}
          <div className="order-first flex aspect-[4/3] w-full items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
            <div className="text-center">
              <p className="font-semibold">Tempat Gambar</p>
              <p className="text-sm">Silakan ganti dengan gambar Anda</p>
            </div>
          </div>

          {/* Text Content (Right) */}
          <div className="space-y-8 text-center lg:order-last lg:text-left">
            <div className="section-kicker mx-auto lg:mx-0">Tentang Skillio</div>
            <h2 className="font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Pastikan Potensimu <br className="hidden lg:block" />
              <span className="text-skillio-500">Tidak Terbuang.</span>
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Skillio lahir dari kegelisahan melihat banyak anak muda Indonesia yang merasa "tersesat" dalam menentukan arah karir. Kami membangun sistem yang tidak hanya memberi materi, tapi memberikan kejelasan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
