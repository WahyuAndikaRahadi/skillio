import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    const session = await auth();
    const targetId = userId || session?.user?.id;
    
    if (!targetId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: targetId },
      select: { name: true, image: true }
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // 1. Get all available badges
    const allBadges = await prisma.badge.findMany({
      orderBy: { name: 'asc' }
    });

    // 2. Get user's earned badges
    const userBadges = await prisma.userBadge.findMany({
      where: { user_id: targetId },
      select: { badge_id: true }
    });

    const earnedBadgeIds = userBadges.map(ub => ub.badge_id);

    // 3. Get completed roadmaps as certificates
    const completedRoadmaps = await prisma.userRoadmap.findMany({
      where: { 
        user_id: targetId,
        status: "completed"
      },
      include: {
        category: { select: { name: true, icon: true } },
        roadmap: { select: { title: true } }
      }
    });

    return NextResponse.json({
      user,
      allBadges,
      earnedBadgeIds,
      completedRoadmaps,
      isOwnProfile: session?.user?.id === targetId
    });

  } catch (error) {
    console.error("Badges API error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
