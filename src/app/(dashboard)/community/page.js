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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Fungsi bantuan untuk mengambil singkatan (misal: "Desain Antarmuka" -> "DE")
const getInitials = (name) => {
  const words = name.trim().split(" ");
  if (words.length > 1) {
    return (words[0].slice(0, 2)).toUpperCase(); // Mengikuti gambar: Desain Antarmuka -> DE
  }
  return name.slice(0, 2).toUpperCase();
};

export default function CommunityPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    // Full viewport, no outer padding — fills the layout shell exactly
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-white">

      {/* ── LEFT PANEL ────────────────────────────────────────────────────── */}
      <div className="w-80 shrink-0 flex flex-col border-r border-skillio-100 bg-white">

        {/* Search bar */}
        <div className="px-4 py-3 border-b border-skillio-100">
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
              className="w-full pl-9 pr-4 py-2 bg-skillio-50 rounded-xl border-none text-sm font-medium text-dark-blue placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
            />
          </div>
        </div>

        {/* Scrollable category list */}
        <div className="flex-1 overflow-y-auto">

          {/* "All" row */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left",
              !selectedCategory
                ? "bg-skillio-100 text-primary-blue"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0",
                !selectedCategory
                  ? "bg-primary-blue text-white"
                  : "bg-skillio-100 text-primary-blue"
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

          {/* Divider label */}
          <div className="px-4 pt-4 pb-1">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-slate-300">
              Bidang
            </p>
          </div>

          {/* Category rows */}
          {filteredCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const initials = getInitials(cat.name);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-3 transition-colors text-left",
                  isActive
                    ? "bg-[#E6F0F9]"
                    : "hover:bg-slate-50"
                )}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center font-black text-[13px] shrink-0",
                    isActive
                      ? "bg-[#2A75C4] text-white"
                      : "bg-[#E2E8F0] text-[#1E293B]"
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

          {filteredCategories.length === 0 && searchQuery && (
            <p className="px-4 py-6 text-sm text-slate-300 font-medium text-center">
              Tidak ada bidang ditemukan.
            </p>
          )}
        </div>

        {/* Create group CTA at bottom */}
        <div className="p-4 border-t border-skillio-100">
          <button
            onClick={() => {
              // Trigger create modal via GroupList — we'll use a custom event
              window.dispatchEvent(new CustomEvent("skillio:open-create-group"));
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent-blue transition-colors"
          >
            <Plus size={14} /> Buat Grup
          </button>
        </div>
      </div>

      {/* ── RIGHT PANEL (DINAMIS: LIST ATAU CHAT) ────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#edf4f8] relative">
        {!activeGroupId ? (
          <>
            {/* Tampilan List Grup */}
            <div className="px-8 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-xl flex items-center justify-between shrink-0 shadow-sm z-10">
              <div>
                <h1 className="text-2xl font-black text-[#0d2133] tracking-tight">
                  {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name ?? "Grup" : "Grup Komunitas"}
                </h1>
                <p className="text-sm text-[#92b7d6] font-medium mt-1">Temukan tempat belajar dan diskusi yang lebih privat.</p>
              </div>
              <button onClick={() => window.dispatchEvent(new CustomEvent("skillio:open-create-group"))} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d2133] text-white text-sm font-bold shadow-md hover:bg-[#1f547e] transition-colors">
                <Sparkles size={16} className="text-white/80" /> Bangun Komunitasmu
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar relative">
              {/* Pattern Background Tipis */}
              <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: `linear-gradient(rgba(146, 183, 214, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(146, 183, 214, 0.15) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
              <div className="relative z-10">
                {/* Prop onJoin dikirim ke GroupList */}
                <GroupList categoryId={selectedCategory} onJoin={(id) => setActiveGroupId(id)} />
              </div>
            </div>
          </>
        ) : (
          /* Tampilan Chat Room */
          <GroupChat groupId={activeGroupId} onBack={() => setActiveGroupId(null)} />
        )}
      </div>
    </div>
  );
}