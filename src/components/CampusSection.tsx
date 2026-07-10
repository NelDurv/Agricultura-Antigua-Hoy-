/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Compass, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  GraduationCap,
  Lock,
  Search,
  Eye,
  EyeOff,
  CheckCircle,
  HelpCircle,
  Award,
  Sparkles,
  Info,
  Sprout,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  FileText,
  X,
  Maximize2,
  Minimize2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COURSES, BIBLIOTECA } from "../data";
import { COURSES32 } from "../data/courses32";
import { useProgress } from "../contexts";

export default function CampusSection() {
  const navigate = useNavigate();
  const { enrolledCourses } = useProgress();
  // Navigation inside the Campus tab: basic foundation catalog vs advanced 32 courses
  const [campusMode, setCampusMode] = useState<"fundamentos" | "utopia">("fundamentos");
  const [selectedRoute, setSelectedRoute] = useState<string | null>("ruta-suelo");

  // Advanced 32 Courses States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [viewDocId, setViewDocId] = useState<string | null>(null);
  const [viewMaterialId, setViewMaterial] = useState<string | null>(null);
  const [materialFullScreen, setMaterialFullScreen] = useState(false);
  const [materialFontSize, setMaterialFontSize] = useState<'lg' | 'xl'>('xl');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Track revealed Q&A answers
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});
  
  // Track completed courses (ID list) saved to localStorage
  const [completed32, setCompleted32] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("completed_courses_32");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track checked practical tests saved to localStorage
  const [checkedTests, setCheckedTests] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem("checked_tests_32");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem("completed_courses_32", JSON.stringify(completed32));
  }, [completed32]);

  useEffect(() => {
    localStorage.setItem("checked_tests_32", JSON.stringify(checkedTests));
  }, [checkedTests]);

  const toggleCourse32 = (courseId: string) => {
    setCompleted32(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleTest = (testId: string) => {
    setCheckedTests(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  const toggleAnswer = (courseId: string, qIdx: number) => {
    const key = `${courseId}-${qIdx}`;
    setRevealedAnswers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const revealAllAnswersOfCourse = (courseId: string, reveal: boolean) => {
    const newRevealed = { ...revealedAnswers };
    for (let i = 0; i < 15; i++) {
      newRevealed[`${courseId}-${i}`] = reveal;
    }
    setRevealedAnswers(newRevealed);
  };

  const resetAllProgress32 = () => {
    if (window.confirm("¿Está seguro de que desea reiniciar todo su progreso en la Ruta Avanzada Utopía de 32 cursos?")) {
      setCompleted32([]);
      setCheckedTests({});
      setRevealedAnswers({});
    }
  };

  // Helper to categorize 32 courses based on topic/number for better filtering
  const getCourseCategory = (num: number): string => {
    if (num <= 6 || num === 8 || num === 11 || num === 13 || num === 14 || num === 15) return "suelo";
    if (num === 2 || num === 4 || num === 17 || num === 18 || num === 20 || num === 21 || num === 22 || num === 23 || num === 24 || num === 25) return "biofabrica";
    if (num === 3 || num === 7 || num === 9 || num === 12 || num === 19 || num === 26 || num === 30) return "nutricion";
    return "clima-plagas"; // 5, 10, 16, 27, 28, 29, 31, 32
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "suelo": return "Suelo Sano & Fundamentos";
      case "biofabrica": return "Biofábrica & Bioles";
      case "nutricion": return "Nutrición & Quelatos";
      case "clima-plagas": return "Fisiología, Clima & Plagas";
      default: return "Especialización";
    }
  };

  // Search filter
  const filteredCourses32 = COURSES32.filter(course => {
    const categoryMatch = selectedCategory === "todos" || getCourseCategory(course.number) === selectedCategory;
    
    if (!categoryMatch) return false;
    
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = course.title.toLowerCase().includes(query);
    const objectiveMatch = course.objective.toLowerCase().includes(query);
    const numberMatch = `curso ${course.number}`.includes(query) || course.number.toString() === query;
    
    // Deep search in questions & answers
    const qAMatch = course.questions.some(q => 
      q.q.toLowerCase().includes(query) || q.a.toLowerCase().includes(query)
    );

    // Search in practical tests
    const testsMatch = course.practicalTests.some(t => t.toLowerCase().includes(query));

    // Search in farmer note
    const noteMatch = course.farmerNote?.toLowerCase().includes(query) || false;

    return titleMatch || objectiveMatch || numberMatch || qAMatch || testsMatch || noteMatch;
  });

  const progressPercentage = Math.round((completed32.length / COURSES32.length) * 100);

  // Default routes list
  const learningRoutes = [
    {
      id: "ruta-suelo",
      title: "Ruta de Manejo Regenerativo del Suelo",
      desc: "Diseñada para transitar hacia sistemas productivos sin dependencia de fertilizantes sintéticos.",
      courses: ["suelo-vivo", "biofertilizantes", "bokashi-avanzado"],
      estimatedTime: "37 horas de formación",
      steps: [
        { title: "Fase 1: Diagnóstico e Iniciación", desc: "Suelo Vivo: Microbiología y Regeneración", status: "disponible" },
        { title: "Fase 2: Elaboración de Nutrientes Líquidos", desc: "Biofertilizantes y Caldos Minerales", status: "disponible" },
        { title: "Fase 3: Optimización y Compostaje Rápido", desc: "Abonos Fermentados tipo Bokashi", status: "premium" },
      ]
    },
    {
      id: "ruta-hortalizas",
      title: "Ruta de Horticultura Orgánica Familiar",
      desc: "Perfecta para asegurar la soberanía alimentaria del hogar mediante camas biointensivas.",
      courses: ["suelo-vivo"],
      estimatedTime: "20 horas de formación",
      steps: [
        { title: "Fase 1: Preparación del Suelo de Cultivo", desc: "Suelo Vivo", status: "disponible" },
        { title: "Fase 2: Semilleros y Trasplante Orgánico", desc: "Protocolo de siembra (Ver Biblioteca)", status: "lectura" },
        { title: "Fase 3: Asociación de Cultivos y Rotación", desc: "Guía de cultivos (Próximamente)", status: "bloqueado" },
      ]
    }
  ];

  return (
    <div className="space-y-8 py-4" id="campus-section">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] text-emerald-700 tracking-wider uppercase font-semibold">Aula Interactiva de la Finca</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-emerald-700" />
            <span>Campus & Rutas de Aprendizaje</span>
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Aprende a transitar del modelo químico al biológico. Explora nuestros programas fundacionales o sumérgete en el currículum avanzado de la agricultura regenerativa.
          </p>
        </div>

        {/* Mode Selector Segmented Controls */}
        <div className="inline-flex rounded-xl bg-stone-200/70 p-1.5 self-start md:self-center border border-stone-300/40 gap-1">
          <button
            onClick={() => setCampusMode("fundamentos")}
            className={`px-6 py-3 text-sm font-bold rounded-lg transition-all ${
              campusMode === "fundamentos"
                ? "bg-white text-stone-950 shadow-xs"
                : "text-gold"
            }`}
          >
            🏫 Talleres Iniciales
          </button>
          <button
            onClick={() => setCampusMode("utopia")}
            className={`px-6 py-3 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              campusMode === "utopia"
                ? "bg-emerald-600 text-stone-50 shadow-xs"
                : "text-stone-600 hover:text-stone-950"
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span>Ruta Utopía (32 Cursos)</span>
          </button>
        </div>
      </div>

      {/* --- MODE 1: FUNDAMENTALES / TALLERES --- */}
      {campusMode === "fundamentos" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="view-fundamentos">
          {/* Left Col: Routes list */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-mono tracking-wider text-stone-500 uppercase font-semibold">Rutas de Especialidad</h3>
            <div className="space-y-3">
              {learningRoutes.map((route) => (
                <div 
                  key={route.id}
                  onClick={() => setSelectedRoute(route.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedRoute === route.id 
                      ? "bg-emerald-50/70 border-emerald-300 shadow-xs" 
                      : "bg-stone-50 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${selectedRoute === route.id ? "bg-emerald-600 text-stone-50" : "bg-stone-100 text-stone-600"}`}>
                      <Compass className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">{route.title}</h4>
                      <p className="text-[11px] text-stone-500 leading-normal line-clamp-2">{route.desc}</p>
                      <p className="text-[10px] font-mono text-emerald-800 font-semibold mt-1">{route.estimatedTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
              <h4 className="text-xs font-serif font-bold text-stone-900">¿Por qué este orden?</h4>
              <p className="text-[11px] text-stone-600 mt-1.5 leading-relaxed font-sans">
                No puedes nutrir una planta sin primero sanar el suelo donde habita. Por eso, todas nuestras rutas inician con la microbiología del suelo como pilar fundacional.
              </p>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-emerald-900 to-stone-950 text-stone-100 rounded-2xl border border-emerald-800 shadow-sm relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-800/80 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-gold" />
                </div>
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-gold">¿Listo para el siguiente nivel?</h4>
                <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
                  El <strong>Modelo Utopía</strong> reúne 32 cursos prácticos que abarcan desde el magnetismo del suelo hasta los gases fertilizantes.
                </p>
                <button 
                  onClick={() => setCampusMode("utopia")}
                  className="px-3 py-1.5 bg-gold hover:bg-yellow-500 text-stone-950 font-bold text-[10px] rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                >
                  <span>Explorar 32 Cursos</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Route detail / steps and catalog list */}
          <div className="lg:col-span-2 space-y-6">
            {selectedRoute && (
              <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900">Itinerario de Aprendizaje Progresivo</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">Sigue los pasos y aprueba las evaluaciones para desbloquear especializaciones.</p>
                  </div>
                  <Layers className="h-5 w-5 text-emerald-600" />
                </div>

                <div className="relative border-l border-stone-300 pl-6 ml-4 space-y-6 py-2">
                  {learningRoutes.find(r => r.id === selectedRoute)?.steps.map((step, idx) => {
                    const isPremium = step.status === "premium";
                    const isLocked = step.status === "bloqueado";
                    const isLecture = step.status === "lectura";
                    
                    return (
                      <div key={idx} className="relative">
                        {/* Circle indicator */}
                        <span className="absolute -left-10 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-stone-50 border border-stone-300 text-stone-500 text-xs font-bold font-mono">
                          {idx + 1}
                        </span>

                        <div className="space-y-1 font-sans">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-xs font-bold text-stone-800 uppercase tracking-tight">{step.title}</h4>
                            {isPremium && (
                              <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 text-[9px] font-mono font-semibold px-1.5 rounded border border-amber-200">
                                <Lock className="h-2.5 w-2.5 inline" /> Premium
                              </span>
                            )}
                            {isLocked && (
                              <span className="bg-stone-200 text-stone-500 text-[9px] font-mono px-1.5 rounded border border-stone-300">Bloqueado</span>
                            )}
                            {isLecture && (
                              <span className="bg-blue-50 text-blue-800 text-[9px] font-mono px-1.5 rounded border border-blue-200">Lectura Recomendada</span>
                            )}
                          </div>
                          <p className="text-sm text-stone-900 font-semibold">{step.desc}</p>
                          <p className="text-[11px] text-stone-500 leading-relaxed">
                            {isPremium 
                              ? "Requiere nivel de membresía premium o institucional para acceder a la tutoría guiada."
                              : isLocked 
                              ? "Se desbloquea automáticamente al completar y certificar los cursos precedentes de la ruta."
                              : isLecture
                              ? "Guías de referencia técnica rápidas para acompañar la asimilación del curso fundamental."
                              : "Curso disponible de forma gratuita con certificación de participación estándar."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Catalogue Header */}
            <div className="pt-2 space-y-1">
              <h3 className="font-serif text-base font-bold text-stone-900">Catálogo General de Cursos</h3>
              <p className="text-xs text-stone-500 font-sans">Inscríbete libremente en cualquiera de nuestros programas formativos de iniciación.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COURSES.map((course) => {
                const isEnrolled = enrolledCourses.includes(course.id);
                return (
                  <div key={course.id} className="bg-stone-50 border border-stone-200/80 hover:border-emerald-300 rounded-xl overflow-hidden p-4 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-100">
                          {course.category}
                        </span>
                        <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3 inline" /> {course.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif text-sm font-bold text-stone-950 truncate">{course.title}</h4>
                        {(() => {
                          const docs = BIBLIOTECA.filter(d => d.relatedCourses.includes(course.id));
                          if (docs.length === 0) return null;
                          return (
                            <button
                              onClick={(e) => { e.stopPropagation(); setViewDocId(docs[0].id); }}
                              className="shrink-0 px-2 py-1 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 text-blue-800 text-[9px] font-semibold transition-all flex items-center gap-1"
                              title="Ver material de apoyo teórico"
                            >
                              <FileText className="h-3 w-3" />
                              <span className="hidden sm:inline">Apoyo</span>
                            </button>
                          );
                        })()}
                      </div>
                      <p className="text-[11px] text-stone-600 line-clamp-3 leading-relaxed font-sans">{course.description}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-amber-500 font-semibold">★ {course.rating}</span>
                        <span className="text-[10px] font-mono text-stone-400">({course.level})</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(() => {
                          const docs = BIBLIOTECA.filter(d => d.relatedCourses.includes(course.id));
                          if (docs.length > 1) {
                            return (
                              <div className="relative group">
                                <button
                                  className="px-2 py-1.5 rounded-lg text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all flex items-center gap-1"
                                  title="Más material de apoyo"
                                >
                                  <FileText className="h-3 w-3" />
                                  <span className="text-[9px]">+{docs.length - 1}</span>
                                </button>
                                <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block bg-white border border-stone-200 rounded-xl shadow-xl p-2 w-52 z-50">
                                  {docs.slice(1).map(doc => (
                                    <button
                                      key={doc.id}
                                      onClick={() => setViewDocId(doc.id)}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] text-stone-700 hover:bg-blue-50 hover:text-blue-700 transition-colors truncate"
                                    >
                                      {doc.title}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                        <button
                          onClick={() => navigate("/academia/" + course.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            isEnrolled 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                              : course.isPremium
                              ? "bg-amber-100 text-amber-900 hover:bg-amber-200 font-semibold"
                              : "bg-emerald-600 text-stone-50 hover:bg-emerald-700"
                          }`}
                        >
                          {isEnrolled ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                              <span>Inscrito</span>
                            </>
                          ) : course.isPremium ? (
                            <>
                              <Lock className="h-3 w-3" />
                              <span>Premium</span>
                            </>
                          ) : (
                            <>
                              <span>Matricularse</span>
                              <ArrowRight className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 2: ADVANCED 32 COURSES --- */}
      {campusMode === "utopia" && (
        <div className="space-y-6" id="view-utopia-32">
          {/* Progress & Stat Banner Card */}
          <div className="p-6 bg-emerald-950 text-stone-100 rounded-3xl border border-emerald-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-800/30 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="space-y-2 relative z-10 max-w-xl">
              <span className="font-mono text-[9px] bg-emerald-800 text-gold px-2.5 py-1 rounded border border-emerald-700 font-bold uppercase tracking-wider">
                Especialización Universitaria Avanzada
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-50 leading-tight">
                Ruta del Especialista Orgánico del Modelo Utopía
              </h3>
              <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
                Domina los 32 pilares del conocimiento creados por el Dr. Edgar Quero. Lleva un registro de los cursos asimilados y las pruebas de campo ejecutadas. Completa el 100% para postular a tu certificación.
              </p>
            </div>

            <div className="bg-emerald-900/60 border border-emerald-800/80 p-4 rounded-2xl flex flex-col justify-center text-center space-y-3 relative z-10 md:w-64">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-300">Cursos completados:</span>
                <span className="text-gold font-bold">{completed32.length} de 32</span>
              </div>
              
              <div className="w-full h-3 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800 p-0.5">
                <div 
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-100">{progressPercentage}% Listo</span>
                
                {completed32.length > 0 && (
                  <button
                    onClick={resetAllProgress32}
                    className="text-[10px] font-mono text-red-300 hover:text-red-200 flex items-center gap-1 hover:underline"
                    title="Reiniciar todo el progreso de la ruta"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reiniciar</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search Engine and Category Filters Panel */}
          <div className="bg-stone-50 border border-stone-200 p-4 sm:p-5 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar en los 32 cursos por título, objetivo, pregunta o respuesta... (Ej: Silicio, orina, 27°C)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 font-sans shadow-2xs"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3.5 text-[10px] font-mono text-stone-400 hover:text-stone-700 hover:underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Segmented Category Buttons */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mr-1.5">Módulos:</span>
              {[
                { id: "todos", label: "📚 Todos (32)" },
                { id: "suelo", label: "🌱 Suelo & Bases" },
                { id: "biofabrica", label: "🧪 Biofábricas" },
                { id: "nutricion", label: "☀️ Nutrición & Quelatos" },
                { id: "clima-plagas", label: "🪲 Clima & Plagas" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all font-sans font-medium ${
                    selectedCategory === cat.id
                      ? "bg-stone-900 text-stone-50 shadow-sm"
                      : "bg-white hover:bg-stone-100 border border-stone-200 text-stone-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            {/* Search Match Helper */}
            {searchQuery && (
              <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg">
                Filtro activo: Mostrando <strong>{filteredCourses32.length}</strong> de 32 cursos que contienen <strong>"{searchQuery}"</strong>.
              </div>
            )}
          </div>

          {/* Courses List - Accordion Rows */}
          <div className="space-y-3">
            {filteredCourses32.length === 0 ? (
              <div className="p-12 bg-stone-50 border border-stone-200 border-dashed rounded-3xl text-center space-y-3">
                <p className="text-sm font-serif font-bold text-stone-700">No se encontraron cursos que coincidan con su búsqueda.</p>
                <p className="text-xs text-stone-500 font-sans">Pruebe usando otras palabras clave como "silicio", "MM", "temperatura" o "urea".</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("todos"); }}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
                >
                  Ver todos los cursos
                </button>
              </div>
            ) : (
              filteredCourses32.map((course) => {
                const isExpanded = expandedCourseId === course.id;
                const isCourseDone = completed32.includes(course.id);
                const category = getCourseCategory(course.number);

                return (
                  <div 
                    key={course.id}
                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                      isExpanded 
                        ? "border-emerald-600 shadow-md ring-1 ring-emerald-600/10" 
                        : isCourseDone 
                        ? "border-emerald-200 bg-emerald-50/20" 
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                    id={`course-32-card-${course.id}`}
                  >
                    {/* Collapsed Row Header */}
                    <div 
                      onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                      className="p-4 sm:p-5 flex flex-wrap items-center gap-2 sm:gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        {/* Course Number Badge */}
                        <span className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center font-mono text-xs sm:text-sm font-bold shrink-0 ${
                          isCourseDone
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : isExpanded
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-700"
                        }`}>
                          {course.number < 10 ? `0${course.number}` : course.number}
                        </span>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {isCourseDone && (
                              <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
                                <CheckCircle className="h-3 w-3" /> Completado
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-tight truncate">
                            {course.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 w-full sm:w-auto justify-end">
                        {/* Material de estudio button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMaterialFullScreen(false); setViewMaterial(course.id);
                          }}
                          className="px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-stone-50 text-[10px] sm:text-[11px] font-semibold tracking-wide transition-all whitespace-nowrap shadow-xs"
                          title="Leer material de estudio antes de rendir el curso"
                        >
                          <span>Material de estudio</span>
                        </button>
                        {/* Interactive complete toggle checkbox on row */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCourse32(course.id);
                          }}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isCourseDone 
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                              : "border-stone-300 hover:border-stone-400 bg-white"
                          }`}
                          title={isCourseDone ? "Marcar como pendiente" : "Marcar como aprobado"}
                        >
                        <CheckCircle2 className={`h-4 w-4 sm:h-5 sm:w-5 ${isCourseDone ? "text-emerald-600 fill-emerald-100" : "text-stone-300"}`} />
                          </button>
                          
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-stone-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-stone-500" />
                          )}
                      </div>
                    </div>

                    {/* EXPANDED CONTENT DRAWER */}
                    {isExpanded && (
                      <div className="border-t border-stone-200 bg-stone-50/50 p-5 sm:p-6 space-y-6">
                        {/* Core Objective Banner */}
                        <div className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded-xl space-y-1.5">
                          <h5 className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Sprout className="h-3.5 w-3.5" />
                            <span>Objetivo del Curso</span>
                          </h5>
                          <p className="text-xs text-stone-800 font-sans font-medium leading-relaxed">
                            {course.objective}
                          </p>
                        </div>

                        {/* Practical Field Tests (3) */}
                        <div className="space-y-3">
                          <h5 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Compass className="h-4 w-4 text-emerald-700" />
                            <span>Pruebas Prácticas de Campo (Ejecutar en la Finca)</span>
                          </h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {course.practicalTests.map((test, tIdx) => {
                              const testId = `${course.id}-test-${tIdx}`;
                              const isTestDone = checkedTests[testId];
                              
                              return (
                                <div 
                                  key={tIdx}
                                  onClick={() => toggleTest(testId)}
                                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 select-none ${
                                    isTestDone
                                      ? "bg-emerald-50/50 border-emerald-300 text-emerald-950 font-medium"
                                      : "bg-white border-stone-200 hover:border-stone-300 text-stone-700"
                                  }`}
                                >
                                  <span className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-sm border text-[10px] font-mono ${
                                    isTestDone 
                                      ? "bg-emerald-600 border-emerald-600 text-white" 
                                      : "border-stone-300 bg-stone-50"
                                  }`}>
                                    {isTestDone ? "✓" : tIdx + 1}
                                  </span>
                                  <div className="space-y-0.5">
                                    <p className="text-[10px] font-mono uppercase text-stone-400 tracking-wider font-semibold">Taller Práctico {tIdx + 1}</p>
                                    <p className="text-xs leading-normal font-sans">{test}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Q&A Section - 15 Questions with Hidden Answers */}
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                            <h5 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                              <HelpCircle className="h-4 w-4 text-amber-500" />
                              <span>Evaluación: 15 Preguntas Técnicas Obligatorias</span>
                            </h5>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => revealAllAnswersOfCourse(course.id, true)}
                                className="text-[10px] font-mono text-emerald-700 hover:text-emerald-800 hover:underline"
                              >
                                Revelar todas
                              </button>
                              <span className="text-stone-300 text-xs">|</span>
                              <button
                                onClick={() => revealAllAnswersOfCourse(course.id, false)}
                                className="text-[10px] font-mono text-stone-500 hover:text-stone-700 hover:underline"
                              >
                                Ocultar todas
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.questions.map((q, qIdx) => {
                              const answerKey = `${course.id}-${qIdx}`;
                              const isAnswerRevealed = revealedAnswers[answerKey];

                              return (
                                <div 
                                  key={qIdx}
                                  className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
                                >
                                  <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                      <span className="text-xs font-mono bg-orange-200/70 text-orange-800 px-2 py-1 rounded font-bold">
                                        Q{qIdx + 1 < 10 ? `0${qIdx + 1}` : qIdx + 1}
                                      </span>
                                      <p className="font-serif text-[18px] font-bold text-stone-900 leading-snug">
                                        {q.q}
                                      </p>
                                    </div>

                                    {/* Collapsible Hidden Answer field */}
                                    {isAnswerRevealed ? (
                                      <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg text-base text-stone-800 font-sans leading-relaxed transition-all duration-300">
                                        <p className="font-mono text-xs uppercase text-black font-bold mb-1">✓ Respuesta Técnica:</p>
                                        <p className="text-black font-sans leading-relaxed">{q.a}</p>
                                      </div>
                                    ) : (
                                      <div className="h-[54px] border-2 border-dashed border-orange-300 rounded-xl flex items-center justify-center bg-orange-100/50">
                                        <p className="text-sm font-mono text-orange-600 font-semibold">🔒 Respuesta oculta • Pulse revelar abajo</p>
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => toggleAnswer(course.id, qIdx)}
                                    className={`py-2.5 w-full rounded-xl text-sm font-mono font-bold flex items-center justify-center gap-2 transition-colors ${
                                      isAnswerRevealed 
                                        ? "bg-stone-200 hover:bg-stone-300 text-stone-700" 
                                        : "bg-gradient-to-r from-[#496d56] to-[#85b096] hover:from-[#3a5a45] hover:to-[#6d9a7d] text-white shadow-sm"
                                    }`}
                                  >
                                    {isAnswerRevealed ? (
                                      <>
                                        <EyeOff className="h-4 w-4" />
                                        <span>Ocultar Respuesta</span>
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="h-4 w-4" />
                                        <span>Revelar Respuesta</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Farmer Note / Wisdom Callout Box */}
                        {course.farmerNote && (
                          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1.5 flex items-start gap-3">
                            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <h6 className="text-[10px] font-mono font-bold text-amber-900 uppercase tracking-wider">
                                💡 Nota de Sabiduría para el Agricultor
                              </h6>
                              <p className="text-xs text-stone-800 font-serif italic leading-relaxed">
                                "{course.farmerNote}"
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Bottom Actions of Expanded Course Drawer */}
                        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <p className="text-[10px] font-mono text-stone-400">
                            Pruebas prácticas completadas: <strong>{countCourseTests(course.id)} de 3</strong>
                          </p>

                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                              onClick={() => setExpandedCourseId(null)}
                              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl transition-colors w-full sm:w-auto"
                            >
                              Cerrar Ficha
                            </button>
                            
                            <button
                              onClick={() => toggleCourse32(course.id)}
                              className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                                isCourseDone
                                  ? "bg-stone-900 hover:bg-stone-800 text-stone-50"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-stone-50"
                              }`}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>{isCourseDone ? "Curso Aprobado (Hacer Pendiente)" : "Aprobar y Completar Curso"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Master Certificate Request Footer Section */}
          {progressPercentage === 100 && (
            <div className="p-8 bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300 rounded-3xl text-center space-y-4 max-w-2xl mx-auto shadow-md">
              <Award className="h-14 w-14 text-amber-600 mx-auto animate-bounce" />
              <div className="space-y-2">
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-amber-950">¡Excelencia Lograda, Especialista Orgánico!</h4>
                <p className="text-xs text-amber-900 max-w-lg mx-auto font-sans leading-relaxed">
                  Has completado exitosamente las evaluaciones teóricas de los <strong>32 cursos fundamentales del Modelo Utopía</strong> y has registrado la ejecución de las pruebas prácticas agrícolas.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={triggerUtopiaCertificate}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Award className="h-4.5 w-4.5" />
                  <span>Obtener Certificado de Especialista Utopía</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Material de Estudio Modal */}
      {viewMaterialId && (() => {
        const course = COURSES32.find(c => c.id === viewMaterialId);
        if (!course) return null;
        return (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto transition-colors ${materialFullScreen ? 'bg-[#3f405b]/90 backdrop-blur-sm' : 'bg-[#3f405b]/40 backdrop-blur-xs'}`}>
            <div className={`relative w-full rounded-3xl bg-[#f2f1db] border border-[#85b096] shadow-2xl overflow-hidden transition-all duration-300 ${materialFullScreen ? 'max-w-7xl h-[95vh] my-0' : 'max-w-4xl my-8'}`}>
              <div className={`sticky top-0 z-10 bg-gradient-to-r from-[#3f405b] to-[#496d56] p-6 sm:p-8 text-[#f2f1db] flex items-start justify-between gap-4 ${materialFullScreen ? 'flex-shrink-0' : ''}`}>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-mono opacity-80 uppercase tracking-wider">
                    <FileText className="h-4 w-4" />
                    <span>Material de Estudio • Curso {course.number}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug truncate">{course.title}</h3>
                  <p className="text-sm text-blue-100 opacity-90 max-w-2xl line-clamp-2">{course.objective}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setMaterialFullScreen(v => !v)}
                    className="h-9 w-9 rounded-full bg-stone-900/30 hover:bg-stone-900/50 flex items-center justify-center transition-colors border border-stone-100/10"
                    aria-label={materialFullScreen ? "Minimizar vista" : "Pantalla completa"}
                    title={materialFullScreen ? "Minimizar" : "Pantalla completa"}
                  >
                    {materialFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => { setViewMaterial(null); setMaterialFullScreen(false); }}
                    className="h-9 w-9 rounded-full bg-stone-900/30 hover:bg-stone-900/50 flex items-center justify-center transition-colors border border-stone-100/10"
                    aria-label="Cerrar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Font size controls */}
              <div className="flex-shrink-0 bg-[#e8e7d1] border-b border-[#85b096] px-6 sm:px-8 py-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-[10px] font-mono font-bold text-[#496d56] uppercase tracking-wider">Tamaño:</span>
                {(['lg', 'xl'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setMaterialFontSize(size)}
                    className={`h-8 px-4 rounded-lg text-sm font-semibold transition-colors ${materialFontSize === size ? 'bg-[#496d56] text-[#f2f1db]' : 'bg-[#d3785d]/70 text-[#f2f1db] hover:bg-[#d3785d]'}`}
                    aria-label={`Tamaño de fuente ${size === 'lg' ? '20px' : '24px'}`}
                  >
                    {size === 'lg' ? '20px' : '24px'}
                  </button>
                ))}
                <span className="text-[10px] text-[#496d56] font-mono hidden sm:inline">({materialFontSize === 'lg' ? 'Mediano' : 'Grande (recomendado)'})</span>
                <span className="flex-1" />
              </div>
              <div className={`p-6 sm:p-8 overflow-y-auto space-y-8 bg-[#f2f1db] ${materialFullScreen ? 'h-[calc(95vh-186px)]' : 'max-h-[500px]'}`}>
                {course.studyContent ? (
                  <div className={`space-y-8 ${materialFontSize === 'lg' ? 'text-[20px]' : 'text-[24px]'}`}>
                    {course.id === 'c1' && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => setLightboxImage('/images/infografia-curso-1.png')}
                          className="group relative w-full max-w-2xl rounded-xl overflow-hidden border border-[#85b096]/30 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#496d56]"
                          aria-label="Ver infografía en grande"
                        >
                          <img
                            src="/images/infografia-curso-1.png"
                            alt="Infografía resumen del Curso 1"
                            className="w-full"
                          />
                          <div className="absolute inset-0 bg-[#3f405b]/0 group-hover:bg-[#3f405b]/20 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#3f405b]/80 text-[#f2f1db] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                              <Maximize2 className="h-3.5 w-3.5" /> Ampliar
                            </span>
                          </div>
                        </button>
                      </div>
                    )}
                    {course.id === 'c2' && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => setLightboxImage('/images/infografia-curso-2.png')}
                          className="group relative w-full max-w-2xl rounded-xl overflow-hidden border border-[#85b096]/30 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#496d56]"
                          aria-label="Ver infografía en grande"
                        >
                          <img
                            src="/images/infografia-curso-2.png"
                            alt="Infografía resumen del Curso 2"
                            className="w-full"
                          />
                          <div className="absolute inset-0 bg-[#3f405b]/0 group-hover:bg-[#3f405b]/20 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#3f405b]/80 text-[#f2f1db] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                              <Maximize2 className="h-3.5 w-3.5" /> Ampliar
                            </span>
                          </div>
                        </button>
                      </div>
                    )}
                    {course.studyContent.map((s, si) => (
                      <div key={si} className="space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="h-6 w-6 rounded-lg bg-[#496d56] text-[#f2f1db] flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">{si + 1}</span>
                          <div>
                            <h4 className="font-serif font-bold text-[#3f405b]">{s.topic}</h4>
                            <p className="font-mono text-[#6b7280] italic">{s.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-[#333333] leading-relaxed font-sans pl-9">{s.body}</p>
                        {s.farmerNote && (
                          <div className="ml-9 p-3 bg-[#e8e7d1] border-l-4 border-[#d3785d] rounded-r-lg text-[#3f405b] leading-relaxed">
                            <span className="font-bold block text-[10px] font-mono uppercase tracking-wider mb-0.5">Nota para el campo:</span>
                            {s.farmerNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Fallback: Q&A format for courses without studyContent */
                  <div className={`space-y-6 ${materialFontSize === 'lg' ? 'text-[20px]' : 'text-[24px]'}`}>
                    <h4 className="font-serif font-bold text-[#3f405b] border-b border-[#85b096]/30 pb-2">Guía de Estudio (Preguntas y Respuestas)</h4>
                    {course.questions.map((q, qi) => (
                      <div key={qi} className="space-y-2">
                        <h5 className="flex items-start gap-2 font-bold text-[#496d56]">
                          <span className="h-5 w-5 rounded bg-[#496d56]/20 flex items-center justify-center text-[10px] font-mono font-bold text-[#496d56] shrink-0 mt-0.5">{qi + 1}</span>
                          <span>{q.q}</span>
                        </h5>
                        <div className="ml-7 p-3 bg-[#f2f1db] border border-[#85b096]/30 rounded-lg">
                          <span className="text-[10px] font-mono font-bold text-[#496d56] uppercase tracking-wider block mb-1">Respuesta:</span>
                          <p className="text-[#333333] leading-relaxed font-sans">{q.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Practical Tests reference */}
                {course.practicalTests.length > 0 && (
                  <div className="p-4 bg-[#f2f1db] border border-[#85b096] rounded-xl space-y-2">
                    <h5 className="font-mono font-bold text-[#496d56] uppercase tracking-wider">Talleres Prácticos Relacionados</h5>
                    <ul className="space-y-1 text-[#333333] list-disc pl-4">
                      {course.practicalTests.map((t, ti) => <li key={ti}>{t}</li>)}
                    </ul>
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 bg-[#e8e7d1] border-t border-[#85b096]/30 p-4 flex items-center justify-between backdrop-blur-sm">
                <span className="text-xs text-[#496d56] font-mono">{course.studyContent ? course.studyContent.length + ' temas de estudio' : course.questions.length + ' preguntas'}</span>
                <button
                  onClick={() => { setViewMaterial(null); setMaterialFullScreen(false); }}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-stone-50 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cerrar Material
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Document Viewer Modal */}
      {viewDocId && (() => {
        const doc = BIBLIOTECA.find(d => d.id === viewDocId);
        if (!doc) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3f405b]/60 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-3xl rounded-3xl bg-[#f2f1db] border border-[#85b096] shadow-2xl overflow-hidden my-8">
              <button
                onClick={() => setViewDocId(null)}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-[#496d56]/60 text-[#f2f1db] hover:bg-[#496d56] flex items-center justify-center transition-colors border border-[#85b096]/30"
                aria-label="Cerrar documento"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="p-6 sm:p-8 pb-4 bg-gradient-to-r from-[#3f405b] to-[#496d56] text-[#f2f1db]">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-5 w-5" />
                  <span className="text-[10px] font-mono opacity-80 uppercase tracking-wider">{doc.category}</span>
                  <span className="text-[10px] font-mono opacity-60">•</span>
                  <span className="text-[10px] font-mono opacity-60">{doc.difficulty}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-50 leading-snug">{doc.title}</h3>
                <p className="text-xs text-stone-200 mt-1 opacity-80">{doc.description}</p>
              </div>
              <div className="p-6 sm:p-8 max-h-[400px] overflow-y-auto space-y-4 text-stone-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {doc.fullText}
              </div>
              <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[10px] text-stone-500">Autor: {doc.author} • {doc.date} • v{doc.version}</span>
                <button
                  onClick={() => setViewDocId(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-50 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Image lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] bg-[#3f405b]/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-[#496d56]/50 hover:bg-[#496d56] text-[#f2f1db] flex items-center justify-center transition-colors border border-[#85b096]/30"
            aria-label="Cerrar imagen"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightboxImage}
            alt="Infografía ampliada"
            className="max-w-[95vw] max-h-[95vh] w-auto h-auto rounded-xl shadow-2xl cursor-default"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );

  // Count checked practical tests for a specific course
  function countCourseTests(courseId: string) {
    let count = 0;
    for (let i = 0; i < 3; i++) {
      if (checkedTests[`${courseId}-test-${i}`]) {
        count++;
      }
    }
    return count;
  }

  // Generate a custom master certificate for 32 courses
  function triggerUtopiaCertificate() {
    alert("¡Felicidades! Se ha generado tu Certificado Oficial de Especialización en el Modelo Utopía. El registro ha quedado guardado y ya puedes presentarlo como aval de tus capacidades en la pestaña de 'Mi Perfil'.");
  }
}
