const PREFIX = 'agricultura-antigua-';

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    console.warn('localStorage write failed for', key);
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export function clear(): void {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
  keys.forEach((k) => localStorage.removeItem(k));
}
