import { useEffect, useMemo } from 'react'
import { UserRepository } from '../../data/local/asyncStorage/UserStorage'
import { User } from '../../domain/entities/User'
import { calculateNutrition } from '../../domain/usecases/CalculateNutrition'
import { useProfileStore } from '../stores/profileStore'

const repo = new UserRepository()

export function useNutrition() {
  const user = useProfileStore((s) => s.user)
  const loaded = useProfileStore((s) => s.loaded)
  const setUser = useProfileStore((s) => s.setUser)

  useEffect(() => {
    if (!loaded) {
      repo.get().then((saved) => {
        setUser(saved)
      })
    }
  }, [loaded, setUser])

  const result = useMemo(() => (user ? calculateNutrition(user) : null), [user])

  async function saveProfile(data: User) {
    await repo.save(data)
    setUser(data)
  }

  async function clearProfile() {
    await repo.clear()
    setUser(null)
  }

  return { user, result, loading: !loaded, saveProfile, clearProfile }
}
