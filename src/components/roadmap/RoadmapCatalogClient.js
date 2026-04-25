"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, PlayCircle, CheckCircle2, ChevronRight, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-6 md:px-10 max-w-7xl mx-auto pt-6">
      
      {/* ═══ HEADER & SEARCH ═══ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Eksplorasi Roadmap</h1>
          <p className="text-lg text-slate-500 font-medium">Temukan jalur karir digital yang paling cocok untukmu dari 50 bidang profesional yang tersedia. Pilih satu, dan mulai perjalanan 30 harimu sekarang.</p>
        </div>
        
        <div className="relative w-full md:w-96 shrink-0">
          <input
            type="text"
            placeholder="Cari bidang digital (Mis: Web, Data, Desain)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-skillio-500 focus:ring-4 focus:ring-skillio-500/20 outline-none transition-all font-bold text-slate-700 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>
      </div>

      {/* ═══ ACTIVE ROADMAP BANNER ═══ */}
      {activeRoadmap && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-skillio-900 to-skillio-700 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-skillio-900/20">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
              <BookOpen className="text-white" size={32} />
            </div>
            <div>
              <p className="text-skillio-200 font-bold text-sm uppercase tracking-widest mb-1">Roadmap Saat Ini</p>
              <h2 className="text-2xl font-black text-white">{activeRoadmap.category.name}</h2>
            </div>
          </div>
          <Link href="/belajar" className="w-full md:w-auto px-8 py-4 bg-white text-skillio-900 rounded-2xl font-black hover:scale-105 transition-transform flex items-center justify-center gap-2">
            Lanjutkan Belajar <ChevronRight size={20} />
          </Link>
        </motion.div>
      )}

      {/* ═══ CATEGORY GROUPS ═══ */}
      <div className="space-y-16">
        {groupedCategories.map((group, idx) => {
          // Filter items within this group based on search query
          const filteredItems = group.items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

          // If no items match in this group, don't render the group
          if (filteredItems.length === 0) return null;

          return (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-6"
            >
              <div className="border-b-2 border-slate-100 pb-4">
                <h2 className="text-2xl font-black text-slate-900 mb-2">{group.title}</h2>
                <p className="text-slate-500 font-medium">{group.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(category => {
                  const isActive = activeRoadmap?.category_id === category.id;
                  const isLoad = loadingCategory === category.id;

                  return (
                    <div 
                      key={category.id} 
                      className={cn(
                        "group relative p-6 rounded-3xl border-2 transition-all flex flex-col h-full",
                        isActive 
                          ? "bg-skillio-50/50 border-skillio-200" 
                          : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
                      )}
                    >
                      <div className="flex-1 space-y-3 mb-8">
                        {isActive && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-skillio-100 text-skillio-700 text-xs font-black uppercase tracking-wider rounded-lg mb-2">
                            <CheckCircle2 size={14} /> Sedang Aktif
                          </span>
                        )}
                        <h3 className="text-lg font-black text-slate-800 leading-snug">{category.name}</h3>
                      </div>
                      
                      {isActive ? (
                        <Link href="/belajar" className="w-full flex items-center justify-center gap-2 py-3 bg-skillio-600 text-white font-bold rounded-xl hover:bg-skillio-700 transition-colors">
                          Lanjut Belajar
                        </Link>
                      ) : (
                        <button 
                          onClick={() => handleSelectCategory(category)}
                          disabled={isLoad || activeRoadmap}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoad ? <Loader2 className="animate-spin" size={18} /> : "Pilih Roadmap Ini"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Empty Search State */}
        {groupedCategories.every(g => g.items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0) && (
          <div className="py-20 text-center">
            <div className="inline-flex p-5 bg-slate-50 rounded-full mb-4">
              <Search className="text-slate-300 w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Kategori tidak ditemukan</h3>
            <p className="text-slate-500 font-medium">Coba gunakan kata kunci lain yang lebih spesifik.</p>
          </div>
        )}
      </div>
    </div>
  );
}
