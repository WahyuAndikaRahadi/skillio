import { auth } from "@/auth";
import RoadmapClientView from "@/components/dashboard/RoadmapClientView";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function RoadmapDetailPage({ params }) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    redirect("/auth/login");
  }

  const userRoadmap = await prisma.userRoadmap.findFirst({
    where: { id: id, user_id: session.user.id },
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

  if (!userRoadmap) {
    return notFound();
  }

  return (
    <RoadmapClientView
      userRoadmap={userRoadmap}
      session={session}
    />
  );
}
