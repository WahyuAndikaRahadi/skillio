"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Globe,
  Map,
  Bot,
  BookOpen,
  Medal
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const userMenuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Ruang Belajar", href: "/belajar", icon: BookOpen },
  { name: "Eksplor Roadmap", href: "/roadmap", icon: Map },
  { name: "AI Mentor", href: "/ai", icon: Bot },
  { name: "Scoreboard", href: "/scoreboard", icon: Medal },
  { name: "Lencana", href: "/badges", icon: Trophy },
  { name: "Social Feed", href: "/feed", icon: Globe },
  { name: "Komunitas", href: "/community", icon: Users },
];

const adminMenuItems = [
  { name: "Dashboard Admin", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Kelola Kurikulum", href: "/admin/roadmaps", icon: Map },
  { name: "Social Feed", href: "/feed", icon: Globe },
  { name: "Komunitas", href: "/community", icon: Users },
];

const Sidebar = ({ isMobile = false }) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "admin";
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <aside className={cn(
      "w-64 h-screen bg-slate-50/40 backdrop-blur-xl border-r border-slate-200/60 flex flex-col p-4 z-40 transition-all duration-500",
      !isMobile ? "fixed left-0 top-0 hidden lg:flex" : "flex"
    )}>
      {/* Brand Section */}
      <div className="mb-8 px-2 pt-2">
        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-primary-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-all duration-500">
            <Image
              src="/images/skillio-logo.png"
              alt="Skillio Logo"
              width={20}
              height={20}
              className="object-contain brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-slate-900 leading-none">
              SKILLIO
            </span>
            {isAdmin && (
              <span className="text-[9px] font-black text-blue-600 tracking-widest uppercase mt-0.5">
                Admin
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Subtle Divider */}
      <div className="px-4 mb-6">
        <div className="h-px w-full bg-slate-200/60" />
      </div>

      {/* Navigation Section */}
      <div className="flex-grow space-y-1 overflow-hidden pr-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative block group outline-none"
            >
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-sm transition-all relative z-10",
                  isActive
                    ? "text-primary-blue"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
                  isActive 
                    ? "bg-blue-50 text-primary-blue shadow-inner" 
                    : "bg-slate-100/50 text-slate-400 group-hover:bg-white group-hover:text-primary-blue"
                )}>
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="tracking-tight text-[13px]">{item.name}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="sidebarActive"
                    className="absolute inset-0 bg-white shadow-[0_4px_12px_rgba(59,130,246,0.08)] border border-blue-100/50 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};



export default Sidebar;
