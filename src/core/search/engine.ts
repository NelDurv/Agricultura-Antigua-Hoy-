import { searchNodes, getNode, buildKnowledgeGraph } from '../knowledge/graph';
import type { KnowledgeNode, KnowledgeType } from '../knowledge/types';

export interface SearchResult {
  id: string;
  type: KnowledgeType;
  title: string;
  description: string;
  url: string;
  score: number;
  tags: string[];
  matches: string[];
}

export interface SearchFilters {
  types?: KnowledgeType[];
  tags?: string[];
  difficulty?: string;
}

const urlMap: Record<string, (id: string) => string> = {
  course: () => `/campus`,
  article: () => `/biblioteca`,
  manual: () => `/biblioteca`,
  protocol: () => `/biblioteca`,
  guide: () => `/biblioteca`,
  infographic: () => `/biblioteca`,
  recipe: () => `/recursos`,
  glossary: () => `/recursos`,
  research: () => `/`,
  statistic: () => `/`,
  tool: () => `/recursos`,
  video: () => `/biblioteca`,
  news: () => `/comunidad`,
};

const typePriority: Record<string, number> = {
  course: 10,
  guide: 9,
  protocol: 8,
  manual: 8,
  article: 7,
  recipe: 6,
  glossary: 5,
  research: 4,
  statistic: 3,
  infographic: 6,
  tool: 4,
  video: 5,
  news: 3,
};

const STOP_WORDS = new Set([
  'que', 'del', 'las', 'los', 'con', 'para', 'como', 'una', 'más',
  'este', 'esta', 'entre', 'sobre', 'tiene', 'hasta', 'todo', 'pero',
  'muy', 'cómo', 'qué', 'por', 'puede', 'debe', 'hace', 'hacer',
  'cuál', 'eres', 'sabes', 'dime', 'quiero', 'necesito', 'ayuda',
  'hola', 'gracias', 'bueno', 'buena', 'son', 'sus', 'han', 'era',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-záéíóúñü0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function fuzzyMatch(token: string, field: string): boolean {
  if (field.includes(token)) return true;
  if (token.includes(field)) return true;
  if (token.length >= 4 && field.length >= 4) {
    const minLen = Math.min(token.length, field.length);
    const maxPrefix = Math.min(minLen, Math.max(token.length, field.length) - 2);
    if (maxPrefix >= 4 && token.slice(0, maxPrefix) === field.slice(0, maxPrefix)) return true;
    const tokenBigrams = new Set<string>();
    for (let i = 0; i < token.length - 1; i++) tokenBigrams.add(token.slice(i, i + 2));
    let overlap = 0;
    for (let i = 0; i < field.length - 1; i++) {
      if (tokenBigrams.has(field.slice(i, i + 2))) overlap++;
    }
    const maxBigrams = Math.max(token.length - 1, field.length - 1);
    if (maxBigrams > 0 && overlap / maxBigrams > 0.4) return true;
  }
  return false;
}

function scoreNode(node: KnowledgeNode, qTokens: string[]): number {
  let score = 0;
  const titleLow = node.title.toLowerCase();
  const descLow = node.description.toLowerCase();
  const fullLow = node.fullText?.toLowerCase() || '';
  const kwLow = node.keywords?.map(k => k.toLowerCase()) || [];
  const tagLow = node.tags.map(t => t.toLowerCase());
  const taxLow = node.taxons.map(t => t.toLowerCase());

  for (const token of qTokens) {
    if (fuzzyMatch(token, titleLow)) score += 20;
    if (kwLow.some(k => fuzzyMatch(token, k))) score += 15;
    if (tagLow.some(t => fuzzyMatch(token, t))) score += 10;
    if (taxLow.some(t => fuzzyMatch(token, t))) score += 5;
    if (fuzzyMatch(token, fullLow)) score += 4;
    if (fuzzyMatch(token, descLow)) score += 3;
  }

  return score;
}

export function globalSearch(query: string, filters?: SearchFilters): SearchResult[] {
  if (!query.trim()) return [];
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];

  const graph = buildKnowledgeGraph();
  const results: SearchResult[] = [];

  for (const node of graph.nodes) {
    if (filters?.types && !filters.types.includes(node.type)) continue;
    if (filters?.difficulty && node.difficulty !== filters.difficulty) continue;
    if (filters?.tags && !filters.tags.some(t => node.tags.includes(t))) continue;

    const matches: string[] = [];
    const score = scoreNode(node, qTokens);

    if (score === 0) continue;

    const finalScore = score + (typePriority[node.type] || 5);

    results.push({
      id: node.id,
      type: node.type,
      title: node.title,
      description: node.description,
      url: (urlMap[node.type] || (() => '/'))(node.id),
      score: finalScore,
      tags: node.tags,
      matches,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 20);
}

export function getSearchSuggestions(query: string): string[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const graph = buildKnowledgeGraph();
  const suggestions = new Set<string>();

  for (const node of graph.nodes) {
    node.tags.forEach(t => {
      if (t.toLowerCase().includes(q)) suggestions.add(t);
    });
    (node.keywords || []).forEach(k => {
      if (k.toLowerCase().includes(q)) suggestions.add(k);
    });
  }

  return Array.from(suggestions).slice(0, 8);
}
