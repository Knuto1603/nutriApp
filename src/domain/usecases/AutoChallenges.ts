import { DiaryEntry } from '../entities/DiaryEntry'

export const AUTO_CHALLENGE_IDS: readonly string[] = [
  'perfil-completo',
  'agua-diaria',
  'agua-7dias',
  'fruta-desayuno-5',
  'ensalada-almuerzo-7',
  'legumbres-semana',
]

export interface AutoChallengeContext {
  hasProfile: boolean
  waterGoalReached: boolean
  todayEntries: DiaryEntry[]
}

export function evaluateAutoChallenges(ctx: AutoChallengeContext): string[] {
  const completed: string[] = []

  if (ctx.hasProfile) {
    completed.push('perfil-completo')
  }

  if (ctx.waterGoalReached) {
    completed.push('agua-diaria', 'agua-7dias')
  }

  const entries = ctx.todayEntries ?? []

  if (entries.some((entry) => entry.mealTime === 'breakfast' && entry.category === 'Frutas')) {
    completed.push('fruta-desayuno-5')
  }

  if (entries.some((entry) => entry.mealTime === 'lunch' && entry.category === 'Verduras')) {
    completed.push('ensalada-almuerzo-7')
  }

  if (entries.some((entry) => entry.category === 'Legumbres')) {
    completed.push('legumbres-semana')
  }

  return completed
}
