export interface EstudianteInstitucional {
  id: string;
  name: string;
  comunidad: string;
  course: string;
  progress: number;
  startDate: string;
}

export const INSTITUCIONES_ESTUDIANTES: EstudianteInstitucional[] = [
  { id: "e1", name: "Don José Velásquez", comunidad: "Vereda El Vergel", course: "Suelo Vivo: Microbiología y Regeneración", progress: 100, startDate: "14/05/2026" },
  { id: "e2", name: "Mercedes Anchundia", comunidad: "Comunidad Las Delicias", course: "Suelo Vivo: Microbiología y Regeneración", progress: 75, startDate: "01/06/2026" },
  { id: "e3", name: "Héctor Fabio Ortiz", comunidad: "Cooperativa San Isidro", course: "Biofertilizantes y Caldos Minerales", progress: 33, startDate: "12/06/2026" },
  { id: "e4", name: "Rosa María Guamán", comunidad: "Asociación Tierras Verdes", course: "Abonos Fermentados tipo Bokashi", progress: 0, startDate: "29/06/2026" },
];
