"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
  const [badges, setBadges] = useState([]);
  const [userBadgeIds, setUserBadgeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch("/api/badges");
        const data = await res.json();
        if (res.ok) {
          setBadges(data.allBadges);
          setUserBadgeIds(new Set(data.earnedBadgeIds));
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
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[48px] md:rounded-[56px] mb-16 md:mb-20"
        >
          {/* Multi-layer gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-skillio-900 via-skillio-700 to-blue-800" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

          <div className="relative p-10 md:p-16 lg:p-20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex-1 text-center lg:text-left"
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-white/30"
                >
                  <Trophy size={14} />
                  Pencapaian Karier
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]"
                >
                  Lemari <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">Lencana</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-lg md:text-xl text-white/80 font-semibold max-w-lg leading-relaxed"
                >
                  Kumpulkan lencana prestisius dengan menyelesaikan misi dan tantangan. Setiap lencana adalah bukti nyata dedikasi dan kerja keras Anda.
                </motion.p>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-10 text-center w-full lg:w-auto shadow-2xl shadow-black/10"
              >
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-6xl md:text-7xl font-black mb-2 text-transparent bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text"
                >
                  {earnedCount}
                </motion.h3>
                <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6">Lencana Didapat</p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center gap-2"
                >
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 120 }}
                      whileHover={{ scale: 1.2, rotate: 12 }}
                    >
                      <Star
                        size={20}
                        className={cn(
                          i <= earnedCount ? "text-yellow-300 fill-yellow-300 drop-shadow-lg" : "text-white/20"
                        )}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Separate Earned and Locked Badges */}
        {(() => {
          const earnedBadges = badges.filter(b => userBadgeIds.has(b.id));
          const lockedBadges = badges.filter(b => !userBadgeIds.has(b.id));

          return (
            <>
              {/* Earned Badges - Featured Section */}
              {earnedBadges.length > 0 && (
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

              {/* Locked Badges - Aspirational Section */}
              {lockedBadges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-3xl md:text-4xl font-black text-slate-900 mb-12 flex items-center gap-3"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 text-white">
                      🔒
                    </span>
                    Misi Berikutnya
                  </motion.h2>

                  {/* Locked Badges - Compact Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {lockedBadges.map((badge, idx) => {
                      const theme = getBadgeTheme(badge.name);

                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ delay: idx * 0.04, duration: 0.4 }}
                          whileHover={{ y: -4, scale: 1.01 }}
                          className="group relative bg-white rounded-[24px] md:rounded-[32px] border-2 border-slate-200 p-4 md:p-6 transition-all overflow-hidden hover:border-slate-300 hover:shadow-lg hover:shadow-slate-300/20"
                        >
                          <div className="relative z-10 flex flex-col items-center text-center h-full">
                            {/* Icon Badge */}
                            <motion.div
                              initial={{ scale: 0, rotate: -90 }}
                              whileInView={{ scale: 1, rotate: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.04 + 0.1, type: "spring", stiffness: 120 }}
                              className="relative mb-4 flex justify-center"
                            >
                              <div className={cn(
                                `w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 shadow-md grayscale group-hover:grayscale-0`,
                                `bg-gradient-to-br ${theme.lightGradient} ${theme.accent}`
                              )}>
                                <img
                                  src={badge.image_url}
                                  alt={badge.name}
                                  className="w-12 h-12 md:w-16 md:h-16 object-contain opacity-50 group-hover:opacity-100 transition-opacity"
                                />
                              </div>

                              <motion.div
                                className="absolute -top-1 -right-1 bg-slate-500 text-white p-1 rounded-full shadow-md"
                              >
                                <Lock size={14} />
                              </motion.div>
                            </motion.div>

                            {/* Text Content */}
                            <motion.h3
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.04 + 0.15 }}
                              className="text-sm md:text-base font-black text-slate-700 mb-2 leading-tight"
                            >
                              {badge.name}
                            </motion.h3>
                            <motion.p
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.04 + 0.2 }}
                              className="text-xs md:text-sm font-medium text-slate-500 leading-relaxed mb-3"
                            >
                              {badge.description}
                            </motion.p>

                            {/* Locked Indicator */}
                            <div className="flex items-center justify-center gap-1.5 py-2 text-slate-400 font-black text-xs border-t border-slate-100 mt-auto pt-3 w-full">
                              <Lock size={12} /> Belum Terbuka
                            </div>
                          </div>
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
