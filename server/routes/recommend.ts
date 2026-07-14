import { Router } from 'express';
import { COURSES, BIBLIOTECA, RECETAS, COURSES32 } from '../../src/data';
import { resolveAgrovocTags, getAgrovocById, AGROVOC_CONCEPTS } from '../../src/core/seo/agrovoc';

export const recommendRouter = Router();

recommendRouter.get('/', (req, res) => {
  const topic = (req.query.topic as string || '').trim().toLowerCase();
  const type = (req.query.type as string || '').trim();
  const limit = Math.min(10, Math.max(1, parseInt(req.query.limit as string) || 5));

  if (!topic && !type) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Se requiere al menos "topic" (ej: compost) o "type" (course|document|recipe|campus).',
      example: '/api/recommend?topic=compost&limit=3',
    });
    return;
  }

  let results: { type: string; id: string; title: string; description: string; relevance: string }[] = [];

  if (topic) {
    // Use AGROVOC resolver to find relevant concepts
    const agrovocIds = resolveAgrovocTags(topic);
    const agrovocLabels = agrovocIds
      .map((id) => getAgrovocById(id))
      .filter(Boolean)
      .map((c) => [c!.label.toLowerCase(), c!.labelEs.toLowerCase()])
      .flat();

    // Score content by term overlap
    const terms = [...topic.split(/\s+/), ...agrovocLabels].filter((t) => t.length > 2);

    const scoreContent = (text: string): number => {
      const lower = text.toLowerCase();
      let s = 0;
      for (const t of terms) {
        if (lower.includes(t)) s += terms.length - terms.indexOf(t) + 1;
      }
      return s;
    };

    for (const c of COURSES) {
      const s = scoreContent(c.title + ' ' + c.description + ' ' + c.category);
      if (s > 0) results.push({ type: 'course', id: c.id, title: c.title, description: c.description, relevance: 'alta' });
    }
    for (const d of BIBLIOTECA) {
      const s = scoreContent(d.title + ' ' + d.description + ' ' + d.tags.join(' '));
      if (s > 0) results.push({ type: 'document', id: d.id, title: d.title, description: d.description, relevance: 'alta' });
    }
    for (const r of RECETAS) {
      const s = scoreContent(r.titulo + ' ' + r.descripcion + ' ' + r.ingredientes.join(' '));
      if (s > 0) results.push({ type: 'recipe', id: r.id, title: r.titulo, description: r.descripcion, relevance: 'alta' });
    }
    for (const c of COURSES32) {
      const s = scoreContent(c.title + ' ' + c.objective);
      if (s > 0) results.push({ type: 'campus', id: c.id, title: c.title, description: c.objective, relevance: 'alta' });
    }

    results.sort((a, b) => b.relevance.localeCompare(a.relevance));
  } else {
    // Filter by type only
    const validTypes = ['course', 'document', 'recipe', 'campus'] as const;
    if (!validTypes.includes(type as any)) {
      res.status(400).json({ error: 'Bad Request', message: `Tipo inválido. Usa: ${validTypes.join(', ')}` });
      return;
    }
    const pool = type === 'course' ? COURSES.map((c) => ({ type: 'course' as const, id: c.id, title: c.title, description: c.description }))
      : type === 'document' ? BIBLIOTECA.map((d) => ({ type: 'document' as const, id: d.id, title: d.title, description: d.description }))
      : type === 'recipe' ? RECETAS.map((r) => ({ type: 'recipe' as const, id: r.id, title: r.titulo, description: r.descripcion }))
      : COURSES32.map((c) => ({ type: 'campus' as const, id: c.id, title: c.title, description: c.objective }));
    results = pool.map((item) => ({ ...item, relevance: 'media' }));
  }

  res.json({
    query: { topic, type },
    total: results.length,
    limit,
    items: results.slice(0, limit).map((r) => ({
      type: r.type,
      id: r.id,
      title: r.title,
      description: r.description,
      url: `https://agriculturaantigua.com/${r.type === 'campus' ? 'campus' : r.type === 'course' ? 'academia' : r.type === 'document' ? 'biblioteca' : 'recursos'}/${r.id}`,
      relevance: r.relevance,
    })),
  });
});
