---
type: nota
tags: [patrones, diseño, arquitectura, nutriapp]
created: 2026-07-02
links: [[Arquitectura-General]], [[Stack-Tecnologico]]
---

# Patrones de Diseño

## 1. Repository Pattern

**Dónde se aplica:** Capa Data → Capa Domain

Abstrae el origen de los datos. La capa de presentación nunca sabe si los datos vienen de SQLite, AsyncStorage o una API remota.

```
Screen
  └─► UseCase
        └─► IRepository (interfaz/port en Domain)
              └─► Repository (implementación en Data)
                    ├─► AsyncStorage
                    ├─► SQLite
                    └─► API REST
```

**Beneficio:** cambiar de AsyncStorage a una base de datos remota no afecta ninguna pantalla ni caso de uso.

---

## 2. Strategy Pattern

**Dónde se aplica:** `CalculateNutrition` Use Case

Diferentes fórmulas de cálculo de TMB (Tasa Metabólica Basal) según el perfil del usuario. Cada fórmula es una estrategia intercambiable.

```typescript
interface NutritionStrategy {
  calculateBMR(user: User): number
}

class HarrisBenedictStrategy implements NutritionStrategy { ... }
class MifflinStJeorStrategy implements NutritionStrategy { ... }   // más precisa
class SchofieldStrategy implements NutritionStrategy { ... }       // adolescentes

class NutritionCalculator {
  constructor(private strategy: NutritionStrategy) {}
  calculate(user: User) { return this.strategy.calculateBMR(user) }
}
```

**Beneficio:** agregar una nueva fórmula no modifica el código existente (Open/Closed Principle).

---

## 3. Observer / Reactive State

**Dónde se aplica:** Estado global con Zustand

El estado del perfil del usuario y el progreso del agua son observables. Cualquier componente suscrito se actualiza automáticamente.

```typescript
// store de agua — cualquier componente puede suscribirse
const useWaterStore = create((set) => ({
  consumed: 0,
  goal: 2000,
  addWater: (ml) => set((state) => ({ consumed: state.consumed + ml })),
}))
```

**Beneficio:** la barra de progreso de agua en la pantalla principal se actualiza en tiempo real cuando el usuario registra un vaso, sin pasar props manualmente.

---

## 4. Singleton — Notification Service

**Dónde se aplica:** `core/notifications/NotificationService.ts`

Un único servicio gestiona todos los recordatorios programados. Garantiza que no se dupliquen notificaciones.

```typescript
class NotificationService {
  private static instance: NotificationService

  static getInstance(): NotificationService {
    if (!this.instance) this.instance = new NotificationService()
    return this.instance
  }

  scheduleWaterReminders(intervalHours: number) { ... }
  cancelAll() { ... }
}
```

---

## 5. Factory Pattern (leve)

> **Estado real:** la clase `MenuFactory` de abajo es el diseño original. En el código la función `pickMeal` (`src/data/local/sqlite/seeds/menus.ts`) cumple ese rol, expuesta a través del puerto `IMenuRepository` y su implementación `MenuRepository`; `GetDailyMenu` (domain) recibe el repositorio por parámetro y ya no importa de Data.

**Dónde se aplica:** Construcción de menús diarios

Una fábrica de menús genera combinaciones balanceadas según el rango calórico del usuario.

```typescript
class MenuFactory {
  static create(calorieTarget: number): DailyMenu {
    if (calorieTarget < 1600) return MenuFactory.lowCalorie()
    if (calorieTarget < 2200) return MenuFactory.moderate()
    return MenuFactory.highCalorie()
  }
}
```

---

## Resumen de aplicación

| Patrón | Módulo | Beneficio clave |
|--------|--------|----------------|
| Repository | Todos los módulos | Desacoplamiento datos/lógica |
| Strategy | Calculadora Nutricional | Fórmulas intercambiables |
| Observer | Agua, Retos | UI reactiva sin prop drilling |
| Singleton | Notificaciones | Una sola instancia del servicio |
| Factory | Menú Saludable | Generación de menús por perfil |
