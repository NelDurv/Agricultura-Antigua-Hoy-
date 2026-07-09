import { globalSearch } from '../core/search/engine';
import { searchNodes } from '../core/knowledge/graph';
import type { SearchResult } from '../core/search/types';
import type { KnowledgeNode } from '../core/knowledge/types';

export function searchAll(query: string): SearchResult[] {
  return globalSearch(query);
}

export function suggest(query: string): KnowledgeNode[] {
  return searchNodes(query).slice(0, 6);
}
