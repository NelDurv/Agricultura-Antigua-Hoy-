# TAZ — Territorio de Aprendizaje Zen

> Sistema de memoria experiencial para agentes opencode.  
> Acumula, estructura y reutiliza conocimiento entre proyectos y sesiones.

---

## ¿Qué es TAZ?

TAZ es un sistema de memoria persistente que permite a agentes opencode (y equipos) capturar la experiencia acumulada en proyectos y reutilizarla en nuevos contextos. A diferencia de `AGENTS.md` (memoria de sesión única), TAZ crece con cada proyecto y es portable entre repositorios.

## Estructura

```
TAZ/
├── TAZ.md                   # Manifiesto principal (índice vivo del sistema)
├── README.md                # Esta documentación
├── taz_config.json          # Metadatos, versión, stats globales
├── patrones.md              # Soluciones reutilizables con scores de confianza
├── bugs.md                  # Registro histórico de errores con diagnóstico rápido
├── arquitectura.md          # Modelos de arquitectura portables
├── lecciones.md             # Conocimiento transferible a otros proyectos
├── indices/                 # Índices de búsqueda (crecimiento futuro)
│   ├── patrones_index.json
│   ├── bugs_index.json
│   └── proyectos_index.json
└── proyectos/               # Contexto específico de cada proyecto absorbido
    └── [nombre-proyecto]/
        ├── contexto.md      # Stack, arquitectura, datos, comandos
        ├── metricas.md      # KPIs y resultados
        └── decisiones.md    # Decisiones clave con contexto y resultado
```

## Archivos Requeridos vs Opcionales

| Archivo | Obligatorio | Propósito |
|---|---|---|
| `TAZ.md` | ✅ Sí | Manifiesto — opencode lo lee al iniciar sesión |
| `patrones.md` | ✅ Sí | Patrones reutilizables detectados |
| `bugs.md` | ✅ Sí | Errores históricos con causas raíz |
| `arquitectura.md` | ✅ Sí | Modelos de diseño probados |
| `lecciones.md` | ✅ Sí | Lecciones transferibles |
| `taz_config.json` | ❌ No | Metadatos y versionado |
| `README.md` | ❌ No | Documentación del sistema |
| `proyectos/[id]/` | ❌ No | Contexto por proyecto absorbido |

## Ciclo de Vida

```
1. Inicio de sesión → opencode lee TAZ.md → contexto disponible
2. Durante el trabajo → detectar patrones, bugs, decisiones
3. Fin de sesión → documentar hallazgos, actualizar config
4. Nuevo proyecto → copiar TAZ/ → experiencia transferida
```

## Scores de Confianza

Cada patrón y bug tiene un score de 0.0 a 1.0:

| Rango | Etiqueta | Significado |
|---|---|---|
| ≥ 0.9 | Golden | Probado en múltiples contextos, altamente confiable |
| ≥ 0.7 | Alta | Probado en al menos un proyecto, resultados verificados |
| ≥ 0.4 | Media | Detectado pero pendiente de verificación en otros contextos |
| < 0.4 | Baja | Hipotético, requiere más evidencia |

## Integración con opencode

TAZ está diseñado para que opencode lo lea automáticamente:

- `TAZ.md` → contexto principal (cargar al iniciar sesión)
- `proyectos/[proyecto]/contexto.md` → detalles del proyecto actual
- `patrones.md` → consulta cuando se enfrenta a un problema conocido
- `bugs.md` → consulta cuando aparece un error con síntomas conocidos

## Versionado

Formato `vX.Y.Z`:
- **X**: Cambios mayores en la estructura de TAZ
- **Y**: Nuevas capacidades (nuevos tipos de archivos, más funcionalidad)
- **Z**: Correcciones, actualizaciones de contenido

## Proyectos Absorbidos

| Proyecto | Stack | Bugs | Patrones | Decisiones |
|---|---|---|---|---|
| Agricultura Antigua | React + TypeScript + Express + ChromaDB | 11 | 5 | 6 |

---

*TAZ v1.0.0 — Creado el 2026-07-19*
