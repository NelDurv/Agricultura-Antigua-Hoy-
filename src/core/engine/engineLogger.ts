import type { Intent, Plan, Task } from './types';
import type { ComposedResponse } from './responseComposer';

export interface DecisionLogEntry {
  timestamp: number;
  query: string;
  intent: {
    type: string;
    confidence: number;
    topics: string[];
    vague?: boolean;
    isCompound?: boolean;
    subIntents?: string;
    contextUsed?: boolean;
  };
  plan: {
    taskCount: number;
    taskTypes: string[];
    reasoning: string;
  };
  response: {
    contentLength: number;
    suggestionCount: number;
    layerCount: number;
    hasViewAction: boolean;
  };
  duration: number;
}

class EngineLogger {
  private log: DecisionLogEntry[] = [];
  private readonly maxEntries = 200;

  logDecision(
    query: string,
    intent: Intent,
    plan: Plan,
    response: ComposedResponse,
    duration: number,
  ): void {
    const entry: DecisionLogEntry = {
      timestamp: Date.now(),
      query,
      intent: {
        type: intent.type,
        confidence: intent.confidence,
        topics: intent.topics,
        vague: intent.vague,
        isCompound: intent.isCompound,
        subIntents: intent.subIntents?.map(s => `${s.type}(${Math.round(s.confidence * 100)}%)`).join(', '),
        contextUsed: intent.contextUsed,
      },
      plan: {
        taskCount: plan.tasks.length,
        taskTypes: [...new Set(plan.tasks.map(t => t.type))],
        reasoning: plan.reasoning,
      },
      response: {
        contentLength: response.content.length,
        suggestionCount: response.suggestions.length,
        layerCount: response.layers?.length || 0,
        hasViewAction: !!response.viewAction,
      },
      duration,
    };

    this.log.push(entry);

    if (this.log.length > this.maxEntries) {
      this.log = this.log.slice(-this.maxEntries);
    }

    // Console output for development
    console.log(
      `[Engine] %c${intent.type}%c ${Math.round(intent.confidence * 100)}% | ` +
      `${plan.tasks.length} tareas [${[...new Set(plan.tasks.map(t => t.type))].join(', ')}] | ` +
      `${duration}ms`,
      `color: ${this.colorForIntent(intent.type)}; font-weight: bold`,
      'color: inherit',
    );

    if (intent.isCompound) {
      console.log(`[Engine]   └─ Compuesto: ${entry.intent.subIntents}`);
    }
    if (intent.contextUsed) {
      console.log(`[Engine]   └─ Contexto de conversación aplicado`);
    }
  }

  getRecentLogs(count = 10): DecisionLogEntry[] {
    return this.log.slice(-count).reverse();
  }

  getAllLogs(): DecisionLogEntry[] {
    return [...this.log];
  }

  getStats(): { totalQueries: number; topIntents: Record<string, number>; avgConfidence: number; avgTasks: number } {
    if (this.log.length === 0) {
      return { totalQueries: 0, topIntents: {}, avgConfidence: 0, avgTasks: 0 };
    }

    const intentCounts: Record<string, number> = {};
    let totalConfidence = 0;
    let totalTasks = 0;

    for (const entry of this.log) {
      intentCounts[entry.intent.type] = (intentCounts[entry.intent.type] || 0) + 1;
      totalConfidence += entry.intent.confidence;
      totalTasks += entry.plan.taskCount;
    }

    return {
      totalQueries: this.log.length,
      topIntents: Object.fromEntries(
        Object.entries(intentCounts).sort((a, b) => b[1] - a[1])
      ),
      avgConfidence: Math.round((totalConfidence / this.log.length) * 100),
      avgTasks: Math.round((totalTasks / this.log.length) * 10) / 10,
    };
  }

  clear(): void {
    this.log = [];
  }

  private colorForIntent(type: string): string {
    const colors: Record<string, string> = {
      learn: '#059669',
      apply: '#d97706',
      investigate: '#7c3aed',
      compare: '#0891b2',
      calculate: '#dc2626',
      explore: '#2563eb',
      unknown: '#78716c',
    };
    return colors[type] || '#78716c';
  }
}

export const engineLogger = new EngineLogger();
