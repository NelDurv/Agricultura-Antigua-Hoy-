# Patrones — TAZ

> Scores de confianza: 0.0-1.0. Golden ≥ 0.9, Alta ≥ 0.7, Media ≥ 0.4, Baja < 0.4.

---

## Frontend

### P-001: Arquitectura de Capas vs Paneles
| Campo | Detalle |
|---|---|
| **Confianza** | 0.95 (Golden) |
| **Contexto** | Aplicaciones con UI que muestra recursos desde un asistente conversacional |
| **Proyectos** | agricultura-antigua |
| **Descripción** | Layer = temporal, Panel = persistente. Si un recurso ya tiene workspace panel (`open-panel` task en el plan), no crear layer. Coordinar ambos sistemas para evitar duplicación. |
| **Implementación** | `buildLayers()` filtra resourceIds que tienen `open-panel` tasks (`responseComposer.ts:123-131`) |
| **Alternativas fallidas** | Eliminar layers por completo (se pierde UX de vista rápida); eliminar panels (se pierde persistencia) |

### P-002: Vista de detalle reusable (Layer + Panel)
| Campo | Detalle |
|---|---|
| **Confianza** | 0.60 (Media) |
| **Contexto** | Componentes `*View` y `*PanelView` son virtualmente idénticos |
| **Proyectos** | agricultura-antigua |
| **Descripción** | `ResourceLayer.tsx` y `PanelContentView.tsx` tienen CourseView/CoursePanelView, DocumentView/DocumentPanelView, etc. Cambiar uno implica cambiar el otro. |
| **Propuesta** | Extraer a componentes compartidos en `src/components/shared/` |
| **Riesgo** | Refactor grande; validar que no rompa la separación layer vs panel |

### P-003: Búsqueda semántica con fallback
| Campo | Detalle |
|---|---|
| **Confianza** | 1.0 (Golden) |
| **Contexto** | Cualquier sistema con grafo de conocimiento |
| **Proyectos** | agricultura-antigua |
| **Descripción** | `getNode(id)` → lookup exacto por ID. `searchNodes(query)` → búsqueda textual + semántica. No son intercambiables. Siempre preferir `getNode()` cuando se tiene un ID exacto. |
| **Implementación** | `const node = getNode(resourceId) ?? searchNodes(resourceId)[0]` |
| **Alternativas fallidas** | Usar `searchNodes()` para lookup por ID (devuelve el mejor match textual, no el ID exacto) |

## Backend

### P-004: Endpoints pesados fuera del request handler
| Campo | Detalle |
|---|---|
| **Confianza** | 0.90 (Golden) |
| **Contexto** | APIs que realizan operaciones computacionalmente intensivas |
| **Proyectos** | agricultura-antigua |
| **Descripción** | Operaciones como `runIndexer()` (~3863 embeddings) no deben ejecutarse dentro de un POST handler. Responder inmediatamente y delegar a procesos separados o endpoints explícitos. |
| **Implementación** | POST /api/rag/learn responde sin reindex. POST /api/rag/reindex para reindex explícito. |
| **Alternativas fallidas** | Reindex síncrono (timeout de minutos); reindex asíncrono con worker (complejidad adicional innecesaria) |

### P-005: ESM compatibility
| Campo | Detalle |
|---|---|
| **Confianza** | 1.0 (Golden) |
| **Contexto** | Proyectos Node con `"type": "module"` en package.json |
| **Proyectos** | agricultura-antigua |
| **Descripción** | En ESM no existen `__dirname`, `require`, `module.exports`. Usar `fileURLToPath(import.meta.url)` para rutas absolutas. |
| **Implementación** | `const __dirname = path.dirname(fileURLToPath(import.meta.url))` |
| **Alternativas fallidas** | Cambiar a CommonJS (pierde compatibilidad con ecosistema moderno); `import.meta.dirname` (solo Node 21+) |
