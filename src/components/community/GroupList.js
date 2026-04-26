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

export default function GroupList({ categoryId, onJoin }) {
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

  const displayedGroups = categoryId 
    ? groups.filter((g) => {
        const targetId = String(categoryId);
        return (
          String(g.categoryId) === targetId || 
          String(g.category_id) === targetId || 
          String(g.category?.id) === targetId
        );
      })
    : groups;

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 text-primary-blue animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-400">Menjelajahi komunitas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. UBAH groups.map MENJADI displayedGroups.map */}
          {displayedGroups.map((group) => (
            <motion.div
              key={group.id}
              whileHover={{ y: -3 }}
              className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 shrink-0 rounded-[16px] bg-[#E6F0F9] flex items-center justify-center font-black text-2xl text-[#2A75C4] overflow-hidden">
                  {group.image_url ? <img src={group.image_url} alt="" className="w-full h-full object-cover" /> : group.name[0]}
                </div>
                <div className="flex-1 mt-1">
                  <h4 className="font-black text-[#1E293B] text-lg flex items-center gap-2 leading-tight">
                    {group.name}
                    {group.privacy === "private" ? (
                      <Lock size={14} className="text-[#3b82f6]" />
                    ) : (
                      <Globe size={14} className="text-[#3b82f6]" />
                    )}
                  </h4>
                  <p className="text-[11px] font-bold text-[#7EA6CD] uppercase tracking-widest mt-1">
                    {group.category?.name || "KATEGORI UMUM"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                {group.description}
              </p>

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                <div className="flex items-center gap-5 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Users size={16} className="text-[#6366F1]" />
                    <span className="text-[#6366F1] font-black">{group._count?.members || 0}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                    Aktif
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {(session?.user?.id === group.created_by || session?.user?.role === "admin") && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm("Yakin ingin menghapus grup ini secara permanen?")) {
                          try {
                            const res = await fetch(`/api/community/groups/${group.id}`, { method: 'DELETE' });
                            if (res.ok) fetchGroups();
                            else alert("Gagal menghapus grup");
                          } catch (err) { alert("Terjadi kesalahan"); }
                        }
                      }}
                      className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Hapus Grup"
                    >
                      <MoreVertical size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleJoin(group.id)}
                    className="flex items-center gap-1 px-5 py-2.5 bg-[#F8FAFC] border border-slate-100 text-slate-400 rounded-xl font-bold text-xs hover:bg-[#F1F5F9] hover:text-slate-600 transition-all"
                  >
                    Masuk <ChevronRight size={14} className="opacity-50" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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

              <h2 className="text-2xl font-black text-[#1E293B] mb-2">Buat Grup Baru</h2>
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