"use client";

import React, { useEffect, useState, useRef } from "react";
import { Flame, Bell, Search, Menu, Sparkles, Check, CheckCircle2, Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TopBar = ({ onMenuClick }) => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ xp: 0, streak: 0 });
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

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

    const fetchNotifs = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (Array.isArray(data)) setNotifications(data);
      } catch (err) {
        console.error("Gagal mengambil notifikasi");
      }
    };

    if (session) {
      fetchStats();
      fetchNotifs();
    }
  }, [session]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "mark_read" })
      });
      if (id === "all") {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      } else {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      }
    } catch (error) {
      console.error("Gagal update notifikasi");
    }
  };

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
            "flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm transition-all duration-500 hidden sm:flex",
            stats.streak > 0 
              ? "bg-orange-50 text-orange-600 border-orange-100" 
              : "bg-slate-50 text-slate-400 border-slate-100"
          )}>
            <Flame size={20} className={cn(stats.streak > 0 && "fill-orange-600")} />
            <span className="font-black text-sm">{stats.streak} Hari</span>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 text-primary-blue px-4 py-2 rounded-xl border border-blue-100 shadow-sm hidden sm:flex">
            <Sparkles size={18} className="fill-primary-blue" />
            <span className="font-black text-sm">{stats.xp} XP</span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-dark-blue/60 hover:bg-light-blue hover:text-dark-blue rounded-xl transition-colors"
            >
              <Bell size={22} className={cn(unreadCount > 0 && "animate-pulse text-dark-blue")} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-light-blue overflow-hidden flex flex-col z-50"
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-black text-dark-blue">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => markAsRead("all")}
                        className="text-xs font-bold text-primary-blue hover:underline"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <Bell size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-bold">Belum ada notifikasi</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => !notif.is_read && markAsRead(notif.id)}
                            className={cn(
                              "p-4 flex gap-3 transition-colors cursor-pointer hover:bg-slate-50",
                              !notif.is_read ? "bg-blue-50/50" : ""
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                              notif.type === "success" ? "bg-green-100 text-green-600" :
                              notif.type === "warning" ? "bg-orange-100 text-orange-600" :
                              "bg-blue-100 text-blue-600"
                            )}>
                              {notif.type === "success" ? <CheckCircle2 size={20} /> :
                               notif.type === "warning" ? <Flame size={20} /> :
                               <Info size={20} />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-dark-blue leading-tight mb-1">{notif.title}</p>
                              <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{notif.message}</p>
                            </div>
                            {!notif.is_read && (
                              <div className="w-2 h-2 rounded-full bg-primary-blue mt-2 shrink-0"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
            <div className="w-10 h-10 rounded-xl bg-primary-blue flex items-center justify-center text-white font-black shadow-lg shadow-primary-blue/20 overflow-hidden border-2 border-white shrink-0">
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
