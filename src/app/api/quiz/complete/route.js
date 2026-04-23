import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { day_id, score } = await req.json();

    // 1. Get Day Details
    const day = await prisma.roadmapDay.findUnique({
      where: { id: day_id }
    });

    if (!day) return NextResponse.json({ message: "Day not found" }, { status: 404 });

    // 2. Get User Roadmap Instance
    const userRoadmap = await prisma.userRoadmap.findFirst({
      where: { user_id: session.user.id, roadmap_id: day.roadmap_id }
    });

    if (!userRoadmap) return NextResponse.json({ message: "User Roadmap not found" }, { status: 404 });

    // 3. Find/Create Streak Logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userStreak = await prisma.streak.upsert({
      where: { user_id: session.user.id },
      create: {
        user_id: session.user.id,
        current_streak: 1,
        last_active: new Date()
      },
      update: {} // Logic handled below in transaction
    });

    const lastActive = new Date(userStreak.last_active);
    lastActive.setHours(0, 0, 0, 0);

    let newStreak = userStreak.current_streak;
    const diffTime = today.getTime() - lastActive.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }

    // 4. Update Everything in Transaction
    await prisma.$transaction([
      // A. Progress
      prisma.userDayProgress.upsert({
        where: { 
          id: (await prisma.userDayProgress.findFirst({
            where: { user_roadmap_id: userRoadmap.id, day_number: day.day_number }
          }))?.id || "new-record"
        },
        create: {
          user_roadmap_id: userRoadmap.id,
          day_number: day.day_number,
          quiz_passed: true,
          quiz_score: score,
          tasks_completed: true,
          completed_tasks: []
        },
        update: {
          quiz_passed: true,
          quiz_score: score,
          tasks_completed: true
        }
      }),

      // B. Increment current_day if applicable
      prisma.userRoadmap.updateMany({
        where: { id: userRoadmap.id, current_day: day.day_number },
        data: { current_day: { increment: 1 } }
      }),

      // C. XP
      prisma.user.update({
        where: { id: session.user.id },
        data: { xp: { increment: 50 } }
      }),

      // D. Streak
      prisma.streak.update({
        where: { user_id: session.user.id },
        data: {
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, userStreak.longest_streak),
          last_active: new Date()
        }
      })
    ]);

    // 5. Invalidate Redis
    await redis.set(`user_stats:${session.user.id}`, null);

    return NextResponse.json({ message: "Quiz completed!" });
  } catch (error) {
    console.error("Quiz complete error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
