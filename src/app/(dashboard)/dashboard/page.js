import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  if (session.user?.role === "admin") {
    redirect("/admin/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      streak: true,
      badges: {
        include: { badge: true },
        orderBy: { earned_at: "desc" },
        take: 5,
      },
    },
  });

  const userRoadmap = await prisma.userRoadmap.findFirst({
    where: { user_id: session.user.id, status: "active" },
    include: {
      category: true,
      progress: { orderBy: { day_number: "asc" } },
      roadmap: true,
    },
  });

  // Completed roadmaps count
  const completedRoadmaps = await prisma.userRoadmap.count({
    where: { user_id: session.user.id, status: "completed" },
  });

  // AI Mentor usage (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const aiLogs = await prisma.aiMentorLog.findMany({
    where: {
      user_id: session.user.id,
      date: { gte: sevenDaysAgo },
    },
    orderBy: { date: "asc" },
  });

  // Build weekly activity from real progress data
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const weeklyActivity = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const log = aiLogs.find(
      (l) => new Date(l.date).toDateString() === d.toDateString()
    );
    weeklyActivity.push({
      day: dayNames[d.getDay()],
      count: log?.count || 0,
      date: d.toISOString(),
    });
  }

  // Community posts by user
  const userPostsCount = await prisma.communityPost.count({
    where: { user_id: session.user.id },
  });

  // Calculate progress
  const completedDays =
    userRoadmap?.progress?.filter(
      (p) => p.tasks_completed && p.quiz_passed
    ).length || 0;
  const progressPercentage = userRoadmap
    ? Math.min(Math.round((completedDays / 30) * 100), 100)
    : 0;

  // Current day tasks
  const currentDayNum = userRoadmap?.current_day || 1;
  const currentDayProgress = userRoadmap?.progress?.find(
    (p) => p.day_number === currentDayNum
  );
  const completedTaskIds = Array.isArray(currentDayProgress?.completed_tasks)
    ? currentDayProgress.completed_tasks
    : [];

  let currentDayTitle = null;
  let currentDayTasks = [];

  if (userRoadmap?.category?.slug) {
    try {
      // Because this is server-side, we can import prismaQuestion and fetch directly
      const { default: prismaQuestion } = await import("@/lib/prisma-question");
      const curriculum = await prismaQuestion.curriculum.findUnique({
        where: { category_slug: userRoadmap.category.slug }
      });

      if (curriculum && curriculum.content_json) {
        const data = curriculum.content_json;
        // The day index could be 'day' or 'day_number'
        const currentDayData = data.days?.find(d => (d.day === currentDayNum || d.day_number === currentDayNum));
        if (currentDayData) {
          currentDayTitle = currentDayData.title;
          currentDayTasks = (currentDayData.tasks || []).map((t, idx) => ({
            id: idx.toString(),
            task_text: t,
            completed: completedTaskIds.includes(idx.toString()),
          }));
        }
      }
    } catch(err) {
      console.error("Failed fetching curriculum for dashboard from DB2:", err);
    }
  }

  const props = {
    userName: session.user.name || "User",
    userImage: session.user.image,
    xp: user?.xp || 0,
    currentStreak: user?.streak?.current_streak || 0,
    bestStreak: user?.streak?.longest_streak || 0,
    badgeCount: user?.badges?.length || 0,
    recentBadges: (user?.badges || []).map((ub) => ({
      name: ub.badge.name,
      description: ub.badge.description,
      image_url: ub.badge.image_url,
      earned_at: ub.earned_at.toISOString(),
    })),
    hasRoadmap: !!userRoadmap,
    roadmapField: userRoadmap?.category?.name || null,
    progressPercentage,
    completedDays,
    currentDay: currentDayNum,
    currentDayTitle,
    currentDayTasks,
    completedRoadmaps,
    weeklyActivity,
    totalAiChats: aiLogs.reduce((sum, l) => sum + l.count, 0),
    userPostsCount,
  };

  return <DashboardClient {...props} />;
}
