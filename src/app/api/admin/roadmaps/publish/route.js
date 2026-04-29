import { NextResponse } from "next/server";
import { auth } from "@/auth";
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

    const category = await prismaMain.category.findUnique({ where: { slug: category_slug } });
    if (!category) {
      return NextResponse.json({ message: "Kategori tidak ditemukan di database utama" }, { status: 404 });
    }

    const savedRoadmap = await prismaMain.roadmap.upsert({
      where: { category_id: category.id },
      update: { file_url: JSON.stringify(content_json) },
      create: {
        category_id: category.id,
        title: `Kurikulum ${category.name}`,
        description: `Kurikulum 30 hari untuk bidang ${category.name}`,
        file_url: JSON.stringify(content_json)
      }
    });

    return NextResponse.json({
      message: "Kurikulum berhasil disimpan ke Database Utama!",
      data: savedRoadmap
    });
  } catch (error) {
    console.error("Publish Curriculum Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menyimpan", error: error.message },
      { status: 500 }
    );
  }
}
