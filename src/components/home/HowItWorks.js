"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquareText, MapPin, Trophy } from "lucide-react";

const steps = [
  {
    icon: <MessageSquareText className="w-8 h-8" />,
    title: "AI Personal Discovery",
    desc: "Jawab 30 pertanyaan cerdas. AI kami akan membedah potensimu dan menemukan karier yang 100% cocok dengan kepribadianmu.",
    color: "bg-primary-blue",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "30-Day Master Roadmap",
    desc: "Dapatkan jadwal harian yang terstruktur. Tidak ada materi kosong, hanya aksi nyata yang membuatmu ahli dalam satu bulan.",
    color: "bg-dark-blue",
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Real Proof & Badges",
    desc: "Selesaikan tantangan harian dan kumpulkan badge. Bangun Skill Tree sebagai portofolio visual yang bisa kamu banggakan.",
    color: "bg-primary-blue",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-primary-blue uppercase tracking-widest mb-4">Sistem Kami</h2>
          <h3 className="text-4xl md:text-5xl font-black text-dark-blue">Bagaimana Skillio Mengubah Hidupmu?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-light-blue -z-10 -translate-y-[80px]" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`${step.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-primary-blue/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                {step.icon}
              </div>
              <div className="bg-light-blue w-8 h-8 rounded-full flex items-center justify-center text-primary-blue font-black mb-6 border-4 border-white">
                {index + 1}
              </div>
              <h4 className="text-2xl font-black text-dark-blue mb-4">{step.title}</h4>
              <p className="text-dark-blue/60 leading-relaxed font-medium">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
