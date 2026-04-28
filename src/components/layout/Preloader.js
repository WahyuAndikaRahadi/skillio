"use client";

import React, { useEffect, useState } from 'react';
import { animate, stagger } from 'framer-motion';
import Image from 'next/image';

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const runAnimation = async () => {
      const letters = document.querySelectorAll('.preloader-letter');
      const logo = document.querySelector('.preloader-logo');
      const progressBar = document.querySelector('.preloader-progress-bar');
      const container = document.querySelector('.preloader-container');
      const slogan = document.querySelector('.preloader-slogan');

      // 1. INTRO (0 - 1.2s): Logo, Letters, & Slogan muncul
      Promise.all([
        animate(logo, 
          { opacity: [0, 1], scale: [0.9, 1] }, 
          { duration: 1, ease: [0.22, 1, 0.36, 1] }
        ),
        animate(letters, 
          { opacity: [0, 1], y: [10, 0] }, 
          { delay: stagger(0.08, { startDelay: 0.3 }), duration: 0.6 }
        ),
        animate(slogan,
          { opacity: [0, 0.6], y: [5, 0] },
          { delay: 0.8, duration: 0.8, ease: "easeOut" }
        )
      ]);

      // 2. PROGRESS (0.2s - 0.8s): Loading bar jalan lebih cepat
      await animate(progressBar, 
        { width: "100%" }, 
        { duration: 0.6, ease: "easeInOut", delay: 0.2 }
      ).finished;

      // 3. EXIT (0.8s - 1.2s): Slide up cepat
      await animate(container, 
        { y: "-100%" }, 
        { duration: 0.4, ease: "easeIn" }
      ).finished;

      document.body.style.overflow = '';
      setIsVisible(false);
    };

    runAnimation();

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="preloader-container fixed inset-0 z-[99999] bg-white flex items-center justify-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="preloader-logo w-24 h-24 md:w-28 md:h-28 relative opacity-0">
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10" />
          <Image 
            src="/images/skillio-logo.png" 
            alt="Skillio Logo" 
            width={80}
            height={80}
            priority
            className="w-full h-full object-contain relative z-10"
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Main Title */}
          <div className="flex gap-2 md:gap-3">
            {['S', 'K', 'I', 'L', 'L', 'I', 'O'].map((letter, index) => (
              <span 
                key={index} 
                className="preloader-letter opacity-0 text-xl md:text-2xl font-black tracking-tight text-slate-900"
              >
                {letter}
              </span>
            ))}
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-32 h-[1px] bg-slate-100 rounded-full overflow-hidden relative">
            <div 
              className="preloader-progress-bar absolute left-0 top-0 h-full bg-blue-600" 
              style={{ width: '0%' }} 
            />
          </div>

          {/* Slogan Skillio */}
          <p className="preloader-slogan opacity-0 text-[10px] md:text-[11px] font-bold text-slate-700 tracking-[0.2em] mt-1 text-center">
            Temukan Karir Impianmu
          </p>
        </div>
      </div>

      {/* Subtle Grainy Overlay - Removed external heavy image for performance */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-slate-950/5" />
    </div>
  );
};

export default Preloader;