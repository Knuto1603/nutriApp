import AsyncStorage from '@react-native-async-storage/async-storage'
import { Challenge } from '../../domain/entities/Challenge'
import { IChallengeRepository } from '../../domain/ports/IChallengeRepository'
import { INITIAL_CHALLENGES } from '../local/asyncStorage/challengeSeed'

const KEY = '@nutriapp:challenges'
const BACKUP_KEY = '@nutriapp:challenges:backup'

function isValidChallenge(item: unknown): item is Challenge {
  if (!item || typeof item !== 'object') {
    return false
  }
  const candidate = item as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    typeof candidate.targetDays === 'number' &&
    Number.isFinite(candidate.targetDays) &&
    typeof candidate.completedDays === 'number' &&
    Number.isFinite(candidate.completedDays) &&
    typeof candidate.points === 'number' &&
    Number.isFinite(candidate.points)
  )
}

export class ChallengeRepository implements IChallengeRepository {
  async load(): Promise<Challenge[]> {
    const raw = await AsyncStorage.getItem(KEY)
    if (!raw) {
      await this.save(INITIAL_CHALLENGES)
      return INITIAL_CHALLENGES
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      await AsyncStorage.setItem(BACKUP_KEY, raw)
      await this.save(INITIAL_CHALLENGES)
      return INITIAL_CHALLENGES
    }

    if (!Array.isArray(parsed)) {
      await AsyncStorage.setItem(BACKUP_KEY, raw)
      await this.save(INITIAL_CHALLENGES)
      return INITIAL_CHALLENGES
    }

    const validStored: Challenge[] = parsed.filter(isValidChallenge)
    const storedIds = new Set(validStored.map((c) => c.id))
    const newOnes = INITIAL_CHALLENGES.filter((c) => !storedIds.has(c.id))

    if (newOnes.length > 0 || validStored.length !== parsed.length) {
      const merged = [...validStored, ...newOnes]
      await this.save(merged)
      return merged
    }

    return validStored
  }

  async save(challenges: Challenge[]): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(challenges))
  }
}

