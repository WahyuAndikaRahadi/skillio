import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY4
].filter(Boolean);

const genAI = new GoogleGenerativeAI(API_KEYS[Math.floor(Math.random() * API_KEYS.length)] || process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ message: "Pesan kosong" }, { status: 400 });
    }

    const systemPrompt = `
      Anda adalah "Skillio Mentor", asisten virtual yang cerdas dan ramah di halaman depan aplikasi web "Skillio".
      Skillio adalah platform EdTech tempat anak muda Indonesia menemukan passion mereka dan belajar skill digital (seperti UI/UX, Web Dev, Digital Marketing) dalam 30 hari secara terstruktur dengan bantuan AI.
      
      Tugas Anda:
      1. Menjawab pertanyaan atau sapaan pengunjung dengan singkat, ceria, dan antusias.
      2. Maksimal panjang jawaban adalah 2-3 kalimat pendek saja (sangat penting agar UI chat tidak penuh).
      3. Di akhir jawaban, SELALU ajak mereka secara halus untuk mendaftar/login ("Yuk daftar sekarang!", "Login yuk buat cari tahu potensimu!", dll).
      4. Jangan berikan jawaban teknis panjang lebar. Arahkan mereka untuk login jika ingin sesi mentoring sungguhan.
      5. Anda memiliki ingatan percakapan (stateful).
      6. JANGAN gunakan format markdown seperti bold (**), header (##), atau list. Gunakan teks polos saja agar tampilan chat tetap bersih.
    `;

    const contents = [];
    
    for (const msg of history) {
      if (msg.role === "ai" && msg.content.includes("Halo!")) continue;
      
      contents.push({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content || "" }]
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    let lastError = null;
    let responseText = "";
    const primaryModelName = "gemini-3.1-flash-lite-preview";
    const fallbackModelName = "gemini-3-flash-preview";

    let success = false;
    for (let i = API_KEYS.length - 1; i >= 0; i--) {
      const currentGenAI = new GoogleGenerativeAI(API_KEYS[i]);
      
      try {
        const model = currentGenAI.getGenerativeModel({ 
          model: primaryModelName,
          systemInstruction: systemPrompt 
        });
        const result = await model.generateContent({ contents });
        responseText = result.response.text();
        success = true;
        break;
      } catch (primaryError) {
        console.warn(`[Public Chat] Key #${i+1} primary model failed. Trying fallback...`);
        try {
          const model = currentGenAI.getGenerativeModel({ 
            model: fallbackModelName,
            systemInstruction: systemPrompt 
          });
          const result = await model.generateContent({ contents });
          responseText = result.response.text();
          success = true;
          break;
        } catch (fallbackError) {
          console.error(`[Public Chat] Key #${i+1} failed completely.`);
          lastError = fallbackError;
        }
      }
    }

    if (!success) {
      throw new Error(lastError?.message || "All models failed.");
    }

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("Public AI Chat Error:", error);
    return NextResponse.json({ message: "Waduh, koneksi saya sedang terganggu nih. Tapi kamu bisa langsung klik tombol daftar di bawah ya!" }, { status: 500 });
  }
}
