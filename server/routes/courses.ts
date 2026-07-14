import { Router } from 'express';
import { z } from 'zod';
import { COURSES } from '../../src/data';

export const coursesRouter = Router();

const courseQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

coursesRouter.get('/', (req, res) => {
  const parsed = courseQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Parámetros inválidos' });
    return;
  }
  const { page, limit } = parsed.data;
  const start = (page - 1) * limit;
  const items = COURSES.slice(start, start + limit);
  res.json({
    total: COURSES.length,
    page,
    limit,
    items: items.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      level: c.level,
      category: c.category,
      duration: c.duration,
      lessonsCount: c.lessonsCount,
      author: c.author,
      rating: c.rating,
      isPremium: c.isPremium,
    })),
  });
});

coursesRouter.get('/:id', (req, res) => {
  const course = COURSES.find((c) => c.id === req.params.id);
  if (!course) {
    res.status(404).json({ error: 'Not Found', message: `Curso "${req.params.id}" no encontrado` });
    return;
  }
  res.json(course);
});
