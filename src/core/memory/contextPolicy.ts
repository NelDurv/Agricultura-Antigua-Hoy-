import type { MemoryLayerId } from './types';

export interface ContextRule {
  id: string;
  description: string;
  keyPattern: RegExp;
  targetLayer: MemoryLayerId;
  priority: number;
  ttl?: number;
}

const DEFAULT_RULES: ContextRule[] = [
  { id: 'current-query', description: 'Consulta activa del usuario', keyPattern: /^current_query$/, targetLayer: 'temporal', priority: 10, ttl: 10 * 60 * 1000 },
  { id: 'current-response', description: 'Respuesta activa', keyPattern: /^current_response$/, targetLayer: 'temporal', priority: 10, ttl: 10 * 60 * 1000 },
  { id: 'current-goal', description: 'Goal activo', keyPattern: /^current_goal$/, targetLayer: 'temporal', priority: 10, ttl: 10 * 60 * 1000 },
  { id: 'draft-*', description: 'Borradores temporales', keyPattern: /^draft_/, targetLayer: 'temporal', priority: 8, ttl: 5 * 60 * 1000 },
  { id: 'messages', description: 'Historial de mensajes', keyPattern: /^messages$/, targetLayer: 'session', priority: 20 },
  { id: 'workspace', description: 'Espacio de trabajo', keyPattern: /^workspace$/, targetLayer: 'session', priority: 20 },
  { id: 'intent-history', description: 'Historial de intenciones', keyPattern: /^intent_history$/, targetLayer: 'session', priority: 15 },
  { id: 'last-plan', description: 'Último plan ejecutado', keyPattern: /^last_plan$/, targetLayer: 'session', priority: 12 },
  { id: 'collected-answers', description: 'Respuestas de clarificación', keyPattern: /^collected_answers$/, targetLayer: 'session', priority: 12 },
  { id: 'layers-ui', description: 'Capas de interfaz abiertas', keyPattern: /^layers$/, targetLayer: 'session', priority: 10 },
  { id: 'session-info', description: 'Información de sesión', keyPattern: /^session:/, targetLayer: 'session', priority: 25 },
  { id: 'user-prefs', description: 'Preferencias del usuario', keyPattern: /^prefs:/, targetLayer: 'project', priority: 30 },
  { id: 'user-projects', description: 'Proyectos guardados', keyPattern: /^project:/, targetLayer: 'project', priority: 30 },
  { id: 'user-progress', description: 'Progreso de aprendizaje', keyPattern: /^progress:/, targetLayer: 'project', priority: 25 },
];

export class ContextPolicy {
  private rules: ContextRule[] = [];

  constructor(rules?: ContextRule[]) {
    this.rules = rules ?? [...DEFAULT_RULES];
  }

  addRule(rule: ContextRule): void {
    const existing = this.rules.findIndex(r => r.id === rule.id);
    if (existing >= 0) {
      this.rules[existing] = rule;
    } else {
      this.rules.push(rule);
    }
  }

  removeRule(id: string): void {
    this.rules = this.rules.filter(r => r.id !== id);
  }

  classifyKey(key: string): { layer: MemoryLayerId; ttl?: number } {
    const matched = this.rules
      .filter(r => r.keyPattern.test(key))
      .sort((a, b) => b.priority - a.priority);

    if (matched.length > 0) {
      return { layer: matched[0].targetLayer, ttl: matched[0].ttl };
    }

    return { layer: 'session' };
  }

  getRules(): ContextRule[] {
    return [...this.rules];
  }
}

export const defaultPolicy = new ContextPolicy();
