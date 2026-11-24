import { Food } from '../../../domain/entities/Food'

const BASE_URL = 'https://world.openfoodfacts.org/cgi/search.pl'

interface OFFProduct {
  product_name?: string
  product_name_es?: string
  categories_tags?: string[]
  nutriments?: {
    'energy-kcal_100g'?: number
    proteins_100g?: number
    carbohydrates_100g?: number
    fat_100g?: number
    fiber_100g?: number
  }
}

interface OFFResponse {
  products: OFFProduct[]
}

function mapCategory(tags: string[] = []): string {
  const joined = tags.join(' ')
  if (joined.includes('cereal') || joined.includes('grain') || joined.includes('bread') || joined.includes('rice') || joined.includes('pasta')) return 'Cereales'
  if (joined.includes('meat') || joined.includes('fish') || joined.includes('egg') || joined.includes('poultry') || joined.includes('seafood')) return 'Proteínas'
  if (joined.includes('legume') || joined.includes('bean') || joined.includes('lentil')) return 'Legumbres'
  if (joined.includes('vegetable') || joined.includes('vegetal')) return 'Verduras'
  if (joined.includes('fruit') || joined.includes('fruta')) return 'Frutas'
  if (joined.includes('dairy') || joined.includes('milk') || joined.includes('cheese') || joined.includes('yogurt')) return 'Lácteos'
  if (joined.includes('snack') || joined.includes('beverage') || joined.includes('soda') || joined.includes('candy')) return 'Ultraprocesados'
  return 'Otros'
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

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
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

    const data: OFFResponse = await response.json()

    return data.products
      .filter((p) => {
        const n = p.nutriments
        const name = pickName(p)
        return (
          name !== 'Sin nombre' &&
          n?.['energy-kcal_100g'] != null &&
          n?.proteins_100g != null &&
          n?.carbohydrates_100g != null &&
          n?.fat_100g != null
        )
      })
      .map((p): Food => {
        const name = pickName(p)
        return {
          id: hashName(name),
          name,
          category: mapCategory(p.categories_tags),
          portionG: 100,
          calories: Math.round(p.nutriments!['energy-kcal_100g']!),
          proteinG: parseFloat((p.nutriments!.proteins_100g ?? 0).toFixed(1)),
          carbsG: parseFloat((p.nutriments!.carbohydrates_100g ?? 0).toFixed(1)),
          fatG: parseFloat((p.nutriments!.fat_100g ?? 0).toFixed(1)),
          fiberG: parseFloat((p.nutriments!.fiber_100g ?? 0).toFixed(1)),
        }
      })
  } finally {
    clearTimeout(timeoutId)
    if (signal) {
      signal.removeEventListener('abort', onAbort)
    }
  }
}
