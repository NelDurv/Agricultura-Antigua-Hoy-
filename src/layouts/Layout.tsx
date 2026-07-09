import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import { useUI } from '../contexts';

export default function Layout() {
  const { dataSaver } = useUI();
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen bg-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white"
      id="app-root"
      data-data-saver={dataSaver ? 'true' : 'false'}
    >
      <Navbar />

      <AccessibilityToolbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-stone-50 border border-stone-200 shadow-xs rounded-3xl p-6 sm:p-8 min-h-[600px]" id="stage-card">
          <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><p className="font-mono text-xs text-stone-400">Cargando...</p></div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-stone-50 py-6" id="app-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-serif text-sm font-bold text-stone-900">
              Agricultura Antigua
            </p>
            <p className="text-[11px] text-stone-500">
              Preservación de saberes de la tierra y transición agroecológica científica.
            </p>
          </div>
          <div className="text-[10px] font-mono text-stone-400">
            &copy; {new Date().getFullYear()} Agricultura Antigua. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
