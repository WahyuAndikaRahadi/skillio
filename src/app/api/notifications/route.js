import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { user_id: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20 // Fetch last 20 notifications
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, action } = await req.json();

    if (action === "mark_read") {
      if (id === "all") {
        await prisma.notification.updateMany({
          where: { user_id: session.user.id, is_read: false },
          data: { is_read: true }
        });
      } else {
        await prisma.notification.update({
          where: { id: id, user_id: session.user.id },
          data: { is_read: true }
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update notifications error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
