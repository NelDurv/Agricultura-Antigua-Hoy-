import type { Pilar, Mito, NumeroClave } from '../types';
export type { Pilar, Mito, NumeroClave };

export const HERO = {
  titulo: "Bienvenido al Campus Agroecológico Agricultura Antigua",
  subtitulo: "Sabiduría ancestral + Ciencia de frontera",
  descripcion: "Aprende a cultivar regenerando la tierra, fabricando tus propios bioinsumos y cosechando el 95% gratis del aire y el agua."
};

export const NUMEROS_CLAVE: NumeroClave[] = [
  { valor: '95%', label: 'de la planta es C-H-O (gratis del aire y el agua)' },
  { valor: '144,000', label: 'litros de agua retiene 1% de MO por hectárea' },
  { valor: '12°C', label: 'reduce la temperatura foliar el silicio' },
  { valor: '5', label: 'espigas por planta con el protocolo Utopía' },
  { valor: '22.4', label: 'toneladas de arroz por hectárea (récord mundial)' },
  { valor: '80%', label: 'del fertilizante convencional se pierde' },
  { valor: '40-50%', label: 'reducción de costos con el modelo Utopía' },
  { valor: '100', label: 'días antes de la siembra comienza el protocolo' }
];

export const PILARES: Pilar[] = [
  {
    id: 'suelo-vivo', icono: '🌍', titulo: 'Suelo Vivo', subtitulo: 'El Ecosistema Invisible',
    descripcion: 'El suelo no es un sustrato inerte, sino un elemento vivo. Microbiología de consorcio, descompactación mecánica y biológica, y energía a través del ORP.',
    temas: [
      'Microbiología de Consorcio (600 microorganismos del bosque)', 'Descompactación Mecánica y Biológica',
      'Energía y ORP (Potencial Óxido-Reducción)', 'Salud Física del Suelo (porosidad, oxígeno)',
      'Infiltración y Retención de Agua (1% MO = 144,000 L/ha)', 'Ciclos Físico-Químico-Biológicos', 'IASS - Índice de Sustentabilidad del Suelo'
    ], color: '#2d5a27', bgColor: '#e8f0e6'
  },
  {
    id: 'nutricion-vegetal', icono: '☀️', titulo: 'Nutrición Vegetal Integral', subtitulo: 'Cosechando el Sol',
    descripcion: 'La agricultura como proceso de captación de energía lumínica. La Regla del 95/5, nutrición lumínica, carbónica y el Silicio como elemento maestro.',
    temas: [
      'La Regla del 95/5 (C-H-O: 95% de la planta es gratis)', 'Nutrición Lumínica (Cuántica) - Captura de fotones',
      'Nutrición Carbónica (CO₂) - El fertilizante más importante', 'Nutrición de Hidrógeno (Agua) - El vehículo de energía',
      'Bioquímica del Silicio - El "Padre del Silicio"', 'Biosilicificación - Formación de fitolitos y tricomas',
      'Tricomas y Fitolitos - Defensa y captura de luz', 'Fertilizantes Híbridos de Lenta Liberación'
    ], color: '#C49B6C', bgColor: '#f5eee6'
  },
  {
    id: 'bioinsumos', icono: '🧪', titulo: 'Bioinsumos', subtitulo: 'La Biofábrica Utopía',
    descripcion: 'Instrucciones prácticas para montar una biofábrica de alta concentración en solo 10 m².',
    temas: [
      'Estación 1: Microorganismos de Montaña (Sólidos)', 'Estación 2: Microorganismos Benéficos (Líquidos)',
      'Estación 3: Estiércol Falso (Sólido Nutritivo)', 'Estación 4: Biol Potenciado',
      'Estación 5: Multimineral Quelado (60 minerales)', 'Estación 6: Ácidos Húmicos y Fúlvicos',
      'Estación 7: Fungicidas Orgánicos (Sulfocálcico, Bordelés)', 'Estación 8: Insecticidas Orgánicos (Jabón Potásico, Neem)', 'Estación 9: Programa Integrado de Control'
    ], color: '#4a7a43', bgColor: '#e6efe5'
  },
  {
    id: 'agricultura-tradicional', icono: '🌾', titulo: 'Agricultura Tradicional', subtitulo: 'Sabiduría Ancestral',
    descripcion: 'Rescate de modelos ignorados por la Revolución Verde: Milpa Maya, Terrazas Incas, Chinampas, Subak, Policultura China.',
    temas: [
      'Sistema Milpa Maya - 9 mazorcas por planta', 'Terrazas Incas y Diseño Hidrológico', 'Chinampas Aztecas y Agricultura de Humedales',
      'Control de Arvenses - La maleza como aliada', 'Ingeniería Hidráulica Jemer (Camboya)', 'Sistema Subak de Bali (Indonesia)',
      'Policultura del Arrozal Inundado (China)', 'Tecnologías e Innovación China (Ao Tian)', 'Sistemas del Monzón y Tanques (India Antigua)',
      'Control de Ríos y Desalinización (Babilonia)', 'Rescate de la Sabiduría Ancestral', 'Descolonización Científica y Tecnológica', 'El mito del maíz que se multiplicaba'
    ], color: '#8B6F47', bgColor: '#f0ebe0'
  },
  {
    id: 'ciencia-moderna', icono: '🔬', titulo: 'Ciencia Moderna', subtitulo: 'Tecnología de Frontera',
    descripcion: 'Herramientas para dejar de cultivar a ciegas. Metagenómica, microscopía electrónica, fertilización híbrida y dispositivos analíticos móviles.',
    temas: [
      'Metagenómica - ADN del suelo y microbiomas', 'Microscopía Electrónica de Barrido (SEM)',
      'ORP - Medición de la Energía del Suelo', 'Dispositivos Analíticos Móviles (pH, CE, ORP)',
      'Arado Yomex - Descompactación a 60-80 cm', 'Innovaciones Tecnológicas (Apps, drones, sensores)', 'SRI - Sistema de Intensificación del Arroz'
    ], color: '#1A3A5C', bgColor: '#e4ecf2'
  }
];

export const MITOS: Mito[] = [
  { id: 'mito-1', titulo: 'Las plantas comen tierra', mito: '"Las plantas se alimentan de la tierra."', realidad: 'La planta NO come tierra. Se construye a partir del AIRE y del AGUA.', evidencia: 'Experimento de Van Helmont (1624): un sauce creció 85 kg y la tierra solo perdió 56 gramos.', accion: 'El 95% de tu cosecha es GRATIS. Enfócate en optimizar la fotosíntesis.', icono: '🌱', color: '#2d5a27' },
  { id: 'mito-2', titulo: 'Más fertilizante = más producción', mito: '"Cuanto más NPK, más cosecha."', realidad: 'El 80% del fertilizante se pierde. La Ley del Mínimo limita la producción.', evidencia: 'Ley del Mínimo (Liebig): el nutriente menos disponible es el que limita.', accion: 'Identifica el factor más limitante y optimízalo.', icono: '💰', color: '#C49B6C' },
  { id: 'mito-3', titulo: 'El suelo es solo un soporte', mito: '"El suelo es solo soporte físico."', realidad: 'El suelo es un ORGANISMO VIVO con millones de microorganismos.', evidencia: 'En 1 gramo de suelo fértil hay 100-500 millones de bacterias.', accion: 'Gestiona el suelo como el patrimonio más valioso.', icono: '🌍', color: '#4a7a43' },
  { id: 'mito-4', titulo: 'La M.O. solo sirve para nutrientes', mito: '"Si pones suficiente fertilizante, no necesitas materia orgánica."', realidad: 'La materia orgánica es el MOTOR del suelo vivo.', evidencia: '1% de materia orgánica = 144,000 litros de agua por hectárea.', accion: 'Reincorpora todos los residuos de cosecha.', icono: '💧', color: '#8B6F47' },
  { id: 'mito-5', titulo: 'La agricultura orgánica produce menos', mito: '"La orgánica produce menos que la convencional."', realidad: 'La orgánica de última generación produce MÁS con MENOS insumos.', evidencia: 'UABCS: 5 espigas/planta; Sumant Kumar: 22.4 t/ha de arroz.', accion: 'Aplica el protocolo de 100 días.', icono: '📈', color: '#1A3A5C' },
  { id: 'mito-6', titulo: 'El pH es el indicador más importante', mito: '"Si el pH no está en el rango correcto, los nutrientes no están disponibles."', realidad: 'El ORP mide la ENERGÍA del suelo y es más importante que el pH.', evidencia: 'Un suelo con pH perfecto pero oxidado consume la energía de la planta.', accion: 'Mide el ORP de tu suelo y aplícale bioles.', icono: '⚡', color: '#D4A853' },
  { id: 'mito-7', titulo: 'Las cabañuelas predicen el clima', mito: '"Los primeros 12 días de enero predicen el clima."', realidad: 'No tienen sustento científico. Probabilidad del 30%.', evidencia: 'Los meteorólogos confirman correlación casual.', accion: 'La mejor predicción es un suelo que retiene agua.', icono: '🌤️', color: '#6B8C6B' },
  { id: 'mito-8', titulo: 'La milpa de dos puntas es sagrada', mito: '"La milpa con dos puntas es una figura sagrada."', realidad: 'Una planta con dos espigas es resultado de buena nutrición.', evidencia: 'Fósforo, zinc, silicio y micronutrientes determinan el número de espigas.', accion: 'Aprende a nutrir el suelo.', icono: '🌽', color: '#C49B6C' },
  { id: 'mito-9', titulo: 'Las gotas de rocío queman las plantas', mito: '"Las gotas actúan como lentes, quemando las plantas."', realidad: 'Las gotas NO queman las hojas. El problema son los hongos.', evidencia: 'El efecto lupa no concentra suficiente energía.', accion: 'Aplica silicio para fortalecer la planta.', icono: '💦', color: '#4A7A8C' }
];
