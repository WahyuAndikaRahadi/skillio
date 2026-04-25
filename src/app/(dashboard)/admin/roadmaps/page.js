"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, FileJson, CheckCircle2, AlertCircle, Bot, Save, Loader2, Edit3, X } from "lucide-react";

export default function AdminRoadmapsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // AI Generation States
  const [isGenerating, setIsGenerating] = useState(null); // stores category id
  const [editingJson, setEditingJson] = useState(null); // stores { categoryId, categorySlug, content }
  const [isPublishing, setIsPublishing] = useState(false);

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

  const handleGenerateAI = async (category) => {
    if (!confirm(`Generate kurikulum 30 hari untuk ${category.name}? Proses ini mungkin memakan waktu 30-60 detik.`)) return;
    
    setIsGenerating(category.id);
    try {
      const res = await fetch("/api/admin/roadmaps/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: category.name })
      });
      const data = await res.json();
      
      if (res.ok && data.data) {
        // Open the editor with the generated JSON
        setEditingJson({
          categoryId: category.id,
          categorySlug: category.slug,
          categoryName: category.name,
          content: JSON.stringify(data.data, null, 2)
        });
      } else {
        alert(`Gagal Generate: ${data.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan saat memanggil AI.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handlePublish = async () => {
    if (!editingJson) return;
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(editingJson.content);
    } catch (e) {
      alert("Format JSON tidak valid! Silakan perbaiki sebelum menyimpan.");
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch("/api/admin/roadmaps/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category_slug: editingJson.categorySlug,
          content_json: parsedContent
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Berhasil menyimpan kurikulum ke Database Soal!");
        setEditingJson(null);
        fetchCategories(); // Refresh list
      } else {
        alert(`Gagal menyimpan: ${data.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan saat menyimpan data.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-400">Memuat data kategori...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative">
      <div className="bg-dark-blue rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <ShieldCheck className="absolute -right-10 -top-10 w-64 h-64 text-white/5" />
        <h1 className="text-3xl md:text-4xl font-black mb-4 relative z-10">Admin Panel: Manajemen Kurikulum AI</h1>
        <p className="text-blue-200 font-medium max-w-2xl relative z-10">
          Generate kurikulum lengkap 30 hari beserta soal kuis secara otomatis menggunakan Gemini AI. Anda dapat me-review dan mengedit hasil JSON sebelum menyimpannya ke Database Soal terpisah.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-slate-100 pb-4 gap-4">
          <h2 className="text-xl font-black text-dark-blue">Daftar Kategori (Bidang Digital)</h2>
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all text-sm font-medium"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCategories.length > 0 ? filteredCategories.map((category) => {
            const isFilled = category.roadmap?.file_url === "internal://question-db" || category.roadmap?.file_url;
            return (
              <div key={category.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-dark-blue text-lg">{category.name}</h3>
                    <p className="text-xs font-bold text-slate-400">{category.slug}</p>
                  </div>
                  {isFilled ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black flex items-center gap-1">
                      <CheckCircle2 size={14} /> Tersedia
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-black flex items-center gap-1">
                      <AlertCircle size={14} /> Kosong
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleGenerateAI(category)}
                    disabled={isGenerating === category.id}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-500/20 disabled:opacity-70"
                  >
                    {isGenerating === category.id ? (
                      <><Loader2 className="animate-spin" size={18} /> Generating AI...</>
                    ) : (
                      <><Bot size={18} /> {isFilled ? "Generate Ulang" : "Generate via AI"}</>
                    )}
                  </button>
                  {isFilled && (
                    <p className="text-center text-[10px] text-slate-400 font-bold mt-2">
                      Kurikulum sudah tersimpan di Database Soal.
                    </p>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="col-span-1 md:col-span-2 py-10 text-center">
              <p className="text-slate-400 font-medium italic">Kategori tidak ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ JSON EDITOR MODAL ═══ */}
      {editingJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="text-purple-600" /> Preview & Edit Kurikulum
                </h3>
                <p className="text-sm font-bold text-slate-500 mt-1">{editingJson.categoryName}</p>
              </div>
              <button 
                onClick={() => {
                  if (confirm("Yakin ingin membatalkan? Hasil generate AI belum tersimpan.")) {
                    setEditingJson(null);
                  }
                }}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 bg-[#1e1e1e] p-4 overflow-hidden flex flex-col">
              <textarea
                value={editingJson.content}
                onChange={(e) => setEditingJson(prev => ({ ...prev, content: e.target.value }))}
                className="w-full flex-1 bg-transparent text-[#d4d4d4] font-mono text-sm outline-none resize-none custom-scrollbar"
                spellCheck={false}
              />
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-4">
              <button
                onClick={() => setEditingJson(null)}
                className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                {isPublishing ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Simpan & Kirim
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
