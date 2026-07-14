import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Sprout, FlaskConical, BookMarked, Users, GraduationCap, ArrowRight, X } from 'lucide-react';
import { globalSearch, getSearchSuggestions } from '../core/search/engine';
import type { SearchResult } from '../core/search/engine';
import type { KnowledgeType } from '../core/knowledge/types';

const typeConfig: Record<KnowledgeType, { icon: typeof Sprout; color: string; label: string }> = {
  course: { icon: GraduationCap, color: 'text-emerald-700 bg-emerald-50', label: 'Curso' },
  article: { icon: BookOpen, color: 'text-amber-700 bg-amber-50', label: 'Artículo' },
  manual: { icon: BookMarked, color: 'text-blue-700 bg-blue-50', label: 'Manual' },
  protocol: { icon: FlaskConical, color: 'text-purple-700 bg-purple-50', label: 'Protocolo' },
  guide: { icon: BookOpen, color: 'text-teal-700 bg-teal-50', label: 'Guía' },
  infographic: { icon: BookMarked, color: 'text-pink-700 bg-pink-50', label: 'Infografía' },
  video: { icon: Sprout, color: 'text-red-700 bg-red-50', label: 'Video' },
  recipe: { icon: FlaskConical, color: 'text-orange-700 bg-orange-50', label: 'Receta' },
  glossary: { icon: BookMarked, color: 'text-indigo-700 bg-indigo-50', label: 'Glosario' },
  tool: { icon: Sprout, color: 'text-stone-700 bg-stone-50', label: 'Herramienta' },
  news: { icon: Users, color: 'text-cyan-700 bg-cyan-50', label: 'Noticia' },
  research: { icon: Sprout, color: 'text-lime-700 bg-lime-50', label: 'Investigación' },
  statistic: { icon: Sprout, color: 'text-sky-700 bg-sky-50', label: 'Estadística' },
};

interface SearchBarProps {
  placeholder?: string;
  variant?: 'default' | 'hero';
  onResultClick?: () => void;
}

export default function SearchBar({ placeholder = 'Buscar cursos, documentos, recetas...', variant = 'default', onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setResults(globalSearch(query));
    setSuggestions(getSearchSuggestions(query));
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    onResultClick?.();
    navigate(result.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = results.length ? results : suggestions.map(s => ({ id: s, title: s, url: '#' } as any));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  const isHero = variant === 'hero';

  return (
    <div className={`relative w-full ${isHero ? 'max-w-2xl mx-auto' : ''}`}>
      <div className={`relative flex items-center ${isHero ? 'bg-white/95 backdrop-blur-sm border-2 border-gold/60 shadow-xl rounded-2xl' : 'bg-stone-100 border border-stone-200 rounded-xl'} transition-all focus-within:border-gold focus-within:shadow-sm`}>
        <Search className={`absolute left-3.5 ${isHero ? 'h-5 w-5' : 'h-4 w-4'} text-stone-400 pointer-events-none`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-transparent outline-none text-stone-800 placeholder:text-stone-400 ${isHero ? 'pl-12 pr-12 py-4 text-base' : 'pl-10 pr-8 py-2.5 text-xs'}`}
          aria-label="Buscar"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }} className={`${isHero ? 'p-3' : 'p-1.5'} text-stone-400 hover:text-stone-700`}>
            <X className={isHero ? 'h-5 w-5' : 'h-3.5 w-3.5'} />
          </button>
        )}
      </div>

      {isOpen && (
        <div ref={dropdownRef} className={`absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50 ${isHero ? 'max-h-96' : 'max-h-80'} overflow-y-auto`}>
          {results.length > 0 ? (
            <div className="py-1.5">
              <p className="px-4 py-1.5 text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold">
                Resultados ({results.length})
              </p>
              {results.map((result, i) => {
                const config = typeConfig[result.type] || typeConfig.course;
                const Icon = config.icon;
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${i === selectedIndex ? 'bg-emerald-50' : 'hover:bg-stone-50'}`}
                  >
                    <div className={`p-1.5 rounded-lg ${config.color} shrink-0`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-stone-900 truncate">{result.title}</span>
                        <span className="text-[10px] font-mono text-stone-400 shrink-0">{config.label}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{result.description}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-stone-300 shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-1.5">
              <p className="px-4 py-1.5 text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold">Sugerencias</p>
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left text-xs text-stone-700 transition-colors ${i === selectedIndex ? 'bg-emerald-50' : 'hover:bg-stone-50'}`}
                >
                  <Search className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-xs text-stone-400">Sin resultados para "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}
