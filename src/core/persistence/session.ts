import { storage, STORAGE_KEYS } from './storage';

export interface SessionInfo {
  id: string;
  startedAt: number;
  lastActivityAt: number;
  messageCount: number;
}

function generateId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `sess_${ts}_${rand}`;
}

function readSessionInfo(): SessionInfo | null {
  const raw = storage.get(STORAGE_KEYS.SESSION_ID);
  if (!raw) return null;
  try { return JSON.parse(raw) as SessionInfo; } catch { return null; }
}

function writeSessionInfo(info: SessionInfo): void {
  storage.set(STORAGE_KEYS.SESSION_ID, JSON.stringify(info));
}

export function getSessionId(): string {
  let info = readSessionInfo();
  if (!info) {
    info = { id: generateId(), startedAt: Date.now(), lastActivityAt: Date.now(), messageCount: 0 };
    writeSessionInfo(info);
  }
  return info.id;
}

export function createSessionId(): string {
  const info: SessionInfo = { id: generateId(), startedAt: Date.now(), lastActivityAt: Date.now(), messageCount: 0 };
  writeSessionInfo(info);
  return info.id;
}

export function touchSession(): void {
  const info = readSessionInfo();
  if (info) {
    info.lastActivityAt = Date.now();
    info.messageCount += 1;
    writeSessionInfo(info);
  }
}

export function getSessionInfo(): SessionInfo | null {
  return readSessionInfo();
}
