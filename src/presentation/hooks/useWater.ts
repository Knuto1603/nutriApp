import { useEffect, useState } from 'react'
import { WaterRepository } from '../../data/repositories/WaterRepository'
import { UserRepository } from '../../data/local/asyncStorage/UserStorage'
import { calculateNutrition } from '../../domain/usecases/CalculateNutrition'
import { addWater, getProgressPercent, getRemainingMl, isGoalReached } from '../../domain/usecases/TrackWater'
import { WaterLog } from '../../domain/entities/WaterLog'
import { notificationService } from '../../core/notifications/NotificationService'
import { localDateString } from '../../core/utils/date'
import { useWaterStore } from '../stores/waterStore'

const waterRepo = new WaterRepository()
const userRepo = new UserRepository()

export function useWater() {
  const { log, setLog } = useWaterStore()
  const [goalMl, setGoalMl] = useState(2000)
  const [history, setHistory] = useState<WaterLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const user = await userRepo.get()
      if (cancelled) return
      const goal = user ? calculateNutrition(user).waterGoalMl : 2000
      setGoalMl(goal)

      const existing = await waterRepo.getTodayLog()
      if (cancelled) return
      if (existing) {
        setLog(existing.goalMl !== goal ? { ...existing, goalMl: goal } : existing)
      }

      const hist = await waterRepo.getHistory(7)
      if (cancelled) return
      setHistory(hist)

      setLoading(false)
      notificationService.scheduleWaterReminders().catch(() => {})
    }

    init()
    return () => { cancelled = true }
  }, [])

  async function add(ml: number) {
    const updated = await addWater(waterRepo, ml, goalMl)
    setLog(updated)
    const hist = await waterRepo.getHistory(7)
    setHistory(hist)
  }

  async function reset() {
    await waterRepo.clearToday()
    setLog({ date: localDateString(), entries: [], totalMl: 0, goalMl })
  }

  const totalMl    = log?.totalMl ?? 0
  const progress   = getProgressPercent(log ?? { totalMl: 0, goalMl, date: '', entries: [] })
  const remaining  = getRemainingMl(log ?? { totalMl: 0, goalMl, date: '', entries: [] })
  const goalReached = isGoalReached(log ?? { totalMl: 0, goalMl, date: '', entries: [] })

  return { totalMl, goalMl, progress, remaining, goalReached, history, loading, add, reset }
}
