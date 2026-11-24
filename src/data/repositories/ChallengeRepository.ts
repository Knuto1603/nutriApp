import AsyncStorage from '@react-native-async-storage/async-storage'
import { Challenge } from '../../domain/entities/Challenge'
import { IChallengeRepository } from '../../domain/ports/IChallengeRepository'
import { INITIAL_CHALLENGES } from '../local/asyncStorage/challengeSeed'

const KEY = '@nutriapp:challenges'

export class ChallengeRepository implements IChallengeRepository {
  async load(): Promise<Challenge[]> {
    const raw = await AsyncStorage.getItem(KEY)
    if (!raw) {
      await this.save(INITIAL_CHALLENGES)
      return INITIAL_CHALLENGES
    }

    try {
      const stored: Challenge[] = JSON.parse(raw)
      const storedIds = new Set(stored.map((c) => c.id))
      const newOnes = INITIAL_CHALLENGES.filter((c) => !storedIds.has(c.id))
      if (newOnes.length > 0) {
        const merged = [...stored, ...newOnes]
        await this.save(merged)
        return merged
      }
      return stored
    } catch {
      await this.save(INITIAL_CHALLENGES)
      return INITIAL_CHALLENGES
    }
  }

  async save(challenges: Challenge[]): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(challenges))
  }
}
