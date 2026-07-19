export interface AgrovocTerm {
  id: string;
  uri: string;
  label: string;
  labelEs: string;
  broader?: string[];
  narrower?: string[];
}

const AGROVOC_BASE = 'http://aims.fao.org/aos/agrovoc';

const RAW_CONCEPTS: Omit<AgrovocTerm, 'uri'>[] = [
  // Suelo y tierra
  { id: 'c_7156', label: 'soil', labelEs: 'suelo', broader: ['c_330834'], narrower: ['c_7170', 'c_7165', 'c_7160'] },
  { id: 'c_7170', label: 'soil fertility', labelEs: 'fertilidad del suelo', broader: ['c_7156'], narrower: [] },
  { id: 'c_7165', label: 'soil conservation', labelEs: 'conservación del suelo', broader: ['c_7156'], narrower: [] },
  { id: 'c_7160', label: 'soil biology', labelEs: 'biología del suelo', broader: ['c_7156'], narrower: ['c_36167'] },
  { id: 'c_7176', label: 'soil management', labelEs: 'manejo del suelo', broader: ['c_7156'], narrower: [] },
  { id: 'c_36167', label: 'soil microorganisms', labelEs: 'microorganismos del suelo', broader: ['c_7160'], narrower: [] },

  // Fertilizantes y abonos
  { id: 'c_2867', label: 'fertilizers', labelEs: 'fertilizantes', broader: [], narrower: ['c_4592', 'c_24975'] },
  { id: 'c_4592', label: 'organic fertilizers', labelEs: 'abonos orgánicos', broader: ['c_2867'], narrower: [] },
  { id: 'c_24975', label: 'biofertilizers', labelEs: 'biofertilizantes', broader: ['c_2867'], narrower: [] },
  { id: 'c_1795', label: 'composts', labelEs: 'compost', broader: ['c_4592'], narrower: [] },

  // Procesos
  { id: 'c_15956', label: 'composting', labelEs: 'compostaje', broader: [], narrower: ['c_24528'] },
  { id: 'c_24528', label: 'vermicomposting', labelEs: 'lombricultura', broader: ['c_15956'], narrower: [] },

  // Agricultura
  { id: 'c_15911', label: 'organic agriculture', labelEs: 'agricultura orgánica', broader: [], narrower: [] },
  { id: 'c_33561', label: 'sustainable agriculture', labelEs: 'agricultura sostenible', broader: [], narrower: [] },
  { id: 'c_92381', label: 'agroecology', labelEs: 'agroecología', broader: [], narrower: [] },

  // Control de plagas
  { id: 'c_918', label: 'biological control', labelEs: 'control biológico', broader: [], narrower: [] },
  { id: 'c_5741', label: 'pests', labelEs: 'plagas', broader: [], narrower: [] },
  { id: 'c_5978', label: 'plant protection', labelEs: 'protección de plantas', broader: [], narrower: [] },

  // Agua y riego
  { id: 'c_8309', label: 'water', labelEs: 'agua', broader: [], narrower: ['c_3954'] },
  { id: 'c_3954', label: 'irrigation', labelEs: 'riego', broader: ['c_8309'], narrower: [] },

  // Nutrición vegetal
  { id: 'c_16379', label: 'plant nutrition', labelEs: 'nutrición vegetal', broader: [], narrower: [] },
  { id: 'c_16094', label: 'crop management', labelEs: 'manejo de cultivos', broader: [], narrower: [] },

  // Biodiversidad y semillas
  { id: 'c_33949', label: 'biodiversity', labelEs: 'biodiversidad', broader: [], narrower: [] },
  { id: 'c_6946', label: 'seeds', labelEs: 'semillas', broader: [], narrower: [] },

  // Base
  { id: 'c_330834', label: 'activities', labelEs: 'actividades', broader: [], narrower: ['c_7156'] },
];

export const AGROVOC_CONCEPTS: AgrovocTerm[] = RAW_CONCEPTS.map((c) => ({
  ...c,
  uri: `${AGROVOC_BASE}/${c.id}`,
}));

export function getAgrovocByLabel(label: string): AgrovocTerm | undefined {
  const lower = label.toLowerCase();
  return AGROVOC_CONCEPTS.find(
    (c) => c.label === lower || c.labelEs === lower,
  );
}

export function getAgrovocById(id: string): AgrovocTerm | undefined {
  return AGROVOC_CONCEPTS.find((c) => c.id === id);
}

const TAG_KEYWORD_MAP: Record<string, string[]> = {
  'c_7156': ['suelo', 'tierra', 'soil', 'ground'],
  'c_7170': ['fertilidad', 'fértil', 'fertility'],
  'c_7165': ['conservación', 'conservation', 'erosión'],
  'c_7160': ['biología del suelo', 'vida del suelo', 'soil biology'],
  'c_7176': ['manejo de suelo', 'labranza', 'tillage'],
  'c_36167': ['microorganismos', 'microbios', 'bacteria', 'hongos benéficos', 'trichoderma', 'micorriza'],
  'c_2867': ['fertilizante', 'abono químico', 'fertilizer'],
  'c_4592': ['abono orgánico', 'materia orgánica', 'organic fertilizer', 'humus'],
  'c_24975': ['biofertilizante', 'biol', 'caldo', 'bioinsumo'],
  'c_1795': ['compost', 'composta'],
  'c_15956': ['compostaje', 'descomposición', 'composting'],
  'c_24528': ['lombricultura', 'lombriz', 'humus de lombriz', 'vermicompost'],
  'c_15911': ['agricultura orgánica', 'agricultura ecológica', 'organic farming'],
  'c_33561': ['agricultura sostenible', 'sustentable', 'sustainable agriculture'],
  'c_92381': ['agroecología', 'permacultura', 'agroforestal'],
  'c_918': ['control biológico', 'biocontrol', 'enemigo natural', 'biological control'],
  'c_5741': ['plaga', 'plagas', 'pests', 'insectos dañinos'],
  'c_5978': ['protección vegetal', 'fitosanitario', 'plant protection'],
  'c_8309': ['agua', 'water', 'hídrico'],
  'c_3954': ['riego', 'irrigación', 'goteo', 'irrigation'],
  'c_16379': ['nutrición vegetal', 'nutrición de plantas', 'plant nutrition'],
  'c_16094': ['manejo de cultivos', 'prácticas agrícolas', 'crop management'],
  'c_33949': ['biodiversidad', 'diversidad', 'biodiversity'],
  'c_6946': ['semilla', 'semillas', 'seed', 'criolla'],
};

export function resolveAgrovocTags(text: string): string[] {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  for (const [id, keywords] of Object.entries(TAG_KEYWORD_MAP)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        matched.push(id);
        break;
      }
    }
  }
  return [...new Set(matched)];
}
