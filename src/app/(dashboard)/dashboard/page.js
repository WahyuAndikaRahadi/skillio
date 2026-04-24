import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { 
  Flame, 
  Target, 
  Trophy, 
  TrendingUp, 
  Zap,
  BookOpen,
  Award
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch user stats
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      streak: true,
      badges: {
        include: { badge: true }
      }
    }
  });

  const userRoadmap = await prisma.userRoadmap.findFirst({
    where: { user_id: session.user.id, status: "active" },
    include: { 
      category: true,
      progress: true
    }
  });

  // Calculate generic progress
  const totalCompleted = userRoadmap?.progress?.filter(p => p.status === "completed").length || 0;
  const progressPercentage = userRoadmap ? Math.min(Math.round((totalCompleted / 30) * 100), 100) : 0;
  const currentStreak = user?.streak?.current_streak || 0;
  const bestStreak = user?.streak?.longest_streak || 0;

  // Dummy chart data for weekly activity
  const weeklyData = [
    { day: "Sen", xp: 120 },
    { day: "Sel", xp: 250 },
    { day: "Rab", xp: 180 },
    { day: "Kam", xp: 300 },
    { day: "Jum", xp: 50 },
    { day: "Sab", xp: 400 },
    { day: "Min", xp: 350 },
  ];
  const maxWeeklyXp = Math.max(...weeklyData.map(d => d.xp));

  return (
    <div className="max-w-7xl mx-auto space-y-10">
       
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-dark-blue mb-2">Halo, {session.user.name.split(' ')[0]}! 👋</h1>
            <p className="text-dark-blue/60 font-medium text-lg">Pantau terus perkembangan belajarmu hari ini.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-light-blue shadow-sm">
             <div className="flex items-center gap-2 px-6 py-3 bg-orange-50 rounded-full">
                <Flame className="text-orange-500" fill="currentColor" size={20} />
                <span className="font-black text-orange-500">{currentStreak} Hari</span>
             </div>
             <div className="flex items-center gap-2 px-6 py-3 bg-primary-blue/10 rounded-full">
                <Zap className="text-primary-blue" fill="currentColor" size={20} />
                <span className="font-black text-primary-blue">{user?.xp || 0} XP</span>
             </div>
          </div>
       </div>

       {/* Top Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-dark-blue to-primary-blue rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-primary-blue/20">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
             <div className="flex justify-between items-start mb-12">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                   <Target size={32} className="text-white" />
                </div>
                <span className="font-black text-white/50 tracking-widest text-sm uppercase">Roadmap</span>
             </div>
             <div>
                <h3 className="text-3xl font-black mb-2">{progressPercentage}% Selesai</h3>
                <p className="text-white/70 font-medium">{userRoadmap ? userRoadmap.category.name : "Belum memilih bidang"}</p>
                <div className="w-full h-2 bg-white/20 rounded-full mt-6 overflow-hidden">
                   <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[40px] border border-light-blue p-8 shadow-sm group hover:shadow-xl transition-all">
             <div className="flex justify-between items-start mb-12">
                <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl group-hover:scale-110 transition-transform">
                   <Flame size={32} />
                </div>
                <span className="font-black text-slate-300 tracking-widest text-sm uppercase">Konsistensi</span>
             </div>
             <div>
                <h3 className="text-4xl font-black text-dark-blue mb-2">{bestStreak} Hari</h3>
                <p className="text-slate-400 font-medium">Rekor streak terbaikmu sejauh ini</p>
             </div>
          </div>

          <div className="bg-white rounded-[40px] border border-light-blue p-8 shadow-sm group hover:shadow-xl transition-all">
             <div className="flex justify-between items-start mb-12">
                <div className="p-4 bg-purple-50 text-purple-500 rounded-2xl group-hover:scale-110 transition-transform">
                   <Trophy size={32} />
                </div>
                <span className="font-black text-slate-300 tracking-widest text-sm uppercase">Koleksi</span>
             </div>
             <div>
                <h3 className="text-4xl font-black text-dark-blue mb-2">{user?.badges?.length || 0} Badge</h3>
                <p className="text-slate-400 font-medium">Penghargaan yang berhasil dikumpulkan</p>
             </div>
          </div>
       </div>

       {/* Charts & Analytics */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart: Weekly XP Activity */}
          <div className="lg:col-span-2 bg-white rounded-[40px] border border-light-blue p-8 shadow-sm">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-xl font-black text-dark-blue flex items-center gap-2">
                      <TrendingUp className="text-primary-blue" /> Aktivitas Belajar
                   </h3>
                   <p className="text-slate-400 font-medium mt-1">XP yang diperoleh dalam 7 hari terakhir</p>
                </div>
             </div>

             <div className="h-[300px] flex items-end justify-between gap-2 pt-10">
                {weeklyData.map((data, idx) => {
                  const height = `${(data.xp / maxWeeklyXp) * 100}%`;
                  return (
                    <div key={idx} className="relative flex flex-col items-center flex-1 group">
                       {/* Tooltip */}
                       <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-blue text-white text-xs font-bold py-1.5 px-3 rounded-xl pointer-events-none whitespace-nowrap z-10 shadow-xl">
                          {data.xp} XP
                       </div>
                       
                       {/* Bar */}
                       <div className="w-full max-w-[48px] bg-slate-50 rounded-t-2xl relative overflow-hidden h-full flex items-end group-hover:bg-slate-100 transition-colors">
                          <div 
                            className="w-full bg-primary-blue rounded-t-2xl transition-all duration-1000 ease-out"
                            style={{ height }}
                          ></div>
                       </div>
                       
                       {/* Label */}
                       <span className="mt-4 text-xs font-black text-slate-400 uppercase">{data.day}</span>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
             <div className="bg-white rounded-[40px] border border-light-blue p-8 shadow-sm">
                <h3 className="font-black text-dark-blue mb-6">Materi Terselesaikan</h3>
                <div className="flex items-center gap-6">
                   <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-50"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-green-500 transition-all duration-1000"
                          strokeDasharray={`${progressPercentage}, 100`}
                          strokeWidth="3"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-xl font-black text-dark-blue">{progressPercentage}%</span>
                      </div>
                   </div>
                   <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-2xl font-black text-dark-blue">{totalCompleted} <span className="text-sm font-medium text-slate-400">/ 30 Hari</span></p>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-[40px] border border-light-blue p-8 shadow-sm">
                <h3 className="font-black text-dark-blue mb-6">Pencapaian Terbaru</h3>
                {user?.badges?.length > 0 ? (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                     <img src={user.badges[user.badges.length - 1].badge.image_url} alt="Badge" className="w-12 h-12" />
                     <div>
                        <h4 className="font-bold text-dark-blue">{user.badges[user.badges.length - 1].badge.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">Diperoleh hari ini</p>
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-6 border-2 border-dashed border-slate-100 rounded-3xl">
                     <Award className="text-slate-300 mb-2" size={24} />
                     <p className="text-xs font-bold text-slate-400">Belum ada badge.</p>
                  </div>
                )}
             </div>
          </div>
       </div>

    </div>
  );
}
