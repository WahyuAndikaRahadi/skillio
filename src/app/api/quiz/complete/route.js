import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { user_roadmap_id, day_number, score } = await req.json();

    if (!user_roadmap_id || !day_number) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 1. Get User Roadmap Instance
    const userRoadmap = await prisma.userRoadmap.findFirst({
      where: { id: user_roadmap_id, user_id: session.user.id }
    });

    if (!userRoadmap) return NextResponse.json({ message: "User Roadmap not found" }, { status: 404 });

    // 2. Find/Create Streak Logic
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

    // 3. Update Everything in Transaction
    // Use upsert trick for UserDayProgress by checking first
    const existingProgress = await prisma.userDayProgress.findFirst({
      where: { user_roadmap_id: userRoadmap.id, day_number: day_number }
    });

    await prisma.$transaction([
      // A. Progress
      prisma.userDayProgress.upsert({
        where: { id: existingProgress?.id || "new-record" },
        create: {
          user_roadmap_id: userRoadmap.id,
          day_number: day_number,
          quiz_passed: true,
          quiz_score: score,
          tasks_completed: true,
          completed_tasks: [],
          completed_at: new Date()
        },
        update: {
          quiz_passed: true,
          quiz_score: score,
          tasks_completed: true,
          completed_at: new Date()
        }
      }),

      // B. Increment current_day if applicable
      prisma.userRoadmap.updateMany({
        where: { id: userRoadmap.id, current_day: day_number },
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

    // 4. Invalidate Redis
    await redis.set(`user_stats:${session.user.id}`, null);

    // 5. Check for Badges (Background/Parallel)
    const { checkAndAwardBadges } = await import("@/lib/badges");
    const newBadges = await checkAndAwardBadges(session.user.id, "perfect_score", { score });
    
    const updatedUser = await prisma.user.findUnique({
       where: { id: session.user.id },
       include: { streak: true }
    });
    
    await checkAndAwardBadges(session.user.id, "streak_count", { streak: updatedUser.streak?.current_streak });
    await checkAndAwardBadges(session.user.id, "xp_count", { xp: updatedUser.xp });

    // 6. Auto-post to Social Feed
    if (score >= 80) {
      try {
        const { pusherServer } = await import("@/lib/pusher");
        const autoPost = await prisma.communityPost.create({
          data: {
            user_id: session.user.id,
            content: `Berhasil menyelesaikan materi hari ke-${day_number} dengan skor ${score}! 🚀🔥`,
            type: "achievement",
          },
          include: { user: { select: { name: true, image: true } } }
        });
        await pusherServer.trigger("community-feed", "new-post", autoPost);
      } catch (postError) {
        console.error("Auto-post failed:", postError);
      }
    }

    return NextResponse.json({ 
      message: "Quiz completed!", 
      earnedBadges: newBadges 
    });
  } catch (error) {
    console.error("Quiz complete error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
