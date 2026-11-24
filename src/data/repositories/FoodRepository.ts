import { Food } from '../../domain/entities/Food'
import { IFoodRepository } from '../../domain/ports/IFoodRepository'
import { getDatabase } from '../local/sqlite/database'

interface FoodRow {
  id: number
  name: string
  category: string
  portion_g: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
}

function rowToFood(row: FoodRow): Food {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    portionG: row.portion_g,
    calories: row.calories,
    proteinG: row.protein_g,
    carbsG: row.carbs_g,
    fatG: row.fat_g,
    fiberG: row.fiber_g,
  }
}

export class FoodRepository implements IFoodRepository {
  async search(query: string): Promise<Food[]> {
    const db = await getDatabase()
    const escaped = query.replace(/[\\%_]/g, '\\$&')
    const rows = await db.getAllAsync<FoodRow>(
      `SELECT * FROM foods WHERE name LIKE ? ESCAPE '\\' ORDER BY name LIMIT 30`,
      [`%${escaped}%`]
    )
    return rows.map(rowToFood)
  }

  async getById(id: number): Promise<Food | null> {
    const db = await getDatabase()
    const row = await db.getFirstAsync<FoodRow>(`SELECT * FROM foods WHERE id = ?`, [id])
    return row ? rowToFood(row) : null
  }

  async getByCategory(category: string): Promise<Food[]> {
    const db = await getDatabase()
    const rows = await db.getAllAsync<FoodRow>(
      `SELECT * FROM foods WHERE category = ? ORDER BY name`,
      [category]
    )
    return rows.map(rowToFood)
  }

  async getAll(): Promise<Food[]> {
    const db = await getDatabase()
    const rows = await db.getAllAsync<FoodRow>(`SELECT * FROM foods ORDER BY category, name`)
    return rows.map(rowToFood)
  }
}
