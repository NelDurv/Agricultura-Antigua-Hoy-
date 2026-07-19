const spec = {
  openapi: '3.0.0',
  info: {
    title: 'Agricultura Antigua API',
    version: '1.1.0',
    description: 'API REST del campus digital y base de conocimientos de agricultura sostenible. Documentación interactiva de los 17 endpoints disponibles.',
    contact: { name: 'Agricultura Antigua', url: 'https://agricultura-antigua.app' },
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Development' },
    { url: 'https://api.agricultura-antigua.app', description: 'Production' },
  ],
  paths: {
    '/api/status': {
      get: { summary: 'Health check', description: 'Estado del servidor y lista de endpoints', responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, name: { type: 'string' }, version: { type: 'string' }, endpoints: { type: 'array', items: { type: 'object' } } } } } } } } },
    },
    '/api/courses': {
      get: { summary: 'Lista de cursos', description: 'Obtiene cursos con paginación', parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Número de página' },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 50 }, description: 'Resultados por página' },
      ], responses: { '200': { description: 'Lista de cursos' } } },
    },
    '/api/courses/{id}': {
      get: { summary: 'Detalle de curso', description: 'Obtiene un curso con sus módulos', parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID del curso' },
      ], responses: { '200': { description: 'Curso con módulos' }, '404': { description: 'Curso no encontrado' } } },
    },
    '/api/documents': {
      get: { summary: 'Lista de documentos', description: 'Obtiene documentos con paginación', parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 50 } },
      ], responses: { '200': { description: 'Lista de documentos' } } },
    },
    '/api/documents/{id}': {
      get: { summary: 'Detalle de documento', description: 'Obtiene un documento con texto completo', parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ], responses: { '200': { description: 'Documento con fullText' }, '404': { description: 'Documento no encontrado' } } },
    },
    '/api/recipes': {
      get: { summary: 'Lista de recetas', description: 'Obtiene recetas, opcionalmente filtradas por categoría', parameters: [
        { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filtrar por categoría' },
      ], responses: { '200': { description: 'Lista de recetas' } } },
    },
    '/api/recipes/{id}': {
      get: { summary: 'Detalle de receta', description: 'Obtiene una receta con ingredientes y pasos', parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ], responses: { '200': { description: 'Receta completa' }, '404': { description: 'Receta no encontrada' } } },
    },
    '/api/campus': {
      get: { summary: 'Cursos del campus', description: 'Lista completa de 32 cursos del campus', responses: { '200': { description: 'Array de cursos' } } },
    },
    '/api/campus/{id}': {
      get: { summary: 'Detalle de curso campus', description: 'Obtiene un curso del campus con studyContent', parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ], responses: { '200': { description: 'Curso campus completo' }, '404': { description: 'Curso no encontrado' } } },
    },
    '/api/glossary': {
      get: { summary: 'Glosario', description: 'Términos del glosario, opcionalmente filtrados por búsqueda', parameters: [
        { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Filtrar términos' },
      ], responses: { '200': { description: 'Array de términos del glosario' } } },
    },
    '/api/search': {
      get: { summary: 'Búsqueda global', description: 'Búsqueda cross-type con scoring en todas las fuentes de datos', parameters: [
        { name: 'q', in: 'query', required: true, schema: { type: 'string', minLength: 1, maxLength: 200 }, description: 'Término de búsqueda' },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, minimum: 1, maximum: 50 }, description: 'Resultados máximos' },
      ], responses: { '200': { description: 'Resultados ordenados por score' }, '400': { description: 'Parámetros inválidos (Zod)' } } },
    },
    '/api/sitemap': {
      get: { summary: 'Sitemap', description: 'Inventario completo de recursos (53 items)', responses: { '200': { description: 'Array de recursos' } } },
    },
    '/api/agrovoc': {
      get: { summary: 'Vocabulario AGROVOC', description: 'Conceptos FAO, opcionalmente filtrados o con resolución de texto', parameters: [
        { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Filtrar conceptos' },
        { name: 'resolve', in: 'query', schema: { type: 'string' }, description: 'Texto a resolver → IDs AGROVOC' },
      ], responses: { '200': { description: 'Conceptos AGROVOC' } } },
    },
    '/api/agrovoc/{id}': {
      get: { summary: 'Concepto AGROVOC', description: 'Obtiene un concepto AGROVOC individual', parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID del concepto (ej: c_7156)' },
      ], responses: { '200': { description: 'Concepto AGROVOC' }, '404': { description: 'Concepto no encontrado' } } },
    },
    '/api/ai-manifest': {
      get: { summary: 'Manifiesto IA', description: 'Catálogo completo optimizado para consumo por IAs externas', responses: { '200': { description: 'Manifiesto IA' } } },
    },
    '/api/recommend': {
      get: { summary: 'Recomendaciones', description: 'Recomendaciones de contenido basadas en tópico, tipo y límite', parameters: [
        { name: 'topic', in: 'query', schema: { type: 'string' }, description: 'Tópico de interés' },
        { name: 'type', in: 'query', schema: { type: 'string' }, description: 'Tipo de contenido (course/article/recipe)' },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 5, maximum: 20 }, description: 'Máximo de recomendaciones' },
      ], responses: { '200': { description: 'Recomendaciones' } } },
    },
  },
};

export const openapiSpec = spec;
