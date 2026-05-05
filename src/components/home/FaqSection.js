"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Apa itu Skillio?",
    answer: "Skillio adalah platform belajar berbasis kecerdasan buatan yang membantu anak muda Indonesia menemukan bidang yang paling sesuai dengan diri mereka, lalu menjalani perjalanan belajar terstruktur selama 30 hari untuk benar-benar menguasainya."
  },
  {
    question: "Bagaimana cara menentukan bidang yang cocok?",
    answer: "Kamu akan diminta menjawab 30 pertanyaan cerdas yang semakin lama semakin tajam dan personal. AI kami akan menganalisis jawabanmu untuk mengenali potensi dan kecocokan bidang secara akurat sebelum membuatkan roadmap belajarmu."
  },
  {
    question: "Apa bedanya Skillio dengan platform kursus online biasa?",
    answer: "Skillio bukan sekadar kumpulan video teori. Kami fokus pada aksi nyata. Kamu akan mendapatkan roadmap harian, tugas nyata yang bisa dieksekusi, serta kuis konfirmasi untuk memastikan pemahaman. Kamu juga didampingi AI Mentor spesifik sesuai konteks materi."
  },
  {
    question: "Apakah saya mendapatkan sertifikat setelah selesai?",
    answer: "Daripada sertifikat kosong, Skillio memberikan bukti nyata berupa kartu pencapaian digital yang bisa dibagikan, streak harian, badge, dan skill tree (portofolio visual) yang tumbuh seiring penyelesaian roadmap 30 harimu."
  },
  {
    question: "Apa yang terjadi setelah 30 hari?",
    answer: "Setelah menyelesaikan roadmap 30 harimu, kamu dapat langsung melanjutkan ke tingkat yang lebih mahir di bidang yang sama, atau mengeksplorasi bidang baru untuk memperluas skill tree-mu."
  }
];

function FaqItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="group rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-sm transition-all hover:border-skillio-300">
      <button
        className="flex w-full items-center justify-between px-4 py-4 text-left sm:px-6"
        onClick={onClick}
      >
        <span className="font-display text-base font-bold text-slate-900 sm:text-lg">
          {question}
        </span>
        <div className={`ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? 'rotate-180 bg-skillio-50 text-skillio-600' : 'bg-slate-50 text-slate-400 group-hover:bg-skillio-50/50 group-hover:text-skillio-500'}`}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-6 pt-2 text-sm leading-relaxed text-slate-600 sm:px-6 sm:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative border-y border-slate-100 bg-slate-50/50 px-5 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {}
          <div className="flex flex-col items-start space-y-6">
            <p className="section-kicker">Pertanyaan Umum</p>
            <h2 className="font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Punya <span className="text-skillio-500">pertanyaan?</span> <br />
              Kami punya jawabannya.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
              Semua hal yang perlu kamu ketahui tentang bagaimana Skillio bekerja, sistem AI mentor, dan perjalanan 30 harimu.
            </p>
          </div>

          {}
          <div className="flex flex-col space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
