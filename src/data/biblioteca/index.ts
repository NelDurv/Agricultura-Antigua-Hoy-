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
  }
];

export function getDocById(id: string): BibliotecaDoc | undefined {
  return BIBLIOTECA.find(d => d.id === id);
}
