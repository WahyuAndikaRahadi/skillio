"use client";

import React from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export default function PWAInstallButton({ className }) {
  const { deferredPrompt, isInstalled, setDeferredPrompt } = useAppStore();

  const handleInstall = async () => {
    if (!deferredPrompt) {

      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <button
        disabled
        className={cn(
          "inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 text-sm sm:text-base font-bold text-white shadow-xl shadow-emerald-500/20 cursor-default transition-all",
          className
        )}
      >
        <CheckCircle2 size={20} />
        Aplikasi Terpasang
      </button>
    );
  }

  return (
    <button
      onClick={handleInstall}
      disabled={!deferredPrompt}
      className={cn(
        "inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-8 text-sm sm:text-base font-bold transition-all",
        deferredPrompt
          ? "bg-skillio-600 text-white shadow-xl shadow-skillio-500/20 hover:scale-105 active:scale-95"
          : "bg-slate-200 text-slate-400 cursor-not-allowed",
        className
      )}
    >
      <Download size={20} />
      {deferredPrompt ? "Pasang Aplikasi Skillio" : "Gunakan Menu Browser untuk Pasang"}
    </button>
  );
}
