import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, X } from "lucide-react";
import Navbar from '../components/Navbar';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import { ErrorBoundary } from '../components/errors/ErrorBoundary';
import ConversationPanel from '../components/ConversationPanel';
import InterfaceOrchestrator from '../components/InterfaceOrchestrator';
import ResourceLayer from '../components/ResourceLayer';
import StructuredData from '../components/StructuredData';
import { useUI } from '../contexts';
import { useBrain, type Layer } from '../contexts/BrainContext';

function LayerPanel({ layer }: { layer: Layer }) {
  const { removeLayer } = useBrain();
  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-md overflow-hidden shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <h4 className="text-xs font-bold font-serif text-stone-900 truncate flex-1">{layer.title}</h4>
        <button
          onClick={() => removeLayer(layer.id)}
          className="h-6 w-6 rounded-lg hover:bg-stone-100 flex items-center justify-center transition-colors text-stone-400 hover:text-stone-600 shrink-0 ml-2"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)', scrollbarWidth: 'thin' }}>
        <ResourceLayer layer={layer} />
      </div>
    </div>
  );
}

export default function Layout() {
  const { dataSaver } = useUI();
  const location = useLocation();
  const navigate = useNavigate();
  const { isChatOpen, toggleChat, unreadCount, navigateToRoute, layers } = useBrain();

  // Dynamic column spans for 3-column layout: chat | layers | content
  const hasLayers = layers.length > 0;
  const chatCols = hasLayers ? 'md:col-span-3' : 'md:col-span-4';
  const layersCols = 'md:col-span-4';
  const contentCols = isChatOpen
    ? (hasLayers ? 'md:col-span-5' : 'md:col-span-8')
    : (hasLayers ? 'md:col-span-8' : 'md:col-span-12');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const ref = (window as any).__brainNavigate;
    if (ref) {
      ref.current = (route: string) => navigate(route);
    }
  }, [navigate]);

  return (
    <div
      className="h-screen flex flex-col font-sans selection:bg-wheat selection:text-[#2C2420]"
      style={{ backgroundColor: 'var(--color-bg-body)', color: 'var(--color-text-primary)' }}
      id="app-root"
      data-data-saver={dataSaver ? 'true' : 'false'}
    >
      <StructuredData />
      <Navbar />

      <AccessibilityToolbar />

      {/* 12-column grid: chat | layers | content */}
      <div className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-4 overflow-hidden">
        {/* Chat Panel */}
        <div
          id="conversation-column"
          className={`
            fixed inset-0 z-40 overflow-y-auto md:overflow-visible md:static md:z-auto
            ${isChatOpen ? 'block' : 'hidden'}
            ${chatCols} md:h-full md:min-h-0
            bg-white/95 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none
          `}
        >
          <div className="md:hidden absolute top-4 right-4 z-10">
            <button
              onClick={toggleChat}
              className="h-8 w-8 rounded-full bg-stone-900/80 text-white flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="h-full md:min-h-0 rounded-none md:rounded-xl overflow-hidden border-0 md:border border-stone-200 shadow-xs bg-white">
            <ErrorBoundary>
              <ConversationPanel />
            </ErrorBoundary>
          </div>
        </div>

        {/* Layers Column — between chat and content */}
        {hasLayers && (
          <div className={`hidden lg:flex flex-col gap-3 overflow-y-auto shrink-0 ${layersCols}`}>
            {layers.map((layer) => (
              <LayerPanel key={layer.id} layer={layer} />
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className={`col-span-full min-w-0 flex flex-col gap-4 overflow-y-auto ${contentCols}`}>
          <div className="flex items-center justify-between shrink-0">
            <button
              onClick={toggleChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200 hover:border-wheat text-[10px] font-medium text-stone-600 hover:text-[#2C2420] transition-all shadow-xs"
              title={isChatOpen ? 'Ocultar chat' : 'Abrir chat'}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{isChatOpen ? 'Ocultar asistente' : 'Mostrar asistente'}</span>
              {unreadCount > 0 && (
                <span className="h-4 min-w-[16px] px-1 rounded-full bg-forest text-white text-[8px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className="bg-stone-50 border border-stone-200 shadow-xs rounded-xl p-4 sm:p-6" id="stage-card">
            <InterfaceOrchestrator />
          </div>
        </div>
      </div>

      {/* Mobile chat toggle button */}
      <button
        onClick={toggleChat}
        className={`md:hidden fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-forest text-white shadow-lg hover:bg-forest-light transition-all flex items-center justify-center ${isChatOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      <footer className="bg-gradient-to-r from-[#2D5A27] to-[#1A3A18] py-3" id="app-footer">
        <div className="mx-auto w-[100%] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <p className="font-serif text-xs font-bold text-wheat tracking-wide">
              Agricultura Antigua
            </p>
            <span className="h-3 w-px bg-white/20 hidden sm:block" />
            <p className="text-[9px] font-mono text-white/50">
              &copy; {new Date().getFullYear()}
            </p>
            <span className="h-3 w-px bg-white/20 hidden sm:block" />
            <p className="text-[8px] font-mono text-white/30 tracking-wider uppercase">
              Hecho con 🌱 para comunidades agrícolas
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
