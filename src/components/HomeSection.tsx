/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Sprout, 
  Calendar,
  Sparkles
} from "lucide-react";
import { COURSES, BIBLIOTECA } from "../data";
import { useAuth, useUI } from "../contexts";
import SearchBar from "./SearchBar";

export default function HomeSection() {
  const { userName } = useAuth();
  const { dataSaver } = useUI();
  const navigate = useNavigate();

  return (
    <div className="space-y-12 py-4" id="home-section">
      {/* Hero Banner */}
      <div className="ocn-hero" id="hero-banner">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-80 w-80 rounded-full bg-gold/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl"></div>

        <div className="relative w-full space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold border border-gold/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Campus Virtual • Sabiduría Ancestral</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-50 leading-tight">
            Preservamos saberes de la tierra, respaldados por la ciencia moderna.
          </h2>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl font-sans leading-relaxed">
            Hola, <strong className="text-stone-100 font-semibold">{userName}</strong>. Bienvenido a Agricultura Antigua. Ponemos a tu disposición guías técnicas, cursos de microbiología de suelos y herramientas interactivas diseñadas para agricultores familiares y organizaciones comunitarias.
          </p>

          {/* Global Search */}
          <div className="w-full max-w-xl mt-4">
            <SearchBar variant="hero" placeholder="Buscar cursos, documentos, recetas..." />
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="home-metrics">
        {[
          { label: "Base de Saberes", value: "Una sola fuente", desc: "Contenidos no duplicados", icon: Sprout },
          { label: "Cursos Disponibles", value: "Capacitación Práctica", desc: "Inscripción libre", icon: GraduationCap },
          { label: "Documentos Técnicos", value: "100% Descargables", desc: "Formatos simplificados", icon: BookOpen },
          { label: "Certificación", value: "Código Unico", desc: "Registro Institucional", icon: ShieldCheck },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md border-b-3 border-gold flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-primary tracking-wider uppercase font-bold">{stat.label}</span>
                <Icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="mt-2.5">
                <p className="text-sm font-serif font-bold text-stone-900 leading-tight">{stat.value}</p>
                <p className="text-[10px] text-stone-500 mt-0.5">{stat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="home-featured">
        {/* Highlighted Courses (2 Cols on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Programas de Formación Activos</h3>
              <p className="text-xs text-stone-500 mt-1">Aprende con nuestro modelo ordenado en rutas de aprendizaje continuas.</p>
            </div>
            <button
              onClick={() => navigate("/academia")}
              className="text-xs font-bold text-primary hover:text-gold flex items-center gap-1 hover:underline transition-colors"
            >
              <span>Ver catálogo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="ocn-grid">
            {COURSES.slice(0, 2).map((course) => {
              const optimizedImage = dataSaver
                ? course.image.replace("q=80", "q=20").replace("w=600", "w=200")
                : course.image;
              return (
                <div 
                  key={course.id} 
                  className="ocn-card"
                >
                  <img 
                    src={optimizedImage} 
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="ocn-card-img"
                  />
                  <div className="ocn-card-body">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            {course.category}
                          </span>
                          <span className="text-[10px] font-semibold text-stone-500 uppercase font-mono">{course.level}</span>
                        </div>
                        <span className="text-xs text-stone-900 font-semibold">★ {course.rating}</span>
                      </div>
                    <h4 className="font-serif text-base font-bold text-stone-950 line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{course.description}</p>
                  </div>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-500">{course.duration} • {course.lessonsCount} módulos</span>
                    <button
                      onClick={() => navigate("/academia/" + course.id)}
                      className="ocn-btn ocn-btn-primary"
                    >
                      <span>Comenzar</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Recent Library Guides (1 Col) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Biblioteca Técnica</h3>
              <p className="text-xs text-stone-500 mt-1">Hojas y fichas listas para campo.</p>
            </div>
            <button
              onClick={() => navigate("/biblioteca")}
              className="text-xs font-bold text-primary hover:text-gold flex items-center gap-1 hover:underline transition-colors"
            >
              <span>Explorar</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {BIBLIOTECA.map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => navigate("/biblioteca/" + doc.id)}
                className="p-4 bg-white border border-stone-200 hover:border-gold rounded-xl cursor-pointer transition-all flex flex-col justify-between hover:shadow-xs border-b-2 border-gold/40 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-wider font-semibold text-primary bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{doc.version}</span>
                  </div>
                  <h4 className="font-serif text-xs font-bold text-stone-950 group-hover:text-primary transition-colors">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>
                <div className="mt-3.5 pt-2 border-t border-stone-100/60 flex items-center justify-between text-[10px] font-mono text-stone-400">
                  <span>Dificultad: <strong className="text-stone-600 font-medium">{doc.difficulty}</strong></span>
                  <span className="text-primary font-bold flex items-center gap-0.5">Leer Ficha <ArrowRight className="h-2.5 w-2.5 inline" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specializations & Routes (Learning path example) */}
      <div className="ocn-section ocn-section-light rounded-3xl" id="home-specialization">
        <div className="w-full space-y-2">
          <span className="font-mono text-[10px] text-primary tracking-wider uppercase font-bold">Ruta Profesional Certificada</span>
          <h3 className="font-serif text-2xl font-bold text-stone-900">Especialista en Agroecología de Montaña y Suelo Vivo</h3>
          <p className="text-xs leading-relaxed text-stone-600">
            Un itinerario académico estructurado para asimilar de manera integral el manejo biológico de fincas agrícolas. Diseñado con una estructura progresiva: completa cada curso para desbloquear la certificación final homologada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[
            { step: "01", title: "Manejo del Suelo", desc: "Suelo Vivo, red alimentaria y microbiología.", active: true },
            { step: "02", title: "Bioinsumos Líquidos", desc: "Elaboración de fermentados y caldos minerales.", active: true },
            { step: "03", title: "Nutrición Sólida", desc: "Compostaje termófilo y Bokashi acelerado.", active: false },
            { step: "04", title: "Manejo de Plagas", desc: "Estrategias de control biológico y vegetal.", active: false },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between h-32 transition-all ${item.active ? "bg-stone-50 border-gold/60 shadow-xs" : "bg-stone-50/50 border-stone-200/60 opacity-70"}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-stone-400">{item.step}</span>
                {item.active ? (
                  <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded font-bold font-mono border border-gold/40">Disponible</span>
                ) : (
                  <span className="text-[9px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded font-medium font-mono border border-stone-200">Próximamente</span>
                )}
              </div>
              <div className="mt-2">
                <p className="text-xs font-serif font-bold text-stone-900">{item.title}</p>
                <p className="text-[10px] text-stone-500 mt-1 line-clamp-2 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events / News Banner */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center justify-between border-b-4 border-gold shadow-xs" id="home-events">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 text-stone-950 border border-gold/40 px-2.5 py-0.5 text-[10px] font-mono tracking-wider font-bold">
            <Calendar className="h-3 w-3 text-primary" />
            <span>PRÓXIMO WEBINAR EN VIVO</span>
          </div>
          <h4 className="font-serif text-lg font-bold text-stone-900">
            Diseño Hidrológico Keyline para Captura de Agua en Terrenos Inclinados
          </h4>
          <p className="text-xs text-stone-600 max-w-2xl">
            Aprende a mapear y canalizar el agua de escorrentía para infiltrarla uniformemente en tus laderas de cultivo, eliminando la erosión y la sequía. Impartido por asesores técnicos de Agricultura Antigua.
          </p>
        </div>
        <div className="text-center md:text-right shrink-0">
          <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wide font-semibold">SÁBADO, 11 DE JULIO DE 2026</p>
          <p className="text-xs font-serif font-bold text-stone-950 mt-1">10:00 AM (Hora Local)</p>
          <button 
            onClick={() => navigate("/comunidad")}
            className="ocn-btn ocn-btn-primary"
          >
            <span>Reservar cupo</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
