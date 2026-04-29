"use client";

import React from "react";
import { Sparkles, ArrowRight, BrainCircuit, Play, Target, Rocket, Award } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const EmptyState = ({ userName, hasProgress }) => {
  const firstName = userName?.split(" ")[0] || "User";

  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-[70vh] py-12 overflow-hidden">
      {}
      <div className="absolute top-0 right-0 w-80 h-80 bg-skillio-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 -z-10" />

      <div className="max-w-3xl px-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Temukan <span className="text-skillio-500">Passion</span> <br />
            Sejatimu, {firstName}!
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
            AI Mentor kami siap menganalisis potensimu dan membangun roadmap belajar 30 hari yang presisi.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <Link
            href="/quiz"
            className="group relative flex items-center gap-4 bg-gradient-to-r from-skillio-500 to-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:shadow-skillio-500/40 transition-all shadow-xl shadow-skillio-500/30 active:scale-[0.98]"
          >
            {hasProgress ? (
              <>
                <Play className="w-5 h-5 fill-current" />
                Lanjutkan Kuis
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Mulai Analisis AI
              </>
            )}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </Link>

          {hasProgress && (
             <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
               Analisis sedang berlangsung
             </p>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default EmptyState;
