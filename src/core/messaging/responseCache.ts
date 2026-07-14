type CacheEntry = {
  data: { content: string; suggestions: import('../../contexts/BrainContext').Suggestion[] };
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();
const TTL = 5 * 60 * 1000; // 5 min

// Normaliza la query para mejorar cache hits
function normalize(query: string): string {
  return query.toLowerCase().replace(/[¿?¡!.,;:]+/g, '').trim();
}

export function getCachedResponse(
  query: string,
): { content: string; suggestions: import('../../contexts/BrainContext').Suggestion[] } | null {
  const key = normalize(query);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCachedResponse(
  query: string,
  data: { content: string; suggestions: import('../../contexts/BrainContext').Suggestion[] },
): void {
  const key = normalize(query);
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearResponseCache(): void {
  cache.clear();
}
