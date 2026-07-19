# Agricultura Antigua — Informe Técnico

> Versión: 1.3.0  
> Fecha: 2026-07-19  
> Stack: React 19 + TypeScript 5 + Vite 6 + Tailwind CSS 4 + Express

---

## 1. Resumen Ejecutivo

Plataforma educativa de agricultura orgánica con asistente conversacional inteligente. Combina un **motor goal-oriented** (cliente) con un **pipeline RAG vectorial** (servidor) y un sistema de **auto-aprendizaje** que captura conocimiento desde la interacción con usuarios.

---

## 2. Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     Cliente (Vite, puerto 3000)              │
│  ┌──────────┐  ┌─────────────┐  ┌────────────────────────┐  │
│  │   Chat   │  │   Motor     │  │  Grafo de              │  │
│  │  Asist.  │─▶│  Goal-Orient│─▶│  Conocimiento          │  │
│  │          │  │             │  │  (fuzzy search)         │  │
│  └──────────┘  └──────┬──────┘  └────────────────────────┘  │
│                       │                                      │
│              ┌────────▼──────┐                               │
│              │  Auto-Learn   │──▶ localStorage               │
│              │  (feedback)   │──▶ POST /api/rag/learn        │
│              └───────────────┘                               │
└──────────────────────────┬──────────────────────────────────┘
                           │ proxy (vite.config.ts)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Servidor (Express, puerto 3001)            │
│  ┌──────────┐  ┌────────────┐  ┌────────────────────────┐  │
│  │ REST API │  │  Pipeline  │  │  Vector Store           │  │
│  │ 17 endpoints│  RAG      │  │  (ChromaDB-like, JSON)  │  │
│  │          │  │  Gemini    │  │  all-MiniLM-L6-v2       │  │
│  └──────────┘  └────────────┘  └────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Auto-Learn: POST /api/rag/learn → auto-learned.json │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Componentes Principales

### 3.1 Frontend (Cliente)

| Componente | Archivo | Propósito |
|---|---|---|
| `BrainProvider` | `BrainContext.tsx` | Estado central: mensajes, capas, workspace, feedback |
| `GoalProcessor` | `core/engine/goalProcessor.ts` | Pipeline goal-oriented (Cache → Intent → Plan → Response) |
| `KnowledgeGraph` | `core/knowledge/graph.ts` | Grafo de ~1500+ nodos con fuzzy matching |
| `UnifiedIndex` | `core/search/unifiedIndex.ts` | Índice normalizado de todas las fuentes de datos |
| `LearnedQA Service` | `services/learnedQA.service.ts` | Auto-aprendizaje en localStorage |
| `InterfaceOrchestrator` | `components/InterfaceOrchestrator.tsx` | Orquestador de vista primaria + capas |
| `ConversationPanel` | `components/ConversationPanel.tsx` | Chat persistente con sugerencias y feedback |

### 3.2 Backend (Servidor)

| Componente | Archivo | Propósito |
|---|---|---|
| Express Server | `server/index.ts` | API REST + Swagger + rate limiting |
| RAG Pipeline | `server/rag/` | Chunking → Embeddings → Vector store → Búsqueda |
| Answer Generator | `server/rag/answer.ts` | Gemini 2.0 Flash + SFC compression |
| Auto-Learn API | `server/routes/rag.ts` | `POST /api/rag/learn` — guarda + reindexa |

### 3.3 Datos

| Fuente | Cantidad | Formato |
|---|---|---|
| Cursos base | 10 | `src/data/campus.ts` |
| Cursos avanzados | 32 | `src/data/campus.ts` |
| Documentos biblioteca | 9 | `src/data/biblioteca/` |
| Recetas | 3 | `src/data/herramientas.ts` |
| Glosario | ~1512 términos | `src/data/glosario/` (6 archivos) |
| Q&A Comunidad | 500 (1001-1500) | `src/data/comunidad-qa*.ts` (12 archivos) |
| Posts comunidad | 2 | `src/data/comunidad.ts` |
| Vectores RAG | ~3863 | `rag_data/vectors.json` (no versionado) |
| Auto-aprendido | variable | `rag_data/auto-learned.json` / `localStorage` |

---

## 4. Sistema de Auto-Aprendizaje

### Flujo

```
Usuario califica "buena" una respuesta
  │
  ├─▶ Cliente: addLearnedQA() → localStorage
  │     └─▶ invalidateIndex() + invalidateGraph()
  │           └─▶ Próxima búsqueda encuentra el nuevo QA
  │
  └─▶ POST /api/rag/learn (fire-and-forget)
        └─▶ Servidor: guarda en auto-learned.json
              └─▶ Reindex explícito via POST /api/rag/reindex
```

**Nota:** `POST /api/rag/learn` ya NO ejecuta `runIndexer()` automáticamente para evitar bloqueo del servidor. El reindex debe hacerse explícitamente.

### Archivos involucrados

- **Cliente**: `learnedQA.service.ts`, `unifiedIndex.ts`, `graph.ts`, `BrainContext.tsx`
- **Servidor**: `routes/rag.ts`, `chunker.ts`, `types.ts`

---

## 5. Pipeline RAG

```
Contenido original (TS)
  │
  ▼
Chunker (chunker.ts) → 3863 chunks
  │
  ▼
Embeddings (all-MiniLM-L6-v2, 384 dims)
  │
  ▼
Vector Store (chroma.ts) → rag_data/vectors.json
  │
  ▼
Búsqueda coseno (threshold ≥ 0.5)
  │
  ▼
SFC Compression (sfc.ts) → contexto comprimido
  │
  ▼
Gemini 2.0 Flash → respuesta narrativa
  │
  ▼
Fallback local si Gemini no disponible
```

---

## 6. Motor Goal-Oriented (Cliente)

```
Query del usuario
  │
  ▼
Cache check
  │
  ▼
IntentAnalyzer → tipo de intención (learn/apply/investigate/compare/calculate/explore)
  │
  ▼
TaskPlanner → plan de tareas
  │
  ▼
ResponseComposer → búsqueda en grafo de conocimiento + respuesta
  │
  ▼
WorkspaceManager → paneles de trabajo
```

---

## 7. API Endpoints

| Método | Ruta | Propósito | Rate Limit |
|---|---|---|---|
| GET | `/api/status` | Estado del servidor | — |
| GET | `/api/courses` | Listar cursos | — |
| GET | `/api/documents` | Listar documentos | — |
| GET | `/api/recipes` | Listar recetas | — |
| GET | `/api/campus` | Cursos campus | — |
| GET | `/api/glossary` | Glosario | — |
| GET | `/api/search` | Búsqueda keyword | 20/min |
| GET | `/api/search/unified` | Búsqueda híbrida | 20/min |
| GET | `/api/sitemap` | Mapa del sitio | — |
| GET | `/api/agrovoc` | Vocabulario Agrovoc | — |
| GET | `/api/ai-manifest` | Manifiesto IA | — |
| GET | `/api/recommend` | Recomendaciones | — |
| GET | `/api/rag/search` | Búsqueda vectorial | — |
| GET | `/api/rag/status` | Estado del RAG | — |
| POST | `/api/rag/reindex` | Reindexar RAG | — |
| POST | `/api/rag/learn` | Guardar QA (sin reindex automático) | — |
| GET | `/api/rag/answer` | Respuesta Gemini | 5/min |

Documentación interactiva: `/api/docs` (Swagger UI)

---

## 8. Comandos

```bash
npm run dev              # Frontend (Vite, puerto 3000)
npm run api              # Backend (Express, puerto 3001)
npm run api:dev          # Backend con watch
npm run build            # Build producción
npm run rag:reindex      # Reindexar RAG
npm run lint             # TypeScript check
npm run test             # Tests (28 tests, 3 suites)
```

---

## 9. Estructura de Archivos Clave

```
src/
├── services/
│   └── learnedQA.service.ts      # Auto-aprendizaje
├── core/
│   ├── engine/
│   │   ├── goalProcessor.ts      # Motor goal-oriented
│   │   ├── responseComposer.ts   # Compositor de respuestas + sugerencias
│   │   └── workspaceManager.ts   # Gestión de paneles
│   ├── knowledge/
│   │   ├── graph.ts              # Grafo + búsqueda fuzzy
│   │   └── types.ts              # KnowledgeNode, KnowledgeGraph
│   └── search/
│       └── unifiedIndex.ts       # Índice unificado
├── contexts/
│   └── BrainContext.tsx           # Estado central
├── components/
│   ├── ConversationPanel.tsx      # Chat + feedback + reciclaje
│   ├── BibliotecaSection.tsx      # Documentos + contenido relacionado
│   ├── RecursosSection.tsx        # Recetas + glosario
│   ├── ResourceLayer.tsx          # Capas de recursos
│   └── workspace/
│       └── PanelContentView.tsx   # Contenido de paneles
server/
├── routes/
│   └── rag.ts                    # API RAG + auto-learn
└── rag/
    ├── chunker.ts                # Chunking + auto-learned
    ├── chroma.ts                 # Vector store
    ├── answer.ts                 # Gemini + SFC
    └── types.ts                  # RagChunk, sourceType
```

---

## 10. Seguridad

- **XSS**: `rehype-sanitize` en renderizado markdown del chat
- **Headers HTTP**: Helmet (CSP, HSTS, X-Frame-Options)
- **Rate Limiting**: 100 req/15min global, 20/min search, 5/min RAG answer
- **Validación**: Zod en todas las rutas API
- **Auth**: Password gate para AI-Ready (`aa-admin`)
- **CORS**: Habilitado para desarrollo local

---

## 11. Performance

- **Chunks RAG**: 3863 vectores embedidos localmente (all-MiniLM-L6-v2)
- **Búsqueda fuzzy**: ~1500 nodos evaluados en < 50ms
- **Graph rebuild**: < 100ms con ~1500 nodos
- **Caché**: Response cache en goalProcessor, unified index singleton
- **Lazy loading**: 8/9 secciones con `React.lazy()`

---

## 12. Estado Actual

| Aspecto | Estado |
|---|---|
| Build | ✅ Sin errores |
| Tests | 28 tests, 3 suites |
| RAG Vectors | ~3863 |
| Glosario | ~1512 términos |
| Q&A Comunidad | 500 entradas |
| Auto-aprendizaje | ✅ Implementado |
| Duplicación de paneles | ✅ Corregido (v1.3.0) |
| Layer con recurso incorrecto | ✅ Corregido (v1.3.0) |
| Server ESM compatibilidad | ✅ Corregido (v1.3.0) |
| Documentación | Swagger UI + README + Informe Técnico |
| Puntaje auditoría | 9.4/10 |
