/* ─── New structure exports ─── */
export { HERO, PILARES, MITOS, NUMEROS_CLAVE } from './inicio';
export type { Pilar, Mito, NumeroClave } from './inicio';

export { COURSES, getCourseById, COURSES32 } from './campus';
export type { Course, Course32 } from './campus';

export { BIBLIOTECA, getDocById, CATEGORIAS_BIBLIOTECA, AUDIOS, VIDEOS } from './biblioteca/index';
export type { BibliotecaDoc } from './types';

export { ESTUDIANTES, ESTADISTICAS } from './academia';
export type { Estudiante, Estudiante as EstudianteInstitucional } from './academia';

export { COMMUNITY_POSTS, CATEGORIAS_COMUNIDAD } from './comunidad';
export type { CommunityPost, CommunityReply } from './types';

export { RECETAS, GLOSARIO, INSTRUMENTOS, CICLOS_LUNARES, CASOS_EXITO } from './herramientas';
export type { Receta, GlosarioItem, Instrumento, CasoExito } from './herramientas';

/* ─── Backward compatibility aliases ─── */
export { INSTITUCIONES_ESTUDIANTES } from './academia';
export { SUBTEMAS } from './home/index';
