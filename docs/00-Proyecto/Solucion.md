---
type: nota
tags: [solucion, propuesta, nutriapp]
created: 2026-07-02
links: [[Problema]], [[Objetivo]]
---

# Solución Tecnológica

## Propuesta

Diseñar una **app móvil educativa llamada NutriApp** que permita a los estudiantes:

1. Conocer la información nutricional de los alimentos que consumen
2. Recibir recomendaciones personalizadas para una alimentación saludable
3. Formar hábitos mediante recordatorios y retos gamificados

---

## ¿Por qué una app móvil?

- El smartphone es la herramienta más accesible para estudiantes
- Permite notificaciones en tiempo real (recordatorio de agua)
- Experiencia personalizada según perfil del usuario
- Disponible en cualquier momento y lugar

---

## Módulos de la solución

| Módulo | Función principal |
|--------|------------------|
| [[../02-Modulos/Calculadora-Nutricional\|Calculadora Nutricional]] | Estima necesidades calóricas según edad, peso y talla |
| [[../02-Modulos/Alimentos\|Alimentos]] | Consulta información nutricional de alimentos |
| [[../02-Modulos/Menu-Saludable\|Menú Diario]] | Sugiere desayuno, almuerzo y cena balanceados |
| [[../02-Modulos/Recordatorio-Agua\|Agua]] | Envía alertas para mantener la hidratación |
| [[../02-Modulos/Retos\|Retos]] | Gamifica los hábitos saludables con desafíos |

---

## Menú principal de la app

```
________________
|   NutriApp    |
________________
| * Nutrición   |
| * Alimentos   |
| * Menú diario |
| * Agua        |
| * Retos       |
----------------
```

---

## Referencias

- [[Problema]] — contexto que motiva esta solución
- [[../01-Arquitectura/Arquitectura-General]] — cómo se construye técnicamente
- [[../05-Roadmap/Roadmap]] — cuándo se implementa cada módulo
