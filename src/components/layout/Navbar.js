"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Fitur", href: "#features" },
  { name: "Bidang", href: "#digital-fields" },
  { name: "Roadmap", href: "#roadmap-generation" },
  { name: "Cara Kerja", href: "#how-it-works" },
];

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

  return (
    <nav className="fixed left-0 right-0 top-6 z-50 px-4 transition-all duration-500">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border border-skillio-100/30 px-5 py-2 transition-all duration-500 sm:px-6 lg:px-8",
          isScrolled
            ? "bg-white/70 shadow-[0_20px_50px_rgba(31,84,126,0.1)] backdrop-blur-xl"
            : "bg-white/40 shadow-sm backdrop-blur-md"
        )}
      >
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-skillio-600 text-white shadow-lg shadow-skillio-500/20 transition-all duration-300 group-hover:rotate-6 group-hover:bg-skillio-700">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            Skillio
          </span>
        </Link>

        {/* Desktop Navigation - Center Pill */}
        <div className="hidden items-center md:flex">
          <div className="relative flex items-center gap-1 rounded-full p-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative z-10 px-5 py-2 text-sm font-bold text-slate-600 transition-colors hover:text-skillio-600"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/auth/login"
            className="rounded-full px-5 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
          >
            Masuk
          </Link>
          <Link
            href="/auth/register"
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 px-6 text-sm font-bold text-white transition-all hover:bg-skillio-600 active:scale-95"
          >
            <span className="relative z-10">Daftar</span>
            <div className="absolute inset-0 z-0 translate-y-full bg-gradient-to-r from-skillio-600 to-skillio-500 transition-transform duration-300 group-hover:translate-y-0" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition-colors hover:bg-slate-200 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[-1] bg-slate-900/20 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="mx-auto mt-4 max-w-sm overflow-hidden rounded-[2.5rem] border border-skillio-100/30 bg-white/70 p-3 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-1 p-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-2xl px-5 py-3 text-base font-bold text-slate-700 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 flex flex-col gap-2 border-t border-slate-50 pt-4"
                >
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-700 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-2xl bg-skillio-600 text-sm font-bold text-white shadow-lg shadow-skillio-500/20"
                  >
                    Daftar
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
