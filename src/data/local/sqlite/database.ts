import * as SQLite from 'expo-sqlite'
import { FOODS_SEED } from './seeds/foods'

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null

async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('nutriapp.db')
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS foods (
      id          INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      category    TEXT NOT NULL,
      portion_g   REAL NOT NULL,
      calories    REAL NOT NULL,
      protein_g   REAL NOT NULL,
      carbs_g     REAL NOT NULL,
      fat_g       REAL NOT NULL,
      fiber_g     REAL NOT NULL
    );
    ${FOODS_SEED}
  `)
  return db
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = initDatabase().catch((err) => {
      dbPromise = null
      throw err
    })
  }
  return dbPromise
}
