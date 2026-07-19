import type { KnowledgeNode, KnowledgeRelationship, KnowledgeGraph } from './types';
import { buildUnifiedIndex, entriesToNodes } from '../search/unifiedIndex';

function buildEdges(nodes: KnowledgeNode[]): KnowledgeRelationship[] {
  const edges: KnowledgeRelationship[] = [];
  const edgeSet = new Set<string>();
  const idSet = new Set(nodes.map(n => n.id));
  const tagIndex = new Map<string, string[]>();

  for (const n of nodes) {
    for (const tag of n.tags) {
      const key = tag.toLowerCase().trim();
      if (!tagIndex.has(key)) tagIndex.set(key, []);
      tagIndex.get(key)!.push(n.id);
    }
  }

  for (const n of nodes) {
    for (const relatedId of n.relatedTo) {
      if (idSet.has(relatedId)) {
        const key = n.id < relatedId ? `${n.id}|${relatedId}` : `${relatedId}|${n.id}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ sourceId: n.id, targetId: relatedId, relation: 'related' });
        }
      }
    }
  }

  for (const [, ids] of tagIndex) {
    if (ids.length < 2 || ids.length > 50) continue;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const key = ids[i] < ids[j] ? `${ids[i]}|${ids[j]}` : `${ids[j]}|${ids[i]}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ sourceId: ids[i], targetId: ids[j], relation: 'related' });
        }
      }
    }
  }

  return edges;
}

let _graph: KnowledgeGraph | null = null;

// prebuilt knowledge-graph.json removed — graph is always built from source

export function invalidateGraph(): void {
  _graph = null;
}

export function buildKnowledgeGraph(): KnowledgeGraph {
  if (_graph) return _graph;
  const entries = buildUnifiedIndex();
  const nodes = entriesToNodes(entries);
  const edges = buildEdges(nodes);
  _graph = { nodes, edges };
  return _graph;
}

export function getRelatedIds(id: string): string[] {
  const graph = buildKnowledgeGraph();
  const related = new Set<string>();
  for (const e of graph.edges) {
    if (e.sourceId === id) related.add(e.targetId);
    if (e.targetId === id) related.add(e.sourceId);
  }
  return Array.from(related);
}

export function getRelatedNodes(id: string): KnowledgeNode[] {
  const graph = buildKnowledgeGraph();
  const ids = getRelatedIds(id);
  return graph.nodes.filter(n => ids.includes(n.id));
}

export function getNode(id: string): KnowledgeNode | undefined {
  return buildKnowledgeGraph().nodes.find(n => n.id === id);
}

export function getNodesByType(type: string): KnowledgeNode[] {
  return buildKnowledgeGraph().nodes.filter(n => n.type === type);
}

// ─────────────────────────────────────
// Search — tokenized + scored + fullText + keywords
// ─────────────────────────────────────

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
    .replace(/[^a-záéíóúñüA-ZÁÉÍÓÚÑÜ0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

/** Fuzzy match: substring, prefix, or bigram overlap > 55% */
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
    if (maxBigrams > 0 && overlap / maxBigrams > 0.55) return true;
  }
  return false;
}

function scoreNode(node: KnowledgeNode, tokens: string[]): number {
  let score = 0;
  const titleLow = node.title.toLowerCase();
  const descLow = node.description.toLowerCase();
  const fullLow = node.fullText?.toLowerCase() || '';
  const kwLow = node.keywords?.map(k => k.toLowerCase()) || [];
  const tagLow = node.tags.map(t => t.toLowerCase());
  const taxLow = node.taxons.map(t => t.toLowerCase());

  if (tokens.length === 1 && node.id.toLowerCase() === tokens[0]) return 100;
  if (node.id.toLowerCase().includes(tokens.join('-'))) score += 50;

  for (const token of tokens) {
    if (fuzzyMatch(token, titleLow)) score += 10;
    if (kwLow.some(k => fuzzyMatch(token, k))) score += 9;
    if (tagLow.some(t => fuzzyMatch(token, t))) score += 8;
    if (taxLow.some(t => fuzzyMatch(token, t))) score += 6;
    if (fuzzyMatch(token, fullLow)) score += 3;
    if (fuzzyMatch(token, descLow)) score += 2;
  }

  // Boost richer content types over glossary/statistic/news
  const richTypes = ['course', 'article', 'manual', 'guide'];
  if (richTypes.includes(node.type)) score += 10;

  return score;
}

export function searchNodes(query: string): KnowledgeNode[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return buildKnowledgeGraph().nodes.slice(0, 10);

  const scored = buildKnowledgeGraph()
    .nodes
    .map(n => ({ node: n, score: scoreNode(n, tokens) }))
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map(entry => entry.node);
}
