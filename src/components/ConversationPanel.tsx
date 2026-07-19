import React, { useRef, useEffect, useState, useCallback, type SetStateAction, type Dispatch } from "react";
import { useNavigate } from "react-router-dom";
import { Send, RotateCcw, Atom, ThumbsUp, ThumbsDown, Edit3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { useBrain } from "../contexts/BrainContext";
import type { Message, Suggestion } from "../contexts/BrainContext";
import { useAuth } from "../contexts";

const ASSISTANT_NAME_KEY = 'aa_assistant_name';

function getAssistantName(): string {
  try { return localStorage.getItem(ASSISTANT_NAME_KEY) || 'TERRA'; }
  catch { return 'TERRA'; }
}

function setAssistantName(name: string): void {
  try { localStorage.setItem(ASSISTANT_NAME_KEY, name); }
  catch { /* noop */ }
}

const AVATARS: Record<string, string> = {
  user: "\uD83D\uDC64",
  assistant: "\uD83E\uDDEC",
  system: "\uD83C\uDF31",
};

// ─── MessageItem memoizado ──────────────────────────────────
interface MessageItemProps {
  msg: Message;
  feedbackGiven: Set<string>;
  onFeedback: (id: string, rating: 'good' | 'bad') => void;
  onSuggestion: (s: Suggestion) => void;
}

const MessageItem = React.memo(function MessageItem({ msg, feedbackGiven, onFeedback, onSuggestion }: MessageItemProps) {
  return (
    <div className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-sm shrink-0 ring-1 ring-stone-200/50 ${
        msg.role === "user" ? "bg-wheat-light/30" : msg.role === "system" ? "bg-amber-50" : "bg-stone-100"
      }`}>
        {AVATARS[msg.role] || "\uD83D\uDD2C"}
      </div>
      <div className={`max-w-[95%] ${msg.role === "user" ? "items-end" : "items-start"} space-y-2`}>
        <div className={`text-xs leading-relaxed ${
          msg.role === "user"
            ? "bg-forest text-white rounded-xl rounded-tr-md px-5 py-4 text-sm leading-relaxed"
            : msg.role === "system"
            ? "bg-white text-stone-700 rounded-xl rounded-tl-md px-4 py-3 border border-stone-200 shadow-xs"
            : "text-stone-800 px-1 py-0.5"
        }`}>
          <div className="[&_em]:italic [&_strong]:font-bold [&_p]:my-0.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:text-xs [&_code]:bg-stone-100 [&_code]:px-1 [&_code]:rounded">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{msg.content}</ReactMarkdown>
          </div>
        </div>

        {msg.role === 'assistant' && (
          <div className="pt-3 border-t border-stone-100 mt-2">
            <p className="text-[9px] font-mono text-stone-400 mb-2 text-center">
              {feedbackGiven.has(msg.id + '_good') || feedbackGiven.has(msg.id + '_bad')
                ? 'Gracias por tu opinión'
                : '¿Te fue útil esta respuesta?'
              }
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => onFeedback(msg.id, 'good')}
                disabled={feedbackGiven.has(msg.id + '_good')}
                className={`flex-1 max-w-[130px] h-10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  feedbackGiven.has(msg.id + '_good')
                    ? 'bg-emerald-500 text-white shadow-md cursor-default'
                    : 'bg-white border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500 hover:shadow-sm active:scale-95'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Útil</span>
              </button>
              <button
                onClick={() => onFeedback(msg.id, 'bad')}
                disabled={feedbackGiven.has(msg.id + '_bad')}
                className={`flex-1 max-w-[130px] h-10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  feedbackGiven.has(msg.id + '_bad')
                    ? 'bg-red-400 text-white shadow-md cursor-default'
                    : 'bg-white border-2 border-red-300 text-red-500 hover:bg-red-50 hover:border-red-400 hover:shadow-sm active:scale-95'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>No</span>
              </button>
            </div>
          </div>
        )}

        {msg.suggestions && msg.suggestions.length > 0 && (
          <div className="flex flex-col gap-2 w-full pt-2">
            <p className="text-[9px] font-mono text-stone-400 text-center">Sugerencias</p>
            {msg.suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onSuggestion(s)}
                className="w-full inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-stone-200 hover:border-wheat hover:bg-wheat-light/20 hover:text-[#2C2420] text-sm font-semibold text-stone-700 transition-all shadow-sm"
              >
                <span className="text-lg shrink-0">{s.icon || "→"}</span>
                <span className="truncate">{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// ─── Composer memoizado ─────────────────────────────────────
interface ComposerProps {
  composerText: string;
  setComposerText: (text: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

const Composer = React.memo(function Composer({ composerText, setComposerText, onSend, onKeyDown, inputRef }: ComposerProps) {
  return (
    <div className="shrink-0 border-t border-stone-100 bg-white px-4 pt-3 pb-4">
      <div className="flex items-end gap-2 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus-within:border-wheat focus-within:ring-2 focus-within:ring-wheat/15 transition-all shadow-xs">
        <textarea
          ref={inputRef}
          value={composerText}
          onChange={(e) => setComposerText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Pregunta lo que necesites..."
          rows={3}
          className="flex-1 bg-transparent text-xs text-stone-800 placeholder-stone-400 resize-none outline-none max-h-36 leading-relaxed py-2"
          style={{ scrollbarWidth: "thin" }}
        />
        <button
          onClick={onSend}
          disabled={!composerText.trim()}
          className="h-8 w-8 rounded-xl bg-forest hover:bg-[#1A3A18] disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0 shadow-xs"
        >
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
      <p className="text-[8px] text-stone-400 mt-2 text-center font-mono">
        Enter para enviar · Shift+Enter para nueva línea
      </p>
    </div>
  );
});

// ─── Componente principal ───────────────────────────────────
export default function ConversationPanel() {
  const { messages, composerText, sendMessage, sendClarification, setComposerText, clearConversation, submitFeedback } = useBrain();
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());
  const [assistantName, setAssistantNameState] = useState(getAssistantName);
  const [editingName, setEditingName] = useState(false);
  const { userName } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!composerText.trim()) return;
    sendMessage(composerText);
    inputRef.current?.focus();
  }, [composerText, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleFeedback = useCallback((id: string, rating: 'good' | 'bad') => {
    submitFeedback(id, rating);
    setFeedbackGiven(prev => new Set(prev).add(id + '_' + rating));
  }, [submitFeedback]);

  const handleEditName = useCallback(() => {
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.select(), 50);
  }, []);

  const handleSaveName = useCallback(() => {
    const val = nameInputRef.current?.value.trim();
    if (val) {
      setAssistantName(val);
      setAssistantNameState(val);
    }
    setEditingName(false);
  }, []);

  const handleNameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') setEditingName(false);
  }, [handleSaveName]);

  const handleSuggestion = useCallback((s: Suggestion) => {
    if (s.action === "preguntar") {
      inputRef.current?.focus();
      return;
    }
    if (s.action === "clarify" && s.payload?.field && s.payload?.value) {
      sendClarification(s.payload.field, s.payload.value);
      return;
    }
    if (s.action === "layer" && s.payload?.resourceId) {
      const fn = (window as any).__brainOpenResource;
      if (fn) fn(s.payload.resourceId);
      return;
    }
    const routeMap: Record<string, string> = {
      pilares: "/recursos", cursos: "/campus", biblioteca: "/biblioteca",
      recursos: "/recursos", comunidad: "/comunidad", campus: "/campus",
    };
    const route = routeMap[s.action] || `/${s.action}`;
    navigate(route);
  }, [sendClarification, navigate]);

  return (
    <div className="flex flex-col h-full bg-white" id="conversation-panel">
      <div className="shrink-0 border-b border-stone-100 px-4 pt-3 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-forest to-[#1A3A18] flex items-center justify-center shadow-xs">
            <Atom className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            {editingName ? (
              <div className="flex items-center gap-1">
                <input
                  ref={nameInputRef}
                  defaultValue={assistantName}
                  onBlur={handleSaveName}
                  onKeyDown={handleNameKeyDown}
                  className="text-xs font-bold font-serif text-stone-900 bg-stone-50 border border-stone-300 rounded px-1.5 py-0.5 w-full outline-none focus:border-forest"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold font-serif text-stone-900 truncate">{assistantName}</h3>
                <button
                  onClick={handleEditName}
                  className="h-5 w-5 rounded hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-forest transition-colors shrink-0"
                  title="Cambiar nombre"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
              </div>
            )}
            <p className="text-[9px] text-forest font-mono font-medium">Agricultura Antigua</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200 max-w-[90px] truncate">
            {userName || "Invitado"}
          </span>
          <button
            onClick={clearConversation}
            className="h-8 w-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-400 flex items-center justify-center transition-all text-emerald-500 hover:text-emerald-700 group"
            title="Nueva conversación"
          >
            <RotateCcw className="h-4 w-4 group-hover:rotate-[-180deg] transition-transform duration-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden relative" id="conversation-messages">
        <div className="px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <MessageItem
              key={msg.id}
              msg={msg}
              feedbackGiven={feedbackGiven}
              onFeedback={handleFeedback}
              onSuggestion={handleSuggestion}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <Composer
        composerText={composerText}
        setComposerText={setComposerText}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />
    </div>
  );
}
