"use client";

import React, { useState, useEffect } from "react";
import GroupList from "@/components/community/GroupList";
import { 
  Users, 
  Search, 
  Plus, 
  Sparkles,
  ChevronRight,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-12 px-6 md:px-10 max-w-7xl pt-6">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <div className="lg:w-80 space-y-8 shrink-0">
          <div className="bg-white rounded-[40px] border border-light-blue p-8 shadow-sm">
             <h3 className="text-xl font-black text-dark-blue mb-6 flex items-center gap-3">
                <Filter className="text-primary-blue" size={20} /> Cari Grup
             </h3>
             
             <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Nama grup..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary-blue/20 text-sm font-medium transition-all"
                />
             </div>

             <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all",
                    !selectedCategory ? "bg-primary-blue/10 text-primary-blue" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                   <span>Semua Bidang</span>
                   {!selectedCategory && <ChevronRight size={16} />}
                </button>

                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all text-sm",
                      selectedCategory === cat.id ? "bg-primary-blue/10 text-primary-blue" : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                     <span className="truncate">{cat.name}</span>
                     {selectedCategory === cat.id && <ChevronRight size={16} />}
                  </button>
                ))}
             </div>
          </div>

          <div className="bg-gradient-to-br from-dark-blue to-primary-blue rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-primary-blue/20">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             <Sparkles className="mb-4 text-white/50" />
             <h4 className="text-lg font-black mb-2 leading-tight">Bangun Komunitasmu</h4>
             <p className="text-xs text-white/70 font-medium mb-6 leading-relaxed">
                Jadilah admin dan pimpin perjalanan belajar teman-temanmu.
             </p>
             <button className="w-full py-4 bg-white text-primary-blue rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2">
                <Plus size={14} /> Buat Grup
             </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-10">
             <h1 className="text-4xl font-black text-dark-blue mb-2">Grup Komunitas</h1>
             <p className="text-slate-400 font-medium italic">Temukan tempat belajar dan diskusi yang lebih privat.</p>
          </div>
          
          <GroupList categoryId={selectedCategory} />
        </div>

      </div>
    </div>
  );
}
