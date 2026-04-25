"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, Zap, Search } from "lucide-react";

export default function AdminRoadmapsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filledCount = categories.filter(c => c.roadmap?.file_url).length;
  const emptyCount = categories.length - filledCount;

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-400">Memuat data kategori...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="bg-dark-blue rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <ShieldCheck className="absolute -right-10 -top-10 w-64 h-64 text-white/5" />
        <h1 className="text-3xl md:text-4xl font-black mb-4 relative z-10">Status Kurikulum AI</h1>
        <p className="text-blue-200 font-medium max-w-2xl relative z-10">
          Kurikulum untuk setiap bidang di-generate otomatis oleh AI saat pertama kali user membutuhkannya, lalu di-cache di database. Tidak diperlukan intervensi manual.
        </p>
        <div className="flex gap-6 mt-6 relative z-10">
          <div className="bg-white/10 rounded-2xl px-6 py-4">
            <p className="text-3xl font-black text-white">{filledCount}</p>
            <p className="text-blue-200 text-sm font-bold">Sudah Ter-generate</p>
          </div>
          <div className="bg-white/10 rounded-2xl px-6 py-4">
            <p className="text-3xl font-black text-white">{emptyCount}</p>
            <p className="text-blue-200 text-sm font-bold">Belum Diminta User</p>
          </div>
          <div className="bg-white/10 rounded-2xl px-6 py-4">
            <p className="text-3xl font-black text-white">{categories.length}</p>
            <p className="text-blue-200 text-sm font-bold">Total Bidang</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
        <Zap className="text-emerald-600 shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-black text-emerald-900">Sistem Auto-Generate Aktif</p>
          <p className="text-emerald-700 text-sm font-medium mt-1">
            Saat user memilih suatu bidang dan membuka Ruang Belajar, sistem akan otomatis meminta AI untuk membuat kurikulum jika belum tersedia. 
            Kurikulum yang sudah dibuat akan disimpan dan digunakan ulang untuk semua user yang memilih bidang yang sama.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-slate-100 pb-4 gap-4">
          <h2 className="text-xl font-black text-dark-blue">Status 50 Bidang Digital</h2>
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all text-sm font-medium"
            />
            <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" size={20} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCategories.length > 0 ? filteredCategories.map((category) => {
            const isFilled = !!category.roadmap?.file_url;
            return (
              <div key={category.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-black text-dark-blue">{category.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">{category.slug}</p>
                </div>
                {isFilled ? (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-black flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 size={12} /> Tersedia
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-black flex items-center gap-1.5 shrink-0">
                    <AlertCircle size={12} /> Menunggu User
                  </span>
                )}
              </div>
            );
          }) : (
            <div className="col-span-2 py-10 text-center">
              <p className="text-slate-400 font-medium italic">Kategori tidak ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
