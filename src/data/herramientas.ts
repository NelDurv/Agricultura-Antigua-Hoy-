import type { Receta, GlosarioItem } from '../types';
import { GLOSARIO_SUELOS } from './glosario/glosario-suelos';
import { GLOSARIO_RIEGO } from './glosario/glosario-riego';
import { GLOSARIO_CLIMA } from './glosario/glosario-clima';
import { GLOSARIO_MICRONUTRIENTES } from './glosario/glosario-micronutrientes';
import { GLOSARIO_GENERAL } from './glosario/glosario-general';
import { GLOSARIO_CIENTIFICO } from './glosario/glosario-cientifico';

/* ─── RECETAS ─── */
export const RECETAS: Receta[] = [
  {
    id: 'biol-2', titulo: 'Microorganismos Benéficos (Estación 2)',
    descripcion: 'Cultivo líquido de microorganismos para aplicaciones al suelo y foliar.',
    ingredientes: ['5 kg de MM sólidos', '190 L de agua (sin cloro)', '4 kg de azúcar o melaza'],
    pasos: ['Llena el tambor con 190 L de agua', 'Agrega 4 kg de azúcar y agita', 'Cuelga el saco con 5 kg de MM sólidos', 'Agita 10 min y tapa con tela', 'Agita mañana y tarde por 10 min durante 8 días', 'Día 9: LISTO PARA USAR'],
    tiempo: '8 días', categoria: 'Bioinsumos', icono: '🧫'
  },
  {
    id: 'caldo-sulfocalcico', titulo: 'Caldo Sulfocálcico',
    descripcion: 'Fungicida, acaricida e insecticida orgánico.',
    ingredientes: ['100 L de agua', '20 kg de azufre en polvo', '10 kg de cal'],
    pasos: ['Mezcla azufre y cal en seco', 'Hierve el agua', 'Añade la mezcla lentamente, agitando', 'Cocina hasta color rojo vinotinto (20-30 min)', 'Deja reposar y enfriar', 'Guarda en recipientes opacos'],
    tiempo: '1 hora', categoria: 'Caldos Minerales', icono: '🧪'
  },
  {
    id: 'empanizado-semillas', titulo: 'Empanizado de Semillas',
    descripcion: 'Tratamiento biológico y mineral para germinación uniforme.',
    ingredientes: ['Estación 6', 'Estación 5', 'Estación 2', 'Melaza o azúcar', 'Roca fosfórica fina'],
    pasos: ['Mezcla partes iguales de Estaciones 6, 5 y 2', 'Agrega melaza o azúcar', 'Remoja las semillas', 'Espolvorea con roca fosfórica', 'Seca a la sombra por 24 h', '¡Siembra inmediatamente!'],
    tiempo: '24 horas', categoria: 'Tratamiento de Semillas', icono: '🌱'
  }
];

/* ─── GLOSARIO ─── */
export const GLOSARIO: GlosarioItem[] = [
  ...GLOSARIO_SUELOS,
  ...GLOSARIO_RIEGO,
  ...GLOSARIO_CLIMA,
  ...GLOSARIO_MICRONUTRIENTES,
  ...GLOSARIO_GENERAL,
  ...GLOSARIO_CIENTIFICO,
];

/* ─── INSTRUMENTOS ─── */
export interface Instrumento {
  id: string; titulo: string; icono: string; descripcion: string;
  rangoIdeal: string; pasos: string[]; consejos: string;
}

export const INSTRUMENTOS: Instrumento[] = [
  {
    id: 'ph-metro', titulo: 'Cómo usar el pH-metro', icono: '🧪',
    descripcion: 'Mide la acidez o alcalinidad del agua y suelo.',
    rangoIdeal: '5.5 - 6.5 para aplicaciones foliares',
    pasos: ['Calibra el equipo con soluciones buffer (pH 4.0 y 7.0)', 'Enjuaga el electrodo con agua destilada', 'Introduce la sonda en la muestra', 'Espera 30 segundos hasta que se estabilice la lectura', 'Ajusta con vinagre (bajar pH) o ceniza (subir pH)'],
    consejos: 'El agua alcalina (pH 8.0) neutraliza la asimilación de micronutrientes como hierro y zinc.'
  },
  {
    id: 'electroconductimetro', titulo: 'Cómo usar el Electroconductímetro (CE)', icono: '⚡',
    descripcion: 'Mide la concentración de sales disueltas en el agua o suelo.',
    rangoIdeal: '1.5 - 3.0 mS/cm para fertirriego',
    pasos: ['Calibra con solución estándar (1.413 mS/cm)', 'Toma una muestra representativa', 'Introduce el electrodo y agita suavemente', 'Lee el valor en mS/cm o μS/cm', 'Compara con los rangos óptimos del cultivo'],
    consejos: 'Una CE excesivamente alta indica exceso de sales que puede causar estrés osmótico.'
  },
  {
    id: 'orp-medidor', titulo: 'Cómo usar el medidor ORP', icono: '🔋',
    descripcion: 'Mide la carga de energía (electrones) disponible en el suelo o solución.',
    rangoIdeal: '-100 a -300 mV (suelo reducido, rico en energía)',
    pasos: ['Prepara una muestra de suelo con agua destilada (1:2)', 'Calibra el medidor ORP', 'Introduce el electrodo en la muestra', 'Espera 1-2 minutos hasta estabilización', 'Interpreta: valores negativos = suelo con energía; positivos = oxidado'],
    consejos: 'Un ORP negativo indica que el fertilizante tiene electrones disponibles para activar el metabolismo de la planta.'
  },
  {
    id: 'sensor-humedad', titulo: 'Sensor de Humedad y Prueba del Puño', icono: '💧',
    descripcion: 'Determina el contenido de humedad ideal del suelo o compost.',
    rangoIdeal: '50% de humedad (prueba del puño)',
    pasos: ['Toma un puñado de suelo o compost', 'Aprieta con fuerza durante 5 segundos', 'Abre la mano lentamente', 'Observa: debe formar un terrón que mantiene su forma', 'No debe gotear agua (exceso) ni desmoronarse (déficit)'],
    consejos: 'La humedad del 50% es el punto óptimo para la actividad microbiana aeróbica.'
  }
];

/* ─── CICLOS LUNARES ─── */
export interface FaseLunar { fase: string; icono: string; efecto: string; recomendaciones: string[]; }

export const CICLOS_LUNARES = {
  titulo: 'Ciclos de la Luna en la Agricultura',
  descripcion: 'La luna afecta el flujo de la savia y la actividad microbiana.',
  fases: [
    { fase: 'Luna Nueva', icono: '🌑', efecto: 'La savia se concentra en las raíces.', recomendaciones: ['Podas de formación', 'Aplicación de compost', 'Preparación del suelo'] },
    { fase: 'Luna Creciente', icono: '🌓', efecto: 'La savia comienza a subir.', recomendaciones: ['Siembra de hortalizas de fruto', 'Trasplantes', 'Injertos'] },
    { fase: 'Luna Llena', icono: '🌕', efecto: 'Máxima actividad en la parte aérea.', recomendaciones: ['Captura de MM en el bosque', 'Cosecha de frutos', 'Aplicaciones foliares'] },
    { fase: 'Luna Menguante', icono: '🌗', efecto: 'La savia desciende.', recomendaciones: ['Control de plagas', 'Cosecha de raíces', 'Almacenamiento de semillas'] }
  ]
};

/* ─── CASOS DE ÉXITO ─── */
export interface CasoExito {
  id: string; titulo: string; descripcion: string; icono: string;
  cultivo: string; ubicacion: string; resultados: string[];
}

export const CASOS_EXITO: CasoExito[] = [
  {
    id: 'uabcs', titulo: 'UABCS: 5 Espigas por Planta',
    descripcion: 'La Universidad Autónoma de Baja California Sur aplicó el modelo Utopía al maíz.',
    icono: '🌽', cultivo: 'Maíz', ubicacion: 'Baja California Sur, México',
    resultados: ['5 espigas por planta (vs. 1-2 convencional)', '20 hileras por espiga (vs. 12-14)', '41 granos por hilera (vs. 30-35)', '8.7-11 toneladas/ha (vs. 4-6)']
  },
  {
    id: 'sumant-kumar', titulo: 'Sumant Kumar: Récord Mundial',
    descripcion: 'En Bihar, India, logró el récord mundial usando SRI.',
    icono: '🌾', cultivo: 'Arroz', ubicacion: 'Bihar, India',
    resultados: ['22.4 toneladas/ha (vs. 4-8)', '5 kg de semilla/ha (vs. 35-40)', '50% menos agua', '34.4 macollos/planta (vs. 19.4)']
  },
  {
    id: 'valle-cauca', titulo: 'Valle del Cauca: 50% Menos Costos',
    descripcion: 'Agricultores del Valle del Cauca redujeron costos con el modelo Utopía.',
    icono: '🇨🇴', cultivo: 'Variados', ubicacion: 'Valle del Cauca, Colombia',
    resultados: ['40-50% menos costos de producción', 'Suelo regenerado', 'Mayor resiliencia a plagas', 'Cosechas más abundantes']
  }
];
