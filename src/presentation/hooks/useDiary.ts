import { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { DiaryRepository } from '../../data/repositories/DiaryRepository'
import { UserRepository } from '../../data/local/asyncStorage/UserStorage'
import { localDateString } from '../../core/utils/date'
import { calculateNutrition } from '../../domain/usecases/CalculateNutrition'
import {
  buildDiaryEntry,
  getRemainingCalories,
  groupByMealTime,
  summarizeEntries,
} from '../../domain/usecases/TrackDiary'
import { DiaryEntry, DiarySummary } from '../../domain/entities/DiaryEntry'
import { Food } from '../../domain/entities/Food'
import { MealTime } from '../../domain/entities/Meal'
import { useDiaryStore } from '../stores/diaryStore'

const diaryRepo = new DiaryRepository()
const userRepo = new UserRepository()

export function useDiary() {
  const { entries, setDay } = useDiaryStore()
  const [targetCalories, setTargetCalories] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      setLoading(true)
      const today = localDateString()
      const [user, dayEntries] = await Promise.all([
        userRepo.get(),
        diaryRepo.getByDate(today),
      ])
      if (cancelled) return
      setTargetCalories(user ? calculateNutrition(user).dailyCalories : null)
      setDay(today, dayEntries)
      setLoading(false)
    }

    init()
    return () => {
      cancelled = true
    }
  }, [setDay])

  useFocusEffect(
    useCallback(() => {
      let cancelled = false

      async function fetchToday() {
        const today = localDateString()
        const [user, dayEntries] = await Promise.all([
          userRepo.get(),
          diaryRepo.getByDate(today),
        ])
        if (cancelled) return
        setTargetCalories(user ? calculateNutrition(user).dailyCalories : null)
        setDay(today, dayEntries)
      }

      fetchToday()

      return () => {
        cancelled = true
      }
    }, [setDay])
  )

  const reload = useCallback(async () => {
    setLoading(true)
    const today = localDateString()
    const [user, dayEntries] = await Promise.all([
      userRepo.get(),
      diaryRepo.getByDate(today),
    ])
    if (!isMountedRef.current) return
    setTargetCalories(user ? calculateNutrition(user).dailyCalories : null)
    setDay(today, dayEntries)
    setLoading(false)
  }, [setDay])

  async function add(food: Food, grams: number, mealTime: MealTime): Promise<void> {
    const today = localDateString()
    const entry = buildDiaryEntry(food, grams, mealTime, today)
    await diaryRepo.add(entry)
    const updated = await diaryRepo.getByDate(today)
    if (!isMountedRef.current) return
    setDay(today, updated)
  }

  async function remove(id: string): Promise<void> {
    const today = localDateString()
    await diaryRepo.remove(today, id)
    const updated = await diaryRepo.getByDate(today)
    if (!isMountedRef.current) return
    setDay(today, updated)
  }

  const summary: DiarySummary = summarizeEntries(entries)
  const grouped: Record<MealTime, DiaryEntry[]> = groupByMealTime(entries)
  const remaining: number | null =
    targetCalories !== null ? getRemainingCalories(targetCalories, summary) : null

  return {
    entries,
    summary,
    grouped,
    targetCalories,
    remaining,
    loading,
    add,
    remove,
    reload,
  }
}
