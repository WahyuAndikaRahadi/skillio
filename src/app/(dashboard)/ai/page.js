"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Loader2, Sparkles, Plus, File, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function AiMentorPage() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Halo! Aku Skillio Mentor. Ajukan pertanyaan seputar materi belajarmu hari ini, dan aku akan memberikan jawaban layaknya seorang senior di bidangmu!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // File Upload State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFilesAdded = (newFiles) => {
    const totalFiles = selectedFiles.length + newFiles.length;
    if (totalFiles > 3) {
      alert("Maksimal 3 file yang dapat diunggah sekaligus.");
      const availableSlots = 3 - selectedFiles.length;
      if (availableSlots > 0) {
        setSelectedFiles(prev => [...prev, ...newFiles.slice(0, availableSlots)]);
      }
    } else {
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesAdded(Array.from(e.target.files));
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;

    // Create attachments payload for UI
    const attachments = selectedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file)
    }));

    // Convert files to base64 for API
    let filesData = [];
    if (selectedFiles.length > 0) {
      try {
        const filePromises = selectedFiles.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve({
              name: file.name,
              type: file.type,
              base64: reader.result.split(',')[1] // remove data URI prefix
            });
            reader.onerror = error => reject(error);
          });
        });
        filesData = await Promise.all(filePromises);
      } catch (err) {
        console.error("Gagal membaca file:", err);
      }
    }

    const messageToSend = input.trim();
    setInput("");
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    // Prepare history
    const historyToSend = messages.map(m => ({
      role: m.role,
      content: m.context || m.content
    }));

    // Add user message to UI
    const newMessages = [...messages, { 
      role: "user", 
      content: messageToSend,
      attachments: attachments 
    }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: messageToSend || "Tolong jelaskan gambar/file ini",
          files: filesData,
          history: historyToSend
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => {
          const updatedMessages = [...prev];
          // Simpan teks yang sudah di-parse (misal dari excel) di property context
          if (data.enrichedPrompt) {
            updatedMessages[updatedMessages.length - 1].context = data.enrichedPrompt;
          }
          return [...updatedMessages, { role: "ai", content: data.reply }];
        });
      } else {
        setMessages(prev => [...prev, { role: "ai", content: `Error: ${data.message || "Sistem bermasalah."}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Koneksi terputus. Coba periksa internetmu." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="h-[calc(100vh-120px)] flex flex-col -mx-6 md:-mx-10 -mb-12 mt-[-40px] bg-slate-50 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-skillio-600/10 backdrop-blur-sm border-4 border-dashed border-skillio-500 rounded-3xl m-4 flex flex-col items-center justify-center text-skillio-700 pointer-events-none"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-skillio-500/30 mb-6">
              <Plus size={48} className="animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold font-display">Lepaskan file di sini</h2>
            <p className="font-medium mt-3 text-lg bg-white/50 px-6 py-2 rounded-full">Gambar, Dokumen, atau PDF (Maks 3 File)</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 -z-0 h-full w-full opacity-60 pointer-events-none">
        <div className="absolute top-[5%] right-[10%] h-[400px] w-[400px] rounded-full bg-skillio-200/50 blur-[100px]" />
        <div className="absolute bottom-[20%] left-[5%] h-[300px] w-[300px] rounded-full bg-teal-200/50 blur-[100px]" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 md:px-10 py-8 custom-scrollbar relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header inside scrollable area */}
          <div className="mb-12 flex flex-col items-center justify-center text-center space-y-4 pt-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center justify-center gap-2">
                Skillio Mentor <Sparkles size={24} className="text-orange-400" />
              </h1>
              <p className="text-slate-500 font-medium mt-3 max-w-md mx-auto text-sm sm:text-base">
                Tanyakan apapun seputar materi atau karir digitalmu. Aku siap membantu layaknya senior yang berpengalaman.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-bold mt-2 shadow-sm">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Sistem siap membantu
            </div>
          </div>

          <div className="space-y-6 pb-40">
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={idx} 
                className={cn(
                  "flex gap-3 sm:gap-4",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Bubble */}
                <div className={cn(
                  "p-4 sm:px-6 sm:py-4 max-w-[85%] sm:max-w-[75%] shadow-sm",
                  msg.role === "user" 
                    ? "bg-skillio-600 text-white rounded-[24px] rounded-tr-sm" 
                    : "bg-white text-slate-700 border border-slate-200 rounded-[24px] rounded-tl-sm prose prose-sm max-w-none"
                )}>
                  {msg.role === "user" ? (
                    <div className="flex flex-col w-full">
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-col mb-2 w-full">
                          <p className="text-sm font-bold text-white/90 mb-3">Foto terlampir:</p>
                          <div className="flex flex-row gap-2 w-full">
                            {msg.attachments.map((file, i) => (
                              file.type.startsWith("image/") ? (
                                <img key={i} src={file.url} alt="attachment" className="flex-1 min-w-0 aspect-video rounded-lg sm:rounded-xl object-cover border border-white/20 shadow-sm" />
                              ) : (
                                <a 
                                  key={i} 
                                  href={file.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex-1 min-w-0 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors border border-white/20 shadow-sm overflow-hidden"
                                >
                                  <File size={20} className="text-white shrink-0 hidden sm:block" />
                                  <File size={16} className="text-white shrink-0 sm:hidden" />
                                  <div className="min-w-0 hidden sm:block">
                                    <p className="text-xs font-bold text-white truncate">{file.name}</p>
                                    <p className="text-[10px] text-white/70">{(file.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </a>
                              )
                            ))}
                          </div>
                        </div>
                      )}

                      {msg.attachments && msg.attachments.length > 0 && msg.content && (
                        <hr className="border-white/20 my-2" />
                      )}

                      {msg.content && <div className="font-medium leading-relaxed whitespace-pre-wrap text-white">{msg.content}</div>}
                    </div>
                  ) : (
                    <div className="font-medium leading-relaxed">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 sm:gap-4 flex-row">
                <div className="px-5 sm:px-6 h-[46px] sm:h-[52px] mt-1 sm:mt-0 rounded-[24px] bg-white border border-slate-200 rounded-tl-sm shadow-sm flex items-center gap-1.5 w-fit">
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} className="w-2 h-2 bg-slate-400 rounded-full" />
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-4 left-0 right-0 px-6 sm:px-10 pointer-events-none z-20">
        <div className="max-w-4xl mx-auto pointer-events-auto relative">
          
          {/* Multiple File Preview Bubbles */}
          <AnimatePresence>
            {selectedFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-[calc(100%+12px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-4 sm:p-5 flex flex-col z-20 pointer-events-auto"
              >
                <div className="flex items-center justify-between mb-2 pb-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-skillio-600">
                    Total: {selectedFiles.length} File terlampir (Maks 3)
                  </p>
                </div>

                <div className="flex flex-col">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0 group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Sparkles size={18} className="text-skillio-500 shrink-0" />
                        <p className="text-sm font-medium text-slate-600 truncate max-w-[200px] sm:max-w-[500px]">
                          {file.name}
                        </p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFile(idx)} 
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1.5 transition-colors"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      setSelectedFiles([]);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Hapus Semua Lampiran
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSend} className="relative">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 text-slate-400 hover:text-skillio-600 hover:bg-skillio-50 rounded-full flex items-center justify-center transition-colors"
            >
              <Plus size={24} />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan sesuatu pada mentormu..."
              disabled={isLoading}
              className="w-full pl-14 pr-16 py-4 sm:py-5 bg-white/80 backdrop-blur-xl rounded-full border border-slate-200 focus:border-skillio-400 focus:ring-4 focus:ring-skillio-500/10 text-slate-800 font-medium outline-none transition-all disabled:opacity-50 shadow-xl shadow-slate-200/50"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-skillio-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-skillio-500/20 hover:bg-skillio-700 active:scale-95 transition-all disabled:opacity-50 disabled:hover:bg-skillio-600 disabled:active:scale-100"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
