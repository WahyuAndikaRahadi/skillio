import { auth } from "@/auth";
import LearningRoom from "@/components/dashboard/LearningRoom";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function RoadmapPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      streak: true,
      badges: true
    }
  });

  const activeRoadmaps = await prisma.userRoadmap.findMany({
    where: { user_id: session.user.id, status: "active" },
    orderBy: { started_at: "desc" },
    include: {
      category: true,
      progress: true
    }
  });

  const completedRoadmaps = await prisma.userRoadmap.findMany({
    where: { user_id: session.user.id, status: "completed" },
    orderBy: { completed_at: "desc" },
    include: { category: true }
  });

  const activeRoadmap = activeRoadmaps.length > 0 ? activeRoadmaps[0] : null;

  return (
    <LearningRoom
      activeRoadmaps={activeRoadmaps}
      completedRoadmaps={completedRoadmaps}
      userName={session.user.name}
      stats={{
        streak: user.streak?.current_streak || 0,
        badgeCount: user.badges?.length || 0
      }}
    />
  );
}
