import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // 1. Get all available badges
    const allBadges = await prisma.badge.findMany({
      orderBy: { name: 'asc' }
    });

    // 2. Get user's earned badges
    const userBadges = await prisma.userBadge.findMany({
      where: { user_id: session.user.id },
      select: { badge_id: true }
    });

    const earnedBadgeIds = userBadges.map(ub => ub.badge_id);

    return NextResponse.json({
      allBadges,
      earnedBadgeIds
    });
  } catch (error) {
    console.error("Badges API error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
