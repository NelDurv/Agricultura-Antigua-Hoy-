export const STORAGE_KEYS = {
  MESSAGES: 'aa_messages',
  WORKSPACE: 'aa_workspace',
  INTENT_HISTORY: 'aa_intent_history',
  SESSION_ID: 'aa_session_id',
  COLLECTED_ANSWERS: 'aa_collected_answers',
  LAST_PLAN: 'aa_last_plan',
  LAYERS: 'aa_layers',
} as const;

export interface PersistedState {
  messages: import('../../contexts/BrainContext').Message[];
  workspace: import('../../core/engine/types').Workspace | null;
  intentHistory: import('../../core/engine/types').IntentType[];
  collectedAnswers: Record<string, string>;
  lastPlan: import('../../core/engine/types').Plan | null;
  layers: import('../../contexts/BrainContext').Layer[];
}

function isStorageAvailable(): boolean {
  try {
    const k = '__test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

const available = isStorageAvailable();

type StorageSchema = {
  [STORAGE_KEYS.MESSAGES]: PersistedState['messages'];
  [STORAGE_KEYS.WORKSPACE]: PersistedState['workspace'];
  [STORAGE_KEYS.INTENT_HISTORY]: PersistedState['intentHistory'];
  [STORAGE_KEYS.COLLECTED_ANSWERS]: PersistedState['collectedAnswers'];
  [STORAGE_KEYS.LAST_PLAN]: PersistedState['lastPlan'];
  [STORAGE_KEYS.LAYERS]: PersistedState['layers'];
  [STORAGE_KEYS.SESSION_ID]: string;
};

function createStorage() {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function get<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null {
    if (!available) return null;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as StorageSchema[K];
    } catch {
      return null;
    }
  }

  function set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
    if (!available) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`[Storage] Error al guardar ${key}`);
    }
  }

  function setDebounced<K extends keyof StorageSchema>(key: K, value: StorageSchema[K], delay = 500): void {
    const existing = timers.get(key);
    if (existing) clearTimeout(existing);
    timers.set(key, setTimeout(() => set(key, value), delay));
  }

  function remove(key: keyof StorageSchema): void {
    if (!available) return;
    try {
      localStorage.removeItem(key);
    } catch { /* noop */ }
  }

  function clearAll(): void {
    if (!available) return;
    for (const k of Object.values(STORAGE_KEYS)) {
      try { localStorage.removeItem(k); } catch { /* noop */ }
    }
  }

  return { get, set, setDebounced, remove, clearAll, available };
}

export const storage = createStorage();
