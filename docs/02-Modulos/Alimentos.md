---
type: nota
tags: [modulo, alimentos, nutricion, base-datos, nutriapp]
estado: completado
created: 2026-07-02
links: [[Menu-Saludable]], [[Calculadora-Nutricional]]
---

# Módulo: Alimentos

## Descripción

Permite al estudiante **buscar alimentos** y consultar su información nutricional detallada (calorías, proteínas, carbohidratos, grasas, fibra).

---

## Fuentes de datos

### Base de datos local (SQLite) — offline-first

Contiene **54 alimentos comunes del contexto peruano**:

| Categoría | Ejemplos |
|-----------|---------|
| Cereales | Arroz, quinua, avena, pan integral, fideos |
| Proteínas | Pollo, huevo, atún, sardina, cuy, hígado |
| Legumbres | Lentejas, frijoles, garbanzos, pallares, arvejas |
| Verduras | Zanahoria, tomate, brócoli, papa, ají amarillo |
| Frutas | Plátano, mango, maracuyá, papaya, pera |
| Lácteos | Leche, yogurt griego, queso fresco |
| Grasas | Palta, aceite de oliva, almendras, maní |
| Ultraprocesados | Gaseosa, papas fritas, hot dog, hamburguesa |

**Fuentes de los valores nutricionales:**
- Tabla de Composición de Alimentos del Perú — MINSA/INS (CENAN)
- FAO Food Composition Table for Latin America

### API externa — Open Food Facts (sin registro)

Para búsquedas de alimentos no incluidos en la BD local.

```
Sin API key — completamente gratuita y open source
Base URL:  https://world.openfoodfacts.org/cgi/search.pl
Cobertura: +3,000,000 productos alimenticios globales
```

**Flujo de búsqueda:**
```
Query del usuario
      ↓
SQLite local → resultados inmediatos (📍 Base local)
      ↓ si query ≥ 3 letras (con debounce 600ms)
Open Food Facts API → resultados adicionales (🌐 Open Food Facts)
```

---

## Estructura de la entidad Food

```typescript
interface Food {
  id: string
  name: string
  portion: number       // gramos por porción estándar
  calories: number      // kcal por porción
  protein: number       // gramos
  carbs: number         // gramos
  fat: number           // gramos
  fiber: number         // gramos
  source: 'local' | 'usda'
}
```

---

## Pantalla de búsqueda

```
┌─────────────────────────────┐
│ 🔍 Buscar alimento...       │
│─────────────────────────────│
│ 🍗 Pechuga de pollo         │
│    100g | 165 kcal          │
│    P:31g  C:0g  G:3.6g      │
│─────────────────────────────│
│ 🥚 Huevo entero             │
│    50g | 78 kcal            │
│    P:6g  C:0.6g  G:5g       │
│─────────────────────────────│
│ 🍚 Arroz blanco cocido      │
│    100g | 130 kcal          │
│    P:2.7g  C:28g  G:0.3g    │
└─────────────────────────────┘
```

---

## Pantalla de detalle

Al tocar un alimento, se muestra:
- Información nutricional completa por 100g
- Gráfica de dona con distribución de macros
- Comparativa: "¿Es saludable?" con semáforo nutricional
- Porción equivalente (cuánto es una porción normal)

---

## Implementación técnica

| Componente | Archivo |
|------------|---------|
| Pantalla | `src/presentation/screens/FoodsScreen/index.tsx` |
| Hook | `src/presentation/hooks/useFoods.ts` |
| Use Case | `src/domain/usecases/SearchFood.ts` |
| Entidad | `src/domain/entities/Food.ts` |
| Repositorio | `src/data/repositories/FoodRepository.ts` |
| BD local | `src/data/local/sqlite/seeds/foods.ts` |
| Cliente API | `src/data/remote/openFoodFacts/OpenFoodFactsClient.ts` (incluye el mapeo a `Food`) |

---

## Estado de desarrollo

- [x] Definir entidad `Food.ts`
- [x] Crear seed con 54 alimentos peruanos comunes en SQLite (meta original ~100: ampliable)
- [x] Implementar `FoodRepository` (local primero, API como complemento)
- [x] Implementar `SearchFood` use case
- [x] Diseñar `FoodsScreen` con buscador y lista
- [x] Pantalla de detalle como modal (`FoodDetail`); sin gráfica de dona separada
- [x] Integrar Open Food Facts para búsquedas externas

---

## Referencias

- [[Menu-Saludable]] — los menús usan los alimentos de esta BD
- [[../01-Arquitectura/Stack-Tecnologico]] — SQLite y Open Food Facts
