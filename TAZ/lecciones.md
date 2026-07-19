# Lecciones — TAZ

> Errores que no repetir. Decisiones que funcionaron. Conocimiento transferible.

## Lección 1: Buscar por ID ≠ Buscar por texto
`searchNodes(texto)` es búsqueda semántica. `getNode(id)` es lookup exacto.  
No son intercambiables. Cuando tienes un ID, usa `getNode()`. Cuando tienes texto, usa `searchNodes()`.  
**Aplica a:** cualquier proyecto con grafo de conocimiento.

## Lección 2: Un recurso, una ventana
Si un plan ya tiene un `open-panel` task para un resourceId, no crear una layer para el mismo resourceId.  
Capa lateral + workspace panel = duplicación.  
**Regla:** workspace panel gana, layer se omite.

## Lección 3: ESM cambia las reglas
En `"type": "module"`, no existen `__dirname`, `require`, `module.exports`.  
Usar `import.meta.url` + `fileURLToPath` para rutas, `import` para módulos.  
**Siempre verificar** `"type"` en package.json antes de asumir CommonJS.

## Lección 4: Operaciones pesadas fuera del request handler
Indexar 3000+ embeddings toma minutos. No hacerlo dentro de una respuesta HTTP.  
Responder primero, procesar después (o en otro proceso).  
**Patrón:** Fire-and-forget + endpoint separado para operaciones pesadas.

## Lección 5: El proxy de Vite no oculta errores del backend
El proxy de Vite reenvía el status code del backend. Si el API devuelve 404, el cliente ve 404.  
Verificar que el server esté corriendo y las rutas estén registradas.

## Lección 6: Firefox es más estricto con CORS en imágenes
OpaqueResponseBlocking bloquea respuestas cross-origin que Firefox considera sospechosas.  
Usar imágenes de dominios con CORS bien configurado y evitar cambios frecuentes de URL.
