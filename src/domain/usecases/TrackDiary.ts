import { DiaryEntry, DiarySummary, NewDiaryEntry } from '../entities/DiaryEntry'
import { Food } from '../entities/Food'
import { MealTime } from '../entities/Meal'

export function buildDiaryEntry(
  food: Food,
  grams: number,
  mealTime: MealTime,
  date: string,
): NewDiaryEntry {
  const factor = food.portionG > 0 ? grams / food.portionG : 0

  return {
    date,
    mealTime,
    foodName: food.name,
    category: food.category,
    grams,
    calories: Math.round(food.calories * factor),
    proteinG: Math.round(food.proteinG * factor * 10) / 10,
    carbsG: Math.round(food.carbsG * factor * 10) / 10,
    fatG: Math.round(food.fatG * factor * 10) / 10,
  }
}

export function summarizeEntries(entries: DiaryEntry[]): DiarySummary {
  let calories = 0
  let proteinG = 0
  let carbsG = 0
  let fatG = 0

  for (const entry of entries) {
    calories += entry.calories
    proteinG += entry.proteinG
    carbsG += entry.carbsG
    fatG += entry.fatG
  }

  return {
    calories: Math.round(calories),
    proteinG: Math.round(proteinG * 10) / 10,
    carbsG: Math.round(carbsG * 10) / 10,
    fatG: Math.round(fatG * 10) / 10,
  }
}

export function groupByMealTime(entries: DiaryEntry[]): Record<MealTime, DiaryEntry[]> {
  const grouped: Record<MealTime, DiaryEntry[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  }

  for (const entry of entries) {
    if (grouped[entry.mealTime]) {
      grouped[entry.mealTime].push(entry)
    }
  }

  return grouped
}

export function getRemainingCalories(target: number, summary: DiarySummary): number {
  return target - summary.calories
}
