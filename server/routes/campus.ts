import { Router } from 'express';
import { COURSES32 } from '../../src/data';

export const campusRouter = Router();

campusRouter.get('/', (_req, res) => {
  res.json({
    total: COURSES32.length,
    items: COURSES32.map((c) => ({
      id: c.id,
      number: c.number,
      title: c.title,
      objective: c.objective,
      practicalTestsCount: c.practicalTests.length,
      hasStudyContent: Boolean(c.studyContent && c.studyContent.length > 0),
      hasFarmerNote: Boolean(c.farmerNote),
    })),
  });
});

campusRouter.get('/:id', (req, res) => {
  const course = COURSES32.find((c) => c.id === req.params.id);
  if (!course) {
    res.status(404).json({ error: 'Not Found', message: `Curso campus "${req.params.id}" no encontrado` });
    return;
  }
  res.json(course);
});
