import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { career } = await req.json();
    if (!career) return NextResponse.json({ message: "Career is required" }, { status: 400 });

    const slug = career.toLowerCase().replace(/ /g, "-");

    // Cari Kategori berdasarkan nama atau slug
    let category = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { contains: career, mode: "insensitive" } },
          { slug: slug }
        ]
      },
      include: { roadmap: true }
    });

    // Jika Kategori belum ada (seharusnya 50 kategori sudah di-seed), buat sementara
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: career,
          slug: slug,
          description: `Kategori untuk ${career}`,
          is_generated: true,
          roadmap: {
            create: {
              title: `Kuasai ${career} dalam 30 Hari`,
              description: `Kurikulum untuk bidang ${career}`,
            }
          }
        },
        include: { roadmap: true }
      });
    }

    // Pastikan Roadmap ada untuk Kategori tersebut
    let roadmap = category.roadmap;
    if (!roadmap) {
      roadmap = await prisma.roadmap.create({
        data: {
          category_id: category.id,
          title: `Kuasai ${career} dalam 30 Hari`,
          description: `Kurikulum untuk bidang ${career}`,
        }
      });
    }

    // Assign User ke Roadmap ini
    const userRoadmap = await prisma.userRoadmap.create({
      data: {
        user_id: session.user.id,
        roadmap_id: roadmap.id,
        category_id: category.id,
        status: "active",
      }
    });

    return NextResponse.json({ 
      message: "Berhasil memilih bidang belajar", 
      result: userRoadmap,
      is_reused: true 
    });
  } catch (error) {
    console.error("Roadmap assignment error:", error);
    return NextResponse.json({ 
      message: "Gagal memilih bidang belajar", 
      error: error.message 
    }, { status: 500 });
  }
}
