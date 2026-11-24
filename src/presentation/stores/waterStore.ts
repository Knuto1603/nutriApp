import { create } from 'zustand'
import { WaterLog } from '../../domain/entities/WaterLog'

interface WaterStore {
  log: WaterLog | null
  setLog: (log: WaterLog) => void
}

export const useWaterStore = create<WaterStore>((set) => ({
  log: null,
  setLog: (log) => set({ log }),
}))
