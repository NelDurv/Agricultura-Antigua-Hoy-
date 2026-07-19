import { Router } from 'express';
import { COURSES, BIBLIOTECA, RECETAS, COURSES32 } from '../../src/data';

export const sitemapRouter = Router();

sitemapRouter.get('/', (_req, res) => {
  res.json({
    generated: new Date().toISOString(),
    total: COURSES.length + BIBLIOTECA.length + RECETAS.length + COURSES32.length,
    items: [
      {
        section: 'courses',
        path: '/api/courses',
        count: COURSES.length,
        entries: COURSES.map((c) => ({ id: c.id, title: c.title, type: 'course' })),
      },
      {
        section: 'documents',
        path: '/api/documents',
        count: BIBLIOTECA.length,
        entries: BIBLIOTECA.map((d) => ({ id: d.id, title: d.title, type: 'document' })),
      },
      {
        section: 'recipes',
        path: '/api/recipes',
        count: RECETAS.length,
        entries: RECETAS.map((r) => ({ id: r.id, title: r.titulo, type: 'recipe' })),
      },
      {
        section: 'campus',
        path: '/api/campus',
        count: COURSES32.length,
        entries: COURSES32.map((c) => ({ id: c.id, title: c.title, type: 'campus' })),
      },
    ],
  });
});
