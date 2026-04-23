import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      console.log("Task Toggle: Unauthorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { user_roadmap_id, day_number, task_id } = body;
    
    if (!user_roadmap_id || !day_number || !task_id) {
      console.log("Task Toggle: Missing data", { user_roadmap_id, day_number, task_id });
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    // 1. Get current progress for this day
    let progress = await prisma.userDayProgress.findFirst({
      where: { 
        user_roadmap_id: user_roadmap_id, 
        day_number: parseInt(day_number) 
      }
    });

    let newCompleted = [];

    if (!progress) {
      console.log("Task Toggle: Creating new progress for day", day_number);
      newCompleted = [task_id];
      progress = await prisma.userDayProgress.create({
        data: {
          user_roadmap_id,
          day_number: parseInt(day_number),
          completed_tasks: newCompleted,
          tasks_completed: false,
          quiz_passed: false
        }
      });
    } else {
      // Toggle task_id in completed_tasks
      const completed = Array.isArray(progress.completed_tasks) ? progress.completed_tasks : [];
      newCompleted = completed.includes(task_id)
        ? completed.filter(id => id !== task_id)
        : [...completed, task_id];

      console.log("Task Toggle: Updating progress", { id: progress.id, newCount: newCompleted.length });
      
      progress = await prisma.userDayProgress.update({
        where: { id: progress.id },
        data: { completed_tasks: newCompleted }
      });
    }

    return NextResponse.json({ 
      message: "Task toggled", 
      completed_tasks: newCompleted 
    });
  } catch (error) {
    console.error("Task toggle error CRITICAL:", error);
    return NextResponse.json({ 
      message: "Gagal memperbarui tugas", 
      error: error.message 
    }, { status: 500 });
  }
}
