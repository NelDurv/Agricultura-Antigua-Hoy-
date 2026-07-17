import { searchNodes } from '../knowledge/graph';
import type { KnowledgeType } from '../knowledge/types';
import type { Intent, Plan, Task } from './types';
import { COURSES32 } from '../../data';

let taskCounter = 0;

function getTaxonsForTopics(topics: string[]): string[] {
  const topicTaxonMap: Record<string, string[]> = {
    'hongos-beneficos': ['microbiologia', 'hongos', 'suelo-vivo'],
    'compostaje': ['compostaje', 'bokashi', 'suelo-vivo'],
    'bioinsumos': ['bioinsumos', 'recetas', 'caldos'],
    'suelo-vivo': ['suelo-vivo', 'nutricion-vegetal', 'microbiologia'],
    'control-plagas': ['control-plagas', 'bioinsumos'],
    'manejo-agua': ['riego', 'hidrologia', 'suelo-vivo'],
    'cambio-climatico': ['cambio-climatico', 'agricultura-regenerativa'],
    'fertilizacion': ['fertilizacion', 'nutricion-vegetal', 'suelo-vivo'],
    'semillas': ['semillas', 'cultivos', 'biodiversidad'],
    'certificacion': ['certificacion', 'ruta-profesional', 'cursos'],
    'comunidad': ['comunidad', 'foro', 'casos-exito'],
    'calculos': ['calculos', 'herramientas', 'recursos'],
  };

  const taxons: string[] = [];
  for (const topic of topics) {
    const mapped = topicTaxonMap[topic];
    if (mapped) taxons.push(...mapped);
  }
  return [...new Set(taxons)];
}

function buildKnowledgeTasks(intent: Intent): Task[] {
  const tasks: Task[] = [];
  const results = searchNodes(intent.query);

  if (results.length > 0) {
    const top = results.slice(0, 5);
    const best = top[0];
    const inCourses32 = COURSES32.some(c => c.id === best.id);
    const isCourseType = (best.type === 'course' || best.taxons.some(t => t.includes('curso'))) && inCourses32;
    const isDocType = best.taxons.includes('biblioteca');
    const isRecipeType = best.type === 'recipe';

    // Always show content from best match
    tasks.push({
      id: `task-${++taskCounter}`,
      type: 'show-content',
      label: `Mostrar "${best.title}"`,
      target: best.id,
      params: { source: 'knowledge-graph' },
    });

    // Add panel for best match
    if (isCourseType) {
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'open-panel',
        label: `Abrir curso: ${best.title}`,
        target: best.id,
        params: { panelType: 'course', resourceId: best.id },
      });
    } else if (isRecipeType) {
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'open-panel',
        label: `Abrir receta: ${best.title}`,
        target: best.id,
        params: { panelType: 'recipe', resourceId: best.id },
      });
    } else if (best.type === 'glossary' || best.taxons.some(t => t === 'glosario')) {
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'open-panel',
        label: `Abrir glosario: ${best.title}`,
        target: best.id,
        params: { panelType: 'glossary', resourceId: best.id },
      });
    } else if (isDocType) {
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'filter-view',
        label: `Filtrar biblioteca: ${intent.query}`,
        target: 'biblioteca',
        params: { search: intent.query, viewAction: 'biblioteca-filter' },
      });
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'open-panel',
        label: `Abrir documento: ${best.title}`,
        target: best.id,
        params: { panelType: 'document', resourceId: best.id },
      });
    } else {
      const docTypes: KnowledgeType[] = ['article', 'manual', 'guide', 'protocol', 'infographic'];
      const panelType = docTypes.includes(best.type) ? 'document' : 'glossary';
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'open-panel',
        label: `Abrir: ${best.title}`,
        target: best.id,
        params: { panelType, resourceId: best.id },
      });
    }

    // Add related suggestions
    if (top.length > 1) {
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'suggest',
        label: `Sugerir contenido relacionado (${top.length - 1} más)`,
        params: { relatedIds: top.slice(1).map(r => r.id).join(',') },
      });
    }
  } else {
    tasks.push({
      id: `task-${++taskCounter}`,
      type: 'suggest',
      label: 'Sugerir explorar por categorías',
      params: { fallback: 'true' },
    });
  }

  return tasks;
}

export function createPlan(intent: Intent): Plan {
  const tasks: Task[] = [];

  // 0. Handle vague queries — ask clarification first (max 3 rounds), skip content
  if (intent.vague && intent.clarificationQuestions && intent.clarificationQuestions.length > 0) {
    const maxQuestions = intent.clarificationQuestions.slice(0, 3);
    for (const q of maxQuestions) {
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'ask-clarification',
        label: q.question.slice(0, 50),
        target: q.field,
        params: {
          questionId: q.id,
          field: q.field,
          question: q.question,
          options: (q.options || []).join('|'),
        },
      });
    }

    return {
      intent,
      tasks,
      reasoning: `Consulta vaga detectada. Se necesitan ${tasks.length} aclaraciones antes de buscar contenido.`,
    };
  }

  // 1. Navigate/filter based on intent
  const intentRouteMap: Record<string, string> = {
    learn: '/campus',
    apply: '/recursos',
    investigate: '/biblioteca',
    compare: '/recursos',
    calculate: '/recursos',
    explore: '/',
  };

  if (intent.type !== 'unknown') {
    const route = intentRouteMap[intent.type] || '/';
    tasks.push({
      id: `task-${++taskCounter}`,
      type: intent.topics.length > 0 ? 'filter-view' : 'navigate',
      label: intent.topics.length > 0
        ? `Filtrar ${intent.type} en ${route}`
        : `Navegar a ${route}`,
      target: route,
      params: intent.topics.length > 0
        ? { viewAction: `${intent.type}-filter`, search: intent.query }
        : { route },
    });
  }

  // 2. Knowledge tasks
  const knowledgeTasks = buildKnowledgeTasks(intent);
  tasks.push(...knowledgeTasks);

  // 3. Intent-specific tasks — include tasks for all sub-intents if compound
  const targetIntents = intent.isCompound && intent.subIntents
    ? intent.subIntents.map(s => s.type)
    : [intent.type];

  for (const it of [...new Set(targetIntents)]) {
    if (it === 'learn' && intent.topics.length > 0) {
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'suggest',
        label: 'Sugerir glosario relacionado',
        params: { widgetType: 'glossary', topics: intent.topics.join(',') },
      });
    }
    if (it === 'apply' || it === 'calculate') {
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'run-tool',
        label: 'Abrir calculadora',
        params: { tool: 'calculator' },
      });
    }
    if (it === 'investigate' && intent.topics.length > 0) {
      tasks.push({
        id: `task-${++taskCounter}`,
        type: 'suggest',
        label: 'Mostrar contenido relacionado en el grafo',
        params: { widgetType: 'related', topics: intent.topics.join(',') },
      });
    }
    // For compound intents, add extra open-panel for non-primary types
    if (intent.isCompound && it !== intent.type) {
      const routeMap: Record<string, string> = { learn: '/campus', apply: '/recursos', investigate: '/biblioteca' };
      const extraRoute = routeMap[it];
      if (extraRoute) {
        tasks.push({
          id: `task-${++taskCounter}`,
          type: 'open-panel',
          label: `Contenido relacionado: ${it}`,
          target: extraRoute,
          params: { panelType: it === 'learn' ? 'course' : it === 'apply' ? 'recipe' : 'document', search: intent.query },
        });
      }
    }
  }

  const compoundNote = intent.isCompound
    ? ` (compuesto: ${intent.subIntents?.map(s => s.type).join(', ')})`
    : `, contexto usado: ${intent.contextUsed ? 'sí' : 'no'}`;

  return {
    intent,
    tasks,
    reasoning: `Intención: ${intent.type}${compoundNote}. Temas: ${intent.topics.join(', ') || 'ninguno'}. Tareas generadas: ${tasks.length}.`,
  };
}
