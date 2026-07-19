import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, GraduationCap, FileText, Clock, User, Sparkles, Tag } from 'lucide-react';
import { useBrain } from '../../contexts/BrainContext';
import { searchNodes, getNode } from '../../core/knowledge/graph';
import { COURSES32, BIBLIOTECA, RECETAS } from '../../data';
import type { Panel } from '../../core/engine';

function CoursePanelView({ panel }: { panel: Panel }) {
  const navigate = useNavigate();
  const resourceId = panel.params?.resourceId;
  const course = useMemo(() => {
    if (!resourceId) return null;
    return COURSES32.find(c => c.id === resourceId) || null;
  }, [resourceId]);

  const nodeInfo = useMemo(() => {
    if (!resourceId) return null;
    return getNode(resourceId);
  }, [resourceId]);

  if (!course || !nodeInfo) {
    return (
      <div className="p-6 text-center">
        <GraduationCap className="h-8 w-8 text-stone-300 mx-auto mb-2" />
        <p className="text-xs text-stone-500">Información del curso no disponible</p>
        {resourceId && (
          <button onClick={() => navigate(`/campus/${resourceId}`)}
            className="mt-3 text-xs text-primary hover:text-gold font-medium inline-flex items-center gap-1">
            Ver en campus <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <GraduationCap className="h-5 w-5 text-emerald-700" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold font-serif text-stone-900 line-clamp-2">{course.title}</h4>
          <p className="text-[10px] text-stone-500 mt-1 font-mono">Curso {course.number} de 32</p>
        </div>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed">{course.objective}</p>
      {course.questions.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">Preguntas clave</h5>
          {course.questions.slice(0, 3).map((q, i) => (
            <div key={i} className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
              <p className="text-[10px] font-medium text-stone-800 leading-snug">{q.q}</p>
              <p className="text-[9px] text-stone-500 mt-1 leading-snug line-clamp-2">{q.a}</p>
            </div>
          ))}
        </div>
      )}
      {course.practicalTests.length > 0 && (
        <div className="space-y-1.5">
          <h5 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">Pruebas prácticas</h5>
          {course.practicalTests.slice(0, 2).map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-[10px] text-stone-600">
              <span className="h-4 w-4 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5">{i + 1}</span>
              <span className="leading-snug">{t}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => navigate('/campus')}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5">
        <span>Ir al curso completo</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function DocumentPanelView({ panel }: { panel: Panel }) {
  const navigate = useNavigate();
  const { closeWorkspace } = useBrain();
  const resourceId = panel.params?.resourceId;
  const doc = useMemo(() => {
    if (!resourceId) return null;
    return BIBLIOTECA.find(d => d.id === resourceId) || null;
  }, [resourceId]);

  const handleLeer = useCallback(() => {
    closeWorkspace();
    navigate(`/biblioteca/${doc?.id}`);
  }, [closeWorkspace, navigate, doc]);

  if (!doc) {
    return (
      <div className="p-6 text-center">
        <FileText className="h-8 w-8 text-stone-300 mx-auto mb-2" />
        <p className="text-xs text-stone-500">Documento no disponible</p>
        <button onClick={() => navigate('/biblioteca')}
          className="mt-3 text-xs text-primary hover:text-gold font-medium inline-flex items-center gap-1">
          Ir a biblioteca <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <FileText className="h-5 w-5 text-amber-700" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">{doc.category}</span>
            <span className="text-[9px] text-stone-400 font-mono">v{doc.version}</span>
          </div>
          <h4 className="text-sm font-bold font-serif text-stone-900 mt-1 line-clamp-2">{doc.title}</h4>
        </div>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed line-clamp-4">{doc.description}</p>
      <div className="flex items-center gap-3 text-[10px] text-stone-500 font-mono">
        <span className="flex items-center gap-1"><User className="h-3 w-3" />{doc.author}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{doc.date}</span>
        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">{doc.difficulty}</span>
      </div>
      <button onClick={handleLeer}
        className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-1">
        <BookOpen className="h-3.5 w-3.5" />
        <span>Leer</span>
      </button>
    </div>
  );
}

function RecipePanelView({ panel }: { panel: Panel }) {
  const navigate = useNavigate();
  const resourceId = panel.params?.resourceId;
  const recipe = useMemo(() => {
    if (!resourceId) return null;
    return RECETAS.find(r => r.id === resourceId) || null;
  }, [resourceId]);

  if (!recipe) {
    return (
      <div className="p-6 text-center">
        <FlaskConical className="h-8 w-8 text-stone-300 mx-auto mb-2" />
        <p className="text-xs text-stone-500">Receta no disponible</p>
        <button onClick={() => navigate('/recursos')}
          className="mt-3 text-xs text-primary hover:text-gold font-medium inline-flex items-center gap-1">
          Ver recetas <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <FlaskConical className="h-5 w-5 text-blue-700" />
        </div>
        <div className="min-w-0">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{recipe.categoria}</span>
          <h4 className="text-sm font-bold font-serif text-stone-900 mt-1">{recipe.titulo}</h4>
          <p className="text-[10px] text-stone-500 mt-0.5">{recipe.tiempo} • {recipe.ingredientes.length} ingredientes</p>
        </div>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed">{recipe.descripcion}</p>
      {recipe.ingredientes.length > 0 && (
        <div className="space-y-1.5">
          <h5 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">Ingredientes</h5>
          <ul className="space-y-1">
            {recipe.ingredientes.slice(0, 6).map((ing, i) => (
              <li key={i} className="flex items-center gap-2 text-[10px] text-stone-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => navigate('/recursos')}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5">
        <span>Ver receta completa</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function NodeDetailPanelView({ panel }: { panel: Panel }) {
  const navigate = useNavigate();
  const resourceId = panel.params?.resourceId;
  const node = useMemo(() => {
    if (!resourceId) return null;
    return getNode(resourceId);
  }, [resourceId]);

  if (!node) {
    return (
      <div className="p-6 text-center">
        <Sparkles className="h-8 w-8 text-stone-300 mx-auto mb-2" />
        <p className="text-xs text-stone-500">Información no disponible</p>
      </div>
    );
  }

  const categoryLabel: Record<string, string> = {
    glossary: 'Glosario',
    research: 'Investigación',
    statistic: 'Dato Clave',
    article: 'Artículo',
    news: 'Comunidad',
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-purple-700" />
        </div>
        <div className="min-w-0">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
            {categoryLabel[node.type] || node.type}
          </span>
          <h4 className="text-sm font-bold font-serif text-stone-900 mt-1">{node.title}</h4>
        </div>
      </div>
      <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
        {node.fullText || node.description}
      </div>
      {node.keywords && node.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {node.keywords.slice(0, 8).map((kw, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-[9px] font-mono text-stone-600">
              <Tag className="h-2.5 w-2.5" />
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceListPanelView({ panel }: { panel: Panel }) {
  const navigate = useNavigate();
  const query = panel.params?.search || '';
  const results = useMemo(() => {
    if (!query) return [];
    return searchNodes(query).slice(0, 5);
  }, [query]);

  if (results.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-xs text-stone-500">No se encontraron resultados</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {results.map((node) => {
        const isCourse = node.type === 'course';
        const isDoc = node.taxons.some(t => t === 'biblioteca');
        return (
          <button key={node.id}
            onClick={() => navigate(isCourse ? '/campus' : isDoc ? '/biblioteca' : '/recursos')}
            className="w-full p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 hover:border-emerald-200 text-left transition-all group">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">{isCourse ? '📚' : isDoc ? '📄' : '📋'}</span>
              <div className="min-w-0">
                <h5 className="text-xs font-bold font-serif text-stone-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">{node.title}</h5>
                <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2 leading-snug">{node.description}</p>
                <span className="text-[9px] text-primary font-mono font-medium mt-1 inline-flex items-center gap-0.5">
                  Ver más <ArrowRight className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function PanelContentView({ panel }: { panel: Panel }) {
  switch (panel.type) {
    case 'course':
      return <CoursePanelView panel={panel} />;
    case 'document':
      return <DocumentPanelView panel={panel} />;
    case 'recipe':
      return <RecipePanelView panel={panel} />;
    case 'glossary':
    case 'module':
    case 'profile':
    case 'institution':
    case 'schema':
      return <NodeDetailPanelView panel={panel} />;
    default:
      return (
        <div className="p-4 space-y-2">
          <h4 className="text-sm font-bold font-serif text-stone-900">{panel.title}</h4>
          {panel.params?.search && (
            <ResourceListPanelView panel={panel} />
          )}
          {panel.params?.resourceId && !panel.params?.search && (
            <NodeDetailPanelView panel={panel} />
          )}
        </div>
      );
  }
}
