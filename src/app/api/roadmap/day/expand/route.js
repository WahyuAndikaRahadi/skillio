import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateDayExpansion } from "@/lib/gemini";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { user_roadmap_id, day_number, title, material } = await req.json();

    if (!title || !material) {
      return NextResponse.json({ message: "Title and material are required" }, { status: 400 });
    }

    // 1. Find the roadmap associated with this user_roadmap
    const userRoadmap = await prisma.userRoadmap.findUnique({
      where: { id: user_roadmap_id },
      include: { roadmap: true, category: true }
    });

    if (!userRoadmap || !userRoadmap.roadmap) {
      return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
    }

    const roadmap = userRoadmap.roadmap;
    let curriculum = null;
    try {
      curriculum = JSON.parse(roadmap.file_url);
    } catch (e) {
      console.error("Invalid curriculum JSON");
    }

    // 2. Check if expansion already exists in the JSON
    if (curriculum && curriculum.days) {
      const dayIndex = curriculum.days.findIndex(d => (d.day_number === day_number || d.day === day_number));
      if (dayIndex !== -1 && curriculum.days[dayIndex].expansion) {
        console.log(`[AI Cache] Using cached expansion for Day ${day_number}`);
        return NextResponse.json(curriculum.days[dayIndex].expansion);
      }
    }

    // 3. Generate expansion if not found
    console.log(`[AI] Generating expansion for Day ${day_number}: ${title}`);
    const expandedContent = await generateDayExpansion(day_number, title, material);

    // 4. Save expansion back to the curriculum JSON for future use (Global Cache)
    if (curriculum && curriculum.days) {
      const dayIndex = curriculum.days.findIndex(d => (d.day_number === day_number || d.day === day_number));
      if (dayIndex !== -1) {
        curriculum.days[dayIndex].expansion = expandedContent;
        
        const updatedJson = JSON.stringify(curriculum);

        // Update Main DB
        await prisma.roadmap.update({
          where: { id: roadmap.id },
          data: { file_url: updatedJson }
        });
      }
    }

    return NextResponse.json(expandedContent);
  } catch (error) {
    console.error("AI Expansion Error:", error);
    return NextResponse.json({ message: "Gagal generate materi" }, { status: 500 });
  }
}
