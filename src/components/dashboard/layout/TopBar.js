"use client";

import React, { useEffect, useState, useRef } from "react";
import { Flame, Bell, Search, Menu, Sparkles, Check, CheckCircle2, Info, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import { useAppStore } from "@/store/useAppStore";

const TopBar = ({ onMenuClick }) => {
  const { data: session } = useSession();
  const { stats, refreshStats } = useAppStore();
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
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
      refreshStats();
      fetchNotifs();
    }
  }, [session, refreshStats]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
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
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-light-blue fixed top-0 right-0 left-0 lg:left-64 z-30 px-6">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-dark-blue hover:bg-light-blue rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm transition-all duration-500 hidden sm:flex",
            !stats.isActiveToday ? "bg-slate-100 text-slate-400 border-slate-200 grayscale" :
            stats.streak >= 30 ? "bg-blue-50 text-blue-600 border-blue-100" :
            stats.streak >= 15 ? "bg-purple-50 text-purple-600 border-purple-100" :
            "bg-orange-50 text-orange-600 border-orange-100"
          )}>
            <Flame size={20} className={cn(
              !stats.isActiveToday ? "" :
              stats.streak >= 30 ? "fill-blue-600" :
              stats.streak >= 15 ? "fill-purple-600" :
              "fill-orange-600"
            )} />
            <span className="font-black text-sm">{stats.streak} Hari</span>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 text-primary-blue px-4 py-2 rounded-xl border border-blue-100 shadow-sm hidden sm:flex group transition-all hover:scale-105">
            <Sparkles size={18} className="fill-primary-blue group-hover:animate-spin" />
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

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 p-1.5 pr-2 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-dark-blue leading-tight truncate max-w-[120px] group-hover:text-primary-blue transition-colors">
                  {session?.user?.name || "Pengguna"}
                </p>
                <p className="text-[10px] font-bold text-primary-blue uppercase tracking-wider">
                  {session?.user?.role === "admin" ? "Administrator" : "Anggota Skillio"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-blue/20 overflow-hidden border-2 border-white shrink-0 group-hover:scale-110 transition-transform">
                {session?.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt="Profil" 
                    width={40}
                    height={40}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <Image 
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${session?.user?.name || "guest"}`} 
                    alt="Profil" 
                    width={40}
                    height={40}
                    unoptimized
                    className="w-full h-full object-cover bg-blue-50" 
                  />
                )}
              </div>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-light-blue overflow-hidden flex flex-col z-50 top-full"
                >
                  {/* User Info Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-black text-dark-blue leading-tight">
                      {session?.user?.name || "Pengguna"}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      {session?.user?.email || "email@example.com"}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="divide-y divide-slate-100">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 p-4 text-dark-blue hover:bg-light-blue/50 transition-colors font-bold text-sm"
                    >
                      <User size={18} />
                      <span>Profil</span>
                    </Link>

                    <button
                      onClick={async () => {
                        setIsProfileDropdownOpen(false);
                        const Swal = (await import("sweetalert2")).default;
                        const result = await Swal.fire({
                          title: '<span class="font-black text-slate-900">Keluar dari Skillio?</span>',
                          html: '<p class="text-slate-500 font-medium">Kamu akan diarahkan ke halaman login.</p>',
                          icon: 'question',
                          showCancelButton: true,
                          confirmButtonText: 'Ya, Keluar',
                          cancelButtonText: 'Batal',
                          confirmButtonColor: '#ef4444',
                          cancelButtonColor: '#94a3b8',
                          buttonsStyling: false,
                          customClass: {
                            popup: 'rounded-[32px] p-8 border-none shadow-2xl',
                            confirmButton: 'px-8 py-3.5 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all mx-2',
                            cancelButton: 'px-8 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all mx-2'
                          }
                        });

                        if (result.isConfirmed) {
                          Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Berhasil keluar!',
                            showConfirmButton: false,
                            timer: 2000
                          });
                          signOut({ callbackUrl: "/" });
                        }
                      }}
                      className="flex items-center gap-3 p-4 w-full text-red-500 hover:bg-red-50/50 transition-colors font-bold text-sm"
                    >
                      <LogOut size={18} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
