import type { Plan, Task } from './types';
import type { KnowledgeNode } from '../knowledge/types';
import { searchNodes } from '../knowledge/graph';
import { capabilityRegistry } from './capabilities';
import { COURSES32 } from '../../data';

export interface ComposedResponse {
  content: string;
  suggestions: { label: string; action: string; icon?: string; payload?: Record<string, string> }[];
  viewAction?: { type: string; payload?: Record<string, string> };
  layers?: { id: string; type: 'side' | 'modal'; title: string; component: string; params: Record<string, string>; resourceId?: string }[];
}

let layerCounter = 0;

function extractAnswer(text: string, tokens: string[]): string {
  const lower = text.toLowerCase();
  const sentences = text.split(/(?<=\.)\s+/);
  const wantsCount = tokens.some(t => t.startsWith('cuant'));
  let bestSentence = '';
  let bestScore = 0;
  for (const s of sentences) {
    const sLow = s.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (sLow.includes(t)) score += t.length;
    }
    if (wantsCount && /\b\d+\b/.test(s)) score += 20;
    if (score > bestScore && s.length < 300) {
      bestScore = score;
      bestSentence = s.trim();
    }
  }
  return bestSentence || sentences.slice(0, 3).join(' ').slice(0, 300);
}

function buildContentFromPlan(plan: Plan, results: KnowledgeNode[], query: string): string {
  const top = results.slice(0, 5);

  if (top.length === 0) {
    return plan.intent.type !== 'unknown'
      ? `Entiendo que quieres **${plan.intent.type}** sobre "${query}". Explora las opciones disponibles.`
      : `No encontré resultados exactos para "${query}". Puedes explorar el contenido por categorías.`;
  }

  const best = top[0];
  const queryTokens = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const parts: string[] = [];

  // Intent-based intro
  const INTRO_MAP: Record<string, string> = {
    learn: `Te muestro el curso **${best.title}** para que aprendas sobre este tema.`,
    apply: `Aquí tienes la receta/guía **${best.title}** para aplicar en campo.`,
    investigate: `He encontrado información sobre **${best.title}**:`,
    compare: `Comparando opciones, el recurso más relevante es **${best.title}**:`,
    calculate: `Para tu cálculo, te recomiendo **${best.title}**:`,
    explore: `He encontrado **${best.title}** relacionado con tu consulta:`,
  };

  const intro = INTRO_MAP[plan.intent.type] || `Aquí tienes **${best.title}**:`;
  parts.push(intro);

  // Extract the most relevant sentence(s) from full text
  const fullText = best.fullText || best.description;
  const answer = extractAnswer(fullText, queryTokens);
  parts.push(answer);

  // Add related terms if available
  const relatedTerms = top.slice(1, 4).map(r => r.title).join(', ');
  if (top.length > 1 && top[1].title !== best.title) {
    parts.push(`También relacionado: ${relatedTerms}.`);
  }

  // Add plan reasoning if there are multiple tasks
  const panelTasks = plan.tasks.filter(t => t.type === 'open-panel');
  if (panelTasks.length > 0) {
    const label = panelTasks.length === 1 ? 'panel' : 'paneles';
    parts.push(`\nHe preparado ${panelTasks.length} ${label} en tu espacio de trabajo.`);
  }

  return parts.join('\n\n');
}

function buildSuggestionsFromPlan(plan: Plan, results: KnowledgeNode[]): { label: string; action: string; icon?: string; payload?: Record<string, string> }[] {
  const suggestions: { label: string; action: string; icon?: string; payload?: Record<string, string> }[] = [];

  // From knowledge graph results
  const top = results.slice(0, 4);
  for (const r of top) {
    const icon = r.type === 'course' ? '📚' : r.type === 'recipe' ? '🧪' : r.type === 'glossary' ? '📖' : '📄';
    suggestions.push({
      label: `Abrir "${r.title.slice(0, 28)}"`,
      action: 'layer',
      icon,
      payload: { resourceId: r.id },
    });
  }

  // From plan tasks
  const showContentTasks = plan.tasks.filter(t => t.type === 'show-content');
  for (const task of showContentTasks) {
    if (task.target && !top.find(r => r.id === task.target)) {
      suggestions.push({
        label: task.label.slice(0, 35),
        action: 'layer',
        icon: '📌',
        payload: { resourceId: task.target },
      });
    }
  }

  // "Nueva Pregunta" if enough results
  if (top.length > 1 || plan.tasks.length > 2) {
    suggestions.push({ label: '¿Nueva Pregunta?', action: 'preguntar', icon: '💬' });
  }

  return suggestions;
}

function buildViewAction(plan: Plan, query: string): { type: string; payload?: Record<string, string> } | undefined {
  // Find filter-view or navigate tasks
  const filterTask = plan.tasks.find(t => t.type === 'filter-view');
  if (filterTask?.params?.viewAction) {
    return { type: filterTask.params.viewAction, payload: { search: query } };
  }

  // If intent is biblioteca-related, dispatch biblioteca-filter
  if (plan.intent.type === 'investigate') {
    return { type: 'biblioteca-filter', payload: { search: query } };
  }

  return undefined;
}

function buildLayers(plan: Plan, results: KnowledgeNode[]): { id: string; type: 'side' | 'modal'; title: string; component: string; params: Record<string, string>; resourceId?: string }[] {
  const layers: any[] = [];
  const top = results.slice(0, 5);

  if (top.length === 0) return layers;

  const best = top[0];
  const bestType = best.type;
  const bestTaxon = best.taxons[0]?.toLowerCase() || '';

  // Map node to layer component
  let component: string;
  if ((bestType === 'course' || bestTaxon.includes('curso')) && COURSES32.some(c => c.id === best.id)) {
    component = 'course';
  } else if (bestType === 'recipe' || bestTaxon.includes('receta')) {
    component = 'recipe';
  } else if (bestTaxon.includes('biblioteca') || bestType === 'article' || bestType === 'manual' || bestType === 'guide') {
    component = 'document';
  } else {
    component = 'node';
  }

  layers.push({
    id: `layer-${++layerCounter}`,
    type: 'side' as const,
    title: best.title,
    component,
    params: {},
    resourceId: best.id,
  });

  return layers;
}

function buildClarificationResponse(plan: Plan): ComposedResponse {
  const clarTasks = plan.tasks.filter(t => t.type === 'ask-clarification');
  if (clarTasks.length === 0) return { content: '', suggestions: [] };

  // Show only the FIRST question with its options
  const first = clarTasks[0];
  const question = first.params?.question || first.label;
  const options = first.params?.options?.split('|') || [];
  const field = first.params?.field || '';

  const totalNeeded = clarTasks.length;
  const content = `Para darte una respuesta precisa, necesito más información:\n\n_${question}_\n\n*(Pregunta 1 de ${totalNeeded})*`;

  const suggestions = options.map(opt => ({
    label: opt,
    action: 'clarify',
    icon: '💬',
    payload: { field, value: opt },
  }));

  return { content, suggestions };
}

export function composeResponse(plan: Plan, query: string): ComposedResponse {
  // Handle clarification flow
  if (plan.tasks.some(t => t.type === 'ask-clarification')) {
    return buildClarificationResponse(plan);
  }

  // Try capability-based resolution first
  const matchingCaps = capabilityRegistry.search(plan.intent.type + ' ' + query);
  if (matchingCaps.length > 0) {
    const cap = matchingCaps[0];
    const capResult = capabilityRegistry.execute(cap.id, { query, limit: '5', ...Object.fromEntries(plan.tasks.filter(t => t.params).flatMap(t => Object.entries(t.params || {}))) });
    if (capResult.success && capResult.data) {
      const data = Array.isArray(capResult.data) ? capResult.data as KnowledgeNode[] : [];
      return {
        content: buildContentFromPlan(plan, data.length > 0 ? data : [], query),
        suggestions: buildSuggestionsFromPlan(plan, data.length > 0 ? data : []),
        viewAction: buildViewAction(plan, query),
        layers: buildLayers(plan, data.length > 0 ? data : []),
      };
    }
  }

  // Fallback: direct knowledge graph search
  const results = searchNodes(query);

  const content = buildContentFromPlan(plan, results, query);
  const suggestions = buildSuggestionsFromPlan(plan, results);
  const viewAction = buildViewAction(plan, query);
  const layers = buildLayers(plan, results);

  return { content, suggestions, viewAction, layers };
}
