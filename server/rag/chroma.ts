import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { RagChunk, RagSearchResult } from './types';
import { generateEmbedding } from './embeddings';

const PERSIST_DIR = join(process.cwd(), 'rag_data');
const INDEX_FILE = join(PERSIST_DIR, 'vectors.json');

interface StoredVector {
  id: string;
  embedding: number[];
  metadata: Record<string, string>;
  text: string;
}

let vectors: StoredVector[] = [];

function ensureDir() {
  if (!existsSync(PERSIST_DIR)) mkdirSync(PERSIST_DIR, { recursive: true });
}

function loadIndex(): void {
  ensureDir();
  if (existsSync(INDEX_FILE)) {
    try {
      vectors = JSON.parse(readFileSync(INDEX_FILE, 'utf-8'));
    } catch {
      vectors = [];
    }
  }
}

function saveIndex(): void {
  ensureDir();
  writeFileSync(INDEX_FILE, JSON.stringify(vectors), 'utf-8');
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

export async function indexChunks(chunks: RagChunk[]): Promise<number> {
  vectors = [];
  const batchSize = 50;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    for (const chunk of batch) {
      const embedding = await generateEmbedding(chunk.text);
      vectors.push({
        id: chunk.id,
        embedding,
        metadata: {
          source: chunk.source,
          sourceType: chunk.sourceType,
          title: chunk.title,
          tags: chunk.tags.join(','),
          ...chunk.metadata,
        },
        text: chunk.text,
      });
    }
  }

  saveIndex();
  return vectors.length;
}

export async function searchChunks(
  query: string,
  topK = 10,
  typeFilter?: string,
  tagFilter?: string[],
): Promise<RagSearchResult[]> {
  if (vectors.length === 0) loadIndex();
  if (vectors.length === 0) return [];

  const queryEmbedding = await generateEmbedding(query);

  const scored: { vec: StoredVector; score: number }[] = [];

  for (const vec of vectors) {
    if (typeFilter && vec.metadata.sourceType !== typeFilter) continue;
    if (tagFilter && tagFilter.length > 0) {
      const vecTags = (vec.metadata.tags || '').split(',').filter(Boolean);
      if (!tagFilter.some(t => vecTags.includes(t))) continue;
    }
    const score = cosineSimilarity(queryEmbedding, vec.embedding);
    scored.push({ vec, score });
  }

  scored.sort((a, b) => b.score - a.score);
  const MIN_SCORE_THRESHOLD = 0.5;
  const filtered = scored.filter(r => r.score >= MIN_SCORE_THRESHOLD);
  const top = filtered.slice(0, topK);

  return top.map(({ vec, score }) => ({
    chunkId: vec.id,
    text: vec.text,
    source: vec.metadata.source || '',
    sourceType: vec.metadata.sourceType || '',
    title: vec.metadata.title || '',
    tags: (vec.metadata.tags || '').split(',').filter(Boolean),
    metadata: vec.metadata,
    score,
  }));
}

export async function getCollectionStats(): Promise<{ count: number; name: string }> {
  if (vectors.length === 0) loadIndex();
  return { count: vectors.length, name: 'agricultura-antigua' };
}

loadIndex();
