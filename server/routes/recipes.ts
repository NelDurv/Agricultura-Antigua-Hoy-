import { Router } from 'express';
import { z } from 'zod';
import { RECETAS } from '../../src/data';

export const recipesRouter = Router();

const recipeQuerySchema = z.object({
  category: z.string().max(100).optional(),
});

recipesRouter.get('/', (req, res) => {
  const parsed = recipeQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Parámetros inválidos' });
    return;
  }
  const { category } = parsed.data;
  let items = RECETAS;
  if (category && category !== 'Todos') {
    items = items.filter((r) => r.categoria === category);
  }
  res.json({
    total: items.length,
    categories: [...new Set(RECETAS.map((r) => r.categoria))],
    items: items.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      descripcion: r.descripcion,
      tiempo: r.tiempo,
      categoria: r.categoria,
      ingredientes: r.ingredientes,
    })),
  });
});

recipesRouter.get('/:id', (req, res) => {
  const recipe = RECETAS.find((r) => r.id === req.params.id);
  if (!recipe) {
    res.status(404).json({ error: 'Not Found', message: `Receta "${req.params.id}" no encontrada` });
    return;
  }
  res.json(recipe);
});
