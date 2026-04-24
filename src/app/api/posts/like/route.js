import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { post_id } = await req.json();

    // 1. Check if already liked
    const existingLike = await prisma.postLike.findUnique({
      where: {
        post_id_user_id: {
          post_id,
          user_id: session.user.id
        }
      }
    });

    let action = "";
    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.postLike.delete({ where: { id: existingLike.id } }),
        prisma.communityPost.update({
          where: { id: post_id },
          data: { likes_count: { decrement: 1 } }
        })
      ]);
      action = "unlike";
    } else {
      // Like
      await prisma.$transaction([
        prisma.postLike.create({
          data: { post_id, user_id: session.user.id }
        }),
        prisma.communityPost.update({
          where: { id: post_id },
          data: { likes_count: { increment: 1 } }
        })
      ]);
      action = "like";
    }

    // TRIGGER PUSHER: Like count changed
    const updatedPost = await prisma.communityPost.findUnique({
      where: { id: post_id },
      select: { likes_count: true }
    });

    try {
      await pusherServer.trigger(`post-${post_id}`, "like-update", {
        likes_count: updatedPost.likes_count,
        user_id: session.user.id,
        action
      });
    } catch (err) {
      console.error("Pusher error:", err);
    }

    return NextResponse.json({ success: true, action, likes_count: updatedPost.likes_count });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
