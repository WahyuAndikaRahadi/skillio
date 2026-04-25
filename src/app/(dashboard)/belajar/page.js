import { auth } from "@/auth";
import EmptyState from "@/components/dashboard/EmptyState";
import RoadmapClientView from "@/components/dashboard/RoadmapClientView";
import NewRoadmapBanner from "@/components/dashboard/NewRoadmapBanner";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function RoadmapPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // Check for active roadmap
  const userRoadmap = await prisma.userRoadmap.findFirst({
    where: { user_id: session.user.id, status: "active" },
    orderBy: { started_at: "desc" },
    include: { 
      roadmap: true,
      category: true,
      progress: true,
      user: {
        include: {
          streak: true
        }
      }
    }
  });

  // Check for completed roadmaps
  const completedRoadmaps = await prisma.userRoadmap.findMany({
    where: { user_id: session.user.id, status: "completed" },
    orderBy: { completed_at: "desc" },
    include: { category: true }
  });

  // Check for quiz progress to show in EmptyState
  const quizProgress = await prisma.userQuizProgress.findUnique({
    where: { user_id: session.user.id }
  });

  if (!userRoadmap) {
    if (completedRoadmaps.length > 0) {
      return (
        <NewRoadmapBanner 
          completedRoadmaps={completedRoadmaps.map(r => ({
            id: r.id,
            categoryName: r.category.name,
            completedAt: r.completed_at
          }))} 
        />
      );
    }

    return (
      <div className="w-full max-w-7xl mx-auto pb-12">
        <EmptyState userName={session.user.name} hasProgress={!!quizProgress} />
      </div>
    );
  }

  return (
    <RoadmapClientView 
      userRoadmap={userRoadmap}
      session={session}
    />
  );
}
