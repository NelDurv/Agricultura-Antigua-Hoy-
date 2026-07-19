import React, { useMemo } from "react";
import { GLOSARIO } from "../data";

interface Props {
  text: string;
  className?: string;
}

export default function GlossaryTooltip({ text, className = "" }: Props) {
  const parts = useMemo(() => {
    const sortedTerms = [...GLOSARIO].sort((a, b) => b.termino.length - a.termino.length);
    const regex = new RegExp(`\\b(${sortedTerms.map(t => t.termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    const result: { type: 'text' | 'term'; value: string; definition?: string }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', value: text.slice(lastIndex, match.index) });
      }
      const matchedTerm = match[0];
      const glosarioItem = GLOSARIO.find(g => g.termino.toLowerCase() === matchedTerm.toLowerCase());
      result.push({ type: 'term', value: matchedTerm, definition: glosarioItem?.definicion });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      result.push({ type: 'text', value: text.slice(lastIndex) });
    }
    return result;
  }, [text]);

  // Si no hay términos del glosario, devolvemos el texto normal
  const hasTerms = parts.some(p => p.type === 'term');
  if (!hasTerms) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.type === 'term' ? (
          <span
            key={i}
            className="relative group cursor-help border-b border-dotted border-amber-500/50 text-amber-800"
            title={part.definition}
          >
            {part.value}
            <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-stone-100 text-[10px] leading-relaxed rounded-lg shadow-lg whitespace-normal w-64 pointer-events-none">
              {part.definition}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
            </span>
          </span>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </span>
  );
}
