"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Fitur", href: "#features" },
    { name: "Cara Kerja", href: "#how-it-works" },
    { name: "Kategori", href: "#categories" },
    { name: "Testimoni", href: "#testimonials" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "glass py-3 shadow-md" : "bg-white/50 backdrop-blur-sm border-b border-light-blue/20"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary-blue p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary-blue">
            SKILLIO
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold text-dark-blue/80 hover:text-primary-blue transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/auth/login"
            className="text-sm font-bold text-primary-blue hover:text-accent-blue transition-colors px-4 py-2"
          >
            Masuk
          </Link>
          <Link 
            href="/auth/register"
            className="bg-primary-blue text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-accent-blue transition-all shadow-lg shadow-primary-blue/20"
          >
            Mulai Sekarang
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-light-blue p-6 flex flex-col gap-4 shadow-xl md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-semibold text-foreground py-2 border-b border-light-blue/50"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <Link 
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 font-semibold text-primary-blue border border-primary-blue rounded-xl text-center"
              >
                Masuk
              </Link>
              <Link 
                href="/auth/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 font-bold text-white bg-primary-blue rounded-xl text-center"
              >
                Mulai Sekarang
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
