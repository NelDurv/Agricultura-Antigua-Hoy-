/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Users,
  FileSpreadsheet,
  Plus,
  Search,
  TrendingUp,
  CheckCircle2,
  X,
  PlusCircle
} from "lucide-react";
import { INSTITUCIONES_ESTUDIANTES } from "../data";
import type { EstudianteInstitucional } from "../data";
import { PageRenderer } from "./blocks";
import type { PageBlock } from "./blocks";

export default function InstitucionesSection() {
  const [estudiantes, setEstudiantes] = useState<EstudianteInstitucional[]>(INSTITUCIONES_ESTUDIANTES);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newComunidad, setNewComunidad] = useState("");
  const [newCourse, setNewCourse] = useState("Suelo Vivo: Microbiología y Regeneración");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRegisterEstudiante = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComunidad.trim()) return;

    const newEst: EstudianteInstitucional = {
      id: `est-${Date.now()}`,
      name: newName,
      comunidad: newComunidad,
      course: newCourse,
      progress: 0,
      startDate: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
    };

    setEstudiantes(prev => [...prev, newEst]);
    setNewName("");
    setNewComunidad("");
    setShowAddForm(false);
  };

  const filteredEstudiantes = estudiantes.filter((est) => {
    return est.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           est.comunidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
           est.course.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Aggregated Metrics
  const totalStudents = estudiantes.length;
  const certifiedStudents = estudiantes.filter(e => e.progress === 100).length;
  const averageProgress = Math.round(estudiantes.reduce((acc, curr) => acc + curr.progress, 0) / totalStudents);

  return (
    <div className="space-y-8 py-4" id="instituciones-section">
      {/* Header */}
      <PageRenderer blocks={[{
        type: 'hero',
        id: 'instituciones-hero',
        props: {
          badge: 'Consola Cooperativa',
          title: 'Panel para Instituciones',
          subtitle: 'Diseñado para cooperativas de productores, municipios y ONGs que implementan programas de capacitación agrícola asistida en sus comunidades. Monitorea el avance de tus agricultores asociados en tiempo real.',
          backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=100&w=2400',
        },
      }]} />

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="inst-metrics">
        <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wide">Agricultores Vinculados</span>
            <p className="font-serif text-3xl font-bold text-stone-900 mt-1">{totalStudents}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-stone-200/50 text-stone-700 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wide font-semibold">Certificados Obtenidos</span>
            <p className="font-serif text-3xl font-bold text-emerald-800 mt-1">{certifiedStudents}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wide">Promedio de Progreso</span>
            <p className="font-serif text-3xl font-bold text-stone-900 mt-1">{averageProgress}%</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-stone-200/50 text-stone-700 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Table & Controls workspace */}
      <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 space-y-6" id="inst-table-workspace">
        
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-stone-200 pb-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar agricultor, comunidad o curso..."
              className="w-full rounded-xl bg-stone-100 hover:bg-stone-200/50 focus:bg-stone-50 border border-stone-200 focus:border-emerald-500 text-xs pl-10 pr-4 py-2.5 outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex-grow sm:flex-grow-0 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-stone-50 text-xs font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
              id="coop-register-farmer-btn"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Matricular Agricultor</span>
            </button>

            <button
              onClick={() => alert("Simulando exportación de datos... Se ha generado un archivo CSV con la lista de agricultores y su progreso académico.")}
              className="px-3.5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl border border-stone-300 transition-colors inline-flex items-center justify-center gap-1"
            >
              <FileSpreadsheet className="h-4.5 w-4.5 text-stone-500" />
              <span className="hidden sm:inline">Exportar Excel/CSV</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse" id="farmers-progress-table">
            <thead>
              <tr className="bg-stone-100 text-stone-500 text-[10px] font-mono uppercase border-b border-stone-200">
                <th className="p-4 font-semibold">Agricultor</th>
                <th className="p-4 font-semibold">Comunidad / Cooperativa</th>
                <th className="p-4 font-semibold">Curso Activo</th>
                <th className="p-4 font-semibold">Fecha Registro</th>
                <th className="p-4 font-semibold">Progreso Educativo</th>
                <th className="p-4 font-semibold text-right">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredEstudiantes.map((est) => (
                <tr key={est.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="p-4 font-serif font-bold text-stone-900">{est.name}</td>
                  <td className="p-4 text-stone-600">{est.comunidad}</td>
                  <td className="p-4 text-stone-800 font-medium">{est.course}</td>
                  <td className="p-4 text-stone-500 font-mono">{est.startDate}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-stone-500 w-8">{est.progress}%</span>
                      <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden shrink-0">
                        <div 
                          className={`h-full rounded-full ${est.progress === 100 ? "bg-emerald-600" : "bg-emerald-500"}`} 
                          style={{ width: `${est.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {est.progress === 100 ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-semibold text-[9px] font-mono px-2 py-0.5 rounded border border-emerald-100">
                        <CheckCircle2 className="h-3 w-3 inline text-emerald-700" /> Certificado
                      </span>
                    ) : est.progress > 0 ? (
                      <span className="bg-amber-50 text-amber-800 text-[9px] font-mono px-2 py-0.5 rounded border border-amber-200">
                        En Curso
                      </span>
                    ) : (
                      <span className="bg-stone-100 text-stone-500 text-[9px] font-mono px-2 py-0.5 rounded border border-stone-200">
                        Matriculado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Farmer Modal Dialog */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl bg-stone-50 border border-stone-200 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-1.5">
                <PlusCircle className="h-5 w-5 text-emerald-600" />
                <span>Matricular Nuevo Agricultor</span>
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterEstudiante} className="space-y-4" id="coop-add-farmer-form">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wide">Nombre Completo del Agricultor</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Don Abelardo Mendoza"
                  className="w-full rounded-xl bg-stone-100 hover:bg-stone-200/50 focus:bg-stone-50 border border-stone-200 focus:border-emerald-500 text-xs px-4 py-3 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wide">Comunidad de Residencia / Cooperativa</label>
                <input
                  type="text"
                  required
                  value={newComunidad}
                  onChange={(e) => setNewComunidad(e.target.value)}
                  placeholder="Ej. Vereda Alto de las Cruces"
                  className="w-full rounded-xl bg-stone-100 hover:bg-stone-200/50 focus:bg-stone-50 border border-stone-200 focus:border-emerald-500 text-xs px-4 py-3 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-stone-500 uppercase tracking-wide">Curso Asignado</label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full rounded-xl bg-stone-100 focus:bg-stone-50 border border-stone-200 focus:border-emerald-500 text-xs px-4 py-3 outline-none transition-all"
                >
                  <option value="Suelo Vivo: Microbiología y Regeneración">Suelo Vivo: Microbiología y Regeneración</option>
                  <option value="Biofertilizantes y Caldos Minerales">Biofertilizantes y Caldos Minerales</option>
                  <option value="Abonos Fermentados tipo Bokashi">Abonos Fermentados tipo Bokashi</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors hover:bg-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-stone-50 text-xs font-semibold rounded-xl transition-colors hover:bg-emerald-700"
                >
                  Confirmar Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
