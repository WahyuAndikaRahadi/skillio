import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY3);

// Model yang valid dan stabil
export const model = genAI.getGenerativeModel({ 
  model: "gemini-3.1-flash-lite-preview", // Disarankan menggunakan versi stabil ini
  generationConfig: {
    responseMimeType: "application/json",
  }
});

const extractJson = (text) => {
  try {
    // 1. Coba parse langsung
    return JSON.parse(text);
  } catch (e) {
    try {
      // 2. Jika gagal, cari kurung kurawal pertama dan terakhir (Robust Cleaning)
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      const firstBracket = text.indexOf('[');
      const lastBracket = text.lastIndexOf(']');

      // Tentukan mana yang lebih luar (objek atau array)
      const start = (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) ? firstBrace : firstBracket;
      const end = (lastBrace !== -1 && (lastBracket === -1 || lastBrace > lastBracket)) ? lastBrace : lastBracket;

      if (start !== -1 && end !== -1) {
        const candidate = text.substring(start, end + 1);
        return JSON.parse(candidate);
      }
    } catch (innerError) {
      console.error("Gagal total parsing JSON:", text);
      throw new Error("Format respons AI tidak valid");
    }
    throw new Error("Format respons AI tidak ditemukan");
  }
};

export const generateQuizQuestions = async (context, phase) => {
  let phaseInstruction = "";
  if (phase === 1) {
    phaseInstruction = "Fase 1: Kepribadian & Gaya Hidup. Buat pertanyaan UMUM tentang preferensi kerja (indoor/outdoor), cara berpikir (logika/kreatif), dan minat dasar. JANGAN menanyakan hal teknis atau spesifik bidang tertentu.";
  } else if (phase === 2) {
    phaseInstruction = "Fase 2: Eksplorasi Bidang Luas. Berdasarkan jawaban sebelumnya, buat pertanyaan untuk mengidentifikasi kategori besar (Teknologi, Kesehatan, Seni, Bisnis, dsb).";
  } else {
    phaseInstruction = "Fase 3: Spesialisasi Karier. Fokus pada detail teknis dan minat mendalam untuk menentukan 1-3 karier yang paling cocok.";
  }

  const prompt = `
    Role: Pakar Psikologi & Karier Skillio.
    Instruksi Fase: ${phaseInstruction}
    Konteks Jawaban Sebelumnya: "${context || "Baru mulai"}"
    
    Tugas: Buat 10 pertanyaan pilihan ganda yang menarik dan tidak membosankan.
    Format JSON: Array of { "question_text": "...", "options": ["A", "B", "C", "D"], "correct_option": null }.
    Penting: Karena ini tes minat, "correct_option" selalu null. Gunakan Bahasa Indonesia yang ramah dan inspiratif.
    HANYA OUTPUT JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return extractJson(response.text());
};

const PREDEFINED_CAREERS = `
Teknologi & Pengembangan: Pengembangan Web Frontend, Pengembangan Web Backend, Pengembangan Aplikasi Mobile Android, Pengembangan Aplikasi Mobile iOS, Pengembangan Fullstack, Rekayasa Perangkat Lunak, Pengujian & Jaminan Kualitas Perangkat Lunak, Keamanan Siber, Jaringan & Infrastruktur, Komputasi Awan, Pengembangan Game, Pemrograman Tertanam & Internet of Things.
Data & Kecerdasan Buatan: Analisis Data, Ilmu Data, Rekayasa Data, Kecerdasan Buatan & Pembelajaran Mesin, Prompt Engineering & AI Tools, Visualisasi Data, Riset & Eksperimen Pengguna, Otomasi & No-Code Development.
Desain & Kreativitas: Desain UI/UX, Desain Grafis, Desain Produk Digital, Desain Gerak & Animasi, Desain Karakter & Ilustrasi, Desain 3D & Pemodelan, Desain Antarmuka Game, Tipografi & Identitas Visual, Desain Presentasi & Infografis, Desain Augmented Reality & Virtual Reality.
Konten & Media Digital: Pembuatan Konten & Kreator Digital, Penulisan Kreatif & Copywriting, Penulisan Teknis & Dokumentasi, Produksi Podcast, Produksi & Pengeditan Video, Fotografi Digital, Manajemen Media Sosial, Penyiaran & Streaming Digital.
Bisnis & Pemasaran Digital: Pemasaran Digital, Optimasi Mesin Pencari, Periklanan Digital & Manajemen Iklan, Manajemen Produk Digital, Pertumbuhan & Pemasaran Berbasis Data, Perdagangan Elektronik & Toko Online, Afiliasi & Monetisasi Digital, Hubungan Masyarakat Digital, Kewirausahaan Digital & Rintisan Teknologi.
Keuangan & Legalitas Digital: Keuangan Pribadi & Investasi Digital, Hukum & Regulasi Teknologi Digital, Kepatuhan & Tata Kelola Data.
`;

export const analyzeCareerRecommendation = async (allAnswers) => {
  const context = allAnswers
    .map((a) => `Fase ${a.phase} | T: ${a.question} -> J: ${a.answer}`)
    .join("\n");

  const prompt = `
    Role: Konsultan Karier Skillio.
    Analisis 30 jawaban ini: "${context}"
    Tugas: Berikan 3 rekomendasi karier.
    
    ATURAN SANGAT PENTING: Anda HARUS dan HANYA BOLEH memilih rekomendasi karier dari daftar 50 bidang digital berikut ini. DILARANG KERAS memberikan karir di luar daftar ini:
    ${PREDEFINED_CAREERS}

    Format JSON:
    {
      "summary": "...",
      "recommendations": [
        { "career": "Nama Karir Persis Sesuai Daftar", "match": 90, "reason": "..." }
      ]
    }
    Bahasa: Indonesia Profesional (Anda).
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return extractJson(response.text());
};

export const generateFullRoadmap = async (career) => {
  const prompt = `
    Tugas: Buat roadmap belajar intensif 30 hari untuk karier: "${career}".
    Output harus berupa JSON murni dengan struktur berikut:
    {
      "career": "${career}",
      "weeks": [
        { "week": 1, "theme": "..." },
        { "week": 2, "theme": "..." },
        { "week": 3, "theme": "..." },
        { "week": 4, "theme": "..." }
      ],
      "days": [
        {
          "day": 1,
          "title": "...",
          "description": "...",
          "tasks": ["...", "...", "..."],
          "quizzes": [
            {
              "question": "...",
              "options": ["...", "...", "...", "..."],
              "correct_option": "...",
              "explanation": "..."
            }
          ]
        }
      ]
    }
    Instruksi Kuis: Berikan TEPAT 5 pertanyaan kuis pilihan ganda untuk SETIAP hari.
    Penting: Pastikan ada 30 hari lengkap. Gunakan Bahasa Indonesia Profesional. HANYA OUTPUT JSON.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return extractJson(response.text());
};
export async function generateDayExpansion(dayTitle, dayMaterial) {
  const prompt = `
    Anda adalah AI Mentor Senior di Skillio. Tugas Anda adalah memberikan PENJELASAN MENDALAM (Deep Dive) untuk materi berikut:
    
    JUDUL MATERI: ${dayTitle}
    RINGKASAN MATERI: ${dayMaterial}

    Tujuan: Memberikan pemahaman tingkat lanjut yang tidak ada di ringkasan dasar. 
    Gunakan gaya bahasa profesional, inspiratif, namun sangat teknis dan praktis.
    
    STRUKTUR PENJELASAN (explanation):
    1. Konsep Fundamental (Mengapa ini penting?)
    2. Cara Kerja / Mekanisme Detail (Langkah-demi-langkah teknis)
    3. Best Practices & Pro Tips (Sesuai standar industri saat ini)
    4. Kesalahan Umum yang Harus Dihindari
    5. Analogi Dunia Nyata (Agar mudah diingat)

    SYARAT OUTPUT:
    - Penjelasan (explanation) harus minimal 800 karakter dan maksimal 1200 karakter.
    - JANGAN GUNAKAN SYMBOL MARKDOWN SEPERTI #, ##, *, **, atau -.
    - WAJIB gunakan DUA kali baris baru (Double Newline) di antara setiap poin penomoran (1., 2., dst) agar teks tidak menumpuk.
    - Gunakan paragraf yang jelas.
    - Berikan minimal 3 sumber belajar (resources) berkualitas tinggi.
    - YouTube query harus sangat spesifik.

    WAJIB OUTPUT DALAM JSON MURNI:
    {
      "explanation": "...",
      "resources": [
        { "title": "...", "url": "..." }
      ],
      "youtube_query": "..."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = extractJson(text);

    // Validasi data
    if (!data.explanation || data.explanation.length < 50) {
      throw new Error("AI returned insufficient content");
    }

    return data;
  } catch (error) {
    console.error("AI Generation failed, using fallback:", error);
    // Fallback content if AI fails
    return {
      explanation: `### Penjelasan Mendalam: ${dayTitle}\n\nMateri tentang **${dayTitle}** merupakan pilar penting dalam perjalanan Anda. \n\n**Kenapa ini penting?**\n${dayMaterial}\n\n**Panduan Belajar:**\n1. Pahami dokumentasi teknis terkait materi ini.\n2. Lakukan praktik langsung pada proyek nyata.\n3. Hubungkan konsep ini dengan materi hari-hari sebelumnya untuk membangun pemahaman yang utuh.\n\n*Mentor AI sedang mengalami kendala teknis untuk memberikan penjelasan yang lebih mendalam, silakan gunakan sumber daya di bawah untuk eksplorasi mandiri.*`,
      resources: [
        { title: "Dokumentasi Resmi", url: `https://www.google.com/search?q=${encodeURIComponent(dayTitle + " official documentation")}` },
        { title: "Artikel Praktik Terbaik", url: `https://www.google.com/search?q=${encodeURIComponent(dayTitle + " best practices")}` }
      ],
      youtube_query: dayTitle
    };
  }
}
