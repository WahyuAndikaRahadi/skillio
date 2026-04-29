import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { post_id } = await req.json();

    if (!post_id) {
      return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: post_id }
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.user_id !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.communityPost.delete({
      where: { id: post_id }
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
