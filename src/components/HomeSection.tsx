/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Sprout, 
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { COURSES, BIBLIOTECA } from "../data";
import { useAuth, useUI } from "../contexts";
import SearchBar from "./SearchBar";

const HERO_SLIDES = [
  {
    badge: "Campus Virtual • Sabiduría Ancestral",
    title: "Preservamos saberes de la tierra, respaldados por la ciencia moderna.",
    description: (name: string) => <>Hola, <strong className="text-stone-100 font-semibold">{name}</strong>. Bienvenido a Agricultura Antigua. Ponemos a tu disposición guías técnicas, cursos de microbiología de suelos y herramientas interactivas diseñadas para agricultores familiares y organizaciones comunitarias.</>,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c3aa?auto=format&fit=crop&q=100&w=2400",
    showSearch: true,
  },
  {
    badge: "Agricultura Familiar • Raíces y Comunidad",
    title: "El campo en manos de quienes lo trabajan con amor y tradición.",
    description: () => "Fortalecimiento de la agricultura familiar campesina con técnicas agroecológicas, comercio justo y redes de apoyo comunitario. La soberanía alimentaria comienza en casa.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=100&w=2400",
    showSearch: false,
  },
  {
    badge: "Agricultura Ecológica • En Armonía con la Tierra",
    title: "Producir alimentos sanos respetando los ciclos naturales.",
    description: () => "Restauración de suelos con abonos verdes, control biológico de plagas y cultivos asociados. Certificación participativa para una producción realmente limpia.",
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=100&w=2400",
    showSearch: false,
  },
  {
    badge: "Campo • Microorganismos de Montaña",
    title: "Captura y multiplicación de la vida microscópica del bosque nativo.",
    description: () => "Aprende a colectar hojarasca colonizada por hongos benéficos y bacterias del bosque para revitalizar tus suelos de cultivo de forma natural y gratuita.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=100&w=2400",
    showSearch: false,
  },
  {
    badge: "Patrimonio • Agricultura de Culturas Antiguas",
    title: "Saberes milenarios que aún alimentan al mundo.",
    description: () => "Terrazas incas, camellones, waru waru y otras técnicas ancestrales que hoy inspiran la agroecología científica moderna para enfrentar el cambio climático.",
    image: "https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?auto=format&fit=crop&q=100&w=2400",
    showSearch: false,
  },
  {
    badge: "Comida Sana • De la Tierra a la Mesa",
    title: "Nutrición consciente con ingredientes reales y cultivos vivos.",
    description: () => "Recetas tradicionales con productos agroecológicos de temporada. Cocina que respeta la biodiversidad y rescata sabores ancestrales para una vida saludable.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=100&w=2400",
    showSearch: false,
  },
  {
    badge: "Agricultura Regenerativa • Suelo Vivo",
    title: "Pastoreo holístico, policultivos y captura de carbono en el suelo.",
    description: () => "Técnicas de regeneración activa que restauran ecosistemas degradados mientras producen alimentos. El suelo es la base de toda la cadena alimenticia.",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=100&w=2400",
    showSearch: false,
  },
  {
    badge: "Tecnología • Agricultura de Precisión",
    title: "Drones, sensores IoT y satélites al servicio del campo.",
    description: () => "Monitorea la salud de tus cultivos con imágenes satelitales multiespectrales, sensores de humedad del suelo y drones de aplicación selectiva. La revolución digital llegó al agro.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=100&w=2400",
    showSearch: false,
  },
  {
    badge: "Certificación • Ruta Profesional",
    title: "Conviértete en Especialista en Agroecología de Montaña.",
    description: () => "Itinerario estructurado con certificación final. Completa los 4 niveles y obtén tu credencial con código único.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?auto=format&fit=crop&q=100&w=2400",
    showSearch: false,
  },
];

export default function HomeSection() {
  const { userName } = useAuth();
  const { dataSaver } = useUI();
  const navigate = useNavigate();
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setSlideIdx((i) => (i + 1) % HERO_SLIDES.length);
    setProgress(0);
  }, []);
  const prev = useCallback(() => {
    setSlideIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = 5000;
    const step = 50;
    const id = setInterval(() => {
      setProgress((p) => {
        const nextVal = p + (step / interval) * 100;
        if (nextVal >= 100) {
          setSlideIdx((i) => (i + 1) % HERO_SLIDES.length);
          return 0;
        }
        return nextVal;
      });
    }, step);
    return () => clearInterval(id);
  }, [paused]);

  const slide = HERO_SLIDES[slideIdx];

  return (
    <div className="space-y-12 py-4" id="home-section">
      {/* Hero Carousel */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg" id="hero-banner" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {/* Slides */}
        <div className="relative min-h-[360px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[580px]">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                i === slideIdx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <img
                src={s.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-8000 ease-linear"
                style={{ transform: i === slideIdx ? "scale(1.05)" : "scale(1)" }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a]/75 via-[#1b263b]/60 to-[#415a77]/40" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-16 py-14 sm:py-20">
                <div className="w-full max-w-3xl space-y-5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold border border-gold/30 backdrop-blur-sm shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{s.badge}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl xl:text-5xl font-bold tracking-tight text-stone-50 leading-tight drop-shadow-sm">
                    {s.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-stone-300 max-w-2xl font-sans leading-relaxed drop-shadow-sm">
                    {s.description(userName)}
                  </p>
                  {s.showSearch && (
                    <div className="w-full max-w-xl mt-3">
                      <SearchBar variant="hero" placeholder="Buscar cursos, documentos, recetas..." />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-stone-900/50 hover:bg-stone-900/70 text-stone-50 flex items-center justify-center transition-all border border-stone-100/10 backdrop-blur-sm hover:scale-105 active:scale-95 shadow-md"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-stone-900/50 hover:bg-stone-900/70 text-stone-50 flex items-center justify-center transition-all border border-stone-100/10 backdrop-blur-sm hover:scale-105 active:scale-95 shadow-md"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-stone-900/30">
          <div
            className="h-full bg-gold transition-all duration-150 ease-linear rounded-full"
            style={{ width: `${paused ? 0 : progress}%` }}
          />
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setSlideIdx(i); setProgress(0); }}
              className={`transition-all duration-300 ${
                i === slideIdx
                  ? "w-8 h-2.5 bg-gold shadow-md shadow-gold/30"
                  : "w-2.5 h-2.5 bg-stone-400/50 hover:bg-stone-400/80"
              } rounded-full`}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
          <span className="ml-3 text-[10px] font-mono text-stone-400 font-medium">
            {String(slideIdx + 1).padStart(2, "0")}/{String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
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
                ? course.image.replace("q=100", "q=20").replace("w=2400", "w=400")
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
