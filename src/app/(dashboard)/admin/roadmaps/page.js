"use client";

import React, { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { ShieldCheck, FileJson, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminRoadmapsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <h2 className="text-xl font-black text-dark-blue mb-6 border-b border-slate-100 pb-4">Daftar Kategori (Bidang Digital)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
