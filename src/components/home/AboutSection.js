"use client";

import { Heart, Target, Zap } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="relative border-y border-slate-100 bg-white/40 px-5 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="section-kicker">Tentang Skillio</div>
            <h2 className="font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Misi kami adalah memastikan <br className="hidden lg:block" />
              <span className="text-skillio-500">tidak ada potensi yang tersia-sia.</span>
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Skillio lahir dari kegelisahan melihat banyak anak muda Indonesia yang merasa "tersesat" dalam menentukan arah karir. Kami membangun sistem yang tidak hanya memberi materi, tapi memberikan **kejelasan**.
            </p>
            <p className="text-lg leading-relaxed text-slate-600">
              Dengan bantuan kecerdasan buatan, kami memetakan minat terdalammu dan mengubahnya menjadi langkah konkret yang bisa kamu jalani hari demi hari.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <div className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-skillio-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Heart className="h-6 w-6" />
              </div>
              <h4 className="mb-2 font-display text-xl font-bold text-slate-900">Empati & Akurasi</h4>
              <p className="text-sm tracking-wide leading-relaxed text-slate-500">
                Kami mendengarkan minatmu melalui 30 pertanyaan cerdas untuk hasil yang paling personal.
              </p>
            </div>

            <div className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-skillio-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="mb-2 font-display text-xl font-bold text-slate-900">Aksi & Struktur</h4>
              <p className="text-sm tracking-wide leading-relaxed text-slate-500">
                Bukan sekadar teori. Kami memberikan roadmap 30 hari yang siap dieksekusi setiap hari.
              </p>
            </div>

            <div className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-skillio-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="mb-2 font-display text-xl font-bold text-slate-900">Hasil & Bukti</h4>
              <p className="text-sm tracking-wide leading-relaxed text-slate-500">
                Setiap progresmu berubah menjadi bukti nyata berupa kartu capaian dan portofolio visual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
