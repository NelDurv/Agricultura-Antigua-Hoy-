import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Trash2, Sprout } from "lucide-react";
import { useBrain, type Suggestion } from "../contexts/BrainContext";
import { useAuth } from "../contexts";

const AVATARS: Record<string, string> = {
  user: "\uD83D\uDC64",
  assistant: "\uD83E\uDD16",
  system: "\uD83C\uDF31",
};

export default function ConversationPanel() {
  const { messages, composerText, sendMessage, setComposerText, clearConversation, addLayer, navigateToRoute } = useBrain();
  const { userName } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!composerText.trim()) return;
    sendMessage(composerText);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (s: Suggestion) => {
    if (s.action === "preguntar") {
      inputRef.current?.focus();
      return;
    }

    if (s.action === "layer" && s.payload?.resourceId) {
      const fn = (window as any).__brainOpenResource;
      if (fn) {
        fn(s.payload.resourceId);
      }
      return;
    }

    const routeMap: Record<string, string> = {
      pilares: "/recursos",
      cursos: "/campus",
      biblioteca: "/biblioteca",
      recursos: "/recursos",
      comunidad: "/comunidad",
      campus: "/campus",
    };
    const route = routeMap[s.action] || `/${s.action}`;
    navigate(route);
    navigateToRoute(route);
  };

  return (
    <div className="flex flex-col h-full bg-white" id="conversation-panel">
      {/* Header */}
      <div className="shrink-0 border-b border-stone-100 px-4 pt-3 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-xs">
            <Sprout className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-serif text-stone-900">Asistente</h3>
            <p className="text-[9px] text-emerald-600 font-mono font-medium">Agricultura Antigua</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200 max-w-[90px] truncate">
            {userName || "Invitado"}
          </span>
          <button
            onClick={clearConversation}
            className="h-7 w-7 rounded-lg hover:bg-stone-100 flex items-center justify-center transition-colors text-stone-400 hover:text-stone-600"
            title="Nueva conversación"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }} id="conversation-messages">
        <div className="px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-sm shrink-0 ring-1 ring-stone-200/50 ${
                  msg.role === "user" ? "bg-emerald-100" : msg.role === "system" ? "bg-amber-50" : "bg-stone-100"
                }`}
              >
                {AVATARS[msg.role] || "🤖"}
              </div>

              {/* Content */}
              <div className={`max-w-[95%] ${msg.role === "user" ? "items-end" : "items-start"} space-y-2`}>
                <div
                  className={`text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-2xl rounded-tr-md px-5 py-4 text-sm leading-relaxed"
                      : msg.role === "system"
                      ? "bg-white text-stone-700 rounded-2xl rounded-tl-md px-4 py-3 border border-stone-200 shadow-xs"
                      : "text-stone-800 px-1 py-0.5"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>

                {/* Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    {msg.suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(s)}
                        className="w-[90%] inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 text-sm font-semibold text-stone-700 transition-all shadow-sm"
                      >
                        <span className="text-lg shrink-0">{s.icon || "→"}</span>
                        <span className="truncate">{s.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-stone-100 bg-white px-4 pt-3 pb-4">
        <div className="flex items-end gap-2 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/15 transition-all shadow-xs">
          <textarea
            ref={inputRef}
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregunta lo que necesites..."
            rows={3}
            className="flex-1 bg-transparent text-xs text-stone-800 placeholder-stone-400 resize-none outline-none max-h-36 leading-relaxed py-2"
            style={{ scrollbarWidth: "thin" }}
          />
          <button
            onClick={handleSend}
            disabled={!composerText.trim()}
            className="h-8 w-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0 shadow-xs"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
        <p className="text-[8px] text-stone-400 mt-2 text-center font-mono">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}
