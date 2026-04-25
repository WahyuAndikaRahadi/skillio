import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import prismaQuestion from "@/lib/prisma-question";
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

    // 1. Ambil/Buat Kategori secara robust (Upsert untuk handle concurrency)
    const category = await prisma.category.upsert({
      where: { slug: slug },
      update: {}, // Jangan ubah apa pun jika sudah ada
      create: {
        name: career,
        slug: slug,
        description: `Kategori untuk ${career}`,
        is_generated: true,
      },
      include: { roadmap: true }
    });

    // 2. Ambil/Buat Roadmap secara robust
    let roadmap = category.roadmap;
    if (!roadmap) {
      roadmap = await prisma.roadmap.upsert({
        where: { category_id: category.id },
        update: {},
        create: {
          category_id: category.id,
          title: `Kuasai ${career} dalam 30 Hari`,
          description: `Kurikulum untuk bidang ${career}`,
        }
      });
    }

    // 3. Jika curriculum belum ada atau masih format lama, generate pakai AI
    const isLegacy = roadmap.file_url && (roadmap.file_url.startsWith("internal://") || roadmap.file_url.startsWith("http"));
    if (!roadmap.file_url || isLegacy) {
      console.log(`[AI] Generating Roadmap for: ${career}`);
      try {
        const curriculum = await generateFullRoadmap(career);
        
        if (curriculum && curriculum.days && curriculum.days.length > 0) {
          // Simpan ke DB Utama
          roadmap = await prisma.roadmap.update({
            where: { id: roadmap.id },
            data: { file_url: JSON.stringify(curriculum) }
          });

          // SINKRONISASI: Simpan ke DB Question (agar Dashboard sinkron)
          try {
            await prismaQuestion.curriculum.upsert({
              where: { category_slug: category.slug },
              update: { content_json: curriculum },
              create: {
                category_slug: category.slug,
                content_json: curriculum
              }
            });
            console.log(`[AI] Sinkronisasi ke DB Question berhasil.`);
          } catch (qError) {
            console.error("[AI] Gagal sinkron ke DB Question:", qError.message);
          }
        }
      } catch (aiError) {
        console.error("[AI] Gagal generate kurikulum:", aiError.message);
      }
    }

    // 4. Nonaktifkan roadmap lain milik user
    await prisma.userRoadmap.updateMany({
      where: { 
        user_id: session.user.id, 
        status: "active",
        NOT: { roadmap_id: roadmap.id }
      },
      data: { status: "paused" }
    });

    // 5. Assign user ke roadmap ini (UPSERT manual karena tidak ada unique constraint majemuk)
    const existingUserRoadmap = await prisma.userRoadmap.findFirst({
      where: { user_id: session.user.id, roadmap_id: roadmap.id }
    });

    let userRoadmap;
    if (existingUserRoadmap) {
      userRoadmap = await prisma.userRoadmap.update({
        where: { id: existingUserRoadmap.id },
        data: { status: "active" }
      });
    } else {
      userRoadmap = await prisma.userRoadmap.create({
        data: {
          user_id: session.user.id,
          roadmap_id: roadmap.id,
          category_id: category.id,
          status: "active",
        }
      });
    }

    return NextResponse.json({ 
      message: "Berhasil memilih bidang belajar", 
      result: userRoadmap
    });
  } catch (error) {
    console.error("Roadmap assignment error:", error);
    return NextResponse.json({ 
      message: "Gagal memilih bidang belajar", 
      error: error.message 
    }, { status: 500 });
  }
}


