import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // 1. Get User with Streak and Badges
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        streak: true,
        badges: {
          include: {
            badge: true
          }
        },
        _count: {
          select: {
            roadmaps: {
              where: {
                is_completed: true
              }
            }
          }
        }
      }
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // 2. Format Response
    const profileData = {
      xp: user.xp || 0,
      streak: user.streak?.current_streak || 0,
      badges: user.badges || [],
      roadmapsCount: user._count.roadmaps || 0,
      joinedAt: user.createdAt || new Date(),
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("❌ Profile API error detail:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ message: "Error", detail: error.message }, { status: 500 });
  }
}
