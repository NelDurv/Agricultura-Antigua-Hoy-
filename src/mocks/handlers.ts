import { http, HttpResponse } from 'msw';

export const handlers = [
  // Simula GET /api/cursos
  http.get('/api/cursos', () => {
    return HttpResponse.json([
      { id: 'suelo-vivo', title: 'Suelo Vivo', level: 'Principiante' },
      { id: 'biofertilizantes', title: 'Biofertilizantes', level: 'Intermedio' },
    ]);
  }),

  // Simula GET /api/biblioteca
  http.get('/api/biblioteca', () => {
    return HttpResponse.json([
      { id: 'ficha-compostaje', title: 'Compostaje Doméstico', category: 'Fichas Técnicas' },
    ]);
  }),

  // Simula POST /api/contacto
  http.post('/api/contacto', async () => {
    return HttpResponse.json({ success: true, message: 'Mensaje recibido' }, { status: 200 });
  }),

  // Simula error 500 para probar manejo de errores
  http.get('/api/error', () => {
    return new HttpResponse(null, { status: 500 });
  }),
];
