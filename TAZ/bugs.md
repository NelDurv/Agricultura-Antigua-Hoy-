# Bugs — TAZ

> Scores de confianza: 1.0 = Confirmado y fix verificado. 0.8+ = Fix aplicado, verificación parcial.

---

## Registro histórico

| # | Bug | Confianza | Síntoma | Causa raíz | Fix | Archivos |
|---|---|---|---|---|---|---|
| 1 | Panel duplicado | **1.0** | TERRA muestra dos ventanas con el mismo contenido | `buildLayers()` y `createWorkspace()` apuntan al mismo resourceId | Filtrar en `buildLayers()` los resourceId que ya tienen open-panel en el plan | `responseComposer.ts` |
| 2 | Layer incorrecta | **1.0** | Click en sugerencia A muestra recurso B | `searchNodes(resourceId)` hace búsqueda textual, no lookup por ID | Usar `getNode(resourceId)` primero | `BrainContext.tsx` |
| 3 | `__dirname` undefined | **1.0** | Server RAG crashea al arrancar | `"type": "module"` en package.json | Usar `fileURLToPath(import.meta.url)` | `server/rag/chunker.ts`, `server/routes/rag.ts` |
| 4 | `runIndexer()` bloquea | **0.9** | POST/learn tarda minutos en responder | Embeddings sincrónicos dentro del handler | Responder sin reindex, reindex explícito aparte | `server/routes/rag.ts` |
| 5 | Unsplash Firefox | **0.8** | Imagen no carga en carrusel hero | OpaqueResponseBlocking de Firefox | Reemplazar URL problemática | `HomeSection.tsx` |
| 6 | "Explorar más recursos" | **1.0** | Aparecía en tarjetas dentro de capas | Feature no solicitada | Remover `<button>` | `ResourceLayer.tsx`, `PanelContentView.tsx` |
| 7 | Tarjeta vacía asistente | **1.0** | Componente 'resource' sin query | `buildLayers` asignaba component incorrecto para glosario | Cambiar a `component: 'node'` | `responseComposer.ts` |
| 8 | Falso positivo fuzzy | **1.0** | `tipos` coincidía con `poros` (0.5) | Bigram threshold muy bajo (0.4) | Subir threshold a 0.55 | `graph.ts` |
| 9 | Búsqueda glosario falla | **1.0** | Términos no aparecían en búsqueda | `String.includes()` sobre toda la pregunta | Tokenizar y puntuar (10pts término, 3pts definición) | `RecursosSection.tsx` |
| 10 | Respuesta irrelevante | **0.9** | `extractAnswer()` elegía oraciones incorrectas | Scoring por longitud, no por relevancia | Scoring por tokens + bonus numérico | `responseComposer.ts` |
| 11 | Carga masiva corrupta | **1.0** | MOJIBAKE en 500 preguntas | TSV con encoding corrupto no verificado | ROLLBACK. Máx 100 preguntas/lote, verificar UTF-8 | `comunidad-qa12..16.ts` eliminados |

---

## Checklist rápido de diagnóstico

| Síntoma | Qué revisar |
|---|---|
| Contenido duplicado | ¿Layer y workspace panel tienen el mismo resourceId? |
| Recurso incorrecto | ¿Usa `searchNodes()` donde debería usar `getNode()`? |
| Error 404 en API | ¿Server corriendo? ¿Ruta registrada? ¿Proxy configurado? |
| Error ESM | ¿`__dirname`, `require`, `module.exports` usados sin polyfill? |
| Endpoint lento | ¿Operación pesada dentro del request handler? |
| Imagen no carga | ¿Firefox? ¿OpaqueResponseBlocking? Cambiar URL |
