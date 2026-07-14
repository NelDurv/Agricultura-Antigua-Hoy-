# Agricultura Antigua — Memoria de Arquitectura y Cambios

> Archivo vivo que registra toda la evolución del proyecto.
> Sirve como referencia para recuperar estado ante pérdida de contexto.

---

## 📋 Índice
1. [Visión General](#visión-general)
2. [Arquitectura Actual](#arquitectura-actual)
3. [Estructura de Datos](#estructura-de-datos)
4. [Servicios Backend](#servicios-backend)
5. [Registro de Cambios](#registro-de-cambios)
6. [Plan de Evolución](#plan-de-evolución)
7. [Comandos Útiles](#comandos-útiles)
8. [Estado de Auditoría](#estado-de-auditoría)

---

## Visión General

Plataforma educativa de agricultura orgánica con enfoque en el **Modelo Utopía**. Originalmente una web tradicional con secciones, evolucionada hacia un **Sistema Operativo Conversacional** con motor goal-oriented, memoria multicapa, y arquitectura backend REST documentada.

**Stack:** React + TypeScript + Vite + Tailwind CSS + React Router + Express

---

## Arquitectura Actual

```
src/
├── components/
│   ├── blocks/                  # Sistema de bloques reutilizables
│   │   ├── types.ts             #   10 tipos de bloque tipados
│   │   ├── PageRenderer.tsx     #   Renderizador secuencial de PageBlock[]
│   │   └── index.ts             #   Barrel
│   ├── InterfaceOrchestrator.tsx # Orquestador de vista primaria + capas mobile
│   ├── ResourceLayer.tsx         # Renderiza curso/doc/receta/recursos/nodo como capa
│   ├── ConversationPanel.tsx     # Chat persistente con ReactMarkdown + rehype-sanitize
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
│   └── Layout.tsx             # Tres columnas: chat | layers | contenido
│
├── contexts/
│   ├── BrainContext.tsx        # Estado central (messages, layers, sendMessage → GoalProcessor)
│   ├── AuthContext.tsx         # Autenticación
│   ├── UIContext.tsx           # UI (dataSaver, etc.)
│   ├── ProgressContext.tsx     # Progreso de cursos
│   └── index.ts               # Barrel
│
├── core/
│   ├── engine/                 # [NUEVO] Motor goal-oriented
│   │   ├── goalProcessor.ts    #   GoalProcessor class (Goal → Cache → Intent → Plan → Response → Workspace)
│   │   ├── types.ts            #   Goal, GoalStatus, GoalResult
│   │   └── index.ts            #   Exporta goalProcessor singleton
│   ├── memory/                 # [NUEVO] Memoria multicapa
│   │   ├── memoryManager.ts    #   MemoryManager (3 capas: temporal/sesión/proyecto)
│   │   ├── contextPolicy.ts    #   ContextPolicy (14 reglas de clasificación)
│   │   ├── types.ts            #   MemoryLayerId, MemoryEntry, MemoryLayer, MemoryQuery
│   │   └── index.ts            #   Barrel
│   ├── knowledge/
│   │   ├── graph.ts            # Grafo de conocimiento (~130 nodos) + carga prebuild JSON
│   │   ├── types.ts            # Tipos con fullText + keywords
│   │   └── index.ts            # Exportaciones
│   └── search/
│       ├── unifiedIndex.ts     # Índice unificado normalizado de todos los datos
│       └── engine.ts           # Motor de búsqueda global con fuzzy matching
│
├── data/
│   ├── index.ts               # Barrel de exportaciones
│   ├── home/index.ts           # PILARES, MITOS, CASOS_EXITO, NUMEROS_CLAVE, SUBTEMAS
│   ├── courses/index.ts        # COURSES (10)
│   ├── courses32.ts            # COURSES32 (32 con studyContent)
│   ├── biblioteca/index.ts     # BIBLIOTECA (9)
│   ├── recursos/index.ts       # RECETAS (3), GLOSARIO (8)
│   ├── comunidad.ts            # COMMUNITY_POSTS (2)
│   └── instituciones.ts        # INSTITUCIONES_ESTUDIANTES (4)
│
├── types/...
└── assets/
    └── plantilla-dorada.css    # Grid system

server/                         # [MEJORADO] Backend REST + documentación
├── index.ts                    # Express + rate limiting + CORS + Swagger UI
├── swagger.ts                  # OpenAPI 3.0 spec (17 endpoints)
├── routes/
│   ├── status.ts              # GET /api/status
│   ├── courses.ts             # GET /api/courses, /api/courses/:id
│   ├── documents.ts           # GET /api/documents, /api/documents/:id
│   ├── recipes.ts             # GET /api/recipes, /api/recipes/:id
│   ├── campus.ts              # GET /api/campus, /api/campus/:id
│   ├── glossary.ts            # GET /api/glossary
│   ├── search.ts              # GET /api/search (con cache + rate limit + Zod)
│   ├── sitemap.ts             # GET /api/sitemap
│   ├── agrovoc.ts             # GET /api/agrovoc, /api/agrovoc/:id, ?resolve=
│   ├── aiManifest.ts          # GET /api/ai-manifest
│   └── recommend.ts           # GET /api/recommend

public/
└── knowledge-graph.json        # [NUEVO] Pre-built knowledge graph (110 nodos, 246 aristas)

scripts/
└── build-graph.ts              # [NUEVO] Script para generar knowledge-graph.json

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

### GoalProcessor — Tipos del motor goal-oriented
```
Goal { id, text, context, constraints, capabilities?, timeout? }
GoalStatus: 'idle' | 'analyzing' | 'planning' | 'executing' | 'composing' | 'completed' | 'failed'
GoalResult { success, data?, error?, metadata? }
```

### Memory — Capas de memoria
```
MemoryLayerId: 'temporal' | 'session' | 'project'
Capa temporal: TTL 30 min, max 100 entradas (in-memory)
Capa sesión: TTL ∞ (localStorage), max 200 entradas
Capa proyecto: TTL ∞ (localStorage), sin límite
```

---

## Servicios Backend

### API REST (Express, puerto 3001)
- **17 endpoints** documentados vía Swagger UI en `/api/docs`
- Rate limiting: 100 requests/15min global, 20/min search
- Validación Zod en `/api/search`
- Cache de búsqueda con TTL 5 min
- CORS habilitado

### Swagger UI
- `http://localhost:3001/api/docs/` — Documentación interactiva OpenAPI 3.0
- Todos los endpoints documentados con parámetros, descripciones y códigos de respuesta

### Pre-build Knowledge Graph
- `public/knowledge-graph.json` generado con `npm run build:graph`
- 110 nodos, 246 aristas, ~164 KB
- Carga síncrona en producción; runtime en desarrollo

---

## Registro de Cambios

### 2026-07-14 — Sesión 10: GoalProcessor + MemoryManager + Swagger + Cierre de Pendientes

#### F3B — GoalProcessor (Motor Orientado a Objetivos)
- `src/core/engine/goalProcessor.ts` — GoalProcessor class
- Pipeline: Cache → IntentAnalyzer → TaskPlanner → ResponseComposer → Workspace → Cache
- Reemplazó `generateResponse()` en BrainContext
- Estados: idle → analyzing → planning → executing → composing → completed/failed
- Exporta `goalProcessor` singleton, tipos `Goal`, `GoalStatus`, `GoalResult`

#### F3C — MemoryManager (Memoria Multicapa)
- `src/core/memory/memoryManager.ts` — 3 capas con TTL, pruning, persist/restore
- Capa temporal: in-memory, 30 min TTL, max 100 entradas
- Capa sesión: localStorage, ∞ TTL, max 200 entradas
- Capa proyecto: localStorage, ∞ TTL, sin límite
- `src/core/memory/contextPolicy.ts` — 14 reglas de clasificación automática de keys
- Integrado en BrainContext: restaura al mount, persiste al unmount

#### C-04 — XSS Sanitization
- `react-markdown` + `rehype-sanitize` instalados
- ConversationPanel reemplazó renderizado directo por `<ReactMarkdown rehypePlugins={[rehypeSanitize]}>`
- Cursivas, negritas, listas markdown renderizadas; HTML/scripts filtrados

#### A-07 — Pre-build Knowledge Graph
- `scripts/build-graph.ts` genera `public/knowledge-graph.json` (110 nodos, 246 aristas)
- `graph.ts` modificado: carga síncrona vía XHR a `/knowledge-graph.json`
- Build script como `npm run build:graph` y como `prebuild` en package.json

#### M-05 — Lazy Loading (Verificado)
- `App.tsx` usa `React.lazy()` en 8/9 secciones
- Solo HomeSection es estática (correcto para landing page)
- Suspense presente en `InterfaceOrchestrator.tsx`

#### M-08 — Swagger UI
- `swagger-ui-express` instalado y montado en `/api/docs`
- OpenAPI 3.0 spec completa: 17 endpoints con parámetros, respuestas, códigos de error
- Spec definido estáticamente en `server/swagger.ts`

#### Navbar Label Fix
- `'Web AI-Ready'` → `'AI-Ready'` en `App.test.tsx`

#### Tests
- 28 tests pasan (3 test suites)
- Vitest configurado con jsdom

#### INFORME_TECNICO.md
- Actualizado a v1.1.0 (33 secciones, 9.2/10)

### 2026-07-12 — Sesión 4: Chat IA Rediseñado + Navbar Simplificado

#### Cambios realizados:
1. **ConversationPanel** — Rediseño completo como chat IA moderno (estilo ChatGPT)
   - Header con logo "Asistente Agricultura Antigua", nombre de usuario, botón de nueva conversación
   - Chips de navegación (Inicio, Campus, Biblioteca, Academia, Comunidad, Herramientas, AI-Ready, Perfil) integrados justo debajo del header como accesos directos clickeables
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

### 2026-07-13 — Sesión 8: Migración Masiva a Bloques de Contenido

#### Cambios realizados:
1. **Hero Blocks unificados** — 6 de 8 secciones migradas al bloque `hero`
   - `BibliotecaSection`, `RecursosSection`, `AcademiaSection`, `ComunidadSection`, `InstitucionesSection`, `PerfilSection`
   - Quedan custom: `CampusSection` y `AIReadySection`

2. **Impacto**: ~240 líneas menos de HTML duplicado

### 2026-07-13 — Sesión 7: Sistema de Bloques de Contenido Reutilizables
- 10 tipos de bloque (hero, stats, card-grid, feature-grid, accordion, tabs, cta-banner, text, two-column, search-filter)
- HomeSection refactorizada de 592 → ~280 líneas

### 2026-07-12 — Sesión 6: Navegación Vuelve al Navbar + Toolbar al Footer

### 2026-07-12 — Sesión 5: Índice Unificado + Búsqueda Fuzzy + Layout 3 Columnas
- Índice unificado (normaliza todas las fuentes)
- Búsqueda fuzzy (substring, prefijo, bigramas)
- Layout 3 columnas: chat | capas | contenido

### 2026-07-11 — Sesión 3: Sistema de Capas y Micro-Interfaces (Fase 2)
- Sistema de capas en BrainContext
- InterfaceOrchestrator + ResourceLayer

---

## Plan de Evolución

### Fase 1: Fundación Conversacional ✅ COMPLETADA
### Fase 2: Micro-Interfaces ✅ COMPLETADA
### Fase 3: Motor Goal-Oriented ✅ COMPLETADA
- [x] GoalProcessor con pipeline (Cache → Intent → Plan → Response → Workspace)
- [x] Memoria multicapa (temporal/sesión/proyecto) con ContextPolicy
### Fase 4: Robustecimiento Backend ✅ COMPLETADA
- [x] Pre-build knowledge graph (A-07)
- [x] Swagger UI / OpenAPI (M-08)
- [x] Lazy Loading verificado (M-05)
- [x] XSS Sanitization (C-04)
### Fase 5: Monitoreo (PENDIENTE)
- [ ] Sentry / Web Vitals (M-07) — requiere cuenta externa + DSN

---

## Comandos Útiles

```bash
npm run dev            # Desarrollo local (Vite, puerto 3000)
npm run api            # Servidor API REST (Express, puerto 3001)
npm run api:dev        # API con watch mode
npm run build          # Build producción (ejecuta prebuild → build:graph)
npm run build:graph    # Genera knowledge-graph.json
npm run preview        # Preview del build
npm run test           # Tests (28 tests, 3 suites)
npm run lint           # TypeScript check
```

---

## Estado de Auditoría

**Puntaje final:** 9.2/10 — 🟢 Listo para Producción

| Criterio | Puntaje |
|---|---|
| Funcionalidad | 10/10 |
| Calidad del código | 9.5/10 |
| Testing | 8.5/10 |
| Documentación | 9.5/10 |
| Seguridad | 9/10 |
| Rendimiento | 9.5/10 |
| Accesibilidad | 8.5/10 |

**Mejoras post-auditoría:** C-04 (XSS sanitization), F3C (MemoryManager), F3B (GoalProcessor), A-07 (pre-build graph), M-08 (Swagger UI)

---

## Notas Técnicas

- Los datos están en `src/data/`, los tipos en `src/types/`
- El grafo de conocimiento carga `public/knowledge-graph.json` en producción; en dev construye en runtime
- GoalProcessor singleton en `src/core/engine/`: pipeline goal-oriented que reemplazó generateResponse
- MemoryManager en `src/core/memory/`: 3 capas con persistencia automática en localStorage
- Los 32 cursos avanzados están en `src/data/courses32.ts` con `studyContent` opcional
- CSS grid system definido en `plantilla-dorada.css` (clases `ocn-grid`, `ocn-card`, etc.)
- Footer: gradiente verde `#4f8c2a → #3b5a15`, texto dorado `#ffd700`
- `searchNodes()` usa fuzzy matching: substring, prefijo común, y bigramas para tolerar errores ortográficos
- La API REST tiene 17 endpoints, rate limiting, validación Zod, y Swagger UI en `/api/docs`
- El build de producción ejecuta `prebuild` que regenera el knowledge graph automáticamente
- ConversationPanel usa ReactMarkdown + rehype-sanitize para renderizado seguro contra XSS
