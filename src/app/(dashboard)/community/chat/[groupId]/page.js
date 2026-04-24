"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft,
  Settings,
  MoreVertical,
  Send,
  Loader2,
  Lock,
  Users,
  Info,
  ChevronRight,
  MessageSquare,
  Paperclip,
  Image as ImageIcon,
  FileText,
  X,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher-client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { UploadButton } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

export default function GroupChatPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [groupId, setGroupId] = useState(null);
  
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
  const scrollRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setGroupId(resolvedParams.groupId);
    };
    init();
  }, [params]);

  useEffect(() => {
    if (!groupId) return;

    const fetchGroupData = async () => {
      try {
        // 1. Fetch Group Details (we'll need a dedicated endpoint or use join check)
        const groupsRes = await fetch("/api/community/groups");
        const allGroups = await groupsRes.json();
        
        if (Array.isArray(allGroups)) {
          const currentGroup = allGroups.find(g => g.id === groupId);
          setGroup(currentGroup);
        }

        // 2. Fetch Messages
        const msgRes = await fetch(`/api/community/groups/${groupId}/messages`);
        const msgData = await msgRes.json();
        if (msgRes.ok) setMessages(msgData);
        else if (msgRes.status === 403) {
           alert("Anda bukan anggota grup ini!");
           router.push("/community");
        }
      } catch (err) {
        console.error("Error loading chat:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroupData();

    // 3. Pusher Real-time
    if (pusherClient) {
      const channel = pusherClient.subscribe(`presence-group-${groupId}`);
      
      channel.bind("new-message", (data) => {
        setMessages(prev => [...prev, data]);
      });

      channel.bind("pusher:subscription_succeeded", (members) => {
        setOnlineCount(members.count);
      });

      channel.bind("pusher:member_added", () => {
        setOnlineCount(prev => prev + 1);
      });

      channel.bind("pusher:member_removed", () => {
        setOnlineCount(prev => prev - 1);
      });

      return () => {
        pusherClient.unsubscribe(`presence-group-${groupId}`);
      };
    }
  }, [groupId, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await fetch(`/api/community/groups/${groupId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: newMessage,
          imageUrl: imageUrl || null,
          fileUrl: fileUrl || null,
          fileName: fileName || null
        })
      });
      setNewMessage("");
      setImageUrl("");
      setFileUrl("");
      setFileName("");
      setShowAttachments(false);
    } catch (err) {
      console.error("Gagal kirim pesan");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
         <Loader2 className="w-12 h-12 text-primary-blue animate-spin mb-4" />
         <p className="font-black text-slate-400 tracking-widest">MEMUAT PESAN...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white rounded-[48px] border border-light-blue overflow-hidden shadow-2xl">
       {/* Chat Main Area */}
       <div className="flex-1 flex flex-col min-w-0 border-r border-slate-50">
          {/* Header */}
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
             <div className="flex items-center gap-4">
                <Link href="/community" className="p-3 hover:bg-slate-50 rounded-2xl transition-all lg:hidden">
                   <ArrowLeft size={20} className="text-dark-blue" />
                </Link>
                <div className="w-14 h-14 rounded-2xl bg-primary-blue text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-primary-blue/20">
                   {group?.name[0]}
                </div>
                <div>
                   <h2 className="text-xl font-black text-dark-blue flex items-center gap-2">
                     {group?.name}
                     {group?.privacy === "private" && <Lock size={14} className="text-slate-300" />}
                   </h2>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{onlineCount} Online Sekarang</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <button className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all"><MoreVertical size={20} /></button>
             </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20 custom-scrollbar"
          >
             {messages.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                  <MessageSquare size={48} className="mb-4" />
                  <p className="font-bold">Mulai percakapan pertamamu!</p>
               </div>
             ) : (
               messages.map((msg) => {
                 const isMe = msg.user_id === session?.user?.id;
                 return (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     key={msg.id} 
                     className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
                   >
                      <div className={cn(
                        "max-w-[75%] md:max-w-[60%] p-5 rounded-[28px] shadow-sm",
                        isMe ? "bg-primary-blue text-white rounded-tr-none shadow-primary-blue/10" : "bg-white text-dark-blue rounded-tl-none border border-slate-100"
                      )}>
                         {!isMe && <p className="text-[10px] font-black text-primary-blue mb-2 uppercase tracking-tighter">{msg.user.name}</p>}
                         
                         {msg.image_url && (
                           <div className="mb-3 rounded-2xl overflow-hidden border-2 border-white/20">
                             <img src={msg.image_url} alt="Attachment" className="w-full h-auto max-h-[300px] object-cover" />
                           </div>
                         )}

                         {msg.file_url && (
                           <a 
                             href={msg.file_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center gap-3 p-3 mb-3 rounded-xl bg-black/10 hover:bg-black/20 transition-colors"
                           >
                             <div className="p-2 bg-white/20 rounded-lg shrink-0">
                               <FileText size={16} />
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className="text-xs font-bold truncate">{msg.file_name || "Document File"}</p>
                             </div>
                             <Download size={14} className="shrink-0" />
                           </a>
                         )}

                         {msg.content && <p className="text-sm font-medium leading-relaxed">{msg.content}</p>}
                      </div>
                      <span className="text-[9px] font-bold text-slate-300 mt-2 uppercase tracking-widest px-2">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </motion.div>
                 );
               })
             )}
          </div>

          {/* Footer Input */}
          <div className="p-6 bg-white border-t border-slate-50">
             
             <AnimatePresence>
               {showAttachments && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10, height: 0 }}
                   animate={{ opacity: 1, y: 0, height: "auto" }}
                   exit={{ opacity: 0, y: 10, height: 0 }}
                   className="mb-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden"
                 >
                   <div className="flex flex-col gap-4">
                     {/* Previews */}
                     {(imageUrl || fileUrl) && (
                       <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                         {imageUrl && (
                           <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm">
                             <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                             <button type="button" onClick={() => setImageUrl("")} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"><X size={12}/></button>
                           </div>
                         )}
                         {fileUrl && (
                           <div className="relative flex items-center gap-3 p-3 bg-slate-50 rounded-xl flex-1 border border-slate-100">
                             <div className="w-10 h-10 bg-primary-blue/10 text-primary-blue rounded-lg flex items-center justify-center"><FileText size={20}/></div>
                             <div className="flex-1 min-w-0">
                               <p className="text-sm font-bold text-dark-blue truncate">{fileName}</p>
                               <p className="text-[10px] font-medium text-slate-400">Siap dikirim</p>
                             </div>
                             <button type="button" onClick={() => {setFileUrl(""); setFileName("");}} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X size={16}/></button>
                           </div>
                         )}
                       </div>
                     )}

                     {/* Uploaders */}
                     {!imageUrl && !fileUrl && (
                       <div className="grid grid-cols-2 gap-4">
                         <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                           <ImageIcon size={24} className="text-slate-300 mb-2" />
                           <h5 className="text-xs font-black text-dark-blue mb-2">Upload Gambar</h5>
                           <UploadButton
                             endpoint="imageUploader"
                             onClientUploadComplete={(res) => {
                               if (res && res[0]) setImageUrl(res[0].url);
                             }}
                             appearance={{ button: "text-[10px] px-4 py-2 bg-primary-blue h-8" }}
                           />
                         </div>
                         <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                           <FileText size={24} className="text-slate-300 mb-2" />
                           <h5 className="text-xs font-black text-dark-blue mb-2">Upload Dokumen</h5>
                           <UploadButton
                             endpoint="documentUploader"
                             onClientUploadComplete={(res) => {
                               if (res && res[0]) {
                                 setFileUrl(res[0].url);
                                 setFileName(res[0].name);
                               }
                             }}
                             appearance={{ button: "text-[10px] px-4 py-2 bg-slate-800 h-8" }}
                           />
                         </div>
                       </div>
                     )}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <form onSubmit={handleSendMessage} className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowAttachments(!showAttachments)}
                  className={cn(
                    "w-14 h-14 rounded-[24px] flex items-center justify-center transition-all shrink-0",
                    showAttachments || imageUrl || fileUrl ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/30" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  )}
                >
                  <Paperclip size={20} />
                </button>
                <div className="relative flex-1">
                   <input 
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     placeholder="Ketik pesan untuk komunitas..."
                     className="w-full pl-8 pr-16 py-5 bg-slate-50 rounded-[24px] border-none focus:ring-2 focus:ring-primary-blue/20 font-bold text-dark-blue placeholder:text-slate-300 transition-all"
                   />
                   <button 
                     type="submit"
                     disabled={(!newMessage.trim() && !imageUrl && !fileUrl) || isSending}
                     className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary-blue text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary-blue/30 active:scale-90 transition-all disabled:opacity-50"
                   >
                     {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={24} />}
                   </button>
                </div>
             </form>
          </div>
       </div>

       {/* Info Sidebar (Desktop) */}
       <div className="hidden xl:flex w-80 bg-slate-50/50 flex-col p-10">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-8">Informasi Grup</h3>
          
          <div className="space-y-8">
             <div>
                <label className="text-[10px] font-black text-primary-blue uppercase tracking-widest block mb-2">Tentang</label>
                <p className="text-sm font-bold text-dark-blue/70 leading-relaxed">
                   {group?.description}
                </p>
             </div>

             <div className="pt-8 border-t border-slate-100">
                <label className="text-[10px] font-black text-primary-blue uppercase tracking-widest block mb-4">Statistik</label>
                <div className="space-y-4">
                   <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex items-center gap-3 text-dark-blue font-black text-xs">
                         <Users size={16} /> Anggota
                      </div>
                      <span className="font-black text-primary-blue">{group?._count?.members || 0}</span>
                   </div>
                   <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex items-center gap-3 text-dark-blue font-black text-xs">
                         <Info size={16} /> Privasi
                      </div>
                      <span className="font-black text-slate-400 capitalize">{group?.privacy}</span>
                   </div>
                </div>
             </div>

             {group?.created_by === session?.user?.id ? (
               <button 
                 onClick={async () => {
                   if (confirm("Apakah Anda yakin ingin menghapus grup ini secara permanen? Semua chat akan hilang.")) {
                     try {
                       const res = await fetch(`/api/community/groups/${groupId}`, { method: "DELETE" });
                       if (res.ok) {
                         alert("Grup berhasil dihapus.");
                         router.push("/community");
                       } else {
                         alert("Gagal menghapus grup.");
                       }
                     } catch (err) {
                       console.error("Error deleting group:", err);
                     }
                   }
                 }}
                 className="w-full mt-auto py-5 bg-white border-2 border-red-50 text-red-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
               >
                  Hapus Grup
               </button>
             ) : (
               <button className="w-full mt-auto py-5 bg-white border-2 border-red-50 text-red-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
                  Keluar Grup
               </button>
             )}
          </div>
       </div>
    </div>
  );
}
