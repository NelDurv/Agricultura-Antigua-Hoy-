export interface Estudiante {
  id: string;
  name: string;
  comunidad: string;
  course: string;
  progress: number;
  startDate: string;
  status: string;
}

export const ESTUDIANTES: Estudiante[] = [
  { id: "e1", name: "Don José Velásquez", comunidad: "Vereda El Vergel", course: "Suelo Vivo: Microbiología y Regeneración", progress: 100, startDate: "14/05/2026", status: "Completado" },
  { id: "e2", name: "Mercedes Anchundia", comunidad: "Comunidad Las Delicias", course: "Suelo Vivo: Microbiología y Regeneración", progress: 75, startDate: "01/06/2026", status: "En progreso" },
  { id: "e3", name: "Héctor Fabio Ortiz", comunidad: "Cooperativa San Isidro", course: "Biofertilizantes y Caldos Minerales", progress: 33, startDate: "12/06/2026", status: "En progreso" },
  { id: "e4", name: "Rosa María Guamán", comunidad: "Asociación Tierras Verdes", course: "Abonos Fermentados tipo Bokashi", progress: 0, startDate: "29/06/2026", status: "Sin iniciar" }
];

export const ESTADISTICAS = {
  totalEstudiantes: 4,
  completados: 1,
  enProgreso: 2,
  sinIniciar: 1
};

/* Re-export for backward compatibility */
export { ESTUDIANTES as INSTITUCIONES_ESTUDIANTES };
export type { Estudiante as EstudianteInstitucional };
