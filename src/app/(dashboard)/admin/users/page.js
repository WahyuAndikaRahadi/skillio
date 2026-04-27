"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  MoreVertical,
  Loader2,
  X,
  User,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchUsers = async (query = "") => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Gagal memuat user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: "Hapus Akun?",
      html: `Apakah Anda yakin ingin menghapus akun <b>${user.name}</b>?<br/><span class="text-xs text-red-500 font-bold">Tindakan ini permanen dan tidak bisa dibatalkan!</span>`,
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
      setIsDeleting(user.id);
      try {
        const res = await fetch("/api/admin/users", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Akun pengguna telah dihapus.",
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              popup: 'rounded-[32px]'
            }
          });
          setUsers(users.filter(u => u.id !== user.id));
        } else {
          const data = await res.json();
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: data.message || "Gagal menghapus user.",
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
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-primary-blue rounded-2xl">
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Pengguna</h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Pantau dan kelola seluruh anggota komunitas Skillio.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue outline-none transition-all shadow-sm font-medium"
          />
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-blue text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
          >
            Cari
          </button>
        </form>
      </motion.div>

      {/* Users Table / Grid */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-primary-blue animate-spin" />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Memuat data pengguna...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-400">User tidak ditemukan</h3>
            <p className="text-slate-300 font-medium mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pengguna</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Peran</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statistik</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bergabung</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={user.id} 
                    className="group hover:bg-slate-50/30 border-b border-slate-50 last:border-0 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[18px] bg-slate-100 overflow-hidden flex items-center justify-center font-black text-primary-blue text-lg shadow-sm border-2 border-white group-hover:scale-105 transition-transform">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <img 
                              src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user.name || user.id}`} 
                              alt={user.name} 
                              className="w-full h-full object-cover bg-blue-50" 
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 leading-none">{user.name || "N/A"}</span>
                          <span className="text-xs text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
                            <Mail size={12} className="text-slate-300" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        user.role === "admin" 
                          ? "bg-amber-50 text-amber-600 border border-amber-100" 
                          : "bg-blue-50 text-primary-blue border border-blue-100"
                      )}>
                        {user.role === "admin" ? <ShieldCheck size={12} /> : <User size={12} />}
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-[10px] font-black text-slate-900">
                          {user.xp} <span className="text-slate-300">XP</span>
                        </div>
                        {user.is_pro && (
                          <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded w-fit">
                            PRO Member
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Calendar size={14} className="text-slate-300" />
                        {new Date(user.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user)}
                        disabled={isDeleting === user.id}
                        className={cn(
                          "p-3 rounded-xl transition-all",
                          user.role === "admin" 
                            ? "text-slate-200 cursor-not-allowed" 
                            : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                        )}
                        title={user.role === "admin" ? "Admin tidak bisa dihapus" : "Hapus Akun"}
                      >
                        {isDeleting === user.id ? (
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
