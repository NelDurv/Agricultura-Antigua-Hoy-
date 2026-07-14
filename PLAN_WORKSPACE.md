# PLAN DE EVOLUCIÓN — FASE 3: WORKSPACE CONVERSACIONAL
## Nueva Ruta de Implementación basada en Auditoría Arquitectónica

**Fecha:** 13 de julio de 2026  
**Auditoría:** 8.8/10 — Calidad arquitectónica  
**Paradigma actual:** Sistema Operativo Conversacional (en transición)  
**Paradigma destino:** Workspace Conversacional gobernado por Motor de Decisiones

---

## 1. Análisis de la Auditoría

### 1.1 Fortalezas confirmadas (mantener)

| Elemento | Por qué funciona |
|---|---|
| **BrainContext** | Núcleo del sistema, estado unificado chat + capas + acciones |
| **InterfaceOrchestrator** | Separa vista primaria de capas secundarias |
| **ResourceLayer** | Micro-interfaces contextuales según tipo de contenido |
| **ViewActions** | Puente entre el chat y la vista activa |
| **Sistema de Bloques** | Contenido declarativo y consistente entre páginas |
| **Índice Unificado** | Búsqueda semántica con tolerancia a errores |

### 1.2 Debilidades identificadas (transformar)

| Problema | Diagnóstico |
|---|---|
| **App organizada en Sections** | Todavía piensa como sitio web tradicional: HomeSection, CampusSection, BibliotecaSection... |
| **IA controla páginas, no la experiencia** | ViewActions cambia contenido de una Section, pero no reconfigura el espacio de trabajo completo |
| **No hay motor de decisiones** | `generateResponse()` es un callback lineal, no un pipeline de intención → plan → ejecución |
| **Workspace inexistente** | No hay un concepto de "espacio de trabajo" que la IA pueda crear, destruir o recomponer |

### 1.3 Oportunidades detectadas

```
Estado actual:
  Usuario → generateResponse() → ViewAction → Section

Estado deseado:
  Usuario → Intent Analyzer → Task Planner → Workspace Manager →
  Panel Manager → Tool Router → LLM → Response Composer
```

---

## 2. Nueva Arquitectura Propuesta

### 2.1 Mapa Conceptual

```
                     ┌─────────────────────────┐
                     │    Intent Analyzer       │
                     │  (clasifica intención)   │
                     └──────────┬──────────────┘
                                │
                     ┌──────────▼──────────────┐
                     │     Task Planner         │
                     │  (qué tareas ejecutar)   │
                     └──────────┬──────────────┘
                                │
                     ┌──────────▼──────────────┐
                     │    Workspace Manager     │
                     │  (define el espacio)     │
                     └──────────┬──────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │ Panel Manager│  │  Tool Router │  │  LLM Call    │
     │ (qué paneles)│  │ (qué herramientas)│ (respuesta) │
     └──────────────┘  └──────────────┘  └──────────────┘
              │                 │                 │
              └─────────────────┼─────────────────┘
                                ▼
                     ┌─────────────────────────┐
                     │    Response Composer     │
                     │  (mensaje + paneles +    │
                     │   herramientas + vista)  │
                     └─────────────────────────┘
```

### 2.2 Nuevos Conceptos

| Concepto | Descripción | Reemplaza |
|---|---|---|
| **Workspace** | Espacio de trabajo dinámico que contiene panels, views y widgets | La idea de "página" |
| **Panel** | Unidad funcional (chat, curso, documento, laboratorio, notas, glosario) | Sections |
| **View** | Estado visual de un panel (minimizado, abierto, enfocado) | Routing |
| **Widget** | Micro-componente incrustable (calculadora, gráfico, timeline) | Componentes aislados |
| **Intent** | Intención del usuario clasificada (aprender, calcular, investigar, comparar) | Consulta raw |
| **Plan** | Secuencia de tareas que la IA ejecuta para satisfacer la intención | generateResponse() |
| **Tool** | Recurso que la IA puede invocar (searchNodes, openDocument, runCalculator) | Acciones hardcodeadas |

### 2.3 Ejemplo de Funcionamiento

**Usuario:** *"Quiero aprender sobre Trichoderma y preparar un caldo sulfocálcico"*

**Flujo actual:**
```
1. generateResponse() busca "trichoderma" en el índice
2. Encuentra nodos: curso de microbiología, receta de caldo
3. Crea 2 capas laterales (course + recipe)
4. Devuelve texto + suggestions
```

**Flujo nuevo:**
```
1. Intent Analyzer clasifica: { intent: 'aprender-y-aplicar', temas: ['trichoderma', 'caldo sulfocálcico'] }
2. Task Planner genera plan:
   - t1: mostrar introducción a Trichoderma (texto + glosario)
   - t2: abrir curso relacionado como panel principal
   - t3: abrir receta de caldo como panel secundario
   - t4: sugerir laboratorio (herramienta de mezclas)
3. Workspace Manager crea espacio:
   - panel principal: Curso "Microbiología de Suelos"
   - panel secundario: Receta "Caldo Sulfocálcico"
   - widget lateral: Glosario (Trichoderma, Hongos benéficos)
   - widget infernal: Calculadora de proporciones
4. Response Composer ensambla: mensaje + panels + widgets
```

---

## 3. Plan de Implementación por Fases

### FASE 3A: Fundación del Workspace (Sesiones 10-12)
**Objetivo:** Crear las estructuras base sin romper la funcionalidad existente.

#### Sesión 10 — Motor de Decisiones (Intent Analyzer + Task Planner)
**Archivos a crear:**
| Archivo | Propósito |
|---|---|
| `src/core/engine/types.ts` | Tipos: Intent, Task, Plan, Workspace, Panel, Widget |
| `src/core/engine/intentAnalyzer.ts` | Clasificador de intención del usuario |
| `src/core/engine/taskPlanner.ts` | Generador de plan basado en intención + conocimiento |

**Cambios:**
- `BrainContext.generateResponse()` delega en `intentAnalyzer` + `taskPlanner`
- Se mantiene `generateResponse()` como wrapper para no romper el chat existente
- Los intents iniciales: `learn`, `apply`, `investigate`, `compare`, `calculate`, `explore`

**Criterio de éxito:** La IA clasifica correctamente 5 tipos de intención y genera un plan estructurado.

#### Sesión 11 — Workspace Manager + Panel Manager
**Archivos a crear:**
| Archivo | Propósito |
|---|---|
| `src/core/engine/workspaceManager.ts` | Crea/destruye/modifica workspaces |
| `src/core/engine/panelManager.ts` | Administra paneles dentro de un workspace |
| `src/core/engine/toolRouter.ts` | Enruta tareas a herramientas específicas |

**Cambios:**
- BrainContext: nuevo estado `workspace: Workspace | null`
- BrainContext: `panels: Panel[]` reemplaza conceptualmente a `layers: Layer[]`
- InterfaceOrchestrator: renderiza workspace en lugar de `<Outlet />`
- Las Sections existentes se mantienen como posibles "Panel views"

**Criterio de éxito:** La IA puede crear un workspace con 2-3 paneles y el layout los muestra correctamente.

#### Sesión 12 — Response Composer + Migración de generateResponse()
**Archivos a crear:**
| Archivo | Propósito |
|---|---|
| `src/core/engine/responseComposer.ts` | Ensambla mensaje + panels + widgets en una respuesta |
| `src/core/engine/index.ts` | Barrel del motor de decisiones |

**Cambios:**
- `generateResponse()` se refactoriza para usar el pipeline completo
- Se elimina la lógica hardcodeada de detección de tipos (isCourse, isGlossary, etc.)
- ViewActions se integran como salida del Response Composer
- Se añade logging de decisiones (intent detected, plan generated, workspace created)

**Criterio de éxito:** El chat existente funciona igual, pero internamente usa el nuevo motor. Diferencia cero para el usuario.

---

### FASE 3B: Transformación de la Interfaz (Sesiones 13-15)
**Objetivo:** La UI deja de ser "páginas" y se convierte en "workspace dinámico".

#### Sesión 13 — WorkspaceRenderer (reemplaza el sistema de routing parcialmente)
**Archivos a crear:**
| Archivo | Propósito |
|---|---|
| `src/components/workspace/WorkspaceRenderer.tsx` | Renderiza el workspace completo |
| `src/components/workspace/PanelFrame.tsx` | Contenedor de panel (título, toolbar, contenido, min/max/close) |
| `src/components/workspace/WidgetSlot.tsx` | Slot para widgets incrustables |
| `src/components/workspace/index.ts` | Barrel |

**Cambios:**
- InterfaceOrchestrator: si hay workspace activo, renderiza WorkspaceRenderer en lugar de `<Outlet />`
- WorkspaceRenderer layout: grilla dinámica (paneles principales + widgets)
- Cada PanelFrame tiene: header con título + botones de acción + contenido
- Los paneles pueden ser: minimizados, abiertos, en foco (ocupa todo el espacio)

**Criterio de éxito:** Un workspace con 3 paneles se renderiza correctamente en desktop y mobile.

#### Sesión 14 — Panel Views (adaptar Sections a Paneles)
**Archivos a crear:**
| Archivo | Propósito |
|---|---|
| `src/components/workspace/panels/CoursePanel.tsx` | Vista de curso como panel |
| `src/components/workspace/panels/DocumentPanel.tsx` | Vista de documento como panel |
| `src/components/workspace/panels/RecipePanel.tsx` | Vista de receta como panel |
| `src/components/workspace/panels/GlossaryPanel.tsx` | Vista de glosario como panel |
| `src/components/workspace/panels/CalculatorPanel.tsx` | Calculadora como panel |
| `src/components/workspace/panels/index.ts` | Barrel |

**Cambios:**
- Cada PanelView se extrae de la Section correspondiente (ej. la vista de detalle de receta de RecursosSection → RecipePanel)
- Las Sections originales se mantienen como "vistas completas" (acceso tradicional)
- Los paneles son ligeros, sin layout de página (sin hero banner, sin sidebar)

**Criterio de éxito:** La IA puede abrir un CoursePanel + RecipePanel en el mismo workspace y ambos funcionan.

#### Sesión 15 — Widget System
**Archivos a crear:**
| Archivo | Propósito |
|---|---|
| `src/components/workspace/widgets/GlossaryWidget.tsx` | Mini glosario contextual |
| `src/components/workspace/widgets/ProgressWidget.tsx` | Barra de progreso del curso |
| `src/components/workspace/widgets/RelatedContentWidget.tsx` | Contenido relacionado del grafo |
| `src/components/workspace/widgets/CalculatorWidget.tsx` | Calculadora rápida |
| `src/components/workspace/widgets/index.ts` | Barrel |

**Cambios:**
- Los widgets se renderizan en WidgetSlots dentro del workspace
- Son versiones compactas de componentes existentes
- La IA decide qué widgets mostrar según el contexto

**Criterio de éxito:** Un workspace de "aprender Trichoderma" muestra el GlossaryWidget con términos relacionados.

---

### FASE 3C: Motor de Decisiones Completo (Sesiones 16-18)
**Objetivo:** El motor de decisiones es autónomo, testeable y extensible.

#### Sesión 16 — Intent Analyzer avanzado
- Clasificación por palabras clave + contexto de la conversación
- Detección de intenciones compuestas (aprender Y aplicar)
- Historial de intents para mejorar precisión

#### Sesión 17 — Tool Router completo
- Registro centralizado de herramientas: `registerTool(name, handler, schema)`
- Herramientas iniciales: searchNodes, openDocument, runCalculator, getGlossary, getCourse
- Cada herramienta tiene: nombre, descripción, schema de parámetros, handler

#### Sesión 18 — Evaluación y iteración
- Logging de decisiones (intent, plan, herramientas usadas, resultado)
- Pruebas unitarias del pipeline completo
- Ajuste de pesos y prioridades

---

### FASE 4: IA-Ready (Sesiones 19-22)
**Objetivo:** La plataforma es consumible por IAs externas.

| Sesión | Tarea |
|---|---|
| 19 | JSON-LD estructurado (schema.org/Course, Article, Recipe) |
| 20 | API de contexto compartido (endpoints REST para IAs) |
| 21 | Metadatos AGROVOC para contenido semántico |
| 22 | Sistema de recomendación recíproca con IAs externas |

---

## 4. Mapa de Transformación Sections → Panels

| Section actual | Panel resultante | Widget asociado |
|---|---|---|
| `CampusSection` | `CoursePanel` + `CourseListPanel` | `ProgressWidget` |
| `BibliotecaSection` | `DocumentPanel` + `DocumentListPanel` | `RelatedContentWidget` |
| `RecursosSection` | `RecipePanel` + `GlossaryPanel` + `CalculatorPanel` | `GlossaryWidget` |
| `AcademiaSection` | `ModulePanel` + `QuizPanel` | `ProgressWidget` |
| `ComunidadSection` | `ForumPanel` + `PostPanel` | — |
| `InstitucionesSection` | `DashboardPanel` | — |
| `PerfilSection` | `ProfilePanel` | `ProgressWidget` |
| `AIReadySection` | `SchemaPanel` + `APIPlaygroundPanel` | — |
| `HomeSection` | (pantalla de bienvenida/workspace vacío) | — |

---

## 5. Criterios de Éxito por Fase

| Fase | Criterio |
|---|---|
| **3A** | El motor de decisiones existe, clasifica intents y genera planes. Las Sections no cambian. |
| **3B** | Un workspace con 3 paneles (curso, documento, glosario) se renderiza sin errores. El usuario puede alternar entre workspace y vista tradicional. |
| **3C** | El 80% de las consultas generan un workspace en lugar de solo texto + capas. |
| **4** | Una IA externa puede consumir el contenido del sitio via API y JSON-LD. |

---

## 6. Riesgos y Mitigaciones

| Riesgo | Mitigación |
|---|---|
| Romper la navegación existente | Las Sections tradicionales se mantienen como fallback. Workspace es opt-in. |
| Complejidad del motor de decisiones | Se construye incrementalmente. Sesión 10 = clasificador simple, Sesión 16 = avanzado. |
| Pérdida de contexto del usuario | Workspace Manager preserva el historial de paneles por sesión. |
| Mobile: workspace con muchos paneles | Solo 1 panel visible a la vez en mobile, con navegación tipo tabs. |

---

## 7. Diferencia con el Plan Anterior

| Antes (Fase 3 original) | Ahora (Fase 3A-3C) |
|---|---|
| Refactorizar Sections para recibir props | Crear Workspace como contenedor universal |
| Composer mueve contexto entre vistas | Motor de decisiones planifica el workspace completo |
| Vistas primary + secondary overlay | Paneles + Widgets en layout dinámico |
| Navegación desde capas | Tool Router decide qué herramientas invocar |

El cambio fundamental: **ya no se trata de mejorar las Sections, sino de trascenderlas.**

---

*Documento generado el 13 de julio de 2026. Próxima revisión: al completar la Sesión 12 (fin de Fase 3A).*
