import { writeFileSync } from 'fs';
import { join } from 'path';
import { COURSES } from '../src/data/courses';
import { COURSES32 } from '../src/data/courses32';
import { BIBLIOTECA } from '../src/data/biblioteca';
import { RECETAS, GLOSARIO } from '../src/data/recursos';
import { PILARES, MITOS, CASOS_EXITO, NUMEROS_CLAVE, SUBTEMAS } from '../src/data/home';
import { COMMUNITY_POSTS } from '../src/data/comunidad';
import { INSTITUCIONES_ESTUDIANTES } from '../src/data/instituciones';

const exportData = {
  meta: {
    title: "Agricultura Antigua — Exportación Completa",
    description: "Todos los contenidos del campus agroecológico",
    exportDate: new Date().toISOString(),
    totalCourses: COURSES.length,
    totalCampusCourses: COURSES32.length,
    totalDocuments: BIBLIOTECA.length,
    totalRecipes: RECETAS.length,
    totalGlossary: GLOSARIO.length,
  },
  academia: COURSES,
  campus: COURSES32,
  biblioteca: BIBLIOTECA,
  recursos: {
    recetas: RECETAS,
    glosario: GLOSARIO,
  },
  home: {
    pilares: PILARES,
    mitos: MITOS,
    casosExito: CASOS_EXITO,
    numerosClave: NUMEROS_CLAVE,
    subtemas: SUBTEMAS,
  },
  comunidad: COMMUNITY_POSTS,
  instituciones: INSTITUCIONES_ESTUDIANTES,
};

const outPath = join(process.cwd(), 'agricultura-antigua-export.json');
writeFileSync(outPath, JSON.stringify(exportData, null, 2), 'utf-8');
console.log(`Exportado a: ${outPath}`);
const sizeMB = (Buffer.byteLength(JSON.stringify(exportData), 'utf-8') / 1024 / 1024);
console.log(`Tamaño: ${sizeMB.toFixed(2)} MB`);
