import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const mammoth = require("mammoth");
const xlsx = require("xlsx");

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY4
].filter(Boolean);

const genAI = new GoogleGenerativeAI(API_KEYS[Math.floor(Math.random() * API_KEYS.length)] || process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { message, files, history = [] } = await req.json();

    if (!message && (!files || files.length === 0)) {
      return NextResponse.json({ message: "Pesan kosong" }, { status: 400 });
    }

    const userRoadmap = await prisma.userRoadmap.findFirst({
      where: { user_id: session.user.id, status: "active" },
      include: { category: true }
    });

    const userField = userRoadmap ? userRoadmap.category.name : "Eksplorasi Umum";

    const systemPrompt = `
      Anda adalah "Skillio Mentor", seorang pakar profesional dan mentor tingkat senior di divisi/bidang: ${userField}.
      Pengguna ini adalah murid Anda yang sedang belajar di bidang tersebut.

      Aturan Menjawab:
      1. Berikan jawaban yang sangat ahli, teknis jika diperlukan, namun tetap mudah dipahami.
      2. Anda memiliki ingatan percakapan (stateful). Anda dapat mengingat riwayat chat sebelumnya.
      3. Gunakan bahasa Indonesia yang asyik, suportif, dan profesional ala mentor startup.
      4. Jawab langsung ke intinya, hindari basa-basi berlebihan.
      5. Jika pengguna melampirkan file atau gambar, pastikan Anda meninjau (review) isinya dan menjawab pertanyaan mereka berdasarkan isi file tersebut.
      6. JANGAN gunakan format markdown (seperti **bold** atau ## header) agar teks tetap bersih di UI chat. Gunakan teks polos dengan spasi paragraf yang baik.
    `;

    let finalPromptText = message || "";
    const parts = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const mimeType = file.type;
        const filename = file.name.toLowerCase();

        if (mimeType.includes("wordprocessingml") || filename.endsWith(".docx")) {
          try {
            const buffer = Buffer.from(file.base64, "base64");
            const result = await mammoth.extractRawText({ buffer });
            finalPromptText += `\n\n[Isi Teks dari Dokumen Word "${file.name}":]\n${result.value}\n`;
          } catch (e) {
            console.error("Gagal membaca Word doc:", e);
          }
        }

        else if (mimeType.includes("spreadsheetml") || mimeType.includes("ms-excel") || filename.endsWith(".xlsx") || filename.endsWith(".xls") || filename.endsWith(".csv")) {
          try {
            const buffer = Buffer.from(file.base64, "base64");
            const workbook = xlsx.read(buffer, { type: "buffer" });
            let text = "";
            workbook.SheetNames.forEach(sheetName => {
              const sheet = workbook.Sheets[sheetName];
              const csv = xlsx.utils.sheet_to_csv(sheet);
              text += `--- Sheet: ${sheetName} ---\n${csv}\n\n`;
            });
            finalPromptText += `\n\n[Isi Data dari Spreadsheet "${file.name}":]\n${text}\n`;
          } catch (e) {
            console.error("Gagal membaca Excel/CSV:", e);
          }
        }

        else if (mimeType === "text/plain") {
          try {
            const text = Buffer.from(file.base64, "base64").toString("utf-8");
            finalPromptText += `\n\n[Isi Teks dari File "${file.name}":]\n${text}\n`;
          } catch (e) {
            console.error("Gagal membaca file teks:", e);
          }
        }

        else {
          parts.push({
            inlineData: {
              data: file.base64,
              mimeType: file.type
            }
          });
        }
      }
    }

    if (finalPromptText) {
      parts.unshift({ text: finalPromptText });
    }

    const contents = [];

    for (const msg of history) {

      if (msg.role === "ai" && msg.content.includes("Halo! Aku Skillio Mentor")) continue;

      contents.push({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content || "" }]
      });
    }

    contents.push({
      role: "user",
      parts: parts
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
        console.warn(`[AI Widget] Primary Model failed on Key #${i+1}. Trying fallback...`);

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
          console.error(`[AI Widget] Key #${i+1} failed completely:`, fallbackError.message);
          lastError = fallbackError;

        }
      }
    }

    if (!success) {
      throw new Error(lastError?.message || "Semua model dan API key gagal.");
    }

    const enrichedPrompt = finalPromptText;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const logId = `log_${session.user.id}_${today.getTime()}`;

      await prisma.aiMentorLog.upsert({
        where: { id: logId },
        create: {
          id: logId,
          user_id: session.user.id,
          date: today,
          count: 1
        },
        update: {
          count: { increment: 1 }
        }
      });
    } catch (logError) {
      console.log("Log error ignored:", logError.message);
    }

    return NextResponse.json({ reply: responseText, enrichedPrompt });
  } catch (error) {
    console.error("AI Chat Error:", error);
    try {
      require("fs").writeFileSync("error.log", error.stack || error.message);
    } catch (e) {}
    return NextResponse.json({ message: "Maaf, AI Mentor sedang sibuk. Coba lagi nanti. Error details: " + error.message }, { status: 500 });
  }
}
