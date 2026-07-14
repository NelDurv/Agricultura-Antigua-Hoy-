import { Router } from 'express';
import { AGROVOC_CONCEPTS, resolveAgrovocTags } from '../../src/core/seo/agrovoc';

export const agrovocRouter = Router();

agrovocRouter.get('/', (req, res) => {
  const q = (req.query.q as string || '').toLowerCase();
  const resolveText = req.query.resolve as string;

  if (resolveText) {
    const ids = resolveAgrovocTags(resolveText);
    const terms = ids.map((id) => AGROVOC_CONCEPTS.find((c) => c.id === id)).filter(Boolean);
    res.json({ query: resolveText, matched: terms });
    return;
  }

  let items = AGROVOC_CONCEPTS;
  if (q) {
    items = items.filter(
      (c) => c.labelEs.includes(q) || c.label.includes(q) || c.id.includes(q),
    );
  }
  res.json({ total: items.length, items });
});

agrovocRouter.get('/:id', (req, res) => {
  const term = AGROVOC_CONCEPTS.find((c) => c.id === req.params.id);
  if (!term) {
    res.status(404).json({ error: 'Not Found', message: `Concepto AGROVOC "${req.params.id}" no encontrado` });
    return;
  }
  res.json(term);
});
