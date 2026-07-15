import { Router } from 'express';
import { z } from 'zod';
import { searchChunks, getCollectionStats } from '../rag/chroma';
import { runIndexer } from '../rag/indexer';

export const ragRouter = Router();

const searchSchema = z.object({
  q: z.string().min(1).max(500).transform(s => s.trim()),
  topK: z.coerce.number().int().min(1).max(50).default(10),
  type: z.string().optional(),
  tags: z.string().optional(),
});

ragRouter.get('/search', async (req, res) => {
  const parsed = searchSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Parámetros inválidos', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { q, topK, type, tags } = parsed.data;
  const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined;

  try {
    const results = await searchChunks(q, topK, type, tagList);
    res.json({
      query: q,
      total: results.length,
      results: results.map(r => ({
        chunkId: r.chunkId,
        text: r.text.slice(0, 500),
        source: r.source,
        sourceType: r.sourceType,
        title: r.title,
        tags: r.tags,
        score: Math.round(r.score * 1000) / 1000,
      })),
    });
  } catch (err) {
    console.error('[RAG] Search error:', err);
    res.status(500).json({ error: 'Error en búsqueda RAG' });
  }
});

ragRouter.get('/status', async (_req, res) => {
  try {
    const stats = await getCollectionStats();
    res.json({
      status: 'ok',
      collection: stats.name,
      vectors: stats.count,
      ready: stats.count > 0,
    });
  } catch (err) {
    res.json({ status: 'error', message: String(err) });
  }
});

ragRouter.post('/reindex', async (_req, res) => {
  try {
    const result = await runIndexer();
    res.json({
      status: 'ok',
      chunks: result.chunks,
      indexed: result.indexed,
    });
  } catch (err) {
    console.error('[RAG] Reindex error:', err);
    res.status(500).json({ error: 'Error al reindexar' });
  }
});
