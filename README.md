# Agricultura Antigua — Memoria de Arquitectura y Cambios

> Archivo vivo que registra toda la evolución del proyecto.
> Sirve como referencia para recuperar estado ante pérdida de contexto.

---

## 📋 Índice
1. [Visión General](#visión-general)
2. [Arquitectura Actual](#arquitectura-actual)
3. [Estructura de Datos](#estructura-de-datos)
4. [Registro de Cambios](#registro-de-cambios)
5. [Plan de Evolución](#plan-de-evolución)
6. [Comandos Útiles](#comandos-útiles)

---

## Visión General

Plataforma educativa de agricultura orgánica con enfoque en el **Modelo Utopía**. Originalmente una web tradicional con secciones, en evolución hacia un **Sistema Operativo Conversacional** donde el chat es el contenedor principal y la IA orquesta micro-interfaces según contexto.

**Stack:** React + TypeScript + Vite + Tailwind CSS + React Router

---

## Arquitectura Actual

```
src/
├── components/        # Componentes de UI (secciones de página)
│   ├── InterfaceOrchestrator.tsx # Orquestador de vista primaria + capas mobile
│   ├── ResourceLayer.tsx         # Renderiza curso/doc/receta/recursos/nodo como capa
│   ├── ConversationPanel.tsx     # Chat persistente con composer simplificado
│   ├── GlossaryTooltip.tsx       # Tooltips de glosario en textos
│   ├── HomeSection.tsx        # Página principal
│   ├── CampusSection.tsx      # Cursos
│   ├── BibliotecaSection.tsx  # Documentos técnicos
│   ├── RecursosSection.tsx    # Recetas, glosario, pilares, calculadora
│   ├── AcademiaSection.tsx    # Módulos de aprendizaje
│   ├── ComunidadSection.tsx   # Foro
│   ├── InstitucionesSection.tsx # Panel cooperativo
│   ├── PerfilSection.tsx      # Perfil de usuario
│   ├── AIReadySection.tsx     # Laboratorio IA
│   ├── Navbar.tsx             # Navbar con logo + navegación escritorio + búsqueda
│   ├── SearchBar.tsx          # Búsqueda global
│   └── AccessibilityToolbar.tsx
│
├── layouts/
│   └── Layout.tsx             # [MODIFICADO] Tres columnas: chat | layers | contenido
│
├── contexts/
│   ├── BrainContext.tsx        # Estado central (messages, layers, composer, sendMessage)
│   ├── AuthContext.tsx         # Autenticación
│   ├── UIContext.tsx           # UI (dataSaver, etc.)
│   ├── ProgressContext.tsx     # Progreso de cursos
│   └── index.ts               # Barrel
│
├── core/
│   ├── knowledge/
│   │   ├── graph.ts           # Grafo de conocimiento (~130 nodos) + searchNodes fuzzy
│   │   ├── types.ts           # Tipos con fullText + keywords
│   │   └── index.ts           # Exportaciones
│   └── search/
│       ├── unifiedIndex.ts    # [NUEVO] Índice unificado normalizado de todos los datos
│       └── engine.ts          # Motor de búsqueda global con fuzzy matching
│
├── data/
│   ├── index.ts               # Barrel de exportaciones
│   ├── home/index.ts          # PILARES, MITOS, CASOS_EXITO, NUMEROS_CLAVE, SUBTEMAS
│   ├── courses/index.ts       # COURSES (10)
│   ├── courses32.ts           # COURSES32 (32 con studyContent)
│   ├── biblioteca/index.ts    # BIBLIOTECA (9)
│   ├── recursos/index.ts      # RECETAS (3), GLOSARIO (8)
│   ├── comunidad.ts           # COMMUNITY_POSTS (2)
│   └── instituciones.ts       # INSTITUCIONES_ESTUDIANTES (4)
│
├── types/...
└── assets/
    └── plantilla-dorada.css   # Grid system
```

---

## Estructura de Datos

### Home
```
PILARES[5]:   suelo-vivo, nutricion-vegetal, bioinsumos, agricultura-tradicional, ciencia-moderna
MITOS[9]:     mito-1..9
CASOS_EXITO[3]: uabcs, sumant-kumar, valle-cauca
NUMEROS_CLAVE[8]: 95%, 144000, 12°C, 5, 22.4, 80%, 40-50%, 100
SUBTEMAS:     Mapa <string, SubtemaDetalle> (~25 temas con descripción + subtemas + icono)
```

### Cursos
```
COURSES[10]:  Cursos base (id, title, description, category, level, modules[], etc.)
COURSES32[32]: Cursos avanzados (id, number, title, objective, questions[], practicalTests[], studyContent[])
```

### Recursos
```
RECETAS[3]:   Caldo Sulfocálcico, Biol Potenciado, Ácidos Húmicos
GLOSARIO[8]:  Aerobio, Anaerobio, Bokashi, Compost, etc.
```

### Biblioteca
```
BIBLIOTECA[9]: Documentos (Fichas Técnicas, Manuales, Guías, Protocolos, Artículos)
```

### Comunidad
```
COMMUNITY_POSTS[2]: post-1 (Mosca blanca), post-2 (Bokashi arcilloso)
```

---

## Knowledge Graph — Nodos Indexados

Actualmente indexa: `COURSES[10]` + `BIBLIOTECA[9]` + `RECETAS[3]` + `GLOSARIO[8]` + `PILARES[5]` + `MITOS[9]` + `CASOS_EXITO[3]` + `NUMEROS_CLAVE[8]` + `SUBTEMAS[~25]` + `COMMUNITY_POSTS[2]` + `COURSES32[32]`

**Total: ~130 nodos interconectados por etiquetas y relaciones.**

---

## Registro de Cambios

### 2026-07-12 — Sesión 4: Chat IA Rediseñado + Navbar Simplificado

#### Cambios realizados:
1. **ConversationPanel** — Rediseño completo como chat IA moderno (estilo ChatGPT)
   - Header con logo "Asistente Agricultura Antigua", nombre de usuario, botón de nueva conversación
   - **Chips de navegación** (Inicio, Campus, Biblioteca, Academia, Comunidad, Herramientas, AI-Ready, Perfil) integrados justo debajo del header como accesos directos clickeables
   - Burbujas de mensaje modernas: usuario en verde (bg-emerald-600), asistente en blanco con borde y sombra, sistema en texto plano
   - Avatares circulares con anillo y fondo por rol
   - Composer rediseñado: borde focus emerald, textarea sin scrollbar, botón de envío verde con icono Send
   - Footer con atajo de teclado "Enter para enviar · Shift+Enter para nueva línea"

2. **Navbar** — Simplificado (la navegación se movió al chat)
   - Eliminados todos los items de navegación (escritorio y móvil)
   - Quitado menú hamburguesa y lógica de menú móvil
   - Solo conserva: banner dorado + logo/título + botón de búsqueda toggle + badge membresía + nombre usuario
   - SearchBar ahora se despliega como dropdown expandible al hacer clic en lupa

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/components/ConversationPanel.tsx` | Rediseño completo como chat IA moderno con chips de navegación |
| `src/components/Navbar.tsx` | Simplificado: solo logo + búsqueda + badge de usuario |

#### Estado del build: ✅ Build exitoso (1726 módulos)

### 2026-07-12 — Sesión 6: Navegación Vuelve al Navbar + Toolbar al Footer

#### Cambios realizados:
1. **Navbar** — Restaurada navegación de escritorio (Inicio, Campus, Biblioteca, Academia, Comunidad, Herramientas, AI-Ready, Perfil) como botones horizontales con iconos `h-3.5 w-3.5`
   - Item activo resaltado con `bg-emerald-100 text-emerald-800`
   - Logo responsive: título oculto en móviles (`hidden sm:block`)
   - Badge membresía más compacto (`text-[8px]`, `px-1.5 py-0.5`)

2. **ConversationPanel** — Simplificado (se eliminaron los chips de navegación)
   - Eliminados: `NAV_ACTIONS[]`, componente `NavChip`, función `handleNavClick`
   - Header más limpio: solo logo asistente + nombre usuario + botón nueva conversación
   - Imports reducidos (solo `Send, Trash2, Sprout` de lucide-react)

3. **AccessibilityToolbar** — Movido más abajo (`bottom-24` → `bottom-8`), pegado al footer

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/components/Navbar.tsx` | Navegación de escritorio restaurada con iconos, resaltado activo, responsive |
| `src/components/ConversationPanel.tsx` | Eliminados chips de navegación, header simplificado |
| `src/components/AccessibilityToolbar.tsx` | `bottom-24` → `bottom-8` |

#### Estado del build: ✅ Build exitoso (1727 módulos, ~543KB bundle)

### 2026-07-12 — Sesión 5: Índice Unificado + Búsqueda Fuzzy + Layout 3 Columnas

#### Cambios realizados:
1. **Índice Unificado** (`src/core/search/unifiedIndex.ts`) — NUEVO
   - Normaliza todas las fuentes (cursos, biblioteca, recetas, glosario, pilares, mitos, casos de éxito, números clave, subtemas, comunidad) en un array único de `NormalizedEntry`
   - Campos normalizados: `id`, `title`, `description`, `fullText`, `tags`, `keywords`, `category`, `difficulty`
   - Extracción inteligente de keywords priorizando términos técnicos agrícolas
   - `fullText` incluye contenido completo (documentos, ingredientes, definiciones, etc.)
   - Función `entriesToNodes()` que convierte el índice a `KnowledgeNode[]`

2. **Búsqueda Fuzzy** (`src/core/knowledge/graph.ts` y `src/core/search/engine.ts`)
   - `fuzzyMatch()`: comparación por substring, prefijo común (min 4 chars), o bigramas (>40% overlap)
   - Stop words ampliadas con "son", "sus", "han", "era"
   - Puntuación por campos: título (+10), keywords (+9), tags (+8), taxones (+6), fullText (+3), descripción (+2)
   - Maneja misspellings como "microrganismos" → encuentra "microorganismos"

3. **KnowledgeNode** (`src/core/knowledge/types.ts`) — Actualizado
   - Nuevos campos: `fullText: string` y `keywords: string[]`

4. **NodeDetailView** (`src/components/ResourceLayer.tsx`) — NUEVO
   - Muestra contenido completo de cualquier nodo del grafo (glosario, investigación, estadísticas)
   - Renderiza `fullText`, título, keywords como tags
   - Nuevo tipo `'node'` en `Layer.component`

5. **Layout 3 Columnas** (`src/layouts/Layout.tsx`) — Rediseñado
   - Columna 1: Chat asistente (380px)
   - Columna 2: Capas de resultados (380px, visible en desktop)
   - Columna 3: Contenido principal (flexible)
   - Mobile: capas como overlay modal (via InterfaceOrchestrator)

6. **BrainContext** — Mejoras en `generateResponse()`
   - Soporte para tipos: `glossary` (define directo en chat), `recipe`, `course`, `biblioteca`
   - `openResourceLayer()` mapea correctamente a `course`, `recipe`, `document` o `node`

#### Archivos nuevos:
| Archivo | Propósito |
|---|---|
| `src/core/search/unifiedIndex.ts` | Índice unificado normalizado de todas las fuentes de datos |

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/core/knowledge/types.ts` | Añadidos `fullText` y `keywords` a KnowledgeNode |
| `src/core/knowledge/graph.ts` | Usa unifiedIndex, searchNodes con fuzzy matching |
| `src/core/search/engine.ts` | globalSearch con fuzzy + keywords + fullText |
| `src/components/ResourceLayer.tsx` | Nuevo NodeDetailView + tipo 'node' |
| `src/contexts/BrainContext.tsx` | generateResponse con soporte glossary/recipe/node |
| `src/layouts/Layout.tsx` | Layout 3 columnas: chat \| layers \| contenido |
| `src/components/InterfaceOrchestrator.tsx` | Limpiado (solo Outlet + mobile layers) |

#### Estado del build: ✅ Build exitoso (1727 módulos, ~543KB bundle)

### 2026-07-11 — Sesión 3: Sistema de Capas y Micro-Interfaces (Fase 2)

#### Cambios realizados:
1. **BrainContext** — Sistema de capas (`layers: Layer[]`)
   - Nueva interfaz `Layer { id, type, title, component, params, resourceId }`
   - Métodos: `addLayer(layer)`, `removeLayer(id)`, `clearLayers()`
   - `generateResponse()` ahora crea capas automáticamente (course, document, resource)
   - Sugerencias con `action: 'layer'` y `payload.resourceId` para abrir recursos
   - Función global `__brainOpenResource(id)` accesible desde cualquier componente
   - Al reiniciar conversación se limpian las capas

2. **InterfaceOrchestrator** (`src/components/InterfaceOrchestrator.tsx`) — NUEVO
   - Componente que reemplaza el `<Outlet />` directo en Layout
   - Renderiza la ruta actual como vista primaria
   - Renderiza capas adicionales como paneles laterales (desktop) o overlay (mobile)
   - Layout flexible: contenido + capas lado a lado
   - Mobile: capas como modal a pantalla completa

3. **ResourceLayer** (`src/components/ResourceLayer.tsx`) — NUEVO
   - Renderiza 4 tipos de contenido según `layer.component`:
     - `course`: muestra objetivo, preguntas clave, pruebas prácticas del COURSES32
     - `document`: muestra metadatos, descripción, botón "Leer" del BIBLIOTECA
     - `recipe`: muestra categoría, ingredientes, botón "Ver receta completa"
     - `resource`: lista de resultados de búsqueda del knowledge graph
   - Cada vista tiene enlace a la sección completa

4. **Layout.tsx** — Integración con InterfaceOrchestrator
   - Reemplazado `<Outlet />` + `<Suspense>` por `<InterfaceOrchestrator />`
   - Quitado import de `Outlet` (ya no se usa directamente)

5. **ConversationPanel.tsx** — Soporte para `action: 'layer'`
   - Sugerencias con `action: 'layer'` disparan `__brainOpenResource()`
   - Quitado import no usado `MessageSquare`

#### Nuevos archivos:
| Archivo | Propósito |
|---|---|
| `src/components/InterfaceOrchestrator.tsx` | Orquestador de vista primaria + capas laterales |
| `src/components/ResourceLayer.tsx` | Renderizador de contenido contextual (curso/doc/receta/recursos) |

#### Modificados:
| Archivo | Cambio |
|---|---|
| `src/contexts/BrainContext.tsx` | Sistema de capas + generateResponse mejorado |
| `src/components/ConversationPanel.tsx` | Manejo de action 'layer' |
| `src/layouts/Layout.tsx` | InterfaceOrchestrator en lugar de Outlet directo |

#### Estado del build: ✅ Build exitoso (2128 módulos, 669KB bundle)

## Plan de Evolución

### Fase 1: Fundación Conversacional ✅ COMPLETADA
- [x] Crear `BrainState` — estado centralizado con memoria de trabajo
- [x] Convertir `Layout.tsx` en capa conversacional (Composer persistente)
- [x] Chat lateral siempre visible, no un componente más
- [x] Sistema de capas: conversación como primary layer

### Fase 2: Micro-Interfaces ✅ COMPLETADA
- [x] Sistema de capas (layers) en BrainContext
- [x] InterfaceOrchestrator que renderiza capas + Outlet
- [x] ResourceLayer: visor contextual de cursos, documentos, recetas y recursos
- [x] AI genera capas automáticamente según la consulta del usuario
- [x] Conversación mantiene contexto entre vistas

### Fase 3: Vistas dinámicas ⬅️ SIGUIENTE
- [ ] Refactorizar cada Section para recibir props de contexto (en lugar de router params)
- [ ] Composer mueve el contexto entre vistas sin recargar
- [ ] Vistas: primary (cambia según contexto) + secondary (overlay opcional)
- [ ] Navegación a secciones completas desde las capas

### Fase 4: IA-Ready
- [ ] JSON-LD estructurado (schema.org/Course, etc.)
- [ ] API de contexto compartido (ChatGPT/Claude pueden pasar contexto)
- [ ] Metadatos AGROVOC para contenido semántico
- [ ] Sistema de "recomendación recíproca" con IAs externas

---

## Comandos Útiles

```bash
npm run dev          # Desarrollo local
npm run build        # Build producción
npm run preview      # Preview del build
npx oxlint src/      # Lint rápido (sin config)
```

---

## Notas Técnicas

- Los datos están en `src/data/`, los tipos en `src/types/`
- El grafo de conocimiento se construye lazy (singleton en `buildKnowledgeGraph()`)
- Las recetas y glosario se importan desde `src/data/recursos/index.ts`
- Los 32 cursos avanzados están en `src/data/courses32.ts` con `studyContent` opcional
- CSS grid system definido en `plantilla-dorada.css` (clases `ocn-grid`, `ocn-card`, etc.)
- Footer: gradiente verde `#4f8c2a → #3b5a15`, texto dorado `#ffd700`
- Paleta activa: dorado/verde (definida en `plantilla-dorada.css`)
- El índice unificado se construye en `src/core/search/unifiedIndex.ts` con lazy singleton
- `searchNodes()` usa fuzzy matching: substring, prefijo común, y bigramas para tolerar errores ortográficos
- Los campos `fullText` y `keywords` en KnowledgeNode permiten búsqueda profunda y priorización semántica
- Layout de 3 columnas: chat (izq) | capas de resultados (centro) | contenido principal (der)
