import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { categoryId, fileUrl } = await req.json();

    if (!categoryId || !fileUrl) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    const updatedRoadmap = await prisma.roadmap.upsert({
      where: { category_id: categoryId },
      update: {
        file_url: fileUrl,
      },
      create: {
        category_id: categoryId,
        title: `Kuasai ${category.name} dalam 30 Hari`,
        description: `Kurikulum komprehensif untuk bidang ${category.name}`,
        file_url: fileUrl,
      }
    });

    return NextResponse.json(updatedRoadmap);
  } catch (error) {
    console.error("Update roadmap error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
