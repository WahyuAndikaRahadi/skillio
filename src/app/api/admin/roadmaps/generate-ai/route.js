import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY4);

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { category } = await req.json();
    if (!category) {
      return NextResponse.json({ message: "Kategori wajib diisi" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
Anda adalah seorang ahli pembuat kurikulum profesional dan instruktur senior di bidang teknologi digital.
Tugas Anda adalah merancang kurikulum komprehensif 30 HARI PENUH secara berurutan untuk bidang: "${category}".

SANGAT KRITIKAL DAN WAJIB DIPATUHI:
1. Anda WAJIB menghasilkan data lengkap untuk 30 HARI tanpa henti. DILARANG KERAS berhenti di tengah jalan (misal hanya sampai hari 15 atau 20).
2. Output HARUS murni berupa objek JSON yang valid. Jangan tambahkan teks markdown seperti \`\`\`json.
3. Setiap hari wajib memiliki tepat 5 soal kuis (Pilihan Ganda).
4. JANGAN menggunakan placeholder seperti "

FORMAT JSON YANG DIHARAPKAN:
{
  "career": "${category}",
  "days": [
    {
      "day": 1,
      "title": "Judul Materi",
      "description": "Penjelasan materi ringkas namun padat.",
      "tasks": ["Tugas 1", "Tugas 2"],
      "quizzes": [
        {
          "question": "Pertanyaan teknis/analitis...",
          "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
          "correct_option": "Opsi A",
          "explanation": "Penjelasan mengapa opsi tersebut benar."
        }
      ]
    }
  ]
}

Sekali lagi: TULIS SEMUA HARI DARI 1 SAMPAI 30 SECARA LENGKAP DALAM SATU OUTPUT JSON INI.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("AI returned invalid JSON:", cleanJson.substring(0, 500) + "...");
      return NextResponse.json({ message: "AI gagal menghasilkan format JSON yang valid. Silakan coba lagi." }, { status: 500 });
    }

    return NextResponse.json({
      message: "Berhasil generate kurikulum",
      data: parsedData
    });
  } catch (error) {
    console.error("Generate AI Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada sistem AI", error: error.message },
      { status: 500 }
    );
  }
}
