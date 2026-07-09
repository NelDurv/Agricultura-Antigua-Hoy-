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
  course: (id) => `/academia/${id}`,
  article: (id) => `/biblioteca/${id}`,
  manual: (id) => `/biblioteca/${id}`,
  protocol: (id) => `/biblioteca/${id}`,
  guide: (id) => `/biblioteca/${id}`,
  infographic: (id) => `/biblioteca/${id}`,
  recipe: (id) => `/recursos`,
  glossary: (id) => `/recursos`,
  research: (id) => `/`,
  tool: (id) => `/recursos`,
  video: (id) => `/biblioteca`,
  news: (id) => `/comunidad`,
};

const typePriority: Record<string, number> = {
  course: 10,
  guide: 9,
  protocol: 8,
  article: 7,
  recipe: 6,
  glossary: 5,
  research: 4,
  manual: 8,
  infographic: 6,
  tool: 4,
  video: 5,
  news: 3,
};

export function globalSearch(query: string, filters?: SearchFilters): SearchResult[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  const graph = buildKnowledgeGraph();

  for (const node of graph.nodes) {
    if (filters?.types && !filters.types.includes(node.type)) continue;
    if (filters?.difficulty && node.difficulty !== filters.difficulty) continue;
    if (filters?.tags && !filters.tags.some(t => node.tags.includes(t))) continue;

    const matches: string[] = [];
    let score = 0;

    if (node.title.toLowerCase().includes(q)) {
      score += 20;
      matches.push('title');
    }
    if (node.description.toLowerCase().includes(q)) {
      score += 10;
      matches.push('description');
    }
    for (const tag of node.tags) {
      if (tag.toLowerCase().includes(q)) {
        score += 5;
        matches.push(`tag:${tag}`);
      }
    }
    for (const taxon of node.taxons) {
      if (taxon.toLowerCase().includes(q)) {
        score += 3;
        matches.push(`taxon:${taxon}`);
      }
    }

    if (score === 0) continue;

    score += typePriority[node.type] || 5;

    results.push({
      id: node.id,
      type: node.type,
      title: node.title,
      description: node.description,
      url: (urlMap[node.type] || (() => '/'))(node.id),
      score,
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
  }

  return Array.from(suggestions).slice(0, 8);
}
