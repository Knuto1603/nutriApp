import { Meal, MealTime } from '../../domain/entities/Meal'
import { IMenuRepository } from '../../domain/ports/IMenuRepository'
import { pickMeal } from '../local/sqlite/seeds/menus'

export class MenuRepository implements IMenuRepository {
  pickMeal(time: MealTime, targetCalories: number, excludeId?: string): Meal {
    return pickMeal(time, targetCalories, excludeId)
  }
}
