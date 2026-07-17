# INFORME TÉCNICO — Agricultura Antigua

**Versión:** 1.3.0
**Fecha:** 17 de julio de 2026
**Paradigma:** Sistema Operativo Conversacional con Workspace gobernado por Motor de Decisiones
**Auditoría arquitectónica:** 9.2/10 → 9.4/10 → 9.5/10 (post-Fase 4 RAG + Fixes Asistente)

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Arquitectura de la Aplicación](#3-arquitectura-de-la-aplicación)
4. [Estructura del Proyecto](#4-estructura-del-proyecto)
5. [Sistema de Tipos](#5-sistema-de-tipos)
6. [Catálogo de Datos](#6-catálogo-de-datos)
7. [Motor de Decisiones (Core Engine)](#7-motor-de-decisiones-core-engine)
8. [Sistema de Búsqueda y Conocimiento](#8-sistema-de-búsqueda-y-conocimiento)
9. [Capa de Presentación](#9-capa-de-presentación)
10. [Sistema de Widgets](#10-sistema-de-widgets)
11. [Sistema de Clarificación Multi-Turno](#11-sistema-de-clarificación-multi-turno)
12. [Tool Router](#12-tool-router)
13. [Engine Logger](#13-engine-logger)
14. [Capa IA-Ready y SEO](#14-capa-ia-ready-y-seo)
15. [API REST (Servidor Express)](#15-api-rest-servidor-express)
16. [Sistema de Layout y Temas](#16-sistema-de-layout-y-temas)
17. [Procesos Internos del Engine](#17-procesos-internos-del-engine)
18. [Pipeline de Decisión Completo](#18-pipeline-de-decisión-completo)
19. [Persistencia y Sesión](#19-persistencia-y-sesión)
20. [Feedback Loop](#20-feedback-loop)
21. [Event Bus](#21-event-bus)
22. [Message Queue y AbortController](#22-message-queue-y-abortcontroller)
23. [Rate Limiting y Validación](#23-rate-limiting-y-validación)
24. [Error Boundaries](#24-error-boundaries)
25. [Caché de Respuestas](#25-caché-de-respuestas)
26. [Modelo de Dominio](#26-modelo-de-dominio)
27. [Sistema de Capacidades (Capabilities)](#27-sistema-de-capacidades-capabilities)
28. [GoalProcessor — Motor Orientado a Objetivos](#28-goalprocessor--motor-orientado-a-objetivos)
29. [Memory Manager — Memoria Multicapa](#29-memory-manager--memoria-multicapa)
30. [Auditoría y Mejoras](#30-auditoría-y-mejoras)
31. [Pruebas y Calidad](#31-pruebas-y-calidad)
32. [Historial de Implementación por Sesiones](#32-historial-de-implementación-por-sesiones)
33. [Licencias y Atribuciones](#33-licencias-y-atribuciones)
34. [Pipeline RAG Vectorial](#34-pipeline-rag-vectorial)
35. [SFC — Semantic Frame Compression](#35-sfc--semantic-frame-compression)
36. [Unified Hybrid Search](#36-unified-hybrid-search)

---

## 1. Resumen Ejecutivo

**Agricultura Antigua** es un campus digital y base de conocimientos de agricultura sostenible, diseñado para pequeños productores y capacitadores. Comenzó como un sitio web estático y evolucionó hacia un **Sistema Operativo Conversacional** con las siguientes capacidades:

- **Motor de Decisiones** con 6 intenciones (learn/apply/investigate/compare/calculate/explore), intenciones compuestas, contexto conversacional y clarificación multi-turno.
- **Workspace** dinámico con paneles y widgets contextuales.
- **GoalProcessor**: pipeline goal-oriented que reemplazó el flujo `sendMessage` por `processGoal`.
- **Capability System**: 7 capacidades registradas (search-knowledge, get-entity, find-related, calculate-cn-ratio, get-glossary-term, open-resource) ejecutadas antes del fallback a knowledge graph.
- **Modelo de Dominio**: entidades puras (Course, Document, Recipe, Project, Lab, Evaluation, Resource) sin dependencia de React.
- **Memory Manager**: memoria multicapa (temporal/sesión/proyecto) con ContextPolicy, TTL, persistencia automática y pruning.
- **Event Bus**: singleton con 14 eventos tipados integrado en todos los ciclos clave del engine.
- **Feedback Loop**: persistencia de votos thumbs-up/down con estadísticas por intent.
- **Persistencia**: localStorage con 7 claves, debounce de 500ms.
- **Robustez**: MessageQueue FIFO con AbortController, rate limiting, validación Zod, Error Boundaries, caché de respuestas, evicción LRU.
- **RAG Vectorial**: pipeline completo con chunking (1521 chunks), embeddings all-MiniLM-L6-v2 (384 dims), vector store plano, búsqueda por similitud coseno con filtros.
- **RAG Answer**: generación de respuestas narrativas vía Gemini 2.0 Flash desde los chunks recuperados, con compresión SFC del contexto.
- **SFC (Semantic Frame Compression)**: diccionario simbólico de 88 términos agrícolas en 7 categorías que reduce 15-34% el tamaño de texto técnico.
- **Unified Hybrid Search**: endpoint que combina resultados de búsqueda por keyword + vectorial con score normalizado.
- **SEO**: JSON-LD (schema.org), AGROVOC (25 conceptos FAO), llms.txt, robots.txt.

La aplicación está construida con **React 19**, **TypeScript 5.8**, **Vite 6**, **Tailwind CSS 4**, y **Express 5** para la API REST. 28 tests unitarios pasan (3 suites).

---

## 2. Stack Tecnológico

### Front-End

(sin cambios respecto a v1.1.0)

### Back-End (API REST)

| Tecnología | Versión | Propósito |
|---|---|---|
| Express | 5.2.1 | Servidor HTTP REST |
| cors | 2.8.6 | Middleware CORS |
| express-rate-limit | 8.5.2 | Rate limiting por IP |
| zod | 4.4.3 | Validación de schemas |
| tsx | 4.21.0 | Ejecución de TypeScript en Node |
| **@xenova/transformers** | **2.17.2** | **Embeddings all-MiniLM-L6-v2 (local, sin API externa)** |
| **chromadb** | **3.5.0** | **Vector store (índice plano JSON)** |
| **@google/genai** | **2.4.0** | **SDK Gemini para RAG Answer** |

### Testing / Dev / Tooling

(sin cambios respecto a v1.1.0 — se añade `AGENTS.md` como mecanismo de reglas OpenCode)

---

## 3. Arquitectura de la Aplicación

### 3.1 Diagrama de Capas (actualizado)

```
┌──────────────────────────────────────────────────────────────┐
│                     UI Layer (components/)                     │
├──────────────────────────────────────────────────────────────┤
│                 Context/State Layer (contexts/)                │
├──────────────────────────────────────────────────────────────┤
│                    Core Engine Layer (core/engine/)            │
├──────────────────────────────────────────────────────────────┤
│               Infrastructure Layers (core/)                   │
├──────────────────────────────────────────────────────────────┤
│           Knowledge + Search Layer (core/knowledge|search)    │
├──────────────────────────────────────────────────────────────┤
│                SEO Layer (core/seo/)                           │
├──────────────────────────────────────────────────────────────┤
│                   Data Layer (src/data/)                       │
├──────────────────────────────────────────────────────────────┤
│               API Server Layer (server/)                       │
│  Express Router → 11 route files → 19+ endpoints              │
│  rate-limit + Zod + Swagger UI                                │
│  RAG: chunker → embeddings → vector store → search            │
│  RAG Answer: search → SFC compress → Gemini → response        │
│  Unified Search: keyword + vector merge                       │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Flujo RAG Answer (nuevo)

```
GET /api/rag/answer?q=...
  → searchChunks(q, topK=5) → chunks con score
  → compress(text) vía SFC → contexto comprimido
  → prompt: sistema + contexto SFC + leyenda + query
  → GoogleGenAI.generateContent(model="gemini-2.0-flash")
  → { answer, sources: [{ title, source, sourceType, score }], chunksUsed }
```

### 3.3 Flujo Unified Search (nuevo)

```
GET /api/search/unified?q=...&limit=10
  → run keyword search (courses, biblioteca, recetas, campus, glosario)
  → run vector search (RAG: searchChunks)
  → normalize scores por fuente (max-scaling)
  → merge + sort desc
  → { query, total, limit, items: [{ searchType, title, score, sourceType }] }
```

---

## 4. Estructura del Proyecto (actualizada)

```
server/             # API REST (Express)
├── index.ts        # App Express + rate-limit + CORS + Zod
├── routes/         # 11 route files → 19+ endpoints
│   ├── rag.ts      #   GET /rag/search, /rag/status, /rag/reindex, /rag/answer
│   └── search.ts   #   GET /search, /search/unified (nuevo)
└── rag/            # Pipeline RAG vectorial (NUEVO)
    ├── index.ts    #   Barrel exports
    ├── types.ts    #   RagChunk, RagSearchResult, RagQuery
    ├── chunker.ts  #   Chunking multi-fuente (1521 chunks)
    ├── embeddings.ts # all-MiniLM-L6-v2 (384 dims, local)
    ├── chroma.ts   #   Vector store + coseno search + filtros
    ├── indexer.ts  #   CLI: npm run build:rag
    ├── sfc.ts      #   SFC compression (simbolos-sfc.json)
    └── answer.ts   #   Gemini answer + SFC context

simbolos-sfc.json   # Diccionario SFC (88 términos, 7 categorías)
```

---

## 5–33. (sin cambios respecto a v1.2.0)

Ver secciones 5–33 del informe previo. El contenido de las secciones 5 a 33 se mantiene idéntico a la versión 1.2.0, con las siguientes excepciones:

- **Sección 4 (Estructura)**: se añade `glosario-cientifico.ts` (6º archivo de glosario, 15 entradas científicas).
- **Sección 6 (Glosario)**: actualizado a 1512 términos en 6 archivos.
- **Sección 15 (API REST)**: se actualiza a continuación.
- **Sección 32 (Historial)**: se añade la Sesión 16 al final.

---

## 15. API REST (Servidor Express) — actualizado

### 15.1 Resumen de Endpoints (19+ documentados)

| Ruta | Método | Propósito | Cache |
|---|---|---|---|
| `/api/status` | GET | Estado del servidor | — |
| `/api/courses` | GET | Lista de cursos | — |
| `/api/courses/:id` | GET | Curso por ID | — |
| `/api/documents` | GET | Lista de documentos | — |
| `/api/documents/:id` | GET | Documento por ID | — |
| `/api/recipes` | GET | Lista de recetas | — |
| `/api/recipes/:id` | GET | Receta por ID | — |
| `/api/campus` | GET | Cursos Campus Utopía | — |
| `/api/campus/:id` | GET | Curso Utopía por ID | — |
| `/api/glossary` | GET | Glosario completo | — |
| `/api/search` | GET | Búsqueda por keyword | 5 min TTL |
| **`/api/search/unified`** | **GET** | **Búsqueda híbrida (keyword + vector)** | **—** |
| `/api/sitemap` | GET | Sitemap navegable | — |
| `/api/agrovoc` | GET | Conceptos AGROVOC | — |
| `/api/agrovoc/:id` | GET | Concepto AGROVOC por ID | — |
| `/api/ai-manifest` | GET | Manifiesto IA | — |
| `/api/recommend` | GET | Recomendación recíproca | — |
| `/api/rag/status` | GET | Estado del vector store | — |
| `/api/rag/search` | GET | Búsqueda vectorial RAG | — |
| `/api/rag/reindex` | POST | Re-indexar todo el contenido | — |
| **`/api/rag/answer`** | **GET** | **Respuesta narrativa con Gemini + SFC** | **—** |
| `/api/docs` | GET | Swagger UI interactivo | — |

### 15.2 Rate Limiting

- **Global:** 100 requests por 15 minutos por IP
- **Search:** 20 requests por minuto por IP (compartido entre `/search` y `/search/unified`)

### 15.3 Validación Zod

```typescript
const SearchSchema = z.object({
  q: z.string().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

const UnifiedSearchSchema = z.object({
  q: z.string().min(1).max(500),
  limit: z.coerce.number().int().min(1).max(30).optional().default(10),
});
```

---

## 32. Historial de Implementación por Sesiones (actualizado)

| Fase | Sesión | Archivos | Logro |
|---|---|---|---|---|
| **4-RAG** | 31 | `rag/*`, `simbolos-sfc.json`, `routes/rag.ts`, `routes/search.ts` | RAG vectorial (1521 chunks), SFC compression, RAG Answer (Gemini), Unified Search |
| **4-FIX** | 32 | `responseComposer.ts`, `graph.ts`, `RecursosSection.tsx`, `BrainContext.tsx`, `glosario-cientifico.ts` | Fix tarjeta vacía (glossary → node), bigram 55%, tokenización búsqueda, buildEdges optimizado, msgCounter síncrono |

---

## 34. Pipeline RAG Vectorial

### 34.1 Arquitectura

```
Contenido fuente (courses, courses32, biblioteca, glosario, recetas, mitos, pilares, hero)
  → chunker.ts → 1521 chunks (max 600 chars, split por oración)
  → embeddings.ts → all-MiniLM-L6-v2 (384 dimensiones, local, sin API)
  → chroma.ts → vector store plano (rag_data/vectors.json, 12.9 MB)
  → searchChunks(query, topK=10, typeFilter?, tagFilter?) → RagSearchResult[]
```

### 34.2 Componentes

| Archivo | Responsabilidad |
|---|---|
| `server/rag/chunker.ts` | Extrae texto de todas las fuentes, divide en chunks de ~600 chars, asigna metadata (source, sourceType, title, tags) |
| `server/rag/embeddings.ts` | Genera embeddings con `@xenova/transformers` (pipeline feature-extraction, pooling mean, normalize L2) |
| `server/rag/chroma.ts` | Almacena vectores en `rag_data/vectors.json`, busca por similitud coseno con filtros opcionales (typeFilter, tagFilter) |
| `server/rag/indexer.ts` | CLI de indexación (`npm run build:rag` o `npm run rag:reindex`) |
| `server/rag/types.ts` | Interfaces: `RagChunk`, `RagSearchResult`, `RagQuery` |

### 34.3 Algoritmo de Búsqueda

```typescript
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
```

- **Complejidad:** O(n × d) donde n = 1521 vectores, d = 384 dimensiones
- **Filtros:** aplicados pre-cálculo (type y tags)
- **Resultados:** ordenados por score descendente, top-K retornados con metadata completa

### 34.4 Endpoints

| Endpoint | Parámetros | Uso |
|---|---|---|
| `GET /api/rag/status` | — | Monitoreo: `{ vectors, ready }` |
| `GET /api/rag/search` | `q`, `topK`(1-50), `type`, `tags` | Búsqueda semántica |
| `POST /api/rag/reindex` | — | Re-indexa todo el contenido |
| `GET /api/rag/answer` | `q` | Respuesta narrativa con Gemini |

### 34.5 Rendimiento

| Métrica | Valor |
|---|---|
| Chunks indexados | 1521 |
| Dimensiones embedding | 384 |
| Tamaño vector store | 12.9 MB |
| Tiempo de indexación | ~8-10 segundos |
| Búsqueda (promedio) | < 100 ms |
| Reducción SFC en chunks técnicos | 15-34% |
| Chunks con compresión SFC | 343/1521 (22.6%) |

---

## 35. SFC — Semantic Frame Compression

### 35.1 Concepto

SFC es un sistema de compresión basado en diccionario que reemplaza términos agrícolas frecuentes con símbolos cortos. Está diseñado para reducir el tamaño del contexto enviado a modelos de lenguaje (LLM) sin pérdida de información crítica.

### 35.2 Diccionario (simbolos-sfc.json)

| Categoría | Ejemplos | Símbolos |
|---|---|---|
| cultivos | tomate → @tom, papa → @pap | @prefijo |
| variables | ph → %pH, temperatura → %T | %prefijo |
| unidades | celsius → °C, metros → m | sufijo estándar |
| relaciones | requiere → →, optimo → ≈ | flechas/matemáticos |
| suelos | arcilloso → #arc, arenoso → #are | #prefijo |
| prácticas | riego por goteo → ~goteo, compost → ~comp | ~prefijo |
| plagas/enf. | mildiu → !mid, oidio → !oid | !prefijo |

**Total:** 88 términos en 7 categorías.

### 35.3 Algoritmo de Compresión

```
1. Cargar simbolos-sfc.json → flat list { term, symbol }
2. Ordenar por longitud de término DESC (multi-word primero)
3. Construir un único regex combinado: (?:patrón1|patrón2|...)
4. Ejecutar exec() en single-pass (no re-escanear reemplazos)
5. Palabras alfa usan \b word boundaries (evita falsos en plurales)
6. Palabras multi-palabra o con caracteres especiales usan matching literal
```

### 35.4 Funciones Exportadas

| Función | Descripción |
|---|---|
| `compress(text)` | Comprime texto reemplazando términos del diccionario |
| `expand(text)` | Expande símbolos de vuelta a texto legible (best-effort) |
| `getLegend()` | Genera leyenda legible para incluir en prompts LLM |
| `getCompressionRatio(text)` | Calcula porcentaje de reducción |

### 35.5 Integración en RAG Answer

```typescript
// answer.ts — prompt con contexto comprimido
const prompt = `
Contexto comprimido (formato SFC):
${compressedContext}

Leyenda SFC:
${getLegend()}

Pregunta: ${query}
`;
```

### 35.6 Limitaciones

- **Cobertura limitada**: solo 22.6% de los chunks del corpus tienen términos comprimibles. La reducción global es de ~0.78%.
- **Expansión imperfecta**: símbolos compartidos entre términos (ej. `arenoso`/`arenosa` ambos → `#are`) pierden género/plural al expandir.
- **Vocabulario extensible**: el diccionario puede crearse con más términos para aumentar cobertura.

---

## 36. Unified Hybrid Search

### 36.1 Descripción

Endpoint único que combina los resultados de la búsqueda por keyword (índice de datos estáticos) con la búsqueda vectorial (RAG), ofreciendo una experiencia de búsqueda más completa.

### 36.2 Algoritmo

```
1. Ejecutar keyword search en paralelo con vector search
2. Keyword: score TF-like sobre courses, biblioteca, recetas, campus, glosario
3. Vector: searchChunks(query) → similitud coseno (0-1)
4. Normalizar scores de cada fuente dividiendo por su máximo
5. Unificar en un solo array { searchType, title, description, score, sourceType }
6. Ordenar por score descendente
7. Retornar top-K items
```

### 36.3 Endpoint

```
GET /api/search/unified?q=<query>&limit=<1-30>
```

### 36.4 Formato de Respuesta

```json
{
  "query": "pH tomate",
  "total": 12,
  "limit": 5,
  "items": [
    {
      "searchType": "keyword",
      "id": "curso-1",
      "title": "pH del Suelo",
      "description": "Medida de acidez...",
      "score": 0.95,
      "sourceType": "course"
    },
    {
      "searchType": "vector",
      "id": "course__ph-del-suelo__p0",
      "title": "pH del Suelo",
      "description": "pH del Suelo: Medida...",
      "score": 0.82,
      "sourceType": "course",
      "source": "ph-del-suelo"
    }
  ]
}
```

---

## Licencias y Atribuciones

(sin cambios respecto a v1.1.0)

---

*Documento generado el 17 de julio de 2026.*
*Próxima revisión: al completar Fase 5 (Monitoreo).*
