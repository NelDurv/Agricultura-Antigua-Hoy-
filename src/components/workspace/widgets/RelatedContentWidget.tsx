import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, ArrowRight, FileText, GraduationCap, FlaskConical } from 'lucide-react';
import { searchNodes, getRelatedNodes } from '../../../core/knowledge/graph';
import type { Widget } from '../../../core/engine';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  course: <GraduationCap className="h-3 w-3" />,
  recipe: <FlaskConical className="h-3 w-3" />,
  article: <FileText className="h-3 w-3" />,
  manual: <FileText className="h-3 w-3" />,
  guide: <FileText className="h-3 w-3" />,
};

export default function RelatedContentWidget({ widget }: { widget: Widget }) {
  const navigate = useNavigate();
  const topics = widget.params?.topics?.split(',') || [];

  const items = useMemo(() => {
    const query = topics.join(' ');
    if (!query) return [];

    const results = searchNodes(query);
    // Try to find related nodes for the top result
    if (results.length > 0) {
      const related = getRelatedNodes(results[0].id);
      return related.slice(0, 4);
    }
    return results.slice(0, 4);
  }, [topics]);

  if (items.length === 0) return null;

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <GitBranch className="h-3 w-3 text-emerald-600" />
        <span className="text-[9px] font-bold font-mono text-stone-700 uppercase tracking-wider">Relacionado</span>
      </div>
      <div className="p-3 space-y-1">
        {items.map((node) => {
          const isCourse = node.type === 'course';
          const isDoc = node.taxons?.some(t => t === 'biblioteca');
          return (
            <button
              key={node.id}
              onClick={() => navigate(isCourse ? '/campus' : isDoc ? '/biblioteca' : '/recursos')}
              className="w-full flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-stone-50 text-left transition-colors group"
            >
              <span className="mt-0.5 text-emerald-500 shrink-0">
                {TYPE_ICONS[node.type] || <FileText className="h-3 w-3" />}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-stone-700 group-hover:text-emerald-700 truncate leading-snug">
                  {node.title}
                </p>
                <p className="text-[8px] text-stone-400 font-mono truncate mt-0.5">
                  {node.type} · {node.taxons?.slice(0, 2).join(', ') || ''}
                </p>
              </div>
              <ArrowRight className="h-2.5 w-2.5 text-stone-300 group-hover:text-emerald-500 ml-auto mt-1 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
