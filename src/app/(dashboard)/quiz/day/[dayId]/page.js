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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DailyQuizPage() {
  const { dayId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [saving, setSaving] = useState(false);

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
      // Finish Quiz
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-blue animate-spin" />
        <p className="font-bold text-dark-blue/40">Menyiapkan kuis Anda...</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <XCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-black text-dark-blue">Kuis Tidak Ditemukan</h2>
        <button onClick={() => router.back()} className="px-8 py-3 bg-primary-blue text-white rounded-2xl font-bold">Kembali</button>
      </div>
    );
  }

  if (quizFinished) {
    const finalScore = Math.round((score / quizzes.length) * 100);
    const isPassed = finalScore >= 60;

    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white rounded-[40px] border-2 border-light-blue p-12 shadow-2xl"
         >
            <div className="flex justify-center mb-6">
               <div className={cn(
                 "w-24 h-24 rounded-full flex items-center justify-center shadow-lg",
                 isPassed ? "bg-green-500 shadow-green-200" : "bg-orange-500 shadow-orange-200"
               )}>
                  {isPassed ? <Trophy size={48} className="text-white" /> : <Award size={48} className="text-white" />}
               </div>
            </div>
            <h2 className="text-4xl font-black text-dark-blue mb-2">Kuis Selesai!</h2>
            <p className="text-dark-blue/60 font-bold text-lg mb-8">Anda menjawab {score} dari {quizzes.length} soal dengan benar.</p>
            
            <div className="bg-slate-50 rounded-3xl p-8 mb-10">
               <p className="text-sm font-black text-dark-blue/40 uppercase tracking-widest mb-1">Skor Akhir</p>
               <h3 className={cn("text-6xl font-black", isPassed ? "text-green-500" : "text-orange-500")}>{finalScore}</h3>
            </div>

            <p className="text-dark-blue/80 font-medium mb-10 leading-relaxed">
              {isPassed 
                ? "Luar biasa! Pemahaman Anda sangat baik. Anda mendapatkan +50 XP dan lencana hari ini telah ditambahkan ke portofolio Anda."
                : "Hampir saja! Anda tetap mendapatkan progres hari ini, namun jangan lupa untuk meninjau kembali materi yang salah ya."}
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-primary-blue text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-primary-blue/20 hover:scale-[0.98] transition-all"
            >
              Lanjutkan ke Dashboard
            </button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-10 flex items-center justify-between">
         <div>
            <span className="inline-flex items-center gap-2 bg-primary-blue/10 text-primary-blue px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2">
              <Award size={14} /> Pertanyaan {currentIndex + 1} / {quizzes.length}
            </span>
            <h1 className="text-2xl font-black text-dark-blue">Uji Pemahaman</h1>
         </div>
         <div className="hidden md:flex gap-1">
            {quizzes.map((_, i) => (
              <div key={i} className={cn("h-2 w-8 rounded-full transition-all", i <= currentIndex ? "bg-primary-blue" : "bg-slate-200")} />
            ))}
         </div>
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-[40px] border-2 border-light-blue p-8 md:p-12 shadow-xl shadow-primary-blue/5"
      >
        <div className="flex items-start gap-4 mb-10">
          <div className="w-12 h-12 bg-primary-blue rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-blue/20">
             <HelpCircle className="text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-dark-blue leading-relaxed">
            {currentQuiz.question_text}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-10">
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
                  "flex items-center justify-between p-6 rounded-3xl border-2 transition-all text-left group",
                  isSelected && !isSubmitted && "border-primary-blue bg-primary-blue/5 scale-[1.02]",
                  isAnswerCorrect && "border-green-500 bg-green-50",
                  isAnswerWrong && "border-red-500 bg-red-50",
                  !isSelected && !isSubmitted && "border-transparent bg-slate-50 hover:bg-white hover:border-primary-blue/40"
                )}
              >
                <span className={cn(
                  "font-bold text-lg",
                  isSelected && !isSubmitted ? "text-primary-blue" : "text-dark-blue",
                  isAnswerCorrect && "text-green-700",
                  isAnswerWrong && "text-red-700"
                )}>
                  {option}
                </span>
                {isAnswerCorrect && <CheckCircle2 className="text-green-500" />}
                {isAnswerWrong && <XCircle className="text-red-500" />}
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
                "p-6 rounded-3xl mb-8 border-l-4",
                selectedAnswer === currentQuiz.correct_option ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
              )}
            >
               <p className="font-black text-sm uppercase tracking-widest mb-2">Penjelasan:</p>
               <p className="text-dark-blue font-medium leading-relaxed">{currentQuiz.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className={cn(
              "w-full py-5 rounded-[24px] font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3",
              selectedAnswer 
                ? "bg-primary-blue text-white shadow-primary-blue/20 hover:scale-[0.98]" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            Konfirmasi Jawaban
            <ArrowRight />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-5 rounded-[24px] bg-dark-blue text-white font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3 hover:scale-[0.98]"
          >
            {currentIndex < quizzes.length - 1 ? "Pertanyaan Selanjutnya" : "Lihat Hasil Akhir"}
            <ChevronRight />
          </button>
        )}
      </motion.div>
    </div>
  );
}
