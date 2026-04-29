import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { userRoadmapId } = await req.json();
    if (!userRoadmapId) return NextResponse.json({ message: "userRoadmapId required" }, { status: 400 });

    const userRoadmap = await prisma.userRoadmap.findFirst({
      where: { id: userRoadmapId, user_id: session.user.id },
    });
    if (!userRoadmap) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (userRoadmap.status === "completed") {
      return NextResponse.json({ message: "Already completed", alreadyDone: true });
    }

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

    const completedCount = await prisma.userRoadmap.count({
      where: { user_id: session.user.id, status: "completed" },
    });

    const { checkAndAwardBadges } = await import("@/lib/badges");
    const awarded = await checkAndAwardBadges(session.user.id, "roadmaps_completed", { count: completedCount });

    return NextResponse.json({ success: true, completedCount, badgesAwarded: awarded });
  } catch (error) {
    console.error("Complete roadmap error:", error);
    return NextResponse.json({ message: "Server error", detail: error.message }, { status: 500 });
  }
}
