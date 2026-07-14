import { Router } from 'express';
import { z } from 'zod';
import { BIBLIOTECA } from '../../src/data';

export const documentsRouter = Router();

const docQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

documentsRouter.get('/', (req, res) => {
  const parsed = docQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Parámetros inválidos' });
    return;
  }
  const { page, limit } = parsed.data;
  const start = (page - 1) * limit;
  const items = BIBLIOTECA.slice(start, start + limit);
  res.json({
    total: BIBLIOTECA.length,
    page,
    limit,
    items: items.map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      subcategory: d.subcategory,
      difficulty: d.difficulty,
      author: d.author,
      date: d.date,
      tags: d.tags,
      description: d.description,
      downloads: d.downloads,
    })),
  });
});

documentsRouter.get('/:id', (req, res) => {
  const doc = BIBLIOTECA.find((d) => d.id === req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Not Found', message: `Documento "${req.params.id}" no encontrado` });
    return;
  }
  res.json(doc);
});
