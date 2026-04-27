import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    redirect("/dashboard");
  }

  // Use Promise.all for parallel fetching to improve performance
  const [
    totalUsers,
    activeRoadmaps,
    totalGroups,
    totalPosts,
    latestUsersRaw,
    latestGroupsRaw
  ] = await Promise.all([
    prisma.user.count({ where: { role: "user" } }),
    prisma.userRoadmap.count({ where: { status: "active" } }),
    prisma.communityGroup.count(),
    prisma.communityPost.count(),
    prisma.user.findMany({
      where: { role: "user" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        image: true
      }
    }),
    prisma.communityGroup.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        _count: {
          select: { members: true }
        }
      }
    })
  ]);

  const latestUsers = latestUsersRaw.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString()
  }));

  // Prisma join workaround to get creator name
  const creatorIds = latestGroupsRaw.map(g => g.created_by);
  const creators = await prisma.user.findMany({
    where: { id: { in: creatorIds } },
    select: { id: true, name: true }
  });

  const latestGroups = latestGroupsRaw.map(group => {
    const creator = creators.find(c => c.id === group.created_by);
    return {
      id: group.id,
      name: group.name,
      privacy: group.privacy,
      createdAt: group.createdAt.toISOString(),
      memberCount: group._count.members,
      creatorName: creator?.name || "Unknown"
    };
  });

  const props = {
    metrics: {
      totalUsers,
      activeRoadmaps,
      totalGroups,
      totalPosts
    },
    latestUsers,
    latestGroups
  };

  return <AdminDashboardClient {...props} />;
}
