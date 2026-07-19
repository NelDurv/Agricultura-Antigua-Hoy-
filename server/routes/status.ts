import { Router } from 'express';

export const statusRouter = Router();

statusRouter.get('/status', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'Agricultura Antigua API',
    version: '1.0.0',
    inLanguage: 'es',
    endpoints: [
      { path: '/api/status', methods: ['GET'] },
      { path: '/api/courses', methods: ['GET'] },
      { path: '/api/courses/:id', methods: ['GET'] },
      { path: '/api/documents', methods: ['GET'] },
      { path: '/api/documents/:id', methods: ['GET'] },
      { path: '/api/recipes', methods: ['GET'] },
      { path: '/api/recipes/:id', methods: ['GET'] },
      { path: '/api/campus', methods: ['GET'] },
      { path: '/api/campus/:id', methods: ['GET'] },
      { path: '/api/glossary', methods: ['GET'] },
      { path: '/api/search?q=', methods: ['GET'] },
      { path: '/api/sitemap', methods: ['GET'] },
      { path: '/api/agrovoc', methods: ['GET'] },
      { path: '/api/agrovoc/:id', methods: ['GET'] },
      { path: '/api/agrovoc?resolve=', methods: ['GET'] },
      { path: '/api/ai-manifest', methods: ['GET'] },
      { path: '/api/recommend', methods: ['GET'] },
    ],
  });
});
