---
type: nota
tags: [arquitectura, clean-architecture, nutriapp]
created: 2026-07-02
links: [[Stack-Tecnologico]], [[Patrones-Disenio]], [[Estructura-Carpetas]]
---

# Arquitectura General

## Patrón: Clean Architecture

Se aplica **Clean Architecture** dividida en 3 capas con dependencias que solo apuntan hacia adentro (hacia el dominio).

```
┌──────────────────────────────────────┐
│         PRESENTATION LAYER           │
│   Screens, Components, Hooks         │
│   Responsabilidad: mostrar UI,       │
│   capturar inputs del usuario        │
├──────────────────────────────────────┤
│            DOMAIN LAYER              │
│   Use Cases, Entities, Ports         │
│   Responsabilidad: reglas de negocio │
│   puras, sin dependencias externas   │
├──────────────────────────────────────┤
│             DATA LAYER               │
│   Repositories, APIs, LocalDB        │
│   Responsabilidad: acceso y          │
│   persistencia de datos              │
└──────────────────────────────────────┘
```

---

## Regla de dependencia

```
Presentation → Domain ← Data
```

- **Presentation** conoce el Domain (invoca Use Cases)
- **Data** implementa los contratos del Domain (Ports/Interfaces)
- **Domain** no conoce ni a Presentation ni a Data — es puro

---

## Capa: Domain

Contiene las entidades y casos de uso del negocio:

| Entidad | Descripción |
|---------|-------------|
| `User` | edad, peso, talla, nivel de actividad, IMC |
| `Food` | nombre, calorías, proteínas, carbohidratos, grasas |
| `Meal` | colección de alimentos por tiempo de comida |
| `WaterLog` | registro de vasos de agua consumidos |
| `Challenge` | reto activo, progreso, estado completado |

| Use Case | Qué hace |
|----------|----------|
| `CalculateNutrition` | Calcula TMB y requerimiento calórico diario |
| `GetDailyMenu` | Retorna menú balanceado según perfil |
| `TrackWater` | Registra ingesta y verifica meta diaria |
| `GetChallenges` | Lista retos activos del usuario |
| `SearchFood` | Busca alimentos en la base de datos |

---

## Capa: Data

| Componente | Responsabilidad |
|------------|----------------|
| `UserRepository` | Guarda/lee perfil en AsyncStorage |
| `FoodRepository` | Consulta BD local de alimentos (SQLite) |
| `MenuRepository` | Retorna menús predefinidos por perfil calórico |
| `WaterRepository` | Persiste registros diarios de agua |

---

## Capa: Presentation

| Componente | Responsabilidad |
|------------|----------------|
| Screens | Una pantalla por módulo del menú |
| Components | Piezas de UI reutilizables (Cards, Charts, Progress) |
| Hooks | Lógica de estado local conectada a Use Cases |
| Navigation | Bottom Tabs + Stack Navigator |

---

## Referencias

- [[Stack-Tecnologico]] — librerías concretas por capa
- [[Patrones-Disenio]] — patrones que complementan la arquitectura
- [[Estructura-Carpetas]] — cómo se refleja esto en el código
