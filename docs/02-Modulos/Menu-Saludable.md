---
type: nota
tags: [modulo, menu, alimentacion, nutriapp]
estado: completado
created: 2026-07-02
updated: 2026-07-05
links: [[Calculadora-Nutricional]], [[Alimentos]]
---

# Módulo: Menú Saludable ✅

## Cómo usar

1. Completar primero el perfil en el tab **Nutrición**
2. Ir al tab **Menú diario** (ícono 🍽️)
3. Ver el menú generado automáticamente para hoy
4. Tocar **"Generar otro menú"** para obtener una variante diferente

> Si no hay perfil creado, la pantalla muestra un mensaje guía hacia el tab Nutrición.

---

## Lógica de selección implementada

```
Perfil usuario → dailyCalories (del useNutrition)
        ↓
getDailyMenu(dailyCalories)
        ↓
pickMeal('breakfast', dailyCalories × 0.25)  → Desayuno
pickMeal('lunch',     dailyCalories × 0.40)  → Almuerzo
pickMeal('dinner',    dailyCalories × 0.25)  → Cena
pickMeal('snack',     dailyCalories × 0.10)  → Snack
        ↓
Filtra opciones cuyo rango calórico coincide
Si ninguna coincide → usa todas las de ese tiempo
Selección aleatoria entre las opciones válidas
```

---

## Distribución calórica por tiempo de comida

| Tiempo | % calorías | Ejemplo a 2,000 kcal |
|--------|-----------|----------------------|
| Desayuno | 25% | ~500 kcal |
| Almuerzo | 40% | ~800 kcal |
| Cena | 25% | ~500 kcal |
| Snack | 10% | ~200 kcal |

---

## Catálogo de opciones implementado (17 menús)

### Desayunos (5 opciones)
| Opción | Kcal aprox. |
|--------|------------|
| Avena con frutas y huevo | 276 kcal |
| Pan integral con palta y huevo | 347 kcal |
| Quinua con leche y frutas | 304 kcal |
| Yogurt griego con granola y mango | 331 kcal |
| Desayuno alto en proteínas | 422 kcal |

### Almuerzos (5 opciones)
| Opción | Kcal aprox. |
|--------|------------|
| Arroz con pollo y ensalada | 487 kcal |
| Lentejas con arroz integral y pollo | 597 kcal |
| Caldo de pollo con quinua | 357 kcal |
| Atún con ensalada y papa | 441 kcal |
| Menú completo alto en calorías | 851 kcal |

### Cenas (4 opciones)
| Opción | Kcal aprox. |
|--------|------------|
| Sopa de verduras con pan integral | 270 kcal |
| Huevo a la plancha con verduras | 282 kcal |
| Yogurt con frutas y almendras | 291 kcal |
| Fideos con atún y verduras | 375 kcal |
| Cena alta en proteínas | 468 kcal |

### Snacks (3 opciones)
| Opción | Kcal aprox. |
|--------|------------|
| Fruta de temporada | 89 kcal |
| Frutos secos | 290 kcal |
| Manzana con maní | 195 kcal |

---

## Entidades implementadas

```typescript
type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack'

interface MealItem {
  name: string
  portionG: number
  calories: number
}

interface Meal {
  id: string
  time: MealTime
  title: string
  items: MealItem[]
  totalCalories: number
  proteinG: number
  carbsG: number
  fatG: number
}

interface DailyMenu {
  date: string
  targetCalories: number
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  snack: Meal
}
```

---

## Archivos implementados

| Componente | Archivo | Responsabilidad |
|------------|---------|----------------|
| Entidad | `src/domain/entities/Meal.ts` | Tipos Meal, DailyMenu, MealTime, MealItem |
| Seed | `src/data/local/sqlite/seeds/menus.ts` | 17 opciones de comida + función `pickMeal` |
| Use Case | `src/domain/usecases/GetDailyMenu.ts` | Genera DailyMenu distribuyendo calorías |
| Hook | `src/presentation/hooks/useMenu.ts` | Lee perfil → calcula → genera menú |
| Pantalla | `src/presentation/screens/MenuScreen/index.tsx` | Cards por tiempo + barra progreso + regenerar |

---

## Lo que muestra la pantalla

- Fecha de hoy (en español)
- Total de calorías del menú vs objetivo diario
- Barra de progreso (% del objetivo cubierto)
- Card por cada tiempo de comida con:
  - Nombre del menú y tipo de comida
  - Lista de ítems con porción y calorías
  - Macros (Proteínas / Carbos / Grasas) en píldoras
  - Horario sugerido
- Botón "Generar otro menú"

---

## Estado de desarrollo

- [x] Definir entidad `Meal.ts`
- [x] Crear seed de 17 menús con alimentos peruanos
- [x] Implementar `pickMeal` con selección por rango calórico
- [x] Implementar `GetDailyMenu` use case
- [x] Crear hook `useMenu` (lee perfil y genera menú)
- [x] Diseñar `MenuScreen` con cards por tiempo de comida
- [x] Barra de progreso calórico diario
- [x] Botón "Generar otro menú"
- [x] Pantalla de perfil faltante si no hay datos

---

## Referencias

- [[Calculadora-Nutricional]] — provee `dailyCalories` para seleccionar menús
- [[Alimentos]] — base de datos de los ingredientes usados
- [[../01-Arquitectura/Patrones-Disenio]] — Factory Pattern en `pickMeal`
