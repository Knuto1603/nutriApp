---
type: nota
tags: [ui, ux, diseño, colores, tipografia, nutriapp]
created: 2026-07-02
links: [[../02-Modulos/Calculadora-Nutricional]], [[../02-Modulos/Menu-Saludable]]
---

# Diseño UI/UX

## Identidad visual

**NutriApp** transmite salud, vitalidad y confianza. La paleta y tipografía refuerzan una sensación natural, energética y accesible para jóvenes estudiantes.

---

## Paleta de colores

```
src/core/constants/colors.ts
```

| Token | Color | Hex | Uso |
|-------|-------|-----|-----|
| `primary` | Azul institucional | `#003176` | Botones principales, íconos activos |
| `primaryLight` | Azul medio | `#4A6FA5` | Fondos de cards, highlights |
| `accent` | Naranja energía | `#F57C00` | CTAs secundarios, alertas positivas |
| `accentLight` | Naranja suave | `#FFB74D` | Tags, badges de retos |
| `background` | Blanco cálido | `#FAFAFA` | Fondo general de pantallas |
| `surface` | Blanco puro | `#FFFFFF` | Cards, modales |
| `textPrimary` | Gris oscuro | `#212121` | Títulos y texto principal |
| `textSecondary` | Gris medio | `#757575` | Subtítulos, texto de ayuda |
| `success` | Verde éxito | `#4CAF50` | Retos completados, meta de agua ✓ |
| `warning` | Amarillo alerta | `#FF9800` | Meta de agua incompleta |
| `error` | Rojo | `#F44336` | Validaciones, errores |
| `water` | Azul agua | `#29B6F6` | Módulo de hidratación |

---

## Tipografía

```
src/core/constants/typography.ts
```

| Elemento | Fuente | Tamaño | Peso |
|----------|--------|--------|------|
| Título de pantalla | System | 24sp | Bold (700) |
| Subtítulo / sección | System | 18sp | SemiBold (600) |
| Cuerpo de texto | System | 14sp | Regular (400) |
| Label de input | System | 12sp | Medium (500) |
| Caption / ayuda | System | 11sp | Regular (400) |

> Se usa la fuente del sistema (SF Pro en iOS, Roboto en Android) para respetar la tipografía nativa y garantizar legibilidad.

---

## Espaciado base (8pt grid)

```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
xxl: 48px
```

Todos los márgenes, paddings y gaps siguen múltiplos de 8.

---

## Flujo de navegación

```
App launch
    │
    ▼
¿Tiene perfil? ──No──► Onboarding (3 pasos)
    │                       │
   Sí                       ▼
    │               Ingresar edad/peso/talla
    │                       │
    ▼                       ▼
Bottom Tab Navigator   Guardar perfil
  │
  ├── Tab 1: Nutrición   (ícono: 🥗)
  ├── Tab 2: Alimentos   (ícono: 🔍)
  ├── Tab 3: Menú diario (ícono: 📋)
  ├── Tab 4: Agua        (ícono: 💧)
  └── Tab 5: Retos       (ícono: 🏆)
```

---

## Componentes globales

| Componente | Descripción |
|------------|-------------|
| `NutritionCard` | Card con valores calóricos y macros, fondo verde claro |
| `MacroChart` *(diseño previsto; hoy no existe como componente)* | Gráfica de dona: proteínas (azul) / carbs (naranja) / grasas (amarillo) |
| `WaterProgress` | Barra horizontal azul con % de hidratación |
| `FoodItem` | Fila con nombre, imagen, kcal y macros |
| `ChallengeCard` | Card con título del reto, barra de progreso y puntos |
| `PrimaryButton` | Botón verde redondeado (border-radius: 24px) |
| `InputField` | Campo con borde verde al enfocarse |

---

## Onboarding (primera apertura)

```
Pantalla 1        Pantalla 2          Pantalla 3
──────────        ──────────          ──────────
[Ilustración]     Nombre:  ____       Talla: __ cm
                  Edad:    __         Peso:  __ kg
 Bienvenido       Sexo:  M / F        Actividad:
 a NutriApp                           ○ Sedentario
                                      ○ Ligero
[Comenzar →]      [Siguiente →]       ● Moderado
                                      [Calcular →]
```

---

## Principios UX

- **Simplicidad**: máximo 2 acciones visibles por pantalla
- **Feedback inmediato**: animaciones cortas al registrar agua o completar reto
- **Offline-first**: toda la funcionalidad core funciona sin internet
- **Accesibilidad**: contraste mínimo 4.5:1, fuentes legibles desde 11sp

---

## Referencias

- [[../02-Modulos/Calculadora-Nutricional]] — pantalla de onboarding/perfil
- [[../01-Arquitectura/Stack-Tecnologico]] — estilos con `StyleSheet` y constantes de `src/core/constants` (Paper instalado sin uso; NativeWind no instalado)
