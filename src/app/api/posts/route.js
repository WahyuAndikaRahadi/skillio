import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const posts = await prisma.communityPost.findMany({
      where: categoryId ? { category_id: categoryId } : {},
      include: {
        user: { select: { id: true, name: true, image: true, role: true } },
        category: { select: { id: true, name: true, icon: true } },
        comments: {
          where: { parent_id: null },
          include: {
            user: { select: { name: true, image: true, role: true } },
            replies: {
              include: {
                user: { select: { name: true, image: true, role: true } }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        likes: {
          select: { user_id: true }
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { content, type, categoryId, imageUrl } = await req.json();

    if (!content) return NextResponse.json({ message: "Content is required" }, { status: 400 });

    const post = await prisma.communityPost.create({
      data: {
        user_id: session.user.id,
        content,
        type: type || "question",
        category_id: categoryId,
        image_url: imageUrl,
      },
      include: {
        user: { select: { name: true, image: true, role: true } },
      }
    });

    try {
      await pusherServer.trigger("community-feed", "new-post", post);
    } catch (pusherError) {
      console.error("Pusher trigger failed:", pusherError);
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
