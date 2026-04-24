import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ message: "Image URL required" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl }
    });

    return NextResponse.json({ message: "Profile picture updated successfully", user });
  } catch (error) {
    console.error("Update image error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
