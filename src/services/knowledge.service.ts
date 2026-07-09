import type { Pilar, Mito, CasoExito, NumeroClave, Receta, GlosarioItem } from '../types';
import { PILARES, MITOS, CASOS_EXITO, NUMEROS_CLAVE, RECETAS, GLOSARIO } from '../data';

export function getPilares(): Pilar[] {
  return PILARES as Pilar[];
}

export function getPilarById(id: string): Pilar | undefined {
  return getPilares().find((p) => p.id === id);
}

export function getMitos(): Mito[] {
  return MITOS as Mito[];
}

export function getCasosExito(): CasoExito[] {
  return CASOS_EXITO as CasoExito[];
}

export function getNumerosClave(): NumeroClave[] {
  return NUMEROS_CLAVE as NumeroClave[];
}

export function getRecetas(): Receta[] {
  return RECETAS as Receta[];
}

export function getRecetaById(id: string): Receta | undefined {
  return getRecetas().find((r) => r.id === id);
}

export function getGlosario(): GlosarioItem[] {
  return GLOSARIO as GlosarioItem[];
}
