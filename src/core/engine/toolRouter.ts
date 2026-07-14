import { searchNodes, getNode, getRelatedNodes } from '../knowledge/graph';

function executeWithTimeout(
  handler: (params: Record<string, string>) => ToolResult,
  params: Record<string, string>,
  timeoutMs: number,
): ToolResult {
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; }, timeoutMs);
  try {
    const result = handler(params);
    clearTimeout(timer);
    if (timedOut) return { success: false, error: `Tool timed out after ${timeoutMs}ms` };
    return result;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export interface ToolParamSchema {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  description?: string;
}

export interface Tool {
  name: string;
  description: string;
  params: ToolParamSchema[];
  handler: (params: Record<string, string>) => ToolResult;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

class ToolRegistry {
  private tools = new Map<string, Tool>();

  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  // Timeout por herramienta (ms)
  private timeouts: Record<string, number> = {
    'search-nodes': 3000,
    'get-node': 1000,
    'get-related': 2000,
    'calculate-cn': 500,
    'open-resource': 2000,
    '*': 5000,
  };

  setTimeout(name: string, ms: number): void {
    this.timeouts[name] = ms;
  }

  execute(name: string, params: Record<string, string>): ToolResult {
    const tool = this.tools.get(name);
    if (!tool) {
      return { success: false, error: `Tool "${name}" not found` };
    }

    // Validate required params
    for (const param of tool.params) {
      if (param.required && !(param.name in params)) {
        return { success: false, error: `Missing required param "${param.name}" for tool "${name}"` };
      }
    }

    const timeoutMs = this.timeouts[name] ?? this.timeouts['*'] ?? 5000;

    try {
      const result = executeWithTimeout(tool.handler, params, timeoutMs);
      return result;
    } catch (err) {
      return { success: false, error: `Error executing "${name}": ${err}` };
    }
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  listTools(): Tool[] {
    return Array.from(this.tools.values());
  }
}

export const toolRegistry = new ToolRegistry();

// ── Register core tools ─────────────────────────────────

toolRegistry.register({
  name: 'search-nodes',
  description: 'Busca nodos en el grafo de conocimiento',
  params: [
    { name: 'query', type: 'string', required: true, description: 'Término de búsqueda' },
    { name: 'limit', type: 'number', description: 'Máximo de resultados (default: 5)' },
  ],
  handler: (params) => {
    const results = searchNodes(params.query);
    const limit = parseInt(params.limit || '5', 10);
    return { success: true, data: results.slice(0, limit) };
  },
});

toolRegistry.register({
  name: 'get-node',
  description: 'Obtiene un nodo del grafo por su ID',
  params: [
    { name: 'id', type: 'string', required: true, description: 'ID del nodo' },
  ],
  handler: (params) => {
    const node = getNode(params.id);
    if (!node) return { success: false, error: `Node "${params.id}" not found` };
    return { success: true, data: node };
  },
});

toolRegistry.register({
  name: 'get-related',
  description: 'Obtiene nodos relacionados a un nodo dado',
  params: [
    { name: 'id', type: 'string', required: true, description: 'ID del nodo base' },
  ],
  handler: (params) => {
    const related = getRelatedNodes(params.id);
    return { success: true, data: related };
  },
});

toolRegistry.register({
  name: 'calculate-cn',
  description: 'Calcula la relación Carbono/Nitrógeno',
  params: [
    { name: 'carbon', type: 'number', required: true, description: 'Valor de carbono' },
    { name: 'nitrogen', type: 'number', required: true, description: 'Valor de nitrógeno' },
  ],
  handler: (params) => {
    const c = parseFloat(params.carbon);
    const n = parseFloat(params.nitrogen);
    if (isNaN(c) || isNaN(n)) return { success: false, error: 'carbon and nitrogen must be numeric' };
    if (n === 0) return { success: false, error: 'nitrogen cannot be zero' };
    const ratio = c / n;
    let verdict: string;
    if (ratio < 20) verdict = 'Bajo en C — riesgo de pérdida de N';
    else if (ratio <= 35) verdict = 'Rango óptimo para compostaje';
    else verdict = 'Alto en C — descomposición lenta';
    return {
      success: true,
      data: { ratio: Math.round(ratio * 10) / 10, carbon: c, nitrogen: n, verdict },
    };
  },
});

toolRegistry.register({
  name: 'open-resource',
  description: 'Abre un recurso como capa lateral',
  params: [
    { name: 'resourceId', type: 'string', required: true, description: 'ID del recurso a abrir' },
  ],
  handler: (params) => {
    const node = getNode(params.resourceId);
    if (!node) return { success: false, error: `Resource "${params.resourceId}" not found` };
    // Dispatch through window bridge (set by BrainContext)
    const fn = (window as any).__brainOpenResource;
    if (fn) fn(params.resourceId);
    return { success: true, data: { id: node.id, title: node.title } };
  },
});
