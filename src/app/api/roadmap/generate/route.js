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

    // 1. Generate from AI
    const roadmapData = await generateFullRoadmap(career);

    // 2. Prepare Nested Data matching the Schema exactly
    const daysData = roadmapData.days.map((day) => ({
      day_number: day.day,
      title: day.title,
      material: day.description, // Map 'description' from AI to 'material' in Schema
      tasks: {
        create: day.tasks.map((task, idx) => ({ 
          order_number: idx + 1,
          task_text: task,
          how_to: `Panduan untuk: ${task}` // Placeholder
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

    // 3. Execution
    
    // Step A: Get/Create Category using findFirst (since name is not unique)
    const slug = career.toLowerCase().replace(/ /g, "-");
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

    // Step B: Create Roadmap + Days + Tasks + Quiz (Nested)
    const roadmap = await prisma.roadmap.create({
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
        roadmap_id: roadmap.id,
        category_id: category.id,
        status: "active",
      }
    });

    return NextResponse.json({ message: "Roadmap generated successfully", result });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json({ 
      message: "Gagal membuat roadmap", 
      error: error.message 
    }, { status: 500 });
  }
}
