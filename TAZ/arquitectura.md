# Arquitectura — TAZ

## Modelo de Agente Inteligente (Brain)

```
INPUT                          PROCESSING                           OUTPUT
─────                          ─────────                           ──────
Query texto  ─→  analyzeIntent() ─→ createPlan() ─→ composeResponse() ─→ content (texto)
                                                                       ─→ layers (paneles laterales)
                                                                       ─→ suggestions (botones)
                                                                       ─→ viewAction (navegación)
                                                    ─→ createWorkspace() ─→ panels + widgets
```

Este modelo es portable a cualquier proyecto que necesite un asistente conversacional con capacidad de mostrar recursos estructurados.

## Componentes del modelo

1. **Intent Analyzer** — Clasifica la intención del usuario (learn, apply, investigate, compare, calculate, explore)
2. **Task Planner** — Genera un plan con tareas concretas basado en la intención
3. **Response Composer** — Construye la respuesta textual + capas visuales
4. **Workspace Manager** — Gestiona paneles persistentes con estado (focused/open/minimized)
5. **Knowledge Graph** — Grafo de nodos de conocimiento con búsqueda híbrida (semántica + keywords)

## Estructura de datos del Knowledge Graph

```
KnowledgeNode
  ├── id: string (único)
  ├── type: glossary | research | statistic | article | news | course | recipe
  ├── title: string
  ├── description: string
  ├── fullText: string
  ├── taxons: string[] (categorías)
  ├── keywords: string[]
  └── embeddings: number[] (vector 384-d de Xenova)
```

El grafo se construye con `build-graph.ts` y se persiste en memoria. Los embeddings se generan con modelos locales de Xenova Transformers.

## Pipeline de indexación RAG

```
Fuentes (.ts, .json, .md)
  → chunker (divide en fragmentos de ~200 tokens con solapamiento)
  → embeddings (Xenova all-MiniLM-L6-v2 → 384 dimensiones)
  → chromadb (almacena y permite búsqueda por similitud coseno)
```

## Stack técnico

- React 19 + Vite + Tailwind v4
- Express 5 (API server)
- ChromaDB (vector database)
- Xenova Transformers (embeddings locales)
- Gemini API (generación de respuestas, opcional)
