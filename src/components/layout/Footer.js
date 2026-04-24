import React from "react";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 pb-8 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          <div className="max-w-sm">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-skillio-600 to-skillio-800 text-white shadow-lg shadow-skillio-600/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold tracking-tight text-slate-950">
                  Skillio
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Built for Indonesia
                </p>
              </div>
            </Link>

            <p className="text-base leading-relaxed text-slate-600">
              Platform pengembangan diri untuk anak muda Indonesia yang ingin
              berhenti bingung, memilih bidang yang tepat, lalu membuktikan
              kemampuannya lewat progres nyata.
            </p>

            <div className="mt-8 flex gap-3">
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-skillio-200 hover:bg-skillio-50 hover:text-skillio-600"
              >
                <FaInstagram className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-skillio-200 hover:bg-skillio-50 hover:text-skillio-600"
              >
                <FaTwitter className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-skillio-200 hover:bg-skillio-50 hover:text-skillio-600"
              >
                <FaLinkedin className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          <div className="lg:min-w-[200px]">
            <h4 className="mb-6 font-display text-base font-bold text-slate-900">
              Platform
            </h4>
            <ul className="space-y-4 text-sm font-medium text-slate-600">
              <li>
                <Link href="#features" className="transition-colors hover:text-skillio-600">
                  Fitur utama
                </Link>
              </li>
              <li>
                <Link href="#faq" className="transition-colors hover:text-skillio-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#digital-fields" className="transition-colors hover:text-skillio-600">
                  Katalog bidang
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="transition-colors hover:text-skillio-600">
                  Cerita pengguna
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Skillio Indonesia. Semua hak dilindungi.</p>
          <p className="font-medium text-slate-400">Satu hari, satu langkah, satu skill yang benar-benar jadi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
