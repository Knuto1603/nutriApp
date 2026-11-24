import { useEffect, useRef } from 'react'
import { localDateString } from '../../core/utils/date'
import { UserRepository } from '../../data/local/asyncStorage/UserStorage'
import { DiaryRepository } from '../../data/repositories/DiaryRepository'
import { WaterRepository } from '../../data/repositories/WaterRepository'
import { evaluateAutoChallenges } from '../../domain/usecases/AutoChallenges'
import { isCompletedToday } from '../../domain/usecases/GetChallenges'
import { useChallengeStore } from '../stores/challengeStore'
import { useDiaryStore } from '../stores/diaryStore'
import { useProfileStore } from '../stores/profileStore'
import { useWaterStore } from '../stores/waterStore'

const userRepo = new UserRepository()
const waterRepo = new WaterRepository()
const diaryRepo = new DiaryRepository()

export function useChallengeAutomation(): void {
  const { challenges, loaded: challengesLoaded, load: loadChallenges, completeDay } = useChallengeStore()
  const user = useProfileStore((s) => s.user)
  const profileLoaded = useProfileStore((s) => s.loaded)
  const setUser = useProfileStore((s) => s.setUser)
  const waterLog = useWaterStore((s) => s.log)
  const setWaterLog = useWaterStore((s) => s.setLog)
  const diaryEntries = useDiaryStore((s) => s.entries)
  const setDiaryDay = useDiaryStore((s) => s.setDay)

  const initialLoadedRef = useRef(false)

  useEffect(() => {
    if (initialLoadedRef.current) return
    initialLoadedRef.current = true

    if (!challengesLoaded) {
      loadChallenges()
    }
    if (!profileLoaded) {
      userRepo.get().then((saved) => {
        setUser(saved)
      })
    }
    const today = localDateString()
    waterRepo.getTodayLog().then((log) => {
      if (log) setWaterLog(log)
    })
    diaryRepo.getByDate(today).then((entries) => {
      setDiaryDay(today, entries)
    })
  }, [challengesLoaded, profileLoaded, loadChallenges, setUser, setWaterLog, setDiaryDay])

  useEffect(() => {
    if (!challengesLoaded) return

    const today = localDateString()
    const hasProfile = user !== null
    const waterGoalReached = Boolean(
      waterLog && waterLog.goalMl > 0 && waterLog.totalMl >= waterLog.goalMl
    )

    const satisfiedIds = evaluateAutoChallenges({
      hasProfile,
      waterGoalReached,
      todayEntries: diaryEntries ?? [],
    })

    for (const id of satisfiedIds) {
      const reto = challenges.find((c) => c.id === id)
      if (
        reto &&
        reto.isActive &&
        !reto.isCompleted &&
        !isCompletedToday(reto, today)
      ) {
        completeDay(id)
      }
    }
  }, [challengesLoaded, challenges, user, waterLog, diaryEntries, completeDay])
}

export default useChallengeAutomation
