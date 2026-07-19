# Métricas — Agricultura Antigua

> KPIs y resultados del proyecto al momento de absorberlo en TAZ.

---

## Generales

| Métrica | Valor |
|---|---|
| Duración total del proyecto | ~30 días (múltiples sesiones) |
| Sesiones de trabajo documentadas | ~35 |
| Bugs encontrados | 11 |
| Bugs resueltos | 11 |
| Tasa de resolución | 100% |
| Stack principal | React 19 + TypeScript + Express 5 + ChromaDB |

## Código

| Métrica | Valor |
|---|---|
| Endpoints API | 17 |
| Fuentes de datos | 8 (cursos, docs, recetas, glosario, Q&A, posts, vectores, auto-learned) |
| Archivos de datos | 20+ (6 glosario, 11 comunidad-qa, más campus, biblioteca, etc.) |
| Componentes React | 30+ (contando subcomponentes) |
| Archivos server | 12 (routes + rag pipeline) |
| Tests | 28 tests, 3 suites |

## RAG

| Métrica | Valor |
|---|---|
| Chunks indexados | ~3863 |
| Dimensión de embeddings | 384 (all-MiniLM-L6-v2) |
| Términos en SFC | 88 |
| Categorías SFC | 7 |
| Threshold de búsqueda | 0.5 |

## Rendimiento

| Métrica | Valor |
|---|---|
| Búsqueda fuzzy (~1500 nodos) | < 50ms |
| Rebuild del grafo | < 100ms |
| Compresión SFC | 15-34% en texto técnico |
| Cache de respuestas | Implementado en goalProcessor |

## Calidad

| Métrica | Puntaje |
|---|---|
| Auditoría general | 9.4/10 |
| Funcionalidad | 10/10 |
| Calidad del código | 9.5/10 |
| Testing | 8.5/10 |
| Documentación | 9.5/10 |
| Seguridad | 9/10 |
| Rendimiento | 9.5/10 |
| Accesibilidad | 8.5/10 |
