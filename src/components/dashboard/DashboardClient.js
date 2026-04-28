"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame,
  Target,
  Trophy,
  Zap,
  BookOpen,
  Award,
  Bot,
  ArrowRight,
  CheckCircle2,
  Circle,
  Map,
  Users,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" } }),
};

function StatCard({ icon: Icon, label, value, sub, color, accent, index }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="group relative bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 overflow-hidden"
    >
      <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2", accent)} />
      <div className="flex items-start justify-between mb-5">
        <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300", color)}>
          <Icon size={22} />
        </div>
        <span className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">{label}</span>
      </div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      {sub && <p className="text-sm text-slate-400 font-medium mt-1">{sub}</p>}
    </motion.div>
  );
}

function MiniBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((d, i) => {
        const h = Math.max((d.count / max) * 100, 6);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div className="relative w-full">
              <div
                className="w-full bg-skillio-500/80 rounded-lg group-hover:bg-skillio-600 transition-colors cursor-default"
                style={{ height: `${h}px`, minHeight: "6px" }}
                title={`${d.count} interaksi`}
              />
            </div>
            <span className="text-[9px] font-bold text-slate-400">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardClient({
  userName,
  xp: initialXp,
  currentStreak: initialStreak,
  bestStreak,
  badgeCount,
  recentBadges,
  hasRoadmap,
  roadmapField,
  progressPercentage,
  completedDays,
  currentDay,
  currentDayTitle,
  currentDayTasks,
  completedRoadmaps,
  weeklyActivity,
  totalAiChats,
  userPostsCount,
}) {
  const firstName = userName?.split(" ")[0] || "User";
  const { stats, refreshStats } = useAppStore();

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Use store stats if available, otherwise fallback to initial props
  const displayXp = stats?.xp ?? initialXp;
  const displayStreak = stats?.streak ?? initialStreak;
  const isActiveToday = stats?.isActiveToday ?? false;

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Selamat Pagi"
      : hour < 17
        ? "Selamat Siang"
        : "Selamat Malam";

  return (
    <div className="max-w-7xl mx-auto space-y-8 overflow-x-hidden pb-12 px-6 md:px-10 max-w-7xl mx-auto pt-6">
      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {greeting}, {firstName}! 
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            {hasRoadmap
              ? `Hari ke-${currentDay} belajar ${roadmapField}`
              : "Mulai perjalanan belajarmu sekarang!"}
          </p>
        </div>

      </motion.div>

      {/* ═══ HERO PROGRESS CARD (if has roadmap) ═══ */}
      {hasRoadmap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="relative bg-gradient-to-br from-skillio-500 via-skillio-600 to-blue-700 rounded-[28px] p-7 md:p-9 text-white overflow-hidden shadow-2xl shadow-skillio-500/30"
        >
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-skillio-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-teal-400/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-sm">
                  🎯 Roadmap Aktif
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
                {roadmapField}
              </h2>
              <p className="text-white/50 font-medium text-sm">
                Hari {currentDay} dari 30 — {completedDays} hari terselesaikan
              </p>

              {/* Progress Bar */}
              <div className="mt-5 flex items-center gap-4">
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                  />
                </div>
                <span className="text-lg font-black text-white/90 tabular-nums min-w-[52px] text-right">
                  {progressPercentage}%
                </span>
              </div>
            </div>

            <Link
              href="/belajar"
              className="flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-white/90 transition-colors shadow-lg shadow-black/20 group shrink-0"
            >
              Lanjut Belajar
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </motion.div>
      )}

      {/* ═══ NO ROADMAP CTA ═══ */}
      {!hasRoadmap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-gradient-to-br from-skillio-500 via-skillio-600 to-blue-700 rounded-[28px] p-9 text-white overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-skillio-500/15 rounded-full blur-[80px]" />
          <div className="relative z-10 text-center space-y-4">
            <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-2">
              <Map size={32} />
            </div>
            <h2 className="text-2xl font-black">Belum Ada Roadmap Aktif</h2>
            <p className="text-white/60 font-medium max-w-md mx-auto">
              Ikuti quiz untuk menemukan bidang yang cocok untukmu, lalu mulai belajar selama 30 hari!
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-white/90 transition-colors mt-2 shadow-lg group"
            >
              Mulai Quiz Sekarang
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* ═══ STAT CARDS ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Flame}
          label="Streak"
          value={`${displayStreak} Hari`}
          sub={isActiveToday ? "Streak aktif hari ini!" : "Selesaikan misi hari ini!"}
          color={isActiveToday ? "bg-orange-50 text-orange-500" : "bg-slate-50 text-slate-400"}
          accent={isActiveToday ? "bg-orange-300" : "bg-slate-300"}
          index={0}
        />
        <StatCard
          icon={Trophy}
          label="Badge"
          value={badgeCount}
          sub="Penghargaan"
          color="bg-purple-50 text-purple-500"
          accent="bg-purple-300"
          index={1}
        />
        <StatCard
          icon={BookOpen}
          label="Selesai"
          value={completedRoadmaps}
          sub="Roadmap tuntas"
          color="bg-emerald-50 text-emerald-500"
          accent="bg-emerald-300"
          index={2}
        />
        <StatCard
          icon={Sparkles}
          label="Points"
          value={`${displayXp} XP`}
          sub="Total pengalaman"
          color="bg-blue-50 text-primary-blue"
          accent="bg-blue-300"
          index={3}
        />
      </div>

      {/* ═══ MAIN GRID: Tasks + Sidebar ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-[28px] border border-slate-100 p-7 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Calendar size={20} className="text-skillio-500" />
                Tugas Hari Ini
              </h3>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                {currentDayTitle
                  ? `Hari ${currentDay}: ${currentDayTitle}`
                  : "Tidak ada tugas aktif"}
              </p>
            </div>
            {hasRoadmap && (
              <Link
                href="/belajar"
                className="text-xs font-bold text-skillio-500 hover:text-skillio-700 transition-colors flex items-center gap-1"
              >
                Lihat semua <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {currentDayTasks.length > 0 ? (
            <div className="space-y-3">
              {currentDayTasks.map((task, i) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-2xl border transition-all",
                    task.completed
                      ? "bg-emerald-50/50 border-emerald-100"
                      : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
                  )}
                >
                  {task.completed ? (
                    <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 shrink-0" />
                  ) : (
                    <Circle size={20} className="text-slate-300 mt-0.5 shrink-0" />
                  )}
                  <p
                    className={cn(
                      "text-sm font-medium leading-relaxed",
                      task.completed ? "text-emerald-700 line-through opacity-60" : "text-slate-700"
                    )}
                  >
                    {task.task_text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl mb-4">
                <Target size={28} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">
                {hasRoadmap
                  ? "Semua tugas hari ini sudah selesai! 🎉"
                  : "Mulai roadmap untuk melihat tugas harianmu"}
              </p>
            </div>
          )}
        </motion.div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Mentor Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Bot size={18} className="text-skillio-500" />
                AI Mentor
              </h3>
              <span className="text-xs font-bold text-slate-400">7 hari terakhir</span>
            </div>
            <MiniBarChart data={weeklyActivity} />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
              <p className="text-xs text-slate-400 font-medium">Total interaksi</p>
              <p className="text-sm font-black text-slate-900">{totalAiChats}</p>
            </div>
            <Link
              href="/ai"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-skillio-50 text-skillio-600 rounded-xl font-bold text-xs hover:bg-skillio-100 transition-colors"
            >
              <Sparkles size={14} /> Chat dengan Mentor
            </Link>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Trophy size={18} className="text-purple-500" />
                Pencapaian
              </h3>
              <Link href="/badges" className="text-xs font-bold text-skillio-500 hover:text-skillio-700 transition-colors">
                Lihat semua
              </Link>
            </div>

            {recentBadges.length > 0 ? (
              <div className="space-y-3">
                {recentBadges.slice(0, 3).map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-50"
                  >
                    <img
                      src={badge.image_url}
                      alt={badge.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{badge.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
                <Award className="text-slate-200 mb-2" size={28} />
                <p className="text-xs font-bold text-slate-400">
                  Selesaikan tugas untuk dapatkan badge!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
