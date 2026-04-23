import { NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { phase, answers } = await req.json();

    if (!phase || !answers) {
      return NextResponse.json(
        { message: "Phase and answers are required" },
        { status: 400 }
      );
    }

    // Convert answers to a string context for Gemini
    const context = answers
      .map((a) => `Q: ${a.question} -> A: ${a.answer}`)
      .join("\n");

    const questions = await generateQuizQuestions(context, phase);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Quiz generation error detail:", {
      message: error.message,
      stack: error.stack,
      phase: req.phase
    });
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat soal AI", error: error.message },
      { status: 500 }
    );
  }
}
