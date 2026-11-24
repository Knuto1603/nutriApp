import { Meal, MealTime } from '../entities/Meal'

export interface IMenuRepository {
  pickMeal(time: MealTime, targetCalories: number, excludeId?: string): Meal
}
