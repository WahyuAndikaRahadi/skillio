import { GoogleGenerativeAI } from "@google/generative-ai";

// Daftar API Key untuk rotasi (Sistem Eliminasi: Mulai dari 4 ke 1)
const API_KEYS = [
  process.env.GEMINI_API_KEY4,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY
].filter(Boolean);

let currentKeyIndex = 0;

/**
 * Mendapatkan instance model Gemini.
 * @param {string} type - Tipe model ('lite' atau 'roadmap')
 * @param {number} keyIndex - Index API key yang digunakan
 */
const getModelInstance = (type = "lite", keyIndex = currentKeyIndex) => {
  const genAI = new GoogleGenerativeAI(API_KEYS[keyIndex]);
  
  // Model khusus berdasarkan permintaan user
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
  
  const primaryModel = type === "roadmap" ? "gemini-3-flash-preview" : "gemini-3.1-flash-lite-preview";
  const fallbackModel = "gemini-3-flash-preview";

  // Kita coba mulai dari index yang sekarang sampai habis (sistem eliminasi)
  for (let i = currentKeyIndex; i < API_KEYS.length; i++) {
    const genAI = new GoogleGenerativeAI(API_KEYS[i]);
    
    // Coba Model Utama
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
      console.warn(`[AI] Model Utama (${primaryModel}) gagal pada Key #${4-i}. Mencoba Fallback...`);
      
      // Coba Model Fallback (Gemini 3 Flash)
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
        console.error(`[AI] Gagal total pada Key #${4 - i} (${API_KEYS.length - i}):`, fallbackError.message);
        lastError = fallbackError;
        // Lanjut ke API key berikutnya
      }
    }
  }

  throw new Error(`Gagal memproses AI setelah mencoba semua API Key dan Model Fallback. Error terakhir: ${lastError?.message}`);
}


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
    Role: Senior Mentor Profesional di Skillio.
    Tugas: Berikan bimbingan dan PENJELASAN MENDALAM (Deep Dive) untuk materi hari ini.
    
    KONTEKS TIMELINE: Hari ke-${dayNumber}
    JUDUL MATERI: ${dayTitle}
    RINGKASAN MATERI: ${dayMaterial}

    GAYA BAHASA: 
    - Gunakan sapaan profesional yang hangat (misal: "Halo! Di hari ke-${dayNumber} ini, kita akan...", "Selamat datang di sesi mendalam hari ini...").
    - Bertindaklah seperti mentor nyata yang sedang mengajar di depan kelas, bukan sekadar mesin perangkum.
    - Gunakan "Anda" sebagai sapaan sopan.
    - Tetap teknis, praktis, dan berikan insight standar industri.
    
    STRUKTUR BIMBINGAN (explanation):
    1. Konsep Fundamental & Urgensi: Jelaskan mengapa di hari ke-${dayNumber} ini kita harus menguasai ${dayTitle}. Apa hubungannya dengan perjalanan 30 hari kita?
    2. Mekanisme Detail & Teknis: Bedah cara kerjanya secara mendalam. Berikan langkah-langkah atau logika teknis yang solid.
    3. Best Practices & Standar Industri: Berikan "rahasia dapur" atau tips yang biasa digunakan profesional di lapangan.
    4. Kesalahan Umum & Mitigasi: Apa yang biasanya membuat pemula gagal di materi ini? Bagaimana cara menghindarinya?
    5. Analogi & Motivasi: Berikan analogi yang kuat dan pesan penyemangat untuk menyelesaikan misi hari ini.

    SYARAT OUTPUT:
    - Penjelasan (explanation) harus minimal 1000 karakter dan maksimal 1500 karakter.
    - JANGAN GUNAKAN SYMBOL MARKDOWN SEPERTI #, ##, *, **, atau -.
    - WAJIB gunakan DUA kali baris baru (Double Newline) di antara setiap poin penomoran (1., 2., dst) agar teks sangat mudah dibaca.
    - Berikan minimal 3 sumber belajar (resources) berkualitas tinggi (artikel, dokumentasi, atau kursus gratis).
    - YouTube query harus sangat spesifik untuk membantu praktik.

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
