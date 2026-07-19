import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout, Search, X, Home, BookOpen, GraduationCap, Users,
  Calculator, Menu
} from 'lucide-react';
import { useAuth, useBrain } from '../contexts';
import { UserMembership } from '../types';
import SearchBar from './SearchBar';
import logoInca from '../assets/icons/inca.png';

const navItems = [
  { id: 'inicio', label: 'Inicio', icon: Home, route: '/' },
  { id: 'campus', label: 'Campus', icon: Sprout, route: '/campus' },
  { id: 'biblioteca', label: 'Biblioteca', icon: BookOpen, route: '/biblioteca' },
  { id: 'academia', label: 'Academia', icon: GraduationCap, route: '/academia' },
  { id: 'comunidad', label: 'Comunidad', icon: Users, route: '/comunidad' },
  { id: 'recursos', label: 'Herramientas', icon: Calculator, route: '/recursos' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, userMembership } = useAuth();
  const { isChatOpen, toggleChat } = useBrain();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleMobileNav = (route: string) => {
    navigate(route);
    setIsMobileMenuOpen(false);
    if (isChatOpen) toggleChat();
  };

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path === '/') return 'inicio';
    return path.split('/')[1];
  };

  const getMembershipBadgeColor = (tier: UserMembership) => {
    switch (tier) {
      case UserMembership.Visitor: return 'bg-slate-100 text-slate-700 border-slate-200';
      case UserMembership.Free: return 'bg-wheat-light/20 text-wheat border-wheat-light/50';
      case UserMembership.Premium: return 'bg-amber-50 text-amber-900 border-amber-200';
      case UserMembership.Institutional: return 'bg-purple-50 text-purple-900 border-purple-200';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl h-14 items-center justify-between px-4 sm:px-6 lg:px-8 gap-2">
        {/* Logo */}
        <div
          className="flex cursor-pointer items-center space-x-2 shrink-0 transition-opacity hover:opacity-90"
          onClick={() => navigate('/')}
          id="nav-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-stone-50 shadow-xs border border-gold">
            <img src={logoInca} className="h-5 w-5" alt="Inca" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-serif text-sm sm:text-base font-bold tracking-tight text-primary leading-tight">
              Técnicas Ancestrales para la Agricultura Regenerativa y Sostenible
            </h1>
            <p className="font-sans text-[14px] text-emerald-700 italic leading-snug max-w-[400px]">
              Recordando la sabiduría agrícola tradicional para resolver los retos climáticos y de suelo de hoy.
            </p>
          </div>
        </div>

        {/* Nav items — desktop */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = getActiveTab() === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                    isActive
                      ? 'bg-wheat-light/30 text-wheat'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden h-8 w-8 rounded-xl hover:bg-stone-100 flex items-center justify-center transition-colors text-stone-500"
            aria-label="Menú"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="h-8 w-8 rounded-xl hover:bg-stone-100 flex items-center justify-center transition-colors text-stone-500"
            aria-label="Buscar"
          >
            {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${getMembershipBadgeColor(userMembership)}`}>
              {userMembership === UserMembership.Free ? 'Gratuito' :
               userMembership === UserMembership.Premium ? 'Premium' :
               userMembership === UserMembership.Institutional ? 'Institucional' : 'Visitante'}
            </span>
            <span className="text-[10px] text-stone-600 font-medium truncate max-w-[80px]">
              {userName || 'Invitado'}
            </span>
          </div>
        </div>
      </div>

      {/* Search bar dropdown */}
      {isSearchOpen && (
        <div className="border-t border-stone-100 bg-white px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <SearchBar variant="hero" placeholder="Buscar cursos, documentos, recetas..." />
          </div>
        </div>
      )}
      {/* Mobile navigation panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white shadow-lg">
          <div className="grid grid-cols-3 gap-1 p-3">
            {navItems.map((item) => {
              const isActive = getActiveTab() === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMobileNav(item.route)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-[11px] font-semibold transition-all ${
                    isActive
                      ? 'bg-wheat-light/30 text-wheat'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
