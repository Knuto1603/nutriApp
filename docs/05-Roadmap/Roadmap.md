---
type: roadmap
tags: [roadmap, progreso, fases, nutriapp]
created: 2026-07-02
updated: 2026-11-24
---

# Roadmap — NutriApp

> Última actualización: 2026-11-24 (sincronizado con el código real)
> Estado general del proyecto: **Fases 0–6 implementadas — pendiente Fase 7 (pruebas) y Fase 8 (despliegue)**

---

## Leyenda de estados

| Símbolo | Estado |
|---------|--------|
| ✅ | Completado |
| 🔄 | En progreso |
| ⏳ | Pendiente |
| ❌ | Bloqueado |

---

## FASE 0 — Planificación y Diseño ✅

> Objetivo: definir arquitectura, stack y diseño antes de escribir código.

| Tarea | Estado | Fecha |
|-------|--------|-------|
| Definir problemática y solución | ✅ | 2026-07-02 |
| Elegir stack tecnológico | ✅ | 2026-07-02 |
| Definir arquitectura (Clean Architecture) | ✅ | 2026-07-02 |
| Documentar patrones de diseño | ✅ | 2026-07-02 |
| Crear estructura de carpetas | ✅ | 2026-07-02 |
| Definir diseño UI/UX (colores, tipografía, flujo) | ✅ | 2026-07-02 |
| Crear bóveda Obsidian con documentación | ✅ | 2026-07-02 |
| Crear CLAUDE.md | ✅ | 2026-07-02 |

---

## FASE 1 — Setup del Proyecto ✅

> Objetivo: tener el proyecto Expo corriendo con navegación base y estructura de carpetas.

| Tarea | Estado | Módulo |
|-------|--------|--------|
| Inicializar proyecto con `npx create-expo-app` | ✅ | Core |
| Configurar TypeScript | ✅ | Core |
| Instalar dependencias principales | ✅ | Core |
| Configurar React Navigation (Bottom Tabs) | ✅ | Navegación |
| Crear estructura de carpetas `src/` | ✅ | Core |
| Configurar UI (estilos con `StyleSheet` + constantes; Paper instalado sin uso, NativeWind no instalado) | ✅ | UI |
| Configurar `colors.ts` y `typography.ts` | ✅ | UI |
| Pantalla placeholder por cada módulo | ✅ | Todos |
| Configurar EAS (eas.json) | ✅ | Despliegue |

---

## FASE 2 — Módulo Nutrición (Calculadora) ✅

> Objetivo: el usuario puede ingresar su perfil y ver su requerimiento calórico.

| Tarea | Estado |
|-------|--------|
| Definir entidad `User.ts` | ✅ |
| Implementar `IUserRepository` port | ✅ |
| Implementar `UserRepository` (AsyncStorage) | ✅ |
| Implementar estrategias de TMB (Mifflin, Harris) | ✅ |
| Implementar `CalculateNutrition` use case | ✅ |
| Crear hook `useNutrition` | ✅ |
| Diseñar pantalla de onboarding (3 pasos) | ✅ |
| Mostrar resultados con macros e IMC (sin componente `MacroChart` aparte) | ✅ |
| Calcular y mostrar IMC | ✅ |

---

## FASE 3 — Módulo Alimentos ✅

> Objetivo: el usuario puede buscar alimentos y ver su info nutricional.

| Tarea | Estado |
|-------|--------|
| Definir entidad `Food.ts` | ✅ |
| Configurar SQLite con `expo-sqlite` | ✅ |
| Crear seed de alimentos peruanos (54 alimentos; meta original ~100) | ✅ |
| Implementar `FoodRepository` (SQLite) | ✅ |
| Implementar `SearchFood` use case | ✅ |
| Crear hook `useFoods` | ✅ |
| Diseñar pantalla de búsqueda con lista | ✅ |
| Pantalla de detalle (modal `FoodDetail` dentro de `FoodsScreen`) | ✅ |

---

## FASE 4 — Módulo Menú Saludable ✅

> Objetivo: el usuario recibe un menú diario balanceado según su perfil.

| Tarea | Estado |
|-------|--------|
| Definir entidad `Meal.ts` | ✅ |
| Crear seed de menús (3 rangos calóricos) | ✅ |
| Implementar lógica de menú por rango calórico (`GetDailyMenu` + `pickMeal` en `seeds/menus.ts`; sin clase `MenuFactory`) | ✅ |
| Implementar `GetDailyMenu` use case | ✅ |
| Crear hook `useMenu` | ✅ |
| Diseñar `MenuScreen` con cards por tiempo | ✅ |
| Agregar opción "regenerar menú del día" | ✅ |

---

## FASE 5 — Módulo Agua ✅

> Objetivo: el usuario registra su ingesta de agua y recibe recordatorios.

| Tarea | Estado |
|-------|--------|
| Definir entidad `WaterLog.ts` | ✅ |
| Implementar `WaterRepository` (AsyncStorage) | ✅ |
| Implementar `TrackWater` use case | ✅ |
| Crear store Zustand `waterStore` | ✅ |
| Crear hook `useWater` | ✅ |
| Diseñar `WaterScreen` con barra de progreso | ✅ |
| Implementar `NotificationService` (Singleton) | ✅ |
| Configurar `expo-notifications` | ✅ |
| Programar 6 recordatorios diarios | ✅ |
| Historial de 7 días | ✅ |

---

## FASE 6 — Módulo Retos ✅

> Objetivo: el usuario puede aceptar retos y ver su progreso gamificado.

| Tarea | Estado |
|-------|--------|
| Definir entidad `Challenge.ts` | ✅ |
| Crear 10 retos iniciales (definidos en `challengeStore.ts`) | ✅ |
| Implementar `GetChallenges` use case | ✅ |
| Crear store Zustand `challengeStore` | ✅ |
| Crear hook `useChallenges` | ✅ |
| Diseñar `ChallengesScreen` con progreso | ✅ |
| Implementar sistema de puntos y niveles | ✅ |
| Conectar reto de agua con módulo Agua | ✅ |

---

## FASE 6b — Mejoras funcionales ✅ (2026-11-24)

| Tarea | Estado |
|-------|--------|
| Diario de comidas (`DiaryScreen`, "Agregar a mi día" desde Alimentos) | ✅ |
| Retos automáticos (`useChallengeAutomation`, `AutoChallenges`): perfil, agua, fruta en desayuno, verdura en almuerzo, legumbres | ✅ |
| Perfil editable con objetivo (bajar / mantener / subir) y fórmulas Mifflin y Harris-Benedict (Strategy) | ✅ |
| Modo demo (`useDemoMode`: cargar datos de ejemplo / borrar todos los datos) | ✅ |
| Correcciones: fecha local (no UTC), carrera SQLite, validación de formulario, accesibilidad | ✅ |
| Preparar despliegue: `app.json` (versionCode, splash), `eas.json` (autoIncrement), página de descarga con QR (`distribucion/`) | ✅ |

---

## FASE 7 — Pruebas y Pulido ⏳

> Objetivo: app estable, sin errores y lista para presentar.

| Tarea | Estado |
|-------|--------|
| Pruebas en dispositivos Android físicos | ⏳ |
| Revisar flujo de onboarding completo | ⏳ |
| Verificar notificaciones en background | ⏳ |
| Pulir animaciones y transiciones | ⏳ |
| Revisar contraste y accesibilidad | ⏳ |
| Optimizar rendimiento (listas grandes) | ⏳ |

---

## FASE 8 — Despliegue ⏳

> Objetivo: distribuir la app para la presentación y/o publicación.

| Tarea | Estado |
|-------|--------|
| Configurar `eas.json` y `projectId` EAS en `app.json` | ✅ |
| Generar APK con `eas build --profile preview` | ⏳ |
| Probar APK en dispositivos físicos | ⏳ |
| Preparar screenshots para presentación | ⏳ |
| (Opcional) Publicar en Google Play | ⏳ |

---

## Progreso general

```
Fase 0 — Planificación    ████████████ 100% ✅
Fase 1 — Setup            ████████████ 100% ✅
Fase 2 — Nutrición        ████████████ 100% ✅
Fase 3 — Alimentos        ████████████ 100% ✅
Fase 4 — Menú             ████████████ 100% ✅
Fase 5 — Agua             ████████████ 100% ✅
Fase 6 — Retos            ████████████ 100% ✅
Fase 7 — Pruebas          ░░░░░░░░░░░░   0% ⏳
Fase 8 — Despliegue       ░░░░░░░░░░░░   0% ⏳
```

---

## Referencias de módulos

- [[../02-Modulos/Calculadora-Nutricional]] — Fase 2
- [[../02-Modulos/Alimentos]] — Fase 3
- [[../02-Modulos/Menu-Saludable]] — Fase 4
- [[../02-Modulos/Recordatorio-Agua]] — Fase 5
- [[../02-Modulos/Retos]] — Fase 6
- [[../03-Despliegue/Despliegue-Movil]] — Fase 8
