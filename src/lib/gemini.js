import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS = [
  process.env.GEMINI_API_KEY4,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY
].filter(Boolean);

let currentKeyIndex = 0;

const getModelInstance = (type = "lite", keyIndex = currentKeyIndex) => {
  const genAI = new GoogleGenerativeAI(API_KEYS[keyIndex]);

  const modelName = type === "roadmap"
    ? "gemini-3-flash-preview"
    : "gemini-3.1-flash-lite-preview";

  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });
};

async function callGemini(prompt, type = "lite") {
  let lastError = null;

  const isRoadmap = type === "roadmap";
  const primaryModel = isRoadmap ? "gemini-3-flash-preview" : "gemini-3.1-flash-lite-preview";
  const fallbackModel = "gemini-3-flash-preview";

  for (let i = currentKeyIndex; i < API_KEYS.length; i++) {
    const genAI = new GoogleGenerativeAI(API_KEYS[i]);

    try {
      const model = genAI.getGenerativeModel({
        model: primaryModel,
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      currentKeyIndex = i;
      return response.text();
    } catch (primaryError) {

      if (isRoadmap) {
        console.warn(`[AI] Roadmap (${primaryModel}) gagal pada Key #${4-i}. Lanjut ke Key berikutnya...`);
        lastError = primaryError;
        continue;
      }

      console.warn(`[AI] Model Utama (${primaryModel}) gagal pada Key #${4-i}. Mencoba Fallback...`);

      try {
        const model = genAI.getGenerativeModel({
          model: fallbackModel,
          generationConfig: { responseMimeType: "application/json" }
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        currentKeyIndex = i;
        return response.text();
      } catch (fallbackError) {
        console.error(`[AI] Gagal total pada Key #${4 - i}:`, fallbackError.message);
        lastError = fallbackError;
      }
    }
  }

  throw new Error(`Gagal memproses AI setelah mencoba semua API Key. Error terakhir: ${lastError?.message}`);
}

const extractJson = (text) => {
  try {

    return JSON.parse(text);
  } catch (e) {
    try {

      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      const firstBracket = text.indexOf('[');
      const lastBracket = text.lastIndexOf(']');

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

  const text = await callGemini(prompt, "lite");
  return extractJson(text);
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

  const text = await callGemini(prompt, "lite");
  return extractJson(text);
};

export const generateFullRoadmap = async (career) => {
  const prompt = `
    Tugas: Buat roadmap belajar intensif 30 hari untuk karier: "${career}".
    Anda HARUS memberikan rencana lengkap untuk 30 hari tanpa terputus.

    Format JSON:
    {
      "career": "${career}",
      "weeks": [
        { "week": 1, "theme": "Pengenalan & Dasar" },
        { "week": 2, "theme": "Fundamental Mendalam" },
        { "week": 3, "theme": "Praktik Lanjutan" },
        { "week": 4, "theme": "Proyek & Sertifikasi" }
      ],
      "days": [
        {
          "day_number": 1,
          "title": "...",
          "material": "...",
          "tasks": ["...", "..."],
          "quizzes": [
            {
              "question": "...",
              "options": ["A", "B", "C", "D"],
              "correct_option": "...",
              "explanation": "..."
            }
          ]
        }
      ]
    }

    SYARAT MUTLAK:
    1. WAJIB 30 HARI LENGKAP (Day 1 s/d Day 30).
    2. Materi ringkas tapi jelas.
    3. HANYA OUTPUT JSON.
    4. Setiap hari WAJIB memiliki minimal 5 pertanyaan kuis yang menantang.
    5. Penjelasan kuis (explanation) harus menggunakan gaya bahasa mentor yang mendukung (misal: "Bagus sekali! Kamu benar karena...", atau "Sayang sekali, ingat bahwa...").
  `;

  console.log(`[AI] Memulai generate roadmap khusus dengan model roadmap...`);
  const text = await callGemini(prompt, "roadmap");
  const parsed = extractJson(text);

  if (parsed.days && parsed.days.length < 25) {
    throw new Error("Output terpotong oleh AI (kurang dari 25 hari)");
  }

  console.log(`[AI] Berhasil generate roadmap (${parsed.days.length} hari).`);
  return parsed;
};

export async function generateDayExpansion(dayNumber, dayTitle, dayMaterial) {
  const prompt = `
    Role: Senior Tech Mentor & Architect di Skillio.
    Tugas: Berikan bimbingan "DAGING" dan PENJELASAN MENDALAM yang sangat solid untuk materi hari ini. JANGAN berikan penjelasan permukaan yang membosankan.

    KONTEKS TIMELINE: Hari ke-${dayNumber}
    JUDUL MATERI: ${dayTitle}
    RINGKASAN MATERI: ${dayMaterial}

    GAYA BAHASA & STRUKTUR:
    - Gunakan gaya bahasa mentor senior yang sedang memberikan coaching 1-on-1 kepada murid pilihannya. Bahasa harus mengalir, berwibawa, namun sangat mencerahkan.
    - WAJIB terdiri dari MAKSIMAL 2 PARAGRAF SAJA.
    - SETIAP PARAGRAF HARUS SANGAT PANJANG, PADAT, DAN BERISI (DAGING). Minimal 500 karakter per paragraf.
    - DILARANG KERAS menggunakan LIST, POIN, NOMOR (1., 2., dst), atau BULLET POINT (- atau *). Semuanya harus dalam bentuk narasi paragraf yang mengalir.
    - DILARANG menggunakan simbol markdown seperti #, ##, atau **. Gunakan teks polos saja.

    KONTEN PARAGRAF 1 (The Core & Industry Insight): Bedah konsep ${dayTitle} dari sudut pandang fundamental dan bagaimana ini menjadi tulang punggung di industri nyata. Jelaskan mekanisme teknisnya secara mendalam (under the hood) sehingga murid benar-benar paham cara kerjanya, bukan sekadar tahu cara pakainya.

    KONTEN PARAGRAF 2 (Strategy & Secret Sauce): Berikan strategi eksekusi, rahasia standar industri yang jarang diketahui pemula, serta bagaimana menghindari jebakan Batman yang sering membuat orang gagal di materi ini. Tutup dengan pesan filosofis yang membakar semangat murid untuk menyelesaikan misi hari ini.

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
    const text = await callGemini(prompt, "lite");
    const data = extractJson(text);

    if (!data.explanation || data.explanation.length < 50) {
      throw new Error("AI returned insufficient content");
    }

    return data;
  } catch (error) {
    console.error("AI Generation failed, using fallback:", error);

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
