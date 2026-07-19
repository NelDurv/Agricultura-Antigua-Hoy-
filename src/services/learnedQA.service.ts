import type { KnowledgeNode } from '../core/knowledge/types';
import { invalidateIndex } from '../core/search/unifiedIndex';
import { invalidateGraph } from '../core/knowledge/graph';

const STORAGE_KEY = 'aa_learned_qa';

function generateId(): string {
  return `learned-qa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getLearnedQAs(): KnowledgeNode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addLearnedQA(question: string, answer: string, intentType?: string): KnowledgeNode {
  const keywords = extractKeywords(question, answer);
  const tags = ['aprendido', 'qa'];
  if (intentType) tags.push(intentType);

  const qaNode: KnowledgeNode = {
    id: generateId(),
    type: 'article',
    title: question,
    description: answer.slice(0, 200),
    fullText: `${question}\n${answer}`,
    tags,
    keywords,
    relatedTo: [],
    taxons: ['aprendido', 'qa'],
  };

  const all = getLearnedQAs();
  all.push(qaNode);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  invalidateIndex();
  invalidateGraph();

  return qaNode;
}

function extractKeywords(question: string, answer: string): string[] {
  const text = `${question} ${answer}`.toLowerCase();
  const tokens = text.replace(/[^a-záéíóúñü0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([word]) => word);
}

export function removeLearnedQA(id: string): void {
  const all = getLearnedQAs().filter(n => n.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  invalidateIndex();
  invalidateGraph();
}

export function clearLearnedQAs(): void {
  localStorage.removeItem(STORAGE_KEY);
  invalidateIndex();
  invalidateGraph();
}
