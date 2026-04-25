"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Lock, 
  Globe, 
  MessageCircle, 
  Plus, 
  ChevronRight, 
  Loader2, 
  Send, 
  ArrowLeft,
  Settings,
  MoreVertical,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GroupList({ categoryId }) {
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
    fetchGroups();
    const fetchCats = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) setCategories(data);
    };
    fetchCats();
  }, [categoryId]);

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
           router.push(`/community/chat/${groupId}`);
        } else {
           alert(data.message);
        }
      } else {
        if (data.requirePassword) {
           // Show password modal
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

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="text-center py-20">
           <Loader2 className="w-12 h-12 text-primary-blue animate-spin mx-auto mb-4" />
           <p className="font-black text-slate-400">Menjelajahi komunitas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <motion.div 
              key={group.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[40px] border border-light-blue p-6 shadow-sm hover:shadow-xl hover:border-primary-blue/20 transition-all group"
            >
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-[24px] bg-primary-blue/10 flex items-center justify-center font-black text-2xl text-primary-blue overflow-hidden shadow-inner">
                     {group.image_url ? <img src={group.image_url} alt="" /> : group.name[0]}
                  </div>
                  <div className="flex-1">
                     <h4 className="font-black text-dark-blue flex items-center gap-2">
                        {group.name}
                        {group.privacy === "private" ? <Lock size={14} className="text-slate-300" /> : <Globe size={14} className="text-green-400" />}
                     </h4>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{group.category?.name || "Umum"}</p>
                  </div>
               </div>
               
               <p className="text-sm text-dark-blue/60 font-medium leading-relaxed mb-8 line-clamp-2">
                 {group.description}
               </p>

               <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                     <span className="flex items-center gap-1.5"><Users size={14} /> {group._count?.members || 0} Member</span>
                     <span className="flex items-center gap-1.5 text-green-500"><MessageCircle size={14} /> Aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(session?.user?.id === group.created_by || session?.user?.role === "admin") && (
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          if(confirm("Yakin ingin menghapus grup ini secara permanen?")) {
                            try {
                              const res = await fetch(`/api/community/groups/${group.id}`, { method: 'DELETE' });
                              if(res.ok) fetchGroups();
                              else alert("Gagal menghapus grup");
                            } catch(err) { alert("Terjadi kesalahan"); }
                          }
                        }}
                        className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        title="Hapus Grup"
                      >
                        <MoreVertical size={16} /> {/* Or a trash icon */}
                      </button>
                    )}
                    <button 
                      onClick={() => handleJoin(group.id)}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-dark-blue rounded-2xl font-black text-xs hover:bg-primary-blue hover:text-white transition-all shadow-sm"
                    >
                      Masuk Grup <ChevronRight size={14} />
                    </button>
                  </div>
               </div>
            </motion.div>
          ))}

          {/* Add Group Card */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="rounded-[40px] border-4 border-dashed border-slate-100 p-8 flex flex-col items-center justify-center gap-4 hover:border-primary-blue/20 hover:bg-primary-blue/5 transition-all group/add"
          >
             <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover/add:bg-primary-blue group-hover/add:text-white transition-all shadow-sm">
                <Plus size={32} />
             </div>
             <div className="text-center">
                <h4 className="font-black text-slate-400 group-hover/add:text-primary-blue transition-all">Buat Grup Baru</h4>
                <p className="text-xs font-medium text-slate-300">Pimpin komunitas kariermu sendiri</p>
             </div>
          </button>
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
              className="absolute inset-0 bg-dark-blue/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[48px] p-10 shadow-2xl overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
               
               <h2 className="text-3xl font-black text-dark-blue mb-2">Buat Grup Baru</h2>
               <p className="text-slate-400 font-medium mb-8">Pimpin komunitas belajarmu sendiri.</p>

               <form onSubmit={handleCreateGroup} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-dark-blue/40 tracking-widest ml-1">Nama Grup</label>
                     <input 
                       required
                       value={newGroupName}
                       onChange={(e) => setNewGroupName(e.target.value)}
                       placeholder="Misal: Web Dev Enthusiast"
                       className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary-blue/20 font-bold text-dark-blue"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-dark-blue/40 tracking-widest ml-1">Kategori</label>
                     <select 
                       value={newGroupCategory}
                       onChange={(e) => setNewGroupCategory(e.target.value)}
                       className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary-blue/20 font-bold text-dark-blue appearance-none"
                     >
                        <option value="">Pilih Kategori (Opsional)</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-dark-blue/40 tracking-widest ml-1">Privasi</label>
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          type="button"
                          onClick={() => setNewGroupPrivacy("public")}
                          className={cn(
                            "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold transition-all",
                            newGroupPrivacy === "public" ? "border-primary-blue bg-primary-blue/5 text-primary-blue" : "border-slate-100 text-slate-400"
                          )}
                        >
                           <Globe size={18} /> Publik
                        </button>
                        <button 
                          type="button"
                          onClick={() => setNewGroupPrivacy("private")}
                          className={cn(
                            "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold transition-all",
                            newGroupPrivacy === "private" ? "border-primary-blue bg-primary-blue/5 text-primary-blue" : "border-slate-100 text-slate-400"
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
                          <label className="text-xs font-black uppercase text-dark-blue/40 tracking-widest ml-1">Password Grup</label>
                          <input 
                            required
                            type="password"
                            value={newGroupPassword}
                            onChange={(e) => setNewGroupPassword(e.target.value)}
                            placeholder="Buat password untuk grup ini..."
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary-blue/20 font-bold text-dark-blue"
                          />
                       </motion.div>
                     )}
                  </AnimatePresence>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-dark-blue/40 tracking-widest ml-1">Deskripsi</label>
                     <textarea 
                       required
                       value={newGroupDesc}
                       onChange={(e) => setNewGroupDesc(e.target.value)}
                       placeholder="Jelaskan visi grup ini..."
                       rows={3}
                       className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary-blue/20 font-medium text-dark-blue resize-none"
                     />
                  </div>

                  <button 
                    type="submit"
                    disabled={isCreating}
                    className="w-full py-5 bg-primary-blue text-white rounded-3xl font-black shadow-xl shadow-primary-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50 active:scale-95"
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
              className="absolute inset-0 bg-dark-blue/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[48px] p-10 shadow-2xl overflow-hidden text-center"
            >
               <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock size={32} />
               </div>
               
               <h2 className="text-2xl font-black text-dark-blue mb-2">Grup Privat</h2>
               <p className="text-sm text-slate-400 font-medium mb-8">Masukkan password untuk bergabung.</p>

               <form onSubmit={(e) => { e.preventDefault(); handleJoin(joinGroupId, joinPassword); }} className="space-y-6">
                  <input 
                    required
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    placeholder="Password..."
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary-blue/20 font-bold text-dark-blue text-center"
                  />

                  <button 
                    type="submit"
                    disabled={isJoining}
                    className="w-full py-5 bg-primary-blue text-white rounded-3xl font-black shadow-xl shadow-primary-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center"
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
