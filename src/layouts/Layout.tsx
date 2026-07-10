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
      className="min-h-screen flex flex-col font-sans selection:bg-emerald-500 selection:text-white"
      style={{ backgroundColor: 'var(--color-bg-body)', color: 'var(--color-text-primary)' }}
      id="app-root"
      data-data-saver={dataSaver ? 'true' : 'false'}
    >
      <Navbar />

      <AccessibilityToolbar />

      <main className="flex-grow w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-stone-50 border border-stone-200 shadow-xs rounded-3xl p-4 sm:p-6 min-h-[400px]" id="stage-card">
          <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><p className="font-mono text-xs text-stone-400">Cargando...</p></div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#4f8c2a] to-[#3b5a15] py-8" id="app-footer">
        <div className="mx-auto w-[100%] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <p className="font-serif text-base font-bold text-[#ffd700] tracking-wide">
                Agricultura Antigua
              </p>
              <p className="text-[11px] text-white/70 max-w-md">
                Preservación de saberes de la tierra y transición agroecológica científica.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="h-6 w-px bg-white/20 hidden sm:block" />
              <p className="text-[10px] font-mono text-white/50">
                &copy; {new Date().getFullYear()} Agricultura Antigua.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-[9px] font-mono text-white/30 tracking-wider uppercase">
              Hecho con 🌱 para las comunidades agrícolas de Iberoamérica
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
