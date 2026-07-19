# Agricultura Antigua — Contexto del Proyecto

> Proyecto absorbido por TAZ el 2026-07-19

---

## Ficha

| Campo | Valor |
|---|---|
| **Nombre** | Agricultura Antigua |
| **Versión** | 1.2.0 |
| **Stack** | React 19 + TypeScript 5 + Vite 6 + Tailwind CSS 4 + Express 5 |
| **Motor IA** | Goal-oriented (cliente) + RAG vectorial (servidor) + Gemini API |
| **BD** | ChromaDB (vectores) + JSON (datos) + localStorage (auto-aprendizaje) |
| **Puertos** | Vite: 3000/3002 \| API: 3001 |
| **Proxy** | Vite proxy `/api` → `localhost:3001` |
| **Tests** | 28 tests, 3 suites (Vitest) |
| **Auditoría** | 9.4/10 |

---

## Arquitectura

```
CLIENTE (Vite :3000)
  Chat → BrainContext → goalProcessor.processGoal(query)
    → analyzeIntent() → createPlan() → composeResponse() + createWorkspace()
    → response { content, layers, suggestions, workspace }
    → feedback → localStorage + POST /api/rag/learn

SERVIDOR (Express :3001)
  REST API (17 endpoints) + Swagger UI (/api/docs)
  Pipeline RAG: chunker → embeddings → chroma → search → answer
  Auto-learn: POST /api/rag/learn
```

---

## Datos

| Fuente | Cantidad | Ubicación |
|---|---|---|
| Cursos base | 10 | `src/data/campus.ts` |
| Cursos avanzados | 32 | `src/data/campus.ts` (COURSES32) |
| Documentos biblioteca | 9 | `src/data/biblioteca/index.ts` |
| Recetas | 3 | `src/data/herramientas.ts` |
| Glosario | ~1512 términos | `src/data/glosario/*.ts` (6 archivos) |
| Q&A Comunidad | 500 | `src/data/comunidad-qa*.ts` (11 archivos) |
| Vectores RAG | ~3863 chunks | `rag_data/vectors.json` |
| Posts comunidad | 2 | `src/data/comunidad.ts` |

---

## Pipeline del Motor

```
Query → Cache → IntentAnalyzer → TaskPlanner → Plan.tasks[]
  → composeResponse()
    → buildContentFromPlan() → texto markdown
    → buildSuggestionsFromPlan() → botones
    → buildLayers() → side layers
  → createWorkspace() → panels + widgets
```

### Reglas aprendidas
1. Si un `open-panel` task ya tiene un resourceId, `buildLayers()` NO debe crear layer duplicada
2. `getNode(id)` para lookup exacto; `searchNodes(query)` para búsqueda textual
3. Las capas se renderizan en `Layout.tsx` (desktop) y como overlay mobile
4. Los workspace panels se renderizan en `InterfaceOrchestrator.tsx`

---

## Pipeline RAG

```
Fuentes → chunker.ts → embeddings.ts (all-MiniLM-L6-v2, 384 dims)
  → chroma.ts → búsqueda coseno (threshold ≥ 0.5)
  → sfc.ts (compresión 88 términos) → answer.ts (Gemini + fallback)
```

---

## API REST

| Método | Ruta | Propósito |
|---|---|---|
| GET | `/api/rag/search` | Búsqueda semántica |
| GET | `/api/rag/status` | Estado ChromaDB |
| POST | `/api/rag/reindex` | Reindexar RAG |
| POST | `/api/rag/learn` | Guardar Q&A (sin reindex) |
| GET | `/api/rag/answer` | Respuesta Gemini (5/min) |
| GET | `/api/search` | Búsqueda keyword (20/min) |
| GET | `/api/search/unified` | Búsqueda híbrida (20/min) |
| +10 endpoints más (courses, documents, recipes, campus, glossary, sitemap, agrovoc, ai-manifest, recommend, status) |

Documentación: `http://localhost:3001/api/docs/` (Swagger UI)

---

## Comandos

```bash
npm run dev         # Frontend (Vite, puerto 3000)
npm run api         # Backend (Express, puerto 3001)
npm run api:dev     # Backend con watch
npm run build       # Build producción
npm run rag:reindex # Reindexar RAG
npm run lint        # TypeScript check
npm run test        # Tests (28 tests, 3 suites)
```

---

## Archivos Clave

```
src/core/engine/goalProcessor.ts      # Motor goal-oriented
src/core/engine/responseComposer.ts   # Compositor de respuestas + capas
src/core/engine/workspaceManager.ts   # Gestión de paneles
src/core/engine/taskPlanner.ts        # Planificador de tareas
src/core/knowledge/graph.ts           # Grafo + búsqueda fuzzy
src/contexts/BrainContext.tsx          # Estado central del asistente
src/components/InterfaceOrchestrator.tsx  # Orquestador vista + capas
src/components/ResourceLayer.tsx          # Capas de recursos
src/components/workspace/PanelContentView.tsx  # Contenido de paneles
server/routes/rag.ts                  # API RAG + auto-learn
server/rag/chunker.ts                 # Chunking
server/rag/chroma.ts                  # Vector store
server/rag/sfc.ts                     # Compresión semántica
server/rag/answer.ts                  # Gemini + fallback
```
