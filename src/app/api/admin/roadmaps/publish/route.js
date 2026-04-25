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

    // 2. We can optionally flag the main database category so the Admin UI knows it's filled.
    // In our case, the Admin UI can just check the new endpoint, but let's update a dummy file_url or flag
    // to mark it as 'Terisi'. Let's just set file_url to 'internal://db2'
    await prismaMain.category.update({
      where: { slug: category_slug },
      data: {
        roadmap: {
          update: {
            file_url: "internal://question-db"
          }
        }
      }
    });

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
