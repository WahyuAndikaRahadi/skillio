"use client";

import React from "react";
import { Sparkles, ArrowRight, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const EmptyState = ({ userName }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-primary-blue/10 rounded-[32px] flex items-center justify-center text-primary-blue mb-8 shadow-inner"
      >
        <BrainCircuit size={48} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl md:text-5xl font-black text-dark-blue mb-4">
          Halo, {userName || "Sobat Skillio"}! 👋
        </h1>
        <p className="text-lg text-dark-blue/60 font-medium max-w-lg mx-auto mb-12">
          Perjalanan karier impianmu belum dimulai. Yuk, biarkan AI kami membantumu menemukan bidang yang paling cocok dengan dirimu!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-blue to-accent-blue rounded-[24px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <Link 
          href="/quiz"
          className="relative flex items-center gap-3 bg-primary-blue text-white px-10 py-5 rounded-[24px] font-black text-xl hover:bg-accent-blue transition-all shadow-xl shadow-primary-blue/20 active:scale-[0.98]"
        >
          <Sparkles className="w-6 h-6" />
          Mulai Quiz Penentuan
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Decorative background element */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[
          { title: "30 Pertanyaan", desc: "Berbasis kepribadian & minat", icon: "📝" },
          { title: "AI Matching", desc: "98% akurasi bidang karier", icon: "🤖" },
          { title: "Roadmap 30 Hari", desc: "Langkah nyata setiap hari", icon: "🎯" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-light-blue shadow-sm">
            <div className="text-3xl mb-4">{item.icon}</div>
            <h4 className="font-bold text-dark-blue mb-1">{item.title}</h4>
            <p className="text-sm text-dark-blue/50 font-bold">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
