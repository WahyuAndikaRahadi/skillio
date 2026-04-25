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

    // Slug generation consistent with seed.js
    const slug = career.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Cari Kategori berdasarkan nama atau slug
    let category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: slug },
          { name: { contains: career, mode: "insensitive" } }
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

    // Jika curriculum belum ada atau masih menggunakan format lama (internal:// atau http), generate pakai AI
    const isLegacy = roadmap.file_url && (roadmap.file_url.startsWith("internal://") || roadmap.file_url.startsWith("http"));
    if (!roadmap.file_url || isLegacy) {
      console.log(`Generating AI Roadmap for ${career}...`);
      try {
        const curriculum = await generateFullRoadmap(career);
        
        if (curriculum && Object.keys(curriculum).length > 0) {
          // Simpan JSON curriculum ke file_url di main DB
          roadmap = await prisma.roadmap.update({
            where: { id: roadmap.id },
            data: {
              file_url: JSON.stringify(curriculum)
            }
          });
          console.log(`AI Roadmap for ${career} successfully saved to main DB.`);
        } else {
          console.error("AI Roadmap for", career, "returned empty data.");
        }
      } catch (aiError) {
        console.error("AI Roadmap Generation Failed for", career, ":", aiError.message);
      }
    }

    // 1. Nonaktifkan semua roadmap lain
    await prisma.userRoadmap.updateMany({
      where: { 
        user_id: session.user.id, 
        status: "active",
        NOT: { roadmap_id: roadmap.id } // Kecuali yang sedang dipilih
      },
      data: { status: "paused" }
    });

    // 2. Gunakan UPSERT: Jika sudah ada, aktifkan. Jika belum, buat baru.
    const userRoadmap = await prisma.userRoadmap.upsert({
      where: {
        // Kita butuh unique constraint untuk upsert. Karena UserRoadmap tidak punya @unique di (user_id, roadmap_id),
        // kita cari manual dulu atau gunakan findFirst.
        id: (await prisma.userRoadmap.findFirst({
          where: { user_id: session.user.id, roadmap_id: roadmap.id }
        }))?.id || "new-record"
      },
      update: { status: "active" },
      create: {
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

