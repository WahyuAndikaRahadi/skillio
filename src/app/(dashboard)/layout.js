"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import TopBar from "@/components/dashboard/layout/TopBar";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isImmersiveMode } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-50/30 relative overflow-hidden">
      {/* ═══ PREMIUM MESH GRADIENT BACKGROUND ═══ */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
      </div>

      {!isImmersiveMode && <Sidebar />}
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && !isImmersiveMode && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-dark-blue/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-2xl"
            >
               <Sidebar isMobile={true} />
               <button 
                 onClick={() => setIsSidebarOpen(false)}
                 className="absolute top-6 right-6 p-2 text-dark-blue hover:bg-light-blue rounded-xl"
               >
                 <X size={24} />
               </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={cn(
        "flex flex-col min-h-screen relative transition-all duration-500",
        !isImmersiveMode ? "lg:ml-64" : "lg:ml-0"
      )}>
        {!isImmersiveMode && <TopBar onMenuClick={() => setIsSidebarOpen(true)} />}
        
        <main className={cn(
          "flex-grow  w-full transition-all duration-500",
          !isImmersiveMode ? "pt-20" : "pt-12"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
