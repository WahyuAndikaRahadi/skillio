import { NextResponse } from "next/server";
import { generateFullRoadmap } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { career } = await req.json();
    if (!career) return NextResponse.json({ message: "Career is required" }, { status: 400 });

    const slug = career.toLowerCase().replace(/ /g, "-");

    // 1. SMART REUSE: Check if a similar Roadmap already exists
    // We check for exact title match or same slug category
    const existingRoadmap = await prisma.roadmap.findFirst({
      where: {
        OR: [
          { title: { contains: career, mode: "insensitive" } },
          { category: { slug: slug } }
        ]
      },
      include: { category: true }
    });

    if (existingRoadmap) {
      console.log(`♻️ Reusing existing roadmap for: ${career}`);
      
      // Link this existing roadmap to the current user
      const userRoadmap = await prisma.userRoadmap.create({
        data: {
          user_id: session.user.id,
          roadmap_id: existingRoadmap.id,
          category_id: existingRoadmap.category_id,
          status: "active",
        }
      });

      return NextResponse.json({ 
        message: "Roadmap reused successfully", 
        result: userRoadmap,
        is_reused: true 
      });
    }

    // 2. GENERATE NEW: Only if no roadmap exists
    console.log(`✨ Generating NEW roadmap for: ${career}`);
    const roadmapData = await generateFullRoadmap(career);

    // Prepare Nested Data
    const daysData = roadmapData.days.map((day) => ({
      day_number: day.day,
      title: day.title,
      material: day.description,
      tasks: {
        create: day.tasks.map((task, idx) => ({ 
          order_number: idx + 1,
          task_text: task,
          how_to: `Panduan untuk: ${task}` 
        }))
      },
      quizzes: {
        create: (day.quizzes || []).map((q, qIdx) => ({
          order_number: qIdx + 1,
          question_text: q.question,
          options: q.options,
          correct_option: q.correct_option,
          explanation: q.explanation || "Jawaban yang benar berdasarkan materi hari ini."
        }))
      }
    }));

    // Step A: Category
    let category = await prisma.category.findFirst({ 
      where: { OR: [{ name: career }, { slug: slug }] } 
    });

    if (!category) {
      category = await prisma.category.create({ 
        data: { 
          name: career, 
          slug: slug,
          description: `Roadmap pengembangan karier untuk ${career}`,
          is_generated: true
        } 
      });
    }

    // Step B: Create Roadmap
    const newRoadmap = await prisma.roadmap.create({
      data: {
        category_id: category.id,
        title: `Kuasai ${career} dalam 30 Hari`,
        description: (roadmapData.weeks || []).map(w => `Minggu ${w.week}: ${w.theme}`).join(". "),
        days: {
          create: daysData
        }
      }
    });

    // Step C: Link to User
    const result = await prisma.userRoadmap.create({
      data: {
        user_id: session.user.id,
        roadmap_id: newRoadmap.id,
        category_id: category.id,
        status: "active",
      }
    });

    return NextResponse.json({ 
      message: "Roadmap generated successfully", 
      result,
      is_reused: false 
    });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json({ 
      message: "Gagal membuat roadmap", 
      error: error.message 
    }, { status: 500 });
  }
}
