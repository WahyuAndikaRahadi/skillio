import { auth } from "@/auth";
import EmptyState from "@/components/dashboard/EmptyState";
import RoadmapClientView from "@/components/dashboard/RoadmapClientView";
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

  // Check for quiz progress to show in EmptyState
  const quizProgress = await prisma.userQuizProgress.findUnique({
    where: { user_id: session.user.id }
  });

  if (!userRoadmap) {
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
