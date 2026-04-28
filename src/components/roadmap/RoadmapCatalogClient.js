"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Search, CheckCircle2, ChevronRight, BookOpen, Loader2, Code2, 
  Palette, Database, BarChart3, Smartphone, Zap, Sparkles, 
  Star, Target, Rocket, MousePointer2, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Category icon mapping and color themes
const categoryThemes = {
  web: { icon: Code2, gradient: "from-blue-600 to-cyan-500", lightGradient: "from-blue-50 to-cyan-50", accent: "text-blue-600", bgAccent: "bg-blue-100" },
  design: { icon: Palette, gradient: "from-purple-600 to-pink-500", lightGradient: "from-purple-50 to-pink-50", accent: "text-purple-600", bgAccent: "bg-purple-100" },
  data: { icon: Database, gradient: "from-emerald-600 to-teal-500", lightGradient: "from-emerald-50 to-teal-50", accent: "text-emerald-600", bgAccent: "bg-emerald-100" },
  mobile: { icon: Smartphone, gradient: "from-orange-600 to-rose-500", lightGradient: "from-orange-50 to-rose-50", accent: "text-orange-600", bgAccent: "bg-orange-100" },
  analytics: { icon: BarChart3, gradient: "from-indigo-600 to-blue-500", lightGradient: "from-indigo-50 to-blue-50", accent: "text-indigo-600", bgAccent: "bg-indigo-100" },
  default: { icon: Zap, gradient: "from-primary-blue to-blue-600", lightGradient: "from-blue-50 to-indigo-50", accent: "text-primary-blue", bgAccent: "bg-blue-100" },
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

export default function RoadmapCatalogClient({ groupedCategories, activeRoadmaps = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(null);
  const [activeDomain, setActiveDomain] = useState(groupedCategories[0]?.title || "");
  const router = useRouter();

  const handleSelectCategory = async (category) => {
    const Swal = (await import("sweetalert2")).default;
    const result = await Swal.fire({
      title: `<span class="font-black text-slate-900">Mulai Roadmap Baru?</span>`,
      html: `<p class="text-slate-500 font-medium">Apakah kamu yakin ingin memulai roadmap untuk <b>${category.name}</b>?</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Mulai!',
      cancelButtonText: 'Nanti Dulu',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#94a3b8',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-[32px] p-8 border-none shadow-2xl',
        confirmButton: 'px-8 py-3.5 bg-skillio-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-skillio-700 transition-all mx-2',
        cancelButton: 'px-8 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all mx-2'
      }
    });

    if (!result.isConfirmed) return;

    setLoadingCategory(category.id);
    
    // Show immersive loading overlay
    Swal.fire({
      title: 'Mempersiapkan Masa Depanmu...',
      html: `
        <div className="py-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-slate-600 font-bold leading-relaxed">
            AI Mentor sedang merancang kurikulum terbaik untuk bidang <b>${category.name}</b>.<br/>
            Proses ini memakan waktu sekitar 10-20 detik. Jangan tutup halaman ini ya!
          </p>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-[40px] p-10 border-none shadow-2xl',
      }
    });

    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career: category.name })
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Roadmap Siap!',
          text: 'AI telah selesai merancang perjalanan belajarmu.',
          confirmButtonColor: '#3b82f6',
          confirmButtonText: 'Mulai Belajar Sekarang',
          customClass: {
            popup: 'rounded-[32px]',
            confirmButton: 'px-8 py-3 bg-primary-blue text-white rounded-xl font-bold'
          }
        }).then(() => {
          router.push("/belajar");
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Sedikit Kendala...',
          text: 'Gagal merancang roadmap. Coba lagi dalam beberapa saat ya.',
          confirmButtonColor: '#3b82f6',
          customClass: { popup: 'rounded-[32px]' }
        });
        setLoadingCategory(null);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Terputus',
        text: 'Pastikan internetmu lancar dan coba lagi.',
        confirmButtonColor: '#3b82f6',
        customClass: { popup: 'rounded-[32px]' }
      });
      setLoadingCategory(null);
    }
  };

  const currentGroup = groupedCategories.find(g => g.title === activeDomain);
  const filteredItems = currentGroup?.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* ═══ PREMIUM SHOWROOM HEADER (Matched with Lencana Style) ═══ */}
      <div className="relative pt-6 px-6 md:px-10 mb-8 md:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group"
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

            <div className="relative z-10 p-8 md:p-10 lg:p-12 flex flex-col lg:flex-row items-center gap-12">
              
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-2xl border border-white/20 px-5 py-2 rounded-full"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Eksplorasi Karir</span>
                </motion.div>

                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter"
                  >
                    Temukan Jalur <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      Masa Depanmu
                    </span>
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-base md:text-lg text-white/80 font-medium max-w-lg leading-relaxed"
                  >
                    Pilih satu dari 50+ bidang profesional digital. Kami siapkan roadmap 30 hari yang terstruktur untuk membantumu menguasainya dari nol.
                  </motion.p>
                </div>

                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.6 }}
                   className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
                >
                   <div className="flex items-center gap-2.5 text-white/90 text-xs font-black bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl backdrop-blur-md">
                      <Target size={16} className="text-blue-300" /> 50 Roadmap
                   </div>
                   <div className="flex items-center gap-2.5 text-white/90 text-xs font-black bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl backdrop-blur-md">
                      <Zap size={16} className="text-yellow-300" /> 30 Hari Belajar
                   </div>
                   <div className="flex items-center gap-2.5 text-white/90 text-xs font-black bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl backdrop-blur-md">
                      <Rocket size={16} className="text-emerald-300" /> Sertifikat
                   </div>
                </motion.div>
              </div>

              {/* Right Content - Visual Showcase */}
              <div className="relative shrink-0 hidden md:block">
                {/* Floating Elements Container */}
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                   {/* Main Icon (Central) */}
                   <motion.div
                     animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                     transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute inset-0 flex items-center justify-center z-20"
                   >
                     <div className="relative">
                        <div className="absolute inset-0 bg-blue-400/20 blur-[60px] rounded-full" />
                        <Rocket size={120} className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
                     </div>
                   </motion.div>

                   {/* Orbital Icons */}
                   {[
                     { Icon: Code2, color: "text-blue-400", pos: "top-0 left-0", delay: 0 },
                     { Icon: Palette, color: "text-purple-400", pos: "top-8 right-0", delay: 1 },
                     { Icon: Database, color: "text-emerald-400", pos: "bottom-8 left-8", delay: 2 },
                     { Icon: Sparkles, color: "text-yellow-400", pos: "bottom-0 right-8", delay: 1.5 },
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

                   {/* Count Bubble */}
                   <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ delay: 0.8, type: "spring" }}
                     className="absolute -right-2 -bottom-2 z-40 bg-white p-6 rounded-[30px] shadow-2xl border-4 border-blue-800 text-center"
                   >
                      <span className="block text-3xl font-black text-[#0F172A] leading-none">50</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1 block">Roadmap</span>
                   </motion.div>
                </div>
              </div>

            </div>
          </div>

          {/* Decorative floating shapes outside card */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20 relative z-10">
        
        {/* ═══ AI TALENT FINDER BANNER (Below Hero Card) ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 bg-white border border-slate-100 rounded-[35px] p-2 pr-2 md:p-3 md:pr-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
        >
          <div className="flex items-center gap-6 flex-1 pl-4">
             <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-50 rounded-[24px] flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-105 transition-transform shrink-0">
               <Sparkles size={28} className="animate-pulse" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1 leading-none">Bingung Memilih Jalur?</p>
                <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">Ikuti kuis ini untuk temukan passion-mu!</h3>
             </div>
          </div>
          <Link 
            href="/quiz"
            className="w-full md:w-auto px-10 py-4 md:py-4.5 bg-gradient-to-br from-primary-blue via-blue-600 to-blue-800 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            Mulai Analisis <ChevronRight size={16} />
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* ═══ SIDE NAVIGATION (DOMAINS) ═══ */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
               
                {/* New Search Location */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="relative group/search"
               >
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                      type="text"
                      placeholder="Cari roadmap..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-100 focus:border-primary-blue/30 outline-none font-bold text-xs transition-all shadow-sm focus:shadow-xl focus:shadow-blue-500/5 placeholder:text-slate-300"
                    />
                 </div>
               </motion.div>

               <div className="bg-white/50 backdrop-blur-sm border border-white rounded-[32px] p-4 shadow-sm">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
                     Pilih Bidang
                  </h2>
                  <div className="flex flex-col gap-1.5">
                    {groupedCategories.map((group) => {
                      const icons = {
                        "Teknologi & Pengembangan": Code2,
                        "Data & Kecerdasan Buatan": Database,
                        "Desain & Kreativitas": Palette,
                        "Konten & Media Digital": Smartphone,
                        "Bisnis & Pemasaran Digital": BarChart3,
                        "Keuangan & Legalitas Digital": Target,
                      };
                      const Icon = icons[group.title] || Zap;
                      const isActive = activeDomain === group.title;

                      return (
                        <button
                          key={group.title}
                          onClick={() => setActiveDomain(group.title)}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-2xl font-bold text-[13px] transition-all flex items-center justify-between group relative overflow-hidden",
                            isActive
                              ? "bg-primary-blue text-white shadow-lg shadow-blue-500/20"
                              : "text-slate-500 hover:bg-white hover:text-slate-900"
                          )}
                        >
                          <div className="flex items-center gap-3 relative z-10">
                             <div className={cn(
                               "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                               isActive ? "bg-white/20" : "bg-slate-50 group-hover:bg-blue-50"
                             )}>
                                <Icon size={16} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-primary-blue")} />
                             </div>
                             <span className="truncate max-w-[140px]">{group.title}</span>
                          </div>
                          
                          {isActive && (
                            <motion.div 
                              layoutId="activeTab"
                              className="absolute inset-0 bg-gradient-to-r from-primary-blue to-blue-700 z-0"
                            />
                          )}

                          <div className={cn(
                             "w-1.5 h-1.5 rounded-full transition-all relative z-10",
                             isActive ? "bg-white scale-110" : "bg-slate-200 opacity-0 group-hover:opacity-100"
                          )} />
                        </button>
                      );
                    })}
                  </div>
               </div>
            </div>
          </div>

          {/* ═══ MAIN CATALOG CONTENT ═══ */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain + searchQuery}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                 {/* Domain Header */}
                 <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1">
                       <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{activeDomain}</h2>
                       <span className="bg-slate-200/50 text-slate-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                         {filteredItems.length} Roadmap
                       </span>
                    </div>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl">{currentGroup?.description}</p>
                 </div>

                 {/* Grid Catalog */}
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {filteredItems.map((category, idx) => {
                    const isActive = activeRoadmaps.some(r => r.category_id === category.id);
                    const isLoading = loadingCategory === category.id;
                    const theme = getCategoryTheme(category.name);
                    const Icon = theme.icon;

                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "group relative bg-white border-2 rounded-[35px] p-7 transition-all duration-300 flex flex-col",
                          isActive 
                            ? "border-primary-blue ring-4 ring-primary-blue/5 shadow-2xl shadow-blue-500/10" 
                            : "border-slate-100 hover:border-primary-blue/30 hover:shadow-2xl hover:shadow-slate-300/30"
                        )}
                      >
                        <div className="flex-1 space-y-3 mb-8 pt-4">
                           <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary-blue transition-colors">
                              {category.name}
                           </h3>
                           <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                              Kuasai fundamental dan teknik tingkat lanjut dalam bidang {category.name} melalui kurikulum terstruktur selama 30 hari.
                           </p>
                        </div>

                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Briefcase size={14} className="text-slate-400" />
                              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Peluang Karir: Tinggi</span>
                           </div>
                           
                           {activeRoadmaps.some(r => r.category_id === category.id) ? (
                             <Link href={`/belajar/${activeRoadmaps.find(r => r.category_id === category.id)?.id}`} className="flex items-center gap-2 text-primary-blue font-black text-sm hover:underline">
                               Lanjut Belajar <ChevronRight size={18} />
                             </Link>
                           ) : (
                             <button
                               onClick={() => handleSelectCategory(category)}
                               disabled={isLoading || activeRoadmaps.length >= 3}
                               className={cn(
                                 "flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                                 activeRoadmaps.length >= 3 
                                   ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                   : "bg-slate-50 text-slate-900 group-hover:bg-primary-blue group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30"
                               )}
                             >
                                {isLoading ? <Loader2 className="animate-spin" size={14} /> : "Pilih"} <ChevronRight size={16} />
                             </button>
                           )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Empty Search within Domain */}
                  {filteredItems.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white border-2 border-dashed border-slate-100 rounded-[40px]">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Search size={40} className="text-slate-200" />
                       </div>
                       <h3 className="text-xl font-black text-slate-400">Tidak ada hasil untuk "{searchQuery}"</h3>
                       <p className="text-slate-400 font-medium">Coba gunakan kata kunci lain atau pilih domain yang berbeda.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
