import { useEffect, useMemo, useRef, useState } from 'react'
import { WaterRepository } from '../../data/repositories/WaterRepository'
import { UserRepository } from '../../data/local/asyncStorage/UserStorage'
import { calculateNutrition } from '../../domain/usecases/CalculateNutrition'
import { addWater, getProgressPercent, getRemainingMl, isGoalReached } from '../../domain/usecases/TrackWater'
import { WaterLog } from '../../domain/entities/WaterLog'
import { notificationService } from '../../core/notifications/NotificationService'
import { localDateString } from '../../core/utils/date'
import { useWaterStore } from '../stores/waterStore'
import { useProfileStore } from '../stores/profileStore'

const waterRepo = new WaterRepository()
const userRepo = new UserRepository()

export function useWater() {
  const user = useProfileStore((s) => s.user)
  const profileLoaded = useProfileStore((s) => s.loaded)
  const setUser = useProfileStore((s) => s.setUser)

  const log = useWaterStore((s) => s.log)
  const setLog = useWaterStore((s) => s.setLog)

  const [history, setHistory] = useState<WaterLog[]>([])
  const [loading, setLoading] = useState(true)
  const isMountedRef = useRef(true)

  const goalMl = useMemo(() => {
    return user ? calculateNutrition(user).waterGoalMl : 2000
  }, [user])

  useEffect(() => {
    isMountedRef.current = true

    async function init() {
      try {
        if (!profileLoaded) {
          const savedUser = await userRepo.get()
          if (!isMountedRef.current) return
          setUser(savedUser)
        }

        const existing = await waterRepo.getTodayLog()
        if (!isMountedRef.current) return
        if (existing) {
          setLog(existing)
        }

        const hist = await waterRepo.getHistory(7)
        if (!isMountedRef.current) return
        setHistory(hist)
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }

      notificationService.scheduleWaterReminders().catch(() => {})
    }

    init()

    return () => {
      isMountedRef.current = false
    }
  }, [profileLoaded, setUser, setLog])

  useEffect(() => {
    if (log && log.date === localDateString() && log.goalMl !== goalMl) {
      const updated = { ...log, goalMl }
      setLog(updated)
      waterRepo.saveLog(updated).catch(() => {})
    }
  }, [goalMl, log, setLog])

  async function add(ml: number) {
    if (loading) return
    const updated = await addWater(waterRepo, ml, goalMl)
    setLog(updated)
    const hist = await waterRepo.getHistory(7)
    if (isMountedRef.current) {
      setHistory(hist)
    }
  }

  async function reset() {
    if (loading) return
    await waterRepo.clearToday()
    setLog({ date: localDateString(), entries: [], totalMl: 0, goalMl })
    const hist = await waterRepo.getHistory(7)
    if (isMountedRef.current) {
      setHistory(hist)
    }
  }

  const totalMl = log?.totalMl ?? 0
  const progress = getProgressPercent(log ?? { totalMl: 0, goalMl, date: '', entries: [] })
  const remaining = getRemainingMl(log ?? { totalMl: 0, goalMl, date: '', entries: [] })
  const goalReached = isGoalReached(log ?? { totalMl: 0, goalMl, date: '', entries: [] })

  return { totalMl, goalMl, progress, remaining, goalReached, history, loading, add, reset }
}
