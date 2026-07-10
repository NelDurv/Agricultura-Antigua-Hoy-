/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Bot, 
  Database, 
  Rss, 
  Mail, 
  FileCode, 
  CheckCircle2, 
  Copy, 
  Download, 
  HelpCircle, 
  Sparkles, 
  ShieldAlert, 
  Scale,
  Code,
  FileText,
  Terminal,
  Check
} from "lucide-react";
import { COURSES, BIBLIOTECA } from "../data";

export default function AIReadySection() {
  const [activeTab, setActiveTab] = useState<"teoria" | "playground" | "comparador">("teoria");
  const [subTab, setSubTab] = useState<"schema" | "faq" | "eeat">("schema");
  const [selectedDataset, setSelectedDataset] = useState<"courses" | "library" | "recipes">("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState(false);
  const [crawlerView, setCrawlerView] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  // Selected item for Schema Markup Generator
  const [selectedSchemaItem, setSelectedSchemaItem] = useState("course-suelo-vivo");

  // Dynamic Schema generator based on items
  const getSchemaJSON = () => {
    if (selectedSchemaItem === "course-suelo-vivo") {
      return {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Microbiología y Suelo Vivo",
        "description": "Comprende la interacción de hongos, bacterias y minerales para regenerar el suelo agrícola de forma orgánica.",
        "provider": {
          "@type": "Organization",
          "name": "Agricultura Antigua",
          "sameAs": "https://agricultura-antigua.org"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "online",
          "courseWorkload": "PT12H"
        },
        "offers": {
          "@type": "Offer",
          "category": "Free",
          "price": "0",
          "priceCurrency": "USD"
        }
      };
    } else if (selectedSchemaItem === "recipe-caldo-sulfocalcico") {
      return {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": "Caldo Sulfocálcico Tradicional",
        "author": {
          "@type": "Organization",
          "name": "Agricultura Antigua"
        },
        "description": "Receta mineral agroecológica a base de azufre y cal para el control de ácaros y hongos fitopatógenos.",
        "recipeCategory": "Bioinsumo",
        "prepTime": "PT10M",
        "cookTime": "PT1H",
        "recipeYield": "20 Litros",
        "recipeIngredient": [
          "2 kg de Azufre elemental en polvo",
          "1 kg de Cal viva o cal apagada de alta pureza",
          "10 litros de Agua limpia"
        ],
        "recipeInstructions": [
          {
            "@type": "HowToStep",
            "text": "Poner a hervir el agua en un recipiente metálico adecuado (no aluminio)."
          },
          {
            "@type": "HowToStep",
            "text": "Mezclar el azufre y la cal en seco, luego agregarlos lentamente al agua hirviendo bajo agitación continua."
          },
          {
            "@type": "HowToStep",
            "text": "Mantener al fuego fuerte durante 45 a 60 minutos, revolviendo constantemente hasta que tome un color rojo vino oscuro."
          }
        ]
      };
    } else {
      return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": "La Transición Agroecológica Científica",
        "description": "Un análisis integral sobre la incorporación de saberes tradicionales con microbiología de suelos avanzada.",
        "author": {
          "@type": "Person",
          "name": "Nelson Durán",
          "jobTitle": "Especialista en Regeneración de Suelos"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Agricultura Antigua"
        },
        "datePublished": "2026-07-01T08:00:00Z"
      };
    }
  };

  const schemaString = JSON.stringify(getSchemaJSON(), null, 2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Datasets for REST API simulation
  const getSelectedData = () => {
    if (selectedDataset === "courses") {
      return COURSES.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (selectedDataset === "library") {
      return BIBLIOTECA.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.category.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      return [
        { id: "caldo-sulfocalcico", name: "Caldo Sulfocálcico", category: "Defensa Mineral", mainIngredient: "Azufre + Cal", ph: "Fuerte Alcalino", dilution: "1% a 3%" },
        { id: "super-magro", name: "Súper Magro Fermentado", category: "Biofertilizante Anaeróbico", mainIngredient: "Estiércol + Minerales + Melaza", ph: "Ácido (3.5 - 4.2)", dilution: "5% a 10%" },
        { id: "caldo-ceniza", name: "Caldo de Ceniza", category: "Nutrición y Defensa", mainIngredient: "Ceniza de Madera + Jabón", ph: "Alcalino", dilution: "5%" },
        { id: "fosfito-artesanal", name: "Fosfitos de Hueso", category: "Inductor de Defensas", mainIngredient: "Huesos calcinados + Ácido", ph: "Neutro-Ligeramente Ácido", dilution: "1% a 2%" }
      ].filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  };

  const downloadJSON = () => {
    const data = getSelectedData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedDataset}_api_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadCSV = () => {
    const data = getSelectedData();
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(fieldName => {
        const val = (row as any)[fieldName];
        return typeof val === "object" ? `"${JSON.stringify(val).replace(/"/g, '""')}"` : `"${String(val).replace(/"/g, '""')}"`;
      }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedDataset}_api_export.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // RSS Feed XML Simulator
  const getRSSXML = () => {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Agricultura Antigua - Sindicación Agroecológica</title>
  <link>https://agricultura-antigua.org</link>
  <description>Feeds RSS de alta fidelidad optimizados para agregadores de noticias y Agentes Autónomos de IA.</description>
  <language>es-ES</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="https://agricultura-antigua.org/rss.xml" rel="self" type="application/rss+xml" />
  
  <item>
    <title>Manual del Caldo Sulfocálcico y Tratamientos de Invierno</title>
    <link>https://agricultura-antigua.org/biblioteca/caldo-sulfocalcico</link>
    <guid>https://agricultura-antigua.org/biblioteca/caldo-sulfocalcico</guid>
    <pubDate>Mon, 06 Jul 2026 12:00:00 GMT</pubDate>
    <description><![CDATA[ Guía completa de preparación segura y diluciones exactas de caldos minerales para el control preventivo en frutales. ]]></description>
    <author>Nelson Durán</author>
    <category>Preparación de Bioinsumos</category>
  </item>
  
  <item>
    <title>Entendiendo el Suelo Vivo: Hongos Micorrícicos y Nutrición</title>
    <link>https://agricultura-antigua.org/biblioteca/suelo-vivo</link>
    <guid>https://agricultura-antigua.org/biblioteca/suelo-vivo</guid>
    <pubDate>Thu, 02 Jul 2026 15:30:00 GMT</pubDate>
    <description><![CDATA[ El rol de la simbiosis micorrícica en la solubilización de fósforo fijado y la estabilidad de agregados en suelos arcillosos. ]]></description>
    <author>Nelson Durán</author>
    <category>Nutrición de Suelos</category>
  </item>
</channel>
</rss>`;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscriptionSuccess(true);
      setTimeout(() => {
        setSubscriptionSuccess(false);
        setSubscribedEmail("");
      }, 4000);
    }
  };

  return (
    <div className="space-y-8 py-4" id="ai-ready-section">
      {/* Dynamic Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0c2a43] via-[#091b29] to-[#040c14] border border-stone-800 p-6 sm:p-8 text-stone-100 shadow-xl" id="aiready-hero">
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=100&w=2400" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <Bot className="h-4 w-4 animate-pulse" />
              <span>Plataforma "AI-Ready" Homologada</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Web AI-Ready: Sindicación y Estructuración de Saberes
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              Las páginas web del futuro deben diseñarse para dos audiencias: <strong>humanos</strong> que aprecian el diseño e interacción, y <strong>modelos de IA</strong> que extraen, sintetizan y buscan fuentes fidedignas con datos semánticos estructurados. Explore nuestra consola de sindicación y optimización.
            </p>
          </div>
          <div className="flex flex-col bg-stone-900/60 border border-stone-800 rounded-2xl p-4 font-mono text-[10px] text-stone-400 space-y-1 w-full md:w-auto shrink-0 md:min-w-[200px]" id="live-crawler-metrics">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-1.5 mb-1.5">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-stone-200 font-bold">Estado Crawler</span>
            </div>
            <p>User-Agent: <span className="text-gold">GeminiBot / OpenAI</span></p>
            <p>Formatos: <span className="text-emerald-400">JSON-LD, RSS, REST</span></p>
            <p>E-E-A-T Score: <span className="text-emerald-400">Excelente (Verificado)</span></p>
            <p>Semántica W3C: <span className="text-emerald-400">100% Accesible</span></p>
          </div>
        </div>
      </div>

      {/* Main Tab Controller */}
      <div className="flex border-b border-stone-200" id="aiready-main-tabs">
        {[
          { id: "teoria", label: "1. El Nuevo Rol: AI-Ready", icon: FileText },
          { id: "playground", label: "2. Repositorio & API (Datos)", icon: Database },
          { id: "comparador", label: "3. Cuadro Comparativo", icon: Scale }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
                isActive 
                  ? "border-emerald-600 text-emerald-900 font-bold bg-stone-50" 
                  : "border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-100/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-stone-400"}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="transition-all duration-300" id="aiready-main-content">
        {/* TAB 1: THEORETICAL MODULES WITH INTERACTIVE Toggles */}
        {activeTab === "teoria" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Menu inside theory */}
            <div className="lg:col-span-3 space-y-2">
              {[
                { id: "schema", label: "Datos Estructurados (Schema)", desc: "JSON-LD para crawlers", icon: FileCode },
                { id: "faq", label: "Formato FAQ (Preguntas)", desc: "Optimizado para LLMs", icon: HelpCircle },
                { id: "eeat", label: "Autoridad E-E-A-T", desc: "Confianza y Verificación", icon: ShieldAlert }
              ].map(item => {
                const Icon = item.icon;
                const isSubActive = subTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSubTab(item.id as any)}
                    className={`flex items-start gap-3 w-full p-3.5 text-left rounded-xl transition-all border ${
                      isSubActive 
                        ? "bg-white border-emerald-500 shadow-xs text-emerald-900" 
                        : "bg-stone-50 hover:bg-stone-100 border-transparent text-stone-600"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSubActive ? "bg-emerald-50 text-emerald-600" : "bg-stone-200/50 text-stone-500"}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{item.label}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5 leading-none">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Theory Sub-tab Content Area */}
            <div className="lg:col-span-9 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
              {subTab === "schema" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                      <Code className="h-5 w-5 text-emerald-600" />
                      API y Datos Estructurados (Schema Markup)
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      La Inteligencia Artificial y los bots no navegan las páginas web como nosotros. No se deslumbran por las animaciones; buscan **estructuras explícitas**. El código **Schema (Schema.org)** inyectado como un script `ld+json` describe exactamente los datos críticos, garantizando que los LLMs respondan de forma verídica sobre tus servicios.
                    </p>
                  </div>

                  {/* Interactive Schema Generator Playground */}
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wide">Simulador de Schema Markup</span>
                        <h4 className="text-xs font-bold text-stone-800">Seleccione el tipo de elemento para generar su JSON-LD:</h4>
                      </div>
                      <select
                        value={selectedSchemaItem}
                        onChange={(e) => setSelectedSchemaItem(e.target.value)}
                        className="rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs text-stone-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      >
                        <option value="course-suelo-vivo">Curso (Suelo Vivo)</option>
                        <option value="recipe-caldo-sulfocalcico">Receta / Bioinsumo (Caldo Sulfocálcico)</option>
                        <option value="article-transicion">Artículo de Autoridad (E-E-A-T)</option>
                      </select>
                    </div>

                    <div className="relative">
                      <pre className="bg-stone-900 text-stone-200 font-mono text-[11px] p-4 rounded-lg overflow-x-auto max-h-[250px] border border-stone-800 leading-relaxed">
                        {schemaString}
                      </pre>
                      <button
                        onClick={() => handleCopy(schemaString)}
                        className="absolute top-2.5 right-2.5 bg-stone-800/80 hover:bg-emerald-600 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-all flex items-center gap-1 border border-stone-700"
                        title="Copiar Schema Markup"
                      >
                        {copiedText ? <Check className="h-3 w-3 text-green-300" /> : <Copy className="h-3 w-3" />}
                        {copiedText ? "Copiado!" : "Copiar JSON-LD"}
                      </button>
                    </div>

                    <div className="flex items-start gap-2.5 text-[11px] text-stone-500 bg-white p-3 rounded-lg border border-stone-200/80 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Ventaja ante LLMs:</strong> Al indexar este bloque, un robot de búsqueda como Gemini o ChatGPT sabe exactamente qué ingredientes lleva tu receta, qué nivel tiene tu curso y quién lo avala, sin riesgo de alucinaciones.</span>
                    </div>
                  </div>
                </div>
              )}

              {subTab === "faq" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-emerald-600" />
                        Formatos de Pregunta-Respuesta (FAQ) para Modelos RAG
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Los sistemas de generación aumentada por recuperación (RAG) dividen tu web en fragmentos ("chunks"). Si estructuramos la información usando títulos claros en forma de pregunta y párrafos concisos como respuesta, facilitamos que la IA extraiga el dato limpio.
                      </p>
                    </div>
                    {/* Interactive button to show Raw Markdown Bot view */}
                    <button
                      onClick={() => setCrawlerView(!crawlerView)}
                      className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold border flex items-center gap-2 transition-all ${
                        crawlerView 
                          ? "bg-stone-900 text-emerald-400 border-stone-800" 
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-200"
                      }`}
                    >
                      <Terminal className="h-4 w-4" />
                      {crawlerView ? "Ver Vista Humana (Formato)" : "Ver Vista Crawler (Markdown)"}
                    </button>
                  </div>

                  {crawlerView ? (
                    <div className="bg-stone-950 text-stone-300 font-mono text-[11px] p-5 rounded-xl border border-stone-800 space-y-4">
                      <p className="text-stone-500"># FORMATO OPTIMIZADO PARA INGESTA LLM (RAG-READY)</p>
                      <div>
                        <p className="text-emerald-400 font-bold">## ¿Qué son los bioinsumos artesanales y cuál es su beneficio principal?</p>
                        <p className="mt-1 pl-4 border-l border-emerald-800/50">Son preparaciones biológicas u orgánicas elaboradas en la propia finca usando recursos locales (estiércol, plantas, minerales). Su principal beneficio es reducir la dependencia de insumos sintéticos costosos, devolviendo la vida microbiológica al suelo y reduciendo costos hasta en un 80%.</p>
                      </div>
                      <div>
                        <p className="text-emerald-400 font-bold">## ¿Cómo influye el "Suelo Vivo" en la nutrición vegetal de los cultivos?</p>
                        <p className="mt-1 pl-4 border-l border-emerald-800/50">Un suelo vivo posee un ecosistema microbiológico diverso (bacterias solubilizadoras, hongos micorrícicos). Estos microorganismos actúan como puente, transformando los minerales fijados en la roca y arcilla del suelo en formas quelatadas asimilables por las raíces.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border border-stone-200/80 rounded-xl p-4.5 hover:border-emerald-200 hover:bg-emerald-50/10 transition-all">
                        <h4 className="font-serif text-sm font-bold text-stone-950">¿Qué son los bioinsumos artesanales y cuál es su beneficio principal?</h4>
                        <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                          Son preparaciones biológicas u orgánicas elaboradas en la propia finca usando recursos locales (estiércol, plantas, minerales). Su principal beneficio es reducir la dependencia de insumos sintéticos costosos, devolviendo la vida microbiológica al suelo y reduciendo costos hasta en un 80%.
                        </p>
                      </div>

                      <div className="border border-stone-200/80 rounded-xl p-4.5 hover:border-emerald-200 hover:bg-emerald-50/10 transition-all">
                        <h4 className="font-serif text-sm font-bold text-stone-950">¿Cómo influye el "Suelo Vivo" en la nutrición vegetal de los cultivos?</h4>
                        <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                          Un suelo vivo posee un ecosistema microbiológico diverso (bacterias solubilizadoras, hongos micorrícicos). Estos microorganismos actúan como puente, transformando los minerales fijados en la roca y arcilla del suelo en formas quelatadas asimilables por las raíces.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {subTab === "eeat" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-emerald-600" />
                      Contenido de Autoridad y Experiencia (E-E-A-T)
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      El algoritmo de Google y los rastreadores de modelos de IA de última generación castigan fuertemente el contenido basura generado en masa. Las IA tienden a citar fuentes que demuestren <strong>Experiencia, Conocimiento profundo, Autoridad y Confiabilidad (E-E-A-T)</strong>. 
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: "Experiencia Práctica", desc: "Datos originales tomados en campo. Registros experimentales de la Biofábrica Utopía." },
                      { title: "Autoridad Técnica", desc: "Estudios propios de cromatografía y análisis de suelo con firma de microbiólogos agroecológicos." },
                      { title: "Confiabilidad (Transparencia)", desc: "Sin sesgo publicitario. Fórmulas de dominio público con descripciones de limitaciones y seguridad." }
                    ].map((card, i) => (
                      <div key={i} className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-1.5">
                        <div className="h-1.5 w-8 bg-emerald-600 rounded-full"></div>
                        <h4 className="text-xs font-bold text-stone-900">{card.title}</h4>
                        <p className="text-[10px] text-stone-500 leading-relaxed">{card.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs text-emerald-950 leading-relaxed">
                      <strong>Nuestra Firma del Experto:</strong> Todos los contenidos de Agricultura Antigua se asocian de forma unívoca a expertos reales firmantes como <strong>Nelson Durán</strong>, con enlaces verificables a sus aportes técnicos en campo, otorgando un altísimo índice de confianza en la red de conocimiento de la IA.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE DATA PLAYGROUND / APIS & SYNDICATION */}
        {activeTab === "playground" && (
          <div className="space-y-8">
            {/* Split layout: API REST simulator + RSS Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* REST API Simulator */}
              <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Database className="h-5 w-5 text-emerald-600" />
                    Repositorio de Datos & API Pública (Simulada)
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Si tu información es técnica o de catálogo, estructurarla en endpoints consumibles de forma nativa permite que los agentes y programadores de IA absorban y analicen tus datos sin distorsión visual.
                  </p>
                </div>

                {/* API Sandbox Area */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
                  {/* Selector & Search bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { id: "courses", label: "Cursos de Suelo" },
                        { id: "library", label: "Biblioteca Digital" },
                        { id: "recipes", label: "Recetario de Bioinsumos" }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setSelectedDataset(tab.id as any);
                            setSearchQuery("");
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selectedDataset === tab.id 
                              ? "bg-emerald-600 text-white" 
                              : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filtrar colección..."
                        className="rounded-lg border border-stone-300 bg-white px-3 py-1 text-xs text-stone-700 outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* REST Simulator output info */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 bg-white px-3.5 py-2 rounded-lg border border-stone-200/80">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold">GET</span>
                      <span>/api/v1/agricultura-antigua/{selectedDataset}?limit={getSelectedData().length}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={downloadJSON} className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" />
                        JSON
                      </button>
                      <button onClick={downloadCSV} className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" />
                        CSV
                      </button>
                    </div>
                  </div>

                  {/* Output code block */}
                  <div className="relative">
                    <pre className="bg-stone-900 text-emerald-400 font-mono text-[11px] p-4 rounded-lg overflow-x-auto max-h-[250px] border border-stone-800 leading-relaxed">
                      {JSON.stringify(getSelectedData(), null, 2)}
                    </pre>
                    <button
                      onClick={() => handleCopy(JSON.stringify(getSelectedData(), null, 2))}
                      className="absolute top-2.5 right-2.5 bg-stone-800/80 hover:bg-emerald-600 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-all flex items-center gap-1 border border-stone-700"
                    >
                      {copiedText ? <Check className="h-3 w-3 text-green-300" /> : <Copy className="h-3 w-3" />}
                      {copiedText ? "Copiado!" : "Copiar JSON"}
                    </button>
                  </div>
                </div>
              </div>

              {/* RSS Feed Simulator */}
              <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                      <Rss className="h-5 w-5 text-amber-600" />
                      Feed de Sindicación RSS
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Los RSS no son cosa del pasado. Hoy en día, los agentes inteligentes, bots rastreadores y newsletters automáticos se suscriben a feeds XML limpios para recopilar actualizaciones de contenido instantáneas.
                    </p>
                  </div>

                  {/* XML block */}
                  <div className="relative">
                    <pre className="bg-stone-900 text-stone-300 font-mono text-[9px] p-3 rounded-lg overflow-x-auto max-h-[200px] border border-stone-800 leading-tight">
                      {getRSSXML()}
                    </pre>
                    <button
                      onClick={() => handleCopy(getRSSXML())}
                      className="absolute top-1.5 right-1.5 bg-stone-800/80 hover:bg-amber-600 text-white rounded px-2 py-1 text-[9px] font-semibold transition-all"
                    >
                      {copiedText ? "Copiado!" : "Copiar XML"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-200">
                  <p className="text-[10px] text-stone-500 font-mono">URL del Feed Oficial:</p>
                  <p className="text-xs font-bold text-amber-800 font-mono">https://agricultura-antigua.org/rss.xml</p>
                </div>
              </div>
            </div>

            {/* Zero Click Channel Mock Area */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wide bg-emerald-100/50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Canales de Zero-Click
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-emerald-600" />
                    La Newsletter Agroecológica Directa
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Dado que los buscadores tradicionales prefieren retener al usuario respondiendo con resúmenes rápidos de IA ("Zero-Click"), los creadores de contenido de valor protegen y difunden su conocimiento con boletines directos al correo del usuario y comunidades privadas en Slack o Discord.
                  </p>
                </div>

                {/* Substack/Beehiiv mock signup */}
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-100 text-emerald-700 flex items-center justify-center rounded-xl border border-emerald-200">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Agricultura Antigua Digest</h4>
                      <p className="text-[10px] text-stone-500">Únete a 4,200 agricultores y científicos de suelos</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={subscribedEmail}
                      onChange={(e) => setSubscribedEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="flex-1 rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-700 outline-none focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold transition-all shadow-xs"
                    >
                      Suscribirme
                    </button>
                  </form>

                  {subscriptionSuccess && (
                    <p className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-2 flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      ¡Suscripción simulada con éxito! Has sido incorporado al feed de confianza.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPARATIVE MATRIX */}
        {activeTab === "comparador" && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <Scale className="h-5 w-5 text-emerald-600" />
                Matriz Comparativa de Formatos ante la Era de la IA
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Cada formato cumple un rol estratégico según tu modelo de negocio y tus metas de indexación frente a las herramientas de IA.
              </p>
            </div>

            {/* Styled Comparison Grid/Table */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-xs" id="comparador-tabla">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-700">
                      <th className="p-4 font-serif">Formato</th>
                      <th className="p-4">Ventaja ante la IA</th>
                      <th className="p-4">Desventaja / Limitación</th>
                      <th className="p-4">Ideal para...</th>
                      <th className="p-4 text-center">AI Index-Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-xs text-stone-600 leading-relaxed">
                    {[
                      {
                        name: "Web Tradicional (SEO clásico)",
                        ventaja: "Visible para el público general, excelente experiencia visual.",
                        desventaja: "Riesgo de perder tráfico por las respuestas directas del buscador (Zero-Click).",
                        ideal: "Marcas corporativas, portafolios, e-commerce general.",
                        score: "🟡 Regular"
                      },
                      {
                        name: "Web Estructurada (Semántica/Schema)",
                        ventaja: "Altísima probabilidad de ser citada como fuente oficial por la IA.",
                        desventaja: "Requiere mayor esfuerzo técnico y estructuración semántica estricta.",
                        ideal: "Blogs de nicho, guías técnicas, recetas, portales informativos.",
                        score: "🟢 Excelente"
                      },
                      {
                        name: "Bases de datos / APIs Públicas",
                        ventaja: "Consumo nativo, perfecto para entrenamiento y consulta directa de LLMs.",
                        desventaja: "No es amigable para el usuario final común si carece de interfaz visual.",
                        ideal: "Información científica, catálogos técnicos, estadísticas y herramientas.",
                        score: "🔥 Perfecto"
                      },
                      {
                        name: "Sindicación RSS / Atom",
                        ventaja: "Monitoreo automatizado instantáneo por curadores de IA y boletines.",
                        desventaja: "Formato puramente plano, se pierde control estético.",
                        ideal: "Actualizaciones de noticias, blogs académicos de alta frecuencia.",
                        score: "🟢 Excelente"
                      },
                      {
                        name: "Newsletters (Suscripción Directa)",
                        ventaja: "Evita intermediación de buscadores e IAs, canal propio y de alta confianza.",
                        desventaja: "Complejo de hacer crecer de forma orgánica inicialmente.",
                        ideal: "Creadores de opinión, cursos exclusivos, comunidades de nicho.",
                        score: "🛡️ Inmune (Canal Directo)"
                      }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-4 font-bold text-stone-900 border-r border-stone-100 font-serif">{row.name}</td>
                        <td className="p-4 text-stone-600 border-r border-stone-100">{row.ventaja}</td>
                        <td className="p-4 text-stone-500 border-r border-stone-100">{row.desventaja}</td>
                        <td className="p-4 text-stone-700 font-medium border-r border-stone-100">{row.ideal}</td>
                        <td className="p-4 text-center font-mono font-bold text-emerald-800 bg-emerald-50/20">{row.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-3 text-xs text-amber-950 leading-relaxed">
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <strong>Conclusión Estratégica:</strong> No es necesario elegir uno solo. En <strong>Agricultura Antigua</strong> implementamos un ecosistema híbrido: una <strong>Web Semántica</strong> enriquecida con Schema Markup JSON-LD para ser citados como fuente, y un <strong>Repositorio API JSON / RSS</strong> para consumo crudo de agentes, preservando la relación directa con los humanos mediante boletines.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
