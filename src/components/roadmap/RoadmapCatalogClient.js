"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, PlayCircle, CheckCircle2, ChevronRight, BookOpen, Loader2, Code2, Palette, Database, BarChart3, Smartphone, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Category icon mapping and color themes
const categoryThemes = {
  web: { icon: Code2, gradient: "from-blue-600 to-cyan-500", lightGradient: "from-blue-50 to-cyan-50", accent: "text-blue-600", bgAccent: "bg-blue-100" },
  design: { icon: Palette, gradient: "from-purple-600 to-pink-500", lightGradient: "from-purple-50 to-pink-50", accent: "text-purple-600", bgAccent: "bg-purple-100" },
  data: { icon: Database, gradient: "from-emerald-600 to-teal-500", lightGradient: "from-emerald-50 to-teal-50", accent: "text-emerald-600", bgAccent: "bg-emerald-100" },
  mobile: { icon: Smartphone, gradient: "from-orange-600 to-rose-500", lightGradient: "from-orange-50 to-rose-50", accent: "text-orange-600", bgAccent: "bg-orange-100" },
  analytics: { icon: BarChart3, gradient: "from-indigo-600 to-blue-500", lightGradient: "from-indigo-50 to-blue-50", accent: "text-indigo-600", bgAccent: "bg-indigo-100" },
  default: { icon: Zap, gradient: "from-skillio-500 to-blue-600", lightGradient: "from-skillio-50 to-blue-50", accent: "text-skillio-600", bgAccent: "bg-skillio-100" },
};

const getCategoryTheme = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("web") || name.includes("frontend") || name.includes("backend")) return categoryThemes.web;
  if (name.includes("desain") || name.includes("design") || name.includes("ui") || name.includes("ux")) return categoryThemes.design;
  if (name.includes("data") || name.includes("database") || name.includes("sql")) return categoryThemes.data;
  if (name.includes("mobile") || name.includes("android") || name.includes("ios")) return categoryThemes.mobile;
  if (name.includes("analitik") || name.includes("analytics") || name.includes("bi")) return categoryThemes.analytics;
  return categoryThemes.default;
};

export default function RoadmapCatalogClient({ groupedCategories, activeRoadmap }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(null);
  const router = useRouter();

  const handleSelectCategory = async (category) => {
    if (!confirm(`Apakah kamu yakin ingin memulai roadmap untuk ${category.name}?`)) return;

    setLoadingCategory(category.id);
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career: category.name })
      });

      if (res.ok) {
        router.push("/belajar");
      } else {
        alert("Gagal memilih roadmap. Silakan coba lagi.");
        setLoadingCategory(null);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
      setLoadingCategory(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-16 pb-20 px-6 md:px-10 pt-6 relative z-10">

        {/* ═══ HEADER SECTION ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="space-y-6 max-w-2xl flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-skillio-500/10 to-blue-500/10 border border-skillio-200/40 backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-skillio-500 animate-pulse" />
              <span className="text-sm font-bold text-skillio-600">Jelajahi 50+ Bidang Profesional</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Eksplorasi <span className="bg-gradient-to-r from-skillio-500 to-blue-600 bg-clip-text text-transparent">Roadmap</span> Karir Digital
              </h1>
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                Temukan jalur karir digital yang paling cocok untukmu dari berbagai bidang profesional. Pilih satu, dan mulai perjalanan transformasi 30 harimu sekarang.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative w-full md:w-96 shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-skillio-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari bidang digital (Mis: Web, Data, Desain)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/20 outline-none transition-all font-semibold text-slate-700 shadow-lg hover:shadow-xl hover:border-slate-300"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ═══ ACTIVE ROADMAP BANNER ═══ */}
        {activeRoadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-skillio-900 via-skillio-800 to-skillio-700 rounded-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
            <div className="relative rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-skillio-900/30">
              <div className="flex items-center gap-6 flex-1">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0"
                >
                  <BookOpen className="text-white w-10 h-10" />
                </motion.div>
                <div className="space-y-2">
                  <p className="text-white/70 font-bold text-sm uppercase tracking-widest">Roadmap Aktif Sekarang</p>
                  <h2 className="text-2xl md:text-3xl font-black text-white">{activeRoadmap.category.name}</h2>
                </div>
              </div>
              <Link
                href="/belajar"
                className="w-full md:w-auto group px-8 py-4 bg-white text-skillio-900 rounded-2xl font-black hover:shadow-xl hover:shadow-white/20 transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                Lanjutkan Belajar
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* ═══ CATEGORY GROUPS ═══ */}
        <div className="space-y-20">
          {groupedCategories.map((group, idx) => {
            const filteredItems = group.items.filter(item =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="pb-6 border-b-2 border-slate-200">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-black text-slate-900 mb-3"
                  >
                    {group.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-600 font-semibold text-lg"
                  >
                    {group.description}
                  </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((category, itemIdx) => {
                    const isActive = activeRoadmap?.category_id === category.id;
                    const isLoading = loadingCategory === category.id;
                    const theme = getCategoryTheme(category.name);
                    const ThemeIcon = theme.icon;

                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: itemIdx * 0.05, duration: 0.4 }}
                        whileHover={{ y: -6 }}
                        className={cn(
                          "group relative h-full rounded-3xl border-2 transition-all duration-300 overflow-hidden",
                          isActive
                            ? "bg-gradient-to-br from-skillio-50/80 to-blue-50/80 border-skillio-300 shadow-xl shadow-skillio-200/30"
                            : "bg-white/80 backdrop-blur-sm border-slate-200 hover:border-slate-400 hover:shadow-2xl hover:shadow-slate-300/20"
                        )}
                      >
                        {/* Background gradient overlay */}
                        {!isActive && (
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}

                        <div className="relative p-6 md:p-7 flex flex-col h-full">
                          {/* Icon Badge */}
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: itemIdx * 0.05 + 0.1, type: "spring", stiffness: 120 }}
                            className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg transition-all duration-300 group-hover:scale-110",
                              isActive
                                ? `bg-gradient-to-br ${theme.gradient} text-white`
                                : `bg-gradient-to-br ${theme.lightGradient} ${theme.accent}`
                            )}
                          >
                            <ThemeIcon className="w-7 h-7" />
                          </motion.div>

                          {/* Status Badge */}
                          {isActive && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-skillio-600 text-white text-xs font-black uppercase tracking-wider rounded-lg mb-4 w-fit shadow-lg"
                            >
                              <CheckCircle2 size={14} /> Sedang Aktif
                            </motion.span>
                          )}

                          {/* Title and Description */}
                          <div className="flex-1 mb-6">
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-skillio-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                              {category.name}
                            </h3>
                          </div>

                          {/* Action Button */}
                          {isActive ? (
                            <Link
                              href="/belajar"
                              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-skillio-600 to-skillio-500 text-white font-black rounded-xl hover:shadow-xl hover:shadow-skillio-600/30 transition-all duration-300 hover:scale-105 group-hover:from-skillio-700 group-hover:to-skillio-600"
                            >
                              Lanjut Belajar
                              <ChevronRight size={18} />
                            </Link>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSelectCategory(category)}
                              disabled={isLoading || activeRoadmap}
                              className={cn(
                                "w-full flex items-center justify-center gap-2 py-3.5 font-black rounded-xl transition-all duration-300 group-hover:scale-105",
                                activeRoadmap
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                                  : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 group-hover:from-slate-900 group-hover:to-slate-800 group-hover:text-white hover:shadow-xl hover:shadow-slate-400/20"
                              )}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="animate-spin" size={18} />
                                  <span>Memproses...</span>
                                </>
                              ) : (
                                <>
                                  <span>Pilih Roadmap</span>
                                  <ChevronRight size={18} />
                                </>
                              )}
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {/* Empty Search State */}
          {groupedCategories.every(g => g.items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="py-24 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="inline-flex p-6 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full mb-6 shadow-lg"
              >
                <Search className="text-slate-300 w-12 h-12" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <h3 className="text-2xl md:text-3xl font-black text-slate-800">Kategori tidak ditemukan</h3>
                <p className="text-slate-600 font-semibold text-lg">Coba gunakan kata kunci yang lebih spesifik, seperti "Web", "Data", atau "Design".</p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
