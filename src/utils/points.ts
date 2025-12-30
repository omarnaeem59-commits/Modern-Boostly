/**
 * Points calculation system
 * Defines point values for different achievements
 */

export const POINTS_CONFIG = {
  // Task completion points (based on priority)
  TASK_LOW: 10,
  TASK_MEDIUM: 25,
  TASK_HIGH: 50,
  
  // Habit completion points
  HABIT_COMPLETION: 20,
  HABIT_STREAK_BONUS: 5, // Bonus per day of streak (max 50)
  
  // Focus session points
  FOCUS_SHORT: 15, // 5 min
  FOCUS_WORK: 50, // 25 min
  FOCUS_LONG: 100, // 15 min break
  
  // Level calculation
  POINTS_PER_LEVEL: 100, // Points needed per level
}

/**
 * Calculate level from total points
 */
export function calculateLevel(points: number): number {
  return Math.floor(points / POINTS_CONFIG.POINTS_PER_LEVEL) + 1
}

/**
 * Calculate points needed for next level
 */
export function pointsToNextLevel(points: number): number {
  const currentLevel = calculateLevel(points)
  const nextLevelPoints = currentLevel * POINTS_CONFIG.POINTS_PER_LEVEL
  return nextLevelPoints - points
}

/**
 * Calculate badge based on level
 */
export function getBadgeForLevel(level: number): string {
  if (level >= 50) return "Legend"
  if (level >= 40) return "Master"
  if (level >= 30) return "Expert"
  if (level >= 20) return "Pro"
  if (level >= 15) return "Advanced"
  if (level >= 10) return "Intermediate"
  if (level >= 5) return "Rising Star"
  if (level >= 2) return "Beginner"
  return "Newcomer"
}

/**
 * Calculate task points based on priority
 */
export function getTaskPoints(priority: "low" | "medium" | "high"): number {
  switch (priority) {
    case "low":
      return POINTS_CONFIG.TASK_LOW
    case "medium":
      return POINTS_CONFIG.TASK_MEDIUM
    case "high":
      return POINTS_CONFIG.TASK_HIGH
    default:
      return POINTS_CONFIG.TASK_MEDIUM
  }
}

/**
 * Calculate habit points with streak bonus
 */
export function getHabitPoints(streak: number): number {
  const basePoints = POINTS_CONFIG.HABIT_COMPLETION
  const streakBonus = Math.min(streak * POINTS_CONFIG.HABIT_STREAK_BONUS, 50)
  return basePoints + streakBonus
}

