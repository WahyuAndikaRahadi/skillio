"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
  const name = badgeName?.toLowerCase() || "";
  if (name.includes("milestone") || name.includes("pencapaian")) return badgeThemes.milestone;
  if (name.includes("streak") || name.includes("konsisten")) return badgeThemes.streak;
  if (name.includes("master") || name.includes("ahli")) return badgeThemes.mastery;
  if (name.includes("dedikasi")) return badgeThemes.dedication;
  if (name.includes("excellence") || name.includes("sempurna")) return badgeThemes.excellence;
  if (name.includes("achievement") || name.includes("raih")) return badgeThemes.achievement;
  return badgeThemes.default;
};

function PublicBadgesContent() {
  const params = useParams();
  const profileId = params.id;
  const [badges, setBadges] = useState([]);
  const [userBadgeIds, setUserBadgeIds] = useState(new Set());
  const [viewedUser, setViewedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch(`/api/badges?userId=${profileId}`);
        const data = await res.json();
        if (res.ok) {
          setBadges(data.allBadges);
          setUserBadgeIds(new Set(data.earnedBadgeIds));
          setViewedUser(data.user);
        }
      } catch (err) {
        console.error("Gagal memuat lencana");
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-16 h-16 text-skillio-600 animate-spin" />
        <p className="font-black text-slate-600 text-lg uppercase tracking-widest">Membuka lemari piala...</p>
      </div>
    );
  }

  const earnedBadges = badges.filter(b => userBadgeIds.has(b.id));

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 relative z-10">
      {}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[50px] md:rounded-[70px] bg-gradient-to-br from-primary-blue to-blue-700 p-8 md:p-16 mb-20 shadow-2xl"
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Koleksi Lencana</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              Pencapaian <br />
              <span className="text-yellow-300">{viewedUser?.name || 'User'}</span>
            </h1>
            <p className="text-white/80 font-medium max-w-lg text-lg">
              Koleksi lencana prestisius yang diraih melalui dedikasi belajar di platform Skillio.
            </p>
          </div>
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <Trophy size={120} className="text-yellow-300 drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]" />
            <div className="absolute -right-2 -bottom-2 bg-white p-6 rounded-[30px] shadow-2xl border-4 border-blue-800 text-center">
               <span className="block text-3xl font-black text-slate-900">{earnedBadges.length}</span>
               <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1 block">Lencana</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      </motion.div>

      {}
      {earnedBadges.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center">
          <Trophy size={60} className="text-slate-200 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-400">Belum ada lencana yang dipajang.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {earnedBadges.map((badge, idx) => {
            const theme = getBadgeTheme(badge.name);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[40px] border-2 border-slate-100 p-8 text-center hover:shadow-2xl transition-all group relative overflow-hidden"
              >
                <div className={cn("w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center bg-gradient-to-br", theme.gradient)}>
                   <img src={badge.image_url} alt={badge.name} className="w-16 h-16 object-contain" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{badge.name}</h3>
                <p className="text-sm text-slate-500 font-medium">{badge.description}</p>
                <div className="mt-6 pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500">Terverifikasi</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PublicBadgesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-blue" /></div>}>
      <PublicBadgesContent />
    </Suspense>
  );
}
