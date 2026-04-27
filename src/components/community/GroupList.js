"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Lock,
  Globe,
  Plus,
  ChevronRight,
  ChevronDown,
  Loader2,
  MoreVertical,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function GroupList({ categoryId, onJoin, viewMode = "all" }) {

  const { data: session } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Group Form States
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupPrivacy, setNewGroupPrivacy] = useState("public");
  const [newGroupPassword, setNewGroupPassword] = useState("");
  const [newGroupCategory, setNewGroupCategory] = useState(categoryId || "");
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState([]);

  // Join Group States
  const [joinGroupId, setJoinGroupId] = useState(null);
  const [joinPassword, setJoinPassword] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/community/groups");
      const data = await res.json();
      if (res.ok) setGroups(data);
    } catch (err) {
      console.error("Gagal muat grup");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleOpenCreate = () => setShowCreateModal(true);
    window.addEventListener("skillio:open-create-group", handleOpenCreate);
    return () => window.removeEventListener("skillio:open-create-group", handleOpenCreate);
  }, []);

  useEffect(() => {
    fetchGroups();
    const fetchCats = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) setCategories(data);
    };
    fetchCats();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName || !newGroupDesc) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/community/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDesc,
          privacy: newGroupPrivacy,
          password: newGroupPassword,
          categoryId: newGroupCategory || null
        })
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewGroupName("");
        setNewGroupDesc("");
        setNewGroupPassword("");
        fetchGroups();
      } else {
        const errData = await res.json();
        Swal.fire({
          icon: "error",
          title: "Gagal Buat Grup",
          text: errData.message || "Pastikan semua data terisi dengan benar.",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (err) {
      console.error("Gagal buat grup");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = async (groupId, password = "") => {
    setIsJoining(true);
    try {
      const res = await fetch(`/api/community/groups/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (res.ok) {
        if (data.status === "approved") {
          setJoinGroupId(null);
          setJoinPassword("");
          // Ganti router.push menjadi onJoin
          onJoin(groupId); // <--- PERUBAHAN DI SINI
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal Bergabung",
            text: data.message,
            confirmButtonColor: "#2563eb",
          });
        }
      } else {
        if (data.requirePassword) {
          setJoinGroupId(groupId);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message || "Terjadi kesalahan sistem.",
            confirmButtonColor: "#2563eb",
          });
        }
      }
    } catch (err) {
      console.error("Gagal join");
    } finally {
      setIsJoining(false);
    }
  };

  const displayedGroups = groups.filter((g) => {
    // Filter by Category if selected
    if (categoryId) {
      const targetId = String(categoryId);
      const groupCatId = String(g.categoryId || g.category_id || g.category?.id);
      if (groupCatId !== targetId) return false;
    }

    // Filter by View Mode (Joined vs All)
    const isMember = g.members && g.members.length > 0;
    
    if (viewMode === "joined") {
      if (!isMember) return false;
    } else {
      // viewMode === 'all' (Cari Grup)
      // JANGAN munculkan grup yang sudah kita masuki
      if (isMember) return false;
    }

    return true;
  });

  const confirmJoin = (group) => {
    MySwal.fire({
      title: `<span class="font-display">Gabung Komunitas?</span>`,
      html: `<p class="text-slate-500 font-medium">Apakah kamu yakin ingin bergabung dengan grup <b>${group.name}</b>?</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Gabung!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2b6ea6",
      cancelButtonColor: "#ef4444",
      customClass: {
        confirmButton: "rounded-xl font-bold px-6 py-3",
        cancelButton: "rounded-xl font-bold px-6 py-3 text-white",
        popup: "rounded-[32px] p-8",
      },
      buttonsStyling: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleJoin(group.id);
      }
    });
  };

  return (
    <div className="space-y-8 font-sans relative flex-1 flex flex-col">
      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 text-primary-blue animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-400">Menjelajahi komunitas...</p>
        </div>
      ) : showCreateModal ? (
        /* Inline Create Group Card - Takes over when creating */
        <AnimatePresence mode="wait">
          <motion.div
            key="create-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="m-4 overflow-hidden bg-white rounded-[32px] border border-primary-blue/20 shadow-xl shadow-blue-500/5"
          >
            {/* Header Decoration */}
            <div className="h-1.5 bg-gradient-to-r from-primary-blue via-blue-400 to-indigo-500" />
            
            <div className="p-7 md:p-9">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Buat Grup Baru</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pimpin komunitas belajarmu</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-colors hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Nama Grup</label>
                    <input
                      required
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Misal: Web Dev Enthusiast"
                      className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 font-black text-sm text-slate-900 placeholder-slate-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Kategori</label>
                    <div className="relative">
                      <select
                        value={newGroupCategory}
                        onChange={(e) => setNewGroupCategory(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 font-black text-sm text-slate-900 appearance-none cursor-pointer"
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Tipe Privasi</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setNewGroupPrivacy("public")}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left",
                        newGroupPrivacy === "public" ? "border-primary-blue bg-blue-50/30" : "border-slate-100 bg-white"
                      )}
                    >
                      <div className={cn("p-2 rounded-lg", newGroupPrivacy === "public" ? "bg-primary-blue text-white" : "bg-slate-50 text-slate-400")}>
                        <Globe size={16} />
                      </div>
                      <div>
                        <p className={cn("text-[10px] font-black uppercase", newGroupPrivacy === "public" ? "text-primary-blue" : "text-slate-500")}>Publik</p>
                        <p className="text-[8px] font-bold text-slate-400">Semua bisa join</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewGroupPrivacy("private")}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left",
                        newGroupPrivacy === "private" ? "border-primary-blue bg-blue-50/30" : "border-slate-100 bg-white"
                      )}
                    >
                      <div className={cn("p-2 rounded-lg", newGroupPrivacy === "private" ? "bg-primary-blue text-white" : "bg-slate-50 text-slate-400")}>
                        <Lock size={16} />
                      </div>
                      <div>
                        <p className={cn("text-[10px] font-black uppercase", newGroupPrivacy === "private" ? "text-primary-blue" : "text-slate-500")}>Privat</p>
                        <p className="text-[8px] font-bold text-slate-400">Butuh password</p>
                      </div>
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {newGroupPrivacy === "private" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Password</label>
                      <input
                        required
                        type="password"
                        value={newGroupPassword}
                        onChange={(e) => setNewGroupPassword(e.target.value)}
                        placeholder="Password grup..."
                        className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 font-black text-sm text-slate-900 tracking-widest"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Visi & Misi</label>
                  <textarea
                    required
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="Deskripsi grup..."
                    rows={3}
                    className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 font-medium text-sm text-slate-900 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3.5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-[2] py-3.5 bg-primary-blue text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isCreating ? <Loader2 className="animate-spin mx-auto w-4 h-4" /> : "Buat Grup Sekarang"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Normal Group List View */
        <div className="flex flex-col gap-3 p-4 bg-transparent min-h-full">
          {displayedGroups.map((group) => {
            const isMember = group.members && group.members.length > 0;
            return (
              <motion.div
                key={group.id}
                onClick={() => isMember ? onJoin(group.id) : confirmJoin(group)}
                className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary-blue/30 hover:shadow-md transition-all cursor-pointer group relative shadow-sm"
              >

                {/* Avatar Style WhatsApp */}
                <div className="w-14 h-14 shrink-0 rounded-full bg-[#E6F0F9] flex items-center justify-center font-black text-xl text-[#2A75C4] overflow-hidden border-2 border-white shadow-sm">
                  {group.image_url ? (
                    <img src={group.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    group.name[0]
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-black text-[#1E293B] text-base truncate flex items-center gap-2 font-display">
                      {group.name}
                      {group.privacy === "private" && <Lock size={12} className="text-slate-400" />}
                    </h4>

                    <span className="text-[10px] font-bold text-[#7EA6CD] uppercase tracking-wider shrink-0 bg-slate-50 px-2 py-1 rounded-md">
                      {group.category?.name || "Umum"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium truncate pr-10">
                    {group.messages && group.messages.length > 0 ? (
                      <>
                        <span className="text-primary-blue font-bold">{group.messages[0].user.name.split(" ")[0]}: </span>
                        {group.messages[0].content}
                      </>
                    ) : (
                      group.description || "Bergabunglah dengan komunitas ini untuk berdiskusi."
                    )}
                  </p>

                </div>

                {/* Meta & Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-slate-400">
                     <Users size={14} className="text-primary-blue/60" />
                     <span className="text-xs font-bold text-primary-blue">{group._count?.members || 0}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!isMember ? (
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           confirmJoin(group);
                         }}
                         className="px-4 py-1.5 bg-primary-blue text-white text-xs font-black rounded-lg hover:bg-accent-blue transition-all shadow-sm shadow-blue-500/10"
                       >
                         Gabung
                       </button>
                    ) : (
                      <>
                        {/* Delete option removed based on user request */}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary-blue opacity-0 group-hover:opacity-100 group-hover:bg-primary-blue/5 transition-all">
                          <ChevronRight size={18} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {displayedGroups.length === 0 && (
            <div className="py-24 px-10 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Users className="text-slate-200" size={40} />
              </div>
              <p className="text-slate-400 font-bold text-lg mb-1">
                {viewMode === "joined" ? "Belum Bergabung" : "Tidak Ada Grup"}
              </p>
              <p className="text-slate-300 text-sm max-w-xs mx-auto">
                {viewMode === "joined" 
                  ? "Kamu belum bergabung dengan komunitas manapun di kategori ini." 
                  : "Belum ada grup yang dibuat untuk bidang ini."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Join Private Group Modal */}
      <AnimatePresence>
        {joinGroupId && (
          <div className="absolute inset-0 z-[9999] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setJoinGroupId(null); setJoinPassword(""); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100"
            >
              {/* Technical Header Decoration */}
              <div className="h-2 bg-gradient-to-r from-red-500 via-orange-400 to-amber-500" />
              
              <div className="p-10 md:p-12 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Lock size={32} />
                </div>

                <div className="space-y-2 mb-10">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">Komunitas Privat</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Masukkan password akses untuk bergabung</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleJoin(joinGroupId, joinPassword); }} className="space-y-6">
                  <div className="space-y-2.5 text-left">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Password Akses</label>
                    <div className="relative">
                      <input
                        required
                        type="password"
                        value={joinPassword}
                        onChange={(e) => setJoinPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 font-black text-slate-900 text-center tracking-[0.5em] placeholder-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isJoining}
                      className="w-full group relative overflow-hidden py-5 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {isJoining ? (
                        <Loader2 className="animate-spin mx-auto w-5 h-5" />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Buka Akses <ChevronRight size={16} />
                        </span>
                      )}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => { setJoinGroupId(null); setJoinPassword(""); }}
                      className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Bottom Decoration */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-50/50" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}