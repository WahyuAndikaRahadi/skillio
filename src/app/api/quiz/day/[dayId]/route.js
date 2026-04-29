
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { dayId } = await params;
    const cacheKey = `quiz_day:${dayId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json(cached);

    const quizzes = await prisma.dayQuiz.findMany({
      where: { day_id: dayId },
      orderBy: { order_number: "asc" }
    });

    if (!quizzes || quizzes.length === 0) return NextResponse.json({ message: "Quiz not found" }, { status: 404 });

    await redis.set(cacheKey, quizzes, 3600);

    return NextResponse.json(Array.isArray(quizzes) ? quizzes : [quizzes]);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
