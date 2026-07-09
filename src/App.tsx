import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProgressProvider, UIProvider } from './contexts';
import Layout from './layouts/Layout';
import HomeSection from './components/HomeSection';

const CampusSection = lazy(() => import('./components/CampusSection'));
const BibliotecaSection = lazy(() => import('./components/BibliotecaSection'));
const AcademiaSection = lazy(() => import('./components/AcademiaSection'));
const ComunidadSection = lazy(() => import('./components/ComunidadSection'));
const RecursosSection = lazy(() => import('./components/RecursosSection'));
const InstitucionesSection = lazy(() => import('./components/InstitucionesSection'));
const PerfilSection = lazy(() => import('./components/PerfilSection'));
const AIReadySection = lazy(() => import('./components/AIReadySection'));

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <AuthProvider>
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </AuthProvider>
    </UIProvider>
  );
}

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomeSection />} />
            <Route path="campus" element={<CampusSection />} />
            <Route path="campus/:courseId" element={<CampusSection />} />
            <Route path="biblioteca" element={<BibliotecaSection />} />
            <Route path="biblioteca/:docId" element={<BibliotecaSection />} />
            <Route path="academia" element={<AcademiaSection />} />
            <Route path="academia/:courseId" element={<AcademiaSection />} />
            <Route path="comunidad" element={<ComunidadSection />} />
            <Route path="aiready" element={<AIReadySection />} />
            <Route path="recursos" element={<RecursosSection />} />
            <Route path="instituciones" element={<InstitucionesSection />} />
            <Route path="perfil" element={<PerfilSection />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
