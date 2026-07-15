import React from 'react';
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import { useBrain, type Layer } from '../contexts/BrainContext';
import { ErrorBoundary } from './errors/ErrorBoundary';
import ResourceLayer from './ResourceLayer';
import PanelContentView from './workspace/PanelContentView';
import WidgetSlot from './workspace/widgets/WidgetSlot';

function LayerPanel({ layer }: { layer: Layer }) {
  const { removeLayer } = useBrain();

  return (
    <div className="w-full max-w-lg max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <h4 className="text-xs font-bold font-serif text-stone-900 truncate flex-1">
          {layer.title}
        </h4>
        <button
          onClick={() => removeLayer(layer.id)}
          className="h-6 w-6 rounded-lg hover:bg-stone-100 flex items-center justify-center transition-colors text-stone-400 hover:text-stone-600 shrink-0 ml-2"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 50px)', scrollbarWidth: 'thin' }}>
        <ResourceLayer layer={layer} />
      </div>
    </div>
  );
}

const PANEL_ICONS: Record<string, string> = {
  course: '📚', document: '📄', recipe: '🧪', glossary: '📖',
  calculator: '🔢', forum: '💬', module: '📋', profile: '👤',
  institution: '🏛️', schema: '🔗',
};

function WorkspacePanels() {
  const { workspace, togglePanel, closeWorkspace } = useBrain();
  if (!workspace || workspace.panels.length === 0) return null;

  const focusedPanel = workspace.panels.find(p => p.state === 'focused');
  const openPanels = workspace.panels.filter(p => p.state !== 'minimized');
  const minimizedCount = workspace.panels.filter(p => p.state === 'minimized').length;

  return (
    <div className="flex flex-col gap-3">
      {/* Panel tabs bar */}
      <div className="flex items-center gap-1 flex-wrap">
        {openPanels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => togglePanel(panel.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
              panel.state === 'focused'
                ? 'bg-wheat-light/30 text-wheat border-wheat-light/50 shadow-xs'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
            }`}
          >
            <span>{PANEL_ICONS[panel.type] || '📋'}</span>
            <span className="truncate max-w-[100px]">{panel.title}</span>
          </button>
        ))}
        {minimizedCount > 0 && (
          <span className="text-[9px] text-stone-400 font-mono ml-1">
            +{minimizedCount} min.
          </span>
        )}
        <button
          onClick={closeWorkspace}
          className="ml-auto text-[9px] text-stone-400 hover:text-stone-600 font-mono"
          title="Cerrar workspace"
        >
          ✕ cerrar
        </button>
      </div>

      {/* Focused panel content + widgets sidebar */}
      {focusedPanel && (
        <div className="flex gap-3">
          <div className="flex-1 min-w-0 bg-white border border-stone-200 rounded-xl overflow-hidden">
            <ErrorBoundary>
              <PanelContentView panel={focusedPanel} />
            </ErrorBoundary>
          </div>
          {workspace.widgets.length > 0 && (
            <div className="hidden lg:flex flex-col gap-3 w-[220px] shrink-0">
              {workspace.widgets.map(w => (
                <ErrorBoundary key={w.id}>
                  <WidgetSlot widget={w} />
                </ErrorBoundary>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Minimized panel indicator */}
      {minimizedCount > 0 && (
        <div className="flex gap-1">
          {workspace.panels.filter(p => p.state === 'minimized').map((panel) => (
            <button
              key={panel.id}
              onClick={() => togglePanel(panel.id)}
              className="flex items-center gap-1 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[9px] text-stone-500 hover:bg-stone-100"
            >
              <span>{PANEL_ICONS[panel.type] || '📋'}</span>
              <span className="truncate max-w-[60px]">{panel.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InterfaceOrchestrator() {
  const { layers, workspace } = useBrain();
  const hasFocusedPanel = workspace?.panels.some(p => p.state === 'focused');

  return (
    <div className="flex flex-col gap-4">
      {/* Workspace panels (if active) */}
      {workspace && <WorkspacePanels />}

      {/* Primary view — workspace content replaces route when panels are focused */}
      {hasFocusedPanel ? (
        <div className="min-w-0 hidden">
          <React.Suspense fallback={null}>
            <Outlet />
          </React.Suspense>
        </div>
      ) : (
        <div className="min-w-0">
          <React.Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><p className="font-mono text-xs text-stone-400">Cargando...</p></div>}>
            <Outlet />
          </React.Suspense>
        </div>
      )}

      {/* Mobile layers — rendered as fixed overlay */}
      {layers.length > 0 && (
        <div className="lg:hidden fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          {layers.map((layer) => (
            <LayerPanel key={layer.id} layer={layer} />
          ))}
        </div>
      )}
    </div>
  );
}
