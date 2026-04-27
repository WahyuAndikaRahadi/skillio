import prisma from "./prisma";

/**
 * Check and award badges based on user performance
 * @param {string} userId 
 * @param {string} triggerType - what just happened (e.g., 'day_complete', 'streak_check', 'quiz_perfect')
 * @param {any} context - additional data needed for the check
 */
export async function checkAndAwardBadges(userId, triggerType, context = {}) {
  try {
    // 1. Get all badges
    const allBadges = await prisma.badge.findMany();
    const earnedBadges = [];

    // 2. Get user's current earned badges to avoid duplicates
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

      // Logic based on triggerType (matches requirement.type in DB)
      switch (triggerType) {
        case 'day_complete':
          // Badge: Pemula Berani (Day 1)
          if (req.day === context.day) qualified = true;
          break;
          
        case 'streak':
          // Badge: Konsisten 7 Hari
          if (context.streak >= req.days) qualified = true;
          break;

        case 'multi_active':
          // Badge: Sang Multitasker
          if (context.count >= req.count) qualified = true;
          break;

        case 'multi_start':
          // Badge: Pelajar Polimatik
          if (context.count >= req.count) qualified = true;
          break;

        case 'roadmaps_completed':
          // Badge: Sertifikat Kelulusan, Master Trilogi
          if (context.count >= req.count) qualified = true;
          break;

        case 'days_completed':
          // Badge: Setengah Jalan (15 days)
          if (context.count >= req.count) qualified = true;
          break;

        case 'quiz_perfect':
          if (context.score === 100) qualified = true;
          break;

        case 'ai_messages':
          // Badge: Penjelajah Hebat
          if (context.count >= req.count) qualified = true;
          break;

        case 'community_posts':
          // Badge: Kupu Kupu Sosial
          if (context.count >= req.count) qualified = true;
          break;

        case 'community_comments':
          // Badge: Penolong Komunitas
          if (context.count >= req.count) qualified = true;
          break;

        case 'night_activity':
          // Badge: Burung Hantu Malam
          if (context.count >= req.count) qualified = true;
          break;

        case 'quiz_speed':
          // Badge: Pelari Cepat
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
