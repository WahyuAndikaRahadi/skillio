"use client";

import React, { useEffect, useState } from "react";
import { Flame, Bell, Search, Menu, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const TopBar = ({ onMenuClick }) => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ xp: 0, streak: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Gagal mengambil statistik user");
      }
    };
    if (session) fetchStats();
  }, [session]);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-light-blue fixed top-0 right-0 left-0 lg:left-72 z-30 px-6">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-dark-blue hover:bg-light-blue rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-blue/30 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari materi atau kategori..." 
              className="pl-11 pr-6 py-2.5 bg-light-blue/30 border-transparent focus:border-primary-blue focus:bg-white border-2 outline-none rounded-xl w-72 text-sm font-medium transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm transition-all duration-500",
            stats.streak > 0 
              ? "bg-orange-50 text-orange-600 border-orange-100" 
              : "bg-slate-50 text-slate-400 border-slate-100"
          )}>
            <Flame size={20} className={cn(stats.streak > 0 && "fill-orange-600")} />
            <span className="font-black text-sm">{stats.streak} Hari</span>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 text-primary-blue px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
            <Sparkles size={18} className="fill-primary-blue" />
            <span className="font-black text-sm">{stats.xp} XP</span>
          </div>

          <button className="relative p-2 text-dark-blue/60 hover:bg-light-blue rounded-xl transition-colors">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-10 w-[1px] bg-light-blue hidden md:block"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-dark-blue leading-tight truncate max-w-[120px]">
                {session?.user?.name || "Pengguna"}
              </p>
              <p className="text-[10px] font-bold text-primary-blue uppercase tracking-wider">
                {session?.user?.role === "admin" ? "Administrator" : "Anggota Basic"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-blue flex items-center justify-center text-white font-black shadow-lg shadow-primary-blue/20 overflow-hidden border-2 border-white">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                (session?.user?.name?.[0] || "P").toUpperCase()
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
