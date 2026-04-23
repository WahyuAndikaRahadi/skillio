"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  User, 
  Trophy, 
  Sparkles, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Komunitas", href: "/community", icon: <Users size={20} /> },
  { name: "Profil", href: "/profile", icon: <User size={20} /> },
  { name: "Badge", href: "/badges", icon: <Trophy size={20} /> },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-light-blue hidden lg:flex flex-col p-6 z-40">
      <div className="mb-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary-blue p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary-blue uppercase">
            SKILLIO
          </span>
        </Link>
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
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
              <ChevronRight className={cn("w-4 h-4 transition-transform", isActive ? "rotate-90" : "group-hover:translate-x-1")} />
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
