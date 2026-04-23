"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { name: "Fitur", href: "#features" },
  { name: "Roadmap", href: "#roadmap-generation" },
  { name: "Cara Kerja", href: "#how-it-works" },
  { name: "Testimoni", href: "#testimonials" },
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
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-50 px-5 py-4 transition-all duration-300 sm:px-6 lg:px-8",
        isScrolled
          ? "bg-white/78 py-3 shadow-[0_18px_50px_rgba(31,84,126,0.10)] backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-3 transition-all sm:px-5",
          isScrolled
            ? "border-white/80 bg-white/70"
            : "border-white/55 bg-white/58 backdrop-blur-md"
        )}
      >
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] text-white shadow-[0_16px_30px_rgba(31,84,126,0.22)] transition duration-300 group-hover:rotate-6">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-2xl leading-none tracking-[-0.06em] text-slate-950">
              Skillio
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Learn with direction
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-skillio-600"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-skillio-600"
          >
            Masuk
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(31,84,126,0.22)]"
          >
            Mulai Sekarang
          </Link>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-900 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Buka menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="mx-auto mt-3 max-w-6xl px-1 md:hidden"
          >
            <div className="rounded-[28px] border border-white/80 bg-white/88 p-4 shadow-[0_24px_60px_rgba(31,84,126,0.14)] backdrop-blur-xl">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-skillio-50 hover:text-skillio-600"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Mulai Sekarang
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
