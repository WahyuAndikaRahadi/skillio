"use client";

import React, { useState, useEffect } from "react";
import GroupList from "@/components/community/GroupList";
import GroupChat from "@/components/community/chat/[groupId]/GroupChat";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Sparkles,
  ChevronRight,
  Hash,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const getInitials = (name) => {
  const words = name.trim().split(" ");
  if (words.length > 1) {
    return (words[0].slice(0, 2)).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

function CommunityContent() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("joined");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { setIsImmersiveMode, isImmersiveMode } = useAppStore();

  const searchParams = useSearchParams();
  const urlGroupId = searchParams.get("groupId");

  const [activeGroupId, setActiveGroupId] = useState(urlGroupId || null);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (urlGroupId) {
      setActiveGroupId(urlGroupId);
    }
  }, [urlGroupId]);

  useEffect(() => {
    if (activeGroupId) {
      setIsImmersiveMode(true);
    } else {
      setIsImmersiveMode(false);
    }
    
    return () => setIsImmersiveMode(false);
  }, [activeGroupId, setIsImmersiveMode]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <div className={cn(
      "flex overflow-hidden bg-blue-50/50 relative font-sans transition-all duration-500",
      isImmersiveMode ? "h-screen" : "h-[calc(100vh-56px)] md:h-[calc(100vh-80px)]"
    )}>

      {/* Simplified background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30" />

      {}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {}
      <div className={cn(
        "absolute inset-y-0 left-0 z-[70] lg:z-10 w-80 shrink-0 flex flex-col border-r border-white/20 bg-white/40 backdrop-blur-xl transition-transform duration-300 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        activeGroupId && "lg:hidden"
      )}>

        {}
        <div className="flex items-center justify-between px-4 py-4 lg:hidden border-b border-skillio-50">
          <span className="font-black text-[#0d2133] tracking-tight uppercase text-xs">Pilih Bidang</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {}
        <div className="px-4 py-3 border-b border-white/20">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari bidang..."
              className="w-full pl-9 pr-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border-none text-sm font-medium text-dark-blue placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all"
            />
          </div>
        </div>

        {}
        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {}
          <div className="px-4 py-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setViewMode("joined")}
              className={cn(
                "py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                viewMode === "joined"
                  ? "bg-primary-blue text-white border-primary-blue shadow-lg shadow-primary-blue/20"
                  : "bg-white/50 text-slate-400 border-white/20 hover:border-white/40"
              )}
            >
              Grup Saya
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={cn(
                "py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                viewMode === "all"
                  ? "bg-primary-blue text-white border-primary-blue shadow-lg shadow-primary-blue/20"
                  : "bg-white/50 text-slate-400 border-white/20 hover:border-white/40"
              )}
            >
              Cari Grup
            </button>
          </div>

          {}
          <button
            onClick={() => {
              setSelectedCategory(null);
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left",
              !selectedCategory
                ? "bg-primary-blue/10 text-primary-blue"
                : "text-slate-600 hover:bg-white/30"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0",
                !selectedCategory
                  ? "bg-primary-blue text-white"
                  : "bg-white/50 text-primary-blue shadow-sm"
              )}
            >
              #
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">Semua Bidang</p>
              <p className="text-xs text-slate-400 font-medium">
                {categories.length} kategori
              </p>
            </div>
            {!selectedCategory && (
              <ChevronRight size={14} className="shrink-0 text-primary-blue" />
            )}
          </button>

          {}
          <div className="px-4 pt-4 pb-1">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-slate-300">
              Bidang
            </p>
          </div>

          {}
          {filteredCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const initials = getInitials(cat.name);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-3 transition-colors text-left",
                  isActive
                    ? "bg-primary-blue/10"
                    : "hover:bg-white/30"
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center font-black text-[13px] shrink-0",
                    isActive
                      ? "bg-[#2A75C4] text-white shadow-md shadow-blue-500/20"
                      : "bg-white/60 text-[#1E293B] shadow-sm border border-white/40"
                  )}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-bold text-sm truncate", isActive ? "text-[#2A75C4]" : "text-[#1E293B]")}>{cat.name}</p>
                  <p className="text-xs text-slate-400 font-medium truncate">
                    Komunitas · {cat.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("skillio:open-create-group"));
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent-blue transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            <Plus size={14} /> Buat Grup
          </button>
        </div>
      </div>

      {}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {!activeGroupId ? (
          <>
            {}
            <div className="px-6 py-5 border-b border-white/20 bg-white/30 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-primary-blue hover:bg-white/50 rounded-xl transition-all"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-xl font-black text-[#0d2133] tracking-tight font-display">
                    {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name ?? "Grup" : "Grup Komunitas"}
                  </h1>
                  <p className="text-[11px] text-[#92b7d6] font-bold uppercase tracking-wider mt-0.5">Komunitas Belajar</p>
                </div>
              </div>
              <button onClick={() => window.dispatchEvent(new CustomEvent("skillio:open-create-group"))} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-blue text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:bg-accent-blue transition-all active:scale-[0.98]">
                <Plus size={14} className="hidden sm:block" /> Buat Grup
              </button>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                <div className="relative z-10 min-h-full flex flex-col">
                  {}
                  <GroupList
                    categoryId={selectedCategory}
                    viewMode={viewMode}
                    onJoin={(id) => {
                      setActiveGroupId(id);
                      setViewMode("joined");
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (

          <GroupChat
            groupId={activeGroupId}
            onBack={() => setActiveGroupId(null)}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />

        )}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <React.Suspense fallback={<div className="flex h-[calc(100vh-56px)] md:h-[calc(100vh-80px)] items-center justify-center bg-[#f0f7ff] text-slate-400 font-bold text-sm">Memuat komunitas...</div>}>
      <CommunityContent />
    </React.Suspense>
  );
}