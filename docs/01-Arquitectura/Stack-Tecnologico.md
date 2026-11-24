---
type: nota
tags: [stack, tecnologia, dependencias, nutriapp]
created: 2026-07-02
links: [[Arquitectura-General]], [[Estructura-Carpetas]]
---

# Stack Tecnológico

## Plataforma

| Tecnología | Versión | Rol |
|------------|---------|-----|
| **React Native** | 0.81.5 | Framework móvil cross-platform |
| **Expo SDK** | 54 | Toolchain y servicios (build, notifications, etc.) |
| **React** | 19.1.0 | Librería de UI |
| **TypeScript** | ~5.9 | Tipado estático obligatorio en todo el proyecto |

---

## Navegación

| Librería | Uso |
|----------|-----|
| `@react-navigation/native` | Core de navegación |
| `@react-navigation/bottom-tabs` | Menú principal (5 tabs) |
| `@react-navigation/native-stack` | Navegación entre pantallas internas |

---

## Estado global

| Librería | Uso |
|----------|-----|
| **Zustand** | Estado global (perfil usuario, progreso agua, retos) |

> Se eligió Zustand sobre Redux por su simplicidad — no requiere boilerplate (actions, reducers, dispatch).

---

## Persistencia local

| Librería | Uso |
|----------|-----|
| `@react-native-async-storage/async-storage` | Perfil del usuario, configuraciones |
| `expo-sqlite` | Base de datos de alimentos (consultas complejas) |

---

## Notificaciones

| Librería | Uso |
|----------|-----|
| `expo-notifications` | Recordatorios de agua programados localmente |

---

## UI y gráficas

| Librería | Uso |
|----------|-----|
| `StyleSheet` + `src/core/constants` | **Estilos reales en uso**: `colors.ts`, `spacing.ts`, `typography.ts` |
| `@expo/vector-icons` (Ionicons) | Iconos de tabs y pantallas |
| `react-native-paper` | Instalado, **sin uso actual** en `src/` |

> No se instalaron `nativewind` ni `victory-native` (previstos al inicio). Las gráficas y barras de progreso se dibujan con componentes nativos.

---

## API nutricional externa (opcional)

| Servicio | Plan | Uso |
|----------|------|-----|
| **Open Food Facts** | Gratuito, sin API key | **En uso**: búsqueda complementaria (`src/data/remote/openFoodFacts/OpenFoodFactsClient.ts`) |
| ~~USDA FoodData Central / Edamam~~ | — | Descartados; no están implementados |

> La app funciona **offline-first**: los alimentos más comunes están en SQLite local. La API externa es un complemento para búsquedas avanzadas.

---

## Herramientas de desarrollo

| Herramienta | Uso |
|-------------|-----|
| **EAS Build** | Compilación en la nube (no requiere Android Studio) |
| **EAS Update** | Actualizaciones OTA sin reinstalar |
| **Expo Go** | Pruebas rápidas durante desarrollo (las notificaciones locales requieren build nativo, ver [[../02-Modulos/Recordatorio-Agua]]) |

---

## Versiones mínimas de SO

| Plataforma | Versión mínima |
|------------|---------------|
| Android | 6.0 (API 23) |
| iOS | 13.0 |

---

## Referencias

- [[Arquitectura-General]] — cómo se organiza cada tecnología por capa
- [[../03-Despliegue/Despliegue-Movil]] — cómo se usa EAS Build para distribuir
