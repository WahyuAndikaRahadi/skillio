import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prismaQuestion from "@/lib/prisma-question";
import prismaMain from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { category_slug, content_json } = await req.json();

    if (!category_slug || !content_json) {
      return NextResponse.json({ message: "Slug dan content JSON wajib diisi" }, { status: 400 });
    }

    // 1. Save to the Secondary Database (Questions DB)
    const savedCurriculum = await prismaQuestion.curriculum.upsert({
      where: { category_slug },
      update: { content_json },
      create: {
        category_slug,
        content_json
      }
    });

    // 2. Find the category in main DB to get its ID, then upsert its Roadmap record.
    // This handles the case where the Category exists but has no linked Roadmap row yet.
    const category = await prismaMain.category.findUnique({ where: { slug: category_slug } });
    if (category) {
      await prismaMain.roadmap.upsert({
        where: { category_id: category.id },
        update: { file_url: "internal://question-db" },
        create: {
          category_id: category.id,
          title: `Kurikulum ${category.name}`,
          description: `Kurikulum 30 hari untuk bidang ${category.name}`,
          file_url: "internal://question-db"
        }
      });
    }

    return NextResponse.json({
      message: "Kurikulum berhasil disimpan ke Database Soal!",
      data: savedCurriculum
    });
  } catch (error) {
    console.error("Publish Curriculum Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menyimpan", error: error.message },
      { status: 500 }
    );
  }
}
