import { useEffect } from 'react'
import {
  calcUserProgress,
  getNextLevelPoints,
} from '../../domain/usecases/GetChallenges'
import { useChallengeStore } from '../stores/challengeStore'

export function useChallenges() {
  const { challenges, loaded, load, completeDay, activate } = useChallengeStore()

  useEffect(() => {
    if (!loaded) load()
  }, [loaded])

  const active = challenges.filter((c) => c.isActive && !c.isCompleted)
  const completed = challenges.filter((c) => c.isCompleted)
  const available = challenges.filter((c) => !c.isActive && !c.isCompleted)

  const progress = calcUserProgress(challenges)
  const nextPoints = getNextLevelPoints(progress.totalPoints)

  return { active, completed, available, progress, nextPoints, completeDay, activate, loaded }
}
