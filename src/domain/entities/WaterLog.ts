export interface WaterEntry {
  time: string
  ml: number
}

export interface WaterLog {
  date: string
  entries: WaterEntry[]
  totalMl: number
  goalMl: number
}
