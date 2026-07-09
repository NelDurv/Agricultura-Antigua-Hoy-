import '@testing-library/jest-dom';
import { server } from '../mocks/server';
import { beforeAll, afterAll, afterEach } from 'vitest';

// MSW: intercepta peticiones HTTP en los tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// localStorage no se inicializa correctamente en jsdom + vitest en Windows.
// Forzamos una implementacion polifill.
const store: Record<string, string> = {};
const localStorageMock: Storage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = String(value); },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  get length() { return Object.keys(store).length; },
  key: (index: number) => Object.keys(store)[index] ?? null,
};

window.scrollTo = () => {};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});
