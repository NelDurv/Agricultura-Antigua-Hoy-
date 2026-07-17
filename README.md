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
│   ├── glosario/               # GLOSARIO modular (~1512 términos en 6 archivos)
│   │   ├── glosario-general.ts #   780 líneas — bioquímica, fisiología, bacteriología, micología
│   │   ├── glosario-suelos.ts  #   314 líneas — física/química/biología del suelo
│   │   ├── glosario-micronutrientes.ts # 185 líneas — Zn, Cu, B, Mo, Cl, Ni
│   │   ├── glosario-clima.ts   #    58 líneas — climatología agrícola
│   │   ├── glosario-riego.ts   #    42 líneas — riego e hidrología
│   │   └── glosario-cientifico.ts #  15 líneas — biotecnología, fisiología molecular, estrés
│   ├── herramientas.ts        # RECETAS (3), instrumentos (4),
│   │                          #   ciclosLunares (4 fases), casosExito (3)
│   └── indice-sitio.json      # Índice navegable del sitio (469 líneas, 28 KB)
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
│   ├── search.ts              # GET /api/search, GET /api/search/unified
│   ├── sitemap.ts             # GET /api/sitemap
│   ├── agrovoc.ts             # GET /api/agrovoc, /api/agrovoc/:id, ?resolve=
│   ├── aiManifest.ts          # GET /api/ai-manifest
│   └── recommend.ts           # GET /api/recommend
├── rag/                        # Pipeline RAG vectorial
│   ├── index.ts               # Barrel
│   ├── types.ts               # RagChunk, RagSearchResult, RagQuery
│   ├── chunker.ts             # Chunking de todo el contenido (1521 chunks)
│   ├── embeddings.ts          # Embeddings all-MiniLM-L6-v2 (384 dims)
│   ├── chroma.ts              # Vector store + búsqueda coseno + filtros
│   ├── indexer.ts             # Indexador (CLI vía npm run build:rag)
│   ├── sfc.ts                 # Compresión semántica SFC (simbolos-sfc.json)
│   └── answer.ts              # Respuesta con Gemini + contexto SFC

public/
└── knowledge-graph.json        # (eliminado — se construye en runtime desde índices)

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

### `herramientas.ts` + `glosario/` (modular)
```
RECETAS[3]:         Caldo Sulfocálcico, Biol Potenciado, Ácidos Húmicos
GLOSARIO[~1512]:    Dividido en 6 archivos modulares:
                    glosario-general.ts (780 líneas) — bioquímica, fisiología, bacteriología,
                        micología, ciclos biogeoquímicos, elementos beneficiosos,
                        micorrizas, ectomicorrizas, HMA, glomalina, bacterias
                    glosario-suelos.ts (314 líneas) — física, química y biología del suelo,
                        rizósfera, microbioma, red alimentaria del suelo
                    glosario-micronutrientes.ts (185 líneas) — Zn, Cu, B, Mo, Cl, Ni
                    glosario-clima.ts (58 líneas) — climatología agrícola
                    glosario-riego.ts (42 líneas) — riego, hidrología
                    glosario-cientifico.ts (15 líneas) — biotecnología, fisiología molecular,
                        estrés abiótico/biótico, holobionte
instrumentos[4]:    pH-metro, conductivímetro, ORP, higrómetro
ciclosLunares[4]:   luna nueva, creciente, llena, menguante
casosExito[3]:      uabcs, sumant-kumar, valle-cauca
```

### `indice-sitio.json` (nuevo)
```
Índice navegable del sitio (469 líneas, 28 KB):
cultivos[14]:       maíz, frijol, calabaza, arroz, tomate, papa, cebolla, ajo,
                    lechuga, zanahoria, pimiento, pepino, berenjena, brócoli
temas[16]:          suelos, agua, clima, nutrientes, bioinsumos, semillas, etc.
conceptos_clave[22]:milpa, SRI, nixtamalización, compostaje, pH, ORP, etc.
paginas[6]:         inicio, cursos, biblioteca, recetas, herramientas, campus
cursos:             9 cursos regulares + 32 cursos Modelo Utopía
documentos[9]:      fichas técnicas, manuales, guías, protocolos, artículos
glosario:           1217 términos en 5 archivos (referencia cruzada)
tags[10]:           con conceptos asociados y totales de metadata
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
- **19+ endpoints** documentados vía Swagger UI en `/api/docs`
- Rate limiting: 100 requests/15min global, 20/min search, 5/min RAG answer
- Validación Zod en `/api/search` y `/api/search/unified`
- Cache de búsqueda con TTL 5 min (keyword) + vector store persistente (RAG)
- CORS habilitado
- **Pipeline RAG**: chunking (1521 chunks) → embeddings all-MiniLM-L6-v2 → vector store → búsqueda coseno
- **RAG Answer**: contexto comprimido con SFC → Gemini 2.0 Flash → respuesta narrativa (con fallback local si Gemini no está disponible)
- **Unified Search**: keyword + vector con score normalizado

### Swagger UI
- `http://localhost:3001/api/docs/` — Documentación interactiva OpenAPI 3.0
- Todos los endpoints documentados con parámetros, descripciones y códigos de respuesta

### Pre-build Knowledge Graph
- `public/knowledge-graph.json` generado con `npm run build:graph` (archivo eliminado, se construye en runtime)
- ~1500+ nodos (construido en runtime desde índices)
- Carga en runtime únicamente; se eliminó la carga síncrona prebuild

---

## Registro de Cambios

### 2026-07-17 — Sesión 33: Fallos de Asistente en Respuesta a Preguntas de Usuario

#### Cambios realizados:

1. **Fix tarjeta vacía del asistente** (`responseComposer.ts:153-154`):
   - `buildLayers` asignaba `component: 'resource'` para entradas `glossary` → renderizaba `ResourceListView` que requiere `params.query` (enviado vacío)
   - Cambiado a `component: 'node'` → renderiza `NodeDetailView(resourceId)` que muestra el contenido real del nodo

2. **Fix falsos positivos en fuzzy matching** (`graph.ts:128`):
   - Bigram threshold subido de 0.4 a 0.55 — eliminó falso positivo `tipos`↔`poros` (2/4=0.5)

3. **Fix búsqueda de glosario sin resultados** (`RecursosSection.tsx:153-182`):
   - Tokeniza la consulta y puntúa cada entrada (10pts término, 3pts definición) en vez de `String.includes()` sobre toda la pregunta

4. **Fix respuesta irrelevante del asistente** (`responseComposer.ts:16-34`):
   - `extractAnswer()` puntúa oraciones por solapamiento con tokens de la consulta
   - +20 bonus si la oración contiene números y la consulta pregunta "cuántos/as"

5. **Optimización buildEdges** (`graph.ts:4-44`):
   - `Set` para deduplicación O(1) de aristas
   - Tags con >50 nodos se saltan (evita timeout con 1500+ nodos)

6. **Fix duplicados de React keys** (`BrainContext.tsx`):
   - `msgCounter` inicializado síncronamente desde localStorage en vez de `useEffect` asíncrono

7. **Fix `useMemo is not defined`** (`BrainContext.tsx`):
   - Cambiado a `React.useMemo()` para evitar errores de HMR

8. **Nuevo archivo de glosario científico** (`src/data/glosario/glosario-cientifico.ts`):
   - 15 entradas: Inoculantes, Consorcios, Ingeniería Genética, CRISPR, Agricultura Biotecnológica,
     Fotosíntesis, Respiración, Transpiración, Hormonas Vegetales (Fitohormonas), Desarrollo Radicular,
     Floración, Fructificación, Estrés Abiótico, Estrés Biótico, Holobionte

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/core/engine/responseComposer.ts` | glossary → `component: 'node'`; `extractAnswer()` con scoring por token |
| `src/core/knowledge/graph.ts` | bigram 0.4→0.55; Set dedup aristas; skip tags >50 nodos |
| `src/components/RecursosSection.tsx` | Búsqueda de glosario tokenizada con puntuación |
| `src/contexts/BrainContext.tsx` | `msgCounter` síncrono; `React.useMemo` |
| `src/data/glosario/glosario-cientifico.ts` | **NUEVO** — 15 entradas científicas |
| `public/knowledge-graph.json` | Eliminado (carga síncrona reemplazada por runtime) |

#### Estado: Build exitoso (0 errores) — Glosario total: ~1512 términos

### 2026-07-15 — Sesión 14: Expansión del Glosario — Ciclos de Micronutrientes (Zn, Cu, B, Mo, Cl, Ni)

#### Cambios realizados:
1. **Glosario expandido de ~750 a ~876 términos** en `src/data/herramientas.ts`:
   - **Manganeso (Mn)**: 6 nuevas entradas (absorción, factores de disponibilidad, movilidad, metabolismo del N, defensa vegetal, visión sistémica)
   - **Zinc (Zn)**: 21 entradas completas (origen, formas, absorción, transportadores ZIP, auxinas, anhidrasa carbónica, Zn-SOD, zinc finger, deficiencia, toxicidad, microbioma)
   - **Cobre (Cu)**: 20 entradas completas (origen, formas, plastocianina, lignificación, citocromo c oxidasa, fungicida natural, microbioma)
   - **Boro (B)**: 22 entradas completas (origen, ácido bórico, pared celular, complejo borato-RG-II, reproducción, transporte de azúcares)
   - **Molibdeno (Mo)**: 21 entradas completas (origen, molibdato, nitrato reductasa, nitrogenasa, cofactor MoCo, Rhizobium)
   - **Cloro (Cl)**: 17 entradas completas (origen, cloruro, fotosíntesis, apertura estomática, balance osmótico, salinidad)
   - **Níquel (Ni)**: 19 entradas completas (origen, ureasa, hidrógenasa, fijación de N₂, germinación)
   - Cada ciclo incluye: origen, formas en el suelo, absorción, metabolismo, deficiencia, toxicidad, interacciones microbianas y visión sistémica

#### Archivos modificados:
| Archivo | Cambio |
|---|---|---|
| `src/data/herramientas.ts` | GLOSARIO ~750 → ~876 términos (6 nuevos ciclos de micronutrientes) |
| `public/knowledge-graph.json` | Regenerado: 1147 → 1274 nodos, 45566 → 53471 aristas |

#### Estado: Build exitoso (0 errores, 1931 módulos)

### 2026-07-15 — Sesión 16: Glosario Modular + Índice del Sitio + Data Fixes

#### Cambios realizados:

1. **GLOSARIO modularizado** — `src/data/herramientas.ts` dividido en 5 archivos dentro de `src/data/glosario/`:
   - `glosario-general.ts` (700 líneas) — bioquímica, fisiología, bacteriología, micología, ciclos biogeoquímicos
   - `glosario-suelos.ts` (257 líneas) — física, química y biología del suelo
   - `glosario-micronutrientes.ts` (185 líneas) — Zn, Cu, B, Mo, Cl, Ni
   - `glosario-clima.ts` (58 líneas) — climatología agrícola
   - `glosario-riego.ts` (42 líneas) — riego e hidrología
   - Total: ~1217 términos (vs ~876 en Sesión 14)

2. **`indice-sitio.json`** — Nuevo índice navegable del sitio (469 líneas, ~28 KB):
   - 14 cultivos indexados con parámetros, tags y páginas asociadas
   - 16 temas con subtemas, cursos y tags relacionados
   - 22 conceptos clave transversales
   - 9 cursos regulares + 32 cursos Modelo Utopía
   - 9 documentos de biblioteca, 3 recetas, 4 instrumentos
   - Glosario: 1217 términos en 5 archivos con referencia cruzada
   - 10 tags con conceptos asociados y metadata de totales

3. **Data fixes**: pH Estación 2 unificado a 3.5-5.0 y ORP con signo negativo en `courses32.ts`

#### Archivos modificados/creados:
| Archivo | Cambio |
|---|---|
| `src/data/glosario/glosario-general.ts` | **NUEVO** — 700 líneas, términos generales |
| `src/data/glosario/glosario-suelos.ts` | **NUEVO** — 257 líneas, términos de suelos |
| `src/data/glosario/glosario-micronutrientes.ts` | **NUEVO** — 185 líneas, micronutrientes |
| `src/data/glosario/glosario-clima.ts` | **NUEVO** — 58 líneas, climatología |
| `src/data/glosario/glosario-riego.ts` | **NUEVO** — 42 líneas, riego |
| `src/data/herramientas.ts` | GLOSARIO extraído a archivos modulares |
| `src/data/indice-sitio.json` | **NUEVO** — 469 líneas, índice del sitio |
| `src/data/courses32.ts` | pH Estación 2: 5.5-6.5 → 3.5-5.0, ORP con signo negativo |
| `public/knowledge-graph.json` | Regenerado |

#### Estado: Build exitoso

### 2026-07-15 — Sesión 15: RAG Answer + SFC Compression + Unified Search

#### Cambios realizados:

1. **RAG Answer con Gemini** — `server/rag/answer.ts` + endpoint `GET /api/rag/answer?q=...`:
   - Usa `@google/genai` (SDK ya instalado como devDependency) para generar respuestas narrativas desde los chunks del RAG
   - Integra SFC para comprimir el contexto antes de enviarlo a Gemini
   - Requiere `GEMINI_API_KEY` en `.env`
   - Retorna: `{ answer, sources: [{ title, source, sourceType, score }], chunksUsed }`

2. **SFC (Semantic Frame Compression)** — `simbolos-sfc.json` + `server/rag/sfc.ts`:
   - Diccionario simbólico con 88 términos agrícolas en 7 categorías (cultivos, variables, unidades, relaciones, suelos, prácticas, plagas)
   - Algoritmo single-pass con regex combinado (evita reemplazos en cascada)
   - Word boundaries para evitar falsos positivos en plurales y palabras compuestas
   - Funciones: `compress(text)`, `expand(text)`, `getLegend()`, `getCompressionRatio(text)`
   - Compresión real: 15-34% en texto técnico agrícola, 343/1521 chunks (22.6%) con compresión

3. **Unified Hybrid Search** — `GET /api/search/unified?q=...`:
   - Combina resultados de búsqueda por keyword (cursos, docs, recetas, glosario, campus) + vectorial (RAG)
   - Normalización de scores con max-scaling por fuente
   - Retorna: `{ query, total, limit, items: [{ searchType, id, title, description, score, sourceType }] }`

4. **Refactor rutas**: `server/routes/rag.ts` actualizado para exportar desde barrel `../rag`, nuevo endpoint `/api/rag/answer`

#### Archivos modificados/creados:
| Archivo | Cambio |
|---|---|
| `simbolos-sfc.json` | **NUEVO** — Diccionario SFC (88 términos, 7 categorías) |
| `server/rag/sfc.ts` | **NUEVO** — Compresor/expansor SFC single-pass |
| `server/rag/answer.ts` | **NUEVO** — Generación de respuesta con Gemini + SFC |
| `server/rag/index.ts` | Exporta SFC + answer |
| `server/routes/rag.ts` | + endpoint `/api/rag/answer` |
| `server/routes/search.ts` | + endpoint `/api/search/unified` |

#### Estado: Build exitoso (0 errores server-side)

### 2026-07-15 — Sesión 17: Rate Limiting + Fallback Determinista

#### Cambios realizados:

1. **Rate limiting estricto para RAG Answer** — `server/routes/rag.ts`:
   - Nuevo `answerLimiter`: **5 requests/minuto por IP** en `GET /api/rag/answer`
   - Protege la cuota de Gemini de agotamiento por uso excesivo o malicioso
   - Usa `express-rate-limit` (ya instalado) — mismo patrón que el search limiter

2. **Fallback determinista en `generateAnswer()`** — `server/rag/answer.ts`:
   - Si `GEMINI_API_KEY` no está configurada → responde con chunks de la base local
   - Si Gemini falla (timeout, error de red, cuota excedida) → responde con chunks locales
   - El endpoint siempre retorna información útil, nunca un error 500/503

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `server/routes/rag.ts` | + rate limiter 5 req/min en `/answer` |
| `server/rag/answer.ts` | + fallback local si Gemini falla o no hay API key |

#### Estado: Build exitoso

### 2026-07-15 — Sesión 18: Vocabulario de Procesos Físico-Químicos del Suelo

#### Cambios realizados:

1. **Nuevo vocabulario agregado a `glosario-general.ts` (+42 entradas)**:
   - **Elementos Beneficiosos** (12 entradas): Sodio, Halófitas, Plantas C4, Cobalto, Selenio, Vanadio, Titanio, Tierras Raras, Lantano, Cerio, Microorganismos Movilizadores
   - **Micorrizas** (17 entradas): Simbiosis, Glomeromycota, Micorrizas Arbusculares, Arbúsculos, Vesículas, Hifas Extrarradicales, Red Micorrícica Común, Ectomicorrizas, Manto Fúngico, Red de Hartig, Micorrizas Ericoides, Orquidioides, Estrigolactonas, Factores Myc, Glomalina, Bacterias Auxiliares MHB
   - **Hongos Micorrícicos Arbusculares** (13 entradas): Filo Glomeromycota, Rhizophagus, Funneliformis, Claroideoglomus, Gigaspora, Acaulospora, Apresorio, Membrana Periarbuscular, Resistencia Sistémica Inducida

2. **Nuevo vocabulario agregado a `glosario-suelos.ts` (+57 entradas)**:
   - **Rizósfera** (13 entradas): Rizoplano, Endorizósfera, Ectorizósfera, Exudados Radiculares, Ácidos Orgánicos, Flavonoides, Mucílagos, PGPR, Biopelículas, Quorum Sensing, Sideróforos, Rizodeposición
   - **Microbioma del Suelo** (22 entradas): Microbiota vs Microbioma, Diversidad Microbiana, Biodiversidad Funcional, Proteobacteria, Actinobacteriota, Acidobacteriota, Firmicutes, Arqueas, Hongos del Suelo, Hifas, Micelio, Bacteriófagos, Protozoos, Metagenómica, Especies Clave, Supresividad, Disbiosis, Eubiosis, Holobionte, Hologenoma
   - **Red Alimentaria del Suelo** (22 entradas): Productores Primarios, Detritos, Descomponedores, Bacterias/Hongos Descomponedores, Enzimas Extracelulares, Consumidores Primarios, Nematodos Bacteriófagos/Fungívoros, Colémbolos, Ácaros, Enquitreidos, Lombrices de Tierra, Galerías, Mineralización, Inmovilización, Biomasa Microbiana, Humificación

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/glosario/glosario-general.ts` | +42 entradas: Elementos Beneficiosos, Micorrizas, HMA |
| `src/data/glosario/glosario-suelos.ts` | +57 entradas: Rizósfera, Microbioma, Red Alimentaria |

#### Estado: Build exitoso — Glosario total: ~1353 términos

### 2026-07-15 — Sesión 19: Ectomicorrizas, CMN, Glomalina, Manejo de Micorrizas, Bacterias

#### Cambios realizados:

1. **Ectomicorrizas** (12 entradas nuevas en `glosario-general.ts`):
   - ECM, Amanita, Boletus, Suillus, Laccaria bicolor, Pisolithus tinctorius, Tuber (trufas)
   - Punta Micorrizada, Nitrógeno Orgánico (ECM), Árboles Madre, Sucesión Forestal, Especificidad

2. **Red Micorrícica Común** (4 entradas):
   - Arquitectura de la red, Transporte de agua, Transporte de carbono, Comunicación entre plantas

3. **Glomalina** (5 entradas):
   - GRSP (proteína relacionada), Estabilidad, Vida media, Indicador de salud del suelo, Secuestro de carbono

4. **Manejo de Micorrizas** (5 entradas):
   - Inoculación micorrícica, Métodos de aplicación, Inoculación en viveros, Cultivos no micorrícicos, Evaluación de colonización

5. **Bacterias** (11 entradas, 6 nuevas + 5 que complementan las existentes):
   - Dominio Bacteria, Flagelos, Pili, Mixótrofas, Respiración anaeróbica, Fermentación bacteriana

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/glosario/glosario-general.ts` | +37 entradas: ECM, CMN, Glomalina, Manejo, Bacterias |

#### Estado: Build exitoso — Glosario total: ~1353 términos

### 2026-07-15 — Sesión 20: PGPR Detallado (Azospirillum, Azotobacter, Bacillus, Pseudomonas, Rhizobium, Bradyrhizobium)

#### Cambios realizados:

1. **PGPR Detallado** (3 entradas nuevas en `glosario-general.ts`):
   - Colonización de la Raíz (etapas), Ácido Indolacético (AIA), Biofertilizantes

2. **Rhizobium Detallado** (6 entradas):
   - Hellriegel y Wilfarth, Martinus Beijerinck, Genes nod, Factores Nod, Formación del Nódulo Radicular, Bacterioides, Simbiosis Tripartita

3. **Bradyrhizobium Detallado** (3 entradas):
   - B. japonicum, B. diazoefficiens, Diferencias Rhizobium vs Bradyrhizobium

4. **Azospirillum Detallado** (4 entradas):
   - A. brasilense, A. lipoferum, Johanna Döbereiner, Poliaminas bacterianas

5. **Azotobacter Detallado** (3 entradas):
   - Sergei Winogradsky, Quistes Bacterianos, Exopolisacáridos Bacterianos

6. **Bacillus Detallado** (6 entradas):
   - B. amyloliquefaciens, B. velezensis, B. thuringiensis, Proteínas Cry, Endosporas, Lipopéptidos Antimicrobianos

7. **Pseudomonas Detallado** (5 entradas):
   - P. fluorescens, P. putida, P. chlororaphis, Fenazinas, DAPG

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/glosario/glosario-general.ts` | +31 entradas: PGPR Detallado, Rhizobium, Bradyrhizobium, Azospirillum, Azotobacter, Bacillus, Pseudomonas |

#### Estado: Build exitoso — Glosario total: ~1384 términos

### 2026-07-15 — Sesión 21: Paenibacillus, Frankia, Streptomyces (Bacterias Detallado)

#### Cambios realizados:

1. **Paenibacillus Detallado** (6 entradas nuevas en `glosario-general.ts`):
   - P. polymyxa, P. azotofixans, P. brasilensis, P. mucilaginosus, Polimixinas, Fusaricidinas

2. **Frankia Detallado** (9 entradas):
   - Albert Bernhard Frank, Plantas actinorrícicas, Nódulo actinorrícico, Alnus, Casuarina, Hippophae, Vesículas (Frankia), Sucesión Ecológica, Simbiosis Frankia-Planta

3. **Streptomyces Detallado** (4 entradas):
   - S. griseus, Ciclo de Vida (Streptomyces), Celulasas (Streptomyces), Biosíntesis de Antibióticos

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/glosario/glosario-general.ts` | +19 entradas: Paenibacillus, Frankia, Streptomyces |

#### Estado: Build exitoso — Glosario total: ~1403 términos

### 2026-07-15 — Sesión 22: Consorcios Bacterianos + Hongos Benéficos (Beauveria, Metarhizium, Purpureocillium, Lecanicillium)

#### Cambios realizados:

1. **Consorcios Bacterianos** (4 entradas nuevas en `glosario-general.ts`):
   - Sinergismo Microbiano, Complementariedad Microbiana, Intercambio Metabólico, Biopelículas Comunitarias

2. **Beauveria** (5 entradas):
   - Beauveria, B. bassiana, B. brongniartii, Beauvericina, Ciclo de Infección

3. **Metarhizium** (5 entradas):
   - Metarhizium, M. anisopliae, M. acridum, Destruxinas, Metarhizium como Endófito

4. **Purpureocillium** (5 entradas):
   - Purpureocillium, P. lilacinum, Parasitismo de Huevos, Nematodos Agalladores, Control Biológico de Nematodos

5. **Lecanicillium** (5 entradas):
   - Lecanicillium, L. lecanii, L. muscarium, Insectos Chupadores, Hongos Entomopatógenos para Insectos Chupadores

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/glosario/glosario-general.ts` | +24 entradas: Consorcios, Beauveria, Metarhizium, Purpureocillium, Lecanicillium |

#### Estado: Build exitoso — Glosario total: ~1427 términos

### 2026-07-15 — Sesión 23: Hongos Saprófitos, Endófitos, Descomponedores, Antagonistas y Consorcios Fúngicos

#### Cambios realizados:

1. **Hongos Saprófitos (complemento)** (2 entradas nuevas en `glosario-general.ts`):
   - Compostaje (Hongos Saprófitos), Glucosamina (hongos)

2. **Hongos Endófitos** (7 entradas):
   - Hongos Endófitos, Transmisión Vertical, Transmisión Horizontal, Epichloë, Colonización Endofítica, Planta como Holobionte, Metabolitos Defensivos

3. **Hongos Descomponedores** (2 entradas):
   - Hongos Descomponedores, Ciclo del Carbono

4. **Hongos Antagonistas** (3 entradas):
   - Hongos Antagonistas (general), Supresividad del Suelo, Clonostachys

5. **Consorcios Fúngicos** (3 entradas):
   - Consorcio Fúngico, Red Micelial (Consorcios), Cooperación Fúngica

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/glosario/glosario-general.ts` | +17 entradas: Hongos Saprófitos, Endófitos, Descomponedores, Antagonistas, Consorcios Fúngicos |

#### Estado: Build exitoso — Glosario total: ~1444 términos

### 2026-07-15 — Sesión 24: Actinobacterias (complemento), Arqueas, Protozoos, Virus del Suelo

#### Cambios realizados:

1. **Actinobacterias (complemento)** (2 entradas nuevas en `glosario-general.ts`):
   - Thermobifida, Actinobacterias Forestales

2. **Arqueas** (7 entradas):
   - Arqueas, Carl Woese y George Fox, Metanogénesis, Arqueas Metanogénicas, Arqueas Oxidantes de Amonio, Tres Dominios de la Vida, Arqueas Extremófilas

3. **Protozoos del Suelo** (5 entradas):
   - Protozoos del Suelo, Amebas, Flagelados, Ciliados, Pastoreo Microbiano

4. **Virus del Suelo** (9 entradas):
   - Virus del Suelo, Viroma, Bacteriófagos (suelo), Ciclo Lítico, Ciclo Lisogénico, Profagos, Transferencia Genética Horizontal, Efecto Kill the Winner, Micovirus

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/glosario/glosario-general.ts` | +23 entradas: Actinobacterias (comp.), Arqueas, Protozoos, Virus |

#### Estado: Build exitoso — Glosario total: ~1467 términos

### 2026-07-15 — Sesión 25: 100 Preguntas y Respuestas de la Comunidad

#### Cambios realizados:

1. **Archivos de Q&A creados** (2 archivos, 100 entradas):
   - `src/data/comunidad-qa.ts`: qa-1 a qa-50 (preguntas sobre suelos, plagas, bioinsumos, casos de éxito)
   - `src/data/comunidad-qa2.ts`: qa-51 a qa-100 (preguntas sobre herramientas, fitopatología, semillas, manejo general)

2. **Fusión en comunidad.ts**:
   - Importados `COMMUNITY_QA` y `COMMUNITY_QA_2` y añadidos como spread en `COMMUNITY_POSTS`

3. **Índice actualizado**:
   - `indice-sitio.json`: `comunidad_posts` y `total_posts_comunidad` → 102

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/comunidad.ts` | +imports de QA, spread en COMMUNITY_POSTS (2 → 102) |
| `src/data/comunidad-qa.ts` | Nuevo: qa-1 a qa-50 con respuestas mejoradas |
| `src/data/comunidad-qa2.ts` | Nuevo: qa-51 a qa-100 con respuestas mejoradas |
| `src/data/indice-sitio.json` | comunidad_posts: 2 → 102 |

#### Estado: Build exitoso — Comunidad posts: 102

### 2026-07-15 — Sesión 26: +300 Preguntas y Respuestas Agrícolas (101-400)

#### Cambios realizados:

1. **Nuevos archivos de Q&A** (3 archivos, 300 entradas):
   - `src/data/comunidad-qa3.ts`: preguntas 101-200 (suelos, nutrición, poda, fitopatología)
   - `src/data/comunidad-qa4.ts`: preguntas 201-300 (solarización, fertilidad, riego, plagas)
   - `src/data/comunidad-qa5.ts`: preguntas 301-400 (fisiología, C3/C4, compactación, poscosecha)

2. **Fusión**: Importados `COMMUNITY_QA_3`, `COMMUNITY_QA_4`, `COMMUNITY_QA_5` y añadidos como spread en `COMMUNITY_POSTS`

3. **Índice**: `indice-sitio.json` → `comunidad_posts` y `total_posts_comunidad`: 402

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/comunidad-qa3.ts` | Nuevo: qa-101 a qa-200 |
| `src/data/comunidad-qa4.ts` | Nuevo: qa-201 a qa-300 |
| `src/data/comunidad-qa5.ts` | Nuevo: qa-301 a qa-400 |
| `src/data/comunidad.ts` | +imports, +spread (102 → 402) |
| `src/data/indice-sitio.json` | comunidad_posts: 102 → 402 |

#### Estado: Build exitoso (0 errores, 1941 módulos) — Comunidad posts: 402

### 2026-07-15 — Sesión 27: +100 Preguntas y Respuestas (401-500)

#### Cambios realizados:

1. **Nuevo archivo de Q&A** (1 archivo, 100 entradas):
   - `src/data/comunidad-qa6.ts`: preguntas 401-500 (microbiología, compostaje, bioinsumos, plagas, suelos)

2. **Fusión**: Importado `COMMUNITY_QA_6` y añadido como spread en `COMMUNITY_POSTS`

3. **Índice**: `indice-sitio.json` → `comunidad_posts` y `total_posts_comunidad`: 502

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/comunidad-qa6.ts` | Nuevo: qa-401 a qa-500 |
| `src/data/comunidad.ts` | +import, +spread (402 → 502) |
| `src/data/indice-sitio.json` | comunidad_posts: 402 → 502 |

#### Estado: Build exitoso (0 errores, 1942 módulos) — Comunidad posts: 502

### 2026-07-16 — Sesión 29: ERROR — Carga Masiva de Datos (ROLLBACK)

#### Error registrado:

Se intentó integrar **500 preguntas** (ids 1001-1500) provenientes de 3 fuentes externas (1 TSV corrupto + 2 TXT con encoding mixto). La fuente TSV contenía corrupción de encoding irreversible (`ï¿½`, `Ç¸`, `Ç­`, etc.) que produjo errores de texto y lógica en las preguntas renderizadas.

**Causa raíz:** Carga excesiva en un solo lote sin verificar encoding de las fuentes. Archivos TSV tenían doble capa de corrupción UTF-8/Latin-1 que no fue detectada antes de la integración.

#### Rollback ejecutado:

1. Eliminados `comunidad-qa12.ts` a `comunidad-qa16.ts`
2. Restaurado `src/data/comunidad.ts` (sin imports/spreads de qa12-qa16)
3. Restaurado `src/data/indice-sitio.json` (1002 posts, no 1502)
4. Corregido encoding en `comunidad-qa8.ts` a `comunidad-qa11.ts` (mojibake Latin-1 recuperable)

#### Lección aprendida:
- No generar más de **100 preguntas por lote** (1 archivo .ts)
- Máximo **300 preguntas por ejecución**
- Verificar encoding UTF-8 de la fuente ANTES de integrar
- Validar con `vite build` antes de reiniciar servidor
- Añadida advertencia programática en `scripts/gen-batch.ps1`

#### Archivos afectados por el rollback:
| Archivo | Cambio |
|---|---|
| `src/data/comunidad-qa12.ts` | Eliminado |
| `src/data/comunidad-qa13.ts` | Eliminado |
| `src/data/comunidad-qa14.ts` | Eliminado |
| `src/data/comunidad-qa15.ts` | Eliminado |
| `src/data/comunidad-qa16.ts` | Eliminado |
| `src/data/comunidad.ts` | Revertido: 1502 → 1002 posts |
| `src/data/indice-sitio.json` | Revertido: 1502 → 1002 |
| `scripts/gen-batch.ps1` | Añadida validación de carga excesiva y encoding |

### 2026-07-15 — Sesión 28: +500 Preguntas y Respuestas (501-1000)

#### Cambios realizados:

1. **Nuevos archivos de Q&A** (5 archivos, 500 entradas):
   - `src/data/comunidad-qa7.ts`: preguntas 501-600
   - `src/data/comunidad-qa8.ts`: preguntas 601-700
   - `src/data/comunidad-qa9.ts`: preguntas 701-800
   - `src/data/comunidad-qa10.ts`: preguntas 801-900
   - `src/data/comunidad-qa11.ts`: preguntas 901-1000

2. **Script de generación**: `scripts/gen-batch.ps1` — genera un archivo QA completo con N preguntas a partir de un array

3. **Fusión**: Importados `COMMUNITY_QA_7` a `COMMUNITY_QA_11` y añadidos como spread en `COMMUNITY_POSTS`

4. **Índice**: `indice-sitio.json` → `comunidad_posts` y `total_posts_comunidad`: 1002

#### Archivos modificados:
| Archivo | Cambio |
|---|---|
| `src/data/comunidad-qa7.ts` | Nuevo: qa-501 a qa-600 |
| `src/data/comunidad-qa8.ts` | Nuevo: qa-601 a qa-700 |
| `src/data/comunidad-qa9.ts` | Nuevo: qa-701 a qa-800 |
| `src/data/comunidad-qa10.ts` | Nuevo: qa-801 a qa-900 |
| `src/data/comunidad-qa11.ts` | Nuevo: qa-901 a qa-1000 |
| `scripts/gen-batch.ps1` | Nuevo: script automatizado de generación de QA |
| `src/data/comunidad.ts` | +5 imports, +5 spreads (502 → 1002) |
| `src/data/indice-sitio.json` | comunidad_posts: 502 → 1002 |

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
- [x] RAG vectorial (1521 chunks, embeddings locales)
- [x] SFC compression (88 términos, 7 categorías)
- [x] RAG Answer con Gemini (SDK @google/genai)
- [x] Unified hybrid search (keyword + vector)
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
npm run build:rag      # Indexa chunks RAG y genera vector store
npm run rag:reindex    # Re-indexa contenido RAG (vía API)
npm run preview        # Preview del build
npm run test           # Tests (28 tests, 3 suites)
npm run lint           # TypeScript check
```

---

## Estado de Auditoría

**Puntaje final:** 9.4/10 — 🟢 Listo para Producción

| Criterio | Puntaje |
|---|---|
| Funcionalidad | 10/10 |
| Calidad del código | 9.5/10 |
| Testing | 8.5/10 |
| Documentación | 9.5/10 |
| Seguridad | 9/10 |
| Rendimiento | 9.5/10 |
| Accesibilidad | 8.5/10 |

**Mejoras post-auditoría:** C-04 (XSS sanitization), F3C (MemoryManager), F3B (GoalProcessor), A-07 (pre-build graph), M-08 (Swagger UI), Fase 4 RAG (RAG vectorial, SFC compression, Unified Search)

---

## Notas Técnicas

- Los datos están en `src/data/` organizados por dominio: `inicio.ts`, `campus.ts`, `academia.ts`, `biblioteca/`, `comunidad.ts`, `glosario/` (5 archivos modulares), `herramientas.ts`, `indice-sitio.json`
- El barrel `src/data/index.ts` re-exporta todo; los componentes importan desde `'../data'`
- El layout usa grid de 12 columnas: chat `col-span-4` + contenido `col-span-8` en desktop, `col-span-full` en mobile
- Paleta earth-tone definida en `src/index.css` vía `@theme`: forest, earth, water, wheat
- Fuentes: Cormorant Garamond (serif, headings) + Inter (sans, body) + Fira Code (mono)
- El grafo de conocimiento se construye en runtime desde los índices unificados (se eliminó la carga síncrona prebuild)
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
