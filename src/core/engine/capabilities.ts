import { searchNodes, getNode, getRelatedNodes } from '../knowledge/graph';
import type { DomainEntityType } from '../domain';

export type CapabilityId =
  | 'search-knowledge'
  | 'get-entity'
  | 'list-courses'
  | 'list-recipes'
  | 'list-documents'
  | 'calculate-cn-ratio'
  | 'open-resource'
  | 'create-project'
  | 'get-glossary-term'
  | 'find-related';

export interface CapabilityParam {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  description: string;
}

export interface Capability {
  id: CapabilityId;
  name: string;
  description: string;
  entityType?: DomainEntityType;
  params: CapabilityParam[];
  execute: (params: Record<string, string>) => CapabilityResult;
}

export interface CapabilityResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

class CapabilityRegistry {
  private capabilities = new Map<CapabilityId, Capability>();

  register(cap: Capability): void {
    this.capabilities.set(cap.id, cap);
  }

  get(id: CapabilityId): Capability | undefined {
    return this.capabilities.get(id);
  }

  list(): Capability[] {
    return Array.from(this.capabilities.values());
  }

  findByEntityType(type: DomainEntityType): Capability[] {
    return this.list().filter(c => c.entityType === type);
  }

  search(query: string): Capability[] {
    const lower = query.toLowerCase();
    return this.list().filter(c =>
      c.name.toLowerCase().includes(lower) ||
      c.description.toLowerCase().includes(lower)
    );
  }

  execute(id: CapabilityId, params: Record<string, string>): CapabilityResult {
    const cap = this.capabilities.get(id);
    if (!cap) return { success: false, error: `Capability "${id}" not found` };

    for (const p of cap.params) {
      if (p.required && !(p.name in params)) {
        return { success: false, error: `Missing required param "${p.name}" for "${id}"` };
      }
    }

    try {
      return cap.execute(params);
    } catch (err) {
      return { success: false, error: `Error executing "${id}": ${err}` };
    }
  }
}

export const capabilityRegistry = new CapabilityRegistry();

// ─── Register built-in capabilities ────────────────────────

capabilityRegistry.register({
  id: 'search-knowledge',
  name: 'Buscar en conocimiento',
  description: 'Busca nodos en el grafo de conocimiento',
  params: [
    { name: 'query', type: 'string', required: true, description: 'Término de búsqueda' },
    { name: 'limit', type: 'number', description: 'Máx. resultados (default: 5)' },
  ],
  execute: (params) => {
    const results = searchNodes(params.query);
    const limit = parseInt(params.limit || '5', 10);
    return { success: true, data: results.slice(0, limit) };
  },
});

capabilityRegistry.register({
  id: 'get-entity',
  name: 'Obtener entidad',
  description: 'Obtiene una entidad del dominio por su ID',
  params: [
    { name: 'id', type: 'string', required: true, description: 'ID de la entidad' },
  ],
  execute: (params) => {
    const node = getNode(params.id);
    if (!node) return { success: false, error: `Entity "${params.id}" not found` };
    return { success: true, data: node };
  },
});

capabilityRegistry.register({
  id: 'find-related',
  name: 'Encontrar relacionados',
  description: 'Obtiene entidades relacionadas a una dada',
  params: [
    { name: 'id', type: 'string', required: true, description: 'ID base' },
  ],
  execute: (params) => {
    const related = getRelatedNodes(params.id);
    return { success: true, data: related };
  },
});

capabilityRegistry.register({
  id: 'calculate-cn-ratio',
  name: 'Calcular relación C/N',
  description: 'Calcula la relación Carbono/Nitrógeno para compostaje',
  params: [
    { name: 'carbon', type: 'number', required: true, description: 'Valor de carbono' },
    { name: 'nitrogen', type: 'number', required: true, description: 'Valor de nitrógeno' },
  ],
  execute: (params) => {
    const c = parseFloat(params.carbon);
    const n = parseFloat(params.nitrogen);
    if (isNaN(c) || isNaN(n)) return { success: false, error: 'carbon y nitrogen deben ser numéricos' };
    if (n === 0) return { success: false, error: 'nitrogen no puede ser cero' };
    const ratio = c / n;
    const verdict = ratio < 20 ? 'Bajo en C — riesgo de pérdida de N'
      : ratio <= 35 ? 'Rango óptimo para compostaje'
      : 'Alto en C — descomposición lenta';
    return { success: true, data: { ratio: Math.round(ratio * 10) / 10, carbon: c, nitrogen: n, verdict } };
  },
});

capabilityRegistry.register({
  id: 'get-glossary-term',
  name: 'Consultar glosario',
  description: 'Obtiene la definición de un término del glosario',
  params: [
    { name: 'term', type: 'string', required: true, description: 'Término a consultar' },
  ],
  execute: (params) => {
    const node = getNode(params.term.toLowerCase());
    if (!node) return { success: false, error: `Término "${params.term}" no encontrado` };
    return { success: true, data: node };
  },
});

capabilityRegistry.register({
  id: 'open-resource',
  name: 'Abrir recurso',
  description: 'Abre un recurso como capa lateral en la interfaz',
  entityType: 'resource',
  params: [
    { name: 'resourceId', type: 'string', required: true, description: 'ID del recurso' },
  ],
  execute: (params) => {
    const node = getNode(params.resourceId);
    if (!node) return { success: false, error: `Resource "${params.resourceId}" not found` };
    const fn = (window as any).__brainOpenResource;
    if (fn) fn(params.resourceId);
    return { success: true, data: { id: node.id, title: node.title } };
  },
});
