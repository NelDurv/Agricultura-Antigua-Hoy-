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
│   │                              #   + confirmación "Limpiar historial"
│   ├── GlossaryTooltip.tsx       # Tooltips de glosario en textos
│   ├── HomeSection.tsx        # Página principal
│   ├── CampusSection.tsx      # Cursos
│   ├── BibliotecaSection.tsx  # Documentos técnicos
│   ├── RecursosSection.tsx    # Recetas, glosario, pilares, calculadora
│   ├── AcademiaSection.tsx    # Módulos de aprendizaje + perfil + certificados
│   ├── ComunidadSection.tsx   # Foro
│   ├── InstitucionesSection.tsx # Panel cooperativo
│   ├── AIReadySection.tsx     # Laboratorio IA (protegido con password)
│   ├── Navbar.tsx             # Navbar: logo + tabs desktop + hamburguesa mobile
│   │                            #   + búsqueda + cierra chat al navegar en mobile
│   ├── SearchBar.tsx          # Búsqueda global
│   └── AccessibilityToolbar.tsx
│
├── layouts/
│   └── Layout.tsx             # 12-col grid: col-span-4 chat | col-span-8 contenido
│                                #   col-span-full en mobile, overflow-y-auto
│
├── contexts/
│   ├── BrainContext.tsx        # Estado central (messages, layers, sendMessage → GoalProcessor)
│   ├── AuthContext.tsx         # Autenticación
│   ├── UIContext.tsx           # UI (dataSaver, etc.)
│   ├── ProgressContext.tsx     # Progreso de cursos
│   └── index.ts               # Barrel
│
├── core/
│   ├── engine/                 # Motor goal-oriented
│   │   ├── goalProcessor.ts   #   GoalProcessor class (Goal → Cache → Intent → Plan → Response → Workspace)
│   │   ├── types.ts            #   Goal, GoalStatus, GoalResult
│   │   └── index.ts            #   Exporta goalProcessor singleton
│   ├── memory/                 # Memoria multicapa
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
│   ├── index.ts               # Barrel — re-exporta toda la nueva estructura
│   ├── inicio.ts              # Hero slides, numerosClave, pilares, mitos
│   ├── campus.ts              # IMR cursos + re-exporta COURSES (10) + COURSES32 (32)
│   ├── academia.ts            # Estudiantes institucionales (4) + estadísticas
│   ├── biblioteca/
│   │   └── index.ts           # BIBLIOTECA (9 docs) + categorias + audios + videos
│   ├── comunidad.ts            # COMMUNITY_POSTS (2) + categorias
│   └── herramientas.ts        # RECETAS (3), GLOSARIO (8), instrumentos (4),
│                                #   ciclosLunares (4 fases), casosExito (3)
│   (old: recursos/, instituciones.ts — eliminados)
│
├── types/...
└── assets/
    └── plantilla-dorada.css    # Grid system + colores earth-tone

server/                         # Backend REST + documentación
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
└── knowledge-graph.json        # Pre-built knowledge graph (1147 nodos, 45566 aristas)

scripts/
└── build-graph.ts              # Script para generar knowledge-graph.json

---

## Estructura de Datos

### `inicio.ts`
```
heroSlides[4]:      campus, agricultura-familiar, ecologica, microorganismos
numerosClave[8]:    95%, 144000, 12°C, 5, 22.4, 80%, 40-50%, 100
pilares[5]:         suelo-vivo, nutricion-vegetal, bioinsumos, agricultura-tradicional, ciencia-moderna
mitos[9]:           mito-1..9
```

### `campus.ts`
```
COURSES[10]:        Cursos base (id, title, description, category, level, modules[])
COURSES32[32]:      Cursos avanzados (id, number, title, objective, questions[], practicalTests[])
```

### `academia.ts`
```
ESTUDIANTES[4]:     instituciones con representantes, cursos, progreso
estadisticas:       totalEstudiantes, cursosActivos, indiceSatisfaccion
```

### `herramientas.ts`
```
RECETAS[3]:         Caldo Sulfocálcico, Biol Potenciado, Ácidos Húmicos
GLOSARIO[~750]:     Cobertura completa: física/química/biología del suelo, bioquímica vegetal,
                    fisiología vegetal, climatología, bacteriología, micología, micorrizas,
                    Trichoderma, ciclos biogeoquímicos (C, N, P, S, K, Ca, Mg, Si, Fe, Mn)
instrumentos[4]:    pH-metro, conductivímetro, ORP, higrómetro
ciclosLunares[4]:   luna nueva, creciente, llena, menguante
casosExito[3]:      uabcs, sumant-kumar, valle-cauca
```

### `biblioteca/index.ts`
```
BIBLIOTECA[9]:      Documentos (Fichas Técnicas, Manuales, Guías, Protocolos, Artículos)
CATEGORIAS_BIBLIOTECA[4]: fichas, guias, protocolos, cursos
AUDIOS[2]:          podcast introductorios
VIDEOS[2]:          tutoriales
```

### `comunidad.ts`
```
COMMUNITY_POSTS[2]:     post-1 (Mosca blanca), post-2 (Bokashi arcilloso)
CATEGORIAS_COMUNIDAD[4]: suelos, bioinsumos, cultivos, comunidad
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
- 1147 nodos, 45566 aristas, ~5.5 MB
- Carga síncrona en producción; runtime en desarrollo

---

## Registro de Cambios

### 2026-07-15 — Sesión 13: Actualización Masiva del Glosario Científico

#### Cambios realizados:
1. **Glosario expandido de ~8 a ~750 términos** en `src/data/herramientas.ts`:
   - **Bioquímica Vegetal**: metabolismo, fotosíntesis, enzimas, ATP, respiración celular
   - **Fisiología Vegetal**: xilema, floema, estomas, hormonas, germinación, floración
   - **Climatología**: atmósfera, fotoperiodo, evapotranspiración, DPV, heladas
   - **Biología del Suelo**: microbiota, red trófica, biopelícula, salud del suelo
   - **Bacteriología**: PGPR, quorum sensing, rizósfera, Rhizobium, Bacillus, Pseudomonas
   - **Micología**: hongos saprófitos, HMA, ectomicorrizas, Trichoderma, micoparasitismo
   - **Ciclos biogeoquímicos completos**: C, N, P, S, K, Ca, Mg, Si, Fe, Mn
   - Cada ciclo incluye: origen, formas, absorción, metabolismo, deficiencia, microbioma asociado

2. **Pilares del Saber** movido de RecursosSection → BibliotecaSection como toggle de vista
3. **Seguridad**: Permissions-Policy, COEP `credentialless`, COOP `same-origin`, HSTS preload
4. **Mobile UX**: `col-span-full` en contenido, hamburger cierra chat, confirmación limpiar historial

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/herramientas.ts` | GLOSARIO expandido ~8 → ~750 términos (secciones científico-técnicas completas) |
| `server/index.ts` | Security headers: Permissions-Policy, COEP, COOP, HSTS |
| `src/components/BibliotecaSection.tsx` | Toggle Documentos/Pilares del Saber |
| `src/components/RecursosSection.tsx` | Pilares removidos, imports limpios |
| `public/knowledge-graph.json` | Regenerado: 110 → 1147 nodos, 246 → 45566 aristas |

#### Estado: Build exitoso (0 errores, 1931 módulos)

### 2026-07-14 — Sesión 12: Natural Intelligence + Data Restructure + Mobile Responsiveness

#### Cambios:

1. **Identidad visual "Natural Intelligence"**:
   - Paleta earth-tone: `forest` (#2D5A27), `earth` (#8B6F47), `water` (#3A7D8C), `wheat` (#C9A227)
   - Fuentes: Cormorant Garamond (headings) + Inter (body)
   - Iconos de investigación (Atom, 🧬 DNA, 🔬) reemplazan iconos AI (Bot, Sprout)
   - Todos los colores `emerald`/`green` migrados a `forest`/`wheat`

2. **Reestructuración de datos (`src/data/`)**:
   - Nuevos archivos: `inicio.ts`, `campus.ts`, `academia.ts`, `herramientas.ts`
   - `biblioteca/index.ts` ampliado: categorias, audios[], videos[]
   - `comunidad.ts` ampliado: categorias
   - Archivos eliminados: `instituciones.ts`, `recursos/` (reemplazado por herramientas.ts)
   - Barrel `index.ts` re-exporta todo + compatibilidad hacia atrás

3. **Layout responsive (grid 12 columnas)**:
   - Chat `col-span-4`, contenido `col-span-8` en desktop
   - `col-span-full` en mobile para evitar contenido invisible
   - Chat `fixed inset-0` en mobile, scroll con `overflow-y-auto`

4. **Navegación mobile**:
   - Menú hamburguesa con 6 tabs en grid 3×2
   - Al navegar desde mobile, el chat se cierra automáticamente (toggleChat)
   - Logo + navbar sticky con z-50 (sobre el chat z-40)

5. **Limpiar historial**:
   - Diálogo de confirmación con "Borrar todo" / "Cancelar"
   - Botón inline verde con icono 🗑️ "Limpiar historial"
   - Botón trash en header con hover rojo

6. **Exportación JSON**: `agricultura-antigua-export.json` con todos los datos del sitio

#### Archivos modificados/creados/eliminados:
| Archivo | Cambio |
|---|---|
| `src/index.css` | Paleta earth-tone + fonts Cormorant Garamond / Inter |
| `src/data/inicio.ts` | **NUEVO** — hero, numerosClave, pilares, mitos |
| `src/data/campus.ts` | **NUEVO** — re-exporta cursos + COURSES32 |
| `src/data/academia.ts` | **NUEVO** — estudiantes + estadísticas |
| `src/data/herramientas.ts` | **NUEVO** — recetas, glosario, instrumentos, ciclos lunares, casos éxito |
| `src/data/biblioteca/index.ts` | Ampliado: categorias, audios, videos |
| `src/data/comunidad.ts` | Ampliado: categorias |
| `src/data/index.ts` | Barrel actualizado |
| `src/data/instituciones.ts` | **ELIMINADO** (reemplazado por academia.ts) |
| `src/data/recursos/` | **ELIMINADO** (reemplazado por herramientas.ts) |
| `src/components/Navbar.tsx` | Hamburguesa mobile + cierre automático de chat |
| `src/components/ConversationPanel.tsx` | Confirmación limpiar + botón inline verde |
| `src/components/CampusSection.tsx` | Import actualizado desde barrel |
| `src/components/ResourceLayer.tsx` | Import simplificado desde barrel |
| `src/components/workspace/PanelContentView.tsx` | Import simplificado desde barrel |
| `src/core/search/unifiedIndex.ts` | Import simplificado desde barrel |
| `src/layouts/Layout.tsx` | `col-span-full` en mobile, `col-span-4/8` en desktop |
| `agricultura-antigua-export.json` | **NUEVO** — export completa de datos |

#### Estado: Build exitoso (0 errores, 1932 módulos)

#### Cambios:

1. **Fusión Academia + Perfil** — `PerfilSection.tsx` eliminado, su contenido migrado a `AcademiaSection.tsx`:
   - Perfil (nombre, email, membresía, edición inline)
   - Certificados con modal de visualización/descarga
   - Documentos favoritos desde Biblioteca
   - Preferencias (toggle ahorro de datos)
   - Navbar reducido: 8 → 6 tabs

2. **AI-Ready oculto y protegido**:
   - Eliminado del Navbar (invisible para visitantes)
   - Ruta `/aiready` protegida con contraseña (`aa-admin`)
   - Acceso persiste en sessionStorage (se borra al cerrar pestaña)
   - Fondo oscuro con formulario de desbloqueo

3. **Seguridad reforzada**:
   - Helmet instalado: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
   - Zod validation en courses, documents, recipes, glossary
   - Cache limit (200 entradas) en search
   - Error handler sanitizado (sin stack traces)

#### Archivos modificados/eliminados:
| Archivo | Cambio |
|---|---|
| `src/components/AcademiaSection.tsx` | Integrado perfil, certificados, favoritos, preferencias |
| `src/components/PerfilSection.tsx` | **ELIMINADO** |
| `src/components/AIReadySection.tsx` | Protegido con password gate |
| `src/components/Navbar.tsx` | 6 tabs (eliminados Perfil y AI-Ready) |
| `src/App.tsx` | Ruta `/perfil` eliminada |
| `server/index.ts` | Helmet + CSP |
| `server/routes/*.ts` | Zod validation en todas las rutas |
| `server/swagger.ts` | OpenAPI spec |
| `src/__tests__/App.test.tsx` | 6 tabs test |

#### Estado: TypeScript 0 errores, 28/28 tests pasan.

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

- Los datos están en `src/data/` organizados por dominio: `inicio.ts`, `campus.ts`, `academia.ts`, `biblioteca/`, `comunidad.ts`, `herramientas.ts`
- El barrel `src/data/index.ts` re-exporta todo; los componentes importan desde `'../data'`
- El layout usa grid de 12 columnas: chat `col-span-4` + contenido `col-span-8` en desktop, `col-span-full` en mobile
- Paleta earth-tone definida en `src/index.css` vía `@theme`: forest, earth, water, wheat
- Fuentes: Cormorant Garamond (serif, headings) + Inter (sans, body) + Fira Code (mono)
- El grafo de conocimiento carga `public/knowledge-graph.json` en producción; en dev construye en runtime
- GoalProcessor singleton en `src/core/engine/`: pipeline goal-oriented que reemplazó generateResponse
- MemoryManager en `src/core/memory/`: 3 capas con persistencia automática en localStorage
- Los 32 cursos avanzados están en `src/data/campus.ts` con `COURSES32`
- ConversationPanel usa ReactMarkdown + rehype-sanitize para renderizado seguro contra XSS
- Confirmación "Limpiar historial" con diálogo modal para evitar borrados accidentales
- Menú hamburguesa visible en mobile (< lg), cierra el chat automáticamente al navegar
- Navbar z-50, chat overlay z-40 en mobile, header sticky con backdrop blur
- CSS grid system definido en `plantilla-dorada.css` (clases `ocn-grid`, `ocn-card`, etc.)
- Footer: gradiente verde `#2D5A27 → #1A3A18`, texto dorado wheat
- `searchNodes()` usa fuzzy matching: substring, prefijo común, y bigramas para tolerar errores ortográficos
- La API REST tiene 17 endpoints, rate limiting, validación Zod, y Swagger UI en `/api/docs`
- El build de producción ejecuta `prebuild` que regenera el knowledge graph automáticamente
