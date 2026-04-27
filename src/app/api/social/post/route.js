import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { content, type = "achievement" } = await req.json();

    if (!content) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }

    const post = await prisma.communityPost.create({
      data: {
        user_id: session.user.id,
        content: content,
        type: type,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      }
    });

    // Trigger Pusher for real-time update
    await pusherServer.trigger("community-feed", "new-post", post);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Social post error:", error);
    return NextResponse.json({ message: "Server error", detail: error.message }, { status: 500 });
  }
}
