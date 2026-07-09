import type { Pilar, Mito, CasoExito, NumeroClave, SubtemasMap } from '../../types';

export const PILARES: Pilar[] = [
  {
    id: 'suelo-vivo',
    icono: '🌍',
    titulo: 'Suelo Vivo',
    subtitulo: 'El Ecosistema Invisible',
    descripcion: 'El suelo no es un sustrato inerte, sino un elemento vivo. Microbiología de consorcio, descompactación mecánica y biológica, y energía a través del ORP (Potencial Óxido-Reducción).',
    temas: [
      'Microbiología de Consorcio (600 microorganismos del bosque)',
      'Descompactación Mecánica y Biológica',
      'Energía and ORP (Potencial Óxido-Reducción)',
      'Salud Física del Suelo (porosidad, oxígeno)',
      'Infiltración y Retención de Agua (1% MO = 144,000 L/ha)',
      'Ciclos Físico-Químico-Biológicos',
      'IASS - Índice de Sustentabilidad del Suelo'
    ],
    color: '#2d5a27',
    bgColor: '#e8f0e6'
  },
  {
    id: 'nutricion-vegetal',
    icono: '☀️',
    titulo: 'Nutrición Vegetal Integral',
    subtitulo: 'Cosechando el Sol',
    descripcion: 'La agricultura como proceso de captación de energía lumínica. La Regla del 95/5, nutrición lumínica, carbónica, de hidrógeno y el Silicio como elemento maestro.',
    temas: [
      'La Regla del 95/5 (C-H-O: 95% de la planta es gratis)',
      'Nutrición Lumínica (Cuántica) - Captura de fotones',
      'Nutrición Carbónica (CO₂) - El fertilizante más importante',
      'Nutrición de Hidrógeno (Agua) - El vehículo de energía',
      'Bioquímica del Silicio - El "Padre del Silicio"',
      'Biosilicificación - Formación de fitolitos y tricomas',
      'Tricomas y Fitolitos - Defensa y captura de luz',
      'Fertilizantes Híbridos de Lenta Liberación'
    ],
    color: '#C49B6C',
    bgColor: '#f5eee6'
  },
  {
    id: 'bioinsumos',
    icono: '🧪',
    titulo: 'Bioinsumos',
    subtitulo: 'La Biofábrica Utopía',
    descripcion: 'Instrucciones prácticas para montar una biofábrica de alta concentración en solo 10 m². Procesos aeróbicos, minerales quelatados y ácidos orgánicos.',
    temas: [
      'Estación 1: Microorganismos de Montaña (Sólidos)',
      'Estación 2: Microorganismos Benéficos (Líquidos)',
      'Estación 3: Estiércol Falso (Sólido Nutritivo)',
      'Estación 4: Biol Potenciado',
      'Estación 5: Multimineral Quelado (60 minerales)',
      'Estación 6: Ácidos Húmicos y Fúlvicos',
      'Estación 7: Fungicidas Orgánicos (Sulfocálcico, Bordelés)',
      'Estación 8: Insecticidas Orgánicos (Jabón Potásico, Neem)',
      'Estación 9: Programa Integrado de Control'
    ],
    color: '#4a7a43',
    bgColor: '#e6efe5'
  },
  {
    id: 'agricultura-tradicional',
    icono: '🌾',
    titulo: 'Agricultura Tradicional',
    subtitulo: 'Sabiduría Ancestral',
    descripcion: 'Rescate de modelos ignorados por la Revolución Verde: Milpa Maya, Terrazas Incas, Chinampas, Ingeniería Jemer, Subak, Policultura China, e Irrigación en la India Antigua y Babilonia.',
    temas: [
      'Sistema Milpa Maya - 9 mazorcas por planta',
      'Terrazas Incas y Diseño Hidrológico',
      'Chinampas Aztecas y Agricultura de Humedales',
      'Control de Arvenses - La maleza como aliada',
      'Ingeniería Hidráulica Jemer (Camboya)',
      'Sistema Subak de Bali (Indonesia)',
      'Policultura del Arrozal Inundado (China)',
      'Tecnologías e Innovación China (Ao Tian)',
      'Sistemas del Monzón y Tanques (India Antigua)',
      'Control de Ríos y Desalinización (Babilonia)',
      'Rescate de la Sabiduría Ancestral',
      'Descolonización Científica y Tecnológica',
      'El mito del maíz que se multiplicaba'
    ],
    color: '#8B6F47',
    bgColor: '#f0ebe0'
  },
  {
    id: 'ciencia-moderna',
    icono: '🔬',
    titulo: 'Ciencia Moderna',
    subtitulo: 'Tecnología de Frontera',
    descripcion: 'Herramientas para dejar de cultivar a ciegas. Metagenómica, microscopía electrónica, fertilización híbrida y dispositivos analíticos móviles.',
    temas: [
      'Metagenómica - ADN del suelo y microbiomas',
      'Microscopía Electrónica de Barrido (SEM)',
      'ORP - Medición de la Energía del Suelo',
      'Dispositivos Analíticos Móviles (pH, CE, ORP)',
      'Arado Yomex - Descompactación a 60-80 cm',
      'Innovaciones Tecnológicas (Apps, drones, sensores)',
      'SRI - Sistema de Intensificación del Arroz'
    ],
    color: '#1A3A5C',
    bgColor: '#e4ecf2'
  }
];

export const MITOS: Mito[] = [
  {
    id: 'mito-1',
    titulo: 'Las plantas comen tierra',
    mito: '"Las plantas se alimentan de la tierra. Si quieres que una planta crezca grande y fuerte, necesitas darle más tierra o más fertilizante."',
    realidad: 'La planta NO come tierra. La planta se construye a sí misma a partir del AIRE y del AGUA.',
    evidencia: 'El experimento de Van Helmont (1624): un sauce creció de 2.28 kg a 85 kg en 5 años, mientras que la tierra solo perdió 56 gramos.',
    accion: 'El 95% de tu cosecha es GRATIS. Enfócate en optimizar la fotosíntesis, el CO₂ y el agua.',
    icono: '🌱',
    color: '#2d5a27'
  },
  {
    id: 'mito-2',
    titulo: 'Más fertilizante = más producción',
    mito: '"Si quieres más producción, aplica más fertilizante. Cuanto más NPK, más cosecha."',
    realidad: 'La producción NO es directamente proporcional a la cantidad de fertilizante. El 80% del fertilizante se pierde.',
    evidencia: 'La Ley del Mínimo (Liebig): el nutriente menos disponible es el que limita la producción.',
    accion: 'Identifica el factor más limitante (temperatura, agua, compactación, luz) y optimízalo.',
    icono: '💰',
    color: '#C49B6C'
  },
  {
    id: 'mito-3',
    titulo: 'El suelo es solo un soporte',
    mito: '"El suelo es solo el soporte físico donde la planta echa raíces. Es como una maceta gigante."',
    realidad: 'El suelo NO es un soporte inerte. El suelo es un ORGANISMO VIVO con millones de microorganismos.',
    evidencia: 'En 1 gramo de suelo fértil hay 100-500 millones de bacterias, 1-10 millones de hongos.',
    accion: 'Gestiona el suelo como el patrimonio más valioso que tienes.',
    icono: '🌍',
    color: '#4a7a43'
  },
  {
    id: 'mito-4',
    titulo: 'La M.O. solo sirve para nutrientes',
    mito: '"La materia orgánica es solo una fuente de nutrientes. Si pones suficiente fertilizante, no necesitas materia orgánica."',
    realidad: 'La materia orgánica es el MOTOR del suelo vivo: retiene agua, regula temperatura, alimenta microorganismos.',
    evidencia: '1% de materia orgánica = 144,000 litros de agua por hectárea.',
    accion: 'Reincorporpora todos los residuos de cosecha y mantén cobertura vegetal permanente.',
    icono: '💧',
    color: '#8B6F47'
  },
  {
    id: 'mito-5',
    titulo: 'La agricultura orgánica produce menos',
    mito: '"La agricultura orgánica produce menos que la agricultura convencional."',
    realidad: 'La agricultura orgánica de última generación produce MÁS con MENOS insumos y MENOS costos.',
    evidencia: 'UABCS: 5 espigas por planta; Sumant Kumar: 22.4 t/ha de arroz (récord mundial).',
    accion: 'Aplica el protocolo de 100 días y la ciencia de frontera.',
    icono: '📈',
    color: '#1A3A5C'
  },
  {
    id: 'mito-6',
    titulo: 'El pH es el indicador más importante',
    mito: '"El pH es el indicador más importante del suelo. Si el pH no está en el rango correcto, los nutrientes no están disponibles."',
    realidad: 'El ORP (Potencial Óxido-Reducción) mide la ENERGÍA del suelo y es más importante que el pH.',
    evidencia: 'Un suelo con pH perfecto pero oxidado consume la energía de la planta.',
    accion: 'Mide el ORP de tu suelo y aplícale bioles con carga energética negativa.',
    icono: '⚡',
    color: '#D4A853'
  },
  {
    id: 'mito-7',
    titulo: 'Las cabañuelas predicen el clima',
    mito: '"Los primeros 12 días de enero predicen el clima de todo el año."',
    realidad: 'Las cabañuelas no tienen sustento científico. La probabilidad de acierto es solo del 30%.',
    evidencia: 'Los meteorólogos confirman que la correlación es por casualidad, no por causalidad.',
    accion: 'La mejor predicción del clima es un suelo que retiene agua. 1% de MO = 144,000 L/ha.',
    icono: '🌤️',
    color: '#6B8C6B'
  },
  {
    id: 'mito-8',
    titulo: 'La milpa de dos puntas es sagrada',
    mito: '"La milpa que tiene dos puntas es una figura sagrada. Se le piden mazorcas para todo el año."',
    realidad: 'Una planta con dos espigas es el resultado de buena nutrición y condiciones favorables.',
    evidencia: 'El fósforo, zinc, silicio y micronutrientes determinan el número de espigas.',
    accion: 'Aprende a nutrir el suelo para que todas tus plantas sean productivas.',
    icono: '🌽',
    color: '#C49B6C'
  },
  {
    id: 'mito-9',
    titulo: 'Las gotas de rocío queman las plantas',
    mito: '"Las gotas de rocío actúan como lentes, quemando las plantas cuando el sol las atraviesa."',
    realidad: 'Las gotas de agua NO queman las hojas. El problema son los hongos.',
    evidencia: 'El efecto lupa no concentra suficiente energía; las manchas son síntomas de enfermedades fúngicas.',
    accion: 'Aplica silicio para fortalecer la planta y evitar que los hongos penetren la hoja.',
    icono: '💦',
    color: '#4A7A8C'
  }
];

export const CASOS_EXITO: CasoExito[] = [
  {
    id: 'uabcs',
    titulo: 'UABCS: 5 Espigas por Planta',
    descripcion: 'La Universidad Autónoma de Baja California Sur aplicó el modelo Utopía al cultivo de maíz con resultados impresionantes.',
    icono: '🌽',
    cultivo: 'Maíz',
    ubicacion: 'Baja California Sur, México',
    resultados: [
      '5 espigas por planta (vs. 1-2 convencional)',
      '20 hileras por espiga (vs. 12-14 convencional)',
      '41 granos por hilera (vs. 30-35 convencional)',
      '8.7-11 toneladas/ha (vs. 4-6 convencional)'
    ]
  },
  {
    id: 'sumant-kumar',
    titulo: 'Sumant Kumar: Récord Mundial',
    descripcion: 'En Bihar, India, logró el récord mundial usando SRI (Sistema de Intensificación del Arroz).',
    icono: '🌾',
    cultivo: 'Arroz',
    ubicacion: 'Bihar, India',
    resultados: [
      '22.4 toneladas/ha (vs. 4-8 convencional)',
      '5 kg de semilla/ha (vs. 35-40 kg convencional)',
      '50% menos agua (vs. inundación continua)',
      '34.4 macollos/planta (vs. 19.4 convencional)'
    ]
  },
  {
    id: 'valle-cauca',
    titulo: 'Valle del Cauca: 50% Menos Costos',
    descripcion: 'Agricultores del Valle del Cauca redujeron sus costos de producción entre un 40-50% con el modelo Utopía.',
    icono: '🇨🇴',
    cultivo: 'Variados',
    ubicacion: 'Valle del Cauca, Colombia',
    resultados: [
      '40-50% menos costos de producción',
      'Suelo regenerado',
      'Mayor resiliencia a plagas',
      'Cosechas más abundantes'
    ]
  }
];

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

export const SUBTEMAS: SubtemasMap = {
  'Microbiología de Consorcio (600 microorganismos del bosque)': {
    descripcion: 'Los microorganismos del bosque trabajan en equipo para fabricar fertilizante gratuito. No se usan cepas aisladas, sino consorcios completos que imitan los ecosistemas naturales.',
    subtemas: [
      'Bacterias (Bacillus, Pseudomonas) - Descomponen materia orgánica y liberan nutrientes',
      'Hongos (Micorrizas, Trichoderma) - Mejoran absorción de nutrientes y protegen raíces',
      'Actinomicetos - Producen antibióticos naturales que controlan patógenos',
      'Protozoos - Regulan poblaciones bacterianas y liberan nutrientes',
      'Nematodos benéficos - Controlan plagas del suelo y mejoran la estructura',
      'Consorcio completo - 600 microorganismos trabajando en equipo'
    ],
    icono: '🦠'
  },
  'Descompactación Mecánica y Biológica': {
    descripcion: 'Uso de implementos como el arado Yomex para romper el piso de arado a 60-80 cm e inyectar vida para que la raíz respire y se desarrolle profundamente.',
    subtemas: [
      'Arado Yomex - Rompe la compactación profunda sin invertir el perfil del suelo',
      'Inyección de microorganismos - Se introducen directamente en el perfil del suelo',
      'Raíces profundas - Acceso a nutrientes y agua en capas profundas',
      'Mejora de la porosidad - Aumenta el espacio para el intercambio de gases',
      'Eliminación del piso de arado - Desaparece la capa compactada que limita el crecimiento',
      'Beneficios biológicos - Los microorganismos mantienen la descompactación'
    ],
    icono: '🚜'
  },
  'Energía y ORP (Potencial Óxido-Reducción)': {
    descripcion: 'Medir el potencial de óxido-reducción; un suelo reducido (energía negativa) protege a la planta de plagas y enfermedades.',
    subtemas: [
      'ORP - Mide la carga de electrones (energía) disponible en el suelo',
      'Suelo reducido (-100 a -300 mV) - Rico en energía y vida microbiana',
      'Suelo oxidado (+200 a +400 mV) - Consume energía de la planta para sobrevivir',
      'Cómo medir ORP - Dispositivos portátiles para monitoreo en campo',
      'Relación ORP vs. resistencia - Suelos reducidos protegen contra plagas',
      'rH - Coeficiente que integra pH and ORP para una visión completa'
    ],
    icono: '⚡'
  },
  'Energía and ORP (Potencial Óxido-Reducción)': {
    descripcion: 'Medir el potencial de óxido-reducción; un suelo reducido (energía negativa) protege a la planta de plagas y enfermedades.',
    subtemas: [
      'ORP - Mide la carga de electrones (energía) disponible en el suelo',
      'Suelo reducido (-100 a -300 mV) - Rico en energía y vida microbiana',
      'Suelo oxidado (+200 a +400 mV) - Consume energía de la planta para sobrevivir',
      'Cómo medir ORP - Dispositivos portátiles para monitoreo en campo',
      'Relación ORP vs. resistencia - Suelos reducidos protegen contra plagas',
      'rH - Coeficiente que integra pH and ORP para una visión completa'
    ],
    icono: '⚡'
  },
  'Salud Física del Suelo (porosidad, oxígeno)': {
    descripcion: 'La estructura física del suelo determina la capacidad de las raíces para crecer, respirar y absorber nutrientes.',
    subtemas: [
      'Porosidad - Espacios entre partículas que permiten el movimiento de agua y aire',
      'Oxígeno - Esencial para la respiración de raíces y microorganismos aeróbicos',
      'Agregados estables - Estructura que resiste la erosión y mantiene la fertilidad',
      'Compactación - Principal limitante del crecimiento radicular',
      'Glomalina - Glicoproteína que actúa como "pegamento" biológico',
      'Buenas prácticas - Rotación de cultivos, cobertura vegetal, mínimo laboreo'
    ],
    icono: '🫧'
  },
  'Infiltración y Retención de Agua (1% MO = 144,000 L/ha)': {
    descripcion: 'La materia orgánica actúa como una esponja gigante en el suelo, reteniendo hasta 144,000 litros de agua por hectárea por cada 1% de materia orgánica.',
    subtemas: [
      'Materia orgánica - La "esponja" natural que absorbe y retiene agua',
      'Infiltración - Capacidad del suelo para absorber el agua de lluvia y riego',
      'Retención - Almacenamiento de agua disponible para las plantas',
      '1% MO = 144,000 L/ha - Dato clave para entender su importancia',
      'Refrigerante del suelo - Mantiene la fotosíntesis activa a 27°C',
      'Resiliencia a sequías - Suelos con alta MO resisten mejor periodos secos'
    ],
    icono: '💧'
  },
  'Ciclos Físico-Químico-Biológicos': {
    descripcion: 'Interacciones entre factores físicos, químicos y biológicos que mantienen el suelo vivo, productivo y en equilibrio.',
    subtemas: [
      'Ciclo del Carbono - Materia orgánica → CO₂ atmosférico → Fotosíntesis → Planta',
      'Ciclo del Nitrógeno - Fijación, nitrificación, asimilación, desnitrificación',
      'Ciclo del Fósforo - Mineralización, solubilización, absorción por raíces',
      'Interacción raíz-microorganismos - La rizosfera como ecosistema activo',
      'Balance físico-químico-biológico - El ecosistema completo del suelo',
      'Indicadores de salud - Cómo evaluar el equilibrio del suelo'
    ],
    icono: '🔄'
  },
  'IASS - Índice de Sustentabilidad del Suelo': {
    descripcion: 'Cuantifica el patrimonio suelo como un todo. Un valor de 30-40% es óptimo para una productividad sustentable a largo plazo.',
    subtemas: [
      '¿Qué es el IASS? - Indicador integral de salud y sustentabilidad del suelo',
      'Componentes del IASS - Físicos, químicos y biológicos del suelo',
      'Valores óptimos - 30-40% para producción sustentable y rentable',
      'Cómo medir el IASS - Métodos prácticos aplicables en campo',
      'Mejorar el IASS - Estrategias de manejo y conservación',
      'IASS como herramienta - Toma de decisiones para agricultores'
    ],
    icono: '📊'
  },
  'La Regla del 95/5 (C-H-O: 95% de la planta es gratis)': {
    descripcion: 'El 95% de la planta es Carbono, Oxígeno e Hidrógeno, elementos que se obtienen gratis del aire (CO₂) y el agua (H₂O).',
    subtemas: [
      'Carbono (C) - 45% de la planta, proviene del CO₂ del aire',
      'Oxígeno (O) - 45% de la planta, del agua y del aire',
      'Hidrógeno (H) - 5% de la planta, del agua',
      'Solo 5% de la planta - Viene del suelo (minerales y nutrientes)',
      'Optimizar fotosíntesis - La clave para aumentar producción',
      'Consecuencias - El 95% de tu cosecha es GRATIS'
    ],
    icono: '💨'
  },
  'Sistema Milpa Maya - 9 mazorcas por planta': {
    descripcion: 'Sistema de policultivo precolombino basado en la sinergia de las "Tres Hermanas" (maíz, frijol y calabaza) que maximiza el rendimiento por superficie.',
    subtemas: [
      'El Maíz como Tutor: Provee estructura vertical física y soporte mecánico para que el frijol trepe hacia la luz solar.',
      'El Frijol como Fijador: Simbiosis con bacterias Rhizobium para fijar nitrógeno atmosférico gratuito directo a las raíces del consorcio.',
      'La Calabaza como Cobertura: Hojas gigantescas que cubren el suelo técnico reteniendo humedad y evitando el nacimiento de arvenses invasoras.',
      'Nutrición Mineral de Altura: El uso de harinas de rocas, Silicio y cenizas volcánicas rústicas permite activar hasta 9 mazorcas por planta.',
      'Soberanía Alimentaria Completa: Aporte equilibrado de carbohidratos, proteínas y lípidos saludables en un mismo espacio de cultivo.'
    ],
    icono: '🌽'
  },
  'Terrazas Incas y Diseño Hidrológico': {
    descripcion: 'Sistemas andinos de laderas escalonadas y canales de piedra que evitan la erosión, retienen agua y amortiguan heladas mediante inercia térmica.',
    subtemas: [
      'Drenaje Multicapa de Precisión: Base profunda de piedras grandes, grava media, arena lavada y tierra vegetal con alto humus para filtrar excesos.',
      'Inercia Térmica de Piedra: Muros perimetrales que absorben calor solar diurno y lo irradian de noche, previniendo la congelación foliar.',
      'Canales Hidráulicos Gravitacionales: Conducción de agua desde lagunas de altura (cochas) con gradientes de fricción calculados para evitar erosión.',
      'Moray (Laboratorio Agrícola): Terrazas circulares concéntricas que generan hasta 15°C de diferencia térmica para aclimatación de semillas de selva.',
      'Conservación del Suelo Técnico: Freno absoluto de escorrentías torrenciales en laderas escarpadas, acumulando capas fértiles por siglos.'
    ],
    icono: '🏔️'
  },
  'Chinampas Aztecas y Agricultura de Humedales': {
    descripcion: 'El sistema mesoamericano de islas artificiales flotantes en lagos someros, considerado uno de los métodos más intensivos y sostenibles creados.',
    subtemas: [
      'Islas de Sauce (Huejotes): Entramados de ramas de sauces nativos que consolidan las paredes perimetrales de la chinampa con raíces profundas.',
      'Riego de Capilaridad Pasiva: Absorción constante de agua por porosidad de las capas de suelo técnico sin necesidad de esfuerzo mecánico de riego.',
      'Fertilidad con Lodo Lacustre: Dragado periódico de los sedimentos ricos en materia orgánica y fósforo del fondo del canal para cubrir camas de siembra.',
      'Semilleros de Lodo (Chapines): Cuadrículas de lodo del lago cortadas en bloques de alta germinación para trasplantes con cero estrés radicular.',
      'Sistemas de Policultivo Lacustre: Producción coordinada de maíz, frijol, chile, calabaza y flores comestibles con hasta 5 cosechas anuales estables.'
    ],
    icono: '🛶'
  },
  'Control de Arvenses - La maleza como aliada': {
    descripcion: 'Uso de plantas silvestres como coberturas vivas, bombas de minerales insolubles y albergue de fauna benéfica del agroecosistema.',
    subtemas: [
      'Plantas Bomba de Nutrientes: Raíces profundas que extraen minerales bloqueados (fósforo, oligoelementos) y los depositan arriba al podarse.',
      'Conservación de Temperatura: Disminución de hasta 10°C en la superficie del suelo, manteniendo activa la microbiología en sequías.',
      'Soporte a Fauna Benéfica: Flores nativas de arvenses que alimentan avispas parasitoides y crisopas controladoras de insectos dañinos.',
      'Arvenses como Bioindicadores: Familias botánicas cuya germinación espontánea acusa compactación, asfixia radicular o exceso de nitratos.',
      'Manejo Selectivo sin Herbicidas: Segar superficialmente en lugar de desyerbar de raíz para mantener la red micorrícica intacta en el perfil.'
    ],
    icono: '🌿'
  },
  'Ingeniería Hidráulica Jemer (Camboya)': {
    descripcion: 'El colosal sistema de captación y regulación hídrica de Angkor que dominó los climas monzónicos bimodales del sudeste asiático.',
    subtemas: [
      'Megarreservorios Elevated (Barays): Lagos artificiales como el Baray Occidental (8 x 2.2 km) creados con diques perimetrales de tierra de 10m de altura.',
      'Alimentación Hidráulica: Canales que captaban caudales excedentes de ríos monzónicos (río Siem Reap) y los reconducían para almacenamiento masivo.',
      'Distribución Gravitacional: Apertura manual de compuertas de piedra que liberaban agua dulce constante por pura gravedad hacia la llanura agrícola.',
      'Arroz Flotante Monzónico: Variedad con estiramiento celular acelerado de hasta 5-6 metros para mantener sus espigas a flote en inundaciones.',
      'Seguridad Alimentaria Continua: Suministro hidráulico constante que garantizó hasta tres cosechas de arroz anuales, rompiendo la sequía extrema.'
    ],
    icono: '🏯'
  },
  'Sistema Subak de Bali (Indonesia)': {
    descripcion: 'Democracia hídrica y control natural de plagas en laderas volcánicas ricas en potasio, fósforo y magnesio.',
    subtemas: [
      'Terrazas de Retención Arcillosa: Diques hechos con arcilla mezclada con paja y piedra para retener capas de agua estática de 5 a 12 cm en laderas.',
      'Túneles y Acueductos de Piedra: Kilométricas galerías excavadas directamente en la roca de barrancos selváticos para guiar agua por gravedad.',
      'Templos del Agua (Pura): Red cooperativa jerárquica donde sacerdotes del agua y agricultores coordinan turnos democráticos de riego.',
      'Sincronización contra Plagas: Cosecha simultánea y barbecho seco coordinado en toda la región para romper la cadena alimenticia de roedores e insectos.',
      'Filosofía Tri Hita Karana: Enfoque integral que fusiona la fe espiritual, la armonía humana y el cuidado técnico del ecosistema hídrico.'
    ],
    icono: '🌋'
  },
  'Policultura del Arrozal Inundado (China)': {
    descripcion: 'Aprovechamiento biológico multi-nivel del humedal artificial del arrozal en el sur de China mediante simbiosis animal.',
    subtemas: [
      'Flujo de Desbordamiento Serpentino: Agua fría de manantiales superiores que fluye lentamente por compuertas de bambú para evitar la anoxia de raíces.',
      'Simbiosis Arroz-Pez (Carpas): Peces que nadan oxigenando el lodo, devoran larvas de plagas y malas hierbas, y fertilizan el agua con nitrógeno y fósforo.',
      'Asociación Arroz-Pato: Patos jóvenes que controlan caracoles y escarabajos invasores, y estimulan con sus patas el enraizamiento profundo.',
      'Tratados de Agricultura (Nong Shu): Manuales de estado oficiales precisos sobre preparación del suelo, diseño hidráulico y selección de semillas.',
      'Eficiencia de Espacio Humedal: Producción simultánea de granos limpios y proteína animal de excelente calidad en el mismo metro cuadrado.'
    ],
    icono: '🇨🇳'
  },
  'Tecnologías e Innovación China (Ao Tian)': {
    descripcion: 'Maquinaria de precisión tradicional y métodos térmicos y orgánicos avanzados de protección hortícola.',
    subtemas: [
      'Bomba de Cadena (Longgu Che): Paletas articuladas en canaletas inclinadas movidas por pedales para elevar agua masivamente a colinas.',
      'Arado de Hierro Curvo (Kuan): Vertedera curva de hierro fundido que voltea la tierra arcillosa húmeda con mínima fricción del animal de tiro.',
      'Norias Autónomas de Bambú: Ruedas gigantes que usan la fuerza del río para cargar agua en tubos de bambú e irrigar tierras altas sin energía humana.',
      'Cultivo en Fosas (Ao Tian): Pozos profundos enriquecidos con compost que frenan vientos helados de Mongolia y retienen calor solar invernal.',
      'Trampas de Luz e Inversión Lumínica: Antorchas con cuencos de agua y aceite que atraen y eliminan orugas y polillas nocturnas en arrozales.',
      'Hormigas Tejederas Protectoras: Primer control biológico citrus (Oecophylla smaragdina) para devorar plagas, uniendo árboles con puentes de bambú.'
    ],
    icono: '⚙️'
  },
  'Sistemas del Monzón y Tanques (India Antigua)': {
    descripcion: 'Gestión pluvial en Gujarat y Baluchistán frente al régimen monzónico del valle del Indo e insecticidas biológicos ancestrales.',
    subtemas: [
      'Tanques de Dholavira: Red de 16 colosales depósitos rectangulares de piedra caliza tallada para recolectar escorrentías de torrentes estacionales.',
      'Gabarbands de Baluchistán: Presas horizontales de piedra diseñadas para frenar escorrentías, retener limo aluvial y recargar mantos acuíferos.',
      'Rotación Estacional Rabi y Kharif: Cultivo de verano (Kharif: arroz, algodón, mijo) y secas con humedad residual (Rabi: trigo, cebada, leguminosas).',
      'Protección Térmica de Inundación: Inundación preventiva nocturna para aprovechar el calor latente del agua y frenar heladas secas de radiación.',
      'Aceite de Neem (Krishi-Parashara): Insecticida bioquímico de semillas de Neem que sabotea el sistema hormonal y metamorfosis de insectos plaga.'
    ],
    icono: '🇮🇳'
  },
  'Control de Ríos y Desalinización (Babilonia)': {
    descripcion: 'Control hidráulico del Tigris y Éufrates y mitigación de salinidad del suelo mediante bioquímica tradicional babilónica.',
    subtemas: [
      'Canales de Desviación Elevados: Canales de toma alta que llevaban agua por encima de los campos, permitiendo riego por gravedad.',
      'Esclusas Impermeables con Betún: Compuertas de ladrillo selladas con asfalto natural para regular excedentes fluviales hacia lagunas secas.',
      'Sustitución Osmótica de Cebada: Reemplazo sistemático del trigo sensible por cebada (Hordeum vulgare), planta altamente tolerante a sales.',
      'Lavado Químico y Drenajes Abiertos: Zanjas profundas paralelas de desagüe que recibían el agua cargada con sales superficiales disueltas.',
      'Barbecho de Maleza (Shuqal): Descanso del suelo alternado con arbustos de raíces profundas que bajaban el nivel freático para evitar salinización por capilaridad.',
      'Oasis en Tres Niveles: Palmeras datileras (barrera de calor), frutales intermedios (sombra parcial) y cereales/hortalizas inferiores protegidos.'
    ],
    icono: '🧱'
  },
  'Rescate de la Sabiduría Ancestral': {
    descripcion: 'Recuperación de los principios de diseño ecológico desarrollados durante milenios y su validación con herramientas científicas modernas.',
    subtemas: [
      'Sostenibilidad Milenaria: Sistemas que produjeron alimentos durante siglos sin agotar el recurso hídrico ni erosionar la fertilidad del suelo.',
      'Uso de Recursos Locales de la Finca: Reducción total de insumos químicos petroquímicos costosos utilizando preparados microbiológicos locales.',
      'Observación de Ciclos Biológicos: Planificación basada en patrones climáticos locales, fases de la luna y comportamiento de la microfauna.',
      'Conservación de Semillas Criollas: Selección activa y resguardo de germoplasma nativo altamente adaptado a climas cambiantes y rústicos.',
      'Gestión Comunitaria: Organización social colaborativa para administrar infraestructuras comunes (acequias, turnos de agua, bancos de semillas).'
    ],
    icono: '🏺'
  },
  'Descolonización Científica y Tecnológica': {
    descripcion: 'Ruptura del monopolio agroquímico de la Revolución Verde para validar la ciencia y eficiencia de las técnicas agrarias tradicionales.',
    subtemas: [
      'Superación del Paradigma NPK: Comprender que la vida de la planta depende del microbioma del suelo y la nutrición mineral completa y balanceada.',
      'Validación Biológica de Campo: Uso de microscopía y metagenómica para demostrar que las prácticas ancestrales activaban microbiomas sanos.',
      'Soberanía Productiva Completa: Empoderar al agricultor para que fabrique sus bioinsumos y rompa la cadena de dependencia comercial sintética.',
      'El Saber Campesino como Ciencia: Integrar la experimentación empírica y la observación acumulada con los marcos conceptuales modernos.',
      'Rendimiento Neto de Energía: Demostración de que la policultura tradicional supera en rendimiento calórico neto por hectárea a los monocultivos.'
    ],
    icono: '🛡️'
  },
  'El mito del maíz que se multiplicaba': {
    descripcion: 'La historia de la domesticación del teocintle y la creación del maíz, la mayor obra de biotecnología precolombina de América.',
    subtemas: [
      'Domesticación del Teocintle: Selección guiada durante miles de años para transformar una gramínea dura en una mazorca comestible gigante.',
      'Riqueza Varietal Adaptativa: Cientos de razas criollas con variabilidades genéticas adaptadas a climas áridos, selvas lluviosas y altiplanos.',
      'Nixtamalización Mesoamericana: Cocción de granos con cal mineral o ceniza de madera, proceso que libera niacina y previene enfermedades nutricionales.',
      'Simbiosis Biológica Humana: Co-evolución estricta entre la planta de maíz (incapaz de desgranarse sola para reproducirse) y el campesino.',
      'Almacenamiento Seguro (Trojes): Estructuras tradicionales de ventilación y control de humedad que preservaban los granos de gorgojos por años.'
    ],
    icono: '🌽'
  }
};
