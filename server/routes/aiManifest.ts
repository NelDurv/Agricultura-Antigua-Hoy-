import { Router } from 'express';
import { COURSES, BIBLIOTECA, RECETAS, COURSES32, GLOSARIO } from '../../src/data';
import { AGROVOC_CONCEPTS } from '../../src/core/seo/agrovoc';

export const aiManifestRouter = Router();

aiManifestRouter.get('/', (_req, res) => {
  res.json({
    site: {
      name: 'Agricultura Antigua — Campus Agroecológico',
      description: 'Campus digital y base de conocimientos de agricultura sostenible para pequeños productores y capacitadores.',
      language: 'es',
      url: 'https://agriculturaantigua.com',
      license: 'Creative Commons BY-NC-SA 4.0',
      agrovocVocabulary: AGROVOC_CONCEPTS.map((c) => c.uri),
    },
    sections: {
      courses: COURSES.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        level: c.level,
        category: c.category,
        duration: c.duration,
        modules: c.modules.map((m) => ({ id: m.id, title: m.title, type: m.type, duration: m.duration })),
      })),
      campus: COURSES32.map((c) => ({
        id: c.id,
        number: c.number,
        title: c.title,
        objective: c.objective,
      })),
      documents: BIBLIOTECA.map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        tags: d.tags,
        description: d.description,
      })),
      recipes: RECETAS.map((r) => ({
        id: r.id,
        titulo: r.titulo,
        descripcion: r.descripcion,
        categoria: r.categoria,
        tiempo: r.tiempo,
        ingredientes: r.ingredientes,
        pasos: r.pasos,
      })),
      glossary: GLOSARIO,
    },
    totalItems: COURSES.length + COURSES32.length + BIBLIOTECA.length + RECETAS.length + GLOSARIO.length,
  });
});
