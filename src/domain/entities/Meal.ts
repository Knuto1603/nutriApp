export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealItem {
  name: string
  portionG: number
  calories: number
}

export interface Meal {
  id: string
  time: MealTime
  title: string
  items: MealItem[]
  totalCalories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface DailyMenu {
  date: string
  targetCalories: number
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  snack: Meal
}
