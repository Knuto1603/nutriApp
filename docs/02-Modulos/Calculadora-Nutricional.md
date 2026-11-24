---
type: nota
tags: [modulo, nutricion, calculadora, nutriapp]
estado: completado
created: 2026-07-02
updated: 2026-07-05
links: [[Menu-Saludable]], [[../01-Arquitectura/Patrones-Disenio]]
---

# Módulo: Calculadora Nutricional ✅

## Cómo usar la app

El módulo funciona en **dos modos**: onboarding (primera vez) y resultados (perfil ya guardado).

### Primera vez — Onboarding 3 pasos

```
Paso 1 de 3                    Paso 2 de 3                 Paso 3 de 3
───────────────                ───────────────             ───────────────
Nombre: ________               Peso (kg): ____             ○ Sedentario
Edad:   ________               Talla (cm): ___             ○ Ligero
Sexo: [M]  [ F]                                            ● Moderado
                                                           ○ Intenso
[Siguiente →]        [← Atrás] [Siguiente →]    [← Atrás] [Calcular]
```

1. Abrir la app → tab **"Nutrición"**
2. Ingresar nombre, edad y sexo → **Siguiente**
3. Ingresar peso en kg y talla en cm → **Siguiente**
4. Seleccionar nivel de actividad física → **Calcular**
5. Ver resultados instantáneamente

### Volver a calcular

En la pantalla de resultados, tocar **"Actualizar mi perfil"** para repetir el onboarding con nuevos datos.

---

## Pantalla de resultados

```
┌─────────────────────────────────┐
│  Hola, Juan 👋                  │
│  Tu requerimiento nutricional   │
│                                 │
│  Calorías diarias               │
│  2,100 kcal                     │
│  TMB: 1,806 kcal                │
│                                 │
│ ┌────────┬────────┬──────────┐  │
│ │105 g   │ 263 g  │  70 g    │  │
│ │Proteín │ Carbos │ Grasas   │  │
│ └────────┴────────┴──────────┘  │
│                                 │
│  IMC: 22.4          Normal      │
│                                 │
│  Meta de agua: 2,450 ml         │
│  ~10 vasos de 250 ml            │
│                                 │
│  [Actualizar mi perfil]         │
└─────────────────────────────────┘
```

---

## Datos de entrada

| Campo | Tipo | Validación |
|-------|------|-----------|
| Nombre | string | requerido |
| Edad | number | entero positivo |
| Sexo | `'male' \| 'female'` | requerido |
| Peso | number | decimal positivo (kg) |
| Talla | number | decimal positivo (cm) |
| Nivel de actividad | `ActivityLevel` | una de 4 opciones |

---

## Fórmulas implementadas

### TMB — Mifflin-St Jeor

```
Hombre: TMB = (10 × peso_kg) + (6.25 × talla_cm) − (5 × edad) + 5
Mujer:  TMB = (10 × peso_kg) + (6.25 × talla_cm) − (5 × edad) − 161
```

### Calorías diarias

```
Calorías = TMB × Factor de actividad

Sedentario → × 1.200
Ligero     → × 1.375
Moderado   → × 1.550
Intenso    → × 1.725
```

### Distribución de macronutrientes

```
Proteínas     = (Calorías × 20%) ÷ 4 kcal/g
Carbohidratos = (Calorías × 50%) ÷ 4 kcal/g
Grasas        = (Calorías × 30%) ÷ 9 kcal/g
```

### IMC

```
IMC = peso_kg ÷ (talla_m)²

< 18.5  → Bajo peso
18.5–24.9 → Normal
25–29.9   → Sobrepeso
≥ 30      → Obesidad
```

### Meta de agua

```
Agua (ml) = peso_kg × 35
```

---

## Ejemplo de cálculo

**Perfil:** Juan, 20 años, masculino, 70 kg, 175 cm, actividad moderada

```
TMB = (10 × 70) + (6.25 × 175) − (5 × 20) + 5
    = 700 + 1093.75 − 100 + 5
    = 1,698.75 ≈ 1,699 kcal

Calorías = 1,699 × 1.55 = 2,633 kcal

Proteínas     = (2,633 × 0.20) ÷ 4 = 132 g
Carbohidratos = (2,633 × 0.50) ÷ 4 = 329 g
Grasas        = (2,633 × 0.30) ÷ 9 = 88 g

IMC  = 70 ÷ (1.75)² = 22.9 → Normal
Agua = 70 × 35 = 2,450 ml
```

---

## Archivos implementados

| Componente | Archivo | Responsabilidad |
|------------|---------|----------------|
| Entidad | `src/domain/entities/User.ts` | Tipos `User`, `NutritionResult`, `ActivityLevel`, `Sex` |
| Puerto | `src/domain/ports/IUserRepository.ts` | Contrato `save / get / clear` |
| Use Case | `src/domain/usecases/CalculateNutrition.ts` | Fórmulas puras de cálculo |
| Repositorio | `src/data/local/asyncStorage/UserStorage.ts` | Persiste perfil en AsyncStorage |
| Hook | `src/presentation/hooks/useNutrition.ts` | Conecta UI con use case y repo |
| Pantalla | `src/presentation/screens/NutritionScreen/index.tsx` | Onboarding 3 pasos + vista de resultados |

---

## Flujo de datos

```
Usuario llena formulario (3 pasos)
        ↓
saveProfile(user) — hook useNutrition
        ↓
UserRepository.save(user) → AsyncStorage
        ↓
calculateNutrition(user) → NutritionResult
        ↓
Pantalla muestra: calorías, macros, IMC, agua
        ↓
Al reabrir la app → repo.get() recarga perfil automáticamente
```

---

## Estado de desarrollo

- [x] Definir entidad `User.ts`
- [x] Implementar puerto `IUserRepository.ts`
- [x] Implementar `CalculateNutrition` use case (Mifflin-St Jeor)
- [x] Implementar `UserRepository` con AsyncStorage
- [x] Crear hook `useNutrition`
- [x] Onboarding 3 pasos con validación por paso
- [x] Pantalla de resultados: calorías, macros, IMC, agua
- [x] Persistencia automática del perfil

---

## Referencias

- [[../01-Arquitectura/Patrones-Disenio]] — Repository Pattern y use case puro
- [[../01-Arquitectura/Estructura-Carpetas]] — ubicación de cada archivo
- [[Menu-Saludable]] — consume `dailyCalories` para sugerir menús
- [[Recordatorio-Agua]] — consume `waterGoalMl` como meta diaria
