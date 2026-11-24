import AsyncStorage from '@react-native-async-storage/async-storage'
import { DiaryEntry, NewDiaryEntry } from '../../domain/entities/DiaryEntry'
import { IDiaryRepository } from '../../domain/ports/IDiaryRepository'

const KEY_PREFIX = '@nutriapp:diary:'
const KEY = (date: string) => `${KEY_PREFIX}${date}`

export class DiaryRepository implements IDiaryRepository {
  async getByDate(date: string): Promise<DiaryEntry[]> {
    const raw = await AsyncStorage.getItem(KEY(date))
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  async add(entry: NewDiaryEntry): Promise<DiaryEntry> {
    const newEntry: DiaryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }
    const entries = await this.getByDate(entry.date)
    entries.push(newEntry)
    await AsyncStorage.setItem(KEY(entry.date), JSON.stringify(entries))
    return newEntry
  }

  async remove(date: string, id: string): Promise<void> {
    const entries = await this.getByDate(date)
    const updated = entries.filter((e) => e.id !== id)
    await AsyncStorage.setItem(KEY(date), JSON.stringify(updated))
  }

  async clearAll(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys()
    const diaryKeys = keys.filter((k) => k.startsWith(KEY_PREFIX))
    if (diaryKeys.length > 0) {
      await AsyncStorage.multiRemove(diaryKeys)
    }
  }
}
