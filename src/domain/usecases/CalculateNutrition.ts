import { ActivityLevel, Goal, NutritionResult, Sex, User } from '../entities/User'

export type BmrFormula = 'mifflin' | 'harris'

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  intense: 1.725,
}

const GOAL_FACTORS: Record<Goal, number> = {
  lose: 0.85,
  maintain: 1,
  gain: 1.1,
}

type BmrCalculator = (sex: Sex, weightKg: number, heightCm: number, age: number) => number

const BMR_STRATEGIES: Record<BmrFormula, BmrCalculator> = {
  mifflin: (sex, weightKg, heightCm, age) => {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age
    return sex === 'male' ? base + 5 : base - 161
  },
  harris: (sex, weightKg, heightCm, age) => {
    if (sex === 'male') {
      return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
    }
    return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * age
  },
}

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Bajo peso'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Sobrepeso'
  return 'Obesidad'
}

export function calculateNutrition(user: User, formula: BmrFormula = 'mifflin'): NutritionResult {
  const goal: Goal = user.goal ?? 'maintain'
  const bmrCalc = BMR_STRATEGIES[formula]
  const bmr = bmrCalc(user.sex, user.weightKg, user.heightCm, user.age)
  const maintenanceCalories = Math.round(bmr * ACTIVITY_FACTORS[user.activityLevel])
  const dailyCalories = Math.max(1200, Math.round(maintenanceCalories * GOAL_FACTORS[goal]))
  const bmi = parseFloat((user.weightKg / Math.pow(user.heightCm / 100, 2)).toFixed(1))

  return {
    bmr: Math.round(bmr),
    maintenanceCalories,
    dailyCalories,
    goal,
    proteinG: Math.round((dailyCalories * 0.20) / 4),
    carbsG: Math.round((dailyCalories * 0.50) / 4),
    fatG: Math.round((dailyCalories * 0.30) / 9),
    bmi,
    bmiCategory: bmiCategory(bmi),
    waterGoalMl: Math.round(user.weightKg * 35),
  }
}
