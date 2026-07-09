import { describe, it, expect, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

describe('Conectividad - API mockeada con MSW', () => {
  it('GET /api/cursos retorna lista de cursos', async () => {
    const res = await fetch('/api/cursos');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
  });

  it('GET /api/biblioteca retorna documentos', async () => {
    const res = await fetch('/api/biblioteca');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0]).toHaveProperty('category');
  });

  it('POST /api/contacto envia datos correctamente', async () => {
    const res = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', message: 'Hola' }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it('GET /api/error retorna 500 (manejo de errores)', async () => {
    const res = await fetch('/api/error');
    expect(res.status).toBe(500);
  });
});

describe('Conectividad - handlers personalizados por test', () => {
  afterEach(() => server.resetHandlers());

  it('puede sobrescribir un handler para un test especifico', async () => {
    server.use(
      http.get('/api/cursos', () => {
        return HttpResponse.json([{ id: 'test-only', title: 'Solo para este test' }]);
      }),
    );

    const res = await fetch('/api/cursos');
    const data = await res.json();
    expect(data[0].id).toBe('test-only');
  });

  it('el handler original sigue funcionando en otros tests', async () => {
    const res = await fetch('/api/cursos');
    const data = await res.json();
    expect(data[0].id).toBe('suelo-vivo');
  });

  it('simula timeout de red', async () => {
    server.use(
      http.get('/api/cursos', async () => {
        await new Promise(r => setTimeout(r, 2000));
        return HttpResponse.json([]);
      }),
    );

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 100);

    await expect(fetch('/api/cursos', { signal: controller.signal })).rejects.toThrow();
    clearTimeout(timeout);
  });
});
