"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Award, 
  Map as MapIcon, 
  ChevronRight,
  ShieldCheck,
  Edit3,
  Mail,
  Calendar,
  Share2,
  Loader2,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UploadButton } from "@/lib/uploadthing";

export default function ProfileClient({ profileId }) {
  const { data: session, update } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const url = profileId ? `/api/user/profile?userId=${profileId}` : "/api/user/profile";
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) setProfileData(data);
      } catch (err) {
        console.error("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [profileId]);

  const joinedDate = profileData?.joinedAt 
    ? new Date(profileData.joinedAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : "April 2024";

  const level = profileData ? Math.floor(profileData.xp / 500) + 1 : 1;
  const xpToNextLevel = profileData ? 500 - (profileData.xp % 500) : 500;
  const progressPercent = profileData ? ((profileData.xp % 500) / 500) * 100 : 0;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${profileData?.id || profileId || session?.user?.id || ""}`;
    const shareData = {
      title: `Profil Skillio ${profileData?.name}`,
      text: `Lihat progres belajar saya di Skillio!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      const Swal = (await import("sweetalert2")).default;
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Link profil disalin!",
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900">Profil Tidak Ditemukan</h1>
        <Link href="/dashboard" className="text-primary-blue font-bold hover:underline">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 md:px-10 space-y-12 relative z-10">
      {/* ═══ PREMIUM PROFILE SHOWROOM HEADER ═══ */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative group"
      >
        <div className="relative overflow-hidden rounded-[50px] md:rounded-[70px] bg-gradient-to-br from-primary-blue to-blue-700 border border-blue-400/30 shadow-[0_20px_50px_rgba(59,130,246,0.3)]">
          
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-br from-primary-blue via-blue-600 to-blue-800" />
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="absolute -top-1/2 -left-1/4 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)] blur-3xl" 
             />
             <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>

          <div className="relative z-10 p-8 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center gap-10 md:gap-14">
            
            <div className="relative group/avatar">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[45px] bg-white/20 backdrop-blur-2xl p-1.5 shadow-2xl ring-1 ring-white/30 overflow-hidden">
                <div className="w-full h-full rounded-[38px] overflow-hidden bg-slate-100 flex items-center justify-center border-4 border-white/10 group-hover/avatar:scale-105 transition-transform duration-500 relative">
                  {profileData.image ? (
                    <img src={profileData.image} alt={profileData.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl font-black text-primary-blue">
                      {profileData.name?.[0]?.toUpperCase() || "S"}
                    </span>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                       <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              
              {profileData.isOwnProfile && (
                <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl shadow-2xl hover:scale-110 transition-all overflow-hidden group/upload flex items-center justify-center w-12 h-12 border-4 border-blue-600">
                   <div className="absolute inset-0 flex items-center justify-center text-primary-blue pointer-events-none">
                     <Edit3 size={20} />
                   </div>
                   <div className="opacity-0 w-[200%] h-[200%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center scale-[3]">
                     <UploadButton
                       endpoint="imageUploader"
                       onUploadBegin={() => setIsUploading(true)}
                       onClientUploadComplete={async (res) => {
                         if (res && res[0]) {
                           const newUrl = res[0].url;
                           const Swal = (await import("sweetalert2")).default;
                           Swal.fire({
                             title: 'Menyinkronkan...',
                             text: 'Sabar ya, foto profilmu sedang diperbarui.',
                             allowOutsideClick: false,
                             showConfirmButton: false,
                             didOpen: () => { Swal.showLoading(); },
                             customClass: { popup: 'rounded-[32px] p-8' }
                           });

                           try {
                             const response = await fetch("/api/user/update-image", {
                               method: "POST",
                               headers: { "Content-Type": "application/json" },
                               body: JSON.stringify({ imageUrl: newUrl })
                             });

                             if (response.ok) {
                               await update({ image: newUrl });
                               setProfileData(prev => ({ ...prev, image: newUrl }));
                               Swal.fire({
                                 toast: true,
                                 position: "top-end",
                                 icon: "success",
                                 title: "Foto profil diperbarui!",
                                 showConfirmButton: false,
                                 timer: 2000
                               });
                             } else { Swal.close(); }
                           } catch (err) { console.error(err); Swal.close(); } finally { setIsUploading(false); }
                         }
                       }}
                       onUploadError={() => { setIsUploading(false); }}
                     />
                   </div>
                </div>
              )}
            </div>

            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
                    {profileData.name || "Pengguna Skillio"}
                  </h1>
                  {profileData.role === "admin" && (
                    <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/20 text-white">Premium Admin</span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 text-white/70 font-bold">
                   <span className="flex items-center gap-2 text-sm md:text-base bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                     <Mail size={16} className="text-blue-300" /> {profileData.email}
                   </span>
                   <span className="flex items-center gap-2 text-sm md:text-base bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                     <Calendar size={16} className="text-blue-300" /> Bergabung {joinedDate}
                   </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                 <button 
                   onClick={handleShare}
                   className="px-8 py-4 bg-white text-primary-blue rounded-[24px] font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-black/20"
                 >
                    <Share2 size={18} /> Bagikan Profil
                 </button>
                 
                 {profileData.isOwnProfile && (
                   <button 
                     onClick={() => signOut({ callbackUrl: "/" })}
                     className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-100 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all flex items-center gap-2 border border-red-400/20"
                   >
                      <LogOut size={18} /> Keluar
                   </button>
                 )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-blue-50 text-primary-blue rounded-[20px] group-hover:scale-110 transition-transform"><Sparkles size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total XP</p>
                    <h3 className="text-3xl font-black text-slate-900 leading-none mt-1">{profileData.xp}</h3>
                  </div>
               </div>
               <div className="space-y-3">
                 <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-primary-blue rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 text-right uppercase tracking-wider">{xpToNextLevel} XP ke Level {level + 1}</p>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-orange-50 text-orange-500 rounded-[20px] group-hover:scale-110 transition-transform"><Flame size={24} className="fill-orange-500" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Streak</p>
                    <h3 className="text-3xl font-black text-slate-900 leading-none mt-1">{profileData.streak} Hari</h3>
                  </div>
               </div>
               <p className="text-[10px] font-bold text-slate-400 mt-6 leading-relaxed italic">Keep the fire burning! 🔥</p>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-50 text-emerald-500 rounded-[20px] group-hover:scale-110 transition-transform"><Trophy size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Level</p>
                    <h3 className="text-3xl font-black text-slate-900 leading-none mt-1">{level}</h3>
                  </div>
               </div>
               <p className="text-[10px] font-bold text-slate-400 mt-6 leading-relaxed uppercase tracking-widest">Peringkat: <span className="text-primary-blue font-black">#{profileData.rank || "-"}</span></p>
            </div>
          </div>

          <div className="bg-white rounded-[50px] border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-200/40">
             <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                   <div className="p-2.5 bg-blue-50 rounded-xl text-primary-blue"><MapIcon size={20} /></div>
                   Roadmap Selesai
                </h2>
                <span className="bg-blue-50 text-primary-blue font-black text-xs px-4 py-2 rounded-full uppercase tracking-widest">{profileData.roadmapsCount} Roadmap</span>
             </div>

             {profileData.roadmapsCount === 0 ? (
               <div className="text-center py-16 bg-slate-50/50 rounded-[35px] border-2 border-dashed border-slate-200">
                  <p className="font-black text-slate-400 uppercase text-xs tracking-widest mb-4">Belum ada roadmap yang selesai</p>
                  <Link href="/roadmap" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-500/20">Mulai Belajar Sekarang <ChevronRight size={14} /></Link>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.completedRoadmaps?.map((roadmap) => (
                    <Link key={roadmap.id} href={`/verify/${roadmap.id}`} className="flex items-center justify-between p-5 bg-white rounded-[30px] border border-slate-100 hover:border-primary-blue/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary-blue to-blue-700 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-blue/20 uppercase text-lg group-hover:scale-110 transition-transform">{roadmap.categoryName.slice(0, 1)}</div>
                          <div>
                             <h4 className="font-black text-slate-900 leading-tight">{roadmap.categoryName}</h4>
                             <p className="text-[10px] font-bold text-slate-400 mt-1">Lulus {new Date(roadmap.completedAt).toLocaleDateString("id-ID", { month: 'short', year: 'numeric' })}</p>
                          </div>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-primary-blue transition-colors"><ChevronRight size={18} /></div>
                    </Link>
                  ))}
               </div>
             )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-10">
          <div className="bg-white rounded-[50px] border border-slate-100 p-8 md:p-10 shadow-xl shadow-slate-200/40">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                   <div className="p-2.5 bg-purple-50 rounded-xl text-purple-500"><Award size={20} /></div>
                   Lencana
                </h2>
                <Link href="/badges" className="text-[10px] font-black text-primary-blue uppercase tracking-widest hover:underline">Lihat Semua</Link>
             </div>

             {profileData.badges?.length === 0 ? (
               <div className="text-center py-10 bg-slate-50/50 rounded-[35px] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"><Award className="text-slate-200" size={28} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Belum ada lencana yang diraih</p>
               </div>
             ) : (
                <div className="grid grid-cols-2 gap-3">
                  {profileData.badges?.slice(0, 4).map((badge, idx) => (
                    <motion.div key={idx} whileHover={{ y: -5 }} className={cn("p-4 h-[160px] rounded-[32px] border transition-all flex flex-col items-center justify-center text-center group relative overflow-hidden", badge.earned ? "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50" : "bg-slate-50/50 border-slate-100 opacity-40 grayscale")}>
                       <div className={cn("w-14 h-14 mb-3 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110", badge.earned ? "bg-slate-50" : "bg-slate-100")}>
                          {!badge.image_url?.includes('.') && !badge.image_url?.includes('/') ? <span>{badge.image_url}</span> : <img src={badge.image_url} alt={badge.name} className="w-10 h-10 object-contain" />}
                       </div>
                       <div className="space-y-1">
                         <h4 className="text-[9px] font-black text-slate-900 leading-tight uppercase tracking-tight line-clamp-2 px-1">{badge.name}</h4>
                         <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">{badge.earned ? "Diraih" : "Locked"}</p>
                       </div>
                    </motion.div>
                  ))}
                </div>
             )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
