"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { Sparkles, Trophy, ArrowRight, BrainCircuit, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const ResultPage = () => {
  const router = useRouter();
  const { quizAnswers, setQuizResult, quizResult } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (quizAnswers.length < 30 && !quizResult) {
      router.push("/quiz");
      return;
    }

    if (!quizResult) {
      analyzeResults();
    } else {
      setIsLoading(false);
    }
  }, []);

  const analyzeResults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/quiz/analyze", {
        method: "POST",
        body: JSON.stringify({ answers: quizAnswers }),
      });
      const data = await response.json();
      setQuizResult(data);
    } catch (error) {
      console.error("Gagal analisis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCareer = async (career) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        body: JSON.stringify({ career }),
      });
      
      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert("Gagal membuat roadmap. Coba lagi ya!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-blue/20 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="text-primary-blue mb-8"
        >
          <BrainCircuit size={80} />
        </motion.div>
        <h2 className="text-3xl font-black text-dark-blue mb-4">Menganalisis Potensi Anda...</h2>
        <p className="text-dark-blue/60 font-medium max-w-md mx-auto leading-relaxed">
          Mohon tunggu sebentar, AI sedang menganalisis 30 jawaban Anda untuk merumuskan masa depan yang paling sesuai.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-blue/20 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-blue text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Trophy className="w-4 h-4" />
            <span>Analisis Selesai</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-dark-blue mb-6">Hasil <span className="text-primary-blue">Analisis Anda</span></h1>
          <p className="text-lg text-dark-blue/60 font-medium max-w-2xl mx-auto leading-relaxed">
            {quizResult?.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quizResult?.recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className={cn(
                "bg-white p-8 rounded-[40px] border-2 transition-all flex flex-col relative overflow-hidden group",
                i === 0 ? "border-primary-blue ring-4 ring-primary-blue/10 scale-105 z-10" : "border-light-blue"
              )}
            >
              {i === 0 && (
                <div className="absolute top-0 right-0 bg-primary-blue text-white px-4 py-1 text-[10px] font-black uppercase rounded-bl-2xl">
                  Best Match
                </div>
              )}
              
              <div className="mb-6">
                <div className="text-4xl font-black text-primary-blue mb-1">{rec.match}%</div>
                <div className="text-xs font-bold text-dark-blue/40 uppercase tracking-widest">Match Rate</div>
              </div>

              <h3 className="text-2xl font-black text-dark-blue mb-4 leading-tight">{rec.career}</h3>
              <p className="text-sm text-dark-blue/60 font-medium mb-8 flex-grow">
                {rec.reason}
              </p>

              <button 
                onClick={() => handleSelectCareer(rec.career)}
                className={cn(
                  "w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all",
                  i === 0 
                    ? "bg-primary-blue text-white shadow-xl shadow-primary-blue/20 hover:bg-accent-blue" 
                    : "bg-light-blue text-primary-blue hover:bg-primary-blue hover:text-white"
                )}
              >
                Pilih Bidang Ini <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-dark-blue/40 font-bold mb-6">Merasa kurang sesuai dengan pilihan di atas?</p>
          <button className="text-primary-blue font-black hover:underline flex items-center gap-2 mx-auto">
             Ulangi Kuis (Klarifikasi AI) <Sparkles size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
