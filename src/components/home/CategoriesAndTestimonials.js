"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Palette, BarChart, Camera, Megaphone, Globe } from "lucide-react";

const categories = [
  { name: "UI/UX Designer", icon: <Palette />, jobs: "2,400+ Lowongan" },
  { name: "Web Developer", icon: <Code />, jobs: "4,100+ Lowongan" },
  { name: "Data Analyst", icon: <BarChart />, jobs: "1,800+ Lowongan" },
  { name: "Content Creator", icon: <Camera />, jobs: "3,200+ Lowongan" },
  { name: "Digital Marketer", icon: <Megaphone />, jobs: "2,900+ Lowongan" },
  { name: "Product Manager", icon: <Globe />, jobs: "1,200+ Lowongan" },
];

const testimonials = [
  {
    name: "Aditya Pratama",
    role: "UI/UX Designer at TechID",
    text: "Sebelum Skillio, saya bingung mau mulai dari mana. Roadmap 30 harinya sangat membantu saya membangun portofolio dari nol.",
    avatar: "https://i.pravatar.cc/150?u=aditya",
  },
  {
    name: "Sarah Wijaya",
    role: "Front-end Developer",
    text: "Fitur AI Mentornya gila sih. Tiap saya stuck di materi harian, dia selalu kasih jawaban yang masuk akal dan mudah dimengerti.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
];

const CategoriesAndTestimonials = () => {
  return (
    <div className="bg-light-blue/20">
      {/* Categories Section */}
      <section id="categories" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:row justify-between items-end gap-6 mb-16">
            <div className="max-w-xl">
              <h2 className="text-sm font-black text-primary-blue uppercase tracking-widest mb-4">Pilih Jalurmu</h2>
              <h3 className="text-4xl font-black text-dark-blue">Karier Apa yang Ingin Kamu <span className="text-primary-blue">Taklukkan</span>?</h3>
            </div>
            <button className="text-primary-blue font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Lihat Semua Bidang
              <span className="text-xl">→</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-[32px] border border-light-blue hover:border-primary-blue transition-all group shadow-sm hover:shadow-xl hover:shadow-primary-blue/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-light-blue text-primary-blue flex items-center justify-center mb-6 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                  {cat.icon}
                </div>
                <h4 className="text-xl font-black text-dark-blue mb-2">{cat.name}</h4>
                <p className="text-sm text-dark-blue/50 font-bold">{cat.jobs}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-light-blue/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-sm font-black text-primary-blue uppercase tracking-widest mb-4">Kisah Sukses</h2>
             <h3 className="text-4xl font-black text-dark-blue">Mereka yang Sudah <span className="text-primary-blue">Berhasil</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testi, i) => (
              <div key={i} className="bg-light-blue/30 p-10 rounded-[40px] relative">
                <div className="absolute top-8 right-10 text-primary-blue/20">
                   <svg width="60" height="45" viewBox="0 0 60 45" fill="currentColor">
                     <path d="M16.6667 0L23.3333 11.25V45H0V11.25L10 0H16.6667ZM53.3333 0L60 11.25V45H36.6667V11.25L46.6667 0H53.3333Z" />
                   </svg>
                </div>
                <p className="text-lg font-medium text-dark-blue/80 mb-8 leading-relaxed italic">
                  "{testi.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={testi.avatar} alt={testi.name} className="w-14 h-14 rounded-full border-2 border-white shadow-lg" />
                  <div>
                    <h4 className="font-black text-dark-blue">{testi.name}</h4>
                    <p className="text-sm font-bold text-primary-blue">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-24 bg-primary-blue rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary-blue/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6">Siap Menemukan Karier <br /> Impianmu?</h3>
              <p className="text-white/80 font-medium mb-10 max-w-xl mx-auto">
                Jangan biarkan waktu terbuang percuma. Mulai 30 hari perjalanan belajarmu hari ini bersama Skillio.
              </p>
              <button className="bg-white text-primary-blue px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl active:scale-95">
                Daftar Sekarang - Gratis!
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesAndTestimonials;
