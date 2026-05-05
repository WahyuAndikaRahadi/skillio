"use client";

import ClientFeedback from "@/components/ui/testimonial";
import PWAInstallButton from "@/components/layout/PWAInstallButton";
import Reveal from "@/components/ui/Reveal";

export default function CategoriesAndTestimonials() {
  return (
    <>
      <Reveal direction="up">
        <section className="py-24">
          <ClientFeedback />
        </section>
      </Reveal>

      <section className="px-5 pb-24 sm:px-6 lg:px-8">
        <Reveal direction="zoom">
          <div className="mx-auto max-w-6xl rounded-[3rem] bg-[linear-gradient(135deg,#102233_0%,#1f547e_52%,#2b6ea6_100%)] px-8 py-12 text-white shadow-[0_40px_100px_rgba(13,33,51,0.2)] flex flex-col items-center text-center lg:px-16 lg:py-20">
            <div className="max-w-3xl space-y-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">
                Nikmati Pengalaman Terbaik
              </p>
              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Bawa Skillio ke Genggamanmu
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 sm:text-lg">
                Pasang aplikasi Skillio di layar utama perangkatmu untuk akses instan ke roadmap belajar, mentor AI, dan komunitas tanpa harus membuka browser setiap saat.
              </p>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <PWAInstallButton className="bg-white text-skillio-700 shadow-xl shadow-white/10 hover:bg-slate-50" />
            </div>

            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Tersedia untuk Android, iOS, dan Desktop
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
