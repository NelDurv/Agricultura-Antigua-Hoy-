import type { ClarificationQuestion } from './types';

export const CLARIFICATION_SETS: Record<string, ClarificationQuestion[]> = {
  'yellow-leaves': [
    { id: 'plant-type', question: '¿Qué tipo de planta es?', field: 'plantType', options: ['Tomate', 'Maíz', 'Frijol', 'Cítrico', 'Ornamental', 'Hortaliza', 'Otra'] },
    { id: 'leaf-age', question: '¿Las hojas amarillas son las viejas (abajo) o las nuevas (arriba)?', field: 'leafAge', options: ['Viejas / abajo', 'Nuevas / arriba', 'Todas'] },
    { id: 'watering', question: '¿Cómo has regado últimamente?', field: 'watering', options: ['Mucho / encharcado', 'Normal', 'Poco / seco'] },
    { id: 'pests', question: '¿Has visto insectos, manchas o polvo en las hojas?', field: 'pests', options: ['Sí, insectos', 'Sí, manchas', 'Sí, polvo blanco', 'No, nada visible'] },
    { id: 'fertilization', question: '¿Has aplicado fertilizante o abono recientemente?', field: 'fertilization', options: ['Sí, orgánico', 'Sí, químico', 'No'] },
  ],
  'wilting': [
    { id: 'plant-type', question: '¿Qué tipo de planta es?', field: 'plantType', options: ['Tomate', 'Maíz', 'Frijol', 'Hortaliza', 'Ornamental', 'Otra'] },
    { id: 'soil-moisture', question: '¿Cómo está el suelo al tacto?', field: 'soilMoisture', options: ['Muy húmedo / barro', 'Húmedo normal', 'Seco / polvo'] },
    { id: 'wilting-time', question: '¿A qué hora del día se marchita más?', field: 'wiltingTime', options: ['Mediodía / calor', 'Mañana', 'Todo el día'] },
  ],
  'pests-generic': [
    { id: 'pest-location', question: '¿Dónde ves los insectos o el daño?', field: 'pestLocation', options: ['Hojas', 'Tallos', 'Raíces', 'Frutos', 'Flores'] },
    { id: 'pest-appearance', question: '¿Cómo se ve el daño?', field: 'pestAppearance', options: ['Aguijeros en hojas', 'Amarillamiento', 'Manchas blancas', 'Telarañas', 'Bichos visibles', 'Polvo blanco'] },
    { id: 'plant-type', question: '¿Qué tipo de planta afecta?', field: 'plantType', options: ['Tomate', 'Maíz', 'Frijol', 'Cítrico', 'Hortaliza', 'Otra'] },
  ],
  'spots-leaves': [
    { id: 'spot-color', question: '¿De qué color son las manchas?', field: 'spotColor', options: ['Café / marrón', 'Negro', 'Amarillo', 'Blanco', 'Moho gris'] },
    { id: 'spot-location', question: '¿Las manchas están en hojas viejas o nuevas?', field: 'spotLocation', options: ['Viejas / abajo', 'Nuevas / arriba', 'Todas'] },
    { id: 'plant-type', question: '¿Qué tipo de planta es?', field: 'plantType', options: ['Tomate', 'Maíz', 'Frijol', 'Rosal', 'Hortaliza', 'Otra'] },
  ],
  'poor-growth': [
    { id: 'plant-type', question: '¿Qué tipo de planta es?', field: 'plantType', options: ['Tomate', 'Maíz', 'Frijol', 'Hortaliza', 'Árbol', 'Otra'] },
    { id: 'growth-location', question: '¿Está en maceta o en suelo directo?', field: 'growthLocation', options: ['Maceta', 'Suelo directo', 'Cama de cultivo'] },
    { id: 'sunlight', question: '¿Recibe sol directo?', field: 'sunlight', options: ['Sol directo todo el día', 'Sol medio / sombra parcial', 'Sombra casi todo'] },
    { id: 'fertilization', question: '¿Has aplicado abono o fertilizante?', field: 'fertilization', options: ['Sí, orgánico', 'Sí, químico', 'No'] },
  ],
  'fruit-flower-drop': [
    { id: 'plant-type', question: '¿Qué tipo de planta es?', field: 'plantType', options: ['Tomate', 'Ají', 'Frijol', 'Calabaza', 'Cítrico', 'Otra'] },
    { id: 'drop-timing', question: '¿Cuándo se caen?', field: 'dropTiming', options: ['Recién formados', 'Medio desarrollo', 'Ya grandes'] },
    { id: 'weather', question: '¿Cómo ha estado el clima?', field: 'weather', options: ['Mucho calor', 'Mucho frío', 'Lluvia intensa', 'Normal'] },
  ],
};

export const VAGUE_PATTERNS: { pattern: RegExp; groupId: string }[] = [
  { pattern: /hojas?\s+amarillas?\b/i, groupId: 'yellow-leaves' },
  { pattern: /amarill[oa]\s+(hojas?|plant[ae])\b/i, groupId: 'yellow-leaves' },
  { pattern: /se\s+est[aá]\s+poniendo\s+amarill[oa]/i, groupId: 'yellow-leaves' },
  { pattern: /marchit[oó]|marchitez/i, groupId: 'wilting' },
  { pattern: /se\s+marchit[ao]/i, groupId: 'wilting' },
  { pattern: /plagas?\b|insectos?\b|bichos?\b/i, groupId: 'pests-generic' },
  { pattern: /manchas?\s+en\s+(las\s+)?hojas/i, groupId: 'spots-leaves' },
  { pattern: /hojas?\s+con\s+manchas/i, groupId: 'spots-leaves' },
  { pattern: /no\s+crece\b|crecimiento\s+lento|enano\b/i, groupId: 'poor-growth' },
  { pattern: /se\s+ca[ei]r[oa]n?\s+(las\s+)?(flores?|frutos?)/i, groupId: 'fruit-flower-drop' },
  { pattern: /ca[íi]da\s+de\s+(flores|frutos)/i, groupId: 'fruit-flower-drop' },
];
