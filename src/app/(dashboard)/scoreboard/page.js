import React from "react";
import prisma from "@/lib/prisma";
import { Trophy, Medal, Star, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ScoreboardPage() {
  // Fetch Top 10 users by XP
  const topUsers = await prisma.user.findMany({
    where: {
      role: {
        not: "admin"
      }
    },
    orderBy: { xp: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      image: true,
      xp: true,
      role: true,
      streak: true,
    }
  });

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300 text-yellow-700 shadow-yellow-200/50";
      case 1:
        return "bg-gradient-to-r from-slate-100 to-slate-50 border-slate-300 text-slate-700 shadow-slate-200/50";
      case 2:
        return "bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300 text-orange-800 shadow-orange-200/50";
      default:
        return "bg-white border-slate-100 text-dark-blue hover:bg-slate-50";
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Medal className="text-yellow-500 w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />;
      case 1:
        return <Medal className="text-slate-400 w-7 h-7 md:w-8 md:h-8 drop-shadow-md" />;
      case 2:
        return <Medal className="text-orange-500 w-6 h-6 md:w-7 md:h-7 drop-shadow-md" />;
      default:
        return <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center font-black text-slate-400 text-lg">#{index + 1}</div>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary-blue to-dark-blue rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-primary-blue/20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-blue/20 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/20 mb-6">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-sm font-bold tracking-wider uppercase text-white">Top 10 Global</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Papan Skor Skillio</h1>
            <p className="text-blue-100 font-medium md:text-lg max-w-xl leading-relaxed">
              Daftar pengguna dengan dedikasi tertinggi. Terus kumpulkan XP dari kuis dan tantangan harian untuk naik ke puncak!
            </p>
          </div>
          
          <div className="hidden lg:flex w-40 h-40 bg-white/10 backdrop-blur-sm rounded-full items-center justify-center border-4 border-white/20 shadow-2xl">
            <Trophy className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-dark-blue flex items-center gap-2">
            <TrendingUp className="text-primary-blue" /> Peringkat Saat Ini
          </h2>
          <div className="text-sm font-bold text-slate-400">XP Tertinggi</div>
        </div>

        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div 
              key={user.id}
              className={cn(
                "flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 transition-all duration-300",
                index < 3 ? "shadow-lg scale-[1.02] md:scale-100 md:hover:scale-[1.01]" : "",
                getRankStyle(index)
              )}
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center justify-center w-8 md:w-12">
                  {getRankIcon(index)}
                </div>
                
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black shadow-inner overflow-hidden shrink-0 border-2 border-white">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    (user.name?.[0] || "U").toUpperCase()
                  )}
                </div>

                <div>
                  <h3 className="font-black text-base md:text-lg tracking-tight flex items-center gap-2">
                    {user.name || "Pengguna Anonim"}
                    {index === 0 && <Sparkles size={16} className="text-yellow-500" />}
                  </h3>
                  <p className={cn(
                    "text-xs md:text-sm font-bold opacity-80 uppercase tracking-widest",
                    index < 3 ? "opacity-100" : "text-slate-400"
                  )}>
                    Member
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className={cn(
                  "font-black text-lg md:text-2xl tracking-tighter flex items-center gap-1",
                  index === 0 ? "text-yellow-600" :
                  index === 1 ? "text-slate-600" :
                  index === 2 ? "text-orange-600" :
                  "text-primary-blue"
                )}>
                  {user.xp} <span className="text-xs md:text-sm opacity-60">XP</span>
                </div>
              </div>
            </div>
          ))}

          {topUsers.length === 0 && (
            <div className="text-center py-12 text-slate-400 font-medium">
              Belum ada data pengguna. Jadilah yang pertama mendapatkan XP!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
