"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Trash2,
  ShieldAlert,
  Lock,
  Globe,
  Calendar,
  Loader2,
  MessageSquare,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchGroups = async (query = "") => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/community/groups?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) {
        setGroups(data);
      }
    } catch (err) {
      console.error("Gagal memuat grup:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGroups(search);
  };

  const handleDeleteGroup = async (group) => {
    const result = await Swal.fire({
      title: "Hapus Komunitas?",
      html: `Apakah Anda yakin ingin menghapus grup <b>${group.name}</b>?<br/><span class="text-xs text-red-500 font-bold">Semua pesan dan anggota di dalamnya akan terhapus permanen!</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus Permanen",
      cancelButtonText: "Batal",
      customClass: {
        popup: 'rounded-[32px] p-8',
        confirmButton: 'rounded-xl px-6 py-3 font-bold',
        cancelButton: 'rounded-xl px-6 py-3 font-bold'
      }
    });

    if (result.isConfirmed) {
      setIsDeleting(group.id);
      try {
        const res = await fetch(`/api/community/groups/${group.id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Komunitas telah dihapus.",
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              popup: 'rounded-[32px]'
            }
          });
          setGroups(groups.filter(g => g.id !== group.id));
        } else {
          const data = await res.json();
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: data.message || "Gagal menghapus grup.",
            confirmButtonColor: "#2563eb",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Terjadi kesalahan sistem.",
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 md:px-10 space-y-10 relative z-10">
      {}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Komunitas</h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Moderasi dan kelola seluruh grup komunitas Skillio.</p>
        </div>

        {}
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama komunitas..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium"
          />
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors"
          >
            Cari
          </button>
        </form>
      </motion.div>

      {}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Memuat data komunitas...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-400">Komunitas tidak ditemukan</h3>
            <p className="text-slate-300 font-medium mt-1">Belum ada grup yang dibuat atau coba kata kunci lain.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Komunitas</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Privasi</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statistik</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dibuat</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={group.id}
                    className="group hover:bg-slate-50/30 border-b border-slate-50 last:border-0 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[18px] bg-indigo-50 overflow-hidden flex items-center justify-center font-black text-indigo-600 text-lg shadow-sm border-2 border-white group-hover:scale-105 transition-transform shrink-0">
                          {group.image_url ? (
                            <img src={group.image_url} alt={group.name} className="w-full h-full object-cover" />
                          ) : (
                            group.name?.[0]?.toUpperCase() || "G"
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-slate-900 leading-none truncate">{group.name || "N/A"}</span>
                          <span className="text-xs text-slate-400 font-medium mt-1.5 truncate max-w-[200px]">
                            {group.description || "Tidak ada deskripsi"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                        <Hash size={12} />
                        {group.category?.name || "Umum"}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        group.privacy === "private"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      )}>
                        {group.privacy === "private" ? <Lock size={12} /> : <Globe size={12} />}
                        {group.privacy}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-[10px] font-black text-slate-900 flex items-center gap-2">
                          <Users size={12} className="text-slate-300" />
                          {group._count?.members || 0} <span className="text-slate-300">Members</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-900 flex items-center gap-2">
                          <MessageSquare size={12} className="text-slate-300" />
                          {group._count?.messages || 0} <span className="text-slate-300">Pesan</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Calendar size={14} className="text-slate-300" />
                        {new Date(group.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDeleteGroup(group)}
                        disabled={isDeleting === group.id}
                        className="p-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Hapus Komunitas"
                      >
                        {isDeleting === group.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
