"use client";

import React, { useState, useEffect } from "react";
import SocialFeed from "@/components/community/SocialFeed";
import { 
  Users, 
  Hash, 
  TrendingUp, 
  Map as MapIcon, 
  Search,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
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
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <div className="lg:w-80 space-y-8 shrink-0">
          <div className="bg-white rounded-[40px] border border-light-blue p-8 shadow-sm">
             <h3 className="text-xl font-black text-dark-blue mb-6 flex items-center gap-3">
                <Users className="text-primary-blue" /> Komunitas Karier
             </h3>
             
             <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari komunitas..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary-blue/20 text-sm font-medium"
                />
             </div>

             <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all",
                    !selectedCategory ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                   <div className="flex items-center gap-3">
                      <TrendingUp size={18} />
                      <span>Semua Feed</span>
                   </div>
                   {!selectedCategory && <ChevronRight size={16} />}
                </button>

                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all",
                      selectedCategory === cat.id ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20" : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                     <div className="flex items-center gap-3">
                        <Hash size={18} />
                        <span className="truncate max-w-[140px]">{cat.name}</span>
                     </div>
                     {selectedCategory === cat.id && <ChevronRight size={16} />}
                  </button>
                ))}
             </div>
          </div>

          <div className="bg-gradient-to-br from-dark-blue to-primary-blue rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-primary-blue/20">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             <Sparkles className="mb-4 text-white/50" />
             <h4 className="text-lg font-black mb-2 leading-tight">Bangun Portofolio Visualmu</h4>
             <p className="text-xs text-white/70 font-medium mb-6 leading-relaxed">
                Setiap progres yang kamu bagikan akan muncul di Skill Tree profilmu.
             </p>
             <button className="w-full py-3 bg-white text-primary-blue rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                Cek Skill Tree
             </button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1">
          <div className="mb-8 flex items-center justify-between">
             <h2 className="text-3xl font-black text-dark-blue">
               {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "Informasi Terkini"}
             </h2>
             <div className="flex gap-2">
                <span className="px-4 py-2 bg-white border border-light-blue rounded-xl text-xs font-black text-dark-blue/40 uppercase tracking-widest">Terbaru</span>
             </div>
          </div>
          
          <SocialFeed categoryId={selectedCategory} />
        </div>

      </div>
    </div>
  );
}
