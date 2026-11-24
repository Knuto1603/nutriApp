---
type: nota
tags: [referencias, ciencia, formulas, nutricion, nutriapp]
created: 2026-07-05
links: [[../02-Modulos/Calculadora-Nutricional]], [[Objetivo]]
---

# Referencias Científicas

> Base científica que sustenta las fórmulas y valores nutricionales implementados en NutriApp.

---

## 1. Fórmula Mifflin-St Jeor (TMB)

**Fuente principal:**
> Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO.
> *"A new predictive equation for resting energy expenditure in healthy individuals."*
> **American Journal of Clinical Nutrition.** 1990;51(2):241–247.
> DOI: 10.1093/ajcn/51.2.241

**Por qué se usa en NutriApp:**
- Es la fórmula más precisa para población general según la **Academy of Nutrition and Dietetics (AND)**
- Supera en exactitud a la fórmula original de Harris-Benedict (1919)
- Validada en estudios con calorimetría indirecta

**Fórmula:**
```
Hombre: TMB = (10 × peso_kg) + (6.25 × talla_cm) − (5 × edad) + 5
Mujer:  TMB = (10 × peso_kg) + (6.25 × talla_cm) − (5 × edad) − 161
```

---

## 2. Factores de actividad física

**Fuente:**
> Harris JA, Benedict FG.
> *"A Biometric Study of Human Basal Metabolism."*
> **Proceedings of the National Academy of Sciences.** 1918;4(12):370–373.

> Revisión moderna:
> McArdle WD, Katch FI, Katch VL.
> *"Exercise Physiology: Nutrition, Energy, and Human Performance."* 8va edición.
> Lippincott Williams & Wilkins, 2015.

> Adoptado también por:
> **Organización Mundial de la Salud (OMS/WHO)**
> *"Energy and protein requirements."* Technical Report Series 724. Ginebra, 1985.

**Valores utilizados:**

| Nivel de actividad | Factor PAL | Descripción clínica |
|--------------------|-----------|---------------------|
| Sedentario | 1.200 | Trabajo de oficina, sin ejercicio regular |
| Ligero | 1.375 | Ejercicio ligero 1–3 días por semana |
| Moderado | 1.550 | Ejercicio moderado 3–5 días por semana |
| Intenso | 1.725 | Ejercicio intenso 6–7 días por semana |

**Cálculo:**
```
Calorías diarias = TMB × Factor de actividad (PAL)
```

---

## 3. Distribución de macronutrientes

**Fuente:**
> Institute of Medicine (IOM), Food and Nutrition Board.
> *"Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids."*
> **National Academies Press.** Washington DC, 2005.
> Rangos AMDR (Acceptable Macronutrient Distribution Ranges)

> Respaldado por:
> **FAO/OMS/UNU.**
> *"Human energy requirements."* Food and Nutrition Technical Report Series 1. Roma, 2004.

**Rangos recomendados vs valores NutriApp:**

| Macronutriente | Rango AMDR | Valor NutriApp | Calorías/gramo |
|----------------|-----------|----------------|---------------|
| Proteínas | 10–35% | **20%** | 4 kcal/g |
| Carbohidratos | 45–65% | **50%** | 4 kcal/g |
| Grasas | 20–35% | **30%** | 9 kcal/g |

> Los valores de NutriApp están dentro de los rangos AMDR y representan una distribución equilibrada estándar para población general sana.

**Cálculo:**
```
Proteínas (g)     = (Calorías × 0.20) ÷ 4
Carbohidratos (g) = (Calorías × 0.50) ÷ 4
Grasas (g)        = (Calorías × 0.30) ÷ 9
```

---

## 4. Índice de Masa Corporal (IMC)

**Fuente:**
> Quetelet LAJ. *"Physique Sociale."* Bruselas, 1869. (Fórmula original)

> Clasificación actual:
> **Organización Mundial de la Salud (OMS/WHO).**
> *"Obesity: preventing and managing the global epidemic."*
> Technical Report Series 894. Ginebra, 2000.

**Fórmula:**
```
IMC = peso (kg) ÷ talla (m)²
```

**Clasificación OMS:**

| IMC | Categoría | Color en NutriApp |
|-----|-----------|------------------|
| < 18.5 | Bajo peso | Azul (`#29B6F6`) |
| 18.5 – 24.9 | Normal | Verde (`#4CAF50`) |
| 25.0 – 29.9 | Sobrepeso | Naranja (`#FF9800`) |
| ≥ 30.0 | Obesidad | Rojo (`#F44336`) |

> **Limitación conocida:** el IMC no distingue masa muscular de masa grasa. Es un indicador poblacional, no diagnóstico individual. NutriApp lo usa como referencia orientativa.

---

## 5. Meta de hidratación diaria

**Fuente:**
> **European Food Safety Authority (EFSA).**
> *"Scientific Opinion on Dietary Reference Values for water."*
> EFSA Journal. 2010;8(3):1459.

> Referencia práctica clínica:
> **Instituto de Medicina (IOM).**
> *"Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate."*
> National Academies Press. 2005.

**Fórmula aplicada:**
```
Meta de agua (ml) = peso (kg) × 35 ml
```

**Ejemplo:** 70 kg × 35 = 2,450 ml/día (~10 vasos de 250 ml)

> La EFSA establece valores de referencia de 2,000 ml/día para mujeres y 2,500 ml/día para hombres en condiciones normales. La fórmula peso × 35 ml es la aproximación clínica más utilizada por profesionales de la salud por su personalización según el peso corporal.

---

## Resumen de fuentes

| Fórmula | Institución / Autor | Año |
|---------|--------------------|----|
| TMB (Mifflin-St Jeor) | American Journal of Clinical Nutrition | 1990 |
| Factores de actividad | Harris & Benedict / OMS | 1919 / 1985 |
| Macronutrientes (AMDR) | Institute of Medicine / FAO-OMS | 2005 / 2004 |
| Clasificación IMC | OMS/WHO | 2000 |
| Meta de agua | EFSA / IOM | 2010 / 2005 |

---

## Referencias

- [[../02-Modulos/Calculadora-Nutricional]] — implementación de estas fórmulas en código
- [[Objetivo]] — propósito educativo de la app
