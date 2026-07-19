import type { Intent, IntentType, ClarificationQuestion, IntentContext, SubIntent } from './types';
import { VAGUE_PATTERNS, CLARIFICATION_SETS } from './clarifications';

const INTENT_KEYWORDS: Record<IntentType, { words: string[]; weight: number }[]> = {
  learn: [
    { words: ['aprender', 'curso', 'enseñar', 'explicar', 'quiero saber', 'necesito saber', 'capacitar'], weight: 10 },
    { words: 'tutorial guía lección módulo capacitación formación estudiar'.split(' '), weight: 8 },
    { words: 'entiendo entender comprender dominar practicar'.split(' '), weight: 6 },
  ],
  apply: [
    { words: ['preparar', 'receta', 'elaborar', 'hacer', 'aplicar', 'mezclar', 'fabricar', 'producir', 'elaboración', 'preparación'], weight: 10 },
    { words: 'caldo sulfocálcico biol bokashi compost fermento bioinsumo'.split(' '), weight: 7 },
    { words: 'ingredientes materiales dosis paso procedimiento'.split(' '), weight: 6 },
  ],
  investigate: [
    { words: ['qué es', 'investigar', 'dime sobre', 'información sobre', 'explícame', 'definir', 'concepto', 'necesito información', 'busco información'], weight: 10 },
    { words: 'qué significa qué son qué fue cómo funciona detalles sobre'.split(' '), weight: 8 },
    { words: 'significado definición origen historia fundamento explicación'.split(' '), weight: 6 },
  ],
  compare: [
    { words: ['diferencia', 'vs', 'comparar', 'cuál es mejor', 'contraste', 'versus', 'comparativa'], weight: 10 },
    { words: 'diferencias entre comparación ventaja desventaja'.split(' '), weight: 8 },
    { words: 'superior mejor que peor que frente a'.split(' '), weight: 5 },
  ],
  calculate: [
    { words: ['calcular', 'fórmula', 'proporción', 'cantidad', 'cuánto', 'medida', 'calcule', 'cálculo'], weight: 10 },
    { words: 'humedad carbono nitrógeno relación ratio dosis'.split(' '), weight: 8 },
    { words: 'cuenta número total porcentaje'.split(' '), weight: 5 },
  ],
  explore: [
    { words: ['explorar', 'mostrar', 'ver', 'navegar', 'buscar', 'encontrar', 'listar', 'enséñame', 'muéstrame'], weight: 8 },
    { words: 'todos los cursos biblioteca documentos recursos'.split(' '), weight: 6 },
    { words: 'catálogo índice lista menú sección'.split(' '), weight: 5 },
  ],
  unknown: [],
};

const TOPIC_PATTERNS: { pattern: RegExp; topic: string }[] = [
  { pattern: /\b(trichoderma|hongos ben[eé]ficos|micorriza)\b/i, topic: 'hongos-beneficos' },
  { pattern: /\b(compost|bokashi|lombricompost|humus)\b/i, topic: 'compostaje' },
  { pattern: /\b(caldo sulfoc[aá]lcico|biol|bioinsumo)\b/i, topic: 'bioinsumos' },
  { pattern: /\b(suelo|nutrici[oó]n|fertilidad|materia org[aá]nica)\b/i, topic: 'suelo-vivo' },
  { pattern: /\b(plaga|insecto|control biol[oó]gico|neem)\b/i, topic: 'control-plagas' },
  { pattern: /\b(riego|agua|humedad|hidrología)\b/i, topic: 'manejo-agua' },
  { pattern: /\b(clima|cambi[oó] clim[aá]tico|temperatura)\b/i, topic: 'cambio-climatico' },
  { pattern: /\b(abono|fertilizante|esti[eé]rcol|org[aá]nico)\b/i, topic: 'fertilizacion' },
  { pattern: /\b(semilla|alm[aá]cigo|germinaci[oó]n|trasplante)\b/i, topic: 'semillas' },
  { pattern: /\b(certificaci[oó]n|ruta profesional|diplomado)\b/i, topic: 'certificacion' },
  { pattern: /\b(comunidad|foro|agricultor|campesino)\b/i, topic: 'comunidad' },
  { pattern: /\b(calculadora|humedad|carbono|nitr[oó]geno|relaci[oó]n)\b/i, topic: 'calculos' },
];

const COMPOUND_SEPARATORS = /\b(y\s+(también\s+)?|además\s+de|para\s+|luego\s+|así\s+como|también\s+)/i;

function scoreIntents(normalized: string): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const [type, patterns] of Object.entries(INTENT_KEYWORDS)) {
    if (type === 'unknown') continue;
    scores[type] = 0;
    for (const group of patterns) {
      for (const word of group.words) {
        if (normalized.includes(word)) {
          scores[type] += group.weight;
        }
      }
    }
  }
  return scores;
}

function detectCompoundIntents(scores: Record<string, number>): SubIntent[] {
  const threshold = 8;
  const detected: SubIntent[] = [];
  for (const [type, score] of Object.entries(scores)) {
    if (score >= threshold) {
      detected.push({ type: type as IntentType, confidence: Math.min(score / 15, 1) });
    }
  }
  return detected.sort((a, b) => b.confidence - a.confidence);
}

function hasCompoundIndicators(query: string): boolean {
  // Check for connectors like "y", "además", "para" between intent keywords
  return COMPOUND_SEPARATORS.test(query);
}

export function analyzeIntent(query: string, context?: IntentContext): Intent {
  const normalized = query.toLowerCase().trim();

  // Score each intent type from current query
  const scores = scoreIntents(normalized);

  // Boost scores from context history (conversation continuity)
  let contextUsed = false;
  if (context?.intentHistory && context.intentHistory.length > 0) {
    const lastIntent = context.intentHistory[context.intentHistory.length - 1];
    // Boost last intent for short queries without clear own intent
    const isShortQuery = normalized.split(/\s+/).length <= 4;
    const hasNoOwnScore = Object.values(scores).every(s => s === 0);
    if ((isShortQuery || hasNoOwnScore) && lastIntent !== 'unknown') {
      scores[lastIntent] = (scores[lastIntent] || 0) + 5;
      contextUsed = true;
    }
  }

  // Find best intent
  let bestType: IntentType = 'unknown';
  let bestScore = 0;
  for (const [type, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestType = type as IntentType;
    }
  }

  // Detect compound intents
  const subIntents = detectCompoundIntents(scores);
  const isCompound = hasCompoundIndicators(normalized) && subIntents.length > 1;

  // Detect vague / symptom-based queries (needs clarification)
  let isVague = false;
  let clarificationQuestions: ClarificationQuestion[] = [];
  for (const { pattern, groupId } of VAGUE_PATTERNS) {
    if (pattern.test(normalized)) {
      isVague = true;
      const questions = CLARIFICATION_SETS[groupId];
      if (questions) {
        clarificationQuestions = questions;
      }
      break;
    }
  }

  // Extract topics
  const topics: string[] = [];
  for (const { pattern, topic } of TOPIC_PATTERNS) {
    if (pattern.test(normalized)) {
      topics.push(topic);
      if (!topics.includes(topic)) topics.push(topic);
    }
  }

  return {
    type: bestType,
    confidence: Math.min(bestScore / 15, 1),
    topics: [...new Set(topics)],
    query,
    vague: isVague,
    clarificationQuestions: isVague ? clarificationQuestions : undefined,
    isCompound,
    subIntents: isCompound ? subIntents : undefined,
    contextUsed,
  };
}
