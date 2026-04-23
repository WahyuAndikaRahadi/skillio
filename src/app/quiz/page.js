"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PHASE_1_QUESTIONS } from "@/constants/quiz";
import { Sparkles, ArrowRight, BrainCircuit, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const QuizPage = () => {
  const router = useRouter();
  const [phase, setPhase] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [aiQuestions, setAiQuestions] = useState([]);

  const questions = phase === 1 ? PHASE_1_QUESTIONS : aiQuestions;
  const totalQuestions = phase === 1 ? PHASE_1_QUESTIONS.length : 10;
  const progress = ((currentQuestion + (phase - 1) * 10) / 30) * 100;

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, { phase, question: questions[currentQuestion].question || questions[currentQuestion].question_text, answer }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Phase transition or Finish
      if (phase < 3) {
        generateNextPhase(newAnswers);
      } else {
        setIsFinished(true);
      }
    }
  };

  const generateNextPhase = async (currentAnswers) => {
    setIsGenerating(true);
    try {
      // In real world, this would call an API route that uses Gemini
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        body: JSON.stringify({ phase: phase + 1, answers: currentAnswers }),
      });
      const data = await response.json();
      setAiQuestions(data.questions);
      setPhase(phase + 1);
      setCurrentQuestion(0);
    } catch (error) {
      console.error("Gagal generate soal:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
        <h2 className="text-3xl font-black text-dark-blue mb-4">AI Sedang Berpikir...</h2>
        <p className="text-dark-blue/60 font-medium max-w-md mx-auto leading-relaxed">
          Menganalisis jawabanmu untuk menyiapkan pertanyaan yang lebih tajam dan personal.
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
           Kami sudah menemukan jalur karier yang paling cocok buat lo. Siap liat hasilnya?
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
                {phase === 1 ? "Discovery Awal" : phase === 2 ? "Mulai Mengerucut" : "Pendalaman Bidang"}
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
                 {questions[currentQuestion]?.question || questions[currentQuestion]?.question_text}
               </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {(questions[currentQuestion]?.options || []).map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="group flex items-center justify-between p-5 rounded-2xl border-2 border-light-blue hover:border-primary-blue hover:bg-light-blue/20 transition-all text-left"
                >
                  <span className="font-bold text-dark-blue group-hover:text-primary-blue transition-colors">
                    {option}
                  </span>
                  <div className="w-6 h-6 rounded-full border-2 border-light-blue group-hover:border-primary-blue group-hover:bg-primary-blue flex items-center justify-center transition-all">
                    <div className="w-2 h-2 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 text-center text-dark-blue/30 text-sm font-bold flex items-center justify-center gap-2">
          <Sparkles size={14} /> Jawaban lo rahasia dan cuma dipake buat analisis AI
        </p>
      </div>
    </div>
  );
};

export default QuizPage;
