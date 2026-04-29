"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Trophy, ArrowRight, Star, Clock,
  ChevronRight, Award, Flame, Zap, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const LearningRoom = ({ activeRoadmaps = [], completedRoadmaps = [], userName, stats }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 space-y-10">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Ruang Belajar <span className="text-skillio-600">Personal</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Halo {userName.split(' ')[0]}, lanjutkan perjalanan belajarmu hari ini.
          </p>
        </div>

        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-primary-blue to-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={18} />
          Tambah Bidang Baru
        </Link>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={14} /> Bidang Sedang Dipelajari
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {activeRoadmaps.length > 0 ? (
              activeRoadmaps.map((roadmap) => (
                <div key={roadmap.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 rounded-2xl bg-skillio-50 flex items-center justify-center text-skillio-600 shrink-0">
                      <Zap size={32} />
                    </div>

                    <div className="flex-grow space-y-4 w-full">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <h3 className="text-xl font-black text-slate-900">{roadmap.category.name}</h3>
                        <span className="text-[10px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded-md uppercase">
                          Day {roadmap.current_day} of 30
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold text-slate-400">
                          <span>Progres Kurikulum</span>
                          <span>{Math.round((roadmap.current_day / 30) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(roadmap.current_day / 30) * 100}%` }}
                            className="h-full bg-skillio-500"
                          />
                        </div>
                      </div>

                      <Link
                        href={`/belajar/${roadmap.id}`}
                        className="inline-flex items-center gap-2 text-sm font-black text-skillio-600 hover:text-skillio-700 transition-colors"
                      >
                        Lanjutkan Belajar <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm">
                    <BookOpen size={32} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900">Belum Ada Roadmap Aktif</h3>
                    <p className="text-xs text-slate-500 font-bold max-w-xs mx-auto">
                      Pilih bidang minatmu dan mulai perjalanan belajar 30 hari untuk mendapatkan sertifikat profesional pertamamu!
                    </p>
                 </div>
                 <Link
                   href="/roadmap"
                   className="mt-4 px-8 py-3 bg-skillio-600 text-white rounded-xl font-black text-sm hover:bg-skillio-700 transition-all shadow-lg shadow-skillio-500/20"
                 >
                   Mulai Belajar Sekarang
                 </Link>
              </div>
            )}
          </div>

          {}
          <div className="pt-4 space-y-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Trophy size={14} /> Riwayat Selesai
            </h2>

            {completedRoadmaps.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {completedRoadmaps.map((r) => (
                  <div key={r.id} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-emerald-500">
                        <Award size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{r.category.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400">Lulus {new Date(r.completed_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link href={`/verify/${r.id}`} className="text-[11px] font-black text-skillio-600">Sertifikat</Link>
                      <Link href={`/belajar/${r.id}`} className="text-[11px] font-black text-slate-400 hover:text-slate-900">Review</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-300 italic">Belum ada riwayat roadmap.</p>
            )}
          </div>
        </div>

        {}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-blue via-blue-600 to-blue-800 text-white shadow-xl shadow-blue-500/20 group">
            {}
            <div className="absolute inset-0 z-0">
               <motion.div
                 animate={{
                   scale: [1, 1.2, 1],
                   opacity: [0.3, 0.4, 0.3],
                   rotate: [0, 90, 0]
                 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-1/2 -left-1/4 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] blur-3xl"
               />
               <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 p-6">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-80">Statistik Belajar</h3>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flame size={18} className="text-orange-300" />
                    <span className="text-xs font-bold">Streak Harian</span>
                  </div>
                  <span className="text-lg font-black">{stats.streak} Hari</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star size={18} className="text-yellow-300" />
                    <span className="text-xs font-bold">Total Lencana</span>
                  </div>
                  <span className="text-lg font-black">{stats.badgeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy size={18} className="text-blue-200" />
                    <span className="text-xs font-bold">Roadmap Lulus</span>
                  </div>
                  <span className="text-lg font-black">{completedRoadmaps.length}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                 <p className="text-[10px] font-bold text-white/60 leading-relaxed italic text-center">
                   "Teruslah melangkah, satu hari satu keahlian baru."
                 </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6">
             <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Butuh Bantuan?</h4>
             <p className="text-xs text-slate-500 font-medium mb-4">AI Mentor kami selalu siap membantu jika Anda bingung dengan materi.</p>
             <Link href="/ai" className="text-xs font-black text-skillio-600 hover:underline">Tanya AI Mentor Sekarang</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LearningRoom;
