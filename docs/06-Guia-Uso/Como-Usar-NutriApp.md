---
type: nota
tags: [guia, uso, flujo, nutriapp]
created: 2026-07-05
updated: 2026-07-05
links: [[../02-Modulos/Calculadora-Nutricional]], [[../02-Modulos/Menu-Saludable]], [[../02-Modulos/Recordatorio-Agua]], [[../02-Modulos/Retos]], [[../02-Modulos/Alimentos]]
---

# Guía de uso — NutriApp

## Cómo ver los cambios durante el desarrollo

```
1. Abrir terminal en VS Code  (Ctrl + `)
2. Ejecutar: npx expo start         ← solo una vez por sesión
3. Escanear el QR con Expo Go en el celular
4. Guardar cualquier archivo (.tsx / .ts)
   → la app se recarga automáticamente (Fast Refresh)
```

Si la recarga no ocurre → agitar el celular → **Reload**
O en la terminal presionar **`r`** para forzar recarga.

---

## Estado actual de los módulos

| Tab | Ícono | Estado | Módulo |
|-----|-------|--------|--------|
| Nutrición | nutrition-outline | ✅ Completo | [[../02-Modulos/Calculadora-Nutricional]] |
| Alimentos | search-outline | ✅ Completo | [[../02-Modulos/Alimentos]] |
| Menú diario | restaurant-outline | ✅ Completo | [[../02-Modulos/Menu-Saludable]] |
| Agua | water-outline | ✅ Completo | [[../02-Modulos/Recordatorio-Agua]] |
| Retos | trophy-outline | ✅ Completo | [[../02-Modulos/Retos]] |

---

## Flujo recomendado de uso

```
1. Nutrición → completar perfil (nombre, edad, sexo, peso, talla, actividad)
       ↓
2. Ver resultados: calorías, macros, IMC, meta de agua
       ↓
3. Menú diario → ver desayuno, almuerzo, cena y snack personalizados
       ↓
4. Alimentos → buscar cualquier alimento y ver su info nutricional
       ↓
5. Agua → registrar vasos durante el día, ver progreso
       ↓
6. Retos → aceptar desafíos y marcar progreso diario
```

---

## Tab Nutrición — paso a paso

### Primera vez (onboarding 3 pasos)
1. **Paso 1:** Nombre → Edad → Sexo (M / F) → **Siguiente**
2. **Paso 2:** Peso en kg (ej: `68.5`) → Talla en cm (ej: `170`) → **Siguiente**
3. **Paso 3:** Nivel de actividad → **Calcular**

### Resultados que muestra
| Dato | Descripción |
|------|-------------|
| Calorías diarias | kcal totales recomendadas por día |
| TMB | calorías en reposo absoluto |
| Proteínas | gramos/día (20% de calorías) |
| Carbohidratos | gramos/día (50% de calorías) |
| Grasas | gramos/día (30% de calorías) |
| IMC | índice de masa corporal con categoría y color |
| Meta de agua | mililitros diarios (peso × 35) |

### Actualizar perfil
- Tocar **"Actualizar mi perfil"** → repite el onboarding

---

## Tab Alimentos — paso a paso

1. Escribir el nombre del alimento en el buscador
2. Ver resultados en dos secciones:
   - **📍 Base local** → 54 alimentos peruanos (instantáneo, sin internet)
   - **🌐 Open Food Facts** → miles de productos (requiere 3+ letras e internet)
3. Tocar un alimento → ver detalle con:
   - Calorías por porción
   - Barras de macros (proteínas, carbos, grasas, fibra)
   - Advertencia educativa para ultraprocesados
   - Fuente del dato (local u Open Food Facts)

---

## Tab Menú diario — paso a paso

> Requiere tener el perfil completado en Nutrición.

1. Ver el menú del día generado automáticamente
2. Cada card muestra: nombre del plato, ítems con porciones y calorías, macros
3. La barra de progreso muestra el % del objetivo calórico cubierto
4. Tocar **"Generar otro menú"** para obtener una variante diferente

---

## Tab Agua — paso a paso

1. Ver la meta diaria (calculada del perfil: peso × 35 ml)
2. Tocar un botón rápido: **+150 / +250 / +350 / +500 ml**
3. O tocar **"Agregar vaso (250 ml)"** para el botón principal
4. Seguir el progreso en la barra azul
5. Al cumplir la meta → aparece **"¡Meta cumplida! 🎉"**
6. Ver el historial de los últimos 7 días con barras y marca ✓

## Diario de comidas

1. En **Alimentos**, abre un alimento y toca **Agregar a mi día** (gramos + comida).
2. En **Diario** ves las calorías y macros del día frente a tu meta y puedes eliminar entradas.
3. Los retos marcados **Automático** (fruta en el desayuno, verdura en el almuerzo, legumbres, agua, perfil) se completan solos si los aceptaste.

## Editar perfil, objetivo y datos de ejemplo

- En **Nutrición** → **Editar perfil** puedes cambiar tus datos y elegir objetivo (bajar, mantener o subir peso).
- Sin perfil, **Cargar datos de ejemplo** llena la app para una demo. **Borrar todos los datos** la deja como nueva.

> Los recordatorios de agua están implementados; confirma su funcionamiento en el APK final (Expo Go puede no mostrarlos).

---

## Tab Retos — paso a paso

1. Ver tu **nivel actual** y barra de progreso hacia el siguiente
2. En **"🔥 En progreso"**: tocar **"✓ Marcar día"** cuando cumplas el reto del día
3. En **"⚡ Disponibles"**: tocar **"Aceptar reto"** para activar nuevos desafíos
4. En **"✅ Completados"**: ver los retos terminados con puntos obtenidos
5. El reto "Meta de agua diaria" se completa solo al cumplir la meta en el tab Agua

---

## Persistencia de datos

Todos los datos se guardan localmente en el celular (AsyncStorage + SQLite):

| Dato | Almacenamiento | Clave |
|------|---------------|-------|
| Perfil del usuario | AsyncStorage | `@nutriapp:user` |
| Registro de agua (por día) | AsyncStorage | `@nutriapp:water:YYYY-MM-DD` |
| Retos y progreso | AsyncStorage | `@nutriapp:challenges` |
| Base de alimentos | SQLite | `nutriapp.db` |

- No requiere internet para funcionar (offline-first)
- Los datos persisten al cerrar y abrir la app
- No se sincronizan con ningún servidor

---

## Referencias

- [[../02-Modulos/Calculadora-Nutricional]] — detalle técnico Nutrición
- [[../02-Modulos/Alimentos]] — detalle técnico Alimentos
- [[../02-Modulos/Menu-Saludable]] — detalle técnico Menú
- [[../02-Modulos/Recordatorio-Agua]] — detalle técnico Agua
- [[../02-Modulos/Retos]] — detalle técnico Retos
- [[../05-Roadmap/Roadmap]] — progreso del proyecto
