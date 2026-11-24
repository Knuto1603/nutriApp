import AsyncStorage from '@react-native-async-storage/async-storage'
import { WaterLog, WaterEntry } from '../../domain/entities/WaterLog'
import { IWaterRepository } from '../../domain/ports/IWaterRepository'
import { localDateString } from '../../core/utils/date'

const KEY = (date: string) => `@nutriapp:water:${date}`

function today(): string {
  return localDateString()
}

export class WaterRepository implements IWaterRepository {
  async getTodayLog(): Promise<WaterLog | null> {
    const raw = await AsyncStorage.getItem(KEY(today()))
    return raw ? JSON.parse(raw) : null
  }

  async addEntry(ml: number, goalMl: number): Promise<WaterLog> {
    const date = today()
    const existing = await this.getTodayLog()
    const entries: WaterEntry[] = existing?.entries ?? []

    entries.push({ time: new Date().toISOString(), ml })

    const log: WaterLog = {
      date,
      entries,
      totalMl: entries.reduce((s, e) => s + e.ml, 0),
      goalMl,
    }

    await AsyncStorage.setItem(KEY(date), JSON.stringify(log))
    return log
  }

  async getHistory(days: number): Promise<WaterLog[]> {
    const logs: WaterLog[] = []
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const date = localDateString(d)
      const raw = await AsyncStorage.getItem(KEY(date))
      if (raw) logs.push(JSON.parse(raw))
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
