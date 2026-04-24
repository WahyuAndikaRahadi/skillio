"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, User, Send, Loader2, Sparkles, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function AiMentorPage() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Halo! Aku Skillio Mentor. Ajukan pertanyaan seputar materi belajarmu hari ini, dan aku akan memberikan jawaban layaknya seorang senior di bidangmu!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }) // Send only the current message (Stateless)
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Maaf, sistemku sedang bermasalah. Coba sebentar lagi ya!" }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Koneksi terputus. Coba periksa internetmu." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col -mx-6 md:-mx-10 -mb-12 mt-[-40px] bg-[#F8FAFC] relative">
      
      {/* Header */}
      <div className="p-6 md:px-10 border-b border-slate-200 flex items-center justify-between bg-white relative z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[20px] bg-primary-blue/10 flex items-center justify-center text-primary-blue">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-dark-blue flex items-center gap-2">
              Skillio Mentor <Sparkles size={18} className="text-orange-400" />
            </h1>
            <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Siap Menjawab
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold">
           <AlertCircle size={14} /> Jawaban tidak menyimpan riwayat chat
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 md:px-10 py-8 bg-transparent custom-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={cn(
                "flex gap-4 md:gap-6",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                msg.role === "user" ? "bg-dark-blue text-white" : "bg-primary-blue text-white"
              )}>
                {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={cn(
                "p-5 md:p-6 rounded-[24px] max-w-[85%] md:max-w-[85%] shadow-sm",
                msg.role === "user" 
                  ? "bg-dark-blue text-white rounded-tr-sm" 
                  : "bg-white text-dark-blue border border-slate-200 rounded-tl-sm prose prose-sm max-w-none"
              )}>
                {msg.role === "user" ? (
                  <div className="font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 md:gap-6 flex-row">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary-blue text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <div className="p-6 rounded-[24px] bg-white border border-slate-200 rounded-tl-sm shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-blue/40 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary-blue/40 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-primary-blue/40 rounded-full animate-bounce delay-200"></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-8 bg-white border-t border-slate-100 relative z-10">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu pada mentormu..."
            disabled={isLoading}
            className="w-full pl-6 pr-16 py-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-primary-blue focus:bg-white text-dark-blue font-bold outline-none transition-all disabled:opacity-50 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-blue/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
          </button>
        </form>
        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-4">
          AI Mentor ditenagai oleh Google Gemini 1.5
        </p>
      </div>
    </div>
  );
}
