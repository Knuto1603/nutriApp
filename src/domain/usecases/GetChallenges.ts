import { Challenge, UserProgress } from '../entities/Challenge'

const LEVELS = [
  { min: 0,    title: 'Principiante' },
  { min: 200,  title: 'Saludable'    },
  { min: 500,  title: 'Nutrido'      },
  { min: 1000, title: 'Experto'      },
  { min: 2000, title: 'Maestro NutriApp' },
]

export function getLevel(points: number): { level: number; title: string } {
  let level = 0
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) level = i + 1
  }
  return { level, title: LEVELS[level - 1]?.title ?? 'Principiante' }
}

export function getNextLevelPoints(points: number): number {
  const next = LEVELS.find((l) => l.min > points)
  return next?.min ?? LEVELS[LEVELS.length - 1].min
}

export function isCompletedToday(challenge: Challenge, today: string): boolean {
  return challenge.lastCompletedDate === today
}

export function markDayCompleted(challenge: Challenge, today: string): Challenge {
  if (challenge.isCompleted || challenge.lastCompletedDate === today) {
    return challenge
  }
  const completedDays = challenge.completedDays + 1
  const isCompleted = completedDays >= challenge.targetDays
  return { ...challenge, completedDays, isCompleted, lastCompletedDate: today }
}

export function calcUserProgress(challenges: Challenge[]): UserProgress {
  const totalPoints = challenges
    .filter((c) => c.isCompleted)
    .reduce((s, c) => s + c.points, 0)

  const { level, title } = getLevel(totalPoints)

  return {
    totalPoints,
    level,
    levelTitle: title,
    completedChallenges: challenges.filter((c) => c.isCompleted).map((c) => c.id),
  }
}
