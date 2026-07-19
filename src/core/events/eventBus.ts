import type { IntentType, Plan, Workspace, Panel, Widget } from '../engine/types';

export type EngineEventType =
  | 'engine:intent-classified'
  | 'engine:plan-created'
  | 'engine:response-composed'
  | 'engine:clarification-asked'
  | 'engine:clarification-completed'
  | 'workspace:created'
  | 'workspace:closed'
  | 'panel:opened'
  | 'panel:closed'
  | 'panel:focused'
  | 'widget:rendered'
  | 'feedback:submitted'
  | 'session:started'
  | 'system:error';

export interface EngineEventPayloads {
  'engine:intent-classified': { query: string; type: IntentType; confidence: number; isCompound: boolean; contextUsed: boolean };
  'engine:plan-created': { plan: Plan };
  'engine:response-composed': { query: string; contentLength: number; duration: number };
  'engine:clarification-asked': { question: string; remainingCount: number; totalCount: number };
  'engine:clarification-completed': { answers: Record<string, string>; query: string };
  'workspace:created': { workspace: Workspace };
  'workspace:closed': { workspaceId: string };
  'panel:opened': { panel: Panel };
  'panel:closed': { panelId: string };
  'panel:focused': { panelId: string };
  'widget:rendered': { widget: Widget };
  'feedback:submitted': { messageId: string; rating: 'good' | 'bad'; intentType: string };
  'session:started': { sessionId: string };
  'system:error': { source: string; message: string };
}

type Listener<E extends EngineEventType> = (payload: EngineEventPayloads[E]) => void;

class EventBus {
  private listeners = new Map<string, Set<(...args: unknown[]) => void>>();

  on<E extends EngineEventType>(event: E, listener: Listener<E>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener as (...args: unknown[]) => void);
    return () => this.off(event, listener as (...args: unknown[]) => void);
  }

  off<E extends EngineEventType>(event: E, listener: Listener<E>): void {
    this.listeners.get(event)?.delete(listener as (...args: unknown[]) => void);
  }

  emit<E extends EngineEventType>(event: E, payload: EngineEventPayloads[E]): void {
    this.listeners.get(event)?.forEach((listener) => {
      try { listener(payload); } catch (err) { console.warn(`[EventBus] Error in ${event}:`, err); }
    });
  }

  once<E extends EngineEventType>(event: E, listener: Listener<E>): void {
    const wrapper = (payload: EngineEventPayloads[E]) => {
      listener(payload);
      this.off(event, wrapper as Listener<E>);
    };
    this.on(event, wrapper as Listener<E>);
  }

  clear(): void { this.listeners.clear(); }

  listenerCount(event: string): number { return this.listeners.get(event)?.size ?? 0; }
}

export const eventBus = new EventBus();
