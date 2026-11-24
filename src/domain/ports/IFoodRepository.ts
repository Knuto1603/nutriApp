import { Food } from '../entities/Food'

export interface IFoodRepository {
  search(query: string): Promise<Food[]>
  getById(id: number): Promise<Food | null>
  getByCategory(category: string): Promise<Food[]>
  getAll(): Promise<Food[]>
}
