"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  Loader2,
  Sparkles,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export default function DailyQuizPage() {
  const { dayId } = useParams();
  const router = useRouter();
  const { setIsImmersiveMode } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsImmersiveMode(true);
    return () => setIsImmersiveMode(false);
  }, [setIsImmersiveMode]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`/api/quiz/day/${dayId}`);
        const data = await res.json();
        if (res.ok) {
          const quizArray = Array.isArray(data) ? data : [data];
          setQuizzes(quizArray);
        }
      } catch (err) {
        console.error("Gagal memuat kuis");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [dayId]);

  const currentQuiz = quizzes[currentIndex];
  const progressPercent = ((currentIndex + 1) / quizzes.length) * 100;

  const handleSubmit = () => {
    if (!selectedAnswer || isSubmitted) return;
    const correct = selectedAnswer === currentQuiz.correct_option;
    if (correct) setScore(prev => prev + 1);
    setIsSubmitted(true);
  };

  const handleNext = async () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      const finalScore = Math.round((score / quizzes.length) * 100);
      setSaving(true);
      try {
        await fetch("/api/quiz/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day_id: dayId, score: finalScore })
        });
      } catch (err) {
        console.error("Gagal simpan progres");
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-skillio-100 rounded-full" />
           <div className="absolute top-0 left-0 w-16 h-16 border-4 border-skillio-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Menyiapkan kuis...</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center gap-8 text-center px-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center">
           <XCircle size={48} />
        </div>
        <div>
           <h2 className="text-3xl font-black text-slate-900 mb-2">Kuis Belum Tersedia</h2>
           <p className="text-slate-500 font-medium">Sistem sedang menyiapkan pertanyaan kuis untuk hari ini.</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl cursor-pointer"
        >
          Kembali ke Roadmap
        </button>
      </div>
    );
  }

  if (quizFinished) {
    const finalScore = Math.round((score / quizzes.length) * 100);
    const isPassed = finalScore >= 60;

    return (
      <div className="w-full flex flex-col min-h-[85vh] relative pt-12 items-center justify-center">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-skillio-50/40 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-teal-50/30 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-white rounded-[40px] border border-slate-100 p-10 md:p-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] text-center relative overflow-hidden"
        >
           {}
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-skillio-500 to-teal-400" />

           <div className="flex justify-center mb-8">
              <div className={cn(
                "w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl rotate-3",
                isPassed ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-orange-500 text-white shadow-orange-200"
              )}>
                 {isPassed ? <Trophy size={48} /> : <Award size={48} />}
              </div>
           </div>

           <h2 className="text-4xl font-black text-slate-900 mb-3">Misi Selesai!</h2>
           <p className="text-slate-500 font-bold mb-10">Skor Anda: {finalScore}/100</p>

           <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">XP Didapatkan</p>
              <h3 className="text-5xl font-black text-skillio-600">+50 XP</h3>
           </div>

           <p className="text-slate-600 font-medium mb-10 leading-relaxed">
             {isPassed
               ? "Luar biasa! Pemahaman Anda sangat baik. Progress hari ini telah tersimpan secara permanen."
               : "Hampir saja! Anda tetap mendapatkan progres hari ini, namun jangan lupa tinjau kembali materi kuisnya ya."}
           </p>

           <button
             onClick={() => router.push("/roadmap")}
             className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-slate-900/20 hover:bg-skillio-600 transition-all cursor-pointer"
           >
             Kembali ke Roadmap
           </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-[85vh] relative pt-2">
      {}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-skillio-50/40 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-teal-50/30 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {}
      <div className="fixed top-0 left-0 w-full z-[60] bg-white px-6 py-4 border-b border-slate-100 flex justify-center">
         <div className="max-w-7xl w-full flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="p-2 text-slate-300 hover:text-slate-900 transition-colors cursor-pointer"
            >
               <X size={24} />
            </button>
            <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
               <motion.div
                 className="h-full bg-gradient-to-r from-skillio-500 to-teal-400"
                 initial={{ width: 0 }}
                 animate={{ width: `${progressPercent}%` }}
                 transition={{ duration: 0.5 }}
               />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
               Soal {currentIndex + 1} / {quizzes.length}
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-skillio-50 text-skillio-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  <Target size={14} /> Kuis Pemahaman
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {currentQuiz.question_text}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQuiz.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isAnswerCorrect = isSubmitted && option === currentQuiz.correct_option;
                const isAnswerWrong = isSubmitted && isSelected && selectedAnswer !== currentQuiz.correct_option;

                return (
                  <button
                    key={index}
                    disabled={isSubmitted}
                    onClick={() => setSelectedAnswer(option)}
                    className={cn(
                      "flex items-center justify-between p-6 md:p-8 rounded-[32px] border-2 transition-all text-left group cursor-pointer",
                      isSelected && !isSubmitted && "border-skillio-500 bg-skillio-50/50 shadow-lg shadow-skillio-100",
                      isAnswerCorrect && "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100",
                      isAnswerWrong && "border-red-500 bg-red-50 shadow-lg shadow-red-100",
                      !isSelected && !isSubmitted && "border-slate-100 bg-white hover:border-skillio-300 shadow-sm"
                    )}
                  >
                    <span className={cn(
                      "font-black text-lg md:text-xl",
                      isSelected && !isSubmitted ? "text-skillio-600" : "text-slate-800",
                      isAnswerCorrect && "text-emerald-700",
                      isAnswerWrong && "text-red-700"
                    )}>
                      {option}
                    </span>
                    <div className={cn(
                      "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all",
                      isAnswerCorrect ? "bg-emerald-500 border-emerald-500 text-white" :
                      isAnswerWrong ? "bg-red-500 border-red-500 text-white" :
                      isSelected ? "bg-skillio-500 border-skillio-500 text-white" : "border-slate-200"
                    )}>
                       {isAnswerCorrect ? <CheckCircle2 size={18} /> :
                        isAnswerWrong ? <XCircle size={18} /> :
                        isSelected ? <div className="w-2 h-2 bg-white rounded-full" /> : null}
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
                  className={cn(
                    "p-8 rounded-[32px] border-l-8",
                    selectedAnswer === currentQuiz.correct_option ? "bg-emerald-50/50 border-emerald-500" : "bg-red-50/50 border-red-500"
                  )}
                >
                   <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-3">Penjelasan Mentor AI:</p>
                   <p className="text-slate-700 font-medium leading-relaxed text-lg italic">
                     "{currentQuiz.explanation}"
                   </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-6 flex justify-center z-50">
         <div className="max-w-7xl w-full flex items-center justify-end">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className={cn(
                  "px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center gap-3 cursor-pointer",
                  selectedAnswer
                    ? "bg-slate-900 text-white hover:bg-skillio-600"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                Konfirmasi Jawaban <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-12 py-5 rounded-2xl bg-skillio-600 text-white font-black text-lg transition-all shadow-xl flex items-center gap-3 cursor-pointer hover:bg-skillio-700"
              >
                {currentIndex < quizzes.length - 1 ? "Lanjutkan" : "Lihat Hasil"} <ChevronRight size={20} />
              </button>
            )}
         </div>
      </div>
    </div>
  );
}
