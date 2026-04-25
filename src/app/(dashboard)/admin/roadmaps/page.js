"use client";

import React, { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { ShieldCheck, FileJson, CheckCircle2, AlertCircle } from "lucide-react";

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

  const handleUploadComplete = async (categoryId, res) => {
    if (res && res[0]) {
      const fileUrl = res[0].url;
      try {
        await fetch("/api/admin/categories/update-roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId, fileUrl })
        });
        alert("Roadmap JSON berhasil diunggah!");
        fetchCategories();
      } catch (error) {
        alert("Gagal menyimpan URL Roadmap");
      }
    }
  };

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-400">Memuat data kategori...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="bg-dark-blue rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <ShieldCheck className="absolute -right-10 -top-10 w-64 h-64 text-white/5" />
        <h1 className="text-3xl md:text-4xl font-black mb-4 relative z-10">Admin Panel: Manajemen Roadmap</h1>
        <p className="text-blue-200 font-medium max-w-2xl relative z-10">
          Unggah kurikulum dalam format JSON untuk setiap bidang digital. File JSON ini akan menjadi sumber materi bagi pengguna. Database tidak akan menyimpan materi hari demi hari, melainkan membaca langsung dari URL yang Anda unggah.
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
          {filteredCategories.length > 0 ? filteredCategories.map((category) => (
            <div key={category.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-dark-blue text-lg">{category.name}</h3>
                  <p className="text-xs font-bold text-slate-400">{category.slug}</p>
                </div>
                {category.roadmap?.file_url ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black flex items-center gap-1">
                    <CheckCircle2 size={14} /> Terisi
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-black flex items-center gap-1">
                    <AlertCircle size={14} /> Kosong
                  </span>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-200">
                {category.roadmap?.file_url ? (
                  <div className="flex flex-col gap-2">
                    <a href={category.roadmap.file_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary-blue hover:underline break-all flex items-center gap-1">
                      <FileJson size={14} /> Lihat File JSON Saat Ini
                    </a>
                    <div className="text-xs text-slate-500 mt-2">Timpa dengan file baru:</div>
                    <UploadButton
                      endpoint="jsonUploader"
                      onClientUploadComplete={(res) => handleUploadComplete(category.id, res)}
                      onUploadError={(error) => alert(`ERROR! ${error.message}`)}
                      appearance={{
                        button: "bg-orange-500 text-white font-bold text-sm w-full py-2 rounded-xl"
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="text-xs font-bold text-slate-500 mb-2">Unggah JSON Kurikulum 30 Hari:</div>
                    <UploadButton
                      endpoint="jsonUploader"
                      onClientUploadComplete={(res) => handleUploadComplete(category.id, res)}
                      onUploadError={(error) => alert(`ERROR! ${error.message}`)}
                      appearance={{
                        button: "bg-primary-blue text-white font-bold text-sm w-full py-2 rounded-xl"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="col-span-1 md:col-span-2 py-10 text-center">
              <p className="text-slate-400 font-medium italic">Kategori tidak ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
