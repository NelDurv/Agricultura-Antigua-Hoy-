import type { Plan, Workspace, Panel, Widget } from './types';

let wsCounter = 0;
let panelCounter = 0;
let widgetCounter = 0;

const PANEL_TITLE_MAP: Record<string, string> = {
  course: 'Curso',
  document: 'Documento',
  recipe: 'Receta',
  glossary: 'Glosario',
  calculator: 'Calculadora',
  forum: 'Foro',
  module: 'Módulo',
  profile: 'Perfil',
  institution: 'Institución',
  schema: 'Schema',
};

const PANEL_ICON_MAP: Record<string, string> = {
  course: '📚',
  document: '📄',
  recipe: '🧪',
  glossary: '📖',
  calculator: '🔢',
  forum: '💬',
  module: '📋',
  profile: '👤',
  institution: '🏛️',
  schema: '🔗',
};

function inferPanelType(taskLabel: string): Panel['type'] {
  const lower = taskLabel.toLowerCase();
  if (lower.includes('curso')) return 'course';
  if (lower.includes('documento') || lower.includes('biblioteca')) return 'document';
  if (lower.includes('receta')) return 'recipe';
  if (lower.includes('glosario')) return 'glossary';
  if (lower.includes('calculadora') || lower.includes('calcular')) return 'calculator';
  if (lower.includes('foro') || lower.includes('comunidad')) return 'forum';
  if (lower.includes('módulo') || lower.includes('academia')) return 'module';
  if (lower.includes('perfil')) return 'profile';
  if (lower.includes('institución')) return 'institution';
  return 'document';
}

export function createWorkspace(plan: Plan, conversationId: string): Workspace {
  const panels: Panel[] = [];
  const widgets: Widget[] = [];

  // Create panels from open-panel tasks
  for (const task of plan.tasks) {
    if (task.type === 'open-panel') {
      const panelType = (task.params?.panelType as Panel['type']) || inferPanelType(task.label);
      panels.push({
        id: `panel-${++panelCounter}`,
        type: panelType,
        title: task.params?.resourceId
          ? `${PANEL_TITLE_MAP[panelType] || 'Panel'}`
          : task.label,
        state: panels.length === 0 ? 'focused' : 'open',
        params: task.params,
      });
    }

    // Create widgets from suggest tasks with widgetType
    if (task.type === 'suggest' && task.params?.widgetType) {
      widgets.push({
        id: `widget-${++widgetCounter}`,
        type: task.params.widgetType as Widget['type'],
        params: task.params,
      });
    }
  }

  // Add calculator widget for calculate/apply intents
  if (plan.intent.type === 'calculate' || plan.intent.type === 'apply') {
    if (!widgets.find(w => w.type === 'calculator')) {
      widgets.push({
        id: `widget-${++widgetCounter}`,
        type: 'calculator',
      });
    }
  }

  // Add glossary widget if topics detected
  if (plan.intent.topics.length > 0) {
    if (!widgets.find(w => w.type === 'glossary')) {
      widgets.push({
        id: `widget-${++widgetCounter}`,
        type: 'glossary',
        params: { topics: plan.intent.topics.join(',') },
      });
    }
  }

  // Add related content widget if topics detected
  if (plan.intent.topics.length > 0) {
    if (!widgets.find(w => w.type === 'related')) {
      widgets.push({
        id: `widget-${++widgetCounter}`,
        type: 'related',
        params: { topics: plan.intent.topics.join(',') },
      });
    }
  }

  // Add progress widget for learn intents
  if (plan.intent.type === 'learn') {
    if (!widgets.find(w => w.type === 'progress')) {
      widgets.push({
        id: `widget-${++widgetCounter}`,
        type: 'progress',
      });
    }
  }

  const ws: Workspace = {
    id: `ws-${++wsCounter}`,
    panels,
    widgets,
  };

  return ws;
}

export function closeWorkspace(): null {
  return null;
}
