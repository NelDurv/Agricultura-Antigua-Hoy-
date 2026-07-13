/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { 
  Search, 
  Download, 
  Heart, 
  ArrowRight, 
  X, 
  Info, 
  BookmarkCheck,
  Sprout
} from "lucide-react";
import { BIBLIOTECA } from "../data";
import { BibliotecaDoc } from "../types";
import { useProgress } from "../contexts";
import { getRelatedNodes } from "../core/knowledge/graph";
import GlossaryTooltip from "./GlossaryTooltip";

export default function BibliotecaSection() {
  const { docId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useProgress();

  const initialSearch = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Todos");
  const [selectedDoc, setSelectedDoc] = useState<BibliotecaDoc | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Sync initialSearch if it changes from navigation
  useEffect(() => {
    if (initialSearch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Sync docId from URL param deep link
  useEffect(() => {
    if (docId) {
      const doc = BIBLIOTECA.find(d => d.id === docId);
      if (doc) {
        setSelectedDoc(doc);
      }
    }
  }, [docId]);

  const categories = ["Todos", "Fichas Técnicas", "Protocolos", "Guías", "Manuales", "Artículos"];
  const difficulties = ["Todos", "Bajo", "Medio", "Alto"];

  const filteredDocs = BIBLIOTECA.filter((doc) => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fullText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "Todos" || doc.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "Todos" || doc.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleDownloadSimulate = (docTitle: string) => {
    setDownloadSuccess(docTitle);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 py-4" id="biblioteca-section">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12">
        <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=100&w=2400" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a]/85 via-[#1b263b]/70 to-[#415a77]/50" />
        <div className="relative z-10 space-y-2">
          <span className="font-mono text-[10px] text-gold tracking-wider uppercase font-semibold">Base de Saberes</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-50">Biblioteca Agroecológica</h2>
          <p className="text-xs text-stone-300 max-w-2xl">
            Nuestra biblioteca no es una simple carpeta de PDFs. Es una base documental estructurada donde cada artículo, protocolo y guía técnica está interconectado con cursos de la academia y validado por fuentes científicas de confianza.
          </p>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccess && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl bg-stone-900 text-stone-50 p-4 shadow-xl border border-emerald-500/30 flex items-center gap-3 animate-bounce">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Download className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold font-serif">¡Descarga Iniciada!</h5>
            <p className="text-[10px] text-stone-400 mt-0.5">La ficha técnica &quot;{downloadSuccess}&quot; ha sido exportada en formato PDF para uso sin conexión.</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-4" id="biblioteca-filters">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Escribe palabras clave para buscar (ej. compost, neem, estomas...)"
              className="w-full rounded-xl bg-stone-100 hover:bg-stone-200/50 focus:bg-stone-50 border border-stone-200 focus:border-emerald-500 text-xs pl-11 pr-4 py-3 outline-none transition-all"
              id="biblioteca-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-700"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase">Dificultad:</span>
              <div className="flex rounded-lg bg-stone-100 p-0.5 border border-stone-200">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                      selectedDifficulty === diff 
                        ? "bg-emerald-600 text-stone-50" 
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Categories filters scrollable */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none border-t border-stone-100 pt-3">
          <span className="text-[10px] font-mono text-stone-500 uppercase whitespace-nowrap">Tipo:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full border transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                  : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Docs Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="biblioteca-grid">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => {
            const isFav = favorites.includes(doc.id);
            return (
              <div 
                key={doc.id}
                className="bg-stone-50 border border-stone-200 hover:border-emerald-300 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-wider font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(doc.id);
                      }}
                      className={`p-1.5 rounded-full border transition-all ${
                        isFav 
                          ? "bg-red-50 border-red-200 text-red-500" 
                          : "bg-stone-100 border-stone-200 text-stone-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                      title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                    >
                      <Heart className="h-3.5 w-3.5 fill-current" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug group-hover:text-emerald-700 transition-colors">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-mono">Por: {doc.author}</p>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {doc.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-stone-400">
                    Dificultad: <strong className="text-stone-600 font-semibold">{doc.difficulty}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Ver documento</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center space-y-3 bg-stone-50 border border-dashed border-stone-200 rounded-3xl">
            <Info className="h-8 w-8 text-stone-400 mx-auto" />
            <h4 className="font-serif text-base font-bold text-stone-800">No se encontraron documentos</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Intenta reduciendo los filtros de búsqueda o verificando que no haya errores de ortografía. Nuestra base está centrada exclusivamente en saberes validados de agricultura limpia.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Todos");
                setSelectedDifficulty("Todos");
              }} 
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Restablecer todos los filtros
            </button>
          </div>
        )}
      </div>

      {/* Full Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto" id="biblioteca-doc-modal">
          <div className="relative w-full max-w-3xl rounded-3xl bg-stone-50 border border-stone-200 shadow-2xl overflow-hidden my-8">
            
            {/* Header image / info block */}
            <div className="p-6 sm:p-8 bg-radial from-emerald-800 to-stone-900 text-stone-100 relative">
              <button 
                onClick={() => setSelectedDoc(null)}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-stone-900/40 text-stone-100 hover:bg-stone-900/60 flex items-center justify-center transition-colors border border-stone-100/10"
                id="close-modal-btn"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="space-y-3 pr-8">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                    {selectedDoc.category}
                  </span>
                  <span className="text-[10px] font-mono text-stone-300">Versión: {selectedDoc.version}</span>
                  <span className="text-[10px] font-mono text-stone-300">| Licencia: {selectedDoc.licencia}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 leading-tight">
                  {selectedDoc.title}
                </h3>
                <p className="text-xs text-stone-300 max-w-xl">
                  {selectedDoc.description}
                </p>
              </div>
            </div>

            {/* Document stats */}
            <div className="px-6 py-3.5 bg-stone-100 border-b border-stone-200 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono text-stone-500">
              <span>Autor: <strong className="text-stone-700 font-medium">{selectedDoc.author}</strong></span>
              <span>Fecha: <strong className="text-stone-700 font-medium">{selectedDoc.date}</strong></span>
              <span>Cultivo sugerido: <strong className="text-stone-700 font-medium">{selectedDoc.cultivo}</strong></span>
              <span>Descargas: <strong className="text-stone-700 font-medium">{selectedDoc.downloads + (favorites.includes(selectedDoc.id) ? 1 : 0)}</strong></span>
            </div>

            {/* Document Body */}
            <div className="p-6 sm:p-8 max-h-[400px] overflow-y-auto space-y-6">
              {/* Main text content */}
                  <div className="space-y-4 text-stone-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    <GlossaryTooltip text={selectedDoc.fullText} />
                  </div>

              {/* Related Courses (Chapter 2 principle - relational architecture) */}
              {selectedDoc.relatedCourses.length > 0 && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
                  <h5 className="font-serif text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <BookmarkCheck className="h-4 w-4" />
                    <span>Cursos Académicos Relacionados:</span>
                  </h5>
                  <p className="text-[11px] text-emerald-800 leading-normal">
                    Este documento es lectura mandatoria o de apoyo para asimilar profundamente las lecciones prácticas de:
                  </p>
                  <div className="flex gap-2 mt-1">
                    {selectedDoc.relatedCourses.map((courseId) => (
                      <button
                        key={courseId}
                        onClick={() => {
                          setSelectedDoc(null);
                          navigate("/academia/" + courseId);
                        }}
                        className="px-3 py-1 bg-emerald-600 text-stone-50 hover:bg-emerald-700 text-[10px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>Ir al Curso en Academia</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Knowledge Graph: Related Content */}
              {(() => {
                const related = getRelatedNodes(selectedDoc.id);
                if (related.length === 0) return null;
                return (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-2">
                    <h5 className="font-serif text-xs font-bold text-amber-900 flex items-center gap-1">
                      <Sprout className="h-4 w-4" />
                      <span>Contenido Relacionado</span>
                    </h5>
                    <p className="text-[11px] text-amber-800">Otros recursos vinculados a este documento:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {related.slice(0, 6).map((node) => {
                        const typeBadge = {
                          course: 'bg-emerald-100 text-emerald-800',
                          recipe: 'bg-orange-100 text-orange-800',
                          glossary: 'bg-indigo-100 text-indigo-800',
                          protocol: 'bg-purple-100 text-purple-800',
                          guide: 'bg-teal-100 text-teal-800',
                          article: 'bg-amber-100 text-amber-800',
                        }[node.type] || 'bg-stone-100 text-stone-800';
                        return (
                          <button
                            key={node.id}
                            onClick={() => {
                              setSelectedDoc(null);
                              const urlMap: Record<string, string> = {
                                course: `/academia/${node.id}`,
                                recipe: '/recursos',
                                glossary: '/recursos',
                              };
                              navigate(urlMap[node.type] || '/biblioteca');
                            }}
                            className="px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-transparent hover:border-amber-300"
                            style={{ backgroundColor: typeBadge.split(' ')[0], color: typeBadge.split(' ')[1] }}
                          >
                            <span>{node.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Verifiable scientific sources (Chapter 2 principle - verifiable source) */}
              <div className="space-y-2 pt-4 border-t border-stone-200">
                <h5 className="font-serif text-xs font-bold text-stone-900 uppercase tracking-tight">Fuentes Verificables y Bibliografía:</h5>
                <ul className="space-y-1 list-disc pl-4 text-stone-600 text-xs font-sans">
                  {selectedDoc.sources.map((source, idx) => (
                    <li key={idx}>{source}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer with actions */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => toggleFavorite(selectedDoc.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  favorites.includes(selectedDoc.id)
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-stone-200 text-stone-700 hover:bg-stone-300 border border-stone-300"
                }`}
              >
                <Heart className={`h-4 w-4 ${favorites.includes(selectedDoc.id) ? "fill-current text-red-500" : ""}`} />
                <span>{favorites.includes(selectedDoc.id) ? "Guardado en Favoritos" : "Guardar en Favoritos"}</span>
              </button>

              <button
                onClick={() => handleDownloadSimulate(selectedDoc.title)}
                className="px-4 py-2 bg-emerald-600 text-stone-50 hover:bg-emerald-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="h-4 w-4" />
                <span>Descargar Ficha en PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
