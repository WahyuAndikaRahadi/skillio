import React from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Skillio | Public Profile",
  description: "Lihat pencapaian dan perjalanan belajar di Skillio.",
};

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Simple Top Navigation for Public View */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
             <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
                <Image 
                  src="/images/skillio-logo.png" 
                  alt="Skillio Logo" 
                  fill 
                  className="object-contain"
                />
             </div>
             <span className="text-2xl font-black tracking-tighter text-slate-900">SKILLIO</span>
          </Link>
          
          <Link 
            href="/"
            className="px-6 py-2.5 bg-primary-blue text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            Ayo Gabung Sekarang
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="py-10 border-t border-slate-200 bg-white text-center">
        <p className="text-sm font-black text-slate-900">Skillio - Temukan Karir Impianmu</p>
        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">© 2026 Skillio — Dibuat untuk Generasi Pembelajar Indonesia</p>
      </footer>
    </div>
  );
}
