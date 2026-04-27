"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Lock,
  Globe,
  Plus,
  ChevronRight,
  Loader2,
  MoreVertical,
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
        alert(errData.message || "Gagal buat grup");
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
          alert(data.message);
        }
      } else {
        if (data.requirePassword) {
          setJoinGroupId(groupId);
        } else {
          alert(data.message || "Terjadi kesalahan.");
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
      cancelButtonColor: "#f1f5f9",
      customClass: {
        confirmButton: "rounded-xl font-bold px-6 py-3",
        cancelButton: "rounded-xl font-bold px-6 py-3 text-slate-500",
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
    <div className="space-y-8 font-sans">
      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 text-primary-blue animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-400">Menjelajahi komunitas...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4 bg-[#f8fbfd] min-h-full">
          {displayedGroups.map((group) => {
            const isMember = group.members && group.members.length > 0;
            return (
              <motion.div
                key={group.id}
                onClick={() => isMember ? onJoin(group.id) : confirmJoin(group)}
                className="flex items-center gap-4 p-4 bg-white border border-slate-200/60 rounded-2xl hover:border-primary-blue/30 hover:shadow-sm transition-all cursor-pointer group relative"
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
                        {(session?.user?.id === group.created_by || session?.user?.role === "admin") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Hapus grup?")) {
                                fetch(`/api/community/groups/${group.id}`, { method: 'DELETE' }).then(res => {
                                  if (res.ok) fetchGroups();
                                });
                              }
                            }}
                            className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical size={14} />
                          </button>
                        )}
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

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6F0F9] rounded-full -translate-y-1/2 translate-x-1/2"></div>

              <h2 className="text-2xl font-black text-[#1E293B] mb-2 font-display">Buat Grup Baru</h2>
              <p className="text-slate-400 font-medium mb-8">Pimpin komunitas belajarmu sendiri.</p>

              <form onSubmit={handleCreateGroup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Nama Grup</label>
                  <input
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Misal: Web Dev Enthusiast"
                    className="w-full px-5 py-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A75C4] font-bold text-[#1E293B]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Kategori</label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A75C4] font-bold text-[#1E293B] appearance-none"
                  >
                    <option value="">Pilih Kategori (Opsional)</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Privasi</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setNewGroupPrivacy("public")}
                      className={cn(
                        "flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 font-bold transition-all text-sm",
                        newGroupPrivacy === "public" ? "border-[#2A75C4] bg-[#E6F0F9] text-[#2A75C4]" : "border-slate-100 text-slate-400"
                      )}
                    >
                      <Globe size={18} /> Publik
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewGroupPrivacy("private")}
                      className={cn(
                        "flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 font-bold transition-all text-sm",
                        newGroupPrivacy === "private" ? "border-[#2A75C4] bg-[#E6F0F9] text-[#2A75C4]" : "border-slate-100 text-slate-400"
                      )}
                    >
                      <Lock size={18} /> Privat
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
                      <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 mt-2 block">Password Grup</label>
                      <input
                        required
                        type="password"
                        value={newGroupPassword}
                        onChange={(e) => setNewGroupPassword(e.target.value)}
                        placeholder="Buat password untuk grup ini..."
                        className="w-full px-5 py-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A75C4] font-bold text-[#1E293B]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Deskripsi</label>
                  <textarea
                    required
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="Jelaskan visi grup ini..."
                    rows={3}
                    className="w-full px-5 py-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A75C4] font-medium text-[#1E293B] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full mt-2 py-4 bg-[#2A75C4] text-white rounded-xl font-black shadow-md hover:bg-[#1A406B] transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {isCreating ? <Loader2 className="animate-spin mx-auto" /> : "Buat Sekarang"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join Private Group Modal */}
      <AnimatePresence>
        {joinGroupId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setJoinGroupId(null); setJoinPassword(""); }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock size={28} />
              </div>

              <h2 className="text-xl font-black text-[#1E293B] mb-2">Grup Privat</h2>
              <p className="text-sm text-slate-400 font-medium mb-8">Masukkan password untuk bergabung.</p>

              <form onSubmit={(e) => { e.preventDefault(); handleJoin(joinGroupId, joinPassword); }} className="space-y-6">
                <input
                  required
                  type="password"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  placeholder="Password..."
                  className="w-full px-5 py-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A75C4] font-bold text-[#1E293B] text-center tracking-widest"
                />

                <button
                  type="submit"
                  disabled={isJoining}
                  className="w-full py-4 bg-[#2A75C4] text-white rounded-xl font-black shadow-md hover:bg-[#1A406B] transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center"
                >
                  {isJoining ? <Loader2 className="animate-spin" /> : "Masuk"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}