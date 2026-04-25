import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prismaMain from "@/lib/prisma";
import prismaQuestion from "@/lib/prisma-question";
import { generateFullRoadmap } from "@/lib/gemini";

async function generateAndSaveCurriculum(categorySlug, categoryName, roadmapId) {
  console.log(`[AI] Memulai generate kurikulum untuk: ${categoryName}`);
  
  try {
    const curriculum = await generateFullRoadmap(categoryName);
    
    if (!curriculum || !curriculum.days || curriculum.days.length < 25) {
      throw new Error("AI gagal menghasilkan kurikulum yang lengkap (kurang dari 25 hari)");
    }

    // 1. Simpan ke database utama (tabel Roadmap)
    await prismaMain.roadmap.update({
      where: { id: roadmapId },
      data: {
        file_url: JSON.stringify(curriculum)
      }
    });

    // 2. Simpan ke database kurikulum (tabel Curriculum) agar sinkron dengan Dashboard
    try {
      await prismaQuestion.curriculum.upsert({
        where: { category_slug: categorySlug },
        update: { content_json: curriculum },
        create: {
          category_slug: categorySlug,
          content_json: curriculum
        }
      });
      console.log(`[AI] Kurikulum berhasil disinkronkan ke DB Question.`);
    } catch (qError) {
      console.error("[AI] Gagal simpan ke DB Question:", qError.message);
    }

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

    // 3. PRIORITAS: Cek di DB Question dulu (sinkron dengan Dashboard)
    try {
      const qCurriculum = await prismaQuestion.curriculum.findUnique({
        where: { category_slug: slug }
      });
      if (qCurriculum && qCurriculum.content_json) {
        return NextResponse.json({ message: "Success", data: qCurriculum.content_json });
      }
    } catch (e) {
      console.warn("Gagal fetch dari DB Question, mencoba DB Utama...");
    }

    // 4. FALLBACK: Cek apakah kurikulum (JSON) ada di kolom file_url DB Utama
    const isLegacy = roadmap.file_url && (roadmap.file_url.startsWith("internal://") || roadmap.file_url.startsWith("http"));
    if (roadmap.file_url && !isLegacy) {
      try {
        const parsedData = JSON.parse(roadmap.file_url);
        
        // Sync ke DB Question di background jika belum ada
        prismaQuestion.curriculum.upsert({
          where: { category_slug: slug },
          update: { content_json: parsedData },
          create: { category_slug: slug, content_json: parsedData }
        }).catch(err => console.warn("Background sync failed:", err.message));

        return NextResponse.json({ message: "Success", data: parsedData });
      } catch (e) {
        console.error("Gagal parsing JSON, generate ulang...");
      }
    }

    // 5. Jika kurikulum kosong di kedua tempat, Auto-Generate menggunakan AI
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


