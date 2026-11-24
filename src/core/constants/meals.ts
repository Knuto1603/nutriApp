import { MealTime } from '../../domain/entities/Meal'

export const MEAL_TIME_LABELS: Record<MealTime, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack: 'Snack',
}

export const MEAL_TIME_ORDER: MealTime[] = ['breakfast', 'lunch', 'dinner', 'snack']
