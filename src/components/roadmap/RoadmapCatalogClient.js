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
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career: category.name })
      });

      if (res.ok) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Roadmap berhasil dipilih!',
          showConfirmButton: false,
          timer: 3000
        });
        router.push("/belajar");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal memilih roadmap',
          text: 'Silakan coba lagi nanti.',
          confirmButtonColor: '#3b82f6'
        });
        setLoadingCategory(null);
      }
    } catch (error) {
      console.error(error);
      setLoadingCategory(null);
    }
  };

  const currentGroup = groupedCategories.find(g => g.title === activeDomain);
  const filteredItems = currentGroup?.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* ═══ PREMIUM SHOWROOM HEADER ═══ */}
      <div className="relative pt-6 px-6 md:px-10 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          {/* Main Card Header */}
          <div className="relative overflow-hidden rounded-[40px] md:rounded-[60px] bg-gradient-to-br from-primary-blue via-blue-600 to-blue-800 border border-blue-400/30 shadow-[0_20px_50px_rgba(59,130,246,0.2)]">
            
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute -top-1/2 -left-1/4 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)] blur-3xl" 
                />
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 p-6 md:p-10 lg:p-12 flex flex-col items-center text-center">
              
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-2xl border border-white/20 px-4 py-1.5 rounded-full"
                >
                  <Sparkles size={12} className="text-yellow-300" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Eksplorasi Karir</span>
                </motion.div>

                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter">
                    Temukan Jalur <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      Masa Depanmu
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-white/70 font-medium max-w-lg mx-auto leading-relaxed">
                    Pilih satu dari 50+ bidang profesional digital. Kami siapkan roadmap 30 hari yang terstruktur untuk membantumu menguasainya dari nol.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                   <div className="flex items-center gap-2 text-white/80 text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                      <Target size={14} className="text-blue-300" /> 50+ Roadmap
                   </div>
                   <div className="flex items-center gap-2 text-white/80 text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                      <Zap size={14} className="text-yellow-300" /> 30 Hari Belajar
                   </div>
                   <div className="flex items-center gap-2 text-white/80 text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                      <Rocket size={14} className="text-emerald-300" /> Sertifikat
                   </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20 relative z-10">
        
        {/* ═══ ACTIVE ROADMAPS INDICATOR ═══ */}
        {activeRoadmaps.length > 0 && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRoadmaps.map((roadmap) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between bg-white border-2 border-primary-blue/20 p-6 rounded-[32px] shadow-xl shadow-blue-500/5 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary-blue border border-blue-100 group-hover:scale-110 transition-transform">
                    <BookOpen size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 leading-none mb-1 text-sm truncate">Aktif</h3>
                    <p className="text-xs text-slate-500 font-bold truncate max-w-[120px]">{roadmap.category.name}</p>
                  </div>
                </div>
                <Link 
                  href={`/belajar/${roadmap.id}`}
                  className="flex items-center gap-1.5 bg-primary-blue text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Lanjut <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* ═══ SIDE NAVIGATION (DOMAINS) ═══ */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-8">
               
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

               {/* Quick Support / AI Widget */}
               <div className="p-6 bg-gradient-to-br from-blue-600 to-primary-blue rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:rotate-12 transition-transform">
                     <MousePointer2 size={40} />
                  </div>
                  <div className="relative z-10">
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Bingung Pilih?</p>
                     <h4 className="text-sm font-black mb-4 leading-relaxed">Biarkan AI Mentor membantumu menemukan minat!</h4>
                     <Link href="/ai" className="inline-flex items-center gap-2 text-xs font-black text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl hover:bg-white/30 transition-all">
                        Mulai Diskusi <ChevronRight size={14} />
                     </Link>
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
                        <div className="flex items-start justify-between mb-8">
                           <div className={cn(
                             "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg",
                             isActive ? "bg-primary-blue text-white" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-primary-blue"
                           )}>
                              <Icon size={32} />
                           </div>
                           {isActive && (
                             <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                                <CheckCircle2 size={16} />
                             </div>
                           )}
                        </div>

                        <div className="flex-1 space-y-3 mb-8">
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
