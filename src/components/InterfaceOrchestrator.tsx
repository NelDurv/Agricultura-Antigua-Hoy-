import React from 'react';
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import { useBrain, type Layer } from '../contexts/BrainContext';
import ResourceLayer from './ResourceLayer';

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

export default function InterfaceOrchestrator() {
  const { layers } = useBrain();

  return (
    <div className="flex gap-4 items-stretch">
      {/* Primary view — current route */}
      <div className="flex-1 min-w-0">
        <React.Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><p className="font-mono text-xs text-stone-400">Cargando...</p></div>}>
          <Outlet />
        </React.Suspense>
      </div>

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
