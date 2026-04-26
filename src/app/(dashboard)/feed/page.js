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
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [communityGroups, setCommunityGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

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
          // Ambil 5 komunitas teratas (atau semua jika kurang dari 5)
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

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center font-sans">
      <div className="w-full bg-white overflow-hidden flex flex-col">

        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-8 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 gap-8">

          {/* LEFT SIDEBAR (Navigation & Categories) */}
          <div className="hidden lg:flex flex-col w-64 shrink-0 space-y-8 px-6 py-6">
            <nav className="space-y-1">
              {[
                { icon: Home, label: "Home", active: !selectedCategory },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => item.label === "Home" && setSelectedCategory(null)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                    item.active
                      ? "bg-primary-blue/10 text-primary-blue"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon size={18} className={item.active ? "text-primary-blue" : "text-slate-400"} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-4 px-4">ALL COMMUNITIES</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      selectedCategory === cat.id
                        ? "bg-primary-blue/10 text-primary-blue"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      selectedCategory === cat.id ? "bg-blue-100 text-primary-blue" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}>
                      <Hash size={14} />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN (Main Feed) */}
          <div className="flex-1 max-w-2xl xl:max-w-3xl py-6">
            <SocialFeed categoryId={selectedCategory} />
          </div>

          {/* RIGHT SIDEBAR (Widgets & Promo) */}
          <div className="hidden xl:flex flex-col w-72 shrink-0 space-y-8 px-6 py-6">
            <div className="bg-gradient-to-br from-dark-blue to-primary-blue rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-primary-blue/20">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <Sparkles className="mb-4 text-white/50" size={24} />
              <h4 className="text-lg font-bold mb-2 leading-tight">Rayakan Pencapaianmu</h4>
              <p className="text-sm text-white/80 font-medium leading-relaxed">
                Setiap hari yang kamu selesaikan adalah langkah nyata menuju masa depan.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Top Communities</h3>
                <button
                  onClick={() => router.push('/community')}
                  className="text-primary-blue text-xs font-semibold hover:underline"
                >
                  See All
                </button>
              </div>
              <div className="space-y-3">
                {loadingGroups ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-slate-200 rounded w-full"></div>
                          <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : communityGroups.length > 0 ? (
                  communityGroups.map((group, i) => {
                    const colors = [
                      'bg-teal-400', 'bg-slate-800', 'bg-orange-500', 'bg-pink-300', 'bg-blue-400'
                    ];
                    const categoryName = group.category?.name || 'General';

                    return (
                      <button
                        key={group.id}
                        onClick={() => router.push(`/community?groupId=${group.id}`)} 
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm ${colors[i % colors.length]}`}>
                          {group.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate group-hover:text-primary-blue transition-colors">
                            {group.name}
                          </p>
                          <span className="text-xs text-primary-blue font-semibold bg-blue-50 px-2 py-0.5 rounded inline-block">
                            {categoryName}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-500">No communities yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}