"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PHASE_1_QUESTIONS } from "@/constants/quiz";
import { 
  Sparkles, ArrowRight, ArrowLeft, BrainCircuit, 
  CheckCircle2, RotateCcw, Target, ShieldCheck,
  Zap, Compass, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

const LS_KEY = "skillio_quiz_progress";

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

  // Save to LocalStorage whenever critical state changes
  useEffect(() => {
    if (answers.length > 0) {
      const stateToSave = {
        current_phase: phase,
        current_index: currentQuestion,
        answers: answers,
        ai_questions: aiQuestions,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(LS_KEY, JSON.stringify(stateToSave));
    }
  }, [answers, phase, currentQuestion, aiQuestions]);

  useEffect(() => {
    const existingAnswer = answers.find(a => a.phase === phase && a.index === currentQuestion);
    setSelectedOption(existingAnswer ? existingAnswer.answer : null);
  }, [currentQuestion, phase, answers]);

  const loadProgress = async () => {
    try {
      // 1. Try Loading from Server
      let serverData = null;
      try {
        const response = await fetch("/api/quiz/progress");
        if (response.ok) serverData = await response.json();
      } catch (e) {
        console.error("Server progress load failed, falling back to local storage");
      }

      // 2. Check Local Storage
      const localDataRaw = localStorage.getItem(LS_KEY);
      const localData = localDataRaw ? JSON.parse(localDataRaw) : null;

      // 3. Compare and pick the most advanced progress
      let finalData = serverData;
      
      if (localData && (!serverData || localData.answers.length > serverData.answers.length)) {
        finalData = localData;
      }

      if (finalData && finalData.answers && finalData.answers.length > 0) {
        setSavedProgress(finalData);
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
    if (savedProgress.ai_questions) setAiQuestions(savedProgress.ai_questions);
    setShowResumeModal(false);
  };

  const handleReset = async () => {
    await fetch("/api/quiz/progress", { method: "DELETE" });
    localStorage.removeItem(LS_KEY);
    setShowResumeModal(false);
    setPhase(1);
    setCurrentQuestion(0);
    setAnswers([]);
    setAiQuestions([]);
  };

  const handleNext = async () => {
    if (!selectedOption) return;
    const newAnswers = [...answers];
    const existingIdx = newAnswers.findIndex(a => a.phase === phase && a.index === currentQuestion);
    const answerObj = { 
      phase, index: currentQuestion,
      question: questions[currentQuestion].question || questions[currentQuestion].question_text, 
      answer: selectedOption 
    };
    if (existingIdx !== -1) newAnswers[existingIdx] = answerObj;
    else newAnswers.push(answerObj);
    setAnswers(newAnswers);

    const isLastInPhase = currentQuestion === questions.length - 1;
    const nextPhase = isLastInPhase ? phase + 1 : phase;
    const nextIndex = isLastInPhase ? 0 : currentQuestion + 1;

    // Save to server (async, don't block)
    fetch("/api/quiz/progress", {
      method: "POST",
      body: JSON.stringify({
        current_phase: nextPhase,
        current_index: nextIndex,
        answers: newAnswers,
        ai_questions: aiQuestions.length > 0 ? aiQuestions : null
      }),
    }).catch(e => console.warn("Background server save failed"));

    if (!isLastInPhase) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (phase < 3) generateNextPhase(newAnswers);
      else {
        setQuizAnswers(newAnswers);
        setIsFinished(true);
        fetch("/api/quiz/progress", { method: "DELETE" });
        localStorage.removeItem(LS_KEY);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const generateNextPhase = async (currentAnswers) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        body: JSON.stringify({ phase: phase + 1, answers: currentAnswers }),
      });
      const data = await response.json();
      if (data.questions) {
        setAiQuestions(data.questions);
        setPhase(phase + 1);
        setCurrentQuestion(0);
      }
    } catch (e) {} finally {
      setIsGenerating(false);
    }
  };

  if (isLoadingProgress) return null;
  const currentQuestionData = questions[currentQuestion];

  // ═══ STATES ═══
  if (showResumeModal) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 md:p-12 rounded-[32px] max-w-md w-full shadow-2xl text-center">
          <RotateCcw size={40} className="mx-auto mb-5 text-skillio-500" />
          <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Lanjutkan Kuis?</h2>
          <p className="text-sm text-slate-500 font-medium mb-8">Kami menemukan progres terakhir Anda di Fase {savedProgress.current_phase}. Ingin lanjut atau mulai ulang?</p>
          <div className="flex flex-col gap-3">
            <button onClick={handleResume} className="w-full bg-skillio-600 text-white py-4 rounded-xl font-black shadow-lg shadow-skillio-600/10 transition-all active:scale-[0.98]">Lanjutkan</button>
            <button onClick={handleReset} className="w-full py-2 text-slate-400 font-bold hover:text-red-500 transition-colors text-xs">Mulai dari Awal</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isGenerating || isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-skillio-50 rounded-full blur-[100px] -z-10" />
        <div className="max-w-md relative z-10">
          <div className="relative flex items-center justify-center mb-8">
             {isFinished ? (
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200 animate-in zoom-in duration-500">
                   <CheckCircle2 size={40} />
                </div>
             ) : (
                <div className="w-16 h-16 rounded-full border-[3px] border-slate-100 border-t-skillio-600 animate-spin" />
             )}
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-3">{isFinished ? "Analisis Selesai!" : "AI Menganalisis..."}</h2>
          <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">{isFinished ? "Profil profesional Anda telah siap dihitung. Lihat hasilnya sekarang." : "Mentor AI sedang memproses jawaban Anda untuk tahap berikutnya."}</p>
          
          {isFinished && (
            <button onClick={() => router.push("/quiz/result")} className="w-full bg-skillio-600 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-xl shadow-skillio-600/10 active:scale-[0.98] transition-all">
              Buka Rekomendasi <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-skillio-50/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full px-6 py-10 md:py-14">
        <div className="max-w-3xl mx-auto space-y-10 md:space-y-14">
          
          {/* Header - Compact */}
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                    Phase {phase} / 3
                  </span>
                  <span className="px-2.5 py-1 bg-skillio-50 text-skillio-600 border border-skillio-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {Math.round(progress)}% Progress
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  {phase === 1 ? "Discovery Awal" : phase === 2 ? "Fokus Kompetensi" : "Pendalaman Bidang"}
                </h1>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                 <Zap className="text-orange-500" size={16} />
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Questions</p>
                    <p className="text-sm font-black text-slate-900">{currentQuestion + 1} <span className="text-slate-300">/</span> {questions.length}</p>
                 </div>
              </div>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-skillio-500 to-teal-400 rounded-full"
              />
            </div>
          </div>

          {/* Question Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${phase}-${currentQuestion}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="max-w-2xl">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-2">
                  {currentQuestionData?.question || currentQuestionData?.question_text || "..."}
                </h2>
                <p className="text-sm md:text-base text-slate-400 font-medium">
                  Berikan jawaban yang paling mencerminkan diri Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(currentQuestionData?.options || []).map((option, idx) => {
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(option)}
                      className={cn(
                        "group relative flex flex-col items-start p-5 md:p-6 rounded-2xl border transition-all duration-300 text-left cursor-pointer",
                        isSelected 
                          ? "border-skillio-500 bg-skillio-50/20 shadow-lg scale-[1.01] z-10" 
                          : "border-slate-100 bg-white/50 hover:border-slate-200 hover:bg-white"
                      )}
                    >
                      <span className={cn(
                        "text-base font-bold leading-snug pr-8 transition-colors",
                        isSelected ? "text-skillio-700" : "text-slate-600 group-hover:text-slate-900"
                      )}>
                        {option}
                      </span>
                      {isSelected && (
                         <div className="absolute top-5 right-5">
                            <div className="w-6 h-6 bg-skillio-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-skillio-100">
                               <CheckCircle2 size={12} />
                            </div>
                         </div>
                      )}
                      <div className={cn(
                        "mt-3 h-0.5 rounded-full transition-all duration-500",
                        isSelected ? "bg-skillio-500 w-12" : "bg-slate-100 w-6 group-hover:w-10"
                      )} />
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-50">
                <button
                   onClick={handlePrevious}
                   disabled={currentQuestion === 0}
                   className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-slate-300 hover:text-slate-900 disabled:opacity-0 transition-all group text-sm"
                 >
                   <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                   Sebelumnya
                 </button>
                 
                 <button
                   onClick={handleNext}
                   disabled={!selectedOption}
                   className={cn(
                     "w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-black text-base transition-all",
                     selectedOption 
                       ? "bg-skillio-600 text-white shadow-xl shadow-skillio-600/10 hover:bg-skillio-700 active:scale-[0.98]" 
                       : "bg-slate-100 text-slate-300 cursor-not-allowed"
                   )}
                 >
                   {currentQuestion === questions.length - 1 
                     ? (phase === 3 ? "Selesai" : "Berikutnya") 
                     : "Lanjut"}
                   <ArrowRight size={18} className={cn("transition-transform", selectedOption ? "group-hover:translate-x-1" : "")} />
                 </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
