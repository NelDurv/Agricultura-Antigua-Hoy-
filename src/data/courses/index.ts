import type { Course } from '../../types';

export const COURSES: Course[] = [
  {
    id: "suelo-vivo",
    title: "Suelo Vivo: Microbiología y Regeneración",
    description: "Aprende a diagnosticar, activar y multiplicar la vida microscópica del suelo para una nutrición vegetal óptima.",
    extendedDescription: "Este curso práctico enseña los fundamentos del suelo como un organismo vivo. Aprenderás a transitar de una agricultura dependiente de agroquímicos a un sistema regenerativo basado en la microbiología autóctona, reduciendo costos de producción y aumentando la resiliencia climática.",
    level: "Principiante",
    category: "Nutrición de Suelos",
    duration: "12 horas",
    lessonsCount: 4,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c3aa?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    isPremium: false,
    author: "Ing. Alejandro Salazar - Especialista en Microbiología de Suelos",
    modules: [
      {
        id: "sv-m1",
        title: "La red alimentaria del suelo y sus actores",
        duration: "3h",
        type: "lecture",
        content: "El suelo no es un soporte inerte; es un ecosistema complejo habitado por miles de millones de bacterias, hongos micorrízicos, nematodos, protozoos y artrópodos. Estos organismos trabajan en conjunto para mineralizar nutrientes, crear estructura de agregados estables, regular el agua y defender a las plantas contra patógenos. La fotosíntesis de la planta alimenta este ecosistema subterráneo mediante exudados radiculares (azúcares, aminoácidos y ácidos orgánicos), creando una simbiosis perfecta donde el suelo vivo alimenta a la planta a cambio de energía solar."
      },
      {
        id: "sv-m2",
        title: "Evaluación visual de la salud del suelo (Prueba de Campo)",
        duration: "3h",
        type: "practical",
        content: "Aprende a realizar un diagnóstico cualitativo rápido en campo sin necesidad de costosos equipos de laboratorio. 1) Prueba de la pala: extrae un cubo de tierra de 20x20 cm y observa la porosidad, el color oscuro (indicador de humus) y la estructura (si se desmorona en agregados redondeados como granola o está compactada). 2) Conteo de lombrices: más de 5 lombrices por palada indica excelente actividad biológica. 3) Prueba de olor: un suelo sano huele a bosque húmedo (geosmina); un suelo enfermo huele a podrido o carece de olor. 4) Prueba de estabilidad de agregados en agua (Slake Test) para medir la resistencia a la erosión hídrica."
      },
      {
        id: "sv-m3",
        title: "Cuestionario: Fundamentos microbiológicos",
        duration: "2h",
        type: "quiz",
        content: "Pon a prueba tus conocimientos sobre la red trófica del suelo, las funciones del humus y los métodos de diagnóstico físico-químico rústicos.",
        quiz: {
          question: "¿Cuál es el principal motor biológico que alimenta a los microorganismos en la rizosfera?",
          options: [
            "Las lluvias y los minerales disueltos en el agua subterránea.",
            "Los exudados radiculares liberados por las raíces de las plantas durante la fotosíntesis.",
            "Las sales contenidas en los fertilizantes químicos tradicionales.",
            "La radiación ultravioleta directa sobre la superficie desprovista de cobertura."
          ],
          correctAnswer: 1
        }
      },
      {
        id: "sv-m4",
        title: "Plan de transición: de convencional a orgánico",
        duration: "4h",
        type: "practical",
        content: "Pasos prácticos para desintoxicar un terreno agrícola degradado por labranza pesada y agroquímicos. Paso 1: Establecer coberturas vegetales de leguminosas y gramíneas para reactivar la fotosíntesis continua. Paso 2: Reducir gradualmente el uso de nitrógeno soluble en un 30% anual aplicando simultáneamente compost o biofertilizante foliar. Paso 3: Eliminar el volteo profundo del suelo mediante el uso de arado de cincel o herramientas manuales como la laya de doble mango para mantener la estratificación natural de la microbiota."
      }
    ]
  },
  {
    id: "biofertilizantes",
    title: "Biofertilizantes y Caldos Minerales",
    description: "Crea tus propios bioinsumos líquidos y pastas protectoras de bajo costo utilizando recursos locales de tu finca.",
    extendedDescription: "Aprende a formular y fermentar caldos nutricionales y protectores. En este curso de carácter 100% práctico, te enseñamos paso a paso a elaborar recetas tradicionales como el caldo sulfocálcico, el súper magro y caldos fermentados anaeróbicos que devuelven la salud a tus cultivos por una fracción del costo comercial.",
    level: "Principiante",
    category: "Preparación de Bioinsumos",
    duration: "10 horas",
    lessonsCount: 3,
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    isPremium: false,
    author: "Dra. Elena Rivera - Investigadora de Agroecología Aplicada",
    modules: [
      {
        id: "bf-m1",
        title: "Fermentación anaeróbica: El Caldo Súper Magro",
        duration: "4h",
        type: "lecture",
        content: "El Caldo Súper Magro es un fertilizante orgánico líquido enriquecido con micronutrientes fermentado de forma anaeróbica (sin oxígeno). El núcleo base consiste en estiércol fresco de vaca, agua, melaza de caña (fuente de energía) y leche o suero (fuente de inóculo bacteriano de lactobacilos). A esta mezcla se le añaden paulatinamente sales minerales disueltas (sulfato de zinc, sulfato de cobre, sulfato de magnesio, bórax) que sufren un proceso de quelatación biológica, convirtiendo metales pesados en compuestos orgánicos altamente asimilables para las plantas. El sistema requiere una trampa de agua con una manguera conectada a la tapa del bidón para evacuar el dióxido de carbono y gas metano sin permitir la entrada de aire exterior."
      },
      {
        id: "bf-m2",
        title: "Cuestionario: Química orgánica de los caldos",
        duration: "2h",
        type: "quiz",
        content: "Evalúa los fundamentos físicos y biológicos de la fermentación y la preparación segura de bioinsumos.",
        quiz: {
          question: "¿Por qué es crucial el uso de una trampa de agua en el bidón de fermentación del Caldo Súper Magro?",
          options: [
            "Para evitar que el fertilizante se evapore por completo.",
            "Para permitir la salida segura de gases de fermentación (CO2) e impedir el ingreso de oxígeno que arruinaría la fermentación anaeróbica.",
            "Para filtrar el mal olor e introducir microorganismos del aire ambiente.",
            "Para acelerar el calentamiento térmico de la mezcla hasta los 70 grados centígrados."
          ],
          correctAnswer: 1
        }
      },
      {
        id: "bf-m3",
        title: "Elaboración de Caldo Sulfocálcico y Pasta Bordelesa",
        duration: "4h",
        type: "practical",
        content: "Guía práctica de cocción de azufre y cal para el control preventivo de ácaros y hongos fitopatógenos (como cenicilla y roya). Receta: Hierve en un recipiente metálico (nunca de aluminio) 10 litros de agua limpia. Agrega lentamente 2 kg de azufre elemental molido mezclado previamente con 1 kg de cal viva o cal hidratada de alta pureza. Cocina a fuego fuerte durante 45 a 60 minutos agitando constantemente con un palo de madera, hasta que el líquido tome un color ámbar o 'ladrillo' intenso. Deja enfriar, filtra las impurezas y almacena en envases plásticos oscuros y herméticos. Se diluye entre el 1% y 2% para aplicaciones foliares preventivas."
      }
    ]
  },
  {
    id: "bokashi-avanzado",
    title: "Abonos Fermentados tipo Bokashi",
    description: "Domina el arte del compostaje rápido japonés modificado para climas tropicales y templados.",
    extendedDescription: "El Bokashi es una de las técnicas de reciclaje orgánico más rápidas del mundo, lista para usarse en menos de 15 días. Este curso avanzado profundiza en el control de temperatura, balance de carbono/nitrógeno e inoculación de levaduras y actinobacterias para producir un fertilizante sólido de la más alta calidad biológica.",
    level: "Intermedio",
    category: "Nutrición de Suelos",
    duration: "15 horas",
    lessonsCount: 3,
    image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    isPremium: true,
    author: "MSc. Kenji Takahashi - Agrónomo y Asesor de Permacultura",
    modules: [
      {
        id: "bk-m1",
        title: "La termofilia y microbiología del Bokashi",
        duration: "5h",
        type: "lecture",
        content: "A diferencia del compostaje tradicional que toma meses, el Bokashi se elabora en 12 a 15 días mediante un proceso fermentativo de alta temperatura controlado por volteos diarios. Los ingredientes básicos son: afrechillo o salvado de arroz (fuente de nitrógeno y vitaminas), cascarilla de arroz o carbón molido (fuente de silicio, aireación y retención de humedad), tierra común, estiércol, melaza y levadura de pan o microorganismos de montaña. Durante los primeros 3 días, las levaduras y bacterias ácido-lácticas metabolizan azúcares simples elevando la temperatura hasta los 65°C. Esto elimina patógenos y semillas de malezas. Los volteos diarios evitan que la temperatura supere los 75°C, lo que mataría a los microorganismos benéficos y causaría pérdida de nitrógeno por volatilización."
      },
      {
        id: "bk-m2",
        title: "Cálculo de Relación Carbono:Nitrógeno (C:N)",
        duration: "4h",
        type: "practical",
        content: "Para un Bokashi perfecto, la relación ideal C:N debe rondar entre 25:1 y 30:1 al inicio del proceso. Si hay demasiado nitrógeno (ej. exceso de estiércol fresco u orina), la pila olerá a amoníaco y se perderán nutrientes valiosos en forma de gas. Si hay demasiado carbono (ej. exceso de paja seca o aserrín viejo de madera), el proceso se ralentizará enormemente y no alcanzará las temperaturas sanitizantes deseadas. Aprende a equilibrar tu pila combinando fuentes verdes húmedas con fuentes cafés secas mediante la prueba empírica del puño: al apretar fuertemente un puñado de la mezcla terminada, no debe gotear agua entre los dedos, pero al abrir la mano la mezcla debe mantener su cohesión sin desmoronarse."
      },
      {
        id: "bk-m3",
        title: "Cuestionario de Control de Temperatura",
        duration: "6h",
        type: "quiz",
        content: "Examen sobre termorregulación, corrección de desviaciones anaeróbicas y estabilización del abono fermentado.",
        quiz: {
          question: "¿Cuál es la acción correctiva inmediata si la temperatura de tu pila de Bokashi supera los 70°C al cuarto día?",
          options: [
            "Agregar agua fría directamente sobre la pila sin moverla.",
            "Realizar un volteo inmediato de la pila para ventilar e irradiar el exceso de calor acumulado.",
            "Tapar herméticamente la pila con plástico negro para asfixiar los microorganismos.",
            "Agregar más estiércol de ave fresco para estabilizar el ph."
          ],
          correctAnswer: 1
        }
      }
    ]
  }
];

export function getCourseById(id: string): Course | undefined {
  return COURSES.find(c => c.id === id);
}
