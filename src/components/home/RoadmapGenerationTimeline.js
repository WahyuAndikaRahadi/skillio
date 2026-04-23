import {
  BadgeCheck,
  BookOpenText,
  Bot,
  BrainCircuit,
  ClipboardCheck,
  Milestone,
  Sparkles,
  Target,
} from "lucide-react";

const roadmapMoments = [
  {
    step: "Step 01",
    title: "AI membaca arah dan potensi personalmu",
    description:
      "Skillio memulai dari 30 pertanyaan yang makin tajam untuk memahami minat, pola belajar, kekuatan, dan gaya kerja yang paling cocok buat kamu.",
    icon: BrainCircuit,
    align: "right",
    highlights: [
      "30 pertanyaan adaptif",
      "Minat, ritme, dan motivasi",
      "Analisis kecocokan bidang",
    ],
  },
  {
    step: "Step 02",
    title: "Bidang terbaik dipilih dengan logika yang jelas",
    description:
      "Setelah sinyal utamanya kebaca, sistem menyusun pilihan bidang yang paling relevan agar kamu tidak buang energi ke jalur yang terasa keren tapi tidak pas.",
    icon: Target,
    align: "left",
    highlights: [
      "Prioritas bidang paling cocok",
      "Alasan pemilihan transparan",
      "Arah belajar lebih fokus",
    ],
  },
  {
    step: "Step 03",
    title: "Roadmap 30 hari dibangun otomatis",
    description:
      "AI menyusun struktur harian yang realistis: fondasi dulu, lalu latihan bertahap, lalu tantangan yang makin nyata seiring progresmu naik.",
    icon: Milestone,
    align: "right",
    highlights: [
      "Urutan materi bertingkat",
      "Durasi harian terukur",
      "Progres dibangun per fase",
    ],
  },
  {
    step: "Step 04",
    title: "Setiap hari berisi materi, tugas, dan quiz",
    description:
      "Bukan cuma dikasih bacaan. Setiap hari roadmap menghasilkan paket belajar yang lengkap supaya kamu membaca, mengerjakan, dan mengonfirmasi pemahaman.",
    icon: BookOpenText,
    align: "left",
    highlights: [
      "Materi singkat dan fokus",
      "Tugas nyata yang relevan",
      "Quiz untuk validasi paham",
    ],
  },
  {
    step: "Step 05",
    title: "Progres berubah jadi bukti dan pendampingan",
    description:
      "Hasil belajar tidak berhenti di dashboard. Skillio mengubah progres menjadi streak, kartu capaian, badge, dan konteks untuk AI Mentor agar bantuan terasa personal.",
    icon: BadgeCheck,
    align: "right",
    highlights: [
      "Achievement card siap dibagikan",
      "Badge dan streak aktif",
      "AI Mentor paham konteks roadmap",
    ],
  },
];

export default function RoadmapGenerationTimeline() {
  return (
    <section id="roadmap-generation" className="px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-5 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="section-kicker">Roadmap Generator</p>
            <h2 className="font-display text-3xl leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Timeline cara Skillio mengubah data dirimu jadi roadmap belajar
              30 hari.
            </h2>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/72 p-5 text-sm leading-7 text-slate-600 shadow-[0_18px_50px_rgba(31,84,126,0.08)] backdrop-blur lg:max-w-sm">
            Visual ini menjelaskan fitur inti Skillio: proses generasi roadmap
            yang bergerak dari identifikasi potensi sampai output belajar harian
            yang benar-benar siap dijalani.
          </div>
        </div>

        <div className="blueprint-panel rounded-[36px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="relative">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-[linear-gradient(180deg,rgba(43,110,166,0.12),rgba(43,110,166,0.28),rgba(104,185,178,0.10))] lg:left-1/2 lg:-translate-x-1/2" />

            <div className="space-y-6 lg:space-y-10">
              {roadmapMoments.map(
                ({ step, title, description, icon: Icon, align, highlights }) => (
                  <div
                    key={step}
                    className={`relative grid gap-4 lg:grid-cols-2 lg:gap-10 ${
                      align === "left" ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="relative pl-14 lg:pl-0">
                      <div className="absolute left-0 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white text-skillio-600 shadow-[0_10px_30px_rgba(31,84,126,0.12)] lg:left-auto lg:right-[-1.35rem] lg:top-8 lg:h-11 lg:w-11">
                        <span className="absolute inset-2 rounded-full bg-skillio-500/12" />
                        <span className="relative h-3.5 w-3.5 rounded-full bg-[linear-gradient(135deg,#2b6ea6,#68b9b2)]" />
                      </div>

                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
                          align === "left"
                            ? "bg-slate-900 text-white lg:ml-8"
                            : "bg-slate-100 text-slate-700 lg:mr-8"
                        }`}
                      >
                        <Sparkles className="h-4 w-4" />
                        {step}
                      </div>

                      <article className="mt-4 rounded-[28px] border border-white/75 bg-white/88 p-6 shadow-[0_20px_70px_rgba(31,84,126,0.10)] backdrop-blur sm:p-7">
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2b6ea6,#68b9b2)] text-white shadow-[0_16px_40px_rgba(31,84,126,0.22)]">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="hidden rounded-2xl bg-skillio-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-skillio-700 sm:block">
                            Generasi roadmap
                          </div>
                        </div>

                        <h3 className="max-w-xl text-2xl font-semibold leading-tight text-slate-950 sm:text-[2rem]">
                          {title}
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                          {description}
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          {highlights.map((item, index) => (
                            <div
                              key={item}
                              className={`rounded-2xl border px-4 py-3 text-sm ${
                                index === 0
                                  ? "border-skillio-200 bg-skillio-50 text-skillio-700"
                                  : "border-slate-100 bg-slate-50/80 text-slate-600"
                              }`}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </article>
                    </div>

                    <div className="hidden lg:block" />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] border border-white/75 bg-[linear-gradient(135deg,rgba(43,110,166,0.06),rgba(104,185,178,0.08),rgba(255,255,255,0.84))] p-5 sm:grid-cols-3 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-skillio-600 shadow-[0_12px_30px_rgba(31,84,126,0.10)]">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Adaptive generation
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Output roadmap menyesuaikan data personal, bukan template
                  statis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-skillio-600 shadow-[0_12px_30px_rgba(31,84,126,0.10)]">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Ready to execute
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Begitu roadmap selesai dibuat, user bisa langsung mulai hari
                  pertama tanpa setup rumit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-skillio-600 shadow-[0_12px_30px_rgba(31,84,126,0.10)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Built for momentum
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Struktur roadmap dirancang untuk menjaga rasa maju dari hari
                  pertama sampai selesai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
