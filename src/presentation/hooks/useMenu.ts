import { useEffect, useState } from 'react'
import { UserRepository } from '../../data/local/asyncStorage/UserStorage'
import { MenuRepository } from '../../data/repositories/MenuRepository'
import { DailyMenu } from '../../domain/entities/Meal'
import { calculateNutrition } from '../../domain/usecases/CalculateNutrition'
import { getDailyMenu } from '../../domain/usecases/GetDailyMenu'

const userRepo = new UserRepository()
const menuRepo = new MenuRepository()

export function useMenu() {
  const [menu, setMenu] = useState<DailyMenu | null>(null)
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMenu()
  }, [])

  async function loadMenu() {
    try {
      const user = await userRepo.get()
      if (!user) { setHasProfile(false); return }
      const { dailyCalories } = calculateNutrition(user)
      setMenu(getDailyMenu(menuRepo, dailyCalories))
      setHasProfile(true)
      setError(null)
    } catch {
      setError('No se pudo generar el menú. Intenta de nuevo.')
    }
  }

  function regenerate() {
    setError(null)
    userRepo.get().then((user) => {
      if (!user) return
      try {
        const { dailyCalories } = calculateNutrition(user)
        setMenu(getDailyMenu(menuRepo, dailyCalories))
      } catch {
        setError('No se pudo generar el menú. Intenta de nuevo.')
      }
    })
  }

  return { menu, hasProfile, error, regenerate }
}
