import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prismaMain from "@/lib/prisma";
import { generateFullRoadmap } from "@/lib/gemini";

async function generateAndSaveCurriculum(categorySlug, categoryName, roadmapId) {
  console.log(`[AI] Memulai generate kurikulum untuk: ${categoryName}`);
  
  try {
    const curriculum = await generateFullRoadmap(categoryName);
    
    // Simpan hasil JSON ke database utama (tabel Roadmap)
    await prismaMain.roadmap.update({
      where: { id: roadmapId },
      data: {
        file_url: JSON.stringify(curriculum)
      }
    });

    return curriculum;
  } catch (error) {
    console.error("[AI] Error generate kurikulum:", error);
    throw error;
  }
}

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

    // 1. Ambil data kategori dan roadmap-nya dari DB Utama
    const category = await prismaMain.category.findUnique({
      where: { slug },
      include: { roadmap: true }
    });

    if (!category) {
      return NextResponse.json({ message: "Kategori tidak ditemukan." }, { status: 404 });
    }

    let roadmap = category.roadmap;

    // 2. Jika Roadmap belum ada di database, buat record-nya dulu
    if (!roadmap) {
      roadmap = await prismaMain.roadmap.create({
        data: {
          category_id: category.id,
          title: `Kurikulum ${category.name}`,
          description: `Kurikulum 30 hari untuk bidang ${category.name}`,
        }
      });
    }

    // 3. Cek apakah kurikulum (JSON) sudah ada di kolom file_url DB Utama
    if (roadmap.file_url && !roadmap.file_url.startsWith("internal://") && !roadmap.file_url.startsWith("http")) {
      try {
        const parsedData = JSON.parse(roadmap.file_url);
        return NextResponse.json({ message: "Success", data: parsedData });
      } catch (e) {
        console.error("Gagal parsing JSON, generate ulang...");
      }
    }

    // 4. Jika kurikulum kosong, Auto-Generate menggunakan AI
    console.log(`Kurikulum "${category.name}" kosong. Generating via AI...`);
    
    try {
      const generatedData = await generateAndSaveCurriculum(slug, category.name, roadmap.id);
      return NextResponse.json({ message: "Success", data: generatedData });
    } catch (genError) {
      return NextResponse.json({ 
        message: "Kurikulum sedang disiapkan oleh AI, silakan muat ulang halaman dalam beberapa saat.", 
        error: genError.message 
      }, { status: 503 });
    }

  } catch (error) {
    console.error("Fetch Curriculum Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada sistem", error: error.message },
      { status: 500 }
    );
  }
}

