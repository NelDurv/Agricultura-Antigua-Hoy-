# TAZ — Territorio de Aprendizaje Zen

> v1.0.0 | Memoria viva de experiencia acumulada entre sesiones.  
> opencode: leer al inicio de cada sesión para cargar contexto.

---

## Proyecto Actual

**Agricultura Antigua** — React 19 + Express 5 + ChromaDB + RAG  
Stack completo y contexto → `TAZ/proyectos/agricultura-antigua/contexto.md`

## Conocimiento Portable

| Archivo | Contenido | Prioridad |
|---|---|---|
| `TAZ/patrones.md` | 5 patrones con scores de confianza | Alta |
| `TAZ/bugs.md` | 11 bugs con causas raíz y fixes | Alta |
| `TAZ/lecciones.md` | 6 lecciones transferibles | Media |
| `TAZ/arquitectura.md` | Modelos de diseño probados | Media |
| `TAZ/proyectos/agricultura-antigua/decisiones.md` | 6 decisiones clave | Alta |
| `TAZ/proyectos/agricultura-antigua/metricas.md` | KPIs y resultados | Baja |

## Stats Globales

- Proyectos absorbidos: 1
- Patrones documentados: 5 (2 golden)
- Bugs registrados: 11 (100% resueltos)
- Decisiones documentadas: 6
- Lecciones aprendidas: 6
- Confianza promedio: 0.93

## Cómo Usar TAZ

1. **Al iniciar sesión:** leer este manifiesto para orientación
2. **Durante el trabajo:** consultar `TAZ/patrones.md` y `TAZ/bugs.md` ante problemas conocidos
3. **Al descubrir algo nuevo:** documentar en el archivo correspondiente dentro de `TAZ/`
4. **Al finalizar:** actualizar `TAZ/taz_config.json` con los nuevos stats

## Reglas Críticas (del proyecto actual)

1. **Sin duplicación:** Si un `open-panel` task cubre un resourceId, `buildLayers()` NO crea layer
2. **Lookup exacto:** `getNode(id)` para IDs, `searchNodes(query)` para texto — NO intercambiar
3. **ESM:** `__dirname` no existe en `"type": "module"` — usar `fileURLToPath`
4. **Operaciones pesadas:** nunca dentro del request handler — endpoints separados

---

*Iniciado: 2026-07-19 | Proyecto: Agricultura Antigua v1.2.0*
