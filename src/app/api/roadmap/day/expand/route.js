import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateDayExpansion } from "@/lib/gemini";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { day_id } = await req.json();
    if (!day_id) return NextResponse.json({ message: "Day ID is required" }, { status: 400 });

    // 1. Check if already expanded in DB
    const day = await prisma.roadmapDay.findUnique({
      where: { id: day_id }
    });

    if (!day) return NextResponse.json({ message: "Day not found" }, { status: 404 });

    if (day.ai_expanded_content) {
      return NextResponse.json(day.ai_expanded_content);
    }

    // 2. Generate with AI
    const expandedContent = await generateDayExpansion(day.title, day.material);

    // 3. Save to DB
    await prisma.roadmapDay.update({
      where: { id: day_id },
      data: { ai_expanded_content: expandedContent }
    });

    return NextResponse.json(expandedContent);
  } catch (error) {
    console.error("Day expansion error:", error);
    return NextResponse.json({ message: "Gagal memproses materi AI" }, { status: 500 });
  }
}
