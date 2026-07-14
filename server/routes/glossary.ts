import { Router } from 'express';
import { z } from 'zod';
import { GLOSARIO } from '../../src/data';

export const glossaryRouter = Router();

const glossaryQuerySchema = z.object({
  q: z.string().max(200).optional(),
});

glossaryRouter.get('/', (req, res) => {
  const parsed = glossaryQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Parámetros inválidos' });
    return;
  }
  const search = (parsed.data.q || '').toLowerCase();
  let items = GLOSARIO;
  if (search) {
    items = items.filter(
      (g) => g.termino.toLowerCase().includes(search) || g.definicion.toLowerCase().includes(search)
    );
  }
  res.json({ total: items.length, items });
});
