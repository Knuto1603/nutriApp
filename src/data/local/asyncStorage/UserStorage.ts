import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../../../domain/entities/User'
import { IUserRepository } from '../../../domain/ports/IUserRepository'

const KEY = '@nutriapp:user'

export class UserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(user))
  }

  async get(): Promise<User | null> {
    const raw = await AsyncStorage.getItem(KEY)
    if (!raw) return null
    const user = JSON.parse(raw) as User
    return {
      ...user,
      goal: user.goal ?? 'maintain',
    }
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(KEY)
  }
}
