import { useState, useCallback, useMemo } from 'react';
import { searchAll, suggest } from '../services';
import type { SearchResult } from '../core/search/types';
import type { KnowledgeNode } from '../core/knowledge/types';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<KnowledgeNode[]>([]);

  const search = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }
    setResults(searchAll(q));
    setSuggestions(suggest(q));
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
  }, []);

  return useMemo(
    () => ({ query, results, suggestions, search, clear }),
    [query, results, suggestions, search, clear],
  );
}
