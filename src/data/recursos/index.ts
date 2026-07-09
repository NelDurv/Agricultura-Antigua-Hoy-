import type { Receta, GlosarioItem } from '../../types';

export const RECETAS: Receta[] = [
  {
    id: 'biol-2',
    titulo: 'Microorganismos Benéficos (Estación 2)',
    descripcion: 'Cultivo líquido de microorganismos para aplicaciones al suelo y foliar.',
    ingredientes: ['5 kg de MM sólidos', '190 L de agua (sin cloro)', '4 kg de azúcar o melaza'],
    pasos: [
      'Llena el tambor con 190 L de agua',
      'Agrega 4 kg de azúcar y agita',
      'Cuelga el saco con 5 kg de MM sólidos',
      'Agita 10 min y tapa con tela',
      'Agita mañana y tarde por 10 min durante 8 días',
      'Día 9: LISTO PARA USAR'
    ],
    tiempo: '8 días',
    categoria: 'Bioinsumos',
    icono: '🧫'
  },
  {
    id: 'caldo-sulfocalcico',
    titulo: 'Caldo Sulfocálcico',
    descripcion: 'Fungicida, acaricida e insecticida orgánico. Controla más de 50 enfermedades fúngicas.',
    ingredientes: ['100 L de agua', '20 kg de azufre en polvo', '10 kg de cal'],
    pasos: [
      'Mezcla azufre y cal en seco',
      'Hierve el agua',
      'Añade la mezcla lentamente, agitando',
      'Cocina hasta color rojo vinotinto (20-30 min)',
      'Deja reposar y enfriar',
      'Guarda en recipientes opacos'
    ],
    tiempo: '1 hora',
    categoria: 'Caldos Minerales',
    icono: '🧪'
  },
  {
    id: 'empanizado-semillas',
    titulo: 'Empanizado de Semillas',
    descripcion: 'Tratamiento biológico y mineral para germinación uniforme y vigor inicial.',
    ingredientes: ['Estación 6', 'Estación 5', 'Estación 2', 'Melaza o azúcar', 'Roca fosfórica fina'],
    pasos: [
      'Mezcla partes iguales de Estaciones 6, 5 y 2',
      'Agrega melaza o azúcar',
      'Remoja las semillas',
      'Espolvorea con roca fosfórica',
      'Seca a la sombra por 24 h',
      '¡Siembra inmediatamente!'
    ],
    tiempo: '24 horas',
    categoria: 'Tratamiento de Semillas',
    icono: '🌱'
  }
];

export const GLOSARIO: GlosarioItem[] = [
  { termino: 'ORP', definicion: 'Potencial Óxido-Reducción. Mide la carga de electrones (energía) en el suelo. Un suelo sano debe estar reducido (-100 a -300 mV).' },
  { termino: 'IASS', definicion: 'Índice Agrícola de Sustentabilidad del Suelo. Cuantifica el patrimonio suelo. Un valor de 30-40% es óptimo para productividad sustentable.' },
  { termino: 'MPASi', definicion: 'Minerales Primarios Amorfos ricos en Silicio. Componen la fracción cultivable del suelo (~4000 ton/ha).' },
  { termino: 'Biosilicificación', definicion: 'Proceso biológico de conversión de H₄SiO₄ soluble en SiO₂ amorfo (fitolitos) en la planta.' },
  { termino: 'Quelatación', definicion: 'Proceso químico donde un agente orgánico "encapsula" un ión mineral protegiéndolo de fijación en el suelo.' },
  { termino: 'Glomalina', definicion: 'Glicoproteína producida por hongos micorrícicos. Actúa como "pegamento" biológico estabilizando agregados del suelo.' },
  { termino: 'rH', definicion: 'Coeficiente que integra pH y ORP. rH = ((ORP + 200) / 30) + 2 × pH. Un rH bajo indica estado reducido (rico en energía).' },
  { termino: 'CICE', definicion: 'Capacidad de Intercambio Catiónico. Capacidad del suelo para retener e intercambiar cationes (Ca²⁺, Mg²⁺, K⁺).' }
];
