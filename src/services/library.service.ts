import type { BibliotecaDoc } from '../types';
import { BIBLIOTECA } from '../data';

let _cache: BibliotecaDoc[] | null = null;

export function getAllDocuments(): BibliotecaDoc[] {
  if (_cache) return _cache;
  _cache = BIBLIOTECA as BibliotecaDoc[];
  return _cache;
}

export function getDocumentById(id: string): BibliotecaDoc | undefined {
  return getAllDocuments().find((d) => d.id === id);
}

export function getDocumentsByCategory(category: string): BibliotecaDoc[] {
  return getAllDocuments().filter((d) => d.category === category);
}

export function searchDocuments(query: string): BibliotecaDoc[] {
  const q = query.toLowerCase();
  return getAllDocuments().filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q)),
  );
}
