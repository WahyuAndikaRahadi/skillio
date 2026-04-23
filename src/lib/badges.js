import prisma from "./prisma";

/**
 * Check and award badges based on user performance
 * @param {string} userId 
 * @param {string} type - type of achievement (e.g., 'perfect_score', 'streak_count', 'xp_count')
 * @param {any} context - additional data needed for the check
 */
export async function checkAndAwardBadges(userId, type, context = {}) {
  try {
    // 1. Get all badges related to this type
    const potentialBadges = await prisma.badge.findMany({
      where: { type: { in: [type, 'special', 'completion', 'xp', 'streak', 'quiz'] } }
    });

    const earnedBadges = [];

    for (const badge of potentialBadges) {
      const req = badge.requirement;
      if (!req || req.type !== type) continue;

      // Check if user already has this badge
      const alreadyHas = await prisma.userBadge.findFirst({
        where: { user_id: userId, badge_id: badge.id }
      });
      if (alreadyHas) continue;

      let qualified = false;

      // Logic for each type
      switch (type) {
        case 'perfect_score':
          if (context.score === 100) qualified = true;
          break;
        case 'streak_count':
          if (context.streak >= req.value) qualified = true;
          break;
        case 'xp_count':
          if (context.xp >= req.value) qualified = true;
          break;
        case 'orientation_complete':
          qualified = true; // awarded when called
          break;
        case 'roadmap_complete':
          qualified = true; // awarded when called
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
