/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Calculator, 
  HelpCircle, 
  Droplet, 
  Gauge, 
  Scale, 
  Info,
  CheckCircle,
  Award,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FlaskConical,
  Sprout,
  Check,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PILARES, MITOS, CASOS_EXITO, NUMEROS_CLAVE, RECETAS, GLOSARIO, SUBTEMAS } from "../data";
import type { Pilar } from "../types";
import { getRelatedNodes } from "../core/knowledge/graph";

export default function RecursosSection() {
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState<"calculadoras" | "pilares" | "mitos" | "recetario" | "casos" | "glosario">("pilares");
  
  // Calculators sub-switcher
  const [activeCalc, setActiveCalc] = useState<"humedad" | "cn">("humedad");

  // Moisture Calculator state
  const [greenWeight, setGreenWeight] = useState<number>(30); // in kg
  const [dryWeight, setDryWeight] = useState<number>(20);  // in kg
  const [addedWater, setAddedWater] = useState<number>(0);   // in liters/kg

  // C:N ratio state
  const [vacaWeight, setVacaWeight] = useState<number>(40);   // kg (C:N ~ 18)
  const [gallinaWeight, setGallinaWeight] = useState<number>(10); // kg (C:N ~ 10)
  const [pajaWeight, setPajaWeight] = useState<number>(30);   // kg (C:N ~ 80)
  const [aserrinWeight, setAserrinWeight] = useState<number>(10); // kg (C:N ~ 150)

  // Interactive state for Pilares
  const [selectedPilar, setSelectedPilar] = useState<Pilar | null>(PILARES[0]);
  const [activePilarTema, setActivePilarTema] = useState<string | null>(PILARES[0].temas[0]);

  // Interactive state for Mitos
  const [flippedMitoId, setFlippedMitoId] = useState<string | null>(null);

  // Recetario State
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>("biol-2");
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  // Glosario State
  const [glosarioQuery, setGlosarioQuery] = useState("");
  const [expandedGlosario, setExpandedGlosario] = useState<string | null>(null);

  // Calculate Moisture %
  const calculateMoisture = () => {
    const totalWeight = greenWeight + dryWeight + addedWater;
    if (totalWeight === 0) return 0;
    const waterWeight = (greenWeight * 0.75) + (dryWeight * 0.15) + addedWater;
    return Math.round((waterWeight / totalWeight) * 100);
  };

  const moisturePct = calculateMoisture();

  const getMoistureFeedback = (pct: number) => {
    if (pct < 40) {
      return {
        status: "Muy Seco",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        desc: "Los microorganismos benéficos entrarán en latencia. La pila tardará meses en descomponerse.",
        action: "Agrega de 5 a 10 litros de agua limpia distribuyéndola uniformemente o duplica la cantidad de residuos verdes frescos."
      };
    } else if (pct >= 40 && pct <= 60) {
      return {
        status: "Óptimo",
        color: "text-emerald-800 bg-emerald-50 border-emerald-200",
        desc: "Rango perfecto de humedad. Promueve la respiración de las bacterias y hongos termófilos sin malos olores.",
        action: "¡Estructura ideal! Realiza volteos únicamente para refrescar el oxígeno cada 3 días si la temperatura supera los 65°C."
      };
    } else {
      return {
        status: "Muy Húmedo",
        color: "text-red-800 bg-red-50 border-red-200",
        desc: "El exceso de agua desplaza al aire de los poros. El compost comenzará a pudrirse de forma anaeróbica desprendiendo mal olor.",
        action: "Voltea de inmediato toda la pila para ventilarla y mezcla abundante paja, cascarilla de arroz, cartón picado u hojas secas."
      };
    }
  };

  const moistureFeedback = getMoistureFeedback(moisturePct);

  // Calculate C:N Ratio
  const calculateCNRatio = () => {
    const nVaca = vacaWeight * 0.015;
    const nGallina = gallinaWeight * 0.03;
    const nPaja = pajaWeight * 0.005;
    const nAserrin = aserrinWeight * 0.001;

    const totalN = nVaca + nGallina + nPaja + nAserrin;
    if (totalN === 0) return 0;

    const totalC = (nVaca * 18) + (nGallina * 10) + (nPaja * 80) + (nAserrin * 150);
    return Math.round((totalC / totalN) * 10) / 10;
  };

  const cnRatio = calculateCNRatio();

  const getCNFeedback = (ratio: number) => {
    if (ratio < 20) {
      return {
        status: "Exceso de Nitrógeno",
        color: "text-red-800 bg-red-50 border-red-200",
        desc: "Hay demasiada materia nitrogenada. La pila fermentará muy rápido, elevando el olor a amoníaco y perdiendo valiosos nutrientes solubles.",
        action: "Añade paja seca, cascarilla de arroz o viruta de madera para equilibrar el exceso de estiércol."
      };
    } else if (ratio >= 20 && ratio <= 35) {
      return {
        status: "Óptimo",
        color: "text-emerald-800 bg-emerald-50 border-emerald-200",
        desc: "Equilibrio perfecto de carbono y nitrógeno (rango ideal para abono Bokashi o compost de alta calidad).",
        action: "¡Receta balanceada! Los microorganismos dispondrán de energía estable (carbono) y proteínas (nitrógeno) para multiplicarse."
      };
    } else {
      return {
        status: "Exceso de Carbono",
        color: "text-amber-800 bg-amber-50 border-amber-200",
        desc: "La pila tiene mucha madera, hojas secas o cascarilla dura. No hay suficiente nitrógeno para alimentar la reproducción bacteriana.",
        action: "Añade estiércol fresco de corral, orina diluida, restos frescos de leguminosas o alfalfa picada."
      };
    }
  };

  const cnFeedback = getCNFeedback(cnRatio);

  const toggleIngredient = (ingredient: string) => {
    setCheckedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient) 
        : [...prev, ingredient]
    );
  };

  const filteredGlosario = GLOSARIO.filter(item => 
    item.termino.toLowerCase().includes(glosarioQuery.toLowerCase()) ||
    item.definicion.toLowerCase().includes(glosarioQuery.toLowerCase())
  );

  const filteredRecipes = selectedCategory === "Todos"
    ? RECETAS
    : RECETAS.filter(r => r.categoria === selectedCategory);

  const recipeCategories = ["Todos", ...Array.from(new Set(RECETAS.map(r => r.categoria)))];

  return (
    <div className="space-y-8 py-4" id="recursos-hub">
      {/* Welcome & Section Intro */}
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <span className="font-mono text-[10px] text-emerald-700 tracking-wider uppercase font-semibold">
          Sabiduría y Ciencia de la Tierra
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Centro de Recursos Interactivos
        </h2>
        <p className="text-xs sm:text-sm text-stone-800 max-w-3xl leading-relaxed font-medium">
          Explora la base de datos completa de **Agricultura Antigua**. Accede de forma interactiva a los pilares fundamentales, desmiente mitos agrícolas con datos científicos, calcula formulaciones rústicas en tiempo real y aprende recetas biológicas probadas para tu finca.
        </p>
      </div>

      {/* Main Hub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200/80 pb-1" id="hub-navigation">
        {[
          { id: "pilares", label: "Pilares del Saber", icon: Sprout },
          { id: "mitos", label: "Mitos vs. Realidad", icon: HelpCircle },
          { id: "recetario", label: "Recetario de Bioinsumos", icon: FlaskConical },
          { id: "calculadoras", label: "Calculadoras de Campo", icon: Calculator },
          { id: "casos", label: "Casos & Números", icon: Award },
          { id: "glosario", label: "Glosario Científico", icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSubTab(tab.id as any);
                // Sync first elements
                if (tab.id === "pilares" && !selectedPilar) {
                  setSelectedPilar(PILARES[0]);
                  setActivePilarTema(PILARES[0].temas[0]);
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 -mb-[2px] ${
                isActive 
                  ? "border-emerald-600 text-emerald-800 bg-emerald-50/50" 
                  : "border-transparent text-stone-800 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="pt-2">

        {/* 1. PILARES DEL SABER */}
        {subTab === "pilares" && selectedPilar && (
          <div className="space-y-6" id="hub-pilares">
            {/* Pilares de Transición: Inline Menu */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800">
                  Pilares de Transición Agrícola
                </h3>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold self-start sm:self-auto">
                  Selecciona un Pilar para ver sus temas
                </span>
              </div>
              
              {/* Responsive 5-column Inline Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" id="pilares-inline-selector">
                {PILARES.map(pilar => {
                  const isSel = selectedPilar.id === pilar.id;
                  return (
                    <button
                      key={pilar.id}
                      id={`btn-pilar-${pilar.id}`}
                      onClick={() => {
                        setSelectedPilar(pilar);
                        setActivePilarTema(pilar.temas[0]);
                      }}
                      className={`text-left p-3 sm:p-4 rounded-2xl border transition-all flex items-center gap-3 group relative overflow-hidden h-full ${
                        isSel 
                          ? "bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500/10" 
                          : "bg-stone-50 hover:bg-stone-100/80 hover:border-stone-300 border-stone-200"
                      }`}
                    >
                      {/* Active indicator top line */}
                      {isSel && (
                        <span 
                          className="absolute top-0 left-0 right-0 h-[3px]" 
                          style={{ backgroundColor: pilar.color }}
                        />
                      )}
                      
                      <span className="text-2xl shrink-0" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.05))" }}>
                        {pilar.icono}
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className={`text-[9px] font-mono font-semibold uppercase tracking-widest truncate ${isSel ? "text-emerald-700" : "text-stone-400"}`}>
                          {pilar.subtitulo}
                        </h4>
                        <p className="font-serif text-xs font-bold text-stone-950 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2 sm:line-clamp-1">
                          {pilar.titulo}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pillar Detail View (Spans Full Width 100%) */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs w-full">
              {/* Header card with background */}
              <div className="p-6 rounded-2xl space-y-3" style={{ backgroundColor: selectedPilar.bgColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedPilar.icono}</span>
                  <div>
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest" style={{ color: selectedPilar.color }}>
                      {selectedPilar.subtitulo}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                      {selectedPilar.titulo}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed font-sans max-w-4xl pt-2 border-t border-stone-950/5">
                  {selectedPilar.descripcion}
                </p>
              </div>

              {/* Subtopic Navigator */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800">
                  Temas Clave de Aprendizaje
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPilar.temas.map((tema) => {
                    const detail = SUBTEMAS[tema];
                    const isAct = activePilarTema === tema;
                    return (
                      <div key={tema} className="space-y-2">
                        <button
                          onClick={() => setActivePilarTema(isAct ? null : tema)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs font-semibold ${
                            isAct 
                              ? "bg-stone-50 border-emerald-500 text-emerald-800" 
                              : "bg-stone-50 hover:bg-stone-100 border-stone-200/80 text-stone-800"
                          }`}
                        >
                          <span className="flex items-center gap-2 line-clamp-1">
                            <span>{detail?.icono || "📍"}</span>
                            <span>{tema}</span>
                          </span>
                          {isAct ? (
                            <ChevronUp className="h-4 w-4 text-emerald-700 shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-stone-400 shrink-0" />
                          )}
                        </button>

                        {isAct && detail && (
                          <div className="p-4 bg-stone-50/50 border border-stone-200/60 rounded-xl space-y-3 text-xs leading-relaxed animate-fade-in">
                            <p className="font-medium text-stone-800 border-b border-stone-200 pb-2">
                              {detail.descripcion}
                            </p>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block font-bold">
                                Contenido técnico detallado:
                              </span>
                              <ul className="space-y-1.5">
                                {detail.subtemas.map((st, sidx) => (
                                  <li key={sidx} className="flex items-start gap-2 text-stone-800">
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{st}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footnote */}
              <div className="p-4 bg-stone-100 rounded-2xl flex items-center gap-2 text-[11px] text-stone-800 font-serif italic">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Todos los pilares están vinculados a módulos prácticos evaluables en nuestra Academia de Campo.</span>
              </div>

              {/* Knowledge Graph: Related Content */}
              {(() => {
                const related = getRelatedNodes(`pilar-${selectedPilar.id}`);
                if (related.length === 0) return null;
                return (
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-2">
                    <h5 className="font-serif text-xs font-bold text-purple-900 flex items-center gap-1">
                      <Sprout className="h-4 w-4" />
                      <span>Contenido Relacionado a este Pilar</span>
                    </h5>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {related.slice(0, 6).map((node) => {
                        const badgeStyle = {
                          course: 'bg-emerald-100 text-emerald-800',
                          recipe: 'bg-orange-100 text-orange-800',
                          glossary: 'bg-indigo-100 text-indigo-800',
                          article: 'bg-amber-100 text-amber-800',
                          guide: 'bg-teal-100 text-teal-800',
                          research: 'bg-purple-100 text-purple-800',
                        }[node.type] || 'bg-stone-100 text-stone-800';
                        return (
                          <button
                            key={node.id}
                            onClick={() => {
                              const urlMap: Record<string, string> = {
                                course: `/academia/${node.id}`,
                                recipe: '/recursos',
                                glossary: '/recursos',
                              };
                              navigate(urlMap[node.type] || '/biblioteca');
                            }}
                            className="px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-transparent hover:border-purple-300"
                            style={{ backgroundColor: badgeStyle.split(' ')[0], color: badgeStyle.split(' ')[1] }}
                          >
                            <ArrowRight className="h-3 w-3" />
                            <span>{node.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* 2. MITOS VS REALIDAD */}
        {subTab === "mitos" && (
          <div className="space-y-6" id="hub-mitos">
            <div className="max-w-3xl">
              <h3 className="font-serif text-lg font-bold text-stone-900">Desmintiendo Creencias Tradicionales</h3>
              <p className="text-xs text-stone-800 mt-1 font-medium">
                La sabiduría campesina es valiosa, pero la Revolución Verde introdujo mitos comerciales nocivos. Confrontamos mitos populares con evidencia científica histórica y proponemos una acción de campo directa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MITOS.map(mito => {
                const isFlipped = flippedMitoId === mito.id;
                return (
                  <div
                    key={mito.id}
                    onClick={() => setFlippedMitoId(isFlipped ? null : mito.id)}
                    className={`h-[320px] rounded-2xl border p-5 cursor-pointer transition-all duration-300 relative select-none flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                      isFlipped 
                        ? "bg-stone-900 border-stone-950 text-stone-100 scale-[1.02]" 
                        : "bg-white border-stone-200 hover:border-emerald-300 text-stone-900"
                    }`}
                  >
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{mito.icono}</span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold tracking-wider ${isFlipped ? "bg-emerald-500/20 text-emerald-400" : "bg-stone-100 text-stone-800"}`}>
                          {isFlipped ? "CIENCIA & ACCIÓN" : "EL MITO"}
                        </span>
                      </div>
                      <h4 className="font-serif text-base font-bold leading-tight">
                        {mito.titulo}
                      </h4>
                    </div>

                    {/* Body contents */}
                    <div className="flex-grow flex items-center py-2">
                      {!isFlipped ? (
                        <p className="text-xs text-stone-800 italic leading-relaxed">
                          {mito.mito}
                        </p>
                      ) : (
                        <div className="space-y-3 text-xs w-full">
                          <div className="space-y-1">
                            <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-wider uppercase block">
                              Realidad Científica:
                            </span>
                            <p className="text-stone-200 leading-relaxed font-semibold">
                              {mito.realidad}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-stone-400 font-mono block uppercase">
                              Evidencia de Soporte:
                            </span>
                            <p className="text-stone-300 leading-normal italic text-[11px]">
                              {mito.evidencia}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className={`pt-3 border-t text-[11px] flex items-center justify-between font-mono ${isFlipped ? "border-stone-800 text-emerald-400" : "border-stone-100 text-stone-400"}`}>
                      {isFlipped ? (
                        <div className="flex items-start gap-1">
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Acción:</strong> {mito.accion}</span>
                        </div>
                      ) : (
                        <span className="text-emerald-700 font-semibold hover:underline">Ver Realidad Científica &rarr;</span>
                      )}
                    </div>

                    {/* Knowledge Graph: Related Content (only on flipped side) */}
                    {isFlipped && (() => {
                      const related = getRelatedNodes(mito.id);
                      if (related.length === 0) return null;
                      return (
                        <div className="mt-3 pt-3 border-t border-stone-800 space-y-1.5">
                          <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Relacionado:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {related.slice(0, 3).map((node) => {
                              const badgeStyle = {
                                course: 'bg-emerald-500/20 text-emerald-400',
                                recipe: 'bg-orange-500/20 text-orange-400',
                                glossary: 'bg-indigo-500/20 text-indigo-400',
                                article: 'bg-amber-500/20 text-amber-400',
                                guide: 'bg-teal-500/20 text-teal-400',
                              }[node.type] || 'bg-stone-500/20 text-stone-400';
                              return (
                                <button
                                  key={node.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const urlMap: Record<string, string> = {
                                      course: `/academia/${node.id}`,
                                      recipe: '/recursos',
                                      glossary: '/recursos',
                                    };
                                    navigate(urlMap[node.type] || '/biblioteca');
                                  }}
                                  className="px-2 py-1 text-[9px] font-semibold rounded-lg transition-colors"
                                  style={{ backgroundColor: badgeStyle.split(' ')[0], color: badgeStyle.split(' ')[1] }}
                                >
                                  {node.title}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. RECETARIO DE BIOINSUMOS */}
        {subTab === "recetario" && (
          <div className="space-y-6" id="hub-recetario">
            {/* Category selector */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-stone-200 pb-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-serif text-lg font-bold text-stone-900">La Biofábrica Utopía (Protocolos de Preparación)</h3>
                <p className="text-xs text-stone-800">Recetario paso a paso para elaborar caldos de alta pureza.</p>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {recipeCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? "bg-emerald-600 text-stone-50"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipes lists & instructions detail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Recipe card grid (5 Cols) */}
              <div className="lg:col-span-5 space-y-3">
                {filteredRecipes.map(recipe => {
                  const isExp = expandedRecipeId === recipe.id;
                  return (
                    <button
                      key={recipe.id}
                      onClick={() => setExpandedRecipeId(recipe.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                        isExp 
                          ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/10" 
                          : "bg-stone-50 hover:bg-stone-100 border-stone-200"
                      }`}
                    >
                      <span className="text-2xl mt-1">{recipe.icono}</span>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono bg-stone-200/60 px-1.5 py-0.5 rounded text-stone-800 font-bold">
                            {recipe.categoria}
                          </span>
                          <span className="text-[10px] font-mono text-stone-800">{recipe.tiempo}</span>
                        </div>
                        <h4 className="font-serif text-sm font-bold text-stone-900">
                          {recipe.titulo}
                        </h4>
                        <p className="text-xs text-stone-800 line-clamp-1 leading-relaxed">
                          {recipe.descripcion}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Recipe Instructions Detail Display (7 Cols) */}
              <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                {expandedRecipeId ? (() => {
                  const r = RECETAS.find(rec => rec.id === expandedRecipeId);
                  if (!r) return null;
                  return (
                    <div className="space-y-6 animate-fade-in">
                      {/* Recipe title header */}
                      <div className="flex items-start justify-between border-b border-stone-100 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">{r.icono}</span>
                            <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded font-bold tracking-wide">
                              {r.categoria}
                            </span>
                          </div>
                          <h3 className="font-serif text-xl font-bold text-stone-900 mt-2">
                            {r.titulo}
                          </h3>
                          <p className="text-xs text-stone-800 italic">
                            {r.descripcion}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-stone-400 block uppercase">TIEMPO ESTIMADO</span>
                          <span className="text-xs font-bold text-stone-900 flex items-center justify-end gap-1 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{r.tiempo}</span>
                          </span>
                        </div>
                      </div>

                      {/* Ingredients list with interactive checkboxes */}
                      <div className="space-y-3 bg-stone-50 border border-stone-200/60 p-5 rounded-2xl">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800">
                          Ingredientes Necesarios (Para preparar lote base)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {r.ingredientes.map((ing, iidx) => {
                            const isChecked = checkedIngredients.includes(`${r.id}-${ing}`);
                            return (
                              <button
                                key={iidx}
                                onClick={() => toggleIngredient(`${r.id}-${ing}`)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left border transition-all text-xs ${
                                  isChecked 
                                    ? "bg-emerald-50/50 border-emerald-200 text-stone-800 line-through" 
                                    : "bg-white border-stone-200 text-stone-800 font-medium hover:border-stone-300"
                                }`}
                              >
                                <span className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300"}`}>
                                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                                </span>
                                <span>{ing}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Steps directions list */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800">
                          Instrucciones del Protocolo (Paso a Paso)
                        </h4>
                        <div className="space-y-3">
                          {r.pasos.map((paso, pidx) => (
                            <div key={pidx} className="flex gap-4 items-start">
                              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg h-6 w-6 shrink-0 flex items-center justify-center border border-emerald-100">
                                {pidx + 1}
                              </span>
                              <p className="text-xs text-stone-800 leading-relaxed font-medium pt-0.5">
                                {paso}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Biofábrica Safety Notice */}
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-2.5 text-[11px] leading-relaxed text-amber-900">
                        <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                        <div>
                          <strong className="font-semibold block mb-0.5">Precaución de Seguridad en Preparación:</strong>
                          <span>Utiliza recipientes plásticos o de cerámica gruesa para fermentaciones. Al preparar caldos calientes como el Sulfocálcico, evita recipientes de aluminio y usa siempre guantes protectores y mascarilla de partículas.</span>
                        </div>
                      </div>

                      {/* Knowledge Graph: Related Content */}
                      {(() => {
                        const related = getRelatedNodes(expandedRecipeId);
                        if (related.length === 0) return null;
                        return (
                          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2">
                            <h5 className="font-serif text-xs font-bold text-indigo-900 flex items-center gap-1">
                              <Sprout className="h-4 w-4" />
                              <span>Preparaciones y Lecturas Relacionadas</span>
                            </h5>
                            <p className="text-[11px] text-indigo-800">Otros recursos vinculados a esta preparación:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {related.slice(0, 5).map((node) => {
                                const badgeStyle = {
                                  course: 'bg-emerald-100 text-emerald-800',
                                  recipe: 'bg-orange-100 text-orange-800',
                                  glossary: 'bg-indigo-100 text-indigo-800',
                                  article: 'bg-amber-100 text-amber-800',
                                  guide: 'bg-teal-100 text-teal-800',
                                }[node.type] || 'bg-stone-100 text-stone-800';
                                return (
                                  <button
                                    key={node.id}
                                    onClick={() => {
                                      const urlMap: Record<string, string> = {
                                        course: `/academia/${node.id}`,
                                        recipe: '/recursos',
                                        glossary: '/recursos',
                                      };
                                      navigate(urlMap[node.type] || '/biblioteca');
                                    }}
                                    className="px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-transparent hover:border-indigo-300"
                                    style={{ backgroundColor: badgeStyle.split(' ')[0], color: badgeStyle.split(' ')[1] }}
                                  >
                                    <ArrowRight className="h-3 w-3" />
                                    <span>{node.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })() : (
                  <div className="text-center py-12 space-y-3">
                    <FlaskConical className="h-10 w-10 text-stone-300 mx-auto" />
                    <p className="text-xs text-stone-800 font-serif italic">Selecciona una receta del recetario de biofábrica para explorar los pasos detallados.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. CALCULADORAS DE CAMPO */}
        {subTab === "calculadoras" && (
          <div className="space-y-6" id="hub-calculadoras">
            {/* Switcher */}
            <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200 max-w-md mx-auto" id="calc-switcher">
              <button
                onClick={() => setActiveCalc("humedad")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeCalc === "humedad" 
                    ? "bg-white text-emerald-800 shadow-sm border border-stone-200" 
                    : "text-stone-800 hover:text-stone-900"
                }`}
              >
                <Droplet className="h-4 w-4 text-emerald-600" />
                <span>Calculadora de Humedad</span>
              </button>
              <button
                onClick={() => setActiveCalc("cn")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeCalc === "cn" 
                    ? "bg-white text-emerald-800 shadow-sm border border-stone-200" 
                    : "text-stone-800 hover:text-stone-900"
                }`}
              >
                <Scale className="h-4 w-4 text-emerald-600" />
                <span>Calculadora Carbono:Nitrógeno</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Inputs block (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                {activeCalc === "humedad" ? (
                  /* Humidity Calculator Inputs */
                  <div className="space-y-5" id="moisture-calc-inputs">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="font-serif text-lg font-bold text-stone-900">Humedad en Compostaje</h3>
                      <p className="text-[11px] text-stone-800 mt-1 font-medium">Saca una estimación matemática rápida mezclando el peso de tus residuos verdes y cafés.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-stone-800">Materia Verde Fresca</label>
                        <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-800 font-bold">{greenWeight} kg</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="150"
                        step="5"
                        value={greenWeight}
                        onChange={(e) => setGreenWeight(Number(e.target.value))}
                        className="w-full accent-emerald-600 h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer border border-stone-200"
                      />
                      <p className="text-[10px] text-stone-800 italic">Ej: Residuos de verduras de cocina, malezas verdes, estiércoles frescos húmedos.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-stone-800">Materia Seca Café</label>
                        <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-800 font-bold">{dryWeight} kg</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="150"
                        step="5"
                        value={dryWeight}
                        onChange={(e) => setDryWeight(Number(e.target.value))}
                        className="w-full accent-emerald-600 h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer border border-stone-200"
                      />
                      <p className="text-[10px] text-stone-800 italic">Ej: Hojas de rastrojo forestal, paja desmenuzada, viruta o aserrín seco.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-stone-800">Agua Añadida Directa</label>
                        <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-800 font-bold">{addedWater} L (kg)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        value={addedWater}
                        onChange={(e) => setAddedWater(Number(e.target.value))}
                        className="w-full accent-emerald-600 h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer border border-stone-200"
                      />
                      <p className="text-[10px] text-stone-800 italic">Agua total limpia vertida a la pila en el volteo.</p>
                    </div>
                  </div>
                ) : (
                  /* C:N Calculator Inputs */
                  <div className="space-y-5" id="cn-calc-inputs">
                    <div className="border-b border-stone-100 pb-3">
                      <h3 className="font-serif text-lg font-bold text-stone-900">Relación Estequiométrica C:N</h3>
                      <p className="text-[11px] text-stone-800 mt-1 font-medium">Alinea la cantidad de estiércol y rastrojos secos para una multiplicación biológica acelerada.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-stone-800">Estiércol Vacuno</span>
                          <span className="font-mono font-bold text-stone-800">{vacaWeight} kg</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={vacaWeight}
                          onChange={(e) => setVacaWeight(Math.max(0, Number(e.target.value)))}
                          className="w-full rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-stone-800">Gallinaza de Ponederas</span>
                          <span className="font-mono font-bold text-stone-800">{gallinaWeight} kg</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={gallinaWeight}
                          onChange={(e) => setGallinaWeight(Math.max(0, Number(e.target.value)))}
                          className="w-full rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-stone-800">Pajas o Rastrojos (C:N 80)</span>
                          <span className="font-mono font-bold text-stone-800">{pajaWeight} kg</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={pajaWeight}
                          onChange={(e) => setPajaWeight(Math.max(0, Number(e.target.value)))}
                          className="w-full rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-stone-800">Aserrín / Viruta (C:N 150)</span>
                          <span className="font-mono font-bold text-stone-800">{aserrinWeight} kg</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={aserrinWeight}
                          onChange={(e) => setAserrinWeight(Math.max(0, Number(e.target.value)))}
                          className="w-full rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-2.5 text-xs text-emerald-800">
                      <Info className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        Un suelo sano requiere microorganismos sanos. La relación ideal para elaborar un Bokashi rápido en 15 días ronda los **25:1 a 30:1**. Ajusta tus pesos para lograr este balance.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Output block (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xs">
                {activeCalc === "humedad" ? (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <span className="text-[10px] font-mono text-stone-800 uppercase font-bold tracking-wide">HUMEDAD CALCULADA</span>
                      <div className="flex justify-center items-baseline gap-1">
                        <span className="font-serif text-5xl font-black text-stone-900">{moisturePct}%</span>
                        <span className="text-stone-400 font-mono text-xs">H.R.</span>
                      </div>

                      {/* Visual bar */}
                      <div className="relative w-full h-3.5 bg-stone-100 rounded-full overflow-hidden mt-3 border border-stone-200">
                        <div className="absolute left-0 top-0 h-full w-[40%] bg-amber-400/30 border-r border-stone-300/30"></div>
                        <div className="absolute left-[40%] top-0 h-full w-[20%] bg-emerald-500 border-r border-stone-300/30"></div>
                        <div className="absolute left-[60%] top-0 h-full w-[40%] bg-red-400/30"></div>
                        
                        <div 
                          className="absolute top-0 h-full w-1 bg-stone-950 shadow-md transition-all duration-300"
                          style={{ left: `${Math.min(100, Math.max(0, moisturePct))}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between font-mono text-[9px] text-stone-400 px-1 mt-1">
                        <span>Seco (&lt;40%)</span>
                        <span className="text-emerald-700 font-bold">Óptimo (40%-60%)</span>
                        <span>Mojado (&gt;60%)</span>
                      </div>
                    </div>

                    <div className={`p-5 rounded-2xl border space-y-2 ${moistureFeedback.color}`}>
                      <div className="flex justify-between items-center border-b border-stone-300/25 pb-2">
                        <h4 className="font-serif text-xs font-bold uppercase tracking-wider">ESTADO: {moistureFeedback.status}</h4>
                        <Gauge className="h-4.5 w-4.5" />
                      </div>
                      <p className="text-xs leading-relaxed font-medium">{moistureFeedback.desc}</p>
                      <div className="pt-2 border-t border-stone-300/25 text-[11px] leading-relaxed space-y-0.5">
                        <strong className="block font-semibold">Consejo de Campo:</strong>
                        <p>{moistureFeedback.action}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl space-y-1">
                      <span className="font-mono text-[9px] text-stone-800 uppercase font-bold tracking-wider">EL "SABER CAMPESINO"</span>
                      <p className="text-[11px] text-stone-800 leading-normal font-medium">
                        La <strong>prueba de la laya y del puño</strong> es la herramienta de campo tradicional para validar la humedad. El abono debe apelmazarse al apretar pero no escurrir agua de forma directa.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <span className="text-[10px] font-mono text-stone-800 uppercase font-bold tracking-wide">C:N RESULTANTE</span>
                      <div className="flex justify-center items-baseline gap-1">
                        <span className="font-serif text-5xl font-black text-stone-900">{cnRatio}:1</span>
                      </div>

                      {/* Visual bar */}
                      <div className="relative w-full h-3.5 bg-stone-100 rounded-full overflow-hidden mt-3 border border-stone-200">
                        <div className="absolute left-0 top-0 h-full w-[40%] bg-red-400/30 border-r border-stone-300/30"></div>
                        <div className="absolute left-[40%] top-0 h-full w-[30%] bg-emerald-500 border-r border-stone-300/30"></div>
                        <div className="absolute left-[70%] top-0 h-full w-[30%] bg-amber-400/30"></div>
                        
                        <div 
                          className="absolute top-0 h-full w-1 bg-stone-950 shadow-md transition-all duration-300"
                          style={{ left: `${Math.min(100, Math.max(0, (cnRatio / 50) * 100))}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between font-mono text-[9px] text-stone-400 px-1 mt-1">
                        <span>Alto Nitrógeno (&lt;20)</span>
                        <span className="text-emerald-700 font-bold">Óptimo (20-35)</span>
                        <span>Alto Carbono (&gt;35)</span>
                      </div>
                    </div>

                    <div className={`p-5 rounded-2xl border space-y-2 ${cnFeedback.color}`}>
                      <div className="flex justify-between items-center border-b border-stone-300/25 pb-2">
                        <h4 className="font-serif text-xs font-bold uppercase tracking-wider">DIAGNÓSTICO: {cnFeedback.status}</h4>
                        <Scale className="h-4.5 w-4.5" />
                      </div>
                      <p className="text-xs leading-relaxed font-medium">{cnFeedback.desc}</p>
                      <div className="pt-2 border-t border-stone-300/25 text-[11px] leading-relaxed space-y-0.5">
                        <strong className="block font-semibold">Ajuste recomendado:</strong>
                        <p>{cnFeedback.action}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl space-y-1">
                      <span className="font-mono text-[9px] text-stone-800 uppercase font-bold tracking-wider font-bold">CÓMO MEDIR EN CAMPO</span>
                      <p className="text-[11px] text-stone-800 leading-normal font-medium">
                        Si tu pila desprende olor picante (amoníaco), estás perdiendo nitrógeno soluble por evaporación. Agrega abundante material rústico seco alto en carbono.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. CASOS DE ÉXITO & NÚMEROS CLAVE */}
        {subTab === "casos" && (
          <div className="space-y-10" id="hub-casos">
            {/* Numbers Grid */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-stone-900">La Fuerza de los Números Reales</h3>
                <p className="text-xs text-stone-800">Métricas científicas de impacto directo de la agricultura biológica y regenerativa.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {NUMEROS_CLAVE.map((num, idx) => (
                  <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                    <span className="font-serif text-3xl font-black text-emerald-700 tracking-tight">{num.valor}</span>
                    <p className="text-[11px] text-stone-800 font-medium leading-relaxed mt-1">{num.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Stories Cards */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-stone-900">Casos de Éxito Validados</h3>
                <p className="text-xs text-stone-800">Resultados verificados de la aplicación de los protocolos en universidades y campos comunitarios.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CASOS_EXITO.map(caso => (
                  <div key={caso.id} className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{caso.icono}</span>
                        <div className="text-right">
                          <span className="text-[9px] font-mono bg-stone-100 text-stone-800 border border-stone-200 px-1.5 py-0.5 rounded block">
                            {caso.cultivo}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif text-base font-bold text-stone-900">
                          {caso.titulo}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-700">
                          <MapPin className="h-3 w-3" />
                          <span>{caso.ubicacion}</span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-800 leading-relaxed font-medium">
                        {caso.descripcion}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 space-y-2">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block font-bold">
                        LOGROS VERIFICADOS:
                      </span>
                      <ul className="space-y-1.5">
                        {caso.resultados.map((res, ridx) => (
                          <li key={ridx} className="flex items-start gap-1.5 text-xs font-semibold text-stone-800">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. GLOSARIO CIENTÍFICO */}
        {subTab === "glosario" && (
          <div className="space-y-6" id="hub-glosario">
            {/* Search Input Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-stone-200 pb-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-serif text-lg font-bold text-stone-900">Glosario Científico de Transición</h3>
                <p className="text-xs text-stone-800">Vocabulario fundamental para comprender los procesos físico-químicos del suelo.</p>
              </div>
              <div className="relative w-full sm:max-w-xs shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  value={glosarioQuery}
                  onChange={(e) => setGlosarioQuery(e.target.value)}
                  placeholder="Buscar término (ej: ORP, IASS)..."
                  className="w-full rounded-xl bg-stone-100 focus:bg-white border border-stone-200 focus:border-emerald-500 text-xs pl-9 pr-4 py-2.5 outline-none transition-all"
                />
              </div>
            </div>

            {/* Terms List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGlosario.length > 0 ? (
                filteredGlosario.map((item, idx) => {
                  const isExpanded = expandedGlosario === `glosario-${item.termino}`;
                  const related = isExpanded ? getRelatedNodes(`glosario-${item.termino}`) : [];
                  return (
                    <div key={idx} className="bg-white border border-stone-200/80 rounded-2xl p-5 space-y-2.5 hover:shadow-xs transition-shadow">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2 py-0.5 rounded-lg">
                          {item.termino}
                        </span>
                      </div>
                      <p className="text-xs text-stone-800 leading-relaxed font-medium">
                        {item.definicion}
                      </p>
                      <button
                        onClick={() => setExpandedGlosario(isExpanded ? null : `glosario-${item.termino}`)}
                        className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                      >
                        <Sprout className="h-3 w-3" />
                        <span>{isExpanded ? 'Ocultar relacionados' : 'Ver contenido relacionado'}</span>
                      </button>
                      {isExpanded && related.length > 0 && (
                        <div className="pt-2 border-t border-stone-100 space-y-1.5">
                          {related.slice(0, 4).map((node) => {
                            const badgeStyle = {
                              course: 'bg-emerald-100 text-emerald-800',
                              recipe: 'bg-orange-100 text-orange-800',
                              article: 'bg-amber-100 text-amber-800',
                              guide: 'bg-teal-100 text-teal-800',
                              research: 'bg-purple-100 text-purple-800',
                            }[node.type] || 'bg-stone-100 text-stone-800';
                            return (
                              <button
                                key={node.id}
                                onClick={() => {
                                  const urlMap: Record<string, string> = {
                                    course: `/academia/${node.id}`,
                                    recipe: '/recursos',
                                  };
                                  navigate(urlMap[node.type] || '/biblioteca');
                                }}
                                className="w-full text-left px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                                style={{ backgroundColor: badgeStyle.split(' ')[0], color: badgeStyle.split(' ')[1] }}
                              >
                                <ArrowRight className="h-3 w-3 shrink-0" />
                                <span className="truncate">{node.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 space-y-2">
                  <BookOpen className="h-8 w-8 text-stone-300 mx-auto" />
                  <p className="text-xs text-stone-800 font-serif italic">No se encontraron términos que coincidan con tu búsqueda.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
