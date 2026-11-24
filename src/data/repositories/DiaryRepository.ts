import AsyncStorage from '@react-native-async-storage/async-storage'
import { runExclusive } from '../../core/utils/keyedMutex'
import { DiaryEntry, NewDiaryEntry } from '../../domain/entities/DiaryEntry'
import { IDiaryRepository } from '../../domain/ports/IDiaryRepository'

const KEY_PREFIX = '@nutriapp:diary:'
const KEY = (date: string) => `${KEY_PREFIX}${date}`

function isValidDiaryEntry(entry: unknown): entry is DiaryEntry {
  if (typeof entry !== 'object' || entry === null) {
    return false
  }

  const candidate = entry as Record<string, unknown>

  const isValidMealTime =
    candidate.mealTime === 'breakfast' ||
    candidate.mealTime === 'lunch' ||
    candidate.mealTime === 'dinner' ||
    candidate.mealTime === 'snack'

  return (
    typeof candidate.id === 'string' &&
    isValidMealTime &&
    typeof candidate.calories === 'number' &&
    Number.isFinite(candidate.calories) &&
    typeof candidate.proteinG === 'number' &&
    Number.isFinite(candidate.proteinG) &&
    typeof candidate.carbsG === 'number' &&
    Number.isFinite(candidate.carbsG) &&
    typeof candidate.fatG === 'number' &&
    Number.isFinite(candidate.fatG) &&
    typeof candidate.grams === 'number' &&
    Number.isFinite(candidate.grams)
  )
}

export class DiaryRepository implements IDiaryRepository {
  async getByDate(date: string): Promise<DiaryEntry[]> {
    const raw = await AsyncStorage.getItem(KEY(date))
    if (!raw) return []
    try {
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter(isValidDiaryEntry) : []
    } catch {
      return []
    }
  }

  async add(entry: NewDiaryEntry): Promise<DiaryEntry> {
    return runExclusive(KEY(entry.date), async () => {
      const newEntry: DiaryEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      }
      const entries = await this.getByDate(entry.date)
      entries.push(newEntry)
      await AsyncStorage.setItem(KEY(entry.date), JSON.stringify(entries))
      return newEntry
    })
  }

  async remove(date: string, id: string): Promise<void> {
    return runExclusive(KEY(date), async () => {
      const entries = await this.getByDate(date)
      const updated = entries.filter((e) => e.id !== id)
      await AsyncStorage.setItem(KEY(date), JSON.stringify(updated))
    })
  }

  async clearAll(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys()
    const diaryKeys = keys.filter((k) => k.startsWith(KEY_PREFIX))
    if (diaryKeys.length > 0) {
      await AsyncStorage.multiRemove(diaryKeys)
    }
  }
}

