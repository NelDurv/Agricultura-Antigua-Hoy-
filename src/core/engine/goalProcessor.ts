import { analyzeIntent } from './intentAnalyzer';
import { createPlan } from './taskPlanner';
import { composeResponse } from './responseComposer';
import { createWorkspace } from './workspaceManager';
import { getCachedResponse, setCachedResponse } from '../messaging/responseCache';
import { eventBus } from '../events';
import type { Goal, GoalStatus, Intent, IntentContext, Plan } from './types';
import type { ComposedResponse } from './responseComposer';
import type { Workspace } from './types';

let goalCounter = 0;

export interface GoalResult {
  goal: Goal;
  plan: Plan;
  response: ComposedResponse;
  workspace: Workspace | null;
  duration: number;
}

export class GoalProcessor {
  private recentQueries: string[] = [];
  private intentHistory: Intent['type'][] = [];

  setRecentQueries(queries: string[]): void {
    this.recentQueries = queries;
  }

  setIntentHistory(history: Intent['type'][]): void {
    this.intentHistory = history;
  }

  processGoal(query: string): GoalResult {
    const startTime = performance.now();

    const cached = getCachedResponse(query);
    if (cached) {
      const goal: Goal = {
        id: `goal-${++goalCounter}`,
        originalQuery: query,
        intent: { type: 'unknown', confidence: 0, topics: [], query },
        status: 'completed',
        context: { recentQueries: this.recentQueries, intentHistory: this.intentHistory },
        createdAt: Date.now(),
        completedAt: Date.now(),
      };
      return {
        goal,
        plan: { intent: goal.intent, tasks: [], reasoning: 'Cached response' },
        response: { content: cached.content, suggestions: cached.suggestions },
        workspace: null,
        duration: 0,
      };
    }

    const ctx: IntentContext = {
      recentQueries: this.recentQueries,
      intentHistory: this.intentHistory,
    };

    const intent = analyzeIntent(query, ctx);

    eventBus.emit('engine:intent-classified', {
      query,
      type: intent.type,
      confidence: intent.confidence ?? 1,
      isCompound: (intent.clarificationQuestions?.length ?? 0) > 0,
      contextUsed: ctx.intentHistory.length > 0,
    });

    if (intent.type !== 'unknown') {
      this.intentHistory = [...this.intentHistory.slice(-4), intent.type].filter(Boolean) as Intent['type'][];
    }

    const plan = createPlan(intent);

    eventBus.emit('engine:plan-created', { plan });

    const response = composeResponse(plan, query);

    let workspace: Workspace | null = null;
    if (plan.tasks.some(t => t.type === 'open-panel')) {
      workspace = createWorkspace(plan, `conv-${Date.now()}`);
    }

    setCachedResponse(query, { content: response.content, suggestions: response.suggestions });

    const duration = Math.round(performance.now() - startTime);

    eventBus.emit('engine:response-composed', {
      query,
      contentLength: response.content.length,
      duration,
    });

    const status: GoalStatus =
      intent.vague && intent.clarificationQuestions && intent.clarificationQuestions.length > 0
        ? 'pending_clarification'
        : 'completed';

    const goal: Goal = {
      id: `goal-${++goalCounter}`,
      originalQuery: query,
      intent,
      status,
      context: ctx,
      createdAt: Date.now(),
      completedAt: status === 'completed' ? Date.now() : undefined,
    };

    return { goal, plan, response, workspace, duration };
  }

  getCurrentHistory(): Intent['type'][] {
    return [...this.intentHistory];
  }

  reset(): void {
    this.recentQueries = [];
    this.intentHistory = [];
  }
}

export const goalProcessor = new GoalProcessor();
