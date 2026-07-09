export interface Pilar {
  id: string;
  icono: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  temas: string[];
  color: string;
  bgColor: string;
}

export interface Mito {
  id: string;
  titulo: string;
  mito: string;
  realidad: string;
  evidencia: string;
  accion: string;
  icono: string;
  color: string;
}

export interface CasoExito {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  cultivo: string;
  ubicacion: string;
  resultados: string[];
}

export interface NumeroClave {
  valor: string;
  label: string;
}

export interface Receta {
  id: string;
  titulo: string;
  descripcion: string;
  ingredientes: string[];
  pasos: string[];
  tiempo: string;
  categoria: string;
  icono: string;
}

export interface GlosarioItem {
  termino: string;
  definicion: string;
}

export interface SubtemaDetalle {
  descripcion: string;
  subtemas: string[];
  icono: string;
}

export interface SubtemasMap {
  [temaNombre: string]: SubtemaDetalle;
}
