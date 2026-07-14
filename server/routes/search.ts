import { Router } from 'express';
import { z } from 'zod';
import { COURSES, BIBLIOTECA, RECETAS, COURSES32, GLOSARIO } from '../../src/data';

export const searchRouter = Router();

const searchSchema = z.object({
  q: z.string().min(1).max(200).transform(s => s.trim()),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// Cache simple de resultados (TTL: 5 min, max 200 entries)
const searchCache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;
const CACHE_MAX = 200;

function cacheSet(key: string, data: unknown): void {
  if (searchCache.size >= CACHE_MAX) {
    const oldest = [...searchCache.entries()].sort((a, b) => a[1].ts - b[1].ts)[0];
    if (oldest) searchCache.delete(oldest[0]);
  }
  searchCache.set(key, { data, ts: Date.now() });
}

function score(text: string, query: string): number {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let s = 0;
  if (lower === q) s += 20;
  if (lower.startsWith(q)) s += 15;
  if (lower.includes(q)) s += 10;
  const words = q.split(/\s+/);
  for (const w of words) {
    if (w.length < 2) continue;
    if (lower.includes(w)) s += 5;
  }
  return s;
}

searchRouter.get('/', (req, res) => {
  const parsed = searchSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Parámetros inválidos', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { q, limit } = parsed.data;
  const cacheKey = `${q}:${limit}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    res.json(cached.data);
    return;
  }

  const results: { type: string; id: string; title: string; description: string; score: number }[] = [];

  for (const c of COURSES) {
    const s = score(c.title + ' ' + c.description, q);
    if (s > 0) results.push({ type: 'course', id: c.id, title: c.title, description: c.description, score: s + 10 });
  }

  for (const d of BIBLIOTECA) {
    const s = score(d.title + ' ' + d.description + ' ' + d.tags.join(' '), q);
    if (s > 0) results.push({ type: 'document', id: d.id, title: d.title, description: d.description, score: s + 5 });
  }

  for (const r of RECETAS) {
    const s = score(r.titulo + ' ' + r.descripcion + ' ' + r.ingredientes.join(' '), q);
    if (s > 0) results.push({ type: 'recipe', id: r.id, title: r.titulo, description: r.descripcion, score: s + 8 });
  }

  for (const c of COURSES32) {
    const s = score(c.title + ' ' + c.objective, q);
    if (s > 0) results.push({ type: 'campus', id: c.id, title: c.title, description: c.objective, score: s + 8 });
  }

  for (const g of GLOSARIO) {
    const s = score(g.termino + ' ' + g.definicion, q);
    if (s > 0) results.push({ type: 'glossary', id: g.termino, title: g.termino, description: g.definicion, score: s + 4 });
  }

  results.sort((a, b) => b.score - a.score);

  const data = { query: q, total: results.length, limit, items: results.slice(0, limit) };
  cacheSet(cacheKey, data);
  res.json(data);
});
