import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        streak: true,
        badges: { include: { badge: true }, orderBy: { earned_at: "desc" } },
        _count: { select: { roadmaps: { where: { status: "completed" } } } },
      },
    });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Completed roadmaps with full detail for profile
    const completedRoadmaps = await prisma.userRoadmap.findMany({
      where: { user_id: session.user.id, status: "completed" },
      orderBy: { completed_at: "desc" },
      include: { category: true },
    });

    // All badges in the system
    const allBadges = await prisma.badge.findMany({ orderBy: { name: "asc" } });
    const earnedBadgeIds = new Set(user.badges.map((ub) => ub.badge_id));

    const badgesWithStatus = allBadges.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      image_url: badge.image_url,
      type: badge.type,
      earned: earnedBadgeIds.has(badge.id),
      earned_at: user.badges.find((ub) => ub.badge_id === badge.id)?.earned_at ?? null,
    }));

    // Global rank by XP
    const higherXpCount = await prisma.user.count({ where: { xp: { gt: user.xp } } });

    return NextResponse.json({
      xp: user.xp || 0,
      streak: user.streak?.current_streak || 0,
      badges: badgesWithStatus,
      roadmapsCount: user._count.roadmaps || 0,
      completedRoadmaps: completedRoadmaps.map((r) => ({
        id: r.id,
        categoryName: r.category.name,
        categorySlug: r.category.slug,
        completedAt: r.completed_at?.toISOString() ?? r.started_at.toISOString(),
      })),
      joinedAt: user.createdAt,
      rank: higherXpCount + 1,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ message: "Error", detail: error.message }, { status: 500 });
  }
}
