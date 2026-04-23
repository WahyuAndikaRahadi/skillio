import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

export const analyzeCareerRecommendation = async (allAnswers) => {
  const context = allAnswers
    .map((a) => `Fase ${a.phase} | T: ${a.question} -> J: ${a.answer}`)
    .join("\n");

  const prompt = `
    Role: Konsultan Karier Skillio.
    Analisis 30 jawaban ini: "${context}"
    Tugas: Berikan 3 rekomendasi karier.
    Format JSON:
    {
      "summary": "...",
      "recommendations": [
        { "career": "...", "match": 90, "reason": "..." }
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
    Anda adalah asisten belajar profesional tingkat tinggi. 
    Tugas Anda adalah memberikan penjelasan mendalam untuk materi belajar berikut:
    Judul: ${dayTitle}
    Ringkasan: ${dayMaterial}

    Berikan output dalam format JSON murni:
    {
      "explanation": "Penjelasan mendalam, teknis namun mudah dipahami, gunakan poin-poin dan struktur yang sangat rapi.",
      "resources": [
        { 
          "title": "Nama sumber (misal: Dokumentasi Resmi React, Artikel Medium, Buku Spesifik)", 
          "url": "Berikan URL lengkap (dimulai dengan https://). Jika tidak tahu URL pastinya, berikan null saja, JANGAN memberikan teks deskripsi di sini." 
        }
      ],
      "youtube_query": "Kata kunci pencarian YouTube yang paling spesifik untuk materi ini"
    }
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return extractJson(text);
}
