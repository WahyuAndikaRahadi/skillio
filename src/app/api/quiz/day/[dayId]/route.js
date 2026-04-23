// src/app/api/quiz/day/[dayId]/route.js
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

    // 1. Try Cache
    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json(cached);

    // 2. Fetch DB
    const quizzes = await prisma.dayQuiz.findMany({
      where: { day_id: dayId },
      orderBy: { order_number: "asc" }
    });

    if (!quizzes || quizzes.length === 0) return NextResponse.json({ message: "Quiz not found" }, { status: 404 });

    // 3. Save Cache
    await redis.set(cacheKey, quizzes, 3600); // 1 hour

    return NextResponse.json(Array.isArray(quizzes) ? quizzes : [quizzes]);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
