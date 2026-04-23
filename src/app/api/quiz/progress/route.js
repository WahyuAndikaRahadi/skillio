import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// GET progress (Resume)
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const progress = await prisma.userQuizProgress.findUnique({
      where: { user_id: session.user.id }
    });

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil progres" }, { status: 500 });
  }
}

// POST progress (Save)
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { current_phase, current_index, answers, ai_questions } = await req.json();

    const progress = await prisma.userQuizProgress.upsert({
      where: { user_id: session.user.id },
      update: {
        current_phase,
        current_index,
        answers,
        ai_questions,
      },
      create: {
        user_id: session.user.id,
        current_phase,
        current_index,
        answers,
        ai_questions,
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Save progress error:", error);
    return NextResponse.json({ message: "Gagal menyimpan progres" }, { status: 500 });
  }
}

// DELETE progress (Clear when finished)
export async function DELETE() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.userQuizProgress.deleteMany({
      where: { user_id: session.user.id }
    });

    return NextResponse.json({ message: "Progres dibersihkan" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus progres" }, { status: 500 });
  }
}
