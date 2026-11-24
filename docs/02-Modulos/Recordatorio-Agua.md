---
type: nota
tags: [modulo, agua, hidratacion, notificaciones, nutriapp]
estado: completado
created: 2026-07-02
updated: 2026-07-05
links: [[Calculadora-Nutricional]], [[../01-Arquitectura/Patrones-Disenio]]
---

# Módulo: Recordatorio de Agua ✅

## Cómo usar

1. Ir al tab **Agua** (ícono 💧)
2. Ver la meta diaria calculada automáticamente desde el perfil
3. Tocar **"Agregar vaso (250 ml)"** o usar los botones rápidos
4. Ver el progreso y el historial de los últimos 7 días
5. Tocar **"Reiniciar registro de hoy"** para empezar desde cero

---

## Cálculo de la meta diaria

```
Meta (ml) = peso_kg × 35
Ejemplo: 70 kg × 35 = 2,450 ml ≈ 10 vasos de 250 ml
```

Fuente: European Food Safety Authority (EFSA), 2010.

---

## Funcionalidades implementadas

| Función | Descripción |
|---------|-------------|
| Botones rápidos | +150 ml / +250 ml / +350 ml / +500 ml |
| Botón principal | Agregar vaso de 250 ml |
| Barra de progreso | Azul, muestra ml consumidos / meta |
| Contador de vasos | X de Y vasos (250 ml) |
| Meta cumplida | Mensaje "¡Meta cumplida! 🎉" al alcanzar el objetivo |
| Historial 7 días | Barra por día con marca ✓ si se cumplió |
| Reiniciar | Borra el registro del día actual |
| Mensaje restante | "Faltan X ml" actualizado en tiempo real |

---

## Sistema de notificaciones

> **Estado actual:** `NotificationService` está implementado con `expo-notifications` y `useWater` programa los recordatorios (6 diarios, a las 8, 10, 12, 15, 17 y 20 h). Las notificaciones push remotas no funcionan en Expo Go desde el SDK 53, y en Expo Go pueden fallar o ser limitadas. **Sin verificar en dispositivo**: se probará en el APK (Fase 7).

### Horario de recordatorios

| Hora | Mensaje |
|------|---------|
| 07:00 | ¡Buenos días! Empieza el día con un vaso de agua 💧 |
| 09:30 | Ya llevas 2h activo, ¿tomaste agua? |
| 12:00 | Hora del almuerzo — acompaña con agua 💧 |
| 15:00 | Mitad de tarde, hidratarse mejora la concentración |
| 18:00 | Recuerda: hidratarse bien mejora tu rendimiento |
| 20:00 | Último recordatorio: completa tu hidratación hoy 💧 |

---

## Flujo de datos

```
useWater (hook)
    ├── userRepo.get() → obtiene peso → calcula meta (peso × 35)
    ├── waterRepo.getTodayLog() → carga registro del día
    └── waterRepo.getHistory(7) → carga historial

add(ml) →
    waterRepo.addEntry(ml, goalMl) → guarda en AsyncStorage
    setLog(updated) → actualiza Zustand store (reactivo)
    getHistory(7) → actualiza historial
```

---

## Conexión con Retos

El store `useWaterStore` es observado por `useChallenges`:
- Cuando `log.totalMl >= log.goalMl` → marca automáticamente el reto **"Meta de agua diaria"** como completado

---

## Archivos implementados

| Componente | Archivo | Responsabilidad |
|------------|---------|----------------|
| Entidad | `src/domain/entities/WaterLog.ts` | Tipos WaterLog, WaterEntry |
| Puerto | `src/domain/ports/IWaterRepository.ts` | Contrato del repositorio |
| Use Case | `src/domain/usecases/TrackWater.ts` | addWater, isGoalReached, getRemainingMl, getProgressPercent |
| Repositorio | `src/data/repositories/WaterRepository.ts` | Persiste en AsyncStorage con clave por fecha |
| Store | `src/presentation/stores/waterStore.ts` | Estado global reactivo del log diario |
| Hook | `src/presentation/hooks/useWater.ts` | Conecta repo + store + usecase |
| Notificaciones | `src/core/notifications/NotificationService.ts` | Singleton (implementación real con `expo-notifications`) |
| Pantalla | `src/presentation/screens/WaterScreen/index.tsx` | UI completa |

---

## Persistencia

Cada día tiene su propia clave en AsyncStorage:
```
@nutriapp:water:2026-07-05  →  { date, entries[], totalMl, goalMl }
@nutriapp:water:2026-07-04  →  { ... }
```

El historial se construye leyendo los últimos 7 días al cargar la pantalla.

---

## Estado de desarrollo

- [x] Definir entidad `WaterLog.ts`
- [x] Implementar puerto `IWaterRepository.ts`
- [x] Implementar `TrackWater` use case (add, progress, remaining, goalReached)
- [x] Implementar `WaterRepository` con AsyncStorage (clave por fecha)
- [x] Crear store Zustand `waterStore` (reactivo)
- [x] Crear hook `useWater` con carga automática de perfil y historial
- [x] Diseñar `WaterScreen` con 4 botones rápidos + progreso + historial
- [x] Historial de 7 días con etiquetas (Hoy / Ayer / día de semana)
- [x] Conexión automática con módulo Retos
- [x] NotificationService Singleton con 6 recordatorios diarios
- [ ] Verificar notificaciones en background en APK real

---

## Referencias

- [[Calculadora-Nutricional]] — provee `waterGoalMl` (peso × 35)
- [[Retos]] — el reto "Meta de agua diaria" se conecta con este módulo
- [[../01-Arquitectura/Patrones-Disenio]] — Singleton y Observer aplicados
