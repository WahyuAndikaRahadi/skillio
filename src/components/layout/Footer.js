import React from "react";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/60 px-5 pb-10 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] text-white shadow-[0_14px_30px_rgba(31,84,126,0.22)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl leading-none tracking-[-0.06em] text-slate-950">
                  Skillio
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Built for Indonesia
                </p>
              </div>
            </Link>

            <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
              Platform pengembangan diri untuk anak muda Indonesia yang ingin
              berhenti bingung, memilih bidang yang tepat, lalu membuktikan
              kemampuannya lewat progres yang nyata.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-skillio-600 shadow-[0_12px_30px_rgba(31,84,126,0.08)]"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-skillio-600 shadow-[0_12px_30px_rgba(31,84,126,0.08)]"
              >
                <FaTwitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-skillio-600 shadow-[0_12px_30px_rgba(31,84,126,0.08)]"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Platform
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="#features" className="hover:text-skillio-600">
                  Fitur utama
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-skillio-600">
                  Cara kerja
                </Link>
              </li>
              <li>
                <Link href="#digital-fields" className="hover:text-skillio-600">
                  Katalog bidang
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="hover:text-skillio-600">
                  Cerita pengguna
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Tentang
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="#" className="hover:text-skillio-600">
                  Misi & visi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-skillio-600">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-skillio-600">
                  Kebijakan privasi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-skillio-600">
                  Syarat layanan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/70 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Skillio Indonesia. Semua hak dilindungi.</p>
          <p>Satu hari, satu langkah, satu skill yang benar-benar jadi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
