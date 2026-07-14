import { describe, it, expect } from 'vitest';
import { analyzeIntent } from '../../src/core/engine/intentAnalyzer';
import { createPlan } from '../../src/core/engine/taskPlanner';
import { createWorkspace } from '../../src/core/engine/workspaceManager';
import { addPanel } from '../../src/core/engine/panelManager';
import { capabilityRegistry } from '../../src/core/engine/capabilities';
import type { CapabilityId } from '../../src/core/engine/capabilities';
import type { IntentContext, Intent } from '../../src/core/engine/types';

describe('Intent Analyzer', () => {
  function analyze(query: string, ctx?: Partial<IntentContext>): Intent {
    return analyzeIntent(query, { recentQueries: [], intentHistory: [], ...ctx });
  }

  it('detecta "learn" en consultas educativas', () => {
    const result = analyze('Quiero aprender sobre compostaje');
    expect(result.type).toBe('learn');
  });

  it('detecta "apply" en consultas prácticas', () => {
    const result = analyze('Cómo preparar caldo sulfocálcico');
    expect(result.type).toBe('apply');
  });

  it('detecta "investigate" en preguntas directas', () => {
    const result = analyze('¿Qué es el compost?');
    expect(result.type).toBe('investigate');
  });

  it('detecta vaguedad en consultas sin contexto', () => {
    const result = analyze('Hojas amarillas');
    expect(result.vague).toBe(true);
    expect(result.clarificationQuestions).toBeDefined();
    expect(result.clarificationQuestions!.length).toBeGreaterThan(0);
  });

  it('usa contexto histórico para influir en tipo', () => {
    // La vaguedad se determina por longitud (<30 chars),
    // pero el contexto ayuda a clasificar el tipo
    const result = analyze('Hojas amarillas', {
      recentQueries: ['mi planta de tomate se está muriendo'],
      intentHistory: ['investigate'],
    });
    // Con contexto, el tipo debería ser más específico que 'unknown'
    expect(result.type).not.toBe('unknown');
  });

  it('detecta "explore" en consultas de navegación', () => {
    const result = analyze('muéstrame los cursos disponibles');
    expect(result.type).toBe('explore');
  });
});

describe('Task Planner', () => {
  it('crea un plan con el intent correcto', () => {
    const intent = analyzeIntent('Quiero aprender sobre compostaje', { recentQueries: [], intentHistory: [] });
    const plan = createPlan(intent);
    expect(plan.intent.type).toBe('learn');
    expect(plan.tasks.length).toBeGreaterThan(0);
  });

  it('incluye tareas de tipo open-panel para explore', () => {
    const intent = analyzeIntent('muéstrame cursos de agricultura', { recentQueries: [], intentHistory: [] });
    const plan = createPlan(intent);
    expect(plan.tasks.some(t => t.type === 'open-panel')).toBe(true);
  });
});

describe('Panel Manager', () => {
  it('respeta límite máximo de paneles', () => {
    let ws = createWorkspace(
      { intent: { type: 'learn', topics: [], confidence: 1, query: '', vague: false } as Intent, tasks: [], reasoning: '' },
      'conv-test',
    );
    for (let i = 0; i < 10; i++) {
      const result = addPanel(ws, {
        type: 'course', title: `Panel ${i}`, state: 'open', params: {},
      });
      ws = result.workspace;
    }
    expect(ws.panels.length).toBeLessThanOrEqual(8);
  });

  it('puede agregar múltiples paneles hasta el límite', () => {
    let ws = createWorkspace(
      { intent: { type: 'learn', topics: [], confidence: 1, query: '', vague: false } as Intent, tasks: [], reasoning: '' },
      'conv-test',
    );
    const r1 = addPanel(ws, { type: 'course', title: 'Primero', state: 'open', params: {} });
    ws = r1.workspace;
    const r2 = addPanel(ws, { type: 'course', title: 'Segundo', state: 'open', params: {} });
    expect(r2.workspace.panels.length).toBe(2);
  });
});

describe('Capability System', () => {
  it('tiene capacidades registradas', () => {
    const caps = capabilityRegistry.list();
    expect(caps.length).toBeGreaterThanOrEqual(6);
    expect(caps.find(c => c.id === 'search-knowledge')).toBeDefined();
    expect(caps.find(c => c.id === 'calculate-cn-ratio')).toBeDefined();
  });

  it('busca capacidades por texto', () => {
    const results = capabilityRegistry.search('buscar');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(c => c.name.includes('Buscar'))).toBe(true);
  });

  it('ejecuta calculate-cn-ratio correctamente', () => {
    const result = capabilityRegistry.execute('calculate-cn-ratio', { carbon: '30', nitrogen: '1' });
    expect(result.success).toBe(true);
    expect((result.data as any).ratio).toBe(30);
    expect((result.data as any).verdict).toContain('óptimo');
  });

  it('falla con parámetros inválidos', () => {
    const result = capabilityRegistry.execute('calculate-cn-ratio', { carbon: 'abc', nitrogen: '1' });
    expect(result.success).toBe(false);
    expect(result.error).toContain('numéricos');
  });

  it('falla con capability inexistente', () => {
    const result = capabilityRegistry.execute('nonexistent' as CapabilityId, {});
    expect(result.success).toBe(false);
    expect(result.error).toContain('not found');
  });

  it('fallta con parámetros requeridos faltantes', () => {
    const result = capabilityRegistry.execute('search-knowledge', {});
    expect(result.success).toBe(false);
    expect(result.error).toContain('Missing required param');
  });
});
