"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PHASE_1_QUESTIONS } from "@/constants/quiz";
import { Sparkles, ArrowRight, ArrowLeft, BrainCircuit, Loader2, CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

const QuizPage = () => {
  const router = useRouter();
  const { setQuizAnswers } = useAppStore();
  const [phase, setPhase] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);

  const questions = phase === 1 ? PHASE_1_QUESTIONS : aiQuestions;
  const progress = ((currentQuestion + (phase - 1) * 10) / 30) * 100;

  useEffect(() => {
    loadProgress();
  }, []);

  // Update selected option when question changes
  useEffect(() => {
    const existingAnswer = answers.find(a => a.phase === phase && a.index === currentQuestion);
    setSelectedOption(existingAnswer ? existingAnswer.answer : null);
  }, [currentQuestion, phase, answers]);

  const loadProgress = async () => {
    try {
      const response = await fetch("/api/quiz/progress");
      const data = await response.json();
      if (data && data.answers && data.answers.length > 0) {
        setSavedProgress(data);
        setShowResumeModal(true);
      }
    } catch (error) {
      console.error("Gagal memuat progres:", error);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  const handleResume = () => {
    setPhase(savedProgress.current_phase);
    setCurrentQuestion(savedProgress.current_index);
    setAnswers(savedProgress.answers);
    if (savedProgress.ai_questions) {
      setAiQuestions(savedProgress.ai_questions);
    }
    setShowResumeModal(false);
  };

  const handleReset = async () => {
    await fetch("/api/quiz/progress", { method: "DELETE" });
    setShowResumeModal(false);
    setPhase(1);
    setCurrentQuestion(0);
    setAnswers([]);
    setAiQuestions([]);
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    // Update or add answer
    const newAnswers = [...answers];
    const existingIdx = newAnswers.findIndex(a => a.phase === phase && a.index === currentQuestion);
    
    const answerObj = { 
      phase, 
      index: currentQuestion,
      question: questions[currentQuestion].question || questions[currentQuestion].question_text, 
      answer: selectedOption 
    };

    if (existingIdx !== -1) {
      newAnswers[existingIdx] = answerObj;
    } else {
      newAnswers.push(answerObj);
    }
    
    setAnswers(newAnswers);

    // Save progress to DB
    try {
      await fetch("/api/quiz/progress", {
        method: "POST",
        body: JSON.stringify({
          current_phase: currentQuestion < questions.length - 1 ? phase : phase + 1,
          current_index: currentQuestion < questions.length - 1 ? currentQuestion + 1 : 0,
          answers: newAnswers,
          ai_questions: aiQuestions.length > 0 ? aiQuestions : null
        }),
      });
    } catch (error) {
      console.error("Gagal simpan progres:", error);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (phase < 3) {
        generateNextPhase(newAnswers);
      } else {
        setQuizAnswers(newAnswers);
        setIsFinished(true);
        fetch("/api/quiz/progress", { method: "DELETE" });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (phase > 1) {
       // Logic to go back to previous phase could be complex if AI questions are regenerated
       // For now, we only allow previous within the same phase to keep it stable
       alert("Anda tidak dapat kembali ke fase sebelumnya demi akurasi analisis AI.");
    }
  };

  const generateNextPhase = async (currentAnswers) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        body: JSON.stringify({ phase: phase + 1, answers: currentAnswers }),
      });
      
      if (!response.ok) throw new Error("Gagal mengambil soal dari AI");
      
      const data = await response.json();
      
      if (data.questions && Array.isArray(data.questions)) {
        setAiQuestions(data.questions);
        setPhase(phase + 1);
        setCurrentQuestion(0);

        await fetch("/api/quiz/progress", {
          method: "POST",
          body: JSON.stringify({
            current_phase: phase + 1,
            current_index: 0,
            answers: currentAnswers,
            ai_questions: data.questions
          }),
        });
      } else {
        throw new Error("Format data AI tidak valid");
      }
    } catch (error) {
      console.error("Gagal generate soal:", error);
      alert("Maaf, terjadi gangguan koneksi dengan AI. Mohon coba beberapa saat lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoadingProgress) return null;

  // Safeguard for questions array
  const currentQuestionData = questions[currentQuestion];

  if (showResumeModal) {
    return (
      <div className="fixed inset-0 bg-dark-blue/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-[40px] max-w-md w-full shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-primary-blue/10 rounded-[28px] flex items-center justify-center text-primary-blue mx-auto mb-6">
            <RotateCcw size={40} />
          </div>
          <h2 className="text-2xl font-black text-dark-blue mb-4">Lanjutkan Kuis?</h2>
          <p className="text-dark-blue/60 font-medium mb-10 leading-relaxed">
            Kami menemukan kuis terakhir Anda yang belum selesai di Fase {savedProgress.current_phase}. Ingin melanjutkan?
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleResume}
              className="w-full bg-primary-blue text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-blue/20 hover:bg-accent-blue transition-all"
            >
              Lanjutkan Sekarang
            </button>
            <button 
              onClick={handleReset}
              className="w-full py-4 text-dark-blue/40 font-bold hover:text-red-500 transition-colors"
            >
              Mulai dari Awal
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-light-blue/20 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-primary-blue p-6 rounded-[32px] text-white mb-8 shadow-2xl shadow-primary-blue/30"
        >
          <BrainCircuit size={64} />
        </motion.div>
        <h2 className="text-3xl font-black text-dark-blue mb-4">AI Sedang Menganalisis...</h2>
        <p className="text-dark-blue/60 font-medium max-w-md mx-auto leading-relaxed">
          Menganalisis jawaban Anda untuk menyiapkan pertanyaan yang lebih spesifik dan personal.
        </p>
        <div className="mt-8 flex gap-2">
          <div className="w-3 h-3 bg-primary-blue rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-3 h-3 bg-primary-blue rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-3 h-3 bg-primary-blue rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    );
  }

  if (isFinished) {
     return (
       <div className="min-h-screen bg-light-blue/20 flex flex-col items-center justify-center p-6 text-center">
         <div className="bg-green-500 p-6 rounded-[32px] text-white mb-8 shadow-2xl shadow-green-500/30">
           <CheckCircle2 size={64} />
         </div>
         <h2 className="text-4xl font-black text-dark-blue mb-4">Analisis Selesai!</h2>
         <p className="text-dark-blue/60 font-medium max-w-md mx-auto leading-relaxed mb-10">
           Kami telah merumuskan jalur karier yang paling sesuai untuk Anda. Silakan lihat hasilnya sekarang.
         </p>
         <button 
           onClick={() => router.push("/quiz/result")}
           className="bg-primary-blue text-white px-10 py-5 rounded-[24px] font-black text-xl flex items-center gap-3 hover:scale-105 transition-transform"
         >
           Lihat Rekomendasi <ArrowRight />
         </button>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-light-blue/20 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-primary-blue font-black uppercase tracking-widest text-sm mb-1">Fase {phase} dari 3</p>
              <h1 className="text-2xl font-black text-dark-blue">
                {phase === 1 ? "Discovery Awal" : phase === 2 ? "Fokus Kompetensi" : "Pendalaman Bidang"}
              </h1>
            </div>
            <p className="text-dark-blue/40 font-bold">{Math.round(progress)}% Selesai</p>
          </div>
          <div className="h-3 w-full bg-white rounded-full overflow-hidden shadow-inner border border-light-blue">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-primary-blue to-accent-blue rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${phase}-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-primary-blue/5 border border-light-blue"
          >
            <div className="mb-8">
               <span className="inline-block bg-light-blue text-primary-blue px-4 py-1 rounded-full text-xs font-black mb-4">
                 SOAL #{currentQuestion + 1}
               </span>
               <h2 className="text-2xl md:text-3xl font-black text-dark-blue leading-tight">
                 {currentQuestionData 
                   ? (currentQuestionData.question || currentQuestionData.question_text)
                   : "Memuat pertanyaan..."}
               </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-10">
              {(currentQuestionData?.options || []).map((option, idx) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(option)}
                    className={cn(
                      "group flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left",
                      isSelected 
                        ? "border-primary-blue bg-light-blue/20 shadow-md" 
                        : "border-light-blue hover:border-primary-blue hover:bg-light-blue/10"
                    )}
                  >
                    <span className={cn(
                      "font-bold transition-colors",
                      isSelected ? "text-primary-blue" : "text-dark-blue group-hover:text-primary-blue"
                    )}>
                      {option}
                    </span>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected ? "border-primary-blue bg-primary-blue" : "border-light-blue group-hover:border-primary-blue"
                    )}>
                      <div className={cn(
                        "w-2 h-2 bg-white rounded-full transition-transform",
                        isSelected ? "scale-100" : "scale-0"
                      )} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-light-blue">
               <button
                 onClick={handlePrevious}
                 disabled={currentQuestion === 0}
                 className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-dark-blue/40 hover:text-primary-blue disabled:opacity-0 transition-all"
               >
                 <ArrowLeft size={20} />
                 Sebelumnya
               </button>
               
               <button
                 onClick={handleNext}
                 disabled={!selectedOption}
                 className={cn(
                   "flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all",
                   selectedOption 
                     ? "bg-primary-blue text-white shadow-xl shadow-primary-blue/20 hover:bg-accent-blue" 
                     : "bg-light-blue text-primary-blue/30 cursor-not-allowed"
                 )}
               >
                 {currentQuestion === questions.length - 1 ? (phase === 3 ? "Selesai" : "Fase Berikutnya") : "Selanjutnya"}
                 <ArrowRight size={20} />
               </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 text-center text-dark-blue/30 text-sm font-bold flex items-center justify-center gap-2">
          <Sparkles size={14} /> Jawaban Anda bersifat rahasia dan hanya digunakan untuk analisis AI secara profesional
        </p>
      </div>
    </div>
  );
};

export default QuizPage;
