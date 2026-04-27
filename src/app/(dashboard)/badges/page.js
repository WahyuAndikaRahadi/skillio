"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Award,
  Lock,
  Sparkles,
  Trophy,
  Star,
  CheckCircle2,
  Share2,
  Loader2,
  Zap,
  Flame,
  Crown,
  Target,
  Gem,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

// Badge category themes with icons
const badgeThemes = {
  milestone: { icon: Trophy, gradient: "from-amber-600 to-orange-500", lightGradient: "from-amber-50 to-orange-50", accent: "text-amber-600", bgAccent: "bg-amber-100" },
  streak: { icon: Flame, gradient: "from-red-600 to-rose-500", lightGradient: "from-red-50 to-rose-50", accent: "text-red-600", bgAccent: "bg-red-100" },
  achievement: { icon: Crown, gradient: "from-purple-600 to-pink-500", lightGradient: "from-purple-50 to-pink-50", accent: "text-purple-600", bgAccent: "bg-purple-100" },
  mastery: { icon: Gem, gradient: "from-cyan-600 to-blue-500", lightGradient: "from-cyan-50 to-blue-50", accent: "text-cyan-600", bgAccent: "bg-cyan-100" },
  dedication: { icon: Heart, gradient: "from-rose-600 to-pink-500", lightGradient: "from-rose-50 to-pink-50", accent: "text-rose-600", bgAccent: "bg-rose-100" },
  excellence: { icon: Star, gradient: "from-yellow-600 to-amber-500", lightGradient: "from-yellow-50 to-amber-50", accent: "text-yellow-600", bgAccent: "bg-yellow-100" },
  default: { icon: Zap, gradient: "from-skillio-500 to-blue-600", lightGradient: "from-skillio-50 to-blue-50", accent: "text-skillio-600", bgAccent: "bg-skillio-100" },
};

const getBadgeTheme = (badgeName) => {
  const name = badgeName.toLowerCase();
  if (name.includes("milestone") || name.includes("pencapaian")) return badgeThemes.milestone;
  if (name.includes("streak") || name.includes("konsisten")) return badgeThemes.streak;
  if (name.includes("master") || name.includes("ahli")) return badgeThemes.mastery;
  if (name.includes("dedikasi")) return badgeThemes.dedication;
  if (name.includes("excellence") || name.includes("sempurna")) return badgeThemes.excellence;
  if (name.includes("achievement") || name.includes("raih")) return badgeThemes.achievement;
  return badgeThemes.default;
};

export default function BadgesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [badges, setBadges] = useState([]);
  const [userBadgeIds, setUserBadgeIds] = useState(new Set());
  const [activeRoadmapId, setActiveRoadmapId] = useState(null);
  const [completedRoadmaps, setCompletedRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lencana"); // lencana, misi, sertifikat


  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch("/api/badges");
        const data = await res.json();
        if (res.ok) {
          setBadges(data.allBadges);
          setUserBadgeIds(new Set(data.earnedBadgeIds));
          setCompletedRoadmaps(data.completedRoadmaps || []);
          setActiveRoadmapId(data.activeRoadmapId);
        }

      } catch (err) {
        console.error("Gagal memuat lencana");
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchBadges();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-16 h-16 text-skillio-600" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-black text-slate-600 text-lg"
        >
          Membuka lemari piala Anda...
        </motion.p>
      </div>
    );
  }

  const earnedCount = userBadgeIds.size;

  return (
    <div className="relative min-h-screen">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 md:px-10 relative z-10">
        {/* Header Section - The "Showroom" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group mb-20 md:mb-28"
        >
          {/* Main Card */}
          <div className="relative overflow-hidden rounded-[50px] md:rounded-[70px] bg-gradient-to-br from-primary-blue to-blue-700 border border-blue-400/30 shadow-[0_20px_50px_rgba(59,130,246,0.3)]">
            
            {/* Immersive Animated Background */}
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-gradient-to-br from-primary-blue via-blue-600 to-blue-800" />
               <motion.div 
                 animate={{ 
                   scale: [1, 1.2, 1],
                   opacity: [0.3, 0.5, 0.3],
                   rotate: [0, 90, 0]
                 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-1/2 -left-1/4 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)] blur-3xl" 
               />
               <motion.div 
                 animate={{ 
                   scale: [1, 1.5, 1],
                   opacity: [0.2, 0.4, 0.2],
                   rotate: [0, -90, 0]
                 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] blur-3xl" 
               />
               
               {/* Pattern overlay */}
               <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 p-8 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
              
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-2xl border border-white/20 px-5 py-2 rounded-full"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Pencapaian Karier</span>
                </motion.div>

                <div className="space-y-3">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter"
                  >
                    Lemari <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-[length:200%_auto] animate-gradient-x drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      Lencana
                    </span>
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-base md:text-lg text-white/80 font-medium max-w-lg leading-relaxed"
                  >
                    Kumpulkan lencana prestisius dengan menyelesaikan misi dan tantangan. Setiap lencana adalah bukti nyata dedikasi dan kerja keras Anda.
                  </motion.p>
                </div>


                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.6 }}
                   className="pt-4"
                >
                   <button 
                     onClick={() => setActiveTab("misi")}
                     className="px-6 py-3.5 bg-white text-blue-700 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                   >
                     Lihat Semua Misi
                   </button>
                </motion.div>
              </div>


              {/* Right Content - Visual Showcase */}
              <div className="relative shrink-0">
                {/* Floating Elements Container */}
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                   {/* Main Trophy Icon (Central) */}
                   <motion.div
                     animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                     transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute inset-0 flex items-center justify-center z-20"
                   >
                     <div className="relative">
                        <div className="absolute inset-0 bg-amber-400/20 blur-[60px] rounded-full" />
                        <Trophy size={120} className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]" />
                     </div>
                   </motion.div>

                   {/* Orbital Icons */}
                   {[
                     { Icon: Star, color: "text-yellow-400", pos: "top-0 left-0", delay: 0 },
                     { Icon: Gem, color: "text-cyan-400", pos: "top-8 right-0", delay: 1 },
                     { Icon: Crown, color: "text-purple-400", pos: "bottom-8 left-8", delay: 2 },
                     { Icon: Sparkles, color: "text-pink-400", pos: "bottom-0 right-8", delay: 1.5 },
                   ].map((item, i) => (
                     <motion.div
                       key={i}
                       animate={{ 
                         y: [0, -10, 0],
                         rotate: [0, 10, 0],
                         scale: [1, 1.1, 1]
                       }}
                       transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                       className={`absolute ${item.pos} z-30 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl`}
                     >
                       <item.Icon className={item.color} size={22} />
                     </motion.div>
                   ))}

                   {/* Total Count Bubble */}
                   <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ delay: 0.8, type: "spring" }}
                     className="absolute -right-2 -bottom-2 z-40 bg-white p-6 rounded-[30px] shadow-2xl border-4 border-blue-800 text-center"
                   >
                      <span className="block text-3xl font-black text-[#0F172A] leading-none">{earnedCount}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1 block">Lencana</span>
                   </motion.div>
                </div>
              </div>

            </div>
          </div>

          {/* Decorative floating shapes outside card */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>


        {/* Tabs Navigation */}
        <div className="flex justify-center mb-16">
          <div className="bg-slate-100/50 backdrop-blur-md p-1.5 rounded-3xl flex gap-1 border border-slate-200">
            {[
              { id: "lencana", label: "Koleksi Lencana", icon: Trophy },
              { id: "misi", label: "Misi Aktif", icon: Target },
              { id: "sertifikat", label: "Sertifikat Karier", icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3 rounded-[20px] text-sm font-black transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-primary-blue shadow-lg shadow-blue-500/10" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {(() => {
          if (activeTab === "misi") {
            const lockedBadges = badges.filter(b => !userBadgeIds.has(b.id));
            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                   <div>
                     <h2 className="text-3xl font-black text-slate-900">Misi Tantangan</h2>
                     <p className="text-slate-500 font-medium mt-1">Selesaikan misi ini untuk membuka lencana baru!</p>
                   </div>
                   <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 flex items-center gap-2">
                     <Target className="text-primary-blue" size={20} />
                     <span className="text-sm font-black text-primary-blue">{lockedBadges.length} Misi Tersedia</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {lockedBadges.map((badge, idx) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border-2 border-slate-100 rounded-[32px] p-6 flex gap-6 hover:border-primary-blue/30 transition-all group"
                    >
                      <div className="w-24 h-24 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                        <img src={badge.image_url} alt={badge.name} className="w-16 h-16 object-contain opacity-40 group-hover:opacity-100" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-slate-900 mb-2">{badge.name}</h3>
                        <p className="text-sm text-slate-500 font-medium mb-4 leading-relaxed">{badge.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress: 0%</span>
                          <button 
                            onClick={() => {
                              if (badge.requirement?.type === "roadmaps_completed" || !activeRoadmapId) {
                                router.push("/roadmap");
                              } else {
                                router.push(`/belajar/${activeRoadmapId}`);
                              }
                            }}
                            className="text-xs font-black text-primary-blue bg-blue-50 px-4 py-2 rounded-xl hover:bg-primary-blue hover:text-white transition-all"
                          >
                            Jalankan Misi
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          }

          if (activeTab === "sertifikat") {
            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="text-center max-w-2xl mx-auto mb-16">
                   <h2 className="text-4xl font-black text-slate-900 mb-4">Sertifikat Kelulusan</h2>
                   <p className="text-slate-500 font-medium">Sertifikat resmi yang membuktikan penguasaanmu dalam bidang tertentu setelah menyelesaikan roadmap 30 hari.</p>
                </div>

                {completedRoadmaps.length === 0 ? (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Award size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-400 mb-2">Belum Ada Sertifikat</h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto">Selesaikan 30 hari belajarmu untuk mendapatkan sertifikat profesional pertamamu!</p>
                    <button 
                      onClick={() => router.push("/roadmap")}
                      className="mt-8 px-8 py-3.5 bg-primary-blue text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20"
                    >
                      Mulai Belajar Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {completedRoadmaps.map((cert) => (
                      <motion.div
                        key={cert.id}
                        className="group relative bg-white border-2 border-slate-200 rounded-[40px] overflow-hidden hover:border-primary-blue transition-all"
                      >
                        <div className="p-1.5 h-48 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                           <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
                           <div className="relative h-full flex items-center justify-center">
                             <Award size={80} className="text-white/20 absolute rotate-12 -right-4 -bottom-4" />
                             <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center">
                               {cert.category.icon ? (
                                 <img src={cert.category.icon} className="w-12 h-12 object-contain" />
                               ) : (
                                 <Award size={40} className="text-white" />
                               )}
                             </div>
                           </div>
                        </div>
                        <div className="p-8">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2 block">Professional Certificate</span>
                           <h3 className="text-2xl font-black text-slate-900 mb-2">{cert.roadmap.title}</h3>
                           <p className="text-sm text-slate-500 font-medium mb-6">Lulus pada {new Date(cert.completed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                           <div className="flex gap-3">
                              <button className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                <Award size={16} /> Lihat Detail
                              </button>
                              <button className="w-14 h-14 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-blue hover:border-primary-blue transition-all">
                                <Share2 size={20} />
                              </button>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          }

          // Default: Lencana
          const earnedBadges = badges.filter(b => userBadgeIds.has(b.id));
          const lockedBadges = badges.filter(b => !userBadgeIds.has(b.id));
          return (
            <>
              {/* Earned Badges - Featured Section */}


              {earnedBadges.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center mb-24"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Trophy size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-400 mb-2">Koleksi Lencana Kosong</h3>
                  <p className="text-slate-400 font-medium max-w-sm mx-auto mb-8">Anda belum memiliki lencana. Selesaikan misi pertama Anda untuk memajang lencana prestisius di sini!</p>
                  <button 
                    onClick={() => setActiveTab("misi")}
                    className="px-8 py-3.5 bg-primary-blue text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                  >
                    Lihat Misi Tersedia
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mb-24"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl md:text-4xl font-black text-slate-900 mb-12 flex items-center gap-3"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                      ✨
                    </span>
                    Pencapaianmu
                  </motion.h2>

                  {/* Bento Grid Layout - Earned Badges */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max">
                    {earnedBadges.map((badge, idx) => {
                      const theme = getBadgeTheme(badge.name);

                      // Create varied sizes using col-span
                      const isLarge = idx === 0 || idx === 1;
                      const colSpan = isLarge ? "md:col-span-2 lg:col-span-2" : "md:col-span-1 lg:col-span-1";
                      const rowSpan = isLarge ? "md:row-span-2" : "";

                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ delay: idx * 0.08, duration: 0.4 }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className={cn(
                            "group relative bg-white rounded-[32px] md:rounded-[40px] border-2 border-skillio-200 p-6 md:p-8 transition-all overflow-hidden shadow-xl shadow-skillio-600/10 hover:shadow-2xl hover:shadow-skillio-600/20 h-full flex flex-col",
                            colSpan,
                            rowSpan
                          )}
                        >
                          {/* Background overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${theme.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                          
                          {/* Premium Glint Effect */}
                          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                            <motion.div
                              animate={{ 
                                x: ["-100%", "200%"],
                                opacity: [0, 0.5, 0] 
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                repeatDelay: 4,
                                ease: "easeInOut" 
                              }}
                              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                            />
                          </div>



                          <div className="relative z-10 flex flex-col h-full">
                            {/* Icon Badge - Larger for featured */}
                            <motion.div
                              initial={{ scale: 0, rotate: -90 }}
                              whileInView={{ scale: 1, rotate: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.08 + 0.1, type: "spring", stiffness: 120 }}
                              className="relative mb-6 flex justify-center"
                            >
                              <div className={cn(
                                `rounded-3xl flex items-center justify-center transition-all duration-500 shadow-lg`,
                                isLarge ? "w-32 h-32 md:w-40 md:h-40" : "w-24 h-24 md:w-28 md:h-28",
                                `bg-gradient-to-br ${theme.gradient} text-white`
                              )}>
                                <img
                                  src={badge.image_url}
                                  alt={badge.name}
                                  className={cn(
                                    "object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-lg",
                                    isLarge ? "w-24 h-24 md:w-32 md:h-32" : "w-16 h-16 md:w-20 md:h-20"
                                  )}
                                />
                              </div>

                              <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 + 0.2, type: "spring" }}
                                className="absolute -top-2 -right-2 bg-gradient-to-br from-green-400 to-emerald-500 text-white p-2 rounded-full shadow-lg border-4 border-white"
                              >
                                <CheckCircle2 size={20} />
                              </motion.div>
                            </motion.div>

                            {/* Text Content */}
                            <div className="flex-1 mb-6">
                              <motion.h3
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 + 0.15 }}
                                className={cn(
                                  "font-black mb-3",
                                  isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                                )}
                              >
                                {badge.name}
                              </motion.h3>
                              <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 + 0.2 }}
                                className="text-sm md:text-base font-semibold text-slate-600 leading-relaxed"
                              >
                                {badge.description}
                              </motion.p>
                            </div>

                            {/* Share Button */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                const shareUrl = `${window.location.origin}/profile/${session?.user?.id || ''}`;
                                const shareData = {
                                  title: `Saya meraih lencana ${badge.name}!`,
                                  text: `Lihat pencapaian saya di Skillio: ${badge.description}`,
                                  url: shareUrl,
                                };

                                if (navigator.share) {
                                  navigator.share(shareData).catch(() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    Swal.fire({
                                      toast: true,
                                      position: 'top-end',
                                      icon: 'success',
                                      title: 'Link disalin!',
                                      showConfirmButton: false,
                                      timer: 2000,
                                      customClass: {
                                        popup: 'rounded-2xl'
                                      }
                                    });
                                  });
                                } else {
                                  navigator.clipboard.writeText(shareUrl);
                                  Swal.fire({
                                    toast: true,
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Link disalin!',
                                    showConfirmButton: false,
                                    timer: 2000,
                                    customClass: {
                                      popup: 'rounded-2xl'
                                    }
                                  });
                                }
                              }}
                              className={cn(
                                "w-full flex items-center justify-center gap-2 py-3 md:py-3.5 font-black rounded-2xl transition-all",
                                "bg-gradient-to-r from-skillio-600 to-skillio-500 text-white hover:shadow-lg hover:shadow-skillio-600/30",
                                isLarge ? "text-base" : "text-sm"
                              )}
                            >
                              <Share2 size={16} /> Bagikan
                            </motion.button>
                          </div>

                          {/* Background Decoration */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-12 -right-12 text-skillio-500/10 group-hover:text-skillio-500/20 transition-colors pointer-events-none"
                          >
                            <Sparkles size={180} />
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

            </>
          );
        })()}
      </div>
    </div>
  );
}
