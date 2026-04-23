"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import Image from "next/image";
import { BookOpen, BriefcaseBusiness, Sparkles, Trophy } from "lucide-react";
import { useRef } from "react";

const leftCards = [
  {
    quote:
      "Skillio bikin saya berhenti pindah-pindah minat. Roadmap-nya terasa seperti mentor yang benar-benar ngerti saya harus mulai dari mana.",
    name: "Nadya Rahma",
    role: "Mahasiswi semester 2",
    company: "Surabaya",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop",
    icon: Sparkles,
    badge: "Mulai dari nol, tetap jalan",
    className:
      "lg:flex-[7] flex-[6] flex flex-col justify-between relative overflow-hidden rounded-lg border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,247,251,0.92))] p-5 text-slate-800",
    decorated: true,
  },
  {
    quote:
      "Bagian paling berguna itu tugas hariannya. Saya tidak cuma baca materi, tapi langsung punya sesuatu yang bisa dikerjakan dan dinilai.",
    name: "Rafi Pradana",
    role: "Fresh graduate",
    company: "Bandung",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=687&auto=format&fit=crop",
    icon: BriefcaseBusiness,
    badge: "Task-driven learning",
    className:
      "lg:flex-[3] flex-[4] lg:h-fit lg:shrink-0 flex flex-col justify-between relative overflow-hidden rounded-lg border border-slate-200 bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] p-5 text-white",
  },
];

const middleCards = [
  {
    quote:
      "AI Mentornya tidak terasa generik. Saat saya bingung di tengah materi, jawabannya nyambung dengan progres saya di hari itu.",
    name: "Caca Permata",
    role: "Siswa SMA",
    company: "Makassar",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop",
    icon: BookOpen,
    badge: "AI Mentor yang kontekstual",
  },
  {
    quote:
      "Saya suka karena progress-nya kelihatan. Ada streak, badge, dan kartu capaian yang bikin saya merasa perjalanan ini nyata.",
    name: "Dimas Alfarizi",
    role: "Mahasiswa",
    company: "Yogyakarta",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop",
    icon: Trophy,
    badge: "Progress yang kelihatan",
  },
  {
    quote:
      "Biasanya saya cepat kehilangan ritme. Di Skillio justru enak, karena setiap hari sudah jelas apa yang harus saya selesaikan.",
    name: "Salma Ayu",
    role: "Gap year learner",
    company: "Jakarta",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=687&auto=format&fit=crop",
    icon: Sparkles,
    badge: "Ritme belajar lebih stabil",
  },
];

const rightCards = [
  {
    quote:
      "Skillio membantu saya punya bahan cerita saat apply internship. Saya bisa tunjukkan apa yang sudah saya kerjakan, bukan cuma bilang saya tertarik.",
    name: "Tegar Saputra",
    role: "Internship seeker",
    company: "Depok",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=687&auto=format&fit=crop",
    icon: BriefcaseBusiness,
    badge: "Proof over promises",
    className:
      "lg:flex-[3] flex-[4] flex flex-col justify-between relative overflow-hidden rounded-lg border border-slate-200 bg-[linear-gradient(135deg,#2b6ea6,#1f547e)] p-5 text-white",
  },
  {
    quote:
      "Yang saya rasakan bukan sekadar semangat sesaat. Skillio bikin proses belajarnya runtut, masuk akal, dan jauh lebih mudah dipertahankan.",
    name: "Alya Fitria",
    role: "Early-career learner",
    company: "Semarang",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=687&auto=format&fit=crop",
    icon: BookOpen,
    badge: "Belajar yang lebih sustainable",
    className:
      "lg:flex-[7] flex-[6] flex flex-col justify-between relative overflow-hidden rounded-lg border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,247,251,0.92))] p-5 text-slate-800",
    decorated: true,
  },
];

function ClientFeedback() {
  const testimonialRef = useRef(null);

  const revealVariants = {
    visible: (i) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.18,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <main className="w-full bg-transparent">
      <section
        className="relative container mx-auto h-full rounded-[32px] bg-white/80 py-14 text-black shadow-[0_24px_90px_rgba(31,84,126,0.10)] backdrop-blur"
        ref={testimonialRef}
      >
        <article className="mx-auto max-w-screen-md space-y-2 px-4 text-center sm:px-6">
          <TimelineContent
            as="h1"
            className="font-display text-3xl font-medium text-slate-950 xl:text-5xl"
            animationNum={0}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
          >
            Testimoni dari mereka yang akhirnya punya arah belajar yang jelas
          </TimelineContent>
          <TimelineContent
            as="p"
            className="mx-auto max-w-2xl text-sm leading-7 text-slate-500 sm:text-base"
            animationNum={1}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
          >
            Skillio membantu user menemukan bidang yang tepat, menjalani
            roadmap 30 hari, lalu menjaga momentum belajarnya tetap hidup.
          </TimelineContent>
        </article>

        <div className="flex w-full flex-col gap-2 px-4 pb-4 pt-10 md:px-6 lg:grid lg:grid-cols-3 lg:gap-2 lg:px-10 lg:py-10">
          <div className="md:flex lg:flex-col lg:gap-0 lg:space-y-2 h-full gap-2">
            {leftCards.map((card, index) => (
              <TimelineContent
                key={card.name}
                animationNum={index}
                customVariants={revealVariants}
                timelineRef={testimonialRef}
                className={card.className}
              >
                <FeedbackCard card={card} compact={index === 1} />
              </TimelineContent>
            ))}
          </div>

          <div className="lg:h-full md:flex lg:flex-col h-fit gap-2 lg:gap-0 lg:space-y-2">
            {middleCards.map((card, index) => (
              <TimelineContent
                key={card.name}
                animationNum={index + 2}
                customVariants={revealVariants}
                timelineRef={testimonialRef}
                className="flex flex-col justify-between relative overflow-hidden rounded-lg border border-slate-200 bg-[#111111] p-5 text-white"
              >
                <FeedbackCard card={card} compact />
              </TimelineContent>
            ))}
          </div>

          <div className="h-full md:flex lg:flex-col lg:gap-0 lg:space-y-2 gap-2">
            {rightCards.map((card, index) => (
              <TimelineContent
                key={card.name}
                animationNum={index + 5}
                customVariants={revealVariants}
                timelineRef={testimonialRef}
                className={card.className}
              >
                <FeedbackCard card={card} compact={index === 0} />
              </TimelineContent>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-[5%] z-[2] h-16 w-[90%] border-b-2 border-[#dce6ee] md:left-0 md:w-full">
          <div className="container relative mx-auto h-full w-full before:absolute before:-bottom-2 before:-left-2 before:h-4 before:w-4 before:border before:border-slate-300 before:bg-white before:shadow-sm after:absolute after:-right-2 after:-bottom-2 after:h-4 after:w-4 after:border after:border-slate-300 after:bg-white after:shadow-sm"></div>
        </div>
      </section>
    </main>
  );
}

function FeedbackCard({ card, compact = false }) {
  const Icon = card.icon;
  const isLight = card.className?.includes("text-slate-800");

  return (
    <>
      {card.decorated ? (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f14_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f14_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      ) : null}

      <article className="relative mt-auto">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
            isLight ? "bg-skillio-50 text-skillio-700" : "bg-white/10 text-white/80"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {card.badge}
        </div>

        <p className={`${compact ? "text-sm leading-7" : "leading-8"} pt-4`}>
          &ldquo;{card.quote}&rdquo;
        </p>

        <div className="flex justify-between items-end pt-5">
          <div>
            <h2 className={`font-semibold ${compact ? "text-lg lg:text-xl" : "text-sm lg:text-xl"}`}>
              {card.name}
            </h2>
            <p className={`${compact ? "text-sm lg:text-base" : ""} ${isLight ? "text-slate-500" : "text-current/80"}`}>
              {card.role} · {card.company}
            </p>
          </div>
          <Image
            src={card.image}
            alt={card.name}
            width={200}
            height={200}
            className={`${compact ? "w-12 h-12 lg:w-16 lg:h-16" : "w-16 h-16"} rounded-xl object-cover`}
          />
        </div>
      </article>
    </>
  );
}

export default ClientFeedback;
