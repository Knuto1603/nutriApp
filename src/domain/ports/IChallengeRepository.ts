import { Challenge } from '../entities/Challenge'

export interface IChallengeRepository {
  load(): Promise<Challenge[]>
  save(challenges: Challenge[]): Promise<void>
}
