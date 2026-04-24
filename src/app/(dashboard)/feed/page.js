"use client";

import React, { useState, useEffect } from "react";
import SocialFeed from "@/components/community/SocialFeed";
import { 
  Globe, 
  TrendingUp, 
  Hash, 
  ChevronRight, 
  Sparkles,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeedPage() {
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
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Sidebar - Filters */}
        <div className="lg:w-80 space-y-8 shrink-0">
          <div className="bg-white rounded-[40px] border border-light-blue p-8 shadow-sm">
             <h3 className="text-xl font-black text-dark-blue mb-6 flex items-center gap-3">
                <Globe className="text-primary-blue" size={20} /> Feed Global
             </h3>
             
             <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all",
                    !selectedCategory ? "bg-primary-blue/10 text-primary-blue" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                   <div className="flex items-center gap-3">
                      <TrendingUp size={18} />
                      <span>Semua Progres</span>
                   </div>
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
                     <div className="flex items-center gap-3">
                        <Hash size={16} />
                        <span className="truncate">{cat.name}</span>
                     </div>
                     {selectedCategory === cat.id && <ChevronRight size={16} />}
                  </button>
                ))}
             </div>
          </div>

          <div className="bg-gradient-to-br from-dark-blue to-primary-blue rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-primary-blue/20">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
             <Sparkles className="mb-4 text-white/50" />
             <h4 className="text-lg font-black mb-2 leading-tight">Rayakan Pencapaianmu</h4>
             <p className="text-xs text-white/70 font-medium mb-6 leading-relaxed">
                Setiap hari yang kamu selesaikan adalah langkah nyata menuju masa depan.
             </p>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1">
          <div className="mb-10">
             <h1 className="text-4xl font-black text-dark-blue mb-2">Social Feed</h1>
             <p className="text-slate-400 font-medium italic">Lihat bagaimana pejuang masa depan lainnya beraksi hari ini.</p>
          </div>
          
          <SocialFeed categoryId={selectedCategory} />
        </div>

      </div>
    </div>
  );
}
