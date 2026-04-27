import { auth } from "@/auth";
import LearningRoom from "@/components/dashboard/LearningRoom";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function RoadmapPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // 1. Fetch User Stats (Streak & Badges)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      streak: true,
      badges: true
    }
  });

  // 2. Fetch Active Roadmap(s)
  const activeRoadmaps = await prisma.userRoadmap.findMany({
    where: { user_id: session.user.id, status: "active" },
    orderBy: { started_at: "desc" },
    include: { 
      category: true,
      progress: true
    }
  });

  // 3. Fetch Completed Roadmap(s)
  const completedRoadmaps = await prisma.userRoadmap.findMany({
    where: { user_id: session.user.id, status: "completed" },
    orderBy: { completed_at: "desc" },
    include: { category: true }
  });

  // We'll prioritize the most recent active roadmap for the main display in LearningRoom
  const activeRoadmap = activeRoadmaps.length > 0 ? activeRoadmaps[0] : null;

  return (
    <LearningRoom 
      activeRoadmap={activeRoadmap}
      completedRoadmaps={completedRoadmaps}
      userName={session.user.name}
      stats={{
        streak: user.streak?.current_streak || 0,
        badgeCount: user.badges?.length || 0
      }}
    />
  );
}
