import { NextResponse } from "next/server";
import prismaQuestion from "@/lib/prisma-question";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ message: "Slug kategori wajib disertakan" }, { status: 400 });
    }

    const curriculum = await prismaQuestion.curriculum.findUnique({
      where: { category_slug: slug }
    });

    if (!curriculum) {
      return NextResponse.json({ message: "Kurikulum belum tersedia untuk bidang ini." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Success",
      data: curriculum.content_json
    });
  } catch (error) {
    console.error("Fetch Curriculum Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada sistem", error: error.message },
      { status: 500 }
    );
  }
}
