import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const cacheKey = `user_stats:${session.user.id}`;
    
    // 1. Try Cache
    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json(cached);

    // 2. Fetch DB
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        xp: true,
        streak: {
          select: {
            current_streak: true
          }
        }
      }
    });

    const stats = {
      xp: user?.xp || 0,
      streak: user?.streak?.current_streak || 0
    };

    // 3. Save Cache (expire 5 minutes)
    await redis.set(cacheKey, stats, 300);

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching stats" }, { status: 500 });
  }
}
