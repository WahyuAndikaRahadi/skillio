import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { groupId } = resolvedParams;

    // Check if member
    const member = await prisma.groupMember.findUnique({
      where: {
        group_id_user_id: { group_id: groupId, user_id: session.user.id }
      }
    });

    if (!member || member.status !== "approved") {
      return NextResponse.json({ message: "Not a member" }, { status: 403 });
    }

    const messages = await prisma.groupMessage.findMany({
      where: { group_id: groupId },
      include: {
        user: { select: { id: true, name: true, image: true } }
      },
      orderBy: { createdAt: "asc" },
      take: 50
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { groupId } = resolvedParams;
    const { content, imageUrl, fileUrl, fileName } = await req.json();

    // Check membership
    const member = await prisma.groupMember.findUnique({
      where: {
        group_id_user_id: { group_id: groupId, user_id: session.user.id }
      }
    });

    if (!member || member.status !== "approved") {
      return NextResponse.json({ message: "Not a member" }, { status: 403 });
    }

    const message = await prisma.groupMessage.create({
      data: {
        group_id: groupId,
        user_id: session.user.id,
        content,
        image_url: imageUrl,
        file_url: fileUrl,
        file_name: fileName
      },
      include: {
        user: { select: { id: true, name: true, image: true } }
      }
    });

    // TRIGGER PUSHER
    try {
      await pusherServer.trigger(`presence-group-${groupId}`, "new-message", message);
    } catch (err) {
      console.error("Pusher error:", err);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
