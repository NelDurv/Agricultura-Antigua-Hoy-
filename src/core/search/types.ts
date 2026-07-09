import type { KnowledgeType } from '../knowledge/types';

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
  cultivo?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchQuery {
  term: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}
