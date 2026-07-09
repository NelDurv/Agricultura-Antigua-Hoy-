/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight,
  BookOpen, 
  CheckCircle, 
  CheckCircle2, 
  PlayCircle, 
  Award, 
  ChevronRight, 
  Lock, 
  AlertCircle,
  HelpCircle,
  GraduationCap,
  FileText,
  X
} from "lucide-react";
import { COURSES, BIBLIOTECA } from "../data";
import type { Course, Module, Certificate, BibliotecaDoc } from "../types";
import { useAuth, useProgress } from "../contexts";

/* eslint-disable react-hooks/purity */
export default function AcademiaSection() {
  const { courseId: paramCourseId } = useParams();
  const { userName, addCertificate } = useAuth();
  const { enrolledCourses, courseProgress, completedModules, enrollCourse, completeModule } = useProgress();

  const [activeCourseId, setActiveCourseId] = useState<string | null>(paramCourseId || null);
  const initialModuleId = (() => {
    if (paramCourseId) {
      const c = COURSES.find(cr => cr.id === paramCourseId);
      return c ? c.modules[0].id : null;
    }
    return null;
  })();
  const [activeModuleId, setActiveModuleId] = useState<string | null>(initialModuleId);

  // Interactive quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState<boolean | null>(null);

  // Track which lecture modules have been studied (confirmed by student)
  const [studyConfirmedModules, setStudyConfirmedModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aa_study_confirmed');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const activeCourse = COURSES.find(c => c.id === activeCourseId);

  const handleModuleChange = useCallback((moduleId: string) => {
    setActiveModuleId(moduleId);
    setSelectedAnswer(null);
    setQuizChecked(false);
    setQuizSuccess(null);
  }, []);

  const handleEnrollClick = (courseId: string) => {
    enrollCourse(courseId);
    setActiveCourseId(courseId);
    const course = COURSES.find(c => c.id === courseId);
    if (course) {
      handleModuleChange(course.modules[0].id);
    }
  };

  const handleMarkCompleted = (course: Course, module: Module) => {
    const totalModules = course.modules.length;
    
    // Find how many modules are completed after this one
    const newCompleted = new Set(completedModules);
    newCompleted.add(module.id);
    
    const courseModules = course.modules.map(m => m.id);
    const completedInThisCourse = courseModules.filter(id => newCompleted.has(id)).length;
    const progressPercentage = Math.round((completedInThisCourse / totalModules) * 100);

    completeModule(course.id, module.id, progressPercentage);

    // Auto navigate to next module if available
    const currentIndex = course.modules.findIndex(m => m.id === module.id);
    if (currentIndex < totalModules - 1) {
      handleModuleChange(course.modules[currentIndex + 1].id);
    }
  };

  const confirmStudy = (moduleId: string) => {
    const updated = studyConfirmedModules.includes(moduleId)
      ? studyConfirmedModules
      : [...studyConfirmedModules, moduleId];
    setStudyConfirmedModules(updated);
    localStorage.setItem('aa_study_confirmed', JSON.stringify(updated));
  };

  const isPreviousModuleStudyConfirmed = (modules: Module[], currentIdx: number): boolean => {
    if (currentIdx === 0) return true;
    const prev = modules[currentIdx - 1];
    return studyConfirmedModules.includes(prev.id);
  };

  const handleCheckQuiz = (module: Module) => {
    if (selectedAnswer === null || !module.quiz) return;
    setQuizChecked(true);
    const correct = selectedAnswer === module.quiz.correctAnswer;
    setQuizSuccess(correct);
  };

  const handleGenerateCertificate = (course: Course) => {
    const uniqueCode = `AA-2026-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const cert: Certificate = {
      id: `cert-${course.id}-${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      date: new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }),
      code: uniqueCode,
      recipientName: userName || "Estudiante de Agricultura Antigua"
    };
    addCertificate(cert);
    alert(`¡Felicidades ${userName}! Se ha generado tu certificado oficial para "${course.title}". Ya puedes consultarlo o descargarlo en la pestaña 'Mi Perfil'.`);
  };

  const getModuleIcon = (type: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />;
    }
    switch (type) {
      case "lecture":
        return <BookOpen className="h-4 w-4 text-stone-400 shrink-0" />;
      case "practical":
        return <PlayCircle className="h-4 w-4 text-emerald-600 shrink-0" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />;
      default:
        return <BookOpen className="h-4 w-4 text-stone-400 shrink-0" />;
    }
  };

  const [showCatalog, setShowCatalog] = useState(false);
  const [viewDocId, setViewDocId] = useState<string | null>(null);

  // If inside the workspace of an enrolled course
  if (activeCourse && enrolledCourses.includes(activeCourse.id)) {
    const progress = courseProgress[activeCourse.id] || 0;
    const currentModule = activeCourse.modules.find(m => m.id === activeModuleId) || activeCourse.modules[0];
    const isCompleted = completedModules.includes(currentModule.id);

    return (
      <div className="space-y-6 py-4" id="academia-workspace">
        {/* Workspace Nav Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-stone-200 pb-4">
          <button
            onClick={() => setActiveCourseId(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
            id="back-to-academy-btn"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a la Academia</span>
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-mono uppercase text-stone-400">Progreso del curso</p>
              <p className="text-xs font-bold text-stone-900">{progress}% Completado</p>
            </div>
            {/* Progress Bar */}
            <div className="w-full sm:w-32 h-2.5 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Supporting Material Bar */}
        {(() => {
          const docs = BIBLIOTECA.filter(d => d.relatedCourses.includes(activeCourse.id));
          return (
          <div className="flex flex-wrap items-center gap-2 px-1">
            {docs.length > 0 && (
              <>
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider shrink-0">📖 Material de estudio:</span>
                {docs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setViewDocId(doc.id)}
                    className="px-3 py-1.5 bg-white border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl text-[11px] font-semibold text-stone-700 hover:text-emerald-800 transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <FileText className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="truncate max-w-[140px]">{doc.title}</span>
                    <ArrowRight className="h-3 w-3 text-stone-300" />
                  </button>
                ))}
              </>
            )}
          </div>
        )})()}

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Modules Index */}
          <div className="lg:col-span-1 bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-4">
            <div>
              <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-1">{activeCourse.title}</h4>
              <p className="text-[10px] text-stone-400 mt-0.5">{activeCourse.author}</p>
            </div>

            <div className="space-y-1">
              {activeCourse.modules.map((mod, idx) => {
                const modCompleted = completedModules.includes(mod.id);
                const isSelected = activeModuleId === mod.id;
                
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleChange(mod.id)}
                    className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${
                      isSelected
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium"
                        : "hover:bg-stone-100/80 border border-transparent text-stone-600"
                    }`}
                  >
                    <span className="text-[10px] font-mono mt-0.5 text-stone-400">0{idx + 1}</span>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <p className={`text-[11px] leading-tight font-serif font-semibold truncate ${isSelected ? "text-emerald-950" : "text-stone-800"}`}>
                          {mod.title}
                        </p>
                        {getModuleIcon(mod.type, modCompleted)}
                      </div>
                      <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wide">{mod.type === "lecture" ? "Teoría" : mod.type === "practical" ? "Práctica" : "Evaluación"} • {mod.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Related Documents in sidebar */}
            {(() => {
              const docs = BIBLIOTECA.filter(d => d.relatedCourses.includes(activeCourse.id));
              if (docs.length === 0) return null;
              return (
                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <p className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">Fichas Relacionadas</p>
                  <div className="space-y-1.5">
                    {docs.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => setViewDocId(doc.id)}
                        className="w-full text-left p-2 rounded-lg border border-stone-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center gap-2"
                      >
                        <FileText className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[10px] font-semibold text-stone-700 leading-tight truncate">{doc.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Certificate generation if 100% */}
            {progress === 100 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3 text-center">
                <Award className="h-7 w-7 text-amber-600 mx-auto" />
                <div>
                  <h5 className="font-serif text-xs font-bold text-amber-900">¡Capacitación Completada!</h5>
                  <p className="text-[10px] text-amber-800 mt-1 leading-snug">Ya cumples con todos los módulos y pruebas. Obtén tu certificado con registro oficial en este instante.</p>
                </div>
                <button
                  onClick={() => handleGenerateCertificate(activeCourse)}
                  className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-stone-50 text-[10px] font-bold rounded-lg transition-colors inline-flex items-center justify-center gap-1 shadow-xs"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Obtener Certificado</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Module Viewer Workspace */}
          <div className="lg:col-span-3 bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between min-h-[450px]">
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-semibold uppercase tracking-wide">
                    {currentModule.type === "lecture" ? "Módulo de Teoría" : currentModule.type === "practical" ? "Módulo de Campo Práctico" : "Evaluación de Competencia"}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 mt-1.5">{currentModule.title}</h3>
                </div>
                <span className="text-xs text-stone-400 font-mono">Duración estimada: {currentModule.duration}</span>
              </div>

              {/* Module Content: Lecture (Study Phase) */}
              {currentModule.type !== "quiz" ? (
                <div className="space-y-5">
                  {/* Study material with formatted paragraphs */}
                  <div className="space-y-4 text-stone-800 text-sm leading-relaxed font-sans">
                    {currentModule.content.split(/(?<=\.) /).map((sentence, i) => {
                      const trimmed = sentence.trim();
                      if (!trimmed) return null;
                      // Detect key concepts (phrases ending with : or containing keywords)
                      const isKeyConcept = trimmed.includes(':') && trimmed.length < 80;
                      if (isKeyConcept) {
                        return (
                          <div key={i} className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-stone-800 font-semibold">
                            {trimmed}
                          </div>
                        );
                      }
                      return <p key={i}>{trimmed}</p>;
                    })}
                  </div>

                  {/* Study confirmation */}
                  {!studyConfirmedModules.includes(currentModule.id) ? (
                    <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-3 text-center">
                      <BookOpen className="h-6 w-6 text-amber-600 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-amber-900">¿Has terminado de estudiar este contenido?</p>
                        <p className="text-[11px] text-amber-800 mt-1 leading-snug">Confirma que has leído y comprendido el material para desbloquear la evaluación correspondiente.</p>
                      </div>
                      <button
                        onClick={() => confirmStudy(currentModule.id)}
                        className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-stone-50 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Confirmar que he estudiado</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Estudio confirmado</p>
                        <p className="text-[11px] text-emerald-800">Ya puedes realizar la evaluación de este módulo.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (() => {
                const currentIdx = activeCourse.modules.findIndex(m => m.id === currentModule.id);
                const studyLocked = !isPreviousModuleStudyConfirmed(activeCourse.modules, currentIdx);
                
                return (
                <div className="space-y-6">
                  {studyLocked ? (
                    /* Locked: Must study previous module first */
                    <div className="p-8 bg-stone-100 rounded-xl border border-stone-200 text-center space-y-3">
                      <Lock className="h-8 w-8 text-stone-400 mx-auto" />
                      <div>
                        <p className="text-sm font-bold text-stone-700">Evaluación bloqueada</p>
                        <p className="text-xs text-stone-500 mt-1 leading-snug max-w-sm mx-auto">Completa primero el estudio del módulo teórico anterior para desbloquear esta evaluación.</p>
                      </div>
                      <button
                        onClick={() => handleModuleChange(activeCourse.modules[currentIdx - 1].id)}
                        className="px-4 py-2 bg-stone-700 hover:bg-stone-800 text-stone-50 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Ir al módulo teórico</span>
                      </button>
                    </div>
                  ) : (
                    /* Unlocked: Show quiz */
                    <div className="space-y-6 bg-white p-5 rounded-xl border border-stone-100">
                    <p className="text-sm text-stone-700 leading-normal font-sans">
                      {currentModule.content}
                    </p>
                    
                    {currentModule.quiz && (
                      <div className="space-y-3">
                        <p className="text-xs font-mono text-stone-400 uppercase tracking-wider font-semibold">Pregunta de Evaluación:</p>
                        <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">{currentModule.quiz.question}</h4>
                        
                        <div className="space-y-2 mt-3">
                          {currentModule.quiz.options.map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              className={`w-full p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all text-xs ${
                                selectedAnswer === oIdx
                                  ? "bg-stone-50 border-emerald-500 font-medium"
                                  : "hover:bg-stone-50 border-stone-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="quiz-opt"
                                checked={selectedAnswer === oIdx}
                                onChange={() => {
                                  if (!quizChecked) setSelectedAnswer(oIdx);
                                }}
                                disabled={quizChecked}
                                className="mt-0.5 h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500 border-stone-300"
                              />
                              <span className="text-stone-800 leading-normal">{opt}</span>
                            </label>
                          ))}
                        </div>

                        {/* Quiz Feedback block */}
                        {quizChecked && (
                          <div className={`p-4 rounded-xl flex items-start gap-2.5 text-xs ${
                            quizSuccess 
                              ? "bg-emerald-50 border border-emerald-200 text-emerald-800" 
                              : "bg-red-50 border border-red-200 text-red-800"
                          }`}>
                            {quizSuccess ? (
                              <>
                                <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                                <div>
                                  <p className="font-bold">¡Excelente respuesta!</p>
                                  <p className="mt-0.5 leading-normal">Has captado perfectamente el núcleo del contenido técnico. Puedes avanzar al siguiente módulo.</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
                                <div>
                                  <p className="font-bold">Respuesta incorrecta</p>
                                  <p className="mt-0.5 leading-normal">Te recomendamos volver a leer detenidamente el módulo teórico anterior sobre este tema e intentarlo de nuevo.</p>
                                  <button
                                    onClick={() => {
                                      setQuizChecked(false);
                                      setSelectedAnswer(null);
                                      setQuizSuccess(null);
                                    }}
                                    className="mt-2 text-red-900 font-bold hover:underline"
                                  >
                                    Reintentar Evaluación
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {!quizChecked && (
                          <button
                            onClick={() => handleCheckQuiz(currentModule)}
                            disabled={selectedAnswer === null}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-stone-50 text-xs font-semibold rounded-lg transition-all"
                          >
                            Verificar Respuesta
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  )}
                </div>
                );
              })()}
            </div>

            {/* Complete Module Button and Actions */}
            <div className="pt-6 border-t border-stone-200 flex items-center justify-between mt-8">
              <span className="text-xs text-stone-500 font-mono">
                {isCompleted ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 inline" /> Lección completada
                  </span>
                ) : (
                  "Módulo pendiente de aprobación"
                )}
              </span>

              {/* Only show Mark complete for lectures, or when quiz is successful */}
              {(currentModule.type !== "quiz" || (quizChecked && quizSuccess)) && (
                <button
                  onClick={() => handleMarkCompleted(activeCourse, currentModule)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-stone-50 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>{isCompleted ? "Continuar" : "Marcar como Completado"}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Document Viewer Modal */}
        {viewDocId && (() => {
          const doc = BIBLIOTECA.find(d => d.id === viewDocId);
          if (!doc) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto">
              <div className="relative w-full max-w-3xl rounded-3xl bg-stone-50 border border-stone-200 shadow-2xl overflow-hidden my-8">
                <button
                  onClick={() => setViewDocId(null)}
                  className="absolute top-5 right-5 h-8 w-8 rounded-full bg-stone-900/40 text-stone-100 hover:bg-stone-900/60 flex items-center justify-center transition-colors border border-stone-100/10"
                  aria-label="Cerrar documento"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="p-6 sm:p-8 pb-4 bg-primary text-stone-50">
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
      </div>
    );
  }

  // Dashboard + Academy Landing
  const enrolledCourseList = COURSES.filter(c => enrolledCourses.includes(c.id));
  const activeEnrolled = enrolledCourseList[0];
  const nextModuleItem = activeEnrolled
    ? activeEnrolled.modules.find(m => !completedModules.includes(m.id))
    : null;
  if (!activeCourseId && !showCatalog && !paramCourseId) {
    return (
      <div className="space-y-8 py-4" id="academia-dashboard">
        <div className="space-y-1">
          <span className="font-mono text-[10px] text-emerald-700 tracking-wider uppercase font-semibold">Dashboard</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Bienvenido de vuelta, {userName.split(' ')[0]}</h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Continúa tu formación agroecológica desde donde lo dejaste.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {activeEnrolled ? (
              <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4 border-b-4 border-gold shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-serif text-base font-bold text-stone-900">Continuar Aprendiendo</h3>
                  </div>
                  <button onClick={() => setShowCatalog(true)} className="text-[10px] font-mono text-primary hover:underline">Ver todos</button>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-semibold">
                        {activeEnrolled.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-stone-950 mt-1">{activeEnrolled.title}</h4>
                      <p className="text-xs text-stone-500 font-mono">Progreso: {courseProgress[activeEnrolled.id] || 0}%</p>
                      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-emerald-600 transition-all" style={{ width: `${courseProgress[activeEnrolled.id] || 0}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveCourseId(activeEnrolled.id)}
                      className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-stone-50 text-xs font-semibold rounded-xl transition-colors"
                    >
                      {nextModuleItem ? 'Continuar' : 'Revisar'}
                    </button>
                  </div>

                  {nextModuleItem && (
                    <div className="mt-4 pt-4 border-t border-stone-200 flex items-center gap-3">
                      <BookOpen className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                      <span className="text-[11px] text-stone-600">Siguiente: <strong className="text-stone-900">{nextModuleItem.title}</strong></span>
                      <span className="text-[10px] font-mono text-stone-400 ml-auto">{nextModuleItem.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4 border-b-4 border-gold/40 shadow-xs">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-base font-bold text-stone-900">Comienza tu Formación</h3>
                </div>
                <p className="text-xs text-stone-600">Aún no estás inscrito en ningún curso. Explora nuestro catálogo.</p>
                <button onClick={() => setShowCatalog(true)} className="px-4 py-2 bg-primary hover:bg-gold hover:text-stone-950 text-stone-50 text-xs font-semibold rounded-xl transition-colors">
                  Explorar Cursos
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 border-b-4 border-gold/40 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-gold" />
                <span>Tu Progreso</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl text-center">
                  <p className="text-lg font-bold text-emerald-800">{enrolledCourses.length}</p>
                  <p className="text-[10px] text-emerald-600 font-mono">Inscripciones</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl text-center">
                  <p className="text-lg font-bold text-amber-800">{completedModules.length}</p>
                  <p className="text-[10px] text-amber-600 font-mono">Módulos</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Recomendado</span>
                </h3>
              </div>
              <div className="space-y-2">
                {COURSES.filter(c => !enrolledCourses.includes(c.id)).slice(0, 3).map(course => (
                  <button
                    key={course.id}
                    onClick={() => handleEnrollClick(course.id)}
                    className="w-full text-left p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 transition-colors"
                  >
                    <p className="text-[11px] font-semibold text-stone-900 line-clamp-1">{course.title}</p>
                    <p className="text-[10px] text-stone-500 font-mono">{course.level} &bull; {course.duration}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // General Academy Catalog
  return (
    <div className="space-y-8 py-4" id="academia-landing">
      <div className="space-y-2">
        {showCatalog && (
          <button onClick={() => setShowCatalog(false)} className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-2">
            <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
          </button>
        )}
        <span className="font-mono text-[10px] text-emerald-700 tracking-wider uppercase font-semibold">Formación Profesional</span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Academia Agricultura Antigua</h2>
        <p className="text-xs text-stone-600 max-w-2xl">
          Nuestra aula virtual ofrece metodologías prácticas probadas en campo. Todos los cursos son guiados por especialistas en agroecología, con evaluaciones por competencia y emisión de certificados respaldados.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-mono tracking-wider text-stone-500 uppercase font-semibold">Oferta Académica</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            const progress = courseProgress[course.id] || 0;

            return (
              <div
                key={course.id}
                className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-100 uppercase">
                      {course.category}
                    </span>
                    {course.isPremium && (
                      <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-900 text-[9px] font-mono font-semibold px-2 py-0.5 rounded border border-amber-200">
                        <Lock className="h-2.5 w-2.5 inline" /> Premium
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif text-base font-bold text-stone-950 leading-tight">
                      {course.title}
                    </h4>
                    <p className="text-xs text-stone-500">Impartido por: {course.author}</p>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <span>Nivel: <strong className="text-stone-700 font-semibold">{course.level}</strong></span>
                    <span>Duraci&oacute;n: <strong className="text-stone-700 font-semibold">{course.duration}</strong></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 space-y-3">
                  {isEnrolled && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-stone-400">Progreso del curso</span>
                        <span className="text-emerald-700 font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-amber-500">★</span>
                      <strong className="text-stone-700">{course.rating}</strong>
                    </div>

                    {isEnrolled ? (
                      <button
                        onClick={() => {
                          setActiveCourseId(course.id);
                          const nextIncomplete = course.modules.find(m => !completedModules.includes(m.id)) || course.modules[0];
                          handleModuleChange(nextIncomplete.id);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-stone-50 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <span>{progress === 100 ? 'Ver Aula / Certificado' : 'Continuar Curso'}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnrollClick(course.id)}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <span>Inscribirse Gratis</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
