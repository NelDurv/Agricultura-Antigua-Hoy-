export type MemoryLayerId = 'temporal' | 'session' | 'project';

export interface MemoryEntry<T = unknown> {
  key: string;
  value: T;
  layer: MemoryLayerId;
  timestamp: number;
  ttl?: number;
  metadata?: Record<string, string>;
}

export interface MemoryLayer {
  id: MemoryLayerId;
  name: string;
  storage: 'memory' | 'localStorage';
  priority: number;
  maxEntries?: number;
  defaultTtl?: number;
}

export interface MemoryQuery {
  key?: string;
  pattern?: string;
  layer?: MemoryLayerId;
  limit?: number;
  type?: string;
}

export interface MemoryStats {
  totalEntries: number;
  layers: Record<string, { count: number; oldest: number; newest: number }>;
}

export const MEMORY_LAYERS: MemoryLayer[] = [
  { id: 'temporal', name: 'Memoria Temporal', storage: 'memory', priority: 0, maxEntries: 100, defaultTtl: 30 * 60 * 1000 },
  { id: 'session', name: 'Memoria de Sesión', storage: 'localStorage', priority: 1, maxEntries: 200 },
  { id: 'project', name: 'Memoria de Proyecto', storage: 'localStorage', priority: 2 },
];
