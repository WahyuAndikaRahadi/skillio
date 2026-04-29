import prisma from "./prisma";

export async function checkAndAwardBadges(userId, triggerType, context = {}) {
  try {

    const allBadges = await prisma.badge.findMany();
    const earnedBadges = [];

    const userBadges = await prisma.userBadge.findMany({
      where: { user_id: userId },
      select: { badge_id: true }
    });
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));

    for (const badge of allBadges) {
      if (earnedBadgeIds.has(badge.id)) continue;

      const req = badge.requirement;
      if (!req || req.type !== triggerType) continue;

      let qualified = false;

      switch (triggerType) {
        case 'day_complete':

          if (req.day === context.day) qualified = true;
          break;

        case 'streak':

          if (context.streak >= req.days) qualified = true;
          break;

        case 'multi_active':

          if (context.count >= req.count) qualified = true;
          break;

        case 'multi_start':

          if (context.count >= req.count) qualified = true;
          break;

        case 'roadmaps_completed':

          if (context.count >= req.count) qualified = true;
          break;

        case 'days_completed':

          if (context.count >= req.count) qualified = true;
          break;

        case 'quiz_perfect':
          if (context.score === 100) qualified = true;
          break;

        case 'ai_messages':

          if (context.count >= req.count) qualified = true;
          break;

        case 'community_posts':

          if (context.count >= req.count) qualified = true;
          break;

        case 'community_comments':

          if (context.count >= req.count) qualified = true;
          break;

        case 'night_activity':

          if (context.count >= req.count) qualified = true;
          break;

        case 'quiz_speed':

          if (context.seconds <= req.seconds && context.score === 100) qualified = true;
          break;
      }

      if (qualified) {
        const newBadge = await prisma.userBadge.create({
          data: {
            user_id: userId,
            badge_id: badge.id
          },
          include: { badge: true }
        });
        earnedBadges.push(newBadge);
      }
    }

    return earnedBadges;
  } catch (error) {
    console.error("Badge Engine Error:", error);
    return [];
  }
}
