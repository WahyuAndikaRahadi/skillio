"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SocialFeed from "@/components/community/SocialFeed";
import {
  Globe,
  Hash,
  Sparkles,
  Search,
  Home,
  Users,
  Tv,
  CreditCard,
  Bookmark,
  Plus,
  Bell,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function FeedPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [communityGroups, setCommunityGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCommunityGroups = async () => {
      try {
        setLoadingGroups(true);
        const res = await fetch("/api/community/groups");
        const data = await res.json();
        if (res.ok) {
          setCommunityGroups(data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching community groups:", error);
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchCommunityGroups();
  }, []);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <div className="flex flex-1 gap-8 px-8 py-6 max-w-[1600px] mx-auto font-sans">

      {/* LEFT SIDEBAR (Navigation & Categories) */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 space-y-6">
        <nav className="space-y-1">
          {[
            { icon: Home, label: "Home", active: !selectedCategory },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => item.label === "Home" && setSelectedCategory(null)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                item.active
                  ? "bg-primary-blue/10 text-primary-blue shadow-sm"
                  : "text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm"
              )}
            >
              <item.icon size={18} className={item.active ? "text-primary-blue" : "text-slate-400"} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-4">
          <div className="flex items-center justify-between mb-4 px-4">
            <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Bidang</h3>
          </div>
          
          {/* Sidebar Search for Categories */}
          <div className="px-4 mb-4">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Cari bidang..."
                className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-primary-blue/20"
              />
            </div>
          </div>

          <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all group",
                  selectedCategory === cat.id
                    ? "bg-primary-blue/10 text-primary-blue shadow-sm"
                    : "text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  selectedCategory === cat.id ? "bg-blue-100 text-primary-blue" : "bg-slate-200/50 text-slate-400 group-hover:bg-slate-200"
                )}>
                  <Hash size={14} />
                </div>
                <span className="truncate text-xs">{cat.name}</span>
              </button>
            ))}
            {filteredCategories.length === 0 && (
              <p className="text-[10px] text-slate-400 italic px-4 py-2">Tidak ada hasil</p>
            )}
          </div>
        </div>
      </div>

      {/* MIDDLE COLUMN (Main Feed) */}
      <div className="flex-1 max-w-2xl xl:max-w-3xl">
        <SocialFeed categoryId={selectedCategory} searchQuery={searchQuery} />
      </div>

      {/* RIGHT SIDEBAR (Widgets & Promo) */}
      <div className="hidden xl:flex flex-col w-80 shrink-0 space-y-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-blue via-blue-600 to-blue-800 p-8 text-white shadow-xl shadow-primary-blue/20 group">
          {/* Immersive Animated Background */}
          <div className="absolute inset-0 z-0">
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="absolute -top-1/2 -left-1/4 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)] blur-2xl" 
             />
             <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, -90, 0] }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] blur-2xl" 
             />
          </div>

          <div className="relative z-10">
            <Sparkles className="mb-4 text-white/70 animate-pulse" size={24} />
            <h4 className="text-xl font-black mb-2 leading-tight font-display tracking-tight">Rayakan Pencapaianmu</h4>
            <p className="text-sm text-white/80 font-medium leading-relaxed">
              Setiap hari yang kamu selesaikan adalah langkah nyata menuju masa depan.
            </p>
            <div className="mt-6 pt-6 border-t border-white/10">
              <button className="text-[10px] font-black uppercase tracking-widest text-white hover:text-yellow-300 transition-colors flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                Buka Koleksi <Trophy size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Top Communities</h3>
            <button
              onClick={() => router.push('/community')}
              className="text-primary-blue text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              See All
            </button>
          </div>
          <div className="space-y-4">
            {loadingGroups ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                      <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : communityGroups.length > 0 ? (
              communityGroups.map((group, i) => {
                const colors = ['bg-teal-400', 'bg-slate-800', 'bg-orange-500', 'bg-pink-300', 'bg-blue-400'];
                return (
                  <button
                    key={group.id}
                    onClick={() => router.push(`/community?groupId=${group.id}`)} 
                    className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-white hover:shadow-sm transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm ${colors[i % colors.length]}`}>
                      {group.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-blue transition-colors">
                        {group.name}
                      </p>
                      <span className="text-[10px] text-primary-blue font-black uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                        {group.category?.name || 'Umum'}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase">No communities yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}