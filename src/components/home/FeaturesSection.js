import {
  Bot,
  Flame,
  MessageCircleMore,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI discovery yang makin personal",
    description:
      "30 pertanyaan dirancang untuk menggali minat, pola pikir, dan potensi kamu lebih dalam di setiap langkah.",
  },
  {
    icon: Route,
    title: "Roadmap 30 hari yang benar-benar jalan",
    description:
      "Materi, tugas, dan quiz harian disusun agar kamu tidak berhenti di teori, tapi bergerak sampai punya hasil nyata.",
  },
  {
    icon: MessageCircleMore,
    title: "AI Mentor dengan konteks progresmu",
    description:
      "Saat bingung, mentor menjawab berdasarkan bidang, hari belajar, dan tantangan yang sedang kamu kerjakan.",
  },
  {
    icon: Flame,
    title: "Streak dan momentum yang terasa hidup",
    description:
      "Setiap hari yang selesai memicu progres visual, streak, dan ritme belajar yang bikin konsisten lebih masuk akal.",
  },
  {
    icon: ShieldCheck,
    title: "Bukti kemampuan, bukan janji kosong",
    description:
      "Kartu pencapaian, badge, dan skill tree membuktikan perjalananmu bisa dilihat, dibagikan, dan dinilai orang lain.",
  },
  {
    icon: Sparkles,
    title: "Belajar serius tanpa terasa kaku",
    description:
      "Formatnya dirancang untuk Gen Z Indonesia: jelas, cepat dipahami, dan tetap terasa modern serta relevan.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="section-kicker">Kenapa Skillio</p>
            <h2 className="font-display text-3xl leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Platform yang mengubah self-development jadi sistem yang bisa
              dijalani.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Skillio bukan kumpulan course. Ini mesin pembentuk arah: membantu
            kamu memilih bidang yang tepat, membangun disiplin belajar, dan
            mengubah progres menjadi bukti yang bisa dilihat.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, index) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_60px_rgba(31,84,126,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(31,84,126,0.13)] sm:p-7"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent opacity-70" />
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2b6ea6,#68b9b2)] text-white shadow-[0_14px_30px_rgba(31,84,126,0.24)] transition duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">
                {title}
              </h3>
              <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
