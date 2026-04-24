import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ message: "Pesan kosong" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
      Anda adalah "Skillio Mentor", asisten virtual yang cerdas dan ramah di halaman depan aplikasi web "Skillio".
      Skillio adalah platform EdTech tempat anak muda Indonesia menemukan passion mereka dan belajar skill digital (seperti UI/UX, Web Dev, Digital Marketing) dalam 30 hari secara terstruktur dengan bantuan AI.
      
      Tugas Anda:
      1. Menjawab pertanyaan atau sapaan pengunjung dengan singkat, ceria, dan antusias.
      2. Maksimal panjang jawaban adalah 2-3 kalimat pendek saja (sangat penting agar UI chat tidak penuh).
      3. Di akhir jawaban, SELALU ajak mereka secara halus untuk mendaftar/login ("Yuk daftar sekarang!", "Login yuk buat cari tahu potensimu!", dll).
      4. Jangan berikan jawaban teknis panjang lebar. Arahkan mereka untuk login jika ingin sesi mentoring sungguhan.
      
      Pengunjung berkata: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("Public AI Chat Error:", error);
    return NextResponse.json({ message: "Waduh, koneksi saya sedang terganggu nih. Tapi kamu bisa langsung klik tombol daftar di bawah ya!" }, { status: 500 });
  }
}
