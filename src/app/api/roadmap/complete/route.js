import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { userRoadmapId } = await req.json();
    if (!userRoadmapId) return NextResponse.json({ message: "userRoadmapId required" }, { status: 400 });

    // Verify ownership
    const userRoadmap = await prisma.userRoadmap.findFirst({
      where: { id: userRoadmapId, user_id: session.user.id },
    });
    if (!userRoadmap) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (userRoadmap.status === "completed") {
      return NextResponse.json({ message: "Already completed", alreadyDone: true });
    }

    // Mark as completed + award XP
    await prisma.$transaction([
      prisma.userRoadmap.update({
        where: { id: userRoadmapId },
        data: { status: "completed", completed_at: new Date() },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { xp: { increment: 500 } },
      }),
    ]);

    // Count completed roadmaps to check which badges to award
    const completedCount = await prisma.userRoadmap.count({
      where: { user_id: session.user.id, status: "completed" },
    });

    // --- Badge Award Logic ---
    const badgesToAward = [];

    // "Penyelesai Pertama" — first completed roadmap
    if (completedCount === 1) {
      badgesToAward.push("Penyelesai Pertama");
    }
    // "Penjelajah Ganda" — 2 roadmaps (Optional, if added to seed)
    if (completedCount === 2) {
      badgesToAward.push("Penjelajah Ganda");
    }
    // "Master Trilogi" — 3 roadmaps
    if (completedCount === 3) {
      badgesToAward.push("Master Trilogi");
    }
    // "Kuasai Dunia" — 5 roadmaps (Optional, if added to seed)
    if (completedCount === 5) {
      badgesToAward.push("Kuasai Dunia");
    }

    for (const slug of badgesToAward) {
      const badge = await prisma.badge.findFirst({ where: { name: slug } });
      if (badge) {
        const existing = await prisma.userBadge.findFirst({
          where: { user_id: session.user.id, badge_id: badge.id },
        });
        if (!existing) {
          await prisma.userBadge.create({
            data: { user_id: session.user.id, badge_id: badge.id },
          });
        }
      }
    }

    return NextResponse.json({ success: true, completedCount, badgesAwarded: badgesToAward });
  } catch (error) {
    console.error("Complete roadmap error:", error);
    return NextResponse.json({ message: "Server error", detail: error.message }, { status: 500 });
  }
}
