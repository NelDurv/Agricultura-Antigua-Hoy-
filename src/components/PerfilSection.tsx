/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Award, 
  Heart, 
  Settings, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  Building,
  GraduationCap
} from "lucide-react";
import { UserMembership, Certificate } from "../types";
import { BIBLIOTECA } from "../data";
import { useAuth, useProgress, useUI } from "../contexts";

export default function PerfilSection() {
  const navigate = useNavigate();
  const { userName, userEmail, userMembership, certificates, onChangeProfile } = useAuth();
  const { favorites } = useProgress();
  const { dataSaver, toggleDataSaver } = useUI();

  const displayCerts = useMemo(() => {
    const completed32Courses = (() => {
      try {
        const saved = localStorage.getItem("completed_courses_32");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    })();

    const certs = [...certificates];
    if (completed32Courses.length === 32 && !certs.some(c => c.id === "utopia-master-cert")) {
      certs.push({
        id: "utopia-master-cert",
        courseId: "utopia-master",
        courseTitle: "Especialidad Agroecológica del Modelo Utopía (32 Cursos)",
        recipientName: userName,
        date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
        code: "AA-UTOPIA-99832"
      });
    }
    return certs;
  }, [certificates, userName]);

  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);
  const [tempMembership, setTempMembership] = useState<UserMembership>(userMembership);
  
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeProfile(tempName, tempEmail, tempMembership);
    setEditMode(false);
  };

  const favoriteDocs = BIBLIOTECA.filter(doc => favorites.includes(doc.id));

  return (
    <div className="space-y-8 py-4" id="perfil-section">
      {/* Header */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-primary tracking-wider uppercase font-bold">Mi Espacio Académico</span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Mi Perfil Estudiantil</h2>
        <p className="text-xs text-stone-600 max-w-2xl">
          Administra tus datos personales, consulta tus certificados oficiales descargables y revisa tu catálogo personal de lecturas técnicas marcadas como favoritas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal info & configuration settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-6 border-b-4 border-gold shadow-xs">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-20 w-20 rounded-full bg-primary text-stone-50 border-4 border-stone-100 flex items-center justify-center text-3xl font-serif font-black shadow-inner">
                {userName.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">{userName}</h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">{userEmail}</p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono tracking-wider font-bold rounded-full border bg-gold/10 text-stone-950 border-gold/40">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>{userMembership}</span>
              </div>
            </div>

            {/* Profile configuration Form */}
            {editMode ? (
              <form onSubmit={handleSaveChanges} className="space-y-4 border-t border-stone-200 pt-4" id="profile-edit-form">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-stone-500 uppercase">Simular Nivel de Membresía</label>
                  <select
                    value={tempMembership}
                    onChange={(e) => setTempMembership(e.target.value as UserMembership)}
                    className="w-full rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-xs outline-none focus:border-gold"
                  >
                    <option value={UserMembership.Visitor}>{UserMembership.Visitor}</option>
                    <option value={UserMembership.Free}>{UserMembership.Free}</option>
                    <option value={UserMembership.Premium}>{UserMembership.Premium}</option>
                    <option value={UserMembership.Institutional}>{UserMembership.Institutional}</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary text-stone-50 text-xs font-semibold rounded-xl hover:bg-gold hover:text-stone-950 transition-all"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <div className="border-t border-stone-200 pt-4">
                <button
                  onClick={() => {
                    setTempName(userName);
                    setTempEmail(userEmail);
                    setTempMembership(userMembership);
                    setEditMode(true);
                  }}
                  className="w-full py-2.5 bg-primary hover:bg-gold hover:text-stone-950 text-stone-50 text-xs font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-1.5"
                  id="profile-config-btn"
                >
                  <Settings className="h-4 w-4" />
                  <span>Configurar Cuenta</span>
                </button>
              </div>
            )}
          </div>

          {/* Settings / Preferences Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4 border-b-4 border-gold/40 shadow-xs">
            <div className="flex items-center gap-2 text-stone-900">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-base font-bold">Preferencias del Sistema</h3>
            </div>
            
            <div className="border-t border-stone-200/60 pt-4 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-stone-900">Modo de Ahorro de Datos</h4>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Deshabilita las animaciones pesadas y carga imágenes de baja resolución optimizadas para conexiones lentas o móviles.
                  </p>
                </div>
                
                {/* Switch button */}
                <button
                  onClick={() => toggleDataSaver(!dataSaver)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    dataSaver ? "bg-primary" : "bg-stone-200"
                  }`}
                  id="data-saver-switch"
                  type="button"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      dataSaver ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              
              {/* Micro visual indicator badge */}
              <div className="flex items-center gap-2 text-[10px] font-mono p-2.5 rounded-xl bg-stone-50 border border-stone-200/50">
                <div className={`h-2 w-2 rounded-full ${dataSaver ? "bg-gold" : "bg-stone-300"}`} />
                <span className={dataSaver ? "text-primary font-bold" : "text-stone-500"}>
                  {dataSaver ? "Ahorro Activo: Animaciones Desactivadas" : "Modo Estándar Activo"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Achievements (Certificados) & Bookmarked articles (Favoritos) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Certificados (Unlocks) */}
          <div className="p-6 bg-white border border-stone-200 rounded-3xl space-y-4 border-b-4 border-gold shadow-xs">
            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <Award className="h-5.5 w-5.5 text-gold" />
              <span>Certificados Obtenidos ({displayCerts.length})</span>
            </h3>

            {displayCerts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayCerts.map((cert) => (
                  <div 
                    key={cert.id}
                    onClick={() => setActiveCert(cert)}
                    className="p-5 bg-white border border-stone-200 rounded-2xl cursor-pointer hover:border-gold hover:shadow-xs transition-all flex flex-col justify-between h-36 group border-b-2 border-gold/40"
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-mono text-stone-400">
                        <span>CÓDIGO: {cert.code}</span>
                        <Award className="h-3.5 w-3.5 text-gold" />
                      </div>
                      <h4 className="font-serif text-xs font-bold text-stone-950 group-hover:text-primary transition-colors line-clamp-2">
                        {cert.courseTitle}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-stone-400">{cert.date}</span>
                      <span className="text-primary font-bold group-hover:underline">Visualizar</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-stone-200 rounded-2xl bg-stone-50 space-y-2">
                <GraduationCap className="h-7 w-7 text-stone-400 mx-auto" />
                <h4 className="font-serif text-xs font-bold text-stone-700">Ningún certificado emitido aún</h4>
                <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                  Completa el 100% de las lecciones prácticas y aprueba los cuestionarios de evaluación en la pestaña **Academia** para emitir tus credenciales oficiales.
                </p>
                <button
                  onClick={() => navigate("/academia")}
                  className="mt-2 text-xs font-bold text-primary hover:text-gold transition-colors"
                >
                  Ir a Cursos Disponibles
                </button>
              </div>
            )}
          </div>

          {/* Section: Mis Lecturas Favoritas */}
          <div className="p-6 bg-white border border-stone-200 rounded-3xl space-y-4 border-b-4 border-gold shadow-xs">
            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <Heart className="h-5.5 w-5.5 text-gold" />
              <span>Mis Lecturas Técnicas Favoritas ({favoriteDocs.length})</span>
            </h3>

            {favoriteDocs.length > 0 ? (
              <div className="space-y-2">
                {favoriteDocs.map((doc) => (
                  <div 
                    key={doc.id}
                    onClick={() => navigate("/biblioteca/" + doc.id)}
                    className="p-3 bg-stone-50 border border-stone-100 hover:border-gold rounded-xl cursor-pointer hover:shadow-xs transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 pr-4">
                      <span className="text-[8px] font-mono text-primary bg-gold/10 px-1.5 py-0.2 rounded uppercase border border-gold/20 font-bold">
                        {doc.category}
                      </span>
                      <h4 className="font-serif text-xs font-bold text-stone-900 group-hover:text-primary transition-colors line-clamp-1">
                        {doc.title}
                      </h4>
                    </div>
                    <span className="text-stone-400 hover:text-primary shrink-0 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-stone-200 rounded-2xl bg-stone-50 space-y-1">
                <Heart className="h-6 w-6 text-stone-300 mx-auto" />
                <h4 className="font-serif text-xs font-bold text-stone-700">Sin lecturas guardadas</h4>
                <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                  Navega por la pestaña **Biblioteca** y marca las guías o fichas con el ícono de corazón para tenerlas siempre a la mano aquí.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Certificate Viewer Modal Overlay */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white border border-stone-300 shadow-2xl p-6 sm:p-10 space-y-6 my-8 text-center border-t-8 border-gold" id="certificate-print-modal">
            
            <button
              onClick={() => setActiveCert(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 text-xs font-mono font-bold"
            >
              Cerrar [X]
            </button>

            {/* Certificate visual card */}
            <div className="border-8 border-primary/10 rounded-2xl p-6 sm:p-10 bg-stone-50 relative space-y-6 shadow-xs border-double">
              <div className="absolute top-4 right-4 text-primary/5">
                <Building className="h-24 w-24" />
              </div>

              {/* Header */}
              <div className="space-y-1.5 relative">
                <h3 className="font-serif text-xl sm:text-2xl font-black text-primary uppercase tracking-tight">CERTIFICADO DE APROBACIÓN</h3>
                <p className="font-mono text-[9px] text-primary uppercase tracking-wider font-bold">Agricultura Antigua • Campus de Saberes Regenerativos Andinos</p>
              </div>

              {/* Main certificate text */}
              <div className="space-y-4">
                <p className="text-xs text-stone-500 italic">Otorgado con orgullo y registro oficial de saberes a:</p>
                <h4 className="font-serif text-lg sm:text-2xl font-bold text-stone-900 tracking-tight border-b-2 border-gold/40 pb-2 inline-block px-8 max-w-full truncate">
                  {activeCert.recipientName}
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Por haber cumplido satisfactoriamente con todos los talleres de campo prácticos, lecturas críticas de base y pruebas por competencia del curso especializado en:
                </p>
                <p className="font-serif text-sm sm:text-lg font-bold text-primary leading-snug">
                  &quot;{activeCert.courseTitle}&quot;
                </p>
              </div>

              {/* Signatures & Footer metadata */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-stone-200">
                <div className="text-center space-y-1.5">
                  <div className="font-serif text-xs font-semibold text-stone-500 italic">Ing. Alejandro Salazar</div>
                  <div className="text-[9px] font-mono text-stone-400 uppercase tracking-wide">Dirección Académica</div>
                </div>
                <div className="text-center space-y-1.5">
                  <div className="font-serif text-xs font-semibold text-stone-500 italic">Junta de Saberes Agrícolas</div>
                  <div className="text-[9px] font-mono text-stone-400 uppercase tracking-wide">Comité Evaluador</div>
                </div>
              </div>

              <div className="text-center pt-4">
                <span className="font-mono text-[8px] text-stone-400 uppercase tracking-widest block">Código Único de Registro en Cadena Nacional:</span>
                <span className="font-mono text-[10px] text-stone-600 font-bold tracking-wide mt-1 block">{activeCert.code}</span>
                <span className="font-mono text-[9px] text-stone-400 mt-1 block">Expedido el {activeCert.date}</span>
              </div>
            </div>

            {/* Print trigger button & state */}
            <div className="flex flex-col gap-2 items-center justify-center">
              <button
                disabled={isDownloading}
                onClick={() => {
                  setIsDownloading(true);
                  setTimeout(() => setIsDownloading(false), 2500);
                }}
                className="px-5 py-2.5 bg-primary hover:bg-gold hover:text-stone-950 disabled:opacity-50 text-stone-50 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all duration-200 uppercase tracking-wide"
              >
                <Download className="h-4 w-4" />
                <span>{isDownloading ? "Generando documento en PDF..." : "Imprimir / Descargar Certificado"}</span>
              </button>
              {isDownloading && (
                <div className="text-[10px] text-primary font-mono animate-pulse font-bold">
                  ✓ Se ha activado la descarga del documento de alta resolución.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
