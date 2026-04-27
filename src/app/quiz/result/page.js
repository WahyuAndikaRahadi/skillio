"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { 
  Trophy, ArrowRight, RotateCcw, Target, Sparkles, 
  ChevronRight, Info, CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

const ResultPage = () => {
  const router = useRouter();
  const { quizAnswers, setQuizResult, quizResult } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (quizAnswers.length < 30 && !quizResult) {
      router.push("/quiz");
      return;
    }
    if (!quizResult) analyzeResults();
    else setIsLoading(false);
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
      if (response.ok) router.push("/belajar");
      else {
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Roadmap",
          text: "Maaf, terjadi kendala teknis. Silakan coba lagi ya!",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-slate-100 border-t-skillio-600 animate-spin mb-6" />
        <h2 className="text-xl font-bold text-slate-900">Menganalisis Hasil...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 md:py-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header - Simple & Modern */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-skillio-50 text-skillio-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Trophy size={12} />
            Analysis Complete
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Rekomendasi <span className="text-skillio-600">Karier Anda</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium max-w-2xl mx-auto">
            Berdasarkan profil Anda, berikut adalah jalur yang paling sesuai.
          </p>
        </div>

        {/* AI Summary - Simple Box */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-12 flex items-start gap-4"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm text-skillio-600">
            <Info size={18} />
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
            "{quizResult?.summary}"
          </p>
        </motion.div>

        {/* Results Grid - Clean & Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quizResult?.recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group bg-white p-8 rounded-[32px] border transition-all flex flex-col",
                i === 0 
                  ? "border-skillio-600 shadow-xl shadow-skillio-100/50 ring-1 ring-skillio-600/10" 
                  : "border-slate-100 hover:border-slate-200"
              )}
            >
              <div className="mb-6 flex justify-between items-start">
                <div className="space-y-1">
                   <div className="text-3xl font-black text-skillio-600">{rec.match}%</div>
                   <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Match Score</div>
                </div>
                {i === 0 && (
                   <span className="bg-skillio-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md">
                      Best
                   </span>
                )}
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-skillio-600 transition-colors">
                {rec.career}
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-8 flex-grow leading-relaxed">
                {rec.reason}
              </p>

              <button 
                onClick={() => handleSelectCareer(rec.career)}
                className={cn(
                  "w-full py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all",
                  i === 0 
                    ? "bg-skillio-600 text-white shadow-lg shadow-skillio-600/20 hover:bg-skillio-700" 
                    : "bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white"
                )}
              >
                Pilih Bidang <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Simple Footer Actions */}
        <div className="mt-20 flex flex-col items-center">
          <button 
            onClick={() => router.push("/quiz")}
            className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-900 transition-all cursor-pointer"
          >
             <RotateCcw size={16} />
             Ulangi Kuis
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
