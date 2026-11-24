export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense'
export type Sex = 'male' | 'female'
export type Goal = 'lose' | 'maintain' | 'gain'

export interface User {
  name: string
  age: number
  sex: Sex
  weightKg: number
  heightCm: number
  activityLevel: ActivityLevel
  goal?: Goal
}

export interface NutritionResult {
  bmr: number
  maintenanceCalories: number
  dailyCalories: number
  goal: Goal
  proteinG: number
  carbsG: number
  fatG: number
  bmi: number
  bmiCategory: string
  waterGoalMl: number
}
