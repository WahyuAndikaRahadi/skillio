"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, MoreHorizontal, Send, Loader2, Lock, Users, MessageSquare, Paperclip, Image as ImageIcon, FileText, X, Download, Search, ShieldAlert, Menu, ShieldCheck, MessageSquareIcon } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher-client";
import { useSession } from "next-auth/react";
import { UploadButton } from "@/lib/uploadthing";
import Swal from "sweetalert2";

// Ubah parameter dari { params } menjadi props biasa { groupId, onBack }
export default function GroupChat({ groupId, onBack, onToggleSidebar }) {

  const { data: session } = useSession();
  
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const scrollRef = useRef(null);
  
  const formatDateHeader = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Hari Ini";
    if (d.toDateString() === yesterday.toDateString()) return "Kemarin";
    
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };


  useEffect(() => {
    if (!groupId) return;
    const fetchGroupData = async () => {
      try {
        const groupRes = await fetch(`/api/community/groups/${groupId}`);
        const groupData = await groupRes.json();
        if (groupRes.ok) {
          setGroup(groupData);
        }


        const msgRes = await fetch(`/api/community/groups/${groupId}/messages`);
        const msgData = await msgRes.json();
        if (msgRes.ok) setMessages(msgData);
        if (msgRes.status === 403) {
           Swal.fire({
             icon: "error",
             title: "Akses Ditolak",
             text: "Anda bukan anggota grup ini!",
             confirmButtonColor: "#2563eb",
           });
           onBack(); // Kembali ke list jika gagal
        }
      } catch (err) {
        console.error("Error loading chat:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroupData();

    if (pusherClient) {
      const channel = pusherClient.subscribe(`presence-group-${groupId}`);
      channel.bind("new-message", (data) => setMessages(prev => {
        // Prevent duplicate: Pusher broadcasts to all subscribers including the sender
        if (prev.some(msg => msg.id === data.id)) return prev;
        return [...prev, data];
      }));
      channel.bind("pusher:subscription_succeeded", (members) => setOnlineCount(members.count));
      channel.bind("pusher:member_added", () => setOnlineCount(prev => prev + 1));
      channel.bind("pusher:member_removed", () => setOnlineCount(prev => prev - 1));
      return () => pusherClient.unsubscribe(`presence-group-${groupId}`);
    }
  }, [groupId, onBack]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, showAttachments]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageUrl && !fileUrl || isSending) return;
    setIsSending(true);
    try {
      await fetch(`/api/community/groups/${groupId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage, imageUrl: imageUrl || null, fileUrl: fileUrl || null, fileName: fileName || null })
      });
      setNewMessage(""); setImageUrl(""); setFileUrl(""); setFileName(""); setShowAttachments(false);
    } catch (err) { console.error("Gagal kirim pesan"); } finally { setIsSending(false); }
  };

  if (isLoading) {
    return <div className="flex w-full h-full items-center justify-center"><Loader2 className="w-10 h-10 text-[#2b6ea6] animate-spin" /></div>;
  }

  return (
    // Gunakan h-full agar pas di dalam flex container panel kanan CommunityPage
    <div className="flex w-full h-full overflow-hidden bg-transparent font-sans">
       <div className="flex-1 flex flex-col min-w-0 relative bg-[#f8fbfd]">
          {/* Header Chat */}
          <div onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="h-[76px] bg-white/90 backdrop-blur-md flex items-center justify-between px-6 cursor-pointer border-b border-[#dbe7f2] shrink-0 z-20">
             <div className="flex items-center gap-4">
                 {/* Tombol Menu untuk membuka sidebar kategori di mobile */}
                 <button 
                   onClick={(e) => { e.stopPropagation(); onToggleSidebar(); }} 
                   className="lg:hidden p-2.5 hover:bg-[#f3f7fb] rounded-xl transition-colors text-[#1f547e] -ml-2"
                 >
                    <Menu size={20} />
                 </button>

                 {/* Tombol Back untuk menutup chat dan kembali ke list */}
                 <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="p-2.5 hover:bg-[#f3f7fb] rounded-xl transition-colors text-[#1f547e]">
                    <ArrowLeft size={20} />
                 </button>

                <div className="w-12 h-12 rounded-[16px] bg-[#dbe7f2] text-[#2b6ea6] flex items-center justify-center font-black text-xl shrink-0">
                   {group?.image_url ? <img src={group.image_url} alt="group" className="w-full h-full object-cover rounded-[16px]"/> : group?.name?.[0]}
                </div>
                <div className="flex flex-col">
                   <h2 className="text-[17px] font-black text-[#0d2133] flex items-center gap-1.5 font-display">{group?.name} {group?.privacy === "private" && <Lock size={14} className="text-[#92b7d6]" />}</h2>
                   <p className="text-[12px] font-bold font-display text-[#1f547e] flex items-center gap-1.5 opacity-80">
                     <span className={cn("w-2 h-2 rounded-full", onlineCount > 0 ? "bg-[#68b9b2] animate-pulse" : "bg-slate-300")}></span> {onlineCount} Online
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-2 text-[#1f547e]">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setIsSidebarOpen(true); 
                  }} 
                  className="p-2.5 hover:bg-[#f3f7fb] rounded-xl transition-colors"
                >
                  <MoreHorizontal size={20} />
                </button>
             </div>


          </div>

          {/* Area Pesan */}
          <div className="flex-1 overflow-y-auto relative custom-scrollbar">
            <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: `linear-gradient(rgba(146, 183, 214, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(146, 183, 214, 0.15) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
            <div ref={scrollRef} className="relative z-10 p-6 md:p-8 space-y-4 flex flex-col min-h-full justify-end">
               {messages.length === 0 && (
                 <div className="w-full flex justify-center my-6"><div className="bg-white/80 border border-[#dbe7f2] text-[#1f547e] text-xs font-bold px-6 py-3 rounded-full flex items-center gap-2"><MessageSquareIcon size={16} /> Mulai percakapan pertamamu!</div></div>
               )}
               {messages.map((msg, index) => {
                 const isMe = msg.user_id === session?.user?.id;
                 
                 // Hitung apakah perlu menampilkan separator tanggal
                 const msgDate = new Date(msg.createdAt).toDateString();
                 const prevMsgDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
                 const showDateSeparator = msgDate !== prevMsgDate;

                 return (
                   <React.Fragment key={msg.id}>
                     {showDateSeparator && (
                       <div className="flex justify-center my-8 relative">
                         <div className="absolute inset-0 flex items-center" aria-hidden="true">
                           <div className="w-full border-t border-[#dbe7f2]/50"></div>
                         </div>
                         <div className="relative px-4 bg-[#f8fbfd]">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#92b7d6]">
                             {formatDateHeader(msg.createdAt)}
                           </span>
                         </div>
                       </div>
                     )}
                     
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }} 
                       animate={{ opacity: 1, y: 0 }} 
                       className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
                     >
                        <div className={cn(
                          "max-w-[85%] md:max-w-[70%] rounded-[24px] px-5 py-3.5 relative text-sm shadow-md transition-all", 
                          msg.user.role === "admin"
                            ? isMe
                              ? "bg-[#2b6ea6] text-white rounded-br-sm border-2 border-white/40 ring-4 ring-white/10"
                              : "bg-white text-[#0d2133] rounded-bl-sm border-2 border-[#2b6ea6] ring-4 ring-[#2b6ea6]/10"
                            : isMe 
                              ? "bg-[#2b6ea6] text-white rounded-br-sm" 
                              : "bg-white text-[#0d2133] rounded-bl-sm border border-[#dbe7f2]"
                        )}>
                           <div className={cn(
                             "flex items-center gap-2 mb-1.5",
                             isMe ? "justify-end" : "justify-start"
                           )}>
                             {!isMe && (
                               <div className="text-[11px] font-black font-display text-[#2b6ea6] uppercase tracking-widest">
                                 {msg.user.name}
                               </div>
                             )}
                             {msg.user.role === "admin" && (
                               <span className={cn(
                                 "flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-sm",
                                 isMe ? "bg-white text-[#2b6ea6]" : "bg-[#2b6ea6] text-white"
                               )}>
                                 <ShieldCheck size={10} /> {isMe ? "Anda (Admin)" : "Verified Admin"}
                               </span>
                             )}
                           </div>
                            {msg.image_url && <img src={msg.image_url} alt="Attachment" className="w-full max-h-[300px] object-cover rounded-xl mb-2 shadow-sm border border-black/5" />}
                            {msg.file_url && (
                              <div className={cn("mb-2 p-3 rounded-xl flex items-center justify-between gap-3 border transition-all", isMe ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-slate-50 border-slate-100 hover:bg-slate-100")}>
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", isMe ? "bg-white/20 text-white" : "bg-primary-blue/10 text-primary-blue")}>
                                    <FileText size={20} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-black truncate">{msg.file_name || "Dokumen"}</p>
                                    <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">Klik untuk unduh</p>
                                  </div>
                                </div>
                                <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className={cn("p-2 rounded-lg transition-colors", isMe ? "hover:bg-white/20 text-white" : "hover:bg-primary-blue/10 text-primary-blue")}>
                                  <Download size={18} />
                                </a>
                              </div>
                            )}
                            <div className="flex flex-col gap-1">
                              {msg.content && <span className="leading-relaxed break-words">{msg.content}</span>}
                              <span className={cn("text-[10px] font-bold uppercase tracking-widest mt-1 text-right", isMe ? "text-white/70" : "text-[#92b7d6]")}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                     </motion.div>
                   </React.Fragment>
                 );
               })}

            </div>
          </div>

          {/* Attachment Preview Area */}
          <AnimatePresence>
            {showAttachments && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white border-t border-[#dbe7f2] px-6 py-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#92b7d6]">Lampiran</p>
                  <button onClick={() => setShowAttachments(false)} className="text-[#92b7d6] hover:text-[#e11d48]"><X size={14} /></button>
                </div>
                
                <div className="flex gap-4">
                  {!imageUrl && !fileUrl ? (
                    <>
                      <div className="flex-1 group relative">
                        <div className="w-full h-24 bg-[#f3f7fb] rounded-2xl border-2 border-dashed border-[#dbe7f2] flex flex-col items-center justify-center gap-2 group-hover:bg-[#ebf2f8] group-hover:border-[#2b6ea6]/30 transition-all cursor-pointer">
                          <ImageIcon size={24} className="text-[#92b7d6] group-hover:text-[#2b6ea6]" />
                          <span className="text-[10px] font-black uppercase text-[#92b7d6] group-hover:text-[#2b6ea6]">Kirim Gambar</span>
                        </div>
                        <div className="absolute inset-0 opacity-0 cursor-pointer">
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => { if (res?.[0]) setImageUrl(res[0].url); }}
                            onUploadError={(err) => {
                              Swal.fire({
                                icon: "error",
                                title: "Upload Gagal",
                                text: err.message,
                                confirmButtonColor: "#2563eb",
                              });
                            }}
                            appearance={{ button: "w-full h-full p-0", allowedContent: "hidden" }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 group relative">
                        <div className="w-full h-24 bg-[#f3f7fb] rounded-2xl border-2 border-dashed border-[#dbe7f2] flex flex-col items-center justify-center gap-2 group-hover:bg-[#ebf2f8] group-hover:border-[#2b6ea6]/30 transition-all cursor-pointer">
                          <FileText size={24} className="text-[#92b7d6] group-hover:text-[#2b6ea6]" />
                          <span className="text-[10px] font-black uppercase text-[#92b7d6] group-hover:text-[#2b6ea6]">Kirim File</span>
                        </div>
                        <div className="absolute inset-0 opacity-0 cursor-pointer">
                          <UploadButton
                            endpoint="imageUploader" // Using imageUploader for simplicity, or change if you have a specific file endpoint
                            onClientUploadComplete={(res) => { 
                              if (res?.[0]) {
                                setFileUrl(res[0].url);
                                setFileName(res[0].name);
                              }
                            }}
                            onUploadError={(err) => {
                              Swal.fire({
                                icon: "error",
                                title: "Upload Gagal",
                                text: err.message,
                                confirmButtonColor: "#2563eb",
                              });
                            }}
                            appearance={{ button: "w-full h-full p-0", allowedContent: "hidden" }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full relative bg-[#f3f7fb] p-4 rounded-2xl flex items-center justify-between border border-[#dbe7f2]">
                      <div className="flex items-center gap-3">
                        {imageUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                            <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#2b6ea6] flex items-center justify-center text-white">
                            <FileText size={20} />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-black text-[#0d2133] truncate max-w-[200px]">{imageUrl ? "Gambar Terlampir" : fileName}</p>
                          <p className="text-[10px] font-bold text-[#92b7d6] uppercase tracking-tighter">Siap dikirim</p>
                        </div>
                      </div>
                      <button onClick={() => { setImageUrl(""); setFileUrl(""); setFileName(""); }} className="p-2 hover:bg-white rounded-xl text-[#e11d48] transition-all"><X size={18} /></button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Chat */}
          <div className="bg-white border-t border-[#dbe7f2] px-4 py-4 flex items-end gap-3 z-30 shrink-0">
             <button 
               type="button" 
               onClick={() => setShowAttachments(!showAttachments)} 
               className={cn(
                 "p-3 rounded-2xl transition-all shrink-0 mb-0.5", 
                 showAttachments || imageUrl || fileUrl ? "bg-[#2b6ea6] text-white" : "bg-[#f3f7fb] text-[#1f547e] hover:bg-[#dbe7f2]"
               )}
             >
               <Paperclip size={22} />
             </button>
             <form onSubmit={handleSendMessage} className="flex-1 flex gap-3 relative">
                <textarea 
                  value={newMessage} 
                  onChange={(e) => { 
                    setNewMessage(e.target.value); 
                    e.target.style.height = 'auto'; 
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; 
                  }} 
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter' && !e.shiftKey) { 
                      e.preventDefault(); 
                      handleSendMessage(e); 
                    } 
                  }} 
                  placeholder="Ketik pesan..." 
                  className="w-full bg-[#f8fbfd] border border-[#dbe7f2] rounded-[20px] pl-5 pr-14 py-3.5 text-sm text-[#0d2133] focus:outline-none focus:ring-2 focus:ring-[#2b6ea6]/20 resize-none overflow-y-auto custom-scrollbar" 
                  rows={1} 
                  style={{ minHeight: '52px' }} 
                />
                <button 
                  type="submit" 
                  disabled={(!newMessage.trim() && !imageUrl && !fileUrl) || isSending} 
                  className={cn(
                    "absolute right-2 bottom-1.5 p-2.5 bg-[#2b6ea6] text-white rounded-xl hover:bg-[#1f547e] transition-all",
                    ((!newMessage.trim() && !imageUrl && !fileUrl) || isSending) ? "opacity-40 cursor-not-allowed" : "opacity-100"
                  )}
                >
                  {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
             </form>
          </div>
       </div>

       {/* Panel Samping Chat (Info Grup) */}
       {isSidebarOpen && (
         <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 340, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="flex-shrink-0 border-l border-[#dbe7f2] bg-white flex flex-col z-40 overflow-hidden shadow-[-10px_0_30px_rgba(23,61,92,0.03)]">
           <div className="h-[76px] bg-white flex items-center px-6 gap-4 border-b border-[#dbe7f2] shrink-0">
              <button onClick={() => setIsSidebarOpen(false)} className="text-[#1f547e] hover:bg-[#f3f7fb] p-2 rounded-xl"><X size={20} /></button>
              <h2 className="text-[16px] text-[#0d2133] font-black font-display">Info Komunitas</h2>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative group/avatar mb-6">
                  <div className="w-32 h-32 rounded-[35px] bg-[#dbe7f2] text-[#2b6ea6] flex justify-center items-center text-4xl font-black relative overflow-hidden border-4 border-white shadow-xl">
                    {group?.image_url ? (
                      <img src={group.image_url} alt="group" className="w-full h-full object-cover"/>
                    ) : (
                      group?.name?.[0]
                    )}
                    
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                         <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Edit Bubble on Avatar */}
                  {(group?.created_by === session?.user?.id || session?.user?.role === "admin") && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-blue text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white cursor-pointer hover:scale-110 transition-all overflow-hidden">
                       <ImageIcon size={18} />
                       <div className="absolute inset-0 opacity-0 cursor-pointer">
                         <UploadButton
                            endpoint="imageUploader"
                            onUploadBegin={() => setIsUploading(true)}
                            onClientUploadComplete={async (res) => {
                              const url = res?.[0]?.url;
                              if (url) {
                                const Swal = (await import("sweetalert2")).default;
                                
                                // Show premium loading alert
                                Swal.fire({
                                  title: 'Menyinkronkan...',
                                  text: 'Foto grup sedang diperbarui.',
                                  allowOutsideClick: false,
                                  showConfirmButton: false,
                                  didOpen: () => {
                                    Swal.showLoading();
                                  },
                                  customClass: {
                                    popup: 'rounded-[32px] p-10'
                                  }
                                });

                                try {
                                  const updateRes = await fetch(`/api/community/groups/${groupId}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ imageUrl: url })
                                  });
                                  if (updateRes.ok) {
                                    const updated = await updateRes.json();
                                    setGroup(prev => ({ ...prev, image_url: updated.image_url }));
                                    
                                    Swal.fire({
                                      toast: true,
                                      position: 'top-end',
                                      icon: 'success',
                                      title: 'Foto grup diperbarui!',
                                      showConfirmButton: false,
                                      timer: 2000,
                                      customClass: {
                                        popup: 'rounded-2xl'
                                      }
                                    });
                                  }
                                } catch (err) {
                                  Swal.fire({ icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat memperbarui foto.' });
                                } finally {
                                  setIsUploading(false);
                                }
                              }
                            }}
                            onUploadError={() => {
                              setIsUploading(false);
                            }}
                            appearance={{ button: "w-full h-full p-0 m-0", allowedContent: "hidden" }}
                         />
                       </div>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-1">
                  <h1 className="text-xl text-[#0d2133] font-black font-display tracking-tight">{group?.name}</h1>
                  {(group?.created_by === session?.user?.id || session?.user?.role === "admin") && (
                    <div className="pt-2">
                       <div className="inline-block relative overflow-hidden group/btn">
                         <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue bg-primary-blue/10 px-4 py-2 rounded-full hover:bg-primary-blue hover:text-white transition-all flex items-center gap-2">
                           <ImageIcon size={12} /> Ubah Foto Komunitas
                         </button>
                         <div className="absolute inset-0 opacity-0 cursor-pointer">
                            <UploadButton
                              endpoint="imageUploader"
                              onUploadBegin={() => setIsUploading(true)}
                              onClientUploadComplete={async (res) => {
                                const url = res?.[0]?.url;
                                if (url) {
                                  const Swal = (await import("sweetalert2")).default;
                                  
                                  // Show premium loading alert
                                  Swal.fire({
                                    title: 'Menyinkronkan...',
                                    text: 'Foto grup sedang diperbarui.',
                                    allowOutsideClick: false,
                                    showConfirmButton: false,
                                    didOpen: () => {
                                      Swal.showLoading();
                                    },
                                    customClass: {
                                      popup: 'rounded-[32px] p-10'
                                    }
                                  });

                                  try {
                                    const updateRes = await fetch(`/api/community/groups/${groupId}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ imageUrl: url })
                                    });
                                    if (updateRes.ok) {
                                      const updated = await updateRes.json();
                                      setGroup(prev => ({ ...prev, image_url: updated.image_url }));
                                      
                                      Swal.fire({
                                        toast: true,
                                        position: 'top-end',
                                        icon: 'success',
                                        title: 'Foto grup diperbarui!',
                                        showConfirmButton: false,
                                        timer: 2000,
                                        customClass: {
                                          popup: 'rounded-2xl'
                                        }
                                      });
                                    }
                                  } catch (err) {
                                    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat memperbarui foto.' });
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }
                              }}
                              onUploadError={() => setIsUploading(false)}
                              appearance={{ button: "w-full h-full p-0 m-0", allowedContent: "hidden" }}
                            />
                         </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>

             {group?.description && <div><p className="text-[11px] font-black text-[#92b7d6] uppercase tracking-widest mb-2">Deskripsi</p><p className="text-sm text-[#0d2133] font-medium">{group.description}</p></div>}
             
             <div className="space-y-4">
                 <p className="text-[11px] font-black text-[#92b7d6] uppercase tracking-widest">Informasi</p>
                 <div className="flex items-center gap-3 bg-[#f3f7fb] p-3.5 rounded-2xl">
                   <Lock size={16} className="text-[#2b6ea6]"/> 
                   <p className="text-sm font-bold text-[#0d2133]">Privasi {group?.privacy}</p>
                 </div>
                 <div className="flex items-center gap-3 bg-[#f3f7fb] p-3.5 rounded-2xl">
                   <Users size={16} className="text-[#68b9b2]"/> 
                   <p className="text-sm font-bold text-[#0d2133]">{group?._count?.members || 0} Member</p>
                 </div>
             </div>

             {/* Daftar Anggota */}
             <div className="space-y-4 pt-2">
                 <p className="text-[11px] font-black text-[#92b7d6] uppercase tracking-widest">Anggota Komunitas</p>
                 <div className="space-y-3">
                   {group?.members?.map((m) => (
                     <div key={m.user.id} className="flex items-center gap-3 group">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-50">
                         {m.user.image ? (
                           <img src={m.user.image} alt={m.user.name} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-sm">
                             {m.user.name[0]}
                           </div>
                         )}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-[#0d2133] truncate flex items-center gap-2">
                           {m.user.name}
                           {m.user.id === session?.user?.id && <span className="text-[9px] bg-primary-blue/10 text-primary-blue px-1.5 py-0.5 rounded-full">Anda</span>}
                         </p>
                         <p className="text-[10px] font-bold text-[#92b7d6] uppercase tracking-tighter">
                           {m.role === "admin" ? "👑 Admin Komunitas" : "Anggota"}
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
             </div>

              <div className="pt-6 space-y-3">
                <button 
                  onClick={async () => { 
                    const result = await Swal.fire({
                      title: "Keluar Grup?",
                      text: "Anda yakin ingin keluar dari grup ini?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#ef4444",
                      cancelButtonColor: "#64748b",
                      confirmButtonText: "Ya, Keluar!",
                      cancelButtonText: "Batal"
                    });

                    if (result.isConfirmed) { 
                      const res = await fetch(`/api/community/groups/${groupId}/join`, { method: "DELETE" }); 
                      if (res.ok) onBack(); 
                    } 
                  }} 
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-slate-500 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={16} /> Keluar Grup
                </button>

                {(group?.created_by === session?.user?.id || session?.user?.role === "admin") && (
                  <button 
                    onClick={async () => { 
                      const result = await Swal.fire({
                        title: "Hapus Grup?",
                        text: "Hapus grup permanen? Tindakan ini tidak bisa dibatalkan!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#ef4444",
                        cancelButtonColor: "#64748b",
                        confirmButtonText: "Ya, Hapus!",
                        cancelButtonText: "Batal"
                      });

                      if (result.isConfirmed) { 
                        await fetch(`/api/community/groups/${groupId}`, { method: "DELETE" }); 
                        onBack(); 
                      } 
                    }} 
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-[#fff1f2] text-[#e11d48] rounded-2xl font-bold border border-[#fecdd3] hover:bg-red-50 transition-colors"
                  >
                    <ShieldAlert size={16} /> Hapus Grup
                  </button>
                )}
              </div>

           </div>
         </motion.div>
       )}
    </div>
  );
}