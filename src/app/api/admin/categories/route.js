import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        roadmap: true
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching categories" }, { status: 500 });
  }
}
