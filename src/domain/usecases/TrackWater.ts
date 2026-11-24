import { WaterLog } from '../entities/WaterLog'
import { IWaterRepository } from '../ports/IWaterRepository'

export async function addWater(repo: IWaterRepository, ml: number, goalMl: number): Promise<WaterLog> {
  return repo.addEntry(ml, goalMl)
}

export function isGoalReached(log: WaterLog): boolean {
  return log.totalMl >= log.goalMl
}

export function getRemainingMl(log: WaterLog): number {
  return Math.max(log.goalMl - log.totalMl, 0)
}

export function getProgressPercent(log: WaterLog): number {
  if (log.goalMl <= 0) return 0
  return Math.min(log.totalMl / log.goalMl, 1)
}
