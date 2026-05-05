"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="relative px-5 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {}
          <div className="order-first flex items-center justify-center" data-aos="fade-right">
            <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-[2rem] sm:max-w-[320px] lg:max-w-[380px]">
              <Image
                src="/images/about.png"
                alt="Tentang Skillio"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 380px"
                className="object-cover object-center"
              />
            </div>
          </div>

          {}
          <div className="space-y-8 text-center lg:order-last lg:text-left" data-aos="fade-left">
            <div className="section-kicker mx-auto lg:mx-0">Tentang Skillio</div>
            <h2 className="font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Pastikan Potensimu <br className="hidden lg:block" />
              <span className="text-skillio-500">Tidak Terbuang.</span>
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
             Skillio hadir dari kegelisahan melihat banyak anak muda Indonesia yang merasa “tersesat” dalam menentukan arah karier. Banyak yang belajar tanpa tujuan jelas dan hanya mengikuti tren. Karena itu, Skillio tidak hanya menyediakan materi, tetapi juga membantu menemukan arah yang tepat melalui sistem yang terstruktur dan relevan, agar setiap langkah lebih terarah dan bermakna.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
