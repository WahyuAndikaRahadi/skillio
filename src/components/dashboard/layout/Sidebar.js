"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  User,
  Trophy,
  LogOut,
  Globe,
  Map,
  Bot,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

const userMenuItems = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Ruang Belajar", href: "/belajar", icon: <BookOpen size={20} /> },
  { name: "Eksplor Roadmap", href: "/roadmap", icon: <Map size={20} /> },
  { name: "AI Mentor", href: "/ai", icon: <Bot size={20} /> },
  { name: "Social Feed", href: "/feed", icon: <Globe size={20} /> },
  { name: "Komunitas", href: "/community", icon: <Users size={20} /> },
  { name: "Profil", href: "/profile", icon: <User size={20} /> },
  { name: "Badge", href: "/badges", icon: <Trophy size={20} /> },
];

const adminMenuItems = [
  { name: "Dashboard Admin", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Kelola Kurikulum", href: "/admin/roadmaps", icon: <Map size={20} /> },
  { name: "Social Feed", href: "/feed", icon: <Globe size={20} /> },
  { name: "Komunitas", href: "/community", icon: <Users size={20} /> },
];

const Sidebar = ({ isMobile = false }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const isAdmin = session?.user?.role === "admin";
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <aside className={cn(
      "w-72 h-screen bg-white border-r border-light-blue flex flex-col p-6 z-40",
      !isMobile ? "fixed left-0 top-0 hidden lg:flex" : "flex"
    )}>
      <div className="mb-10">
        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2 group">
          <div className=" p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Image
              src="/images/skillio-logo.png"
              alt="Skillio Logo"
              width={30}
              height={30}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary-blue uppercase">
            SKILLIO {isAdmin && <span className="text-xs text-orange-500 block">ADMIN</span>}
          </span>
        </Link>
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl font-bold transition-all group",
                isActive
                  ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20"
                  : "text-dark-blue/60 hover:bg-light-blue hover:text-primary-blue"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-light-blue">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 p-4 w-full rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
