"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, X, ArrowRight, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function LandingAiWidget() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const initialGreeting = session 
    ? `Halo kembali, ${session.user?.name?.split(' ')[0]}! 👋 Jangan lupa untuk melanjutkan progres belajarmu hari ini ya!`
    : "Halo! 👋 Saya adalah Mentor AI pribadimu di Skillio. Ada yang ingin ditanyakan soal karir impianmu?";

  const [messages, setMessages] = useState([
    { role: "ai", content: initialGreeting }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 2000);
    const hideTimer = setTimeout(() => { if (!isOpen) setShowTooltip(false); }, 10000);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Prepare history to send
    const historyToSend = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const endpoint = session ? "/api/ai/chat" : "/api/ai/public-chat";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage.content,
          history: historyToSend 
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Maaf, sepertinya saya sedang gangguan sinyal. Coba lagi ya!" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Koneksi terputus! 😢" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 md:w-96 bg-white rounded-3xl shadow-[0_20px_50px_rgba(31,84,126,0.2)] border border-skillio-100/50 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] p-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-bold font-display tracking-tight text-sm">Skillio AI Mentor</h3>
                  <p className="text-[10px] text-white/70 font-medium">Selalu aktif & siap membantu</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            
            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "")}>
                  {msg.role === "ai" && (
                    <div className="w-6 h-6 rounded-full bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] flex-shrink-0 flex items-center justify-center text-white mt-1">
                      <Sparkles size={10} />
                    </div>
                  )}
                  <div className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "user" 
                      ? "bg-skillio-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100 font-medium"
                  )}>
                    {msg.role === "ai" ? (
                      <div className="prose max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] flex-shrink-0 flex items-center justify-center text-white mt-1">
                    <Sparkles size={10} />
                  </div>
                  <div className="p-3 bg-white rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full"/>
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full"/>
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full"/>
                  </div>
                </div>
              )}
            </div>

            {/* Input & CTA Area */}
            <div className="bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSend} className="p-3 flex items-center gap-2 border-b border-slate-50">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ketik pesanmu di sini..."
                  disabled={isLoading}
                  className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-skillio-500/20 transition-all font-medium disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-skillio-600 hover:bg-skillio-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="p-3 bg-slate-50/50">
                <Link 
                  href={session ? "/dashboard" : "/auth/login"}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-skillio-100 hover:border-skillio-500/50 text-skillio-600 rounded-xl font-bold text-xs transition-all shadow-sm group"
                >
                  {session ? "Buka Dashboard" : "Mulai Belajar 30 Hari!"}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white text-slate-700 px-4 py-2.5 rounded-2xl rounded-br-none shadow-xl border border-slate-100 text-sm font-bold cursor-pointer absolute bottom-[70px] right-2 whitespace-nowrap"
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }}
          >
            Tanya Skillio AI
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(31,84,126,0.3)] transition-colors z-10 ${
          isOpen ? "bg-slate-800 text-white" : "bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] text-white"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
      </motion.button>
    </div>
  );
}
