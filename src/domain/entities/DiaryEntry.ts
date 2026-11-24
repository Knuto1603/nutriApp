import { MealTime } from './Meal'

export interface DiaryEntry {
  id: string
  date: string
  mealTime: MealTime
  foodName: string
  category: string
  grams: number
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export type NewDiaryEntry = Omit<DiaryEntry, 'id'>

export interface DiarySummary {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}
