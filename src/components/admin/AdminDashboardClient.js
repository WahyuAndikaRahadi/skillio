"use client";

import React from "react";
import { 
  Users, 
  Map, 
  Globe, 
  MessageSquare, 
  ShieldCheck,
  TrendingUp,
  Clock
} from "lucide-react";

export default function AdminDashboardClient({ metrics, latestUsers, latestGroups }) {
  const kpis = [
    { label: "Total Pengguna", value: metrics.totalUsers, icon: <Users size={24} />, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Roadmap Aktif", value: metrics.activeRoadmaps, icon: <Map size={24} />, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Grup Komunitas", value: metrics.totalGroups, icon: <Globe size={24} />, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Postingan Sosial", value: metrics.totalPosts, icon: <MessageSquare size={24} />, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-dark-blue flex items-center gap-3 tracking-tight">
            <ShieldCheck className="text-primary-blue" size={32} />
            Skillio Command Center
          </h1>
          <p className="text-slate-500 font-medium text-base mt-2">
            Ikhtisar platform dan analitik pengguna.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-[32px] p-6 border border-light-blue shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.label}</p>
              <h3 className="text-3xl font-black text-dark-blue">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        
        {/* Latest Users Table */}
        <div className="bg-white rounded-[40px] border border-light-blue p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-dark-blue flex items-center gap-3">
              <TrendingUp className="text-primary-blue" size={24} />
              Pengguna Baru
            </h3>
          </div>
          
          {latestUsers.length === 0 ? (
            <p className="text-slate-400 font-medium italic text-sm text-center py-6">Belum ada pengguna terdaftar.</p>
          ) : (
            <div className="space-y-4">
              {latestUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-blue/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-primary-blue shadow-sm overflow-hidden text-sm">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <img 
                          src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user.name || user.id}`} 
                          alt={user.name} 
                          className="w-full h-full object-cover bg-blue-50" 
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-dark-blue text-sm">{user.name || "Tanpa Nama"}</p>
                      <p className="text-xs font-medium text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-wider mb-0.5 flex items-center justify-end gap-1"><Clock size={10}/> Bergabung</p>
                    <p className="text-xs font-bold text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Groups Table */}
        <div className="bg-white rounded-[40px] border border-light-blue p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-dark-blue flex items-center gap-3">
              <Globe className="text-primary-blue" size={24} />
              Grup Baru Dibuat
            </h3>
          </div>
          
          {latestGroups.length === 0 ? (
            <p className="text-slate-400 font-medium italic text-sm text-center py-6">Belum ada grup yang dibuat.</p>
          ) : (
            <div className="space-y-4">
              {latestGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-blue/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center font-black text-primary-blue">
                      {group.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-dark-blue text-sm flex items-center gap-2">
                        {group.name}
                        {group.privacy === "private" && <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[9px] font-black uppercase text-slate-500">Privat</span>}
                      </p>
                      <p className="text-xs font-medium text-slate-400">Oleh: <span className="font-bold">{group.creatorName}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-wider mb-0.5">Member</p>
                    <p className="text-sm font-black text-primary-blue">
                      {group.memberCount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
