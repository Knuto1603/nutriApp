import { DiaryEntry, NewDiaryEntry } from '../entities/DiaryEntry'

export interface IDiaryRepository {
  getByDate(date: string): Promise<DiaryEntry[]>
  add(entry: NewDiaryEntry): Promise<DiaryEntry>
  remove(date: string, id: string): Promise<void>
  clearAll(): Promise<void>
}
