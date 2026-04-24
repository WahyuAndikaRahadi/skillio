import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { post_id, content, parent_id } = await req.json();

    if (!content) return NextResponse.json({ message: "Content is required" }, { status: 400 });

    const comment = await prisma.postComment.create({
      data: {
        post_id,
        user_id: session.user.id,
        content,
        parent_id: parent_id || null,
      },
      include: {
        user: { select: { name: true, image: true } },
      }
    });

    // TRIGGER PUSHER: New comment added
    try {
      await pusherServer.trigger(`post-${post_id}`, "new-comment", comment);
    } catch (err) {
      console.error("Pusher error:", err);
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
