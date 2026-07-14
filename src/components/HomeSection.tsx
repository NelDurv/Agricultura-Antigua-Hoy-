import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sprout, Calendar, Sparkles, ChevronLeft, ChevronRight, Star, BookOpen } from "lucide-react";
import { BIBLIOTECA, PILARES, MITOS, RECETAS, NUMEROS_CLAVE, CASOS_EXITO, GLOSARIO } from "../data";
import { useAuth, useUI } from "../contexts";
import SearchBar from "./SearchBar";
import { PageRenderer } from "./blocks";
import type { PageBlock, StatItem, CardItem, FeatureItem } from "./blocks";

const HERO_SLIDES = [
  {
    badge: "Campus Virtual • Sabiduría Ancestral",
    title: "Preservamos saberes de la tierra, respaldados por la ciencia moderna.",
    description: (name: string) => <>Hola, <strong className="text-stone-100 font-semibold">{name}</strong>. Bienvenido a Agricultura Antigua. Ponemos a tu disposición guías técnicas, cursos de microbiología de suelos y herramientas interactivas diseñadas para agricultores familiares y organizaciones comunitarias.</>,
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=100&w=2400",
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

  const blocks: PageBlock[] = [
    /* Stats Block */
    {
      type: 'stats',
      id: 'metrics',
      props: {
        columns: 4,
        items: [0, 1, 5, 2].map((idx): StatItem => {
          const item = NUMEROS_CLAVE[idx];
          return { icon: '🌱', value: item.valor, label: item.label };
        }),
      },
    },

    /* Featured Content - Two Column Layout */
    {
      type: 'two-column',
      id: 'featured',
      props: {
        left: {
          width: 5,
          content: (
            <div className="space-y-6">
              <PageRenderer blocks={[
                {
                  type: 'card-grid',
                  id: 'pilares',
                  props: {
                    title: 'Pilares del Saber',
                    description: 'Fundamentos de la transición agroecológica científica.',
                    columns: 2,
                    items: PILARES.filter(p => p.id !== 'bioinsumos').map((p): CardItem => ({
                      id: p.id, icon: p.icono, title: p.titulo, description: p.descripcion,
                      badge: p.subtitulo,
                      meta: [{ label: 'Temas', value: String(p.temas.length) }],
                      link: '/recursos',
                    })),
                  },
                },
                {
                  type: 'card-grid',
                  id: 'mitos',
                  props: {
                    title: 'Mitos vs Realidad',
                    description: 'Creencias populares confrontadas con evidencia científica.',
                    columns: 2,
                    items: MITOS.slice(0, 4).map((m): CardItem => ({
                      id: m.id, icon: m.icono, title: m.titulo, description: `"${m.mito}"`,
                      badge: 'MITO',
                      link: '/recursos',
                    })),
                  },
                },
                {
                  type: 'card-grid',
                  id: 'recetas',
                  props: {
                    title: 'Recetas de Bioinsumos y Calculadora de Campo',
                    description: 'Recetas paso a paso y herramientas interactivas para tu biofábrica.',
                    columns: 2,
                    items: [
                      ...RECETAS.map((r): CardItem => ({
                        id: r.id, icon: '🧪', title: r.titulo, description: r.descripcion,
                        badge: r.categoria,
                        meta: [{ label: 'Tiempo', value: r.tiempo }, { label: 'Ingredientes', value: String(r.ingredientes.length) }],
                        link: '/recursos',
                      })),
                      { id: 'calculadora', icon: '💧', title: 'Calculadora de Humedad', description: 'Estima la humedad ideal para compostaje mezclando materia verde y seca.', badge: 'Calculadora', link: '/recursos' },
                    ],
                  },
                },
              ]} />
            </div>
          ),
        },
        right: {
          width: 7,
          content: (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">Biblioteca Técnica</h3>
                    <p className="text-[10px] text-stone-500">Hojas y fichas listas para campo.</p>
                  </div>
                  <button onClick={() => navigate('/biblioteca')} className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                    Explorar <ArrowRight className="h-2.5 w-2.5" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {BIBLIOTECA.map((doc) => (
                    <div key={doc.id} onClick={() => navigate('/biblioteca/' + doc.id)}
                      className="p-2.5 bg-white border border-stone-200 hover:border-stone-400 rounded-xl cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[8px] font-mono font-semibold text-stone-500 uppercase">{doc.category}</span>
                        <span className="text-[8px] text-stone-400">{doc.version}</span>
                      </div>
                      <h4 className="text-[11px] font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-tight">{doc.title}</h4>
                      <p className="text-[10px] text-stone-500 line-clamp-1">{doc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900">Glosario Técnico</h3>
                    <p className="text-[9px] text-stone-500">Términos clave de agroecología.</p>
                  </div>
                  <button onClick={() => navigate('/recursos')} className="text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                    Glosario <ArrowRight className="h-2 w-2" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {GLOSARIO.slice(0, 5).map((g) => (
                    <div key={g.termino} className="p-2 bg-stone-50 border border-stone-200 rounded-lg hover:border-stone-400 transition-colors">
                      <div className="flex items-start gap-1.5">
                        <BookOpen className="h-3 w-3 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[10px] font-bold text-stone-900">{g.termino}</h4>
                          <p className="text-[9px] text-stone-600 leading-relaxed line-clamp-2">{g.definicion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ),
        },
      },
    },

    /* Casos de Éxito */
    {
      type: 'card-grid',
      id: 'casos-exito',
      props: {
        title: 'Casos de Éxito',
        description: 'Resultados reales del modelo Utopía en campo.',
        columns: 3,
        items: CASOS_EXITO.map((ce): CardItem => ({
          id: ce.id, icon: ce.icono, title: `${ce.titulo} · ${ce.ubicacion}`, description: ce.descripcion,
          badge: ce.cultivo,
          footer: (
            <div className="mt-2 space-y-0.5">
              {ce.resultados.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-start gap-1">
                  <Star className="h-2.5 w-2.5 text-gold shrink-0 mt-0.5" />
                  <span className="text-[9px] text-stone-600 leading-tight">{r}</span>
                </div>
              ))}
            </div>
          ),
        })),
      },
    },

    /* Ruta Profesional */
    {
      type: 'feature-grid',
      id: 'ruta-profesional',
      props: {
        title: 'Especialista en Agroecología de Montaña y Suelo Vivo',
        description: 'Un itinerario académico estructurado para asimilar de manera integral el manejo biológico de fincas agrícolas.',
        columns: 4,
        items: [
          { icon: '📚', title: 'Manejo del Suelo', description: 'Suelo Vivo, red alimentaria y microbiología.', tag: '01' },
          { icon: '🧪', title: 'Bioinsumos Líquidos', description: 'Elaboración de fermentados y caldos minerales.', tag: '02' },
          { icon: '🌿', title: 'Nutrición Sólida', description: 'Compostaje termófilo y Bokashi acelerado.', tag: '03' },
          { icon: '🛡️', title: 'Manejo de Plagas', description: 'Estrategias de control biológico y vegetal.', tag: '04' },
        ] as FeatureItem[],
      },
    },

    /* Events Banner */
    {
      type: 'cta-banner',
      id: 'events',
      props: {
        icon: '📅',
        badge: 'PRÓXIMO WEBINAR EN VIVO',
        title: 'Diseño Hidrológico Keyline para Captura de Agua en Terrenos Inclinados',
        description: 'Aprende a mapear y canalizar el agua de escorrentía para infiltrarla uniformemente en tus laderas de cultivo, eliminando la erosión y la sequía. Impartido por asesores técnicos de Agricultura Antigua.',
        buttonText: 'Reservar cupo',
        buttonLink: '/comunidad',
      },
    },
  ];

  return (
    <div className="space-y-5 py-2" id="home-section">
      {/* Hero Carousel */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg" id="hero-banner" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="relative min-h-[300px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[460px]">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                i === slideIdx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={s.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-8000 ease-linear"
                style={{ transform: i === slideIdx ? "scale(1.05)" : "scale(1)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a]/75 via-[#1b263b]/60 to-[#415a77]/40" />
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

        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-stone-900/50 hover:bg-stone-900/70 text-stone-50 flex items-center justify-center transition-all border border-stone-100/10 backdrop-blur-sm hover:scale-105 active:scale-95 shadow-md">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-stone-900/50 hover:bg-stone-900/70 text-stone-50 flex items-center justify-center transition-all border border-stone-100/10 backdrop-blur-sm hover:scale-105 active:scale-95 shadow-md">
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-stone-900/30">
          <div className="h-full bg-gold transition-all duration-150 ease-linear rounded-full" style={{ width: `${paused ? 0 : progress}%` }} />
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => { setSlideIdx(i); setProgress(0); }}
              className={`transition-all duration-300 ${i === slideIdx ? "w-8 h-2.5 bg-gold shadow-md shadow-gold/30" : "w-2.5 h-2.5 bg-stone-400/50 hover:bg-stone-400/80"} rounded-full`}
            />
          ))}
          <span className="ml-3 text-[10px] font-mono text-stone-400 font-medium">
            {String(slideIdx + 1).padStart(2, "0")}/{String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Page Blocks */}
      <PageRenderer blocks={blocks} />
    </div>
  );
}
