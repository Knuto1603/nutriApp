import { localDateString } from '../../core/utils/date'
import { DailyMenu } from '../entities/Meal'
import { IMenuRepository } from '../ports/IMenuRepository'

export function getDailyMenu(repo: IMenuRepository, dailyCalories: number): DailyMenu {
  const breakfast = repo.pickMeal('breakfast', dailyCalories * 0.25)
  const lunch     = repo.pickMeal('lunch',     dailyCalories * 0.40)
  const dinner    = repo.pickMeal('dinner',    dailyCalories * 0.25)
  const snack     = repo.pickMeal('snack',     dailyCalories * 0.10)

  return {
    date: localDateString(),
    targetCalories: dailyCalories,
    breakfast,
    lunch,
    dinner,
    snack,
  }
}
