---
type: nota
tags: [modulo, retos, gamificacion, habitos, nutriapp]
estado: completado
created: 2026-07-02
updated: 2026-07-05
links: [[Recordatorio-Agua]], [[Menu-Saludable]]
---

# Módulo: Retos ✅

## Cómo usar

1. Ir al tab **Retos** (ícono 🏆)
2. Ver el nivel actual y barra de progreso de puntos
3. En **"En progreso"**: tocar **"Marcar día"** para registrar avance
4. En **"Disponibles"**: tocar **"Aceptar reto"** para activar uno nuevo
5. En **"Completados"**: ver los retos terminados con puntos obtenidos
6. El reto de agua diaria se marca solo al cumplir la meta en el tab Agua

---

## Catálogo de 10 retos implementados

| ID | Título | Tipo | Categoría | Días | Puntos | Activo por defecto |
|----|--------|------|-----------|------|--------|--------------------|
| `agua-7dias` | 8 vasos por 7 días | Semanal | Agua | 7 | 100 | ✅ |
| `sin-gaseosa-3` | 3 días sin gaseosa | Desafío | Alimentación | 3 | 60 | ✅ |
| `fruta-desayuno-5` | Fruta en el desayuno | Semanal | Alimentación | 5 | 75 | ✅ |
| `ensalada-almuerzo-7` | Ensalada en el almuerzo | Semanal | Alimentación | 7 | 100 | ❌ |
| `menu-nutriapp-3` | Sigue el menú de NutriApp | Desafío | Hábitos | 3 | 60 | ❌ |
| `sin-frituras-7` | 7 días sin frituras | Semanal | Alimentación | 7 | 100 | ❌ |
| `perfil-completo` | Perfil configurado | Diario | Hábitos | 1 | 30 | ✅ |
| `agua-diaria` | Meta de agua diaria | Diario | Agua | 1 | 20 | ✅ |
| `sin-ultraprocesados-5` | 5 días sin ultraprocesados | Desafío | Alimentación | 5 | 80 | ❌ |
| `legumbres-semana` | Come menestras esta semana | Semanal | Alimentación | 4 | 75 | ❌ |

---

## Sistema de puntos y niveles

### Puntos por reto completado

| Tipo | Puntos |
|------|--------|
| Reto diario | 20 – 30 pts |
| Reto semanal | 75 – 100 pts |
| Desafío | 60 – 80 pts |

### Niveles del usuario

| Nivel | Pts requeridos | Título | Color |
|-------|---------------|--------|-------|
| 1 | 0 | Principiante | Gris |
| 2 | 200 | Saludable | Verde |
| 3 | 500 | Nutrido | Azul |
| 4 | 1,000 | Experto | Naranja |
| 5 | 2,000 | Maestro NutriApp | Morado |

---

## Estados de un reto

```
Disponible (isActive: false)
    │
    ▼ [Aceptar reto]
En progreso (isActive: true, completedDays < targetDays)
    │
    ▼ [Marcar día] × targetDays
Completado (isCompleted: true)
    → suma puntos al total del usuario
```

---

## Conexión automática con Agua

`useChallenges` observa `useWaterStore`:
```
waterLog.totalMl >= waterLog.goalMl
        ↓
completeDay('agua-diaria') → automático, sin acción del usuario
```

---

## Categorías y colores

| Categoría | Ícono | Color |
|-----------|-------|-------|
| Agua | 💧 | Azul (`#29B6F6`) |
| Alimentación | 🥗 | Verde (`#2E7D32`) |
| Hábitos | ⭐ | Naranja (`#F57C00`) |

---

## Entidades implementadas

```typescript
type ChallengeType = 'daily' | 'weekly' | 'challenge'
type ChallengeCategory = 'agua' | 'alimentacion' | 'habitos'

interface Challenge {
  id: string
  title: string
  description: string
  type: ChallengeType
  category: ChallengeCategory
  targetDays: number
  completedDays: number
  points: number
  isCompleted: boolean
  isActive: boolean
  startDate: string
}

interface UserProgress {
  totalPoints: number
  level: number
  levelTitle: string
  completedChallenges: string[]
}
```

---

## Archivos implementados

| Componente | Archivo | Responsabilidad |
|------------|---------|----------------|
| Entidad | `src/domain/entities/Challenge.ts` | Tipos Challenge, UserProgress |
| Use Case | `src/domain/usecases/GetChallenges.ts` | getLevel, getNextLevelPoints, markDayCompleted, calcUserProgress |
| Store | `src/presentation/stores/challengeStore.ts` | Estado global + persistencia AsyncStorage + seed inicial |
| Hook | `src/presentation/hooks/useChallenges.ts` | Carga, filtra por estado, conecta con water store |
| Pantalla | `src/presentation/screens/ChallengesScreen/index.tsx` | Tarjeta de nivel + 3 secciones + progreso visual |

---

## Persistencia

Los retos se guardan en AsyncStorage:
```
@nutriapp:challenges → Challenge[] (array completo con progreso)
```

Al primer uso, se carga el seed de 10 retos iniciales.

---

## Estado de desarrollo

- [x] Definir entidades `Challenge.ts` y `UserProgress`
- [x] Crear seed de 10 retos con categorías y puntos
- [x] Implementar `GetChallenges` use case (niveles, puntos, progreso)
- [x] Crear store Zustand con persistencia AsyncStorage
- [x] Crear hook `useChallenges` con filtrado por estado
- [x] Diseñar `ChallengesScreen` con 3 secciones
- [x] Tarjeta de nivel con barra de progreso hacia siguiente nivel
- [x] Botón "Marcar día" para retos en progreso
- [x] Botón "Aceptar reto" para retos disponibles
- [x] Conexión automática con módulo Agua

---

## Referencias

- [[Recordatorio-Agua]] — reto `agua-diaria` se conecta con el store de agua
- [[Menu-Saludable]] — reto `menu-nutriapp-3` incentiva seguir el menú
