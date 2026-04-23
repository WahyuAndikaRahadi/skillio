import { NextResponse } from "next/server";
import { analyzeCareerRecommendation } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    const { answers } = await req.json();

    if (!answers || answers.length < 30) {
      return NextResponse.json(
        { message: "Data quiz tidak lengkap" },
        { status: 400 }
      );
    }

    const analysis = await analyzeCareerRecommendation(answers);

    // Save to DB if logged in
    if (session?.user?.id) {
      await prisma.userQuizResult.create({
        data: {
          user_id: session.user.id,
          phase: 3,
          answers: answers,
          ai_summary: analysis.summary,
        }
      });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Quiz analysis error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menganalisis hasil" },
      { status: 500 }
    );
  }
}
