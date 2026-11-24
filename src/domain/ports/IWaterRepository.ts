import { WaterLog } from '../entities/WaterLog'

export interface IWaterRepository {
  getTodayLog(): Promise<WaterLog | null>
  addEntry(ml: number, goalMl: number): Promise<WaterLog>
  saveLog(log: WaterLog): Promise<void>
  getHistory(days: number): Promise<WaterLog[]>
  clearToday(): Promise<void>
}
