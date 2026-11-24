---
type: nota
tags: [estructura, carpetas, codigo, nutriapp]
created: 2026-07-02
links: [[Arquitectura-General]], [[Stack-Tecnologico]]
---

# Estructura de Carpetas

## Árbol completo del proyecto

```
nutriApp/
│
├── docs/                          ← Bóveda Obsidian (documentación)
│
├── src/
│   │
│   ├── domain/                    ← CAPA DOMINIO (reglas de negocio puras)
│   │   ├── entities/
│   │   │   ├── User.ts            # edad, peso, talla, actividad, IMC
│   │   │   ├── Food.ts            # nombre, calorías, proteínas, carbs, grasas
│   │   │   ├── Meal.ts            # tiempo de comida + lista de Food
│   │   │   ├── WaterLog.ts        # fecha, mililitros consumidos, meta
│   │   │   └── Challenge.ts       # reto, descripción, progreso, completado
│   │   │
│   │   ├── usecases/
│   │   │   ├── CalculateNutrition.ts   # TMB + calorías + macros diarios
│   │   │   ├── GetDailyMenu.ts         # menú balanceado por perfil calórico
│   │   │   ├── TrackWater.ts           # registrar vaso + verificar meta
│   │   │   ├── SearchFood.ts           # buscar alimento por nombre
│   │   │   └── GetChallenges.ts        # listar retos activos del usuario
│   │   │
│   │   └── ports/                 # interfaces (contratos para Data layer)
│   │       ├── IUserRepository.ts
│   │       ├── IFoodRepository.ts
│   │       ├── IMenuRepository.ts
│   │       ├── IChallengeRepository.ts
│   │       └── IWaterRepository.ts
│   │
│   ├── data/                      ← CAPA DATOS (implementaciones concretas)
│   │   ├── repositories/
│   │   │   ├── FoodRepository.ts
│   │   │   ├── MenuRepository.ts
│   │   │   ├── ChallengeRepository.ts
│   │   │   └── WaterRepository.ts
│   │   │
│   │   ├── local/
│   │   │   ├── asyncStorage/
│   │   │   │   ├── UserStorage.ts      # clase UserRepository (perfil usuario)
│   │   │   │   └── challengeSeed.ts    # 10 retos iniciales
│   │   │   └── sqlite/
│   │   │       ├── database.ts         # inicialización SQLite
│   │   │       └── seeds/
│   │   │           ├── foods.ts        # 54 alimentos peruanos comunes
│   │   │           └── menus.ts        # menús por rango calórico
│   │   │
│   │   └── remote/
│   │       └── openFoodFacts/
│   │           └── OpenFoodFactsClient.ts  # búsqueda + mapeo a entidad Food
│   │
│   ├── presentation/              ← CAPA PRESENTACIÓN (UI)
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx        # Bottom Tabs (5 módulos)
│   │   │
│   │   ├── screens/
│   │   │   ├── NutritionScreen/
│   │   │   │   ├── index.tsx
│   │   │   │   └── components/
│   │   │   ├── FoodsScreen/
│   │   │   │   ├── index.tsx
│   │   │   │   └── components/
│   │   │   ├── MenuScreen/
│   │   │   │   ├── index.tsx
│   │   │   │   └── components/
│   │   │   ├── WaterScreen/
│   │   │   │   ├── index.tsx
│   │   │   │   └── components/
│   │   │   └── ChallengesScreen/
│   │   │       ├── index.tsx
│   │   │       └── components/
│   │   │
│   │   ├── components/            # (vacía) componentes globales aún no extraídos: hoy viven dentro de cada screen
│   │   ├── stores/
│   │   │   ├── waterStore.ts      # Zustand — agua
│   │   │   └── challengeStore.ts  # Zustand — retos (10 retos definidos aquí)
│   │   │
│   │   └── hooks/
│   │       ├── useNutrition.ts    # conecta CalculateNutrition UseCase
│   │       ├── useMenu.ts         # conecta GetDailyMenu UseCase
│   │       ├── useWater.ts        # conecta TrackWater UseCase + store Zustand
│   │       └── useChallenges.ts   # conecta GetChallenges UseCase
│   │
│   └── core/                      ← TRANSVERSAL
│       ├── constants/
│       │   ├── colors.ts          # paleta de colores NutriApp
│       │   ├── spacing.ts         # grid de 8pt
│       │   └── typography.ts      # tamaños y pesos tipográficos
│       │
│       ├── utils/
│       │   └── date.ts            # localDateString(): fecha local YYYY-MM-DD (no UTC)
│       │
│       └── notifications/
│           └── NotificationService.ts  # Singleton — recordatorios de agua
│
├── assets/
│   ├── images/
│   └── icons/
│
├── app.json                       # configuración Expo
├── package.json
├── tsconfig.json
├── eas.json                       # configuración EAS Build/Update
└── CLAUDE.md                      ← guía de desarrollo para Claude
```

---

## Convenciones de nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivos de componente | PascalCase | `NutritionCard.tsx` |
| Archivos de lógica | camelCase | `useWater.ts` |
| Entidades de dominio | PascalCase | `User.ts` |
| Carpetas de screen | PascalCase | `WaterScreen/` |
| Constantes | SCREAMING_SNAKE | `MAX_WATER_ML` |

---

## Referencias

- [[Arquitectura-General]] — justificación de cada capa
- [[Patrones-Disenio]] — patrones implementados en cada módulo
