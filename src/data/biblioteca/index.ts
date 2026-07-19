import type { BibliotecaDoc } from '../../types';

export const BIBLIOTECA: BibliotecaDoc[] = [
  {
    id: "ficha-compostaje-domestico",
    title: "Guía de Parámetros Críticos en Compostaje",
    category: "Fichas Técnicas",
    subcategory: "Monitoreo y Control",
    difficulty: "Bajo",
    cultivo: "Policultivos, Huertos Familiares",
    author: "Centro de Investigación Agroecológica de Agricultura Antigua",
    date: "12 de Mayo de 2026",
    version: "v1.4",
    licencia: "Creative Commons BY-NC-SA 4.0",
    tags: ["Compost", "Suelos", "Humedad", "Temperatura", "Ficha Técnica"],
    description: "Parámetros óptimos para asegurar una descomposición aeróbica rápida sin malos olores. Incluye rangos óptimos de temperatura, humedad, relación C:N y pH.",
    fullText: "El compostaje exitoso depende del control estricto de cuatro factores biofísicos: \n\n" +
              "1. TEMPERATURA: El proceso atraviesa tres etapas. Etapa mesófila (20-40°C, primeros días), etapa termófila (45-65°C, desinfección de patógenos y malezas), y etapa de maduración (vuelta a temperatura ambiente). La fase termófila debe sostenerse por al menos 3 días consecutivos a más de 55°C para garantizar inocuidad. \n\n" +
              "2. HUMEDAD: El rango óptimo es de 50% a 60%. Si cae por debajo de 40%, la actividad microbiana se detiene. Si supera el 65%, el agua desplaza al aire de los poros de la pila, desatando una fermentación anaeróbica ácida causante de malos olores y lixiviación de nutrientes. \n\n" +
              "3. AIREACIÓN: El oxígeno es el combustible de los hongos y bacterias aeróbicas. Debe garantizarse mediante volteos periódicos o la inserción de tubos perforados en el núcleo de la pila. \n\n" +
              "4. RELACIÓN C:N: La mezcla ideal de arranque debe tener 30 partes de Carbono por 1 de Nitrógeno. Fuentes ricas en nitrógeno (verdes): restos de verdura, estiércol fresco, césped cortado. Fuentes ricas en carbono (cafés): hojas secas, paja, cartón picado, aserrín limpio.",
    downloads: 1420,
    relatedCourses: ["suelo-vivo"],
    sources: [
      "FAO (2020) Manual de Compostaje del Agricultor",
      "Universidad Nacional Agraria - Laboratorio de Biología de Suelos"
    ]
  },
  {
    id: "protocolo-microorganismos-montana",
    title: "Protocolo de Captura y Multiplicación de Microorganismos de Montaña (MM)",
    category: "Protocolos",
    subcategory: "Inoculantes Biológicos",
    difficulty: "Medio",
    cultivo: "General",
    author: "Colectivo Regenerativo de Agricultura Antigua",
    date: "04 de Enero de 2026",
    version: "v2.1",
    licencia: "GPLv3 Open Source",
    tags: ["MM", "Microbiología", "Inóculo", "Montaña", "Protocolo"],
    description: "Método paso a paso para colectar hojarasca colonizada por hongos benéficos del bosque nativo y multiplicarlos de forma sólida y líquida para la salud del cultivo.",
    fullText: "Los Microorganismos de Montaña (MM) constituyen un inóculo complejo que estabiliza el suelo y mejora la absorción radicular. \n\n" +
              "FASE 1: CAPTURA (Fase Sólida)\n" +
              "Se acude a un bosque saludable y se colecta la hojarasca semi-descompuesta impregnada de un manto blanco filamentoso (micelio). Se mezclan 40 kg de este mantillo forestal con 40 kg de salvado de trigo o arroz y 20 litros de melaza diluida en suero o agua de lluvia. Se humedece homogéneamente (prueba del puño). Se compacta fuertemente en un bidón plástico de 200 litros asegurando que no quede aire atrapado en las capas. Se sella herméticamente y se deja fermentar por 30 días a la sombra.\n\n" +
              "FASE 2: ACTIVACIÓN (Fase Líquida)\n" +
              "Transcurridos los 30 días, el contenido sólido debe oler a fermento dulce-ácido agradable. Para activarlo en forma líquida, se introducen 4 kg del MM sólido en un saco de tela permeable (como un té gigante) y se sumerge en un bidón de 200L lleno de agua limpia, 4L de melaza y 4L de suero láctico. Se sella anaeróbicamente por 15 a 20 días. El líquido resultante se aplica foliar al 5-10% o al suelo mediante sistema de riego por goteo.",
    downloads: 2150,
    relatedCourses: ["suelo-vivo", "biofertilizantes"],
    sources: [
      "Experiencias de Agricultura Orgánica en Costa Rica - Jairo Restrepo Rivera",
      "Estudio de Viabilidad Microbiana de Suelos Tropicales, INTA."
    ]
  },
  {
    id: "guia-bioestimulantes-foliares",
    title: "Guía de Aplicación Eficiente de Bioestimulantes de Crecimiento",
    category: "Guías",
    subcategory: "Fisiología Vegetal",
    difficulty: "Bajo",
    cultivo: "Hortalizas, Frutales",
    author: "Dra. Elena Rivera",
    date: "30 de Marzo de 2026",
    version: "v1.0",
    licencia: "Creative Commons BY-NC",
    tags: ["Bioestimulantes", "Aplicación", "Foliar", "Nutrición"],
    description: "Tiempos, condiciones meteorológicas y dosificaciones clave para maximizar la absorción foliar a través de los estomas vegetales.",
    fullText: "Para que un fertilizante o bioestimulante foliar sea efectivo, debe atravesar la cutícula de las hojas e ingresar a las células de las plantas a través de los estomas. \n\n" +
              "1. HORA DE APLICACIÓN: Aplica únicamente en las primeras horas de la mañana (de 6:00 AM a 9:00 AM) o en las últimas horas de la tarde (después de las 5:00 PM). A estas horas la temperatura ambiental es baja y la humedad relativa es alta, lo que estimula la apertura de los estomas vegetales. Evita el mediodía: la alta radiación cierra estomas para conservar agua, y las gotas de aspersión actúan como lupa quemando el tejido foliar. \n\n" +
              "2. PH DEL AGUA: El agua de aspersión debe tener un pH ligeramente ácido (entre 5.5 y 6.5). El agua alcalina de pozo con pH de 8.0 neutraliza la asimilación de micronutrientes como el hierro y el zinc. Se puede acidificar el agua añadiendo 1-2 ml de vinagre común por litro de agua. \n\n" +
              "3. COBERTURA: Recuerda mojar abundantemente el envés (parte inferior) de las hojas. El envés contiene hasta 10 veces más densidad de estomas que el haz (parte superior), aumentando drásticamente la tasa de absorción de tus caldos biológicos.",
    downloads: 980,
    relatedCourses: ["biofertilizantes"],
    sources: [
      "Taiz & Zeiger (2015) Plant Physiology and Development",
      "Manual Práctico de Fertilización Orgánica Foliar, Agroecología del Sur."
    ]
  },
  {
    id: "modelo-holandes-cea",
    title: "Sistemas de Cultivo de Alto Rendimiento en Invernaderos de Holanda",
    category: "Artículos",
    subcategory: "Ambiente Controlado & Fisiología",
    difficulty: "Alto",
    cultivo: "Tomates de Racimo y Horticultura Protegida",
    author: "Wageningen University & Research (WUR)",
    date: "5 de Julio de 2026",
    version: "v1.0",
    licencia: "Creative Commons BY-NC-SA 4.0",
    tags: ["Invernaderos", "Holanda", "LED", "CO2", "Fisiología", "CEA"],
    description: "Estudio exhaustivo del modelo holandés de cultivo. Analiza la optimización del espectro de luz artificial rojo/azul, el control térmico estabilizado a 27°C y la fertilización carbónica con CO2 para lograr cosechas de hasta 80 kg/m².",
    fullText: "=== INTRODUCCIÓN GENERAL AL MODELO HOLANDÉS ===\n\n" +
              "El modelo hortícola de los Países Bajos (estilo holandés) es reconocido mundialmente por lograr rendimientos insuperables, como cosechas estables de 80 a 90 kg por metro cuadrado de tomate. Este éxito no se debe meramente al uso de tecnología aislada, sino a la integración sinérgica de factores climáticos y fisiológicos que maximizan la Eficiencia en el Uso de la Radiación y Nutrientes.\n\n" +
              "La industria holandesa opera bajo la regla empírica de que, bajo condiciones óptimas, un 1% más de luz equivale directamente a un 1% más de rendimiento potencial. Al controlar artificialmente el microclima, el clima exterior se vuelve irrelevante.\n\n" +
              "=== 1. LA FISIOLOGÍA DE LA LUZ Y LAS RECETAS LED DINÁMICAS ===\n\n" +
              "La eficiencia fotosintética depende drásticamente de la calidad espectral de la luz. El rendimiento cuántico de la fijación de CO₂ presenta un máximo en la región roja y un hombro intermedio en la región azul. Esto se explica por la absorción coordinada de las clorofilas a, b y carotenoides.\n\n" +
              "• Sinergia Lumínica (85-90% Rojo / 10-15% Azul): El espectro rojo (660 nm) es el motor fotosintético más eficiente por vatio invertido. Sin embargo, la luz azul (450 nm) es indispensable para regular la apertura estomática, controlar el grosor de las hojas y evitar el estiramiento anormal de los tallos (síndrome de evitación de la sombra).\n\n" +
              "• Iluminación Intercalada (Intra-canopy Lighting): Dado que las tomateras crecen de 4 a 5 metros verticalmente, se colocan líneas de luces LED entre el follaje (interiluminación). Esto evita que el dosel superior sombree las hojas bajas, activando la fotosíntesis en todo el volumen de la planta e incrementando el rendimiento global en un 25%.\n\n" +
              "• Transiciones de Estado y STN7 Quinasa: El aparato fotosintético regula la energía entre el Fotosistema II (PSII) y el Fotosistema I (PSI) mediante complejos LHCII móviles. Bajo desequilibrios de luz, el pool de plastoquinona (PQ) actúa como sensor. Si el PSII se sobreexcita, PQ se reduce y activa la quinasa STN7, fosforilando proteínas para desplazar LHCII hacia el PSI (Estado 2). Al restablecerse el equilibrio, las fosfatasas TAP38 y PPH1 desfosforilan el complejo, regresando al Estado 1. Estas transiciones aumentan el rendimiento cuántico de fijación de CO₂ entre un 10% y 13% en minutos.\n\n" +
              "=== 2. CONTROL TÉRMICO ESTABILIZADO A 27°C Y GESTIÓN DEL VPD ===\n\n" +
              "Mantener una temperatura constante de 27°C acelera de forma drástica la velocidad de desarrollo celular y maduración del fruto. Sin embargo, los sistemas LED no emiten radiación infrarroja (calor), por lo que la temperatura foliar óptima se gestiona con tuberías hidrónicas y deshumidificación activa.\n\n" +
              "• El papel de la Rubisco: La enzima Rubisco funciona como carboxilasa (fijando CO₂) y oxigenasa (desatando la fotorrespiración). A mayores temperaturas, la solubilidad del CO₂ disminuye más rápido que la del O₂, aumentando la fotorrespiración y el consumo energético (lo que puede reducir el rendimiento cuántico neto hasta un 29% a 35°C).\n\n" +
              "• El Desafío del Déficit de Presión de Vapor (VPD): En un invernadero cerrado a 27°C, la planta transpira masivamente. Si la humedad relativa supera el 85%, la transpiración se detiene, bloqueando el transporte de Calcio y provocando pudrición apical (Blossom End Rot). Se instalan deshumidificadores industriales (como DryGair) que condensan el exceso de vapor, devolviendo aire cálido seco y recuperando agua destilada purificada.\n\n" +
              "=== 3. FERTILIZACIÓN CARBÓNICA CON CO₂ EN LA BASE DEL DOSEL ===\n\n" +
              "A 27°C y alta iluminación LED, el CO₂ se agota en minutos. Para evitar que sea el factor limitante, se inyecta de forma constante hasta alcanzar niveles de 800 ppm a 1000 ppm.\n\n" +
              "• Inyección Localizada: El gas de CO₂ se distribuye localmente por tuberías plásticas microperforadas tendidas justo en la base de cada línea de cultivo. Al ascender de forma homogénea, cruza el área foliar donde los estomas lo absorben directamente antes de que escape.\n\n" +
              "• Origen de Suministro: El CO₂ proviene de la purificación de los gases de combustión de plantas de cogeneración eléctrica (motores CHP) o tanques criogénicos. Se detiene de inmediato si la ventilación cenital se abre más de un 30%.\n\n" +
              "=== 4. PLAN OPERATIVO DE REPLICACIÓN DE ALTO RENDIMIENTO ===\n\n" +
              "Para replicar estas cosechas récord en proyectos locales, es preciso estructurar la producción en tres niveles:\n\n" +
              "1. CANALETAS SUSPENDIDAS Y SUSTRATO INERTE: Cultivar sobre tablas de lana de roca (Rockwool) o fibra de coco en canaletas elevadas a 1 metro de altura. Esto previene patógenos del suelo, controla la temperatura de la raíz y optimiza la recolección de drenaje.\n\n" +
              "2. LAZO CERRADO Y RECIRCULACIÓN: Aplicar fertirriego por goteo automatizado. El drenaje del 30% sobrante es recolectado, desinfectado con ozono o luz UV, reequilibrado nutricionalmente y reinyectado, eliminando pérdidas de fertilizantes.\n\n" +
              "3. DENSIDAD DE TALLOS DINÁMICA: Iniciar con 2.5 tallos/m² y aumentarlo hasta 4.5 o 5.5 tallos/m² permitiendo brotes secundarios a medida que se activa el soporte de iluminación LED invernal, multiplicando la productividad por superficie.",
    downloads: 1250,
    relatedCourses: ["suelo-vivo", "biofertilizantes"],
    sources: [
      "Wageningen University & Research (WUR) - Greenhouse Horticulture Department",
      "Autonomous Greenhouse Challenge - Reports on LED and CO2 integration (2024-2026)",
      "Signify Philips Lighting - Light Recipes for Greenhouse Vegetables"
    ]
  },
  {
    id: "ficha-caldo-sulfocalcico",
    title: "Preparación y Aplicación del Caldo Sulfocálcico",
    category: "Fichas Técnicas",
    subcategory: "Bioinsumos Protectores",
    difficulty: "Medio",
    cultivo: "Frutales, Hortalizas, Vid",
    author: "Laboratorio de Bioinsumos - Agricultura Antigua",
    date: "15 de Febrero de 2026",
    version: "v1.2",
    licencia: "Creative Commons BY-NC-SA 4.0",
    tags: ["Caldo Sulfocálcico", "Azufre", "Cal", "Hongo", "Ácaros"],
    description: "Guía completa de cocción, filtrado y almacenamiento del caldo sulfocálcico para el control preventivo de hongos y ácaros en cultivos orgánicos.",
    fullText: "El caldo sulfocálcico es un fungicida y acaricida preventivo de origen mineral preparado por cocción de azufre y cal viva. \n\n" +
              "MATERIALES: 2 kg de azufre elemental en polvo, 1 kg de cal viva (óxido de calcio), 10 litros de agua limpia (preferiblemente de lluvia), recipiente de hierro o acero inoxidable (nunca de aluminio), palo de madera para agitar, filtro de tela. \n\n" +
              "PROCEDIMIENTO: Calienta el agua hasta ebullición suave. Agrega la cal viva lentamente (la reacción es exotérmica). Incorpora el azufre en forma de lluvia fina mientras agitas constantemente. Cocina a fuego lento durante 45-60 minutos hasta que la mezcla adquiera un color ámbar oscuro o ladrillo. Retira del fuego, deja enfriar y filtra con tela. Almacena en envases plásticos oscuros y herméticos, etiquetando con fecha de preparación. \n\n" +
              "DOSIS: Aplicar al 1-2% (100-200 ml por 10L de agua) en aspersión foliar cada 15 días como preventivo. No mezclar con aceites ni jabones. Aplicar en horas frescas.",
    downloads: 1870,
    relatedCourses: ["biofertilizantes"],
    sources: ["Manual de Agricultura Orgánica - Jairo Restrepo", "Experiencias de campo de Agricultura Antigua"]
  },
  {
    id: "guia-abonos-verdes",
    title: "Guía de Abonos Verdes y Coberturas Vegetales",
    category: "Guías",
    subcategory: "Manejo de Suelos",
    difficulty: "Bajo",
    cultivo: "General",
    author: "Colectivo Regenerativo de Agricultura Antigua",
    date: "20 de Abril de 2026",
    version: "v2.0",
    licencia: "Creative Commons BY-NC",
    tags: ["Abonos Verdes", "Cobertura", "Nitrógeno", "Biomasa"],
    description: "Selección de especies, épocas de siembra y manejo de abonos verdes para protección, fertilización y estructuración del suelo.",
    fullText: "Los abonos verdes son cultivos temporales que se siembran no para cosechar, sino para incorporar biomasa vegetal al suelo. \n\n" +
              "ESPECIES RECOMENDADAS: \n- Leguminosas (fijadoras de nitrógeno): Canavalia, Crotalaria, Mucuna, Vicia, Trébol. \n- Gramíneas (alta producción de biomasa): Avena, Centeno, Mijo, Sorgo forrajero. \n- Crucíferas (biofumigación): Mostaza blanca, Nabo forrajero. \n\n" +
              "ÉPOCAS DE SIEMBRA: En climas tropicales se pueden sembrar todo el año aprovechando las lluvias. En temporales: 60-90 días antes del cultivo principal. \n\n" +
              "MANEJO: Corte a ras del suelo en floración (máximo contenido de nutrientes). Picar y dejar como mulch superficial o incorporar superficialmente. Esperar 15-20 días antes de transplantar el cultivo comercial para permitir la descomposición inicial.",
    downloads: 1650,
    relatedCourses: ["suelo-vivo"],
    sources: ["FAO - Abonos Verdes y Cultivos de Cobertura", "Experiencias de Agricultura Regenerativa en Latinoamérica"]
  },
  {
    id: "protocolo-bocashi",
    title: "Protocolo de Elaboración de Abono Fermentado Bokashi",
    category: "Protocolos",
    subcategory: "Fermentación Aeróbica",
    difficulty: "Medio",
    cultivo: "General",
    author: "MSc. Kenji Takahashi",
    date: "10 de Junio de 2026",
    version: "v1.0",
    licencia: "GPLv3 Open Source",
    tags: ["Bokashi", "Fermentación", "Compostaje Rápido", "Microorganismos"],
    description: "Protocolo detallado de preparación del Bokashi en 15 días, con control de temperatura, humedad y volteos.",
    fullText: "El Bokashi es un método de compostaje fermentativo acelerado de origen japonés, listo en 12-15 días. \n\n" +
              "INGREDIENTES: 50 kg de salvado de arroz o afrechillo, 50 kg de cascarilla de arroz o carbón molido, 30 kg de tierra negra tamizada, 20 kg de estiércol seco de vaca, 5 kg de melaza de caña, 200 gramos de levadura de pan (Saccharomyces cerevisiae), 2 kg de carbón vegetal molido, agua limpia. \n\n" +
              "PROCEDIMIENTO DÍA A DÍA: \nDía 1: Mezclar todos los ingredientes secos homogéneamente. Disolver melaza y levadura en 10 litros de agua tibia. Agregar el líquido a la mezcla y humedecer hasta alcanzar 50-60% de humedad (prueba del puño: al apretar la mezcla, debe formarse un terrón que se deshace al tocarlo). Formar una pila de 30-40 cm de altura. \nDías 2-12: Voltear la pila 1-2 veces al día. Monitorear temperatura (meta: 55-65°C). Si supera los 70°C, voltear inmediatamente. \nDías 13-15: Reducir volteos. La temperatura debe estabilizarse a temperatura ambiente. El Bokashi está listo cuando huele a fermento agridulce y tiene aspecto desmenuzable.",
    downloads: 2340,
    relatedCourses: ["bokashi-avanzado"],
    sources: ["Manual de Agricultura Orgánica - Jairo Restrepo", "Técnicas de Fermentación Aeróbica - EMRO Japan"]
  },
  {
    id: "guia-identificacion-plagas",
    title: "Guía de Identificación de Plagas y Enemigos Naturales",
    category: "Guías",
    subcategory: "Manejo Integrado",
    difficulty: "Medio",
    cultivo: "General",
    author: "Ing. Lucía Mendoza",
    date: "18 de Mayo de 2026",
    version: "v1.0",
    licencia: "Creative Commons BY-NC",
    tags: ["Plagas", "Identificación", "Control Biológico", "Depredadores"],
    description: "Guía ilustrada con fotografías de campo para identificar las principales plagas agrícolas y sus depredadores naturales asociados.",
    fullText: "MANUAL DE IDENTIFICACIÓN RÁPIDA DE PLAGAS Y CONTROLADORES BIOLÓGICOS \n\n" +
              "PLAGAS COMUNES: \n- Áfidos o pulgones (Aphididae): Insectos pequeños de cuerpo blando, color verde, negro o amarillo. Se agrupan en brotes tiernos y envés de hojas. Secretan melaza que atrae hormigas y produce fumagina. Control biológico: Crisopas, mariquitas, avispas parasitoides (Aphidius). \n- Trips (Frankliniella occidentalis): Insectos alargados de 1-2 mm, color amarillo a marrón. Producen plateado en hojas y deformación de frutos. Control biológico: Amblyseius swirskii, Orius laevigatus. \n- Arañita roja (Tetranychus urticae): Ácaros minúsculos en envés con telaraña fina. Manchas cloróticas en haz. Control biológico: Phytoseiulus persimilis. \n- Mosca blanca (Bemisia tabaci): Pequeñas moscas blancas que vuelan al agitar la planta. Causan debilitamiento y transmisión de virus. Control biológico: Encarsia formosa. \n\n" +
              "CÓMO MUESTREAR: Revisar 10 plantas al azar por hectárea, observar el envés de 3 hojas por planta. Registrar presencia de plagas y depredadores. Solo aplicar control si se supera el umbral de daño económico.",
    downloads: 2100,
    relatedCourses: ["control-biologico"],
    sources: ["Manual de Control Biológico - INIA", "Experiencias de Manejo Integrado - Agricultura Antigua"]
  },
  {
    id: "ficha-riego-goteo",
    title: "Ficha Técnica: Diseño de Riego por Goteo para Fincas Familiares",
    category: "Fichas Técnicas",
    subcategory: "Infraestructura de Riego",
    difficulty: "Medio",
    cultivo: "Hortalizas, Frutales",
    author: "Centro de Investigación Agroecológica de Agricultura Antigua",
    date: "22 de Marzo de 2026",
    version: "v1.0",
    licencia: "Creative Commons BY-NC-SA 4.0",
    tags: ["Riego", "Goteo", "Diseño", "Ahorro de Agua", "Ficha Técnica"],
    description: "Cálculo y diseño de sistemas de riego por goteo de bajo costo para pequeñas fincas, con materiales accesibles y mantenimiento sencillo.",
    fullText: "DISEÑO DE SISTEMA DE RIEGO POR GOTEO PARA PEQUEÑAS FINCAS \n\n" +
              "1. COMPONENTES BÁSICOS: \n- Tanque de almacenamiento (elevado mínimo 1.5 m para presión por gravedad). \n- Filtro de malla o anillas (120 mesh). \n- Tubería principal de PVC de 1/2\" o 3/4\". \n- Laterales de cinta de goteo o manguera de 16 mm con goteros cada 20-30 cm. \n- Goteros autocompensantes (caudal 1-4 L/h). \n\n" +
              "2. CÁLCULO RÁPIDO: \n- Caudal total (L/h) = Número de goteros × Caudal por gotero (L/h). \n- Tiempo de riego (h) = Lámina de riego necesaria (mm) × Área (m²) / Caudal total (L/h). \n- Para hortalizas en clima cálido: 4-6 mm/día. \n\n" +
              "3. MANTENIMIENTO: \n- Lavar filtros semanalmente. \n- Inyectar ácido nítrico o cloro cada 15 días para destapar goteros (solo si se usa fertilización). \n- Revisar presión al final del sistema: debe haber al menos 0.5 bar. \n\n" +
              "4. VENTAJAS: Ahorro de agua del 40-60% comparado con riego por surcos. Reduce incidencia de hongos foliares. Permite fertirriego eficiente.",
    downloads: 1890,
    relatedCourses: ["riego-keyline"],
    sources: ["FAO - Riego por Goteo para Pequeños Agricultores", "Manual Técnico de Riego Localizado - INTI"]
  }
];

export function getDocById(id: string): BibliotecaDoc | undefined {
  return BIBLIOTECA.find(d => d.id === id);
}

export const CATEGORIAS_BIBLIOTECA = ["Fichas Técnicas", "Protocolos", "Guías", "Manuales", "Artículos", "Textos", "Audios", "Videos"];

export const AUDIOS: any[] = [];

export const VIDEOS: any[] = [];
