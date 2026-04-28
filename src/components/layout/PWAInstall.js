"use client";

import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('SW registered: ', registration);
          },
          (registrationError) => {
            console.log('SW registration failed: ', registrationError);
          }
        );
      });
    }

    // 2. Handle Installation Prompt
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show banner after a short delay (e.g. 5 seconds)
      const timer = setTimeout(() => {
        const isClosed = localStorage.getItem('pwa-banner-closed');
        if (!isClosed) {
          setShowInstallBanner(true);
        }
      }, 5000);

      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const handleClose = () => {
    setShowInstallBanner(false);
    // Don't show again in this session or for 24h
    localStorage.setItem('pwa-banner-closed', 'true');
  };

  return (
    <AnimatePresence>
      {showInstallBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:right-8 md:w-[400px]"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-skillio-100 p-5 flex items-center gap-4 relative overflow-hidden ring-1 ring-black/5">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-skillio-500/10 rounded-full blur-2xl" />
            
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-skillio-500 to-skillio-700 text-white shadow-lg shadow-skillio-500/30">
              <Download size={28} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Pasang Skillio App</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Akses roadmap & chat komunitas langsung dari homescreen kamu.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleInstall}
                className="px-5 py-2.5 bg-skillio-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-skillio-700 transition-all shadow-lg shadow-skillio-500/25 active:scale-95"
              >
                Install
              </button>
              <button 
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
