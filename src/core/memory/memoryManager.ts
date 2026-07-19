import type { MemoryEntry, MemoryLayerId, MemoryQuery, MemoryStats } from './types';
import { MEMORY_LAYERS } from './types';
import { ContextPolicy, defaultPolicy } from './contextPolicy';
import { storage, STORAGE_KEYS } from '../persistence';

const AA_PREFIX = 'aa_memory_';

export class MemoryManager {
  private store = new Map<string, MemoryEntry>();
  private policy: ContextPolicy;

  constructor(policy?: ContextPolicy) {
    this.policy = policy ?? defaultPolicy;
    this.restore();
  }

  set<T>(key: string, value: T, options?: { layer?: MemoryLayerId; ttl?: number }): void {
    const { layer: explicitLayer, ttl: explicitTtl } = options ?? {};
    const classified = explicitLayer ? { layer: explicitLayer, ttl: explicitTtl } : this.policy.classifyKey(key);
    const layerDef = MEMORY_LAYERS.find(l => l.id === classified.layer);

    const entry: MemoryEntry<T> = {
      key,
      value,
      layer: classified.layer,
      timestamp: Date.now(),
      ttl: explicitTtl ?? classified.ttl ?? layerDef?.defaultTtl,
    };

    this.store.set(key, entry);

    if (classified.layer !== 'temporal') {
      this.saveToStorage(entry);
    }

    if (layerDef?.maxEntries) {
      this.enforceMaxEntries(classified.layer, layerDef.maxEntries);
    }
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  delete(key: string): boolean {
    const existed = this.store.has(key);
    this.store.delete(key);
    if (existed) {
      try { localStorage.removeItem(AA_PREFIX + key); } catch { /* noop */ }
    }
    return existed;
  }

  search(query: MemoryQuery): MemoryEntry[] {
    const results: MemoryEntry[] = [];

    for (const entry of this.store.values()) {
      if (query.layer && entry.layer !== query.layer) continue;
      if (query.key && entry.key !== query.key) continue;
      if (query.pattern && !new RegExp(query.pattern).test(entry.key)) continue;
      if (query.type && (!entry.metadata || entry.metadata.type !== query.type)) continue;

      if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) continue;

      results.push(entry);
    }

    const sorted = results.sort((a, b) => b.timestamp - a.timestamp);
    return query.limit ? sorted.slice(0, query.limit) : sorted;
  }

  prune(layer?: MemoryLayerId): number {
    let removed = 0;
    for (const [key, entry] of this.store.entries()) {
      if (layer && entry.layer !== layer) continue;
      if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
        this.store.delete(key);
        removed++;
      }
    }
    return removed;
  }

  clear(layer?: MemoryLayerId): void {
    if (layer) {
      for (const [key, entry] of this.store.entries()) {
        if (entry.layer === layer) {
          this.store.delete(key);
          try { localStorage.removeItem(AA_PREFIX + key); } catch { /* noop */ }
        }
      }
    } else {
      this.store.clear();
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(AA_PREFIX)) {
          try { localStorage.removeItem(k); } catch { /* noop */ }
        }
      }
    }
  }

  getContextSnapshot(): Record<string, unknown> {
    const snapshot: Record<string, unknown> = {};
    for (const entry of this.store.values()) {
      if (!entry.ttl || Date.now() - entry.timestamp <= entry.ttl) {
        snapshot[entry.key] = entry.value;
      }
    }
    return snapshot;
  }

  getStats(): MemoryStats {
    const layers: Record<string, { count: number; oldest: number; newest: number }> = {};
    let total = 0;

    for (const layer of MEMORY_LAYERS) {
      const entries = Array.from(this.store.values()).filter(e => e.layer === layer.id);
      layers[layer.id] = {
        count: entries.length,
        oldest: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : 0,
        newest: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : 0,
      };
      total += entries.length;
    }

    return { totalEntries: total, layers };
  }

  private enforceMaxEntries(layerId: MemoryLayerId, max: number): void {
    const entries = Array.from(this.store.values())
      .filter(e => e.layer === layerId)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (entries.length > max) {
      const toRemove = entries.slice(0, entries.length - max);
      for (const entry of toRemove) {
        this.store.delete(entry.key);
      }
    }
  }

  private saveToStorage(entry: MemoryEntry): void {
    try {
      localStorage.setItem(AA_PREFIX + entry.key, JSON.stringify(entry));
    } catch {
      console.warn(`[Memory] Error al guardar ${entry.key}`);
    }
  }

  persist(): void {
    for (const entry of this.store.values()) {
      if (entry.layer !== 'temporal') {
        this.saveToStorage(entry);
      }
    }
  }

  restore(): void {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(AA_PREFIX)) {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              const entry = JSON.parse(raw) as MemoryEntry;
              this.store.set(entry.key, entry);
            } catch { /* skip corrupt entries */ }
          }
        }
      }
    } catch {
      console.warn('[Memory] Error al restaurar memoria');
    }
  }
}

export const memoryManager = new MemoryManager();
