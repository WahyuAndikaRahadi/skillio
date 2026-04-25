import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateDayExpansion } from "@/lib/gemini";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { day_number, title, material } = await req.json();

    if (!title || !material) {
      return NextResponse.json({ message: "Title and material are required" }, { status: 400 });
    }

    // Pass the text to Gemini to generate expansion
    const expandedContent = await generateDayExpansion(title, material);

    return NextResponse.json(expandedContent);
  } catch (error) {
    console.error("AI Expansion Error:", error);
    return NextResponse.json({ message: "Gagal generate materi" }, { status: 500 });
  }
}
