import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout, BookOpen, GraduationCap, Users, Calculator, Building2,
  User, Home, ShieldCheck, Menu, X, Bot, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts';
import { UserMembership } from '../types';
import SearchBar from './SearchBar';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, userMembership } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const getRoute = (id: string) => id === 'inicio' ? '/' : `/${id}`;

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home, route: '/' },
    { id: 'campus', label: 'Rutas & Campus', icon: Sprout, route: '/campus' },
    { id: 'biblioteca', label: 'Biblioteca', icon: BookOpen, route: '/biblioteca' },
    { id: 'academia', label: 'Academia', icon: GraduationCap, route: '/academia' },
    { id: 'comunidad', label: 'Comunidad', icon: Users, route: '/comunidad' },
    { id: 'aiready', label: 'Web AI-Ready', icon: Bot, route: '/aiready' },
    { id: 'recursos', label: 'Herramientas', icon: Calculator, route: '/recursos' },
    { id: 'instituciones', label: 'Instituciones', icon: Building2, route: '/instituciones' },
    { id: 'perfil', label: 'Mi Perfil', icon: User, route: '/perfil' },
  ];

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path === '/') return 'inicio';
    return path.split('/')[1];
  };

  const activeTab = getActiveTab();

  const getMembershipBadgeColor = (tier: UserMembership) => {
    switch (tier) {
      case UserMembership.Visitor: return 'bg-slate-100 text-slate-700 border-slate-200';
      case UserMembership.Free: return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case UserMembership.Premium: return 'bg-amber-50 text-amber-900 border-amber-200';
      case UserMembership.Institutional: return 'bg-purple-50 text-purple-900 border-purple-200';
    }
  };

  const handleNavigate = (route: string) => {
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="bg-gold text-stone-950 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest px-4 font-sans border-b border-stone-200/50">
        🏔️ Sabiduría Andina • Ciencia de Frontera de la Milpa • Campus Sostenible 🌾
      </div>

      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div
          className="flex cursor-pointer items-center space-x-2.5 transition-opacity hover:opacity-90"
          onClick={() => handleNavigate('/')}
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-stone-50 shadow-sm border border-gold">
            <Sprout className="h-5.5 w-5.5 text-gold" />
          </div>
          <div>
            <h1 className="font-serif text-base sm:text-lg font-bold tracking-tight text-stone-900 leading-tight">
              Agricultura Antigua
            </h1>
            <p className="font-mono text-[9px] text-primary font-semibold tracking-wide uppercase">
              Saberes Milenarios para Hoy
            </p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-1.5" id="nav-desktop-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.route)}
                className={`group flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-300 transform active:scale-95 border ${
                  isActive
                    ? 'bg-primary text-white shadow-md border-gold -translate-y-0.5'
                    : 'text-stone-700 bg-stone-50/50 hover:bg-emerald-50 hover:text-emerald-900 hover:-translate-y-1 hover:shadow-xs hover:border-gold/30 border-transparent'
                }`}
                id={`tab-btn-${item.id}`}
              >
                <Icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-3 ${isActive ? 'text-gold' : 'text-stone-400 group-hover:text-emerald-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global search trigger */}
        <div className="hidden md:block relative mx-1">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-600 bg-stone-50 hover:bg-emerald-50 hover:border-gold transition-all"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </button>
          {isSearchOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 z-50">
              <div className="bg-white border border-stone-200 rounded-2xl shadow-xl p-2">
                <SearchBar onResultClick={() => setIsSearchOpen(false)} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3" id="nav-user-badge">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-stone-800 font-sans">{userName}</span>
            <div className={`flex items-center gap-1 px-2 py-0.5 mt-0.5 text-[9px] font-mono tracking-wide rounded-full border ${getMembershipBadgeColor(userMembership)}`}>
              <ShieldCheck className="h-3 w-3 inline" />
              {userMembership}
            </div>
          </div>
          <button
            onClick={() => handleNavigate('/perfil')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-50 hover:border-gold transition-all duration-200 shadow-2xs"
            id="nav-profile-trigger"
          >
            <User className="h-4.5 w-4.5 text-primary" />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-700 bg-stone-100 hover:bg-stone-50 hover:border-gold transition-all duration-200 shadow-2xs"
            aria-label="Toggle Menu"
            id="nav-hamburger-trigger"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 text-stone-700" /> : <Menu className="h-5 w-5 text-stone-700" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-stone-200 bg-white overflow-hidden shadow-lg"
            id="mobile-dropdown-menu"
          >
            <div className="px-4 py-3 space-y-1.5 max-h-[calc(100vh-80px)] overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.route)}
                    className={`group flex items-center gap-3.5 w-full px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 transform active:scale-98 ${
                      isActive
                        ? 'bg-primary text-white shadow-md border-l-4 border-gold translate-x-1'
                        : 'text-stone-700 bg-stone-50/50 hover:bg-emerald-50/60 hover:text-emerald-900 hover:translate-x-2 hover:shadow-xs border border-transparent hover:border-gold/20'
                    }`}
                    id={`mobile-dropdown-item-${item.id}`}
                  >
                    <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-3 ${isActive ? 'text-gold' : 'text-stone-400 group-hover:text-emerald-600'}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between px-2 py-1 bg-stone-50 rounded-xl" id="mobile-user-card">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800 leading-none mb-1">{userName}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono tracking-wide rounded-full border ${getMembershipBadgeColor(userMembership)}`}>
                      <ShieldCheck className="h-2.5 w-2.5" />
                      {userMembership}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('/perfil')}
                  className="text-xs font-semibold text-primary hover:text-primary-dark underline"
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
