import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
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

function getMsUntilMidnight(): number {
  const now = new Date()
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    50
  )
  return Math.max(1000, tomorrow.getTime() - now.getTime())
}

export function useChallengeAutomation(): void {
  const challenges = useChallengeStore((s) => s.challenges)
  const challengesLoaded = useChallengeStore((s) => s.loaded)
  const loadChallenges = useChallengeStore((s) => s.load)
  const completeDay = useChallengeStore((s) => s.completeDay)

  const user = useProfileStore((s) => s.user)
  const profileLoaded = useProfileStore((s) => s.loaded)
  const setUser = useProfileStore((s) => s.setUser)

  const waterLog = useWaterStore((s) => s.log)
  const setWaterLog = useWaterStore((s) => s.setLog)

  const diaryEntries = useDiaryStore((s) => s.entries)
  const diaryDate = useDiaryStore((s) => s.date)
  const setDiaryDay = useDiaryStore((s) => s.setDay)

  const [today, setToday] = useState(localDateString)
  const initialLoadedRef = useRef(false)
  const waterLogRef = useRef(waterLog)
  waterLogRef.current = waterLog

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const scheduleMidnightTimer = () => {
      clearTimeout(timer)
      const ms = getMsUntilMidnight()
      timer = setTimeout(() => {
        setToday(localDateString())
      }, ms)
    }

    scheduleMidnightTimer()

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        const currentDate = localDateString()
        setToday((prev) => (prev !== currentDate ? currentDate : prev))
        scheduleMidnightTimer()
      }
    })

    return () => {
      clearTimeout(timer)
      subscription.remove()
    }
  }, [today])

  useEffect(() => {
    if (initialLoadedRef.current) return
    initialLoadedRef.current = true

    if (!challengesLoaded) {
      loadChallenges().catch(() => {})
    }
    if (!profileLoaded) {
      userRepo
        .get()
        .then((saved) => {
          setUser(saved)
        })
        .catch(() => {})
    }
  }, [challengesLoaded, profileLoaded, loadChallenges, setUser])

  useEffect(() => {
    diaryRepo
      .getByDate(today)
      .then((entries) => {
        setDiaryDay(today, entries)
      })
      .catch(() => {})

    waterRepo
      .getTodayLog()
      .then((log) => {
        if (log) {
          setWaterLog(log)
        } else {
          setWaterLog({
            date: today,
            entries: [],
            totalMl: 0,
            goalMl: waterLogRef.current?.goalMl ?? 2000,
          })
        }
      })
      .catch(() => {})
  }, [today, setDiaryDay, setWaterLog])

  useEffect(() => {
    if (!challengesLoaded) return

    const hasProfile = user !== null
    const waterGoalReached = Boolean(
      waterLog &&
        waterLog.date === today &&
        waterLog.goalMl > 0 &&
        waterLog.totalMl >= waterLog.goalMl
    )

    const todayEntries = diaryDate === today ? (diaryEntries ?? []) : []

    const satisfiedIds = evaluateAutoChallenges({
      hasProfile,
      waterGoalReached,
      todayEntries,
    })

    for (const id of satisfiedIds) {
      const reto = challenges.find((c) => c.id === id)
      if (
        reto &&
        reto.isActive &&
        !reto.isCompleted &&
        !isCompletedToday(reto, today)
      ) {
        completeDay(id).catch(() => {})
      }
    }
  }, [
    challengesLoaded,
    challenges,
    user,
    waterLog,
    diaryEntries,
    diaryDate,
    today,
    completeDay,
  ])
}

export default useChallengeAutomation
