import { Food } from '../../../domain/entities/Food'

const BASE_URL = 'https://world.openfoodfacts.org/cgi/search.pl'

const CEREAL_TAGS = new Set([
  'cereal', 'cereals', 'cereal-grains', 'grains', 'grain', 'bread', 'breads',
  'rice', 'pasta', 'pastas', 'cereal-bars', 'breakfast-cereals',
  'flours', 'flour', 'oats', 'wheat', 'corn', 'cereales', 'pan', 'arroz',
])

const PROTEIN_TAGS = new Set([
  'meat', 'meats', 'fish', 'fishes', 'egg', 'eggs', 'poultry',
  'seafood', 'beef', 'pork', 'chicken', 'tuna', 'salmon',
  'carnes', 'carne', 'pescados', 'pescado', 'huevos', 'huevo', 'pollos', 'pollo', 'mariscos',
])

const LEGUME_TAGS = new Set([
  'legume', 'legumes', 'legume-based-foods', 'pulses', 'pulse', 'bean', 'beans',
  'lentil', 'lentils', 'chickpea', 'chickpeas', 'pea', 'peas',
  'soybeans', 'soybean', 'legumbres', 'legumbre', 'frijoles', 'frijol', 'lentejas', 'lenteja', 'garbanzos', 'garbanzo', 'alubias',
])

const FRUIT_TAGS = new Set([
  'fruit', 'fruits', 'fresh-fruits', 'fruit-based-foods', 'frozen-fruits',
  'dried-fruits', 'citrus-fruits', 'tropical-fruits', 'berries',
  'apples', 'bananas', 'oranges', 'fruta', 'frutas', 'frutas-frescas',
])

const VEGETABLE_TAGS = new Set([
  'vegetable', 'vegetables', 'fresh-vegetables', 'vegetable-based-foods',
  'frozen-vegetables', 'leaf-vegetables', 'root-vegetables', 'salads', 'salad',
  'tomatoes', 'green-beans', 'verdura', 'verduras', 'hortalizas', 'vegetales', 'vegetal',
])

const DAIRY_TAGS = new Set([
  'dairy', 'dairies', 'milk', 'milks', 'cheese', 'cheeses',
  'yogurt', 'yogurts', 'fermented-milk-products',
  'lacteos', 'lacteo', 'leches', 'leche', 'quesos', 'queso', 'yogures', 'yogur',
])

const ULTRAPROCESSED_TAGS = new Set([
  'snack', 'snacks', 'sweet-snacks', 'salty-snacks', 'beverage', 'beverages',
  'soda', 'sodas', 'candy', 'candies', 'confectioneries', 'confectionery',
  'chocolates', 'chocolate', 'biscuits', 'biscuit', 'cakes', 'cake',
  'pastries', 'pastry', 'fast-food', 'ultra-processed-foods',
  'bebidas', 'bebida', 'dulces', 'dulce', 'refrescos', 'refresco',
])

interface OFFNutriments {
  'energy-kcal_100g'?: number | string
  proteins_100g?: number | string
  carbohydrates_100g?: number | string
  fat_100g?: number | string
  fiber_100g?: number | string
}

interface OFFProduct {
  product_name?: string
  product_name_es?: string
  categories_tags?: string[]
  nutriments?: OFFNutriments
}

interface OFFResponse {
  products?: OFFProduct[]
}

function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/^[a-z]{2,3}:/, '').trim()
}

function mapCategory(tags: string[] = []): string {
  if (!Array.isArray(tags)) return 'Otros'
  const normalized = tags
    .filter((t): t is string => typeof t === 'string')
    .map(normalizeTag)
  const hasTag = (set: Set<string>) => normalized.some((t) => set.has(t))

  if (hasTag(CEREAL_TAGS)) return 'Cereales'
  if (hasTag(PROTEIN_TAGS)) return 'Proteínas'
  if (hasTag(LEGUME_TAGS)) return 'Legumbres'
  if (hasTag(FRUIT_TAGS)) return 'Frutas'
  if (hasTag(VEGETABLE_TAGS)) return 'Verduras'
  if (hasTag(DAIRY_TAGS)) return 'Lácteos'
  if (hasTag(ULTRAPROCESSED_TAGS)) return 'Ultraprocesados'
  return 'Otros'
}

function toFiniteNumber(val: unknown): number | null {
  if (typeof val === 'number') {
    return Number.isFinite(val) ? val : null
  }
  if (typeof val === 'string' && val.trim() !== '') {
    const num = Number(val)
    return Number.isFinite(num) ? num : null
  }
  return null
}

function pickName(p: OFFProduct): string {
  return p.product_name_es?.trim() || p.product_name?.trim() || 'Sin nombre'
}

function hashName(name: string): number {
  let hash = 5381
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) + hash) ^ name.charCodeAt(i)
  }
  return 10000 + (hash >>> 0)
}

export async function searchOpenFoodFacts(
  query: string,
  signal?: AbortSignal
): Promise<Food[]> {
  const params = new URLSearchParams({
    search_terms: query,
    json: '1',
    page_size: '15',
    lc: 'es',
    cc: 'pe',
    fields: 'product_name,product_name_es,categories_tags,nutriments',
  })

  let didTimeout = false
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    didTimeout = true
    controller.abort()
  }, 8000)

  const onAbort = () => {
    controller.abort()
  }

  if (signal) {
    if (signal.aborted) {
      controller.abort()
    } else {
      signal.addEventListener('abort', onAbort, { once: true })
    }
  }

  try {
    const response = await fetch(`${BASE_URL}?${params}`, {
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new Error(`OpenFoodFacts HTTP error: ${response.status}`)
    }

    let data: unknown
    try {
      data = await response.json()
    } catch {
      return []
    }

    if (
      !data ||
      typeof data !== 'object' ||
      !Array.isArray((data as OFFResponse).products)
    ) {
      return []
    }

    const products = (data as OFFResponse).products!
    const result: Food[] = []

    for (const p of products) {
      if (!p || typeof p !== 'object') continue

      const name = pickName(p)
      if (name === 'Sin nombre') continue

      const n = p.nutriments
      if (!n || typeof n !== 'object') continue

      const calories = toFiniteNumber(n['energy-kcal_100g'])
      const protein = toFiniteNumber(n.proteins_100g)
      const carbs = toFiniteNumber(n.carbohydrates_100g)
      const fat = toFiniteNumber(n.fat_100g)

      if (calories === null || protein === null || carbs === null || fat === null) {
        continue
      }

      const fiber = toFiniteNumber(n.fiber_100g) ?? 0

      result.push({
        id: hashName(name),
        name,
        category: mapCategory(p.categories_tags),
        portionG: 100,
        calories: Math.round(calories),
        proteinG: parseFloat(protein.toFixed(1)),
        carbsG: parseFloat(carbs.toFixed(1)),
        fatG: parseFloat(fat.toFixed(1)),
        fiberG: parseFloat(fiber.toFixed(1)),
      })
    }

    return result
  } catch (error) {
    if (signal?.aborted) {
      throw error
    }
    if (didTimeout) {
      throw new Error('timeout')
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
    if (signal) {
      signal.removeEventListener('abort', onAbort)
    }
  }
}
