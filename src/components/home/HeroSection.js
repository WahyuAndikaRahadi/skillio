"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-blue/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-blue/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-light-blue text-primary-blue px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Star className="w-4 h-4 fill-primary-blue" />
            <span>Masa Depanmu Dimulai Di Sini</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-dark-blue mb-6 leading-[1.1]">
            Ubah Bingung Jadi <span className="text-primary-blue">Aksi Nyata</span> dalam 30 Hari.
          </h1>
          
          <p className="text-lg text-dark-blue/70 mb-10 leading-relaxed max-w-xl font-medium">
            Skillio menggunakan AI untuk membantumu menemukan karier yang paling cocok, lalu membimbingmu langkah-demi-langkah hingga benar-benar menguasainya.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button className="group w-full sm:w-auto bg-primary-blue text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-accent-blue transition-all shadow-xl shadow-primary-blue/30 active:scale-95">
              Mulai Petualanganmu
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-4 text-sm font-bold text-dark-blue/60">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-light-blue flex items-center justify-center text-[10px] overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <span>12,000+ Anak Muda Bergabung</span>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-foreground/80 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-primary-blue" />
              <span>Personalisasi AI</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-primary-blue" />
              <span>30 Hari Roadmap</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-primary-blue" />
              <span>Bukti Nyata</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          {/* Main Visual Placeholder */}
          <div className="relative z-10 rounded-[40px] overflow-hidden border-8 border-white shadow-2xl bg-white aspect-square max-w-[500px] mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-blue/20 to-transparent" />
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
              alt="Anak Muda Belajar" 
              className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Floating Card UI */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute top-10 -right-4 md:-right-10 glass p-5 rounded-2xl shadow-xl max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-blue flex items-center justify-center text-white font-bold">
                  98%
                </div>
                <div className="text-xs font-bold leading-tight">Match Rate Karier Kamu</div>
              </div>
              <div className="h-2 w-full bg-light-blue rounded-full overflow-hidden">
                <div className="h-full w-[98%] bg-primary-blue rounded-full" />
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
              className="absolute bottom-10 -left-4 md:-left-10 glass p-5 rounded-2xl shadow-xl max-w-[180px]"
            >
              <div className="text-[10px] font-bold text-primary-blue uppercase mb-2">Roadmap Hari Ke-12</div>
              <div className="text-sm font-black mb-3">Belajar Dasar UI/UX Design</div>
              <button className="text-[10px] font-bold bg-primary-blue text-white w-full py-2 rounded-lg">Lanjutkan</button>
            </motion.div>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-4 border-primary-blue rounded-full -z-10 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary-blue/10 rounded-full -z-20" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
