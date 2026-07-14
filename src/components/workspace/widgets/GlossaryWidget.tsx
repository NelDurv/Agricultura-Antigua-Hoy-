import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { searchNodes, getNode } from '../../../core/knowledge/graph';
import type { Widget } from '../../../core/engine';

const GLOSSARY_KEYWORDS = [
  'hongos benéficos', 'micorriza', 'trichoderma', 'compostaje', 'bokashi',
  'bioinsumos', 'caldo sulfocálcico', 'biol', 'materia orgánica', 'humus',
  'nitrógeno', 'carbono', 'relación C/N', 'suelo vivo', 'microorganismos',
];

export default function GlossaryWidget({ widget }: { widget: Widget }) {
  const navigate = useNavigate();
  const topics = widget.params?.topics?.split(',') || [];

  const terms = useMemo(() => {
    const query = topics.join(' ');
    if (!query) return GLOSSARY_KEYWORDS.slice(0, 6);
    const nodes = searchNodes(query).filter(n => n.type === 'glossary' || n.keywords.length > 0);
    // Extract key terms from matching nodes
    const keywords = new Set<string>();
    for (const node of nodes.slice(0, 3)) {
      for (const kw of node.keywords.slice(0, 3)) {
        keywords.add(kw);
      }
    }
    return Array.from(keywords).slice(0, 6);
  }, [topics]);

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <BookOpen className="h-3 w-3 text-emerald-600" />
        <span className="text-[9px] font-bold font-mono text-stone-700 uppercase tracking-wider">Glosario</span>
      </div>
      <div className="p-3 space-y-1.5">
        {terms.map((term, i) => {
          const node = searchNodes(term)[0];
          return (
            <button
              key={i}
              onClick={() => {
                if (node) {
                  const fn = (window as any).__brainOpenResource;
                  if (fn) fn(node.id);
                }
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-emerald-50 text-left transition-colors group"
            >
              <Sparkles className="h-3 w-3 text-emerald-400 shrink-0" />
              <span className="text-[10px] font-medium text-stone-700 group-hover:text-emerald-700 truncate">
                {term}
              </span>
              <ArrowRight className="h-2.5 w-2.5 text-stone-300 group-hover:text-emerald-500 ml-auto shrink-0" />
            </button>
          );
        })}
        <button
          onClick={() => navigate('/recursos')}
          className="w-full text-[8px] font-mono text-stone-400 hover:text-emerald-600 text-center pt-1"
        >
          Ver glosario completo →
        </button>
      </div>
    </div>
  );
}
