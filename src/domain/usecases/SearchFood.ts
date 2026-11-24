import { Food } from '../entities/Food'
import { IFoodRepository } from '../ports/IFoodRepository'

export async function searchFood(repo: IFoodRepository, query: string): Promise<Food[]> {
  if (query.trim().length === 0) return repo.getAll()
  return repo.search(query.trim())
}
