import { useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { localDateString } from '../../core/utils/date'
import { notificationService } from '../../core/notifications/NotificationService'
import { UserRepository } from '../../data/local/asyncStorage/UserStorage'
import { DiaryRepository } from '../../data/repositories/DiaryRepository'
import { FoodRepository } from '../../data/repositories/FoodRepository'
import { WaterRepository } from '../../data/repositories/WaterRepository'
import { MealTime } from '../../domain/entities/Meal'
import { User } from '../../domain/entities/User'
import { WaterEntry, WaterLog } from '../../domain/entities/WaterLog'
import { calculateNutrition } from '../../domain/usecases/CalculateNutrition'
import { buildDiaryEntry } from '../../domain/usecases/TrackDiary'
import { useChallengeStore } from '../stores/challengeStore'
import { useDiaryStore } from '../stores/diaryStore'
import { useProfileStore } from '../stores/profileStore'
import { useWaterStore } from '../stores/waterStore'

const userRepo = new UserRepository()
const waterRepo = new WaterRepository()
const diaryRepo = new DiaryRepository()
const foodRepo = new FoodRepository()

interface DemoFoodTarget {
  query: string
  mealTime: MealTime
  grams: number
}

const DEMO_FOOD_TARGETS: DemoFoodTarget[] = [
  { query: 'avena', mealTime: 'breakfast', grams: 150 },
  { query: 'platano', mealTime: 'breakfast', grams: 100 },
  { query: 'arroz', mealTime: 'lunch', grams: 150 },
  { query: 'pollo', mealTime: 'lunch', grams: 150 },
  { query: 'tomate', mealTime: 'lunch', grams: 80 },
]

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function useDemoMode(): {
  loadDemo: () => Promise<void>
  resetAll: () => Promise<void>
} {
  const loadDemo = useCallback(async (): Promise<void> => {
    const demoUser: User = {
      name: 'Lucía',
      age: 21,
      sex: 'female',
      weightKg: 60,
      heightCm: 165,
      activityLevel: 'moderate',
      goal: 'maintain',
    }

    await userRepo.save(demoUser)
    useProfileStore.getState().setUser(demoUser)

    const { waterGoalMl } = calculateNutrition(demoUser)

    for (let i = 0; i < 5; i++) {
      const dateObj = new Date()
      dateObj.setDate(dateObj.getDate() - i)
      const date = localDateString(dateObj)

      const meetsGoal = i !== 2
      const totalMl = meetsGoal ? waterGoalMl : Math.round(waterGoalMl * 0.6)

      const morning = new Date(dateObj)
      morning.setHours(9, 0, 0, 0)
      const afternoon = new Date(dateObj)
      afternoon.setHours(15, 0, 0, 0)

      const morningMl = Math.round(totalMl / 2)
      const afternoonMl = totalMl - morningMl

      const entries: WaterEntry[] = [
        { time: morning.toISOString(), ml: morningMl },
        { time: afternoon.toISOString(), ml: afternoonMl },
      ]

      const log: WaterLog = {
        date,
        entries,
        totalMl,
        goalMl: waterGoalMl,
      }

      await waterRepo.saveLog(log)
      if (i === 0) {
        useWaterStore.getState().setLog(log)
      }
    }

    const allFoods = await foodRepo.getAll()
    const today = localDateString()

    for (const target of DEMO_FOOD_TARGETS) {
      const normalizedQuery = normalizeText(target.query)
      const food = allFoods.find((f) => normalizeText(f.name).includes(normalizedQuery))
      if (!food) continue

      const entry = buildDiaryEntry(food, target.grams, target.mealTime, today)
      await diaryRepo.add(entry)
    }

    const todayEntries = await diaryRepo.getByDate(today)
    useDiaryStore.getState().setDay(today, todayEntries)
  }, [])

  const resetAll = useCallback(async (): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const appKeys = keys.filter((key) => key.startsWith('@nutriapp:'))
      if (appKeys.length > 0) {
        await AsyncStorage.multiRemove(appKeys)
      }
    } catch {
      // ignore
    }

    try {
      await notificationService.cancelAll()
    } catch {
      // ignore
    }

    try {
      useProfileStore.getState().setUser(null)
    } catch {
      // ignore
    }

    try {
      useDiaryStore.getState().setDay(localDateString(), [])
    } catch {
      // ignore
    }

    try {
      useWaterStore.setState({ log: null })
    } catch {
      // ignore
    }

    try {
      useChallengeStore.setState({ challenges: [], loaded: false })
      await useChallengeStore.getState().load()
    } catch {
      // ignore
    }
  }, [])

  return { loadDemo, resetAll }
}
