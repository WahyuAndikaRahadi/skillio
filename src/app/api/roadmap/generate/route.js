import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { generateFullRoadmap } from "@/lib/gemini";

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

    // Jika curriculum belum ada di file_url, generate pakai AI
    if (!roadmap.file_url) {
      console.log(`Generating AI Roadmap for ${career}...`);
      try {
        const curriculum = await generateFullRoadmap(career);
        
        // Simpan JSON curriculum ke file_url di main DB
        roadmap = await prisma.roadmap.update({
          where: { id: roadmap.id },
          data: {
            file_url: JSON.stringify(curriculum)
          }
        });
        console.log(`AI Roadmap for ${career} successfully saved to main DB.`);
      } catch (aiError) {
        console.error("AI Roadmap Generation Failed:", aiError);
        // Tetap lanjut meskipun AI gagal, user bisa generate ulang nanti atau admin bisa handle
      }
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
