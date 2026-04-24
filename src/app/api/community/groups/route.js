import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const groups = await prisma.communityGroup.findMany({
      include: {
        category: { select: { name: true } },
        _count: {
          select: { members: { where: { status: "approved" } } }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Fetch groups error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, privacy, password, categoryId, imageUrl } = body;

    if (!name || !description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    
    if (privacy === "private" && !password) {
      return NextResponse.json({ message: "Password is required for private groups" }, { status: 400 });
    }

    console.log("Creating group with data:", { name, privacy, categoryId, userId: session.user.id });

    let hashedPassword = null;
    if (privacy === "private" && password) {
       hashedPassword = await bcrypt.hash(password, 10);
    }

    // Gunakan Transaction untuk memastikan grup dan member admin dibuat bersamaan
    const group = await prisma.communityGroup.create({
      data: {
        name,
        description,
        privacy: privacy || "public",
        password: hashedPassword,
        category_id: categoryId || null,
        image_url: imageUrl || null,
        created_by: session.user.id,
        members: {
          create: {
            user_id: session.user.id,
            role: "admin",
            status: "approved"
          }
        }
      }
    });

    console.log("Group created successfully:", group.id);
    return NextResponse.json(group);
  } catch (error) {
    console.error("CRITICAL ERROR CREATE GROUP:", error);
    return NextResponse.json({ 
      message: "Gagal membuat grup", 
      error: error.message 
    }, { status: 500 });
  }
}
