import { auth } from "@/auth";
import EmptyState from "@/components/dashboard/EmptyState";
import RoadmapTimeline from "@/components/dashboard/RoadmapTimeline";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch user data for XP and Streak
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { streak: true }
  });

  // Check for active roadmap
  const userRoadmap = await prisma.userRoadmap.findFirst({
    where: { user_id: session.user.id, status: "active" },
    include: { 
      roadmap: { 
        include: { 
          days: { 
            orderBy: { day_number: "asc" },
            include: { tasks: true, quizzes: true }
          } 
        } 
      }, 
      category: true,
      progress: true
    }
  });

  // Check for quiz progress
  const quizProgress = await prisma.userQuizProgress.findUnique({
    where: { user_id: session.user.id }
  });

  return (
    <div className="w-full">
      {!userRoadmap ? (
        <EmptyState userName={session.user.name} hasProgress={!!quizProgress} />
      ) : (
        <div className="space-y-8">
           <div className="mb-10">
             <h1 className="text-3xl font-black text-dark-blue mb-2">Progres Belajar Anda</h1>
             <p className="text-dark-blue/60 font-medium">Lanjutkan perjalanan Anda menjadi {userRoadmap.category.name}</p>
           </div>
           
           <RoadmapTimeline 
             roadmap={userRoadmap.roadmap} 
             days={userRoadmap.roadmap.days} 
             userRoadmap={userRoadmap}
           />
        </div>
      )}
    </div>
  );
}
