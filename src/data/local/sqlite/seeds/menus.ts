import { Meal, MealTime } from '../../../../domain/entities/Meal'

interface MenuOption {
  title: string
  time: MealTime
  minCal: number
  maxCal: number
  items: { name: string; portionG: number; calories: number }[]
  proteinG: number
  carbsG: number
  fatG: number
}

export const MENU_OPTIONS: MenuOption[] = [
  // ─── DESAYUNOS ───────────────────────────────────────────────────────────────
  {
    title: 'Avena con frutas y huevo',
    time: 'breakfast', minCal: 300, maxCal: 600,
    items: [
      { name: 'Avena cocida', portionG: 150, calories: 107 },
      { name: 'Plátano de seda', portionG: 100, calories: 89 },
      { name: 'Huevo sancochado', portionG: 50, calories: 78 },
      { name: 'Té sin azúcar', portionG: 200, calories: 2 },
    ],
    proteinG: 13, carbsG: 48, fatG: 6,
  },
  {
    title: 'Pan integral con palta y huevo',
    time: 'breakfast', minCal: 300, maxCal: 700,
    items: [
      { name: 'Pan integral', portionG: 60, calories: 136 },
      { name: 'Palta', portionG: 80, calories: 128 },
      { name: 'Huevo a la plancha', portionG: 50, calories: 78 },
      { name: 'Café sin azúcar', portionG: 200, calories: 5 },
    ],
    proteinG: 12, carbsG: 28, fatG: 18,
  },
  {
    title: 'Quinua con leche y frutas',
    time: 'breakfast', minCal: 350, maxCal: 650,
    items: [
      { name: 'Quinua cocida', portionG: 150, calories: 180 },
      { name: 'Leche descremada', portionG: 200, calories: 68 },
      { name: 'Papaya', portionG: 150, calories: 55 },
      { name: 'Té de manzanilla', portionG: 200, calories: 1 },
    ],
    proteinG: 14, carbsG: 52, fatG: 4,
  },
  {
    title: 'Yogurt griego con granola y mango',
    time: 'breakfast', minCal: 400, maxCal: 750,
    items: [
      { name: 'Yogurt griego natural', portionG: 200, calories: 97 },
      { name: 'Granola sin azúcar', portionG: 40, calories: 160 },
      { name: 'Mango', portionG: 150, calories: 74 },
    ],
    proteinG: 16, carbsG: 45, fatG: 7,
  },
  {
    title: 'Desayuno alto en proteínas',
    time: 'breakfast', minCal: 500, maxCal: 900,
    items: [
      { name: 'Avena cocida', portionG: 150, calories: 107 },
      { name: '2 huevos revueltos', portionG: 100, calories: 155 },
      { name: 'Queso fresco', portionG: 50, calories: 98 },
      { name: 'Naranja', portionG: 150, calories: 62 },
    ],
    proteinG: 22, carbsG: 38, fatG: 14,
  },

  // ─── ALMUERZOS ───────────────────────────────────────────────────────────────
  {
    title: 'Arroz con pollo y ensalada',
    time: 'lunch', minCal: 500, maxCal: 900,
    items: [
      { name: 'Arroz blanco cocido', portionG: 150, calories: 195 },
      { name: 'Pechuga de pollo a la plancha', portionG: 150, calories: 248 },
      { name: 'Ensalada de tomate y pepino', portionG: 150, calories: 26 },
      { name: 'Refresco de maracuyá sin azúcar', portionG: 300, calories: 18 },
    ],
    proteinG: 48, carbsG: 58, fatG: 8,
  },
  {
    title: 'Lentejas con arroz integral y pollo',
    time: 'lunch', minCal: 550, maxCal: 950,
    items: [
      { name: 'Arroz integral cocido', portionG: 150, calories: 167 },
      { name: 'Lentejas guisadas', portionG: 150, calories: 174 },
      { name: 'Pollo cocido', portionG: 100, calories: 215 },
      { name: 'Zanahoria sancochada', portionG: 100, calories: 41 },
    ],
    proteinG: 45, carbsG: 62, fatG: 10,
  },
  {
    title: 'Caldo de pollo con quinua',
    time: 'lunch', minCal: 400, maxCal: 700,
    items: [
      { name: 'Caldo de pollo', portionG: 300, calories: 86 },
      { name: 'Quinua cocida', portionG: 100, calories: 120 },
      { name: 'Papa sancochada', portionG: 150, calories: 116 },
      { name: 'Brócoli sancochado', portionG: 100, calories: 35 },
    ],
    proteinG: 18, carbsG: 55, fatG: 4,
  },
  {
    title: 'Atún con ensalada y papa',
    time: 'lunch', minCal: 450, maxCal: 800,
    items: [
      { name: 'Atún en agua', portionG: 150, calories: 174 },
      { name: 'Papa sancochada', portionG: 200, calories: 154 },
      { name: 'Ensalada verde', portionG: 150, calories: 25 },
      { name: 'Aceite de oliva', portionG: 10, calories: 88 },
    ],
    proteinG: 40, carbsG: 38, fatG: 14,
  },
  {
    title: 'Menú completo alto en calorías',
    time: 'lunch', minCal: 700, maxCal: 1200,
    items: [
      { name: 'Arroz blanco cocido', portionG: 200, calories: 260 },
      { name: 'Carne de res magra', portionG: 150, calories: 375 },
      { name: 'Frijoles negros', portionG: 150, calories: 198 },
      { name: 'Ensalada de tomate', portionG: 100, calories: 18 },
    ],
    proteinG: 58, carbsG: 72, fatG: 18,
  },

  // ─── CENAS ───────────────────────────────────────────────────────────────────
  {
    title: 'Sopa de verduras con pan integral',
    time: 'dinner', minCal: 250, maxCal: 550,
    items: [
      { name: 'Sopa de verduras', portionG: 300, calories: 75 },
      { name: 'Pan integral', portionG: 60, calories: 136 },
      { name: 'Queso fresco', portionG: 30, calories: 59 },
    ],
    proteinG: 12, carbsG: 38, fatG: 8,
  },
  {
    title: 'Huevo a la plancha con verduras',
    time: 'dinner', minCal: 300, maxCal: 600,
    items: [
      { name: '2 huevos a la plancha', portionG: 100, calories: 155 },
      { name: 'Espinaca salteada', portionG: 150, calories: 35 },
      { name: 'Pan integral', portionG: 40, calories: 91 },
      { name: 'Té de hierbas', portionG: 200, calories: 1 },
    ],
    proteinG: 18, carbsG: 24, fatG: 12,
  },
  {
    title: 'Yogurt con frutas y almendras',
    time: 'dinner', minCal: 250, maxCal: 500,
    items: [
      { name: 'Yogurt griego natural', portionG: 200, calories: 97 },
      { name: 'Manzana', portionG: 150, calories: 78 },
      { name: 'Almendras', portionG: 20, calories: 116 },
    ],
    proteinG: 14, carbsG: 28, fatG: 12,
  },
  {
    title: 'Fideos con atún y verduras',
    time: 'dinner', minCal: 400, maxCal: 750,
    items: [
      { name: 'Fideos cocidos', portionG: 150, calories: 197 },
      { name: 'Atún en agua', portionG: 100, calories: 116 },
      { name: 'Tomate fresco', portionG: 100, calories: 18 },
      { name: 'Aceite de oliva', portionG: 5, calories: 44 },
    ],
    proteinG: 30, carbsG: 48, fatG: 8,
  },
  {
    title: 'Cena alta en proteínas',
    time: 'dinner', minCal: 500, maxCal: 900,
    items: [
      { name: 'Arroz integral cocido', portionG: 150, calories: 167 },
      { name: 'Pechuga de pollo al horno', portionG: 150, calories: 248 },
      { name: 'Brócoli al vapor', portionG: 150, calories: 53 },
    ],
    proteinG: 48, carbsG: 38, fatG: 8,
  },

  // ─── SNACKS ──────────────────────────────────────────────────────────────────
  {
    title: 'Fruta de temporada',
    time: 'snack', minCal: 60, maxCal: 200,
    items: [{ name: 'Plátano de seda', portionG: 100, calories: 89 }],
    proteinG: 1, carbsG: 23, fatG: 0,
  },
  {
    title: 'Frutos secos',
    time: 'snack', minCal: 100, maxCal: 300,
    items: [
      { name: 'Almendras', portionG: 30, calories: 173 },
      { name: 'Maní tostado', portionG: 20, calories: 117 },
    ],
    proteinG: 9, carbsG: 8, fatG: 18,
  },
  {
    title: 'Manzana con maní',
    time: 'snack', minCal: 100, maxCal: 250,
    items: [
      { name: 'Manzana', portionG: 150, calories: 78 },
      { name: 'Maní tostado', portionG: 20, calories: 117 },
    ],
    proteinG: 5, carbsG: 28, fatG: 10,
  },
]

export function pickMeal(time: MealTime, targetCal: number, excludeId?: string): Meal {
  const options = MENU_OPTIONS.filter(
    (m) => m.time === time && targetCal >= m.minCal && targetCal <= m.maxCal
  )
  const pool = options.length > 0 ? options : MENU_OPTIONS.filter((m) => m.time === time)
  const filtered = excludeId ? pool.filter((_, i) => `${time}-${i}` !== excludeId) : pool
  const source = filtered.length > 0 ? filtered : pool

  const idx = Math.floor(Math.random() * source.length)
  const opt = source[idx]
  const realIdx = MENU_OPTIONS.indexOf(opt)

  return {
    id: `${time}-${realIdx}`,
    time: opt.time,
    title: opt.title,
    items: opt.items,
    totalCalories: opt.items.reduce((s, i) => s + i.calories, 0),
    proteinG: opt.proteinG,
    carbsG: opt.carbsG,
    fatG: opt.fatG,
  }
}
