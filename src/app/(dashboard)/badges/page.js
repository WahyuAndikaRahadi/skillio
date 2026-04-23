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
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
        <Loader2 className="w-12 h-12 text-primary-blue animate-spin" />
        <p className="font-bold text-dark-blue/40">Membuka lemari piala Anda...</p>
      </div>
    );
  }

  const earnedCount = userBadgeIds.size;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary-blue to-dark-blue rounded-[48px] p-10 md:p-16 mb-12 text-white relative overflow-hidden shadow-2xl shadow-primary-blue/20">
         <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         
         <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
               <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-white/20">
                  <Trophy size={14} /> Pencapaian Karier
               </span>
               <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">Lemari Lencana</h1>
               <p className="text-lg text-white/70 font-medium max-w-lg">
                 Kumpulkan lencana prestisius dengan menyelesaikan misi dan tantangan. Setiap lencana adalah bukti nyata dedikasi Anda.
               </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-8 text-center min-w-[200px]">
               <h3 className="text-5xl font-black mb-1">{earnedCount}</h3>
               <p className="text-sm font-bold text-white/60 uppercase tracking-widest">Lencana Didapat</p>
               <div className="mt-4 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={16} className={cn(i <= earnedCount ? "text-yellow-400 fill-yellow-400" : "text-white/20")} />
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {badges.map((badge, idx) => {
          const isEarned = userBadgeIds.has(badge.id);
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className={cn(
                "group relative bg-white rounded-[40px] border-2 p-8 transition-all overflow-hidden",
                isEarned 
                  ? "border-primary-blue/20 shadow-xl shadow-primary-blue/5" 
                  : "border-slate-100 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
              )}
            >
              {/* Badge Icon */}
              <div className="relative mb-8 flex justify-center">
                 <div className={cn(
                   "w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-500",
                   isEarned ? "bg-primary-blue/5 shadow-inner" : "bg-slate-50"
                 )}>
                    <img 
                      src={badge.image_url} 
                      alt={badge.name} 
                      className={cn(
                        "w-20 h-20 object-contain transition-transform duration-500",
                        isEarned ? "group-hover:scale-110 drop-shadow-xl" : "opacity-40"
                      )} 
                    />
                 </div>
                 
                 {isEarned && (
                   <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg border-4 border-white">
                      <CheckCircle2 size={16} />
                   </div>
                 )}
              </div>

              {/* Text Info */}
              <div className="text-center">
                 <h3 className={cn(
                   "text-xl font-black mb-2",
                   isEarned ? "text-dark-blue" : "text-slate-400"
                 )}>
                   {badge.name}
                 </h3>
                 <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                   {badge.description}
                 </p>

                 {isEarned ? (
                   <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-primary-blue rounded-2xl font-black text-sm hover:bg-primary-blue hover:text-white transition-all">
                      <Share2 size={16} /> Bagikan Pencapaian
                   </button>
                 ) : (
                   <div className="flex items-center justify-center gap-2 py-3 text-slate-300 font-black text-sm border-2 border-dashed border-slate-100 rounded-2xl">
                      <Lock size={16} /> Belum Terbuka
                   </div>
                 )}
              </div>

              {/* Background Decoration */}
              {isEarned && (
                <div className="absolute -bottom-4 -right-4 text-primary-blue/5 rotate-12 group-hover:scale-125 transition-transform duration-700">
                   <Sparkles size={120} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
