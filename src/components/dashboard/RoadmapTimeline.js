"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Lock, PlayCircle, Trophy, BookOpen, 
  ChevronRight, Loader2, Sparkles, ChevronDown, 
  ExternalLink 
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";

const RoadmapTimeline = ({ roadmap, days, userRoadmap }) => {
  const [activeDay, setActiveDay] = useState(userRoadmap.current_day || 1);
  const [progress, setProgress] = useState(userRoadmap.progress || []);
  const [isToggling, setIsToggling] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  
  // Lockout Logic: 24 Hours from last completed day
  const getLastCompletionTime = () => {
    const sortedProgress = [...progress].sort((a, b) => b.day_number - a.day_number);
    const lastCompleted = sortedProgress.find(p => p.quiz_passed);
    return lastCompleted?.completed_at ? new Date(lastCompleted.completed_at) : null;
  };

  const checkLockout = (dayNum) => {
    if (dayNum <= userRoadmap.current_day) return { isLocked: false };
    if (dayNum > userRoadmap.current_day + 1) return { isLocked: true, reason: "Buka hari sebelumnya dulu" };

    const lastCompletedAt = getLastCompletionTime();
    if (!lastCompletedAt) return { isLocked: false };

    const unlockAt = new Date(lastCompletedAt.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (now < unlockAt) {
      return { isLocked: true, reason: "Locked (Timer)", unlockAt };
    }
    return { isLocked: false };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const lock = checkLockout(userRoadmap.current_day + 1);
      if (lock.unlockAt) {
        const diff = lock.unlockAt - new Date();
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}j ${mins}m ${secs}d`);
        } else {
          setTimeLeft(null);
        }
      } else {
        setTimeLeft(null);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [progress, userRoadmap.current_day]);
  
  // AI Expansion States
  const [expandedContent, setExpandedContent] = useState({});
  const [isExpanding, setIsExpanding] = useState(false);
  const [showAiDropdown, setShowAiDropdown] = useState(false);

  const currentDayData = days.find(d => d.day_number === activeDay);
  
  // Sync expanded content if already in DB
  useEffect(() => {
    if (currentDayData?.ai_expanded_content) {
      setExpandedContent(prev => ({
        ...prev,
        [currentDayData.id]: currentDayData.ai_expanded_content
      }));
    }
  }, [currentDayData]);

  const getDayProgress = (dayNum) => {
    const p = progress.find(item => item.day_number === dayNum);
    const completedTasks = Array.isArray(p?.completed_tasks) ? p.completed_tasks : [];
    return {
      completed_tasks: completedTasks,
      quiz_passed: !!p?.quiz_passed
    };
  };

  const currentDayProgress = getDayProgress(activeDay);
  const allTasksDone = currentDayData?.tasks?.length > 0 && 
    currentDayData.tasks.every(t => currentDayProgress.completed_tasks.includes(t.id));

  const handleToggleTask = async (taskId) => {
    if (isToggling) return;
    setIsToggling(taskId);
    
    // Optimistic Update
    const oldProgress = [...progress];
    setProgress(prev => {
      const updated = [...prev];
      const dayIdx = updated.findIndex(p => p.day_number === activeDay);
      if (dayIdx !== -1) {
        const currentCompleted = Array.isArray(updated[dayIdx].completed_tasks) ? updated[dayIdx].completed_tasks : [];
        const isCurrentlyDone = currentCompleted.includes(taskId);
        updated[dayIdx] = { 
          ...updated[dayIdx], 
          completed_tasks: isCurrentlyDone 
            ? currentCompleted.filter(id => id !== taskId) 
            : [...currentCompleted, taskId]
        };
      } else {
        updated.push({ 
          day_number: activeDay, 
          completed_tasks: [taskId],
          quiz_passed: false
        });
      }
      return updated;
    });

    try {
      const res = await fetch("/api/roadmap/task/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_roadmap_id: userRoadmap.id,
          day_number: activeDay,
          task_id: taskId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      
      setProgress(prev => {
        const updated = [...prev];
        const dayIdx = updated.findIndex(p => p.day_number === activeDay);
        if (dayIdx !== -1) {
          updated[dayIdx] = { ...updated[dayIdx], completed_tasks: data.completed_tasks };
        }
        return updated;
      });
    } catch (err) {
      setProgress(oldProgress);
    } finally {
      setIsToggling(null);
    }
  };

  const handleExpandMaterial = async () => {
    if (expandedContent[currentDayData.id]) {
      setShowAiDropdown(!showAiDropdown);
      return;
    }

    setIsExpanding(true);
    try {
      const res = await fetch("/api/roadmap/day/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day_id: currentDayData.id })
      });
      const data = await res.json();
      if (res.ok) {
        setExpandedContent(prev => ({ ...prev, [currentDayData.id]: data }));
        setShowAiDropdown(true);
      }
    } catch (err) {
      alert("Gagal memproses materi AI. Silakan coba lagi.");
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Timeline Sidebar - Removed sticky on mobile */}
      <div className="lg:col-span-4 bg-white rounded-[32px] border border-light-blue p-6 h-fit lg:sticky lg:top-24 shadow-sm mb-6 lg:mb-0">
        <h3 className="text-xl font-black text-dark-blue mb-6 flex items-center gap-2">
          <BookOpen className="text-primary-blue" />
          Progres 30 Hari
        </h3>
        
        <div className="space-y-3 max-h-[40vh] lg:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {days.map((day) => {
            const dayProg = getDayProgress(day.day_number);
            const isCompleted = dayProg.quiz_passed;
            const lockStatus = checkLockout(day.day_number);
            const isLocked = lockStatus.isLocked;
            const isActive = activeDay === day.day_number;

            return (
              <button
                key={day.id}
                onClick={() => !isLocked && setActiveDay(day.day_number)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl transition-all border-2 group relative overflow-hidden",
                  isActive 
                    ? "border-primary-blue bg-light-blue/20" 
                    : isLocked 
                      ? "border-transparent opacity-50 cursor-not-allowed bg-slate-50" 
                      : "border-transparent hover:bg-light-blue/10"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 transition-colors",
                  isCompleted 
                    ? "bg-green-500 text-white" 
                    : isActive 
                      ? "bg-primary-blue text-white" 
                      : "bg-light-blue text-primary-blue group-hover:bg-primary-blue group-hover:text-white"
                )}>
                  {isCompleted ? <CheckCircle2 size={20} /> : day.day_number}
                </div>
                <div className="text-left flex-1">
                  <p className="text-[10px] font-bold text-dark-blue/40 uppercase tracking-widest">Hari {day.day_number}</p>
                  <p className="text-sm font-black text-dark-blue truncate max-w-[120px]">{day.title}</p>
                </div>
                {isLocked ? (
                  <div className="flex flex-col items-end">
                    <Lock size={14} className="text-dark-blue/20" />
                    {lockStatus.reason === "Locked (Timer)" && timeLeft && (
                      <span className="text-[9px] font-black text-primary-blue mt-1 animate-pulse">{timeLeft}</span>
                    )}
                  </div>
                ) : (
                  <ChevronRight size={16} className={cn("ml-auto transition-transform", isActive ? "text-primary-blue translate-x-1" : "text-dark-blue/20")} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Content */}
      <div className="lg:col-span-8 space-y-8">
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] border border-light-blue p-6 md:p-12 shadow-sm relative"
        >
          {/* Lockout Overlay */}
          {checkLockout(activeDay).isLocked && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-[40px]">
               <div className="w-24 h-24 bg-primary-blue/10 text-primary-blue rounded-full flex items-center justify-center mb-6">
                  <Lock size={40} />
               </div>
               <h2 className="text-3xl font-black text-dark-blue mb-2">Materi Masih Terkunci</h2>
               <p className="text-dark-blue/60 font-medium max-w-sm mb-8">
                 {checkLockout(activeDay).reason === "Locked (Timer)" 
                   ? "Anda sudah menyelesaikan misi hari ini! Silakan beristirahat agar materi meresap sempurna." 
                   : "Selesaikan misi hari sebelumnya untuk membuka hari ini."}
               </p>
               
               {checkLockout(activeDay).reason === "Locked (Timer)" && timeLeft && (
                 <div className="bg-primary-blue text-white px-8 py-4 rounded-3xl shadow-xl shadow-primary-blue/20">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Terbuka Dalam</p>
                    <p className="text-3xl font-black">{timeLeft}</p>
                 </div>
               )}
            </div>
          )}

          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div>
              <span className="bg-primary-blue/10 text-primary-blue px-4 py-1 rounded-full text-xs font-black uppercase mb-4 inline-block tracking-widest">
                Materi Hari ke-{activeDay}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-dark-blue leading-tight">
                {currentDayData?.title}
              </h1>
            </div>
            <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-2 shadow-sm">
              <Trophy size={20} />
              <span className="font-black">+50 XP</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 md:p-8 mb-8 border-l-8 border-primary-blue shadow-inner">
             <p className="text-lg text-dark-blue/80 font-medium leading-relaxed italic">
                &quot;{currentDayData?.material}&quot;
             </p>
          </div>

          {/* AI Helper Section */}
          <div className="mb-10">
             <button 
               onClick={handleExpandMaterial}
               disabled={isExpanding}
               className={cn(
                 "w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all group shadow-sm",
                 showAiDropdown ? "border-primary-blue bg-primary-blue text-white" : "border-primary-blue/20 bg-white text-primary-blue hover:border-primary-blue"
               )}
             >
               <div className="flex items-center gap-4">
                 {isExpanding ? <Loader2 className="animate-spin" /> : <Sparkles className={showAiDropdown ? "text-white" : "text-primary-blue"} />}
                 <span className="font-black text-lg">
                   {isExpanding ? "AI sedang menyusun materi..." : "Minta AI Jelaskan Lebih Dalam"}
                 </span>
               </div>
               <ChevronDown className={cn("transition-transform duration-300", showAiDropdown ? "rotate-180" : "")} />
             </button>

             <AnimatePresence>
               {showAiDropdown && expandedContent[currentDayData.id] && (
                 <motion.div
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: "auto", opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden"
                 >
                   <div className="mt-4 bg-white border-2 border-primary-blue/20 rounded-[32px] p-5 md:p-8 space-y-8 shadow-xl overflow-x-hidden">
                      <div>
                        <h4 className="text-primary-blue font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
                           <BookOpen size={16} /> Penjelasan Mendalam
                        </h4>
                        <div className="text-dark-blue/80 font-medium leading-relaxed whitespace-pre-line text-base">
                           {expandedContent[currentDayData.id].explanation}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-dark-blue font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <ExternalLink size={16} /> Referensi Artikel
                          </h4>
                          <div className="space-y-3">
                            {expandedContent[currentDayData.id].resources?.map((res, i) => {
                              const isValidUrl = typeof res.url === "string" && res.url.startsWith("http");
                              const Tag = isValidUrl ? "a" : "div";
                              return (
                                <Tag 
                                  key={i} 
                                  href={isValidUrl ? res.url : undefined} 
                                  target={isValidUrl ? "_blank" : undefined}
                                  className={cn(
                                    "block p-4 bg-slate-50 rounded-2xl border border-transparent transition-all",
                                    isValidUrl ? "hover:bg-primary-blue/10 hover:border-primary-blue/20 cursor-pointer" : "cursor-default"
                                  )}
                                >
                                  <p className="font-bold text-dark-blue text-sm">{res.title}</p>
                                  {!isValidUrl && <p className="text-[10px] text-dark-blue/40 mt-1 italic">Referensi Belajar</p>}
                                </Tag>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-red-600 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <FaYoutube size={18} /> Video Pembelajaran
                          </h4>
                          <a 
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(expandedContent[currentDayData.id].youtube_query)}`}
                            target="_blank"
                            className="flex items-center justify-between p-6 bg-red-50 rounded-3xl hover:bg-red-100 transition-all border border-red-100 group"
                          >
                             <div>
                               <p className="font-black text-red-700">Cari di YouTube</p>
                               <p className="text-xs text-red-600/60 font-bold">{expandedContent[currentDayData.id].youtube_query}</p>
                             </div>
                             <FaYoutube className="text-red-600 group-hover:scale-125 transition-transform" />
                          </a>
                        </div>
                      </div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          <div className="space-y-10">
            {/* Tasks Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-dark-blue">Daftar Tugas Hari Ini</h3>
                <span className="text-sm font-bold text-primary-blue bg-primary-blue/10 px-4 py-1 rounded-full">
                   {currentDayProgress.completed_tasks.length} / {currentDayData?.tasks?.length || 0} Selesai
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {currentDayData?.tasks?.map((task) => {
                  const isDone = currentDayProgress.completed_tasks.includes(task.id);
                  return (
                    <div 
                      key={task.id} 
                      onClick={() => handleToggleTask(task.id)}
                      className={cn(
                        "group flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-sm",
                        isDone ? "bg-green-50 border-green-200" : "bg-slate-50 border-transparent hover:border-primary-blue hover:bg-white"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                        isDone ? "bg-green-500 border-green-500" : "border-primary-blue group-hover:bg-primary-blue"
                      )}>
                        {isToggling === task.id ? (
                          <Loader2 size={12} className="text-white animate-spin" />
                        ) : (
                          <CheckCircle2 size={14} className={cn("text-white transition-opacity", isDone ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                        )}
                      </div>
                      <span className={cn(
                        "font-bold transition-all",
                        isDone ? "text-dark-blue/30 line-through italic" : "text-dark-blue group-hover:text-primary-blue"
                      )}>
                        {task.task_text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz Section */}
            <div className={cn(
              "rounded-[40px] p-8 md:p-12 relative overflow-hidden group transition-all duration-500 shadow-2xl",
              allTasksDone ? "bg-skillio-900 text-white" : "bg-slate-100 text-slate-400"
            )}>
              {allTasksDone && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-blue/30 transition-all duration-700" />
              )}
              <div className="relative z-10 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                   <h3 className={cn("text-2xl md:text-3xl font-black", allTasksDone ? "text-white" : "text-slate-400")}>Kuis Konfirmasi</h3>
                   {!allTasksDone && <Lock size={24} className="text-slate-400" />}
                </div>
                <p className={cn("text-base md:text-lg font-medium mb-10 max-w-xl mx-auto md:mx-0", allTasksDone ? "text-white/60" : "text-slate-400")}>
                  {allTasksDone 
                    ? "Luar biasa! Anda telah menyelesaikan seluruh tugas. Mari uji pemahaman Anda sekarang untuk mendapatkan XP dan lencana harian!"
                    : "Selesaikan semua tugas di atas terlebih dahulu untuk membuka kuis hari ini."}
                </p>
                <button 
                  onClick={() => window.location.href = `/quiz/day/${currentDayData.id}`}
                  disabled={!allTasksDone}
                  className={cn(
                    "w-full md:w-auto px-12 py-5 rounded-[24px] font-black transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 text-lg",
                    allTasksDone 
                      ? "bg-primary-blue hover:bg-accent-blue text-white shadow-primary-blue/40" 
                      : "bg-slate-300 text-white cursor-not-allowed shadow-none"
                  )}
                >
                  <PlayCircle size={24} />
                  Mulai Kuis Hari {activeDay}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoadmapTimeline;
