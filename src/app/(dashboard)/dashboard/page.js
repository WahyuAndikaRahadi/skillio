import { auth } from "@/auth";
import EmptyState from "@/components/dashboard/EmptyState";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // Check if user has an active roadmap
  const userRoadmap = await prisma.userRoadmap.findFirst({
    where: { user_id: session.user.id, status: "active" },
    include: { roadmap: true, category: true }
  });

  return (
    <div className="w-full">
      {!userRoadmap ? (
        <EmptyState userName={session.user.name} />
      ) : (
        <div className="space-y-8">
           {/* Active Roadmap UI will go here */}
           <div className="bg-white p-8 rounded-[32px] border border-light-blue shadow-sm">
             <h2 className="text-2xl font-black text-dark-blue mb-2">Roadmap Aktif</h2>
             <p className="text-dark-blue/60 font-medium">Kamu sedang mempelajari {userRoadmap.category.name}</p>
           </div>
        </div>
      )}
    </div>
  );
}
