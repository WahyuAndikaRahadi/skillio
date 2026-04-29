"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}(.*?)`{1,3}/gs, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/>\s/g, "")
    .replace(/[-*+]\s/g, "")
    .trim();
}

export default function AiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Halo! Aku Skillio Mentor. Ada yang bisa kubantu soal belajar atau karirmu hari ini? Kamu juga bisa tekan tombol 🎤 untuk bicara langsung denganku!" }
  ]);
  const [input, setInput]       = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isListening, setIsListening]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micSupported, setMicSupported] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef       = useRef(null);

  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setMicSupported(!!SpeechRecognition);
    synthRef.current = window.speechSynthesis;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) stopSpeaking();
  }, [isOpen]);

  const speak = useCallback((text) => {
    if (!voiceEnabled || !synthRef.current) return;
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(stripMarkdown(text));
    utterance.lang  = "id-ID";
    utterance.rate  = 1.05;
    utterance.pitch = 1.0;

    const voices = synthRef.current.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith("id")) ||
                    voices.find(v => v.lang.startsWith("en"));
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend   = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, [voiceEnabled]);

  const stopSpeaking = () => {
    if (synthRef.current?.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    stopSpeaking();

    const recognition = new SpeechRecognition();
    recognition.lang         = "id-ID";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);

      setTimeout(() => sendMessage(transcript), 400);
    };

    recognition.onerror = (e) => {
      console.warn("Speech recognition error:", e.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, []);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const sendMessage = async (text) => {
    const userMessage = (text || input).trim();
    if (!userMessage || isLoading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const res  = await fetch("/api/ai/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          message: userMessage,
          history: history
        }),
      });
      const data = await res.json();

      const reply = res.ok
        ? data.reply
        : "Maaf, sistemku sedang bermasalah. Coba sebentar lagi ya!";

      setMessages(prev => [...prev, { role: "ai", content: reply }]);

      if (voiceEnabled) speak(reply);

    } catch {
      const errMsg = "Koneksi terputus. Coba periksa internetmu.";
      setMessages(prev => [...prev, { role: "ai", content: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 left-6 lg:left-80 z-[100] flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[340px] h-[520px] bg-white rounded-[32px] shadow-2xl border border-light-blue overflow-hidden flex flex-col"
          >
            {}
            <div className="p-5 bg-gradient-to-r from-primary-blue to-dark-blue flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm relative">
                  <Bot size={22} />
                  {isSpeaking && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-dark-blue animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="font-black tracking-tight leading-tight">Skillio Mentor</h3>
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {isSpeaking ? "Sedang bicara…" : isListening ? "Mendengarkan…" : "Online"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {}
                <button
                  onClick={() => { setVoiceEnabled(v => !v); if (isSpeaking) stopSpeaking(); }}
                  title={voiceEnabled ? "Matikan suara AI" : "Aktifkan suara AI"}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === "user" ? "bg-dark-blue text-white" : "bg-primary-blue text-white"
                  )}>
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>

                  <div className={cn(
                    "p-3.5 rounded-[20px] max-w-[80%] shadow-sm text-sm font-medium leading-relaxed",
                    msg.role === "user"
                      ? "bg-dark-blue text-white rounded-tr-sm"
                      : "bg-white text-dark-blue border border-slate-100 rounded-tl-sm"
                  )}>
                    {msg.role === "ai" ? (
                      <div className="prose max-w-none prose-sm">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}

              {}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="p-4 rounded-[20px] bg-white border border-slate-100 rounded-tl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:100ms]" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:200ms]" />
                  </div>
                </div>
              )}

              {}
              {isListening && (
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black border border-red-100">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Mendengarkan kamu…
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {}
            <div className="p-4 bg-white border-t border-slate-100">

              {}
              {isSpeaking && (
                <div className="flex items-center justify-between mb-3 px-3 py-2 bg-primary-blue/5 rounded-xl border border-primary-blue/10">
                  <div className="flex items-center gap-2 text-xs font-black text-primary-blue">
                    <Volume2 size={13} className="animate-pulse" />
                    AI Mentor sedang berbicara…
                  </div>
                  <button
                    onClick={stopSpeaking}
                    className="text-xs font-black text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <StopCircle size={13} /> Stop
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "🎤 Bicara sekarang…" : "Tanya mentor…"}
                  disabled={isLoading || isListening}
                  className="w-full pl-5 pr-24 py-3.5 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 text-sm font-bold text-dark-blue transition-all disabled:opacity-50"
                />

                {}
                {micSupported && (
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                    title={isListening ? "Stop mendengarkan" : "Bicara ke mentor"}
                    className={cn(
                      "absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[12px] flex items-center justify-center transition-all",
                      isListening
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                        : "bg-slate-100 text-slate-500 hover:bg-primary-blue hover:text-white"
                    )}
                  >
                    {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                  </button>
                )}

                {}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || isListening}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary-blue text-white rounded-[12px] flex items-center justify-center shadow-md shadow-primary-blue/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </form>

              {micSupported && (
                <p className="text-center text-[10px] text-slate-300 font-medium mt-2">
                  Tekan 🎤 untuk bicara langsung dengan mentor
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 bg-dark-blue text-white rounded-full flex items-center justify-center shadow-2xl shadow-dark-blue/30 group relative"
      >
        <div className="absolute inset-0 bg-primary-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        <Sparkles size={28} className={cn("relative z-10 transition-transform duration-500", isOpen && "rotate-45")} />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
