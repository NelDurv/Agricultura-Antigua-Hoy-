import { storage, STORAGE_KEYS } from '../persistence/storage';

export type FeedbackRating = 'good' | 'bad';

export interface FeedbackEntry {
  messageId: string;
  query: string;
  intentType: string;
  rating: FeedbackRating;
  timestamp: number;
}

const FEEDBACK_KEY = 'aa_feedback';

function getAll(): FeedbackEntry[] {
  return storage.get(FEEDBACK_KEY as any) || [];
}

function saveAll(entries: FeedbackEntry[]): void {
  storage.set(FEEDBACK_KEY as any, entries);
}

export function submitFeedback(entry: FeedbackEntry): void {
  const all = getAll();
  const existing = all.findIndex((e) => e.messageId === entry.messageId);
  if (existing >= 0) {
    all[existing] = entry;
  } else {
    all.push(entry);
  }
  saveAll(all);
}

export function getFeedbackStats(): {
  total: number;
  good: number;
  bad: number;
  ratio: number;
  topIntents: { intent: string; good: number; bad: number }[];
} {
  const all = getAll();
  const good = all.filter((e) => e.rating === 'good').length;
  const bad = all.filter((e) => e.rating === 'bad').length;

  const intentMap = new Map<string, { good: number; bad: number }>();
  for (const e of all) {
    const entry = intentMap.get(e.intentType) || { good: 0, bad: 0 };
    entry[e.rating === 'good' ? 'good' : 'bad']++;
    intentMap.set(e.intentType, entry);
  }

  return {
    total: all.length,
    good,
    bad,
    ratio: all.length > 0 ? good / all.length : 0,
    topIntents: Array.from(intentMap.entries())
      .map(([intent, v]) => ({ intent, ...v }))
      .sort((a, b) => b.good - a.good),
  };
}
