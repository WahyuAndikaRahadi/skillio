"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Settings, 
  LogOut, 
  Award, 
  Map as MapIcon, 
  ChevronRight,
  ShieldCheck,
  Edit3,
  Mail,
  Calendar,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UploadButton } from "@/lib/uploadthing";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ xp: 0, streak: 0, badges: [], roadmapsCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchProfileData();
  }, [session]);

  const joinedDate = stats?.joinedAt 
    ? new Date(stats.joinedAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : "April 2024";

  const level = Math.floor(stats.xp / 500) + 1;
  const xpToNextLevel = 500 - (stats.xp % 500);
  const progressPercent = ((stats.xp % 500) / 500) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-10">
      {/* Header / Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-dark-blue to-primary-blue rounded-[48px] p-8 md:p-12 overflow-hidden shadow-2xl shadow-primary-blue/20"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-blue/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] bg-white p-1.5 shadow-2xl">
              <div className="w-full h-full rounded-[34px] overflow-hidden bg-slate-100 flex items-center justify-center border-4 border-slate-50">
                {session?.user?.image ? (
                  <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl font-black text-primary-blue">
                    {session?.user?.name?.[0]?.toUpperCase() || "S"}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl shadow-xl hover:scale-105 transition-transform overflow-hidden group/upload flex items-center justify-center w-12 h-12">
               <div className="absolute inset-0 flex items-center justify-center text-primary-blue pointer-events-none">
                 <Edit3 size={20} />
               </div>
               <div className="opacity-0 w-[200%] h-[200%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center scale-[3]">
                 <UploadButton
                   endpoint="imageUploader"
                   onClientUploadComplete={async (res) => {
                     if (res && res[0]) {
                       const newUrl = res[0].url;
                       await fetch("/api/user/update-image", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ imageUrl: newUrl })
                       });
                       window.location.reload();
                     }
                   }}
                 />
               </div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left text-white">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl md:text-5xl font-black">{session?.user?.name || "Pengguna Skillio"}</h1>
              {session?.user?.role === "admin" && (
                <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest border border-white/20">Admin</span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/70 font-bold mb-8">
               <span className="flex items-center gap-1.5 text-sm md:text-base"><Mail size={16}/> {session?.user?.email}</span>
               <span className="flex items-center gap-1.5 text-sm md:text-base"><Calendar size={16}/> Bergabung {joinedDate}</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <button className="px-8 py-3.5 bg-white text-primary-blue rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Share2 size={20} /> Bagikan Profil
               </button>
               <button 
                 onClick={() => signOut()}
                 className="px-8 py-3.5 bg-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/20 backdrop-blur-md transition-all flex items-center gap-2 border border-white/10"
               >
                  <LogOut size={20} /> Keluar
               </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Progress & Stats Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[40px] border-2 border-light-blue shadow-xl shadow-primary-blue/5">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-blue-50 text-primary-blue rounded-2xl">
                     <Sparkles size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total XP</p>
                    <h3 className="text-2xl font-black text-dark-blue">{stats.xp}</h3>
                  </div>
               </div>
               <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-primary-blue rounded-full shadow-[0_0_10px_rgba(43,110,166,0.5)]"
                  />
               </div>
               <p className="text-[10px] font-bold text-slate-400 mt-3 text-right">
                 {xpToNextLevel} XP lagi untuk Level {level + 1}
               </p>
            </div>

            <div className="bg-white p-8 rounded-[40px] border-2 border-light-blue shadow-xl shadow-primary-blue/5">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl">
                     <Flame size={24} className="fill-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Streak</p>
                    <h3 className="text-2xl font-black text-dark-blue">{stats.streak} Hari</h3>
                  </div>
               </div>
               <p className="text-[10px] font-bold text-slate-400 mt-4 leading-relaxed">
                  Pertahankan api belajarmu! 🔥
               </p>
            </div>

            <div className="bg-white p-8 rounded-[40px] border-2 border-light-blue shadow-xl shadow-primary-blue/5">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-green-50 text-green-500 rounded-2xl">
                     <Trophy size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Level</p>
                    <h3 className="text-2xl font-black text-dark-blue">{level}</h3>
                  </div>
               </div>
               <p className="text-[10px] font-bold text-slate-400 mt-4 leading-relaxed">
                  Peringkat Global: <Link href="/scoreboard" className="text-primary-blue hover:underline font-black">#{stats.rank || "-"}</Link>
               </p>
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-white rounded-[40px] border-2 border-light-blue p-8 md:p-10 shadow-xl shadow-primary-blue/5">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-dark-blue flex items-center gap-3">
                   <MapIcon className="text-primary-blue" /> Roadmap Selesai
                </h2>
                <span className="text-primary-blue font-black text-lg">{stats.roadmapsCount} Roadmap</span>
             </div>

             {stats.roadmapsCount === 0 ? (
               <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="font-bold text-slate-400">Belum ada roadmap yang selesai.</p>
                  <Link href="/roadmap" className="text-primary-blue font-black mt-2 inline-block hover:underline">
                    Mulai petualanganmu sekarang →
                  </Link>
               </div>
             ) : (
               <div className="space-y-4">
                  {stats.completedRoadmaps?.map((roadmap) => (
                    <Link 
                      key={roadmap.id}
                      href={`/verify/${roadmap.id}`}
                      className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-primary-blue/20 transition-all group"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-blue/20 uppercase">
                            {roadmap.categoryName.slice(0, 2)}
                          </div>
                          <div>
                             <h4 className="font-black text-dark-blue">{roadmap.categoryName}</h4>
                             <p className="text-xs font-bold text-slate-400">
                               Diselesaikan pada {new Date(roadmap.completedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 text-primary-blue font-black text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                         Lihat Sertifikat <ChevronRight size={18} />
                       </div>
                    </Link>
                  ))}
               </div>
             )}
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-[40px] border-2 border-light-blue p-8 md:p-10 shadow-xl shadow-primary-blue/5">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-dark-blue flex items-center gap-3">
                   <Award className="text-orange-500" /> Koleksi Lencana
                </h2>
             </div>

             {!stats.badges || stats.badges.length === 0 ? (
               <div className="text-center py-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                     <Award className="text-slate-300" size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-400">Selesaikan misi pertama Anda untuk mendapatkan lencana!</p>
               </div>
             ) : (
               <div className="grid grid-cols-2 gap-4">
                  {stats.badges.map((badge, idx) => {
                    const isEmoji = !badge.image_url?.includes('.') && !badge.image_url?.includes('/');
                    return (
                      <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className={cn(
                          "p-4 rounded-3xl border transition-all flex flex-col items-center text-center group",
                          badge.earned 
                            ? "bg-white border-primary-blue/20 shadow-lg shadow-primary-blue/5" 
                            : "bg-slate-50 border-slate-100 opacity-60 grayscale"
                        )}
                      >
                         <div className={cn(
                           "w-16 h-16 mb-3 rounded-2xl flex items-center justify-center text-3xl",
                           badge.earned ? "bg-white shadow-md" : "bg-slate-100"
                         )}>
                            {isEmoji ? (
                              <span>{badge.image_url}</span>
                            ) : (
                              <img src={badge.image_url} alt={badge.name} className="w-12 h-12 object-contain" />
                            )}
                         </div>
                         <h4 className="text-xs font-black text-dark-blue leading-tight mb-1">
                           {badge.name}
                         </h4>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                           {badge.earned 
                             ? new Date(badge.earned_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })
                             : "Belum Diraih"}
                         </p>
                      </motion.div>
                    );
                  })}
               </div>
             )}
          </div>

          <div className="bg-white rounded-[40px] border-2 border-light-blue p-8 md:p-10 shadow-xl shadow-primary-blue/5">
             <h3 className="text-xl font-black text-dark-blue mb-6">Informasi Akun</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <ShieldCheck size={18} />
                      </div>
                      <span className="text-sm font-bold text-dark-blue">Email Terverifikasi</span>
                   </div>
                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-blue/10 text-primary-blue rounded-lg">
                        <Sparkles size={18} />
                      </div>
                      <span className="text-sm font-bold text-dark-blue">Tipe Keanggotaan</span>
                   </div>
                   <span className="text-xs font-black text-primary-blue uppercase tracking-widest">{session?.user?.role === "admin" ? "Premium Admin" : "Basic Member"}</span>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
