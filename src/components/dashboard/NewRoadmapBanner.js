"use client";

import { motion } from "framer-motion";
import { Trophy, Sparkles, BookOpen, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NewRoadmapBanner({ completedRoadmaps = [] }) {
  const lastCompleted = completedRoadmaps[0];

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-10">

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-skillio-500 to-skillio-700 rounded-[28px] flex items-center justify-center mx-auto shadow-xl shadow-skillio-500/30 mb-6">
          <Trophy size={40} className="text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Selamat, kamu sudah{" "}
          <span className="text-skillio-600">menyelesaikan</span> roadmap!
        </h1>
        {lastCompleted && (
          <p className="text-slate-500 font-medium text-lg">
            Perjalanan <strong className="text-slate-700">{lastCompleted.categoryName}</strong> sudah kamu taklukkan.
            Sekarang saatnya petualangan berikutnya! 🚀
          </p>
        )}
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {}
        <Link
          href="/roadmap"
          className="group relative flex flex-col gap-4 p-7 bg-white border-2 border-slate-100 hover:border-skillio-300 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-skillio-500/10 transition-all duration-300"
        >
          <div className="w-14 h-14 bg-skillio-50 text-skillio-600 rounded-2xl flex items-center justify-center group-hover:bg-skillio-600 group-hover:text-white transition-colors duration-300">
            <BookOpen size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-1.5">
              Pilih Roadmap Baru
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Jelajahi 50+ kategori bidang dan langsung mulai roadmap baru yang kamu pilih sendiri.
            </p>
          </div>
          <div className="flex items-center gap-2 text-skillio-600 font-black text-sm mt-auto pt-2">
            Lihat Katalog <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {}
        <Link
          href="/orientation"
          className="group relative flex flex-col gap-4 p-7 bg-white border-2 border-slate-100 hover:border-purple-300 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
        >
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
            <Sparkles size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-1.5">
              Kuis AI Lagi
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Biarkan AI Skillio mengenal kamu lebih dalam dan merekomendasikan bidang yang paling cocok berikutnya.
            </p>
          </div>
          <div className="flex items-center gap-2 text-purple-600 font-black text-sm mt-auto pt-2">
            Mulai Kuis <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </motion.div>

      {}
      {completedRoadmaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm"
        >
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            Roadmap yang sudah kamu selesaikan
          </h3>
          <div className="space-y-3">
            {completedRoadmaps.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-emerald-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-sm border border-emerald-100">
                    {r.categoryName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{r.categoryName}</p>
                    <p className="text-xs text-slate-400 font-medium">
                      Selesai {new Date(r.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/verify/${r.id}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-black rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  Sertifikat <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
