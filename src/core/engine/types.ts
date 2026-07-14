export type IntentType = 'learn' | 'apply' | 'investigate' | 'compare' | 'calculate' | 'explore' | 'unknown';

export interface ClarificationQuestion {
  id: string;
  question: string;
  field: string;
  options?: string[];
}

export interface SubIntent {
  type: IntentType;
  confidence: number;
}

export interface IntentContext {
  recentQueries: string[];
  intentHistory: IntentType[];
}

export interface Intent {
  type: IntentType;
  confidence: number;
  topics: string[];
  query: string;
  vague?: boolean;
  clarificationQuestions?: ClarificationQuestion[];
  isCompound?: boolean;
  subIntents?: SubIntent[];
  contextUsed?: boolean;
}

export type TaskType =
  | 'show-content'
  | 'open-panel'
  | 'run-tool'
  | 'suggest'
  | 'navigate'
  | 'filter-view'
  | 'ask-clarification';

export interface Task {
  id: string;
  type: TaskType;
  label: string;
  target?: string;
  params?: Record<string, string>;
}

export interface Plan {
  intent: Intent;
  tasks: Task[];
  reasoning: string;
}

export type PanelType =
  | 'course' | 'document' | 'recipe' | 'glossary' | 'calculator'
  | 'forum' | 'module' | 'profile' | 'institution' | 'schema';

export interface Panel {
  id: string;
  type: PanelType;
  title: string;
  state: 'open' | 'minimized' | 'focused';
  params?: Record<string, string>;
}

export type WidgetType = 'glossary' | 'progress' | 'related' | 'calculator';

export interface Widget {
  id: string;
  type: WidgetType;
  params?: Record<string, string>;
}

export interface Workspace {
  id: string;
  panels: Panel[];
  widgets: Widget[];
}

export type GoalStatus = 'active' | 'pending_clarification' | 'completed' | 'failed';

export interface Goal {
  id: string;
  originalQuery: string;
  intent: Intent;
  status: GoalStatus;
  context: IntentContext;
  subGoals?: Goal[];
  createdAt: number;
  completedAt?: number;
}

export type EngineResult = {
  plan: Plan;
  panels?: Panel[];
  widgets?: Widget[];
};
