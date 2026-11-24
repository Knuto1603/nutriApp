import { create } from 'zustand'
import { User } from '../../domain/entities/User'

interface ProfileStore {
  user: User | null
  loaded: boolean
  setUser: (u: User | null) => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  user: null,
  loaded: false,
  setUser: (u) => set({ user: u, loaded: true }),
}))
