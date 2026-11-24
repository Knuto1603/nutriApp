import { create } from 'zustand'
import { localDateString } from '../../core/utils/date'
import { ChallengeRepository } from '../../data/repositories/ChallengeRepository'
import { Challenge } from '../../domain/entities/Challenge'
import { markDayCompleted } from '../../domain/usecases/GetChallenges'

const repo = new ChallengeRepository()

interface ChallengeStore {
  challenges: Challenge[]
  loaded: boolean
  load: () => Promise<void>
  completeDay: (id: string) => Promise<void>
  activate: (id: string) => Promise<void>
}

export const useChallengeStore = create<ChallengeStore>((set, get) => ({
  challenges: [],
  loaded: false,

  load: async () => {
    const challenges = await repo.load()
    set({ challenges, loaded: true })
  },

  completeDay: async (id: string) => {
    const today = localDateString()
    const updated = get().challenges.map((c) =>
      c.id === id ? markDayCompleted(c, today) : c
    )
    set({ challenges: updated })
    await repo.save(updated)
  },

  activate: async (id: string) => {
    const updated = get().challenges.map((c) =>
      c.id === id ? { ...c, isActive: true } : c
    )
    set({ challenges: updated })
    await repo.save(updated)
  },
}))
