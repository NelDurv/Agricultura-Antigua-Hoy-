export interface BibliotecaDoc {
  id: string;
  title: string;
  category: 'Artículos' | 'Manuales' | 'Fichas Técnicas' | 'Protocolos' | 'Guías' | 'Infografías';
  subcategory: string;
  difficulty: 'Bajo' | 'Medio' | 'Alto';
  cultivo: string;
  author: string;
  date: string;
  version: string;
  licencia: string;
  tags: string[];
  description: string;
  fullText: string;
  downloads: number;
  relatedCourses: string[];
  sources: string[];
}
