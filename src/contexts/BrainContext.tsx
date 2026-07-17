import React, { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { searchNodes } from '../core/knowledge/graph';
import type { KnowledgeNode } from '../core/knowledge/types';
import { createWorkspace, closeWorkspace as closeWs, togglePanelState, goalProcessor } from '../core/engine';
import type { Plan, Workspace, Panel, ClarificationQuestion, IntentType, IntentContext } from '../core/engine';
import { storage, STORAGE_KEYS, getSessionId } from '../core/persistence';
import { submitFeedback as saveFeedback, getFeedbackStats } from '../core/feedback';
import { eventBus } from '../core/events';
import { messageQueue } from '../core/messaging/messageQueue';
import { memoryManager } from '../core/memory';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  suggestions?: Suggestion[];
}

export interface Suggestion {
  label: string;
  action: string;
  icon?: string;
  payload?: Record<string, string>;
}

export interface Layer {
  id: string;
  type: 'side' | 'modal';
  title: string;
  component: 'course' | 'document' | 'recipe' | 'resource' | 'node';
  params: Record<string, string>;
  resourceId?: string;
}

export type ViewAction = {
  type: 'biblioteca-filter' | 'recursos-tab' | 'campus-mode' | 'scroll-to';
  payload?: Record<string, string>;
};

export interface BrainState {
  messages: Message[];
  composerText: string;
  isChatOpen: boolean;
  unreadCount: number;
  layers: Layer[];
  viewAction: ViewAction | null;
  lastPlan: Plan | null;
  workspace: Workspace | null;
  submitFeedback: (messageId: string, rating: 'good' | 'bad') => void;
  feedbackStats: { total: number; good: number; bad: number; ratio: number; topIntents: { intent: string; good: number; bad: number }[] };
  pendingClarifications: ClarificationQuestion[] | null;
  intentHistory: IntentType[];
  sendMessage: (text: string) => void;
  sendClarification: (field: string, value: string) => void;
  setComposerText: (text: string) => void;
  toggleChat: () => void;
  clearConversation: () => void;
  clearAllData: () => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  clearLayers: () => void;
  navigateToRoute: (route: string) => void;
  dispatchViewAction: (action: ViewAction) => void;
  clearViewAction: () => void;
  createWorkspaceFromPlan: (plan: Plan) => void;
  closeWorkspace: () => void;
  togglePanel: (panelId: string) => void;
}

const INITIAL_SUGGESTIONS: Suggestion[] = [];

const BrainContext = createContext<BrainState | null>(null);

let layerCounter = 0;
let msgCounter: number = (() => {
  try {
    const saved = storage.get(STORAGE_KEYS.MESSAGES);
    if (Array.isArray(saved) && saved.length > 1) {
      const maxId = saved.reduce((max: number, m: any) => {
        const match = m.id?.match(/^msg-(\d+)$/);
        return match ? Math.max(max, parseInt(match[1], 10)) : max;
      }, 0);
      return maxId;
    }
  } catch {}
  return 0;
})();

export function BrainProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-welcome',
      role: 'system',
      content: '¡Bienvenido a Agricultura Antigua! Soy tu asistente de aprendizaje. Pregúntame sobre cultivos, suelos, bioinsumos o selecciona una opción para comenzar.',
      timestamp: Date.now(),
      suggestions: INITIAL_SUGGESTIONS,
    },
  ]);
  const [composerText, setComposerText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [viewAction, setViewAction] = useState<ViewAction | null>(null);
  const [lastPlan, setLastPlan] = useState<Plan | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [pendingClarifications, setPendingClarifications] = useState<ClarificationQuestion[] | null>(null);
  const [collectedAnswers, setCollectedAnswers] = useState<Record<string, string>>({});
  const [intentHistory, setIntentHistory] = useState<IntentType[]>([]);
  const navigateRef = useRef<((route: string) => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const restored = useRef(false);

  // ─── Persistencia: restaurar estado al montar ───
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;

    const savedMessages = storage.get(STORAGE_KEYS.MESSAGES);
    if (savedMessages && savedMessages.length > 1) {
      const seen = new Set<string>();
      const unique = savedMessages.filter((m: any) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });
      setMessages(unique);
    }

    const savedWorkspace = storage.get(STORAGE_KEYS.WORKSPACE);
    if (savedWorkspace) setWorkspace(savedWorkspace);

    const savedHistory = storage.get(STORAGE_KEYS.INTENT_HISTORY);
    if (savedHistory && savedHistory.length > 0) setIntentHistory(savedHistory);

    // Restore memory from localStorage
    memoryManager.restore();

    const sid = getSessionId();
    eventBus.emit('session:started', { sessionId: sid });
  }, []);

  // ─── Persistencia: guardar cambios ───
  useEffect(() => { storage.setDebounced(STORAGE_KEYS.MESSAGES, messages); }, [messages]);
  useEffect(() => { storage.setDebounced(STORAGE_KEYS.WORKSPACE, workspace); }, [workspace]);
  useEffect(() => { storage.setDebounced(STORAGE_KEYS.INTENT_HISTORY, intentHistory); }, [intentHistory]);

  // ─── Memory Manager: sync state to memory layers ───
  useEffect(() => { memoryManager.set('messages', messages, { layer: 'session' }); }, [messages]);
  useEffect(() => { memoryManager.set('workspace', workspace, { layer: 'session' }); }, [workspace]);
  useEffect(() => { memoryManager.set('intent_history', intentHistory, { layer: 'session' }); }, [intentHistory]);
  useEffect(() => { memoryManager.set('last_plan', lastPlan, { layer: 'session' }); }, [lastPlan]);

  // Persist memory on unmount
  useEffect(() => {
    return () => { memoryManager.persist(); };
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  const syncGoalProcessorState = useCallback(() => {
    goalProcessor.setRecentQueries(
      messages.filter(m => m.role === 'user').slice(-3).map(m => m.content)
    );
    goalProcessor.setIntentHistory(intentHistory);
  }, [messages, intentHistory]);

  const processGoal = useCallback((userText: string): { content: string; suggestions: Suggestion[]; newLayers?: Layer[]; viewAction?: ViewAction } => {
    syncGoalProcessorState();

    memoryManager.set('current_query', userText, { layer: 'temporal' });

    const result = goalProcessor.processGoal(userText);

    memoryManager.set('current_response', { content: result.response.content, suggestions: result.response.suggestions }, { layer: 'temporal' });
    memoryManager.set('current_goal', { id: result.goal.id, status: result.goal.status, query: result.goal.originalQuery }, { layer: 'temporal' });

    // Sync state from goal result
    if (result.goal.intent.type !== 'unknown') {
      setIntentHistory(goalProcessor.getCurrentHistory());
    }

    setLastPlan(result.plan);

    // Set clarifications if pending
    if (result.goal.status === 'pending_clarification') {
      const questions = result.goal.intent.clarificationQuestions;
      if (questions && questions.length > 0) {
        setPendingClarifications(questions);
        setCollectedAnswers({});
      }
    }

    // Set workspace if created
    if (result.workspace) {
      setWorkspace(result.workspace);
    }

    return {
      content: result.response.content,
      suggestions: result.response.suggestions,
      newLayers: result.response.layers as Layer[] | undefined,
      viewAction: result.response.viewAction as ViewAction | undefined,
    };
  }, [syncGoalProcessorState]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    messageQueue.cancelPending();
    messageQueue.enqueue(() => {
      const content = text.trim();
      const userMsg: Message = {
        id: `msg-${++msgCounter}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      try {
        // Check if we're in clarification mode
        if (pendingClarifications && pendingClarifications.length > 0) {
          const newAnswers = { ...collectedAnswers };
          const unanswered = pendingClarifications.filter(q => !newAnswers[q.field]);

          if (unanswered.length > 0) {
            newAnswers[unanswered[0].field] = content;
            setCollectedAnswers(newAnswers);

            const total = pendingClarifications.length;
            const answeredCount = Object.keys(newAnswers).length;
            const remaining = pendingClarifications.filter(q => !newAnswers[q.field]);

            if (remaining.length > 0) {
              eventBus.emit('engine:clarification-asked', {
                question: remaining[0].question,
                remainingCount: remaining.length,
                totalCount: total,
              });
              const nextQ = remaining[0];
              const assistantMsg: Message = {
                id: `msg-${++msgCounter}`,
                role: 'assistant',
                content: `_${nextQ.question}_\n\n*(Pregunta ${answeredCount + 1} de ${total})*`,
                timestamp: Date.now(),
                suggestions: nextQ.options?.map(o => ({
                  label: o, action: 'clarify', icon: '💬',
                  payload: { field: nextQ.field, value: o },
                })) || [],
              };
              setMessages(prev => [...prev, userMsg, assistantMsg]);
              setComposerText('');
              if (!isChatOpen) setUnreadCount(prev => prev + 1);
              setTimeout(scrollToBottom, 100);
              return;
            } else {
              setPendingClarifications(null);
              const contextStr = Object.entries(newAnswers).map(([f, v]) => `${f}:${v}`).join(', ');
              const enrichedQuery = `diagnóstico: ${contextStr}`;

              eventBus.emit('engine:clarification-completed', { answers: newAnswers, query: enrichedQuery });

              syncGoalProcessorState();
              const result = goalProcessor.processGoal(enrichedQuery);

              const respViewAction = result.response.viewAction as ViewAction | undefined;
              if (respViewAction) setViewAction(respViewAction);

              const finalContent = result.response.content.includes('No encontré')
                ? 'Con la información que me diste, no tengo suficientes datos para darte una respuesta precisa. Te sugiero consultar en la sección de Recursos o Biblioteca para más información.'
                : result.response.content;

              const finalMsg: Message = {
                id: `msg-${++msgCounter}`,
                role: 'assistant',
                content: finalContent,
                timestamp: Date.now(),
                suggestions: result.response.suggestions,
              };
              setMessages(prev => [...prev, userMsg, finalMsg]);
              setComposerText('');
              if (!isChatOpen) setUnreadCount(prev => prev + 1);
              const respLayers = result.response.layers as Layer[] | undefined;
              if (respLayers) setLayers(prev => [...prev, ...respLayers]);
              setTimeout(scrollToBottom, 100);
              return;
            }
          }
        }

        // Normal flow
        const response = processGoal(content);

        if (response.viewAction) setViewAction(response.viewAction);

        const assistantMsg: Message = {
          id: `msg-${++msgCounter}`,
          role: 'assistant',
          content: response.content,
          timestamp: Date.now(),
          suggestions: response.suggestions,
        };

        setMessages(prev => [...prev, userMsg, assistantMsg]);
        setComposerText('');
        if (!isChatOpen) setUnreadCount(prev => prev + 1);
        if (response.newLayers && response.newLayers.length > 0) {
          setLayers(prev => [...prev, ...response.newLayers!]);
        }
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error('[sendMessage] Error:', err);
        const errorMsg: Message = {
          id: `msg-${++msgCounter}`,
          role: 'assistant',
          content: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, userMsg, errorMsg]);
        setComposerText('');
        setTimeout(scrollToBottom, 100);
      }
    });
  }, [processGoal, syncGoalProcessorState, scrollToBottom, isChatOpen, pendingClarifications, collectedAnswers]);

  const sendClarification = useCallback((field: string, value: string) => {
    if (!pendingClarifications || pendingClarifications.length === 0) return;

    const content = value;
    const userMsg: Message = {
      id: `msg-${++msgCounter}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const newAnswers = { ...collectedAnswers, [field]: value };
    setCollectedAnswers(newAnswers);

    const total = pendingClarifications.length;
    const answeredCount = Object.keys(newAnswers).length;
    const remaining = pendingClarifications.filter(q => !newAnswers[q.field]);

    if (remaining.length > 0) {
      const nextQ = remaining[0];
      const assistantMsg: Message = {
        id: `msg-${++msgCounter}`,
        role: 'assistant',
        content: `_${nextQ.question}_\n\n*(Pregunta ${answeredCount + 1} de ${total})*`,
        timestamp: Date.now(),
        suggestions: nextQ.options?.map(o => ({
          label: o, action: 'clarify', icon: '💬',
          payload: { field: nextQ.field, value: o },
        })) || [],
      };
      setMessages(prev => [...prev, userMsg, assistantMsg]);
    } else {
      // All answered — generate final response
      setPendingClarifications(null);
      const contextStr = Object.entries(newAnswers).map(([f, v]) => `${f}:${v}`).join(', ');
      const enrichedQuery = `diagnóstico: ${contextStr}`;
      syncGoalProcessorState();
      const result2 = goalProcessor.processGoal(enrichedQuery);

      const respViewAction2 = result2.response.viewAction as ViewAction | undefined;
      if (respViewAction2) setViewAction(respViewAction2);

      const finalContent = result2.response.content.includes('No encontré')
        ? 'Con la información que me diste, no tengo suficientes datos para darte una respuesta precisa. Te sugiero consultar en la sección de Recursos o Biblioteca para más información.'
        : result2.response.content;

      const finalMsg: Message = {
        id: `msg-${++msgCounter}`,
        role: 'assistant',
        content: finalContent,
        timestamp: Date.now(),
        suggestions: result2.response.suggestions,
      };
      setMessages(prev => [...prev, userMsg, finalMsg]);
      const respLayers2 = result2.response.layers as Layer[] | undefined;
      if (respLayers2) setLayers(prev => [...prev, ...respLayers2]);
    }

    setComposerText('');
    if (!isChatOpen) setUnreadCount(prev => prev + 1);
    setTimeout(scrollToBottom, 100);
  }, [pendingClarifications, collectedAnswers, processGoal, syncGoalProcessorState, scrollToBottom, isChatOpen]);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
    setUnreadCount(0);
  }, []);

  const clearAllData = useCallback(() => {
    storage.clearAll();
    restored.current = false;
    window.location.reload();
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: 'system-welcome',
        role: 'system',
        content: '¡Bienvenido a Agricultura Antigua! Soy tu asistente de aprendizaje. Pregúntame sobre cultivos, suelos, bioinsumos o selecciona una opción para comenzar.',
        timestamp: Date.now(),
        suggestions: INITIAL_SUGGESTIONS,
      },
    ]);
    setLayers([]);
    setPendingClarifications(null);
    setCollectedAnswers({});
    setIntentHistory([]);
    storage.remove(STORAGE_KEYS.MESSAGES);
    storage.remove(STORAGE_KEYS.WORKSPACE);
    storage.remove(STORAGE_KEYS.INTENT_HISTORY);
    storage.remove(STORAGE_KEYS.COLLECTED_ANSWERS);
    storage.remove(STORAGE_KEYS.LAST_PLAN);
    storage.remove(STORAGE_KEYS.LAYERS);
    memoryManager.clear('temporal');
  }, []);

  const addLayer = useCallback((layer: Layer) => {
    setLayers(prev => {
      const exists = prev.some(l => l.id === layer.id);
      if (exists) return prev;
      return [...prev, layer];
    });
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
  }, []);

  const clearLayers = useCallback(() => {
    setLayers([]);
  }, []);

  const dispatchViewAction = useCallback((action: ViewAction) => {
    setViewAction(action);
  }, []);

  const clearViewAction = useCallback(() => {
    setViewAction(null);
  }, []);

  const navigateToRoute = useCallback((route: string) => {
    if (navigateRef.current) {
      navigateRef.current(route);
    }
  }, []);

  const createWorkspaceFromPlan = useCallback((plan: Plan) => {
    const convId = messages.length > 0 ? messages[0].id : 'conv-new';
    const ws = createWorkspace(plan, convId);
    setWorkspace(ws);
    eventBus.emit('workspace:created', { workspace: ws });
  }, [messages]);

  const closeWorkspaceCb = useCallback(() => {
    setWorkspace(null);
    eventBus.emit('workspace:closed', { workspaceId: 'current' });
  }, []);

  const submitFeedbackCb = useCallback((messageId: string, rating: 'good' | 'bad') => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;
    const intent = lastPlan?.intent.type || 'unknown';
    saveFeedback({ messageId, query: msg.content, intentType: intent, rating, timestamp: Date.now() });
    eventBus.emit('feedback:submitted', { messageId, rating, intentType: intent });
  }, [messages, lastPlan]);

  const feedbackStats = getFeedbackStats();

  const togglePanel = useCallback((panelId: string) => {
    setWorkspace(prev => {
      if (!prev) return prev;
      const panel = prev.panels.find(p => p.id === panelId);
      if (panel) {
        if (panel.state === 'open' || panel.state === 'focused') {
          eventBus.emit('panel:closed', { panelId });
        } else {
          eventBus.emit('panel:opened', { panel });
        }
      }
      return togglePanelState(prev, panelId);
    });
  }, []);

  const openResourceLayer = useCallback((resourceId: string) => {
    const graphResults = searchNodes(resourceId);
    if (graphResults.length === 0) return;

    const node = graphResults[0];
    const taxons = node.taxons.map(t => t.toLowerCase());
    let component: Layer['component'];
    if (node.type === 'course' || taxons.includes('cursos') || taxons.includes('cursos32')) {
      component = 'course';
    } else if (node.type === 'recipe' || taxons.includes('recetas')) {
      component = 'recipe';
    } else if (taxons.includes('biblioteca')) {
      component = 'document';
    } else {
      component = 'node';
    }
    addLayer({
      id: `layer-${++layerCounter}`,
      type: 'side',
      title: node.title,
      component,
      params: {},
      resourceId: node.id,
    });
  }, [addLayer]);

  const value: BrainState = {
    messages,
    composerText,
    isChatOpen,
    unreadCount,
    layers,
    viewAction,
    lastPlan,
    workspace,
    pendingClarifications,
    intentHistory,
    sendMessage,
    sendClarification,
    setComposerText,
    toggleChat,
    clearConversation,
    clearAllData,
    addLayer,
    removeLayer,
    clearLayers,
    navigateToRoute,
    dispatchViewAction,
    clearViewAction,
    createWorkspaceFromPlan,
    closeWorkspace: closeWorkspaceCb,
    togglePanel,
    submitFeedback: submitFeedbackCb,
    feedbackStats,
  };

  (window as any).__brainNavigate = navigateRef;
  (window as any).__brainOpenResource = (id: string) => openResourceLayer(id);

  return (
    <BrainContext.Provider value={value}>
      {children}
    </BrainContext.Provider>
  );
}

export function useBrain(): BrainState {
  const ctx = useContext(BrainContext);
  if (!ctx) throw new Error('useBrain must be used within BrainProvider');
  return ctx;
}

export { BrainContext };
