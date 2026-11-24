import { create } from 'zustand'
import { DiaryEntry } from '../../domain/entities/DiaryEntry'
import { localDateString } from '../../core/utils/date'

interface DiaryStore {
  date: string
  entries: DiaryEntry[]
  setDay: (date: string, entries: DiaryEntry[]) => void
}

export const useDiaryStore = create<DiaryStore>((set) => ({
  date: localDateString(),
  entries: [],
  setDay: (date, entries) => set({ date, entries }),
}))
