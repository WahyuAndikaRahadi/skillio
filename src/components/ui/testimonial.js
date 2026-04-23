import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, BriefcaseBusiness, Sparkles, Trophy } from "lucide-react";

const allTestimonials = [
  {
    quote: "Skillio bikin saya berhenti pindah-pindah minat. Roadmap-nya terasa seperti mentor yang benar-benar ngerti saya harus mulai dari mana.",
    name: "Nadya Rahma",
    role: "Mahasiswi semester 2",
    company: "Surabaya",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop",
    icon: Sparkles,
    badge: "Mulai dari nol",
    color: "bg-white",
    textColor: "text-slate-800"
  },
  {
    quote: "Bagian paling berguna itu tugas hariannya. Saya tidak cuma baca materi, tapi langsung punya sesuatu yang bisa dikerjakan.",
    name: "Rafi Pradana",
    role: "Fresh graduate",
    company: "Bandung",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=687&auto=format&fit=crop",
    icon: BriefcaseBusiness,
    badge: "Task-driven",
    color: "bg-skillio-600",
    textColor: "text-white"
  },
  {
    quote: "AI Mentornya tidak terasa generik. Saat saya bingung di tengah materi, jawabannya nyambung dengan progres saya.",
    name: "Caca Permata",
    role: "Siswa SMA",
    company: "Makassar",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop",
    icon: BookOpen,
    badge: "AI Mentor",
    color: "bg-white",
    textColor: "text-slate-800"
  },
  {
    quote: "Saya suka karena progress-nya kelihatan. Ada streak, badge, dan kartu capaian yang bikin saya merasa perjalanan ini nyata.",
    name: "Dimas Alfarizi",
    role: "Mahasiswa",
    company: "Yogyakarta",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop",
    icon: Trophy,
    badge: "Progress-based",
    color: "bg-slate-900",
    textColor: "text-white"
  },
  {
    quote: "Biasanya saya cepat kehilangan ritme. Di Skillio justru enak, karena setiap hari sudah jelas apa yang harus saya selesaikan.",
    name: "Salma Ayu",
    role: "Gap year learner",
    company: "Jakarta",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=687&auto=format&fit=crop",
    icon: Sparkles,
    badge: "Stable Rhythm",
    color: "bg-white",
    textColor: "text-slate-800"
  },
  {
    quote: "Skillio membantu saya punya bahan cerita saat apply internship. Saya bisa tunjukkan apa yang sudah saya kerjakan.",
    name: "Tegar Saputra",
    role: "Internship seeker",
    company: "Depok",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=687&auto=format&fit=crop",
    icon: BriefcaseBusiness,
    badge: "Proof over promises",
    color: "bg-skillio-500",
    textColor: "text-white"
  },
  {
    quote: "Yang saya rasakan bukan sekadar semangat sesaat. Skillio bikin proses belajarnya runtut, masuk akal, dan mudah dipertahankan.",
    name: "Alya Fitria",
    role: "Early-career learner",
    company: "Semarang",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=687&auto=format&fit=crop",
    icon: BookOpen,
    badge: "Sustainable",
    color: "bg-white",
    textColor: "text-slate-800"
  }
];

const row1 = [...allTestimonials.slice(0, 4)];
const row2 = [...allTestimonials.slice(3)];

function MarqueeRow({ items, direction = "left", duration = 40 }) {
  return (
    <div className="flex w-full overflow-hidden">
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex gap-6 whitespace-nowrap py-4"
      >
        {[...items, ...items].map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className={`w-[350px] shrink-0 rounded-[2rem] border border-slate-100 p-8 shadow-sm sm:w-[450px] ${item.color} ${item.textColor}`}
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${item.textColor === "text-white" ? "bg-white/10 text-white/80" : "bg-slate-100 text-slate-500"}`}>
                  <item.icon className="h-3 w-3" />
                  {item.badge}
                </div>
                <p className="whitespace-normal text-base font-medium leading-relaxed italic sm:text-lg">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-current/10 pt-6">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="h-12 w-12 rounded-full border-2 border-current/20 object-cover"
                />
                <div className="whitespace-normal">
                  <h4 className="font-display text-base font-bold">{item.name}</h4>
                  <p className="text-xs opacity-70">{item.role} &middot; {item.company}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function ClientFeedback() {
  return (
    <section className="relative w-full overflow-hidden bg-transparent py-10">
      <div className="mx-auto mb-0 max-w-4xl px-5 text-center">
        <h2 className="font-display text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">
          Apa kata mereka yang sudah <br />
          <span className="text-skillio-500">menemukan arah di Skillio.</span>
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <MarqueeRow items={row1} direction="right" duration={35} />
        <MarqueeRow items={row2} direction="left" duration={45} />
      </div>

      {/* Fade Overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#f8fbfd] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#f8fbfd] to-transparent z-10" />
    </section>
  );
}

export default ClientFeedback;
