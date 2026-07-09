import type { KnowledgeNode, KnowledgeRelationship, KnowledgeGraph } from './types';
import { COURSES } from '../../data/courses/index';
import { BIBLIOTECA } from '../../data/biblioteca/index';
import { RECETAS, GLOSARIO } from '../../data/recursos/index';
import { PILARES, MITOS } from '../../data/home/index';
import type { Pilar, Mito } from '../../types';

const typeMap: Record<string, string> = {
  'Artículos': 'article',
  'Manuales': 'manual',
  'Fichas Técnicas': 'guide',
  'Protocolos': 'protocol',
  'Guías': 'guide',
  'Infografías': 'infographic',
};

function extractIngredientKeywords(ingredients: string[], knownTerms: string[]): string[] {
  const keywords: string[] = [];
  const stopWords = new Set(['de', 'la', 'el', 'en', 'del', 'con', 'sin', 'kg', 'l', 'g', 'ml']);
  for (const ing of ingredients) {
    for (const word of ing.toLowerCase().split(/[\s,]+/)) {
      const clean = word.replace(/^[\d.]+/, '').trim();
      if (clean.length > 3 && !stopWords.has(clean) && !/^\d/.test(clean)) {
        keywords.push(clean);
      }
    }
  }
  // Prioritize known technical terms
  const matched = keywords.filter(k => knownTerms.some(t => t.toLowerCase().includes(k)));
  return [...new Set([...matched, ...keywords.slice(0, 8)])];
}

const KNOWN_TERMS = [
  'agua', 'azufre', 'cal', 'melaza', 'microorganismos', 'estiércol', 'compost',
  'caldo', 'sulfocálcico', 'biodinámica', 'silicio', 'ORP', 'IASS', 'MPASi',
  'biosilicificación', 'quelatación', 'glomalina', 'rH', 'CICE', 'humus',
  'lombriz', 'bokashi', 'micorrizas', 'trichoderma', 'bacillus', 'fosforita',
  'roca', 'mineral', 'suelo', 'abono', 'fermentado', 'bioinsumos', 'ceniza',
];

function buildNodes(): KnowledgeNode[] {
  const nodes: KnowledgeNode[] = [];

  for (const c of COURSES) {
    nodes.push({
      id: c.id,
      type: 'course',
      title: c.title,
      description: c.description,
      tags: [c.category, c.level, ...c.title.toLowerCase().split(' ').slice(0, 5)],
      relatedTo: [],
      taxons: ['cursos', c.category],
      difficulty: c.level,
    });
  }

  for (const d of BIBLIOTECA) {
    nodes.push({
      id: d.id,
      type: (typeMap[d.category] || 'article') as any,
      title: d.title,
      description: d.description,
      tags: d.tags,
      relatedTo: d.relatedCourses,
      taxons: ['biblioteca', d.category],
      difficulty: d.difficulty,
    });
  }

  for (const r of RECETAS) {
    const ingredientTags = extractIngredientKeywords(r.ingredientes, KNOWN_TERMS);
    nodes.push({
      id: r.id,
      type: 'recipe',
      title: r.titulo,
      description: r.descripcion,
      tags: [r.categoria, r.tiempo, ...ingredientTags],
      relatedTo: [],
      taxons: ['recursos', 'recetas', r.categoria],
      difficulty: r.tiempo.includes('hora') ? 'Principiante' : r.tiempo.includes('día') ? 'Intermedio' : undefined,
    });
  }

  for (const g of GLOSARIO) {
    const defKeywords = g.definicion
      .toLowerCase()
      .replace(/[^a-záéíóúñü\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4 && !['para', 'como', 'una', 'del', 'las', 'los', 'con', 'mide', 'donde', 'este', 'esta', 'proceso', 'capacidad', 'producida'].includes(w))
      .slice(0, 5);
    nodes.push({
      id: `glosario-${g.termino}`,
      type: 'glossary',
      title: g.termino,
      description: g.definicion,
      tags: [g.termino, ...defKeywords],
      relatedTo: [],
      taxons: ['recursos', 'glosario'],
    });
  }

  for (const p of PILARES) {
    const textTags = p.descripcion
      .toLowerCase()
      .replace(/[^a-záéíóúñü\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 5 && !['para', 'como', 'una', 'del', 'las', 'los', 'con', 'que', 'más', 'este', 'esta', 'entre', 'sobre', 'tiene', 'hasta', 'todo', 'pero', 'muy'].includes(w))
      .slice(0, 4);
    nodes.push({
      id: `pilar-${p.id}`,
      type: 'research',
      title: p.titulo,
      description: p.descripcion,
      tags: [...p.temas.slice(0, 5), ...textTags],
      relatedTo: [],
      taxons: ['inicio', 'pilares', p.id],
    });
  }

  for (const m of MITOS) {
    const tags = [
      m.titulo.toLowerCase().split(' ').slice(0, 4),
      ...m.realidad.toLowerCase().split(' ').filter(w => ['suelo', 'planta', 'fertilizante', 'materia', 'orgánica', 'fotosíntesis', 'agua', 'oxígeno', 'energía', 'producción', 'pH', 'ORP', 'nitrógeno', 'carbono', 'microorganismos', 'raíces', 'cosecha', 'minerales'].includes(w.toLowerCase())),
    ].flat();
    nodes.push({
      id: m.id,
      type: 'research',
      title: m.titulo,
      description: m.realidad,
      tags: [...new Set(tags)].slice(0, 8),
      relatedTo: [],
      taxons: ['inicio', 'mitos', m.id],
    });
  }

  return nodes;
}

function buildEdges(nodes: KnowledgeNode[]): KnowledgeRelationship[] {
  const edges: KnowledgeRelationship[] = [];
  const tagIndex = new Map<string, string[]>();

  for (const n of nodes) {
    for (const tag of n.tags) {
      const key = tag.toLowerCase().trim();
      if (!tagIndex.has(key)) tagIndex.set(key, []);
      tagIndex.get(key)!.push(n.id);
    }
  }

  for (const n of nodes) {
    for (const relatedId of n.relatedTo) {
      if (nodes.some(other => other.id === relatedId)) {
        edges.push({ sourceId: n.id, targetId: relatedId, relation: 'related' });
      }
    }
  }

  for (const [, ids] of tagIndex) {
    if (ids.length < 2) continue;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const exists = edges.some(e =>
          (e.sourceId === ids[i] && e.targetId === ids[j]) ||
          (e.sourceId === ids[j] && e.targetId === ids[i])
        );
        if (!exists) {
          edges.push({ sourceId: ids[i], targetId: ids[j], relation: 'related' });
        }
      }
    }
  }

  return edges;
}

let _graph: KnowledgeGraph | null = null;

export function buildKnowledgeGraph(): KnowledgeGraph {
  if (_graph) return _graph;
  const nodes = buildNodes();
  const edges = buildEdges(nodes);
  _graph = { nodes, edges };
  return _graph;
}

export function getRelatedIds(id: string): string[] {
  const graph = buildKnowledgeGraph();
  const related = new Set<string>();
  for (const e of graph.edges) {
    if (e.sourceId === id) related.add(e.targetId);
    if (e.targetId === id) related.add(e.sourceId);
  }
  return Array.from(related);
}

export function getRelatedNodes(id: string): KnowledgeNode[] {
  const graph = buildKnowledgeGraph();
  const ids = getRelatedIds(id);
  return graph.nodes.filter(n => ids.includes(n.id));
}

export function getNode(id: string): KnowledgeNode | undefined {
  return buildKnowledgeGraph().nodes.find(n => n.id === id);
}

export function getNodesByType(type: string): KnowledgeNode[] {
  return buildKnowledgeGraph().nodes.filter(n => n.type === type);
}

export function searchNodes(query: string): KnowledgeNode[] {
  const q = query.toLowerCase();
  return buildKnowledgeGraph().nodes.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.description.toLowerCase().includes(q) ||
    n.tags.some(t => t.toLowerCase().includes(q)) ||
    n.taxons.some(t => t.toLowerCase().includes(q))
  );
}
