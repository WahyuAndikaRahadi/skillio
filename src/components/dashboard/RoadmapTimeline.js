"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Lock, PlayCircle, Trophy, BookOpen, 
  ChevronDown, ExternalLink, Target, Calendar, ArrowRight, ArrowLeft, Star,
  Zap, Flame, Award, ShieldCheck, Sparkles, ChevronRight, ChevronLeft,
  X, HelpCircle, Loader2, XCircle
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const cleanAiText = (text) => {
  if (!text) return "";
  let cleaned = text.replace(/[#*]/g, "");
  // Tambahkan baris baru sebelum angka (2., 3., dst) jika tidak ada
  cleaned = cleaned.replace(/([^\n])\s*(\d+\.)/g, "$1\n\n$2");
  return cleaned.trim();
};

const RoadmapTimeline = ({ roadmap, days, userRoadmap, onToggleDetail }) => {
  const { isImmersiveMode, setIsImmersiveMode } = useAppStore();
  const [progress, setProgress] = useState(userRoadmap.progress || []);
  const [currentDay, setCurrentDay] = useState(userRoadmap.current_day);
  
  // View States
  const [viewMode, setViewMode] = useState('roadmap'); // 'roadmap', 'theory', 'quiz'
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Quiz Specific States
  const [quizzes, setQuizzes] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  const [isToggling, setIsToggling] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Notify parent and store when detail view opens/closes
  useEffect(() => {
    const isImmersive = viewMode === 'theory' || viewMode === 'quiz';
    if (onToggleDetail) {
      onToggleDetail(isImmersive);
    }
    setIsImmersiveMode(isImmersive);
    
    // Cleanup on unmount
    return () => setIsImmersiveMode(false);
  }, [viewMode, onToggleDetail, setIsImmersiveMode]);
  
  const getLastCompletionTime = () => {
    const sortedProgress = [...progress].sort((a, b) => b.day_number - a.day_number);
    const lastCompleted = sortedProgress.find(p => p.quiz_passed);
    return lastCompleted?.completed_at ? new Date(lastCompleted.completed_at) : null;
  };

  const checkLockout = (dayNum) => {
    // Hari pertama selalu terbuka jika belum ada progres
    if (dayNum === 1) return { isLocked: false };

    // Ambil progres hari ini dan hari sebelumnya
    const dayProg = getDayProgress(dayNum);
    const prevDayProg = getDayProgress(dayNum - 1);

    // Jika hari ini sudah lulus kuis, berarti sudah terbuka (untuk review)
    if (dayProg.quiz_passed) return { isLocked: false };

    // Jika hari sebelumnya BELUM lulus kuis, maka hari ini terkunci
    if (!prevDayProg.quiz_passed) return { isLocked: true, reason: "Selesaikan misi sebelumnya" };

    // Jika hari sebelumnya SUDAH lulus, cek apakah sudah berganti hari (kalender)
    const p = progress.find(item => item.day_number === dayNum - 1);
    if (p && p.completed_at) {
      const lastCompletedAt = new Date(p.completed_at);
      const now = new Date();
      
      // Buat objek tanggal untuk membandingkan hari saja
      const lastDate = new Date(lastCompletedAt);
      lastDate.setHours(0, 0, 0, 0);
      
      const todayDate = new Date(now);
      todayDate.setHours(0, 0, 0, 0);
      
      // Jika hari ini masih sama dengan hari terakhir selesai, maka kunci
      if (todayDate.getTime() <= lastDate.getTime()) {
        const nextMidnight = new Date(todayDate);
        nextMidnight.setDate(nextMidnight.getDate() + 1);
        nextMidnight.setHours(0, 0, 0, 0);
        
        return { isLocked: true, reason: "Locked", unlockAt: nextMidnight };
      }
    }

    return { isLocked: false };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const lock = checkLockout(currentDay + 1);
      if (lock.unlockAt) {
        const diff = lock.unlockAt - new Date();
        if (diff > 0) {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${h}j ${m}m ${s}d`);
        } else setTimeLeft(null);
      } else setTimeLeft(null);
    }, 1000);
    return () => clearInterval(timer);
  }, [progress, currentDay]);
  
  const [expandedContent, setExpandedContent] = useState({});
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    if (selectedDay) {
      if (!expandedContent[selectedDay.id] && !isExpanding) {
        handleExpandMaterial();
      }
    }
    setCurrentSlide(0);
  }, [selectedDay]);

  const getDayProgress = (dayNum) => {
    const p = progress.find(item => item.day_number === dayNum);
    return {
      completed_tasks: Array.isArray(p?.completed_tasks) ? p.completed_tasks : [],
      quiz_passed: !!p?.quiz_passed
    };
  };

  const handleToggleTask = async (taskId) => {
    if (isToggling || !selectedDay) return;
    setIsToggling(taskId);
    const oldProgress = [...progress];
    setProgress(prev => {
      const updated = [...prev];
      const dayIdx = updated.findIndex(p => p.day_number === selectedDay.day_number);
      if (dayIdx !== -1) {
        const currentCompleted = Array.isArray(updated[dayIdx].completed_tasks) ? updated[dayIdx].completed_tasks : [];
        const isCurrentlyDone = currentCompleted.includes(taskId);
        updated[dayIdx] = { 
          ...updated[dayIdx], 
          completed_tasks: isCurrentlyDone ? currentCompleted.filter(id => id !== taskId) : [...currentCompleted, taskId]
        };
      } else {
        updated.push({ day_number: selectedDay.day_number, completed_tasks: [taskId], quiz_passed: false });
      }
      return updated;
    });

    try {
      const res = await fetch("/api/roadmap/task/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_roadmap_id: userRoadmap.id, day_number: selectedDay.day_number, task_id: taskId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setProgress(prev => {
        const updated = [...prev];
        const dayIdx = updated.findIndex(p => p.day_number === selectedDay.day_number);
        if (dayIdx !== -1) updated[dayIdx] = { ...updated[dayIdx], completed_tasks: data.completed_tasks };
        return updated;
      });
    } catch (err) {
      setProgress(oldProgress);
    } finally {
      setIsToggling(null);
    }
  };

  const handleExpandMaterial = async () => {
    if (!selectedDay) return;
    setIsExpanding(true);
    try {
      const res = await fetch("/api/roadmap/day/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day_id: selectedDay.id })
      });
      const data = await res.json();
      if (res.ok) {
        setExpandedContent(prev => ({ ...prev, [selectedDay.id]: data }));
      }
    } catch (err) {
      console.error("Gagal memproses materi AI.");
    } finally {
      setIsExpanding(false);
    }
  };

  // ═══ START QUIZ FLOW ═══
  const handleStartQuiz = async () => {
    if (!selectedDay) return;
    setQuizLoading(true);
    try {
      const res = await fetch(`/api/quiz/day/${selectedDay.id}`);
      const data = await res.json();
      if (res.ok) {
        const quizArray = Array.isArray(data) ? data : [data];
        setQuizzes(quizArray);
        setQuizIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsSubmitted(false);
        setQuizFinished(false);
        setViewMode('quiz');
      }
    } catch (err) {
      alert("Gagal memuat kuis.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (!selectedAnswer || isSubmitted) return;
    const currentQuiz = quizzes[quizIndex];
    const correct = selectedAnswer === currentQuiz.correct_option;
    if (correct) setScore(prev => prev + 1);
    setIsSubmitted(true);
  };

  const handleQuizNext = async () => {
    if (quizIndex < quizzes.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      const finalScore = Math.round((score / quizzes.length) * 100);
      setSavingResult(true);
      try {
        const res = await fetch("/api/quiz/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day_id: selectedDay.id, score: finalScore })
        });
        const data = await res.json();
        if (res.ok) {
           // Update local progress and current day to show completed and start the 24h timer
           setProgress(prev => {
              const updated = [...prev];
              const idx = updated.findIndex(p => p.day_number === selectedDay.day_number);
              const now = new Date().toISOString();
              if (idx !== -1) {
                updated[idx] = { ...updated[idx], quiz_passed: true, completed_at: now };
              } else {
                updated.push({ day_number: selectedDay.day_number, quiz_passed: true, completed_at: now, completed_tasks: [] });
              }
              return updated;
           });
           // Majukan hari secara lokal
           setCurrentDay(prev => prev + 1);
        }
      } catch (err) {
        console.error("Gagal simpan kuis");
      } finally {
        setSavingResult(false);
      }
    }
  };

  // ═══ RENDER QUIZ VIEW ═══
  const renderQuizView = () => {
    if (quizFinished) {
      const finalScore = Math.round((score / quizzes.length) * 100);
      const isPassed = finalScore >= 60;

      return (
        <div className="w-full flex flex-col min-h-[85vh] relative pt-12 items-center justify-center">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-skillio-50/40 rounded-full blur-[120px] -z-10 pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full bg-white rounded-[40px] border border-slate-100 p-10 md:p-14 shadow-2xl text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-skillio-500 to-teal-400" />
             <div className="flex justify-center mb-8">
                <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl rotate-3", isPassed ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-orange-500 text-white shadow-orange-200")}>
                   {isPassed ? <Trophy size={48} /> : <Award size={48} />}
                </div>
             </div>
             <h2 className="text-4xl font-black text-slate-900 mb-3">Misi Selesai!</h2>
             <p className="text-slate-500 font-bold mb-10">Skor Anda: {finalScore}/100</p>
             <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">XP Didapatkan</p>
                <h3 className="text-5xl font-black text-skillio-600">+50 XP</h3>
             </div>
             <button onClick={() => { setViewMode('roadmap'); setSelectedDay(null); window.scrollTo(0, 0); }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-slate-900/20 hover:bg-skillio-600 transition-all cursor-pointer">
               Kembali ke Roadmap
             </button>
          </motion.div>
        </div>
      );
    }

    const currentQuiz = quizzes[quizIndex];
    const progressPercent = ((quizIndex + 1) / quizzes.length) * 100;

    return (
      <div className="w-full flex flex-col min-h-[85vh] relative pt-2">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-skillio-50/40 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="fixed top-0 left-0 w-full z-[60] bg-white px-6 py-4 border-b border-slate-100 flex justify-center">
           <div className="max-w-7xl w-full flex items-center gap-6">
              <button onClick={() => setViewMode('theory')} className="p-2 text-slate-300 hover:text-slate-900 transition-colors cursor-pointer"><X size={24} /></button>
              <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                 <motion.div className="h-full bg-gradient-to-r from-skillio-500 to-teal-400" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Soal {quizIndex + 1} / {quizzes.length}</div>
           </div>
        </div>
        <div className="max-w-5xl mx-auto w-full flex-grow flex flex-col justify-start py-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={quizIndex} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              className="space-y-8"
            >
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-skillio-50 text-skillio-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    <Target size={12} /> Kuis Pemahaman
                 </div>
                 <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    {currentQuiz.question_text}
                 </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuiz.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isAnsCorrect = isSubmitted && option === currentQuiz.correct_option;
                  const isAnsWrong = isSubmitted && isSelected && selectedAnswer !== currentQuiz.correct_option;
                  
                  return (
                    <button 
                      key={index} 
                      disabled={isSubmitted} 
                      onClick={() => setSelectedAnswer(option)} 
                      className={cn(
                        "flex items-center justify-between p-5 md:p-6 rounded-3xl border-2 transition-all text-left group cursor-pointer", 
                        isSelected && !isSubmitted && "border-skillio-500 bg-skillio-50/30 shadow-md", 
                        isAnsCorrect && "border-emerald-500 bg-emerald-50/50", 
                        isAnsWrong && "border-red-500 bg-red-50/50", 
                        !isSelected && !isSubmitted && "border-slate-100 bg-white hover:border-skillio-200"
                      )}
                    >
                      <span className={cn(
                        "font-bold text-base md:text-lg transition-colors", 
                        isSelected && !isSubmitted ? "text-skillio-600" : "text-slate-700", 
                        isAnsCorrect && "text-emerald-700", 
                        isAnsWrong && "text-red-700"
                      )}>
                        {option}
                      </span>
                      <div className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0", 
                        isAnsCorrect ? "bg-emerald-500 border-emerald-500 text-white" : 
                        isAnsWrong ? "bg-red-500 border-red-500 text-white" :
                        isSelected ? "bg-skillio-500 border-skillio-500 text-white" : "border-slate-200"
                      )}>
                         {isAnsCorrect ? <CheckCircle2 size={14} /> : 
                          isAnsWrong ? <XCircle size={14} /> : 
                          isSelected ? <div className="w-1.5 h-1.5 bg-white rounded-full" /> : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {isSubmitted && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    className="pt-4"
                  >
                     <div className="bg-white border border-slate-100 rounded-[32px] shadow-xl shadow-slate-100/50 overflow-hidden">
                        <div className={cn(
                          "p-4 px-6 flex items-center gap-3",
                          selectedAnswer === currentQuiz.correct_option ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        )}>
                           <Sparkles size={18} />
                           <span className="font-black text-xs uppercase tracking-widest">Analisis AI Mentor</span>
                        </div>
                        <div className="p-6 md:p-8">
                           <p className="text-slate-700 font-medium leading-relaxed text-base md:text-lg italic">
                              "{cleanAiText(currentQuiz.explanation)}"
                           </p>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-6 flex justify-center z-50">
           <div className="max-w-7xl w-full flex items-center justify-end">
              {!isSubmitted ? (
                <button onClick={handleQuizSubmit} disabled={!selectedAnswer} className={cn("px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center gap-3 cursor-pointer", selectedAnswer ? "bg-slate-900 text-white hover:bg-skillio-600" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>Konfirmasi Jawaban <ArrowRight size={20} /></button>
              ) : (
                <button onClick={handleQuizNext} className="px-12 py-5 rounded-2xl bg-skillio-600 text-white font-black text-lg transition-all shadow-xl flex items-center gap-3 cursor-pointer hover:bg-skillio-700">{quizIndex < quizzes.length - 1 ? "Lanjutkan" : "Lihat Hasil"} <ChevronRight size={20} /></button>
              )}
           </div>
        </div>
      </div>
    );
  };

  // ═══ THEORY DETAIL VIEW ═══
  const renderDayDetail = () => {
    if (!selectedDay) return null;
    const dayProg = getDayProgress(selectedDay.day_number);
    const allTasksDone = selectedDay.tasks?.length > 0 && selectedDay.tasks.every(t => dayProg.completed_tasks.includes(t.id));

    const totalSlides = 3;
    const progressPercent = ((currentSlide + 1) / totalSlides) * 100;

    return (
      <div className="w-full flex flex-col min-h-[85vh] relative pt-2">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-skillio-50/40 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-teal-50/30 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="fixed top-0 left-0 w-full z-[60] bg-white px-6 py-4 border-b border-slate-100 flex justify-center">
           <div className="max-w-7xl w-full flex items-center gap-6">
              <button onClick={() => { setViewMode('roadmap'); setSelectedDay(null); window.scrollTo(0, 0); }} className="p-2 text-slate-300 hover:text-slate-900 transition-colors cursor-pointer"><X size={24} /></button>
              <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                 <motion.div className="h-full bg-gradient-to-r from-skillio-500 to-teal-400" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Langkah {currentSlide + 1} / {totalSlides}</div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col justify-start py-4">
          <AnimatePresence mode="wait">
            {currentSlide === 0 && (
              <motion.div key="theory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div className="space-y-3">
                   <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-skillio-50 text-skillio-600 rounded-lg text-[9px] font-black uppercase tracking-widest"><BookOpen size={12} /> Teori & Konsep</div>
                   <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedDay.title}</h2>
                  <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-5xl">{selectedDay.material}</p>
                </div>
                <div className="pt-2">
                   <div className="bg-white border border-slate-100 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(43,110,166,0.12)] overflow-hidden">
                      <div className="bg-gradient-to-r from-skillio-600 to-skillio-500 p-5 md:p-6 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-white/20 text-white rounded-xl backdrop-blur-md"><Sparkles size={20} /></div>
                            <div>
                               <h3 className="text-white font-black text-base tracking-tight">AI Mentor Insight</h3>
                               <p className="text-white/60 text-[9px] font-black uppercase tracking-widest">Deep Explanation</p>
                            </div>
                         </div>
                      </div>
                      <div className="p-6 md:p-8 space-y-6">
                         {isExpanding ? (
                            <div className="flex flex-col items-center justify-center py-6 space-y-3">
                               <div className="animate-spin w-6 h-6 border-3 border-skillio-500 border-t-transparent rounded-full" />
                               <p className="text-xs font-bold text-slate-400 animate-pulse">Menghimpun pengetahuan...</p>
                            </div>
                         ) : expandedContent[selectedDay.id] ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                               <div className="lg:col-span-8">
                                  <div className="max-h-[350px] md:max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                                     <p className="text-slate-700 leading-relaxed font-medium text-base md:text-lg whitespace-pre-wrap">
                                        {cleanAiText(expandedContent[selectedDay.id].explanation)}
                                     </p>
                                  </div>
                               </div>
                               <div className="lg:col-span-4 space-y-6">
                                  <div className="space-y-3 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bahan Bacaan</p>
                                     <div className="flex flex-col gap-2">
                                        {expandedContent[selectedDay.id].resources?.map((res, i) => (
                                          <a key={i} href={res.url} target="_blank" className="flex items-center justify-between px-4 py-2.5 bg-white border border-slate-100 rounded-xl hover:border-skillio-300 transition-all text-[11px] font-black text-slate-600 cursor-pointer group shadow-sm"><span className="truncate pr-2">{res.title}</span><ExternalLink size={12} className="shrink-0 opacity-40 group-hover:opacity-100" /></a>
                                        ))}
                                     </div>
                                  </div>
                                  <div className="space-y-3 p-5 bg-red-50/30 rounded-2xl border border-red-50/50">
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Video Tutorial</p>
                                     <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(expandedContent[selectedDay.id].youtube_query)}`} target="_blank" className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-red-100 text-red-600 rounded-xl text-[11px] font-black cursor-pointer hover:bg-red-100 transition-all shadow-sm"><FaYoutube size={16} /> Tonton di YouTube</a>
                                  </div>
                               </div>
                            </div>
                         ) : (
                            <p className="text-slate-400 font-medium italic text-center py-6 text-sm">Gagal memuat insight tambahan.</p>
                         )}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {currentSlide === 1 && (
              <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-3">
                   <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Misi Praktik</h2>
                   <p className="text-lg text-slate-400 font-medium italic">"Belajar terbaik adalah dengan melakukan."</p>
                </div>
                <div className="grid grid-cols-1 gap-4 max-w-4xl">
                   {selectedDay.tasks?.map((task) => {
                     const isDone = dayProg.completed_tasks.includes(task.id);
                     return (
                       <button key={task.id} onClick={() => handleToggleTask(task.id)} className={cn("w-full flex items-center gap-6 p-6 md:p-8 rounded-[32px] transition-all border-2 text-left cursor-pointer", isDone ? "bg-emerald-50/50 border-emerald-100" : "bg-white border-slate-100 hover:border-skillio-200 shadow-sm")}>
                         <div className={cn("w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shrink-0", isDone ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200" : "border-slate-300")}>{isToggling === task.id ? <div className="animate-spin w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full" /> : <CheckCircle2 size={18} className={cn(isDone ? "opacity-100" : "opacity-0")} />}</div>
                         <span className={cn("text-lg md:text-xl font-bold transition-all", isDone ? "text-slate-300 line-through" : "text-slate-800")}>{task.task_text}</span>
                       </button>
                     );
                   })}
                </div>
              </motion.div>
            )}

            {currentSlide === 2 && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center justify-center py-20 text-center space-y-10">
                <div className={cn("w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000", allTasksDone ? "bg-skillio-100 text-skillio-600 scale-110 shadow-2xl shadow-skillio-200" : "bg-slate-50 text-slate-200")}><Trophy size={60} /></div>
                <div className="space-y-4 max-w-lg">
                   <h3 className="text-4xl font-black text-slate-900">Siap untuk Kuis?</h3>
                   <p className="text-lg text-slate-500 font-medium leading-relaxed">{allTasksDone ? "Luar biasa! Kamu telah menyelesaikan semua materi dan tugas hari ini. Waktunya mengunci progresmu." : "Ups! Sepertinya ada beberapa tugas praktik yang belum kamu selesaikan. Selesaikan dulu ya agar pemahamanmu maksimal."}</p>
                </div>
                <div className="w-full max-w-sm">
                   <button onClick={handleStartQuiz} disabled={!allTasksDone || quizLoading} className={cn("w-full py-6 rounded-3xl font-black text-xl transition-all flex items-center justify-center gap-4 cursor-pointer", allTasksDone ? "bg-skillio-600 text-white hover:scale-105 shadow-2xl shadow-skillio-900/20" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
                     {quizLoading ? <Loader2 className="animate-spin" /> : <><PlayCircle size={28} /> Mulai Kuis Sekarang</>}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-6 flex justify-center z-50">
           <div className="max-w-7xl w-full flex items-center justify-between">
              <button onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all cursor-pointer", currentSlide === 0 ? "opacity-0 pointer-events-none" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50")}><ChevronLeft size={20} /> Sebelumnya</button>
              <div className="hidden md:flex items-center gap-2"><span className="text-xs font-black text-slate-300">MODUL PROGRESS</span><div className="w-40 h-1.5 bg-slate-50 rounded-full overflow-hidden"><motion.div className="h-full bg-skillio-600" initial={{ width: 0 }} animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }} /></div></div>
              <button onClick={() => currentSlide < totalSlides - 1 && setCurrentSlide(prev => prev + 1)} className={cn("flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-sm transition-all shadow-xl cursor-pointer", currentSlide === totalSlides - 1 ? "opacity-0 pointer-events-none" : "bg-slate-900 text-white hover:bg-skillio-600")}>Lanjutkan <ChevronRight size={20} /></button>
           </div>
        </div>
      </div>
    );
  };

  const completedDaysCount = progress.filter(p => p.quiz_passed).length;
  const currentDayData = days.find(d => d.day_number === currentDay);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {viewMode === 'roadmap' ? (
          <motion.div key="roadmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 relative py-10">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 border-l-[3px] border-dashed border-slate-200 md:-translate-x-1/2 z-0" />
              <div className="space-y-6 md:space-y-12">
                {days.map((day, idx) => {
                   const lockStatus = checkLockout(day.day_number);
                   const isLocked = lockStatus.isLocked;
                   const isCompleted = getDayProgress(day.day_number).quiz_passed;
                   const isCurrent = day.day_number === currentDay;
                   const isMilestone = day.day_number % 10 === 0;
                   const isEven = idx % 2 === 0;
                   return (
                     <div key={day.id} className="relative w-full flex items-center">
                        <div className={cn("w-full flex md:w-1/2 pl-16 md:pl-0", isEven ? "md:justify-end md:pr-12" : "md:absolute md:right-0 md:justify-start md:pl-12")}>
                           <button 
                             onClick={() => {
                               if (!isLocked) {
                                 setSelectedDay(day); 
                                 setViewMode('theory');
                                 window.scrollTo(0,0);
                               }
                             }} 
                             disabled={isLocked} 
                             className={cn(
                               "group relative w-full max-w-sm p-5 md:p-6 rounded-3xl border-2 transition-all text-left overflow-hidden", 
                               isLocked 
                                 ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed" 
                                 : isCompleted 
                                   ? "bg-emerald-50 border-emerald-100 hover:border-emerald-300 cursor-pointer" 
                                   : "bg-white border-skillio-100 hover:border-skillio-300 hover:shadow-xl hover:shadow-skillio-100 cursor-pointer"
                             )}
                           >
                             {isCurrent && !isLocked && <div className="absolute inset-0 bg-gradient-to-br from-skillio-50 to-transparent pointer-events-none" />}
                             <div className="relative z-10 flex items-start gap-4">
                                <div className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-xl transition-transform", 
                                  isCompleted ? "bg-emerald-500 text-white" : 
                                  isLocked ? "bg-slate-200 text-slate-400" : 
                                  "bg-skillio-100 text-skillio-600 group-hover:scale-110 group-hover:bg-skillio-500 group-hover:text-white"
                                )}>
                                  {isCompleted ? <CheckCircle2 size={24} /> : isLocked ? <Lock size={20} /> : isMilestone ? <Star size={24} /> : day.day_number}
                                </div>
                                <div>
                                   <p className={cn(
                                     "text-[10px] font-black uppercase tracking-widest mb-1", 
                                     isCompleted ? "text-emerald-500" : 
                                     isLocked ? "text-slate-400" : "text-skillio-500"
                                   )}>
                                      {isCompleted ? "Selesai" : isLocked ? "Terkunci" : "Terbuka"}
                                   </p>
                                   <h4 className={cn(
                                     "text-base md:text-lg font-black leading-tight", 
                                     isLocked ? "text-slate-300" : "text-slate-900"
                                   )}>
                                     {day.title}
                                   </h4>
                                </div>
                             </div>
                           </button>
                        </div>
                        <div className={cn("absolute left-8 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-white z-10 transition-colors", isCompleted ? "bg-emerald-500" : isCurrent ? "bg-skillio-500 ring-4 ring-skillio-100" : "bg-slate-200")} />
                     </div>
                   )
                })}
              </div>
            </div>
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
               <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl shadow-slate-900/20">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                           <Flame className={cn("transition-colors", (userRoadmap.user?.streak?.current_streak || 0) > 0 ? "text-orange-400 fill-orange-400" : "text-slate-500")} size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day Streak</p>
                           <p className="text-xl font-black">{userRoadmap.user?.streak?.current_streak || 0}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">XP Points</p>
                        <p className="text-xl font-black text-skillio-400">{userRoadmap.user?.xp || 0}</p>
                     </div>
                  </div>
                  <div className="space-y-2"><div className="flex items-center justify-between text-xs font-bold text-slate-300"><span>Progres Belajar</span><span>{Math.round((completedDaysCount / 30) * 100)}%</span></div><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-skillio-500 to-teal-400 rounded-full" style={{ width: `${(completedDaysCount / 30) * 100}%` }} /></div></div>
               </div>
               <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50">
                  <div className="flex items-center gap-2 mb-6">
                     <Target size={18} className="text-skillio-500" />
                     <h3 className="font-black text-slate-900">Misi Hari Ini</h3>
                  </div>
                  {currentDayData ? (
                     <div className="space-y-4">
                        <div className="p-4 bg-skillio-50 rounded-2xl border border-skillio-100">
                           <p className="text-[10px] font-black text-skillio-600 uppercase tracking-widest mb-1">Hari {currentDayData.day_number}</p>
                           <p className="font-bold text-slate-800 leading-snug">{currentDayData.title}</p>
                        </div>
                        
                        {(() => {
                           const lock = checkLockout(currentDayData.day_number);
                           const isLocked = lock.isLocked;
                           
                           return (
                              <button 
                                 onClick={() => { 
                                    if (!isLocked) {
                                       setSelectedDay(currentDayData); 
                                       setViewMode('theory'); 
                                       window.scrollTo(0,0); 
                                    }
                                 }} 
                                 disabled={isLocked}
                                 className={cn(
                                    "w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer",
                                    isLocked 
                                       ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60" 
                                       : "bg-slate-900 text-white hover:bg-skillio-600 shadow-lg shadow-slate-900/10"
                                 )}
                              >
                                 {isLocked ? (
                                    <><Lock size={14} /> Terkunci</>
                                 ) : (
                                    <>Buka Materi <ArrowRight size={16} /></>
                                 )}
                              </button>
                           );
                        })()}
                     </div>
                  ) : (
                     <p className="text-sm font-medium text-slate-500">Roadmap telah selesai!</p>
                  )}
                  {timeLeft && (
                     <div className="mt-4 p-4 border border-orange-100 bg-orange-50 rounded-2xl flex items-center justify-between">
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                           <Lock size={12}/> Tersedia Dalam
                        </span>
                        <span className="font-black text-slate-900 tabular-nums">{timeLeft}</span>
                     </div>
                  )}
               </div>
               <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50">
                  <div className="flex items-center gap-2 mb-6"><Award size={18} className="text-emerald-500" /><h3 className="font-black text-slate-900">Pencapaian</h3></div>
                  <div className="grid grid-cols-3 gap-3">
                     {[
                       { id: 1, active: completedDaysCount >= 1, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
                       { id: 2, active: completedDaysCount >= 10, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
                       { id: 3, active: completedDaysCount >= 30, icon: Trophy, color: "text-orange-500", bg: "bg-orange-50" },
                     ].map(badge => (
                       <div key={badge.id} className={cn("aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all", badge.active ? `${badge.bg} border-transparent` : "bg-slate-50 border-slate-100 grayscale opacity-40")}>
                          <badge.icon size={24} className={cn("mb-1", badge.active ? badge.color : "text-slate-400")} />
                          <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{badge.id * 10} Days</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>
        ) : viewMode === 'theory' ? (
          <div key="theory_view">{renderDayDetail()}</div>
        ) : (
          <div key="quiz_view">{renderQuizView()}</div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoadmapTimeline;

// Add this to your global CSS or keep it here if your framework allows
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = scrollbarStyles;
  document.head.appendChild(style);
}
