"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Home, 
  LayoutDashboard,
  AlertCircle
} from "lucide-react";

export default function ErrorPage({ code = "404", title = "Halaman Tidak Ditemukan", message = "Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan." }) {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-white" />;
  }

  const is404 = code === "404";
  const is403 = code === "403";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] h-[1000px] w-[1000px] rounded-full bg-skillio-100/30 blur-[150px] -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[1000px] w-[1000px] rounded-full bg-teal-50/40 blur-[150px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl w-full text-center relative z-10 pt-20 md:pt-32"
      >
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-8 border shadow-sm ${
              is404 ? "bg-amber-50 text-amber-600 border-amber-100" : 
              is403 ? "bg-orange-50 text-orange-600 border-orange-100" : 
              "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            <AlertCircle size={14} /> 
            {is404 ? "Navigation Error" : is403 ? "Security Alert" : "System Error"}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl md:text-4xl font-display font-black text-slate-950 tracking-tight mb-8"
          >
            {title}
          </motion.h2>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-[8rem] md:text-[14rem] font-display font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-400/30 to-slate-200/20 select-none tracking-tighter mb-12"
          >
            {code}
          </motion.div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-500 mb-14 max-w-xl mx-auto font-medium leading-relaxed px-4"
        >
          {message}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4"
        >
          <Link
            href={session ? "/dashboard" : "/"}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-slate-950 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-950/20 active:scale-[0.98]"
          >
            {session ? (
              <>
                <LayoutDashboard size={22} />
                Ke Dashboard
              </>
            ) : (
              <>
                <Home size={22} />
                Ke Beranda
              </>
            )}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-[0.98] border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={22} />
            Kembali
          </button>
        </motion.div>

      </motion.div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] -z-20" 
           style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
    </div>
  );
}


