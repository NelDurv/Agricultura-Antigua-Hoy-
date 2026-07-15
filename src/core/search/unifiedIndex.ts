import type { KnowledgeType, KnowledgeNode } from '../knowledge/types';
import { COURSES, BIBLIOTECA, RECETAS, GLOSARIO, PILARES, MITOS, CASOS_EXITO, NUMEROS_CLAVE, SUBTEMAS, COMMUNITY_POSTS, COURSES32 } from '../../data';
import type { Pilar, Mito, SubtemaDetalle } from '../../types';

// ───────────────────────────────────────
// Normalized entry — used by both graph + search
// ───────────────────────────────────────

export interface NormalizedEntry {
  id: string;
  type: KnowledgeType;
  title: string;
  description: string;
  fullText: string;
  tags: string[];
  keywords: string[];
  relatedTo: string[];
  taxons: string[];
  category: string;
  subcategory?: string;
  difficulty?: string;
}

const typeMap: Record<string, KnowledgeType> = {
  'Artículos': 'article',
  'Manuales': 'manual',
  'Fichas Técnicas': 'guide',
  'Protocolos': 'protocol',
  'Guías': 'guide',
  'Infografías': 'infographic',
};

const STOP_WORDS = new Set([
  'que', 'del', 'las', 'los', 'con', 'para', 'como', 'una', 'más',
  'este', 'esta', 'entre', 'sobre', 'tiene', 'hasta', 'todo', 'pero',
  'muy', 'cómo', 'qué', 'por', 'puede', 'debe', 'hace', 'hacer',
  'cuál', 'eres', 'sabes', 'dime', 'quiero', 'necesito', 'ayuda',
  'hola', 'gracias', 'bueno', 'buena', 'son', 'sus', 'han', 'era',
]);

const TECH_TERMS = [
  'agua', 'azufre', 'cal', 'melaza', 'microorganismos', 'estiércol', 'compost',
  'caldo', 'sulfocálcico', 'biodinámica', 'silicio', 'ORP', 'IASS', 'MPASi',
  'biosilicificación', 'quelatación', 'glomalina', 'rH', 'CICE', 'humus',
  'lombriz', 'bokashi', 'micorrizas', 'trichoderma', 'bacillus', 'fosforita',
  'roca', 'mineral', 'suelo', 'abono', 'fermentado', 'bioinsumos', 'ceniza',
  'fotosíntesis', 'clorofila', 'nitrógeno', 'fósforo', 'potasio', 'calcio',
  'magnesio', 'azufre', 'hierro', 'zinc', 'manganeso', 'boro', 'molibdeno',
  'estomas', 'cutícula', 'radicular', 'rizosfera', 'micelio', 'esporas',
  'inóculo', 'aeróbico', 'anaeróbico', 'pH', 'conductividad', 'humedad',
];

function tokenize(text: string): string[] {
  const raw = text.toLowerCase().replace(/[^a-záéíóúñü0-9\s]/g, ' ').split(/\s+/);
  return [...new Set(raw.filter(w => w.length > 2 && !STOP_WORDS.has(w)))];
}

/** Extract meaningful keywords from text, prioritizing technical terms */
function extractKeywords(...texts: string[]): string[] {
  const all = texts.join(' ').toLowerCase();
  const tokens = tokenize(all);
  // Technical terms first, then other tokens
  const tech = tokens.filter(t => TECH_TERMS.some(term => term.includes(t) || t.includes(term)));
  const other = tokens.filter(t => !tech.includes(t));
  return [...new Set([...tech, ...other])].slice(0, 15);
}

// ───────────────────────────────────────
// Normalizers
// ───────────────────────────────────────

function normalizeCourses(entries: NormalizedEntry[]) {
  for (const c of COURSES) {
    const fullText = [c.description, ...(c.modules?.map(m => m.title + ' ' + m.content) || [])].join('\n');
    entries.push({
      id: c.id,
      type: 'course',
      title: c.title,
      description: c.description,
      fullText,
      tags: [c.category, c.level, ...c.title.toLowerCase().split(' ').slice(0, 5)],
      keywords: extractKeywords(c.title, c.description, ...(c.modules?.map(m => m.title + ' ' + m.content) || [])),
      relatedTo: [],
      taxons: ['cursos', c.category],
      category: 'cursos',
      subcategory: c.category,
      difficulty: c.level,
    });
  }

  for (const c32 of COURSES32) {
    const qTexts = c32.questions.map(q => q.q).join(' ');
    const testTexts = c32.practicalTests?.join(' ') || '';
    const studyText = c32.studyContent?.join(' ') || '';
    const fullText = [c32.objective, qTexts, testTexts, studyText].join('\n');
    entries.push({
      id: c32.id,
      type: 'course',
      title: c32.title,
      description: c32.objective,
      fullText,
      tags: tokenize(c32.title).slice(0, 5),
      keywords: extractKeywords(c32.title, c32.objective, qTexts, testTexts, studyText),
      relatedTo: [],
      taxons: ['cursos', 'cursos32'],
      category: 'cursos',
      subcategory: 'curso',
    });
  }
}

function normalizeBiblioteca(entries: NormalizedEntry[]) {
  for (const d of BIBLIOTECA) {
    entries.push({
      id: d.id,
      type: typeMap[d.category] || 'article',
      title: d.title,
      description: d.description,
      fullText: d.fullText,
      tags: d.tags,
      keywords: extractKeywords(d.title, d.description, d.fullText, ...(d.sources || [])),
      relatedTo: d.relatedCourses,
      taxons: ['biblioteca', d.category],
      category: d.category,
      subcategory: d.subcategory,
      difficulty: d.difficulty,
    });
  }
}

function normalizeRecetas(entries: NormalizedEntry[]) {
  for (const r of RECETAS) {
    const ingredientText = r.ingredientes.join(' ');
    const pasoText = r.pasos.join(' ');
    const fullText = [r.descripcion, ingredientText, pasoText].join('\n');
    entries.push({
      id: r.id,
      type: 'recipe',
      title: r.titulo,
      description: r.descripcion,
      fullText,
      tags: [r.categoria, r.tiempo, ...ingredientText.split(' ').slice(0, 8)],
      keywords: extractKeywords(r.titulo, r.descripcion, ingredientText),
      relatedTo: [],
      taxons: ['recursos', 'recetas', r.categoria],
      category: 'recetas',
      subcategory: r.categoria,
      difficulty: r.tiempo.includes('hora') ? 'Bajo' : r.tiempo.includes('día') ? 'Medio' : undefined,
    });
  }
}

function normalizeGlosario(entries: NormalizedEntry[]) {
  for (const g of GLOSARIO) {
    entries.push({
      id: `glosario-${g.termino}`,
      type: 'glossary',
      title: g.termino,
      description: g.definicion,
      fullText: g.definicion,
      tags: [g.termino, ...tokenize(g.definicion).slice(0, 6)],
      keywords: extractKeywords(g.termino, g.definicion),
      relatedTo: [],
      taxons: ['recursos', 'glosario'],
      category: 'glosario',
    });
  }
}

function normalizePilares(entries: NormalizedEntry[]) {
  for (const p of PILARES) {
    entries.push({
      id: `pilar-${p.id}`,
      type: 'research',
      title: p.titulo,
      description: p.descripcion,
      fullText: `${p.titulo}: ${p.descripcion}`,
      tags: p.temas.slice(0, 8),
      keywords: extractKeywords(p.titulo, p.descripcion, ...(p.temas || [])),
      relatedTo: [],
      taxons: ['inicio', 'pilares', p.id],
      category: 'pilares',
    });
  }
}

function normalizeMitos(entries: NormalizedEntry[]) {
  for (const m of MITOS) {
    const fullText = `${m.mito}\nRealidad: ${m.realidad}\nEvidencia: ${m.evidencia}\nAcción: ${m.accion}`;
    entries.push({
      id: m.id,
      type: 'research',
      title: m.titulo,
      description: m.realidad,
      fullText,
      tags: tokenize(m.titulo).slice(0, 4).concat(tokenize(m.realidad).slice(0, 4)),
      keywords: extractKeywords(m.titulo, m.realidad, m.evidencia, m.accion),
      relatedTo: [],
      taxons: ['inicio', 'mitos', m.id],
      category: 'mitos',
    });
  }
}

function normalizeCasosExito(entries: NormalizedEntry[]) {
  for (const ce of CASOS_EXITO) {
    const resultText = Array.isArray(ce.resultados) ? ce.resultados.join(' ') : '';
    entries.push({
      id: `caso-${ce.id}`,
      type: 'research',
      title: ce.titulo,
      description: ce.descripcion,
      fullText: `${ce.descripcion}\nResultados: ${resultText}`,
      tags: [ce.cultivo, ce.ubicacion, ...tokenize(ce.descripcion).slice(0, 4)],
      keywords: extractKeywords(ce.titulo, ce.descripcion, resultText, ce.cultivo),
      relatedTo: [],
      taxons: ['inicio', 'casos_exito', ce.cultivo.toLowerCase()],
      category: 'casos_exito',
    });
  }
}

function normalizeNumerosClave(entries: NormalizedEntry[]) {
  for (const nc of NUMEROS_CLAVE) {
    entries.push({
      id: `numero-${nc.label.slice(0, 30)}`,
      type: 'statistic',
      title: nc.valor,
      description: nc.label,
      fullText: nc.label,
      tags: tokenize(nc.label),
      keywords: extractKeywords(nc.label, nc.valor),
      relatedTo: [],
      taxons: ['inicio', 'numeros_clave'],
      category: 'numeros_clave',
    });
  }
}

function normalizeSubtemas(entries: NormalizedEntry[]) {
  for (const [key, st] of Object.entries(SUBTEMAS)) {
    const subTagText = (st.subtemas || []).join(' ');
    entries.push({
      id: `subtema-${key.slice(0, 40)}`,
      type: 'article',
      title: key,
      description: st.descripcion,
      fullText: `${st.descripcion} ${subTagText}`,
      tags: (st.subtemas || []).slice(0, 6).concat(tokenize(key).slice(0, 3)),
      keywords: extractKeywords(key, st.descripcion, subTagText),
      relatedTo: [],
      taxons: ['inicio', 'subtemas'],
      category: 'subtemas',
    });
  }
}

function normalizeComunidad(entries: NormalizedEntry[]) {
  for (const post of COMMUNITY_POSTS) {
    entries.push({
      id: post.id,
      type: 'news',
      title: post.title,
      description: post.content.slice(0, 200),
      fullText: post.content,
      tags: [post.category, ...tokenize(post.title).slice(0, 5)],
      keywords: extractKeywords(post.title, post.content),
      relatedTo: [],
      taxons: ['comunidad', post.category.toLowerCase()],
      category: 'comunidad',
    });
  }
}

// ───────────────────────────────────────
// Build unified index
// ───────────────────────────────────────

let _entries: NormalizedEntry[] | null = null;

export function buildUnifiedIndex(): NormalizedEntry[] {
  if (_entries) return _entries;
  const entries: NormalizedEntry[] = [];
  normalizeCourses(entries);
  normalizeBiblioteca(entries);
  normalizeRecetas(entries);
  normalizeGlosario(entries);
  normalizePilares(entries);
  normalizeMitos(entries);
  normalizeCasosExito(entries);
  normalizeNumerosClave(entries);
  normalizeSubtemas(entries);
  normalizeComunidad(entries);
  _entries = entries;
  return entries;
}

// ───────────────────────────────────────
// Build KnowledgeNodes from unified index
// ───────────────────────────────────────

export function entriesToNodes(entries: NormalizedEntry[]): KnowledgeNode[] {
  return entries.map(e => ({
    id: e.id,
    type: e.type,
    title: e.title,
    description: e.description,
    fullText: e.fullText,
    tags: e.tags,
    keywords: e.keywords,
    relatedTo: e.relatedTo,
    taxons: e.taxons,
    difficulty: e.difficulty as any,
  }));
}
