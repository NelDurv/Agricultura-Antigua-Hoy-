import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { searchChunks, getCollectionStats, generateAnswer } from '../rag';
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

ragRouter.post('/learn', async (req, res) => {
  const { question, answer, intent } = req.body || {};
  if (!question || !answer) {
    res.status(400).json({ error: 'Se requieren "question" y "answer"' });
    return;
  }

  try {
    const filePath = path.resolve(__dirname, '../../rag_data/auto-learned.json');
    let entries: { id: string; question: string; answer: string; intent?: string; timestamp: number }[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        entries = JSON.parse(raw);
      } catch { /* ignore */ }
    }

    const id = `auto-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    entries.push({ id, question, answer, intent: intent || 'qa', timestamp: Date.now() });
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf-8');

    res.json({
      status: 'ok',
      learnedId: id,
      totalLearned: entries.length,
      note: 'Use POST /api/rag/reindex to apply changes',
    });
  } catch (err) {
    console.error('[RAG] Learn error:', err);
    res.status(500).json({ error: 'Error al guardar aprendizaje' });
  }
});

// Rate limiting estricto para Gemini (evita agotar cuota de API)
const answerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas consultas al asistente. Espera un minuto antes de preguntar de nuevo.' },
});

ragRouter.get('/answer', answerLimiter, async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (!q) {
    res.status(400).json({ error: 'Parámetro "q" requerido' });
    return;
  }

  try {
    const result = await generateAnswer(q);
    res.json(result);
  } catch (err) {
    console.error('[RAG] Answer error:', err);
    res.status(500).json({ error: 'Error generando respuesta' });
  }
});
