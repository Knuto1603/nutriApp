export type ChallengeType = 'daily' | 'weekly' | 'challenge'
export type ChallengeCategory = 'agua' | 'alimentacion' | 'habitos'

export interface Challenge {
  id: string
  title: string
  description: string
  type: ChallengeType
  category: ChallengeCategory
  targetDays: number
  completedDays: number
  points: number
  isCompleted: boolean
  isActive: boolean
  startDate: string
  lastCompletedDate?: string
}

export interface UserProgress {
  totalPoints: number
  level: number
  levelTitle: string
  completedChallenges: string[]
}
