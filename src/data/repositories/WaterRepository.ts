import AsyncStorage from '@react-native-async-storage/async-storage'
import { WaterLog, WaterEntry } from '../../domain/entities/WaterLog'
import { IWaterRepository } from '../../domain/ports/IWaterRepository'
import { localDateString } from '../../core/utils/date'
import { runExclusive } from '../../core/utils/keyedMutex'

const KEY = (date: string) => `@nutriapp:water:${date}`

function today(): string {
  return localDateString()
}

function isValidWaterLog(value: unknown): value is WaterLog {
  if (!value || typeof value !== 'object') {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.date === 'string' &&
    Array.isArray(candidate.entries) &&
    typeof candidate.totalMl === 'number' &&
    Number.isFinite(candidate.totalMl) &&
    typeof candidate.goalMl === 'number' &&
    Number.isFinite(candidate.goalMl)
  )
}

export class WaterRepository implements IWaterRepository {
  private async readLog(date: string): Promise<WaterLog | null> {
    try {
      const raw = await AsyncStorage.getItem(KEY(date))
      if (!raw) return null
      const parsed: unknown = JSON.parse(raw)
      return isValidWaterLog(parsed) ? parsed : null
    } catch {
      return null
    }
  }

  async getTodayLog(): Promise<WaterLog | null> {
    return this.readLog(today())
  }

  async addEntry(ml: number, goalMl: number): Promise<WaterLog> {
    const date = today()
    return runExclusive(KEY(date), async () => {
      const existing = await this.readLog(date)
      const entries: WaterEntry[] = existing?.entries ? [...existing.entries] : []

      entries.push({ time: new Date().toISOString(), ml })

      const log: WaterLog = {
        date,
        entries,
        totalMl: entries.reduce((s, e) => s + e.ml, 0),
        goalMl,
      }

      await AsyncStorage.setItem(KEY(date), JSON.stringify(log))
      return log
    })
  }

  async getHistory(days: number): Promise<WaterLog[]> {
    const logs: WaterLog[] = []
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const date = localDateString(d)
      const log = await this.readLog(date)
      if (log) {
        logs.push(log)
      }
    }
    return logs
  }

  async saveLog(log: WaterLog): Promise<void> {
    await AsyncStorage.setItem(KEY(log.date), JSON.stringify(log))
  }

  async clearToday(): Promise<void> {
    await AsyncStorage.removeItem(KEY(today()))
  }
}

