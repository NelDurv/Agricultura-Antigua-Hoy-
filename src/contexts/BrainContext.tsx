import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { searchNodes } from '../core/knowledge/graph';
import type { KnowledgeNode } from '../core/knowledge/types';

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

export interface BrainState {
  messages: Message[];
  composerText: string;
  isChatOpen: boolean;
  unreadCount: number;
  layers: Layer[];
  sendMessage: (text: string) => void;
  setComposerText: (text: string) => void;
  toggleChat: () => void;
  clearConversation: () => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  clearLayers: () => void;
  navigateToRoute: (route: string) => void;
}

const INITIAL_SUGGESTIONS: Suggestion[] = [];

const BrainContext = createContext<BrainState | null>(null);

let msgCounter = 0;
let layerCounter = 0;

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
  const navigateRef = useRef<((route: string) => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  const generateResponse = useCallback((userText: string): { content: string; suggestions: Suggestion[]; newLayers?: Layer[] } => {
    const query = userText.toLowerCase();
    const results = searchNodes(query);

    if (results.length > 0) {
      const top = results.slice(0, 5);
      const newLayers: Layer[] = [];
      let content = '';

      const bestMatch = top[0];
      const bestType = bestMatch.type;
      const bestTaxon = bestMatch.taxons[0];

      const isCourse = bestType === 'course' || bestTaxon === 'cursos' || bestTaxon === 'cursos32';
      const isGlossary = bestType === 'glossary';
      const isRecipe = bestType === 'recipe' || bestTaxon === 'recetas';

      if (isCourse) {
        newLayers.push({
          id: `layer-${++layerCounter}`,
          type: 'side',
          title: bestMatch.title,
          component: 'course',
          params: {},
          resourceId: bestMatch.id,
        });
        content = `Te muestro el curso **${bestMatch.title}** relacionado con tu consulta.\n\n${bestMatch.description.slice(0, 250)}...`;
      } else if (isGlossary) {
        content = `**${bestMatch.title}**\n\n${bestMatch.description}`;
        newLayers.push({
          id: `layer-${++layerCounter}`,
          type: 'side',
          title: bestMatch.title,
          component: 'resource',
          params: { query: bestMatch.title },
          resourceId: bestMatch.id,
        });
      } else if (isRecipe) {
        newLayers.push({
          id: `layer-${++layerCounter}`,
          type: 'side',
          title: bestMatch.title,
          component: 'recipe',
          params: {},
          resourceId: bestMatch.id,
        });
        content = `Aquí tienes la receta **${bestMatch.title}**.\n\n${bestMatch.description.slice(0, 250)}...`;
      } else if (bestTaxon === 'biblioteca') {
        newLayers.push({
          id: `layer-${++layerCounter}`,
          type: 'side',
          title: bestMatch.title,
          component: 'document',
          params: {},
          resourceId: bestMatch.id,
        });
        content = `Aquí tienes el documento **${bestMatch.title}**.\n\n${bestMatch.description.slice(0, 250)}...`;
      } else {
        content = `He encontrado información relevante sobre "${userText}":\n\n`;
        top.slice(0, 4).forEach((r, i) => {
          content += `${i + 1}. **${r.title}** — ${r.description.slice(0, 120).replace(/\n/g, ' ')}...\n`;
        });
        newLayers.push({
          id: `layer-${++layerCounter}`,
          type: 'side',
          title: `Resultados: ${userText.slice(0, 30)}`,
          component: 'resource',
          params: { query: userText },
          resourceId: top[0].id,
        });
      }

      const relatedSuggestions: Suggestion[] = top.slice(0, 4).map(r => ({
        label: `Abrir "${r.title.slice(0, 28)}"`,
        action: 'layer',
        icon: r.type === 'course' ? '📚' : r.type === 'recipe' ? '🧪' : r.type === 'glossary' ? '📖' : '📄',
        payload: { resourceId: r.id },
      }));

      return {
        content,
        suggestions: [
          ...relatedSuggestions,
          ...(top.length > 1 ? [{ label: '¿Algo más específico?', action: 'preguntar', icon: '💬' }] : []),
        ],
        newLayers,
      };
    }

    return {
      content: 'No encontré resultados exactos. ¿Quieres explorar alguno de estos temas?',
      suggestions: [
        { label: '🌍 Pilares del Saber', action: 'pilares', icon: '🌍' },
        { label: '📚 Catálogo de Cursos', action: 'cursos', icon: '📚' },
        { label: '📄 Biblioteca Técnica', action: 'biblioteca', icon: '📄' },
        { label: '🧪 Recetas', action: 'recursos', icon: '🧪' },
      ],
      newLayers: [],
    };
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${++msgCounter}`,
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    const response = generateResponse(text.trim());

    const assistantMsg: Message = {
      id: `msg-${++msgCounter}`,
      role: 'assistant',
      content: response.content,
      timestamp: Date.now(),
      suggestions: response.suggestions,
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setComposerText('');

    if (!isChatOpen) {
      setUnreadCount(prev => prev + 1);
    }

    // Add layers from AI response
    if (response.newLayers && response.newLayers.length > 0) {
      setLayers(prev => [...prev, ...response.newLayers!]);
    }

    setTimeout(scrollToBottom, 100);
  }, [generateResponse, scrollToBottom, isChatOpen]);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
    setUnreadCount(0);
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

  const navigateToRoute = useCallback((route: string) => {
    if (navigateRef.current) {
      navigateRef.current(route);
    }
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
    sendMessage,
    setComposerText,
    toggleChat,
    clearConversation,
    addLayer,
    removeLayer,
    clearLayers,
    navigateToRoute,
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
