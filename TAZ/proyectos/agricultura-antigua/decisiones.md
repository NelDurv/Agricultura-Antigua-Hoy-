# Decisiones — Agricultura Antigua

> Registro de decisiones arquitectónicas clave con contexto, opciones y resultado.

---

## D-001: Layer vs Workspace Panel

| Campo | Detalle |
|---|---|
| **Contexto** | El asistente mostraba dos ventanas con el mismo contenido |
| **Problema** | `buildLayers()` y `createWorkspace()` apuntaban al mismo resourceId |
| **Opciones** | (a) Eliminar layers, solo workspace (b) Eliminar workspace, solo layers (c) Coordinar ambos |
| **Decisión** | (c) Coordinar: `buildLayers()` filtra resourceIds que ya tienen `open-panel` en el plan |
| **Resultado** | Una ventana por recurso. Si hay panel, no hay layer. |
| **Confianza** | 0.95 — Probado y funciona |

---

## D-002: Búsqueda por ID exacto vs textual

| Campo | Detalle |
|---|---|
| **Contexto** | Al hacer clic en sugerencia "Abrir X", se abría un recurso diferente |
| **Problema** | `openResourceLayer()` usaba `searchNodes(resourceId)` que es búsqueda textual |
| **Opciones** | (a) Solo `getNode()` (b) `getNode()` con fallback a `searchNodes()` |
| **Decisión** | (b) `getNode(id) ?? searchNodes(id)[0]` |
| **Resultado** | Lookup exacto primero, búsqueda como respaldo |
| **Confianza** | 1.0 — Fix definitivo |

---

## D-003: Reindexación asíncrona en POST /learn

| Campo | Detalle |
|---|---|
| **Contexto** | POST /api/rag/learn tardaba minutos en responder |
| **Problema** | Llamaba a `runIndexer()` que genera ~3863 embeddings (~1s c/u) |
| **Opciones** | (a) Reindex síncrono (b) Reindex asíncrono (c) No reindexar |
| **Decisión** | (c) Responder sin reindex. Reindex explícito via POST /api/rag/reindex |
| **Resultado** | Endpoint responde en < 100ms |
| **Confianza** | 0.90 — Sacrifica actualización automática por rendimiento |

---

## D-004: ESM sobre CommonJS

| Campo | Detalle |
|---|---|
| **Contexto** | Server crasheaba con `__dirname is not defined` |
| **Problema** | `"type": "module"` en package.json — `__dirname` no existe en ESM |
| **Opciones** | (a) Cambiar a CommonJS (b) Usar `fileURLToPath` (c) Usar `import.meta.dirname` (Node 21+) |
| **Decisión** | (b) `fileURLToPath(import.meta.url)` |
| **Resultado** | Compatible con Node 18+ |
| **Confianza** | 1.0 — Estándar de la industria |

---

## D-005: Glosario modular vs archivo único

| Campo | Detalle |
|---|---|
| **Contexto** | Glosario creció de ~8 a ~1512 términos |
| **Problema** | Archivo único `herramientas.ts` era inmanejable |
| **Opciones** | (a) Un solo archivo gigante (b) Varios archivos por tema (c) Base de datos |
| **Decisión** | (b) 6 archivos modulares en `src/data/glosario/` |
| **Resultado** | Mantenible, cada archivo < 800 líneas |
| **Confianza** | 1.0 — Clara mejora de organización |

---

## D-006: Auto-aprendizaje vía localStorage + servidor

| Campo | Detalle |
|---|---|
| **Contexto** | Necesidad de que el asistente aprenda de feedback de usuarios |
| **Problema** | Sin feedback, el asistente no mejoraba con el uso |
| **Opciones** | (a) Solo servidor (b) Solo cliente (c) Cliente + servidor |
| **Decisión** | (c) Dual: localStorage inmediato + POST /api/rag/learn fire-and-forget |
| **Resultado** | Respuesta inmediata al usuario + persistencia servidor |
| **Confianza** | 0.85 — El dual puede causar inconsistencias temporales |
