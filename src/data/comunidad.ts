import type { CommunityPost } from '../types';
import { COMMUNITY_QA } from './comunidad-qa';
import { COMMUNITY_QA_2 } from './comunidad-qa2';
import { COMMUNITY_QA_3 } from './comunidad-qa3';
import { COMMUNITY_QA_4 } from './comunidad-qa4';
import { COMMUNITY_QA_5 } from './comunidad-qa5';
import { COMMUNITY_QA_6 } from './comunidad-qa6';
import { COMMUNITY_QA_7 } from './comunidad-qa7';
import { COMMUNITY_QA_8 } from './comunidad-qa8';
import { COMMUNITY_QA_9 } from './comunidad-qa9';
import { COMMUNITY_QA_10 } from './comunidad-qa10';
import { COMMUNITY_QA_11 } from './comunidad-qa11';
import { COMMUNITY_QA_12 } from './comunidad-qa12';

export const CATEGORIAS_COMUNIDAD = ["Plagas", "Suelos", "Bioinsumos", "Casos de Éxito", "Intercambio de Semillas"];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    title: "¿Cómo controlar la mosca blanca de forma 100% ecológica en tomates?",
    category: "Plagas",
    author: "Don Ramiro - Agricultor Familiar (Boyacá)",
    content: "Saludos compañeros de Agricultura Antigua. Tengo un pequeño invernadero de tomates cherry y en la última semana he tenido una invasión fuerte de mosca blanca en el envés de las hojas inferiores. He probado con té de ajo y ají, pero parece que vuelven al par de días. ¿Alguno me puede recomendar un protocolo más fuerte que no sea químico? ¡Muchas gracias!",
    date: "Ayer a las 18:23",
    likes: 24,
    replies: [
      {
        id: "rep-1",
        author: "Inge Alejandro Salazar",
        content: "Estimado Ramiro, el té de ajo y ají es un buen repelente, pero ante una plaga establecida necesitas una acción de contacto físico fuerte. Te sugiero aplicar jabón potásico al 1% combinado con aceite de neem. Esto disuelve la capa cerosa protectora de la mosca blanca y de sus huevos, ahogándolas de inmediato. Aplícalo estrictamente al atardecer para evitar quemaduras solares.",
        date: "Hace 15 horas"
      },
      {
        id: "rep-2",
        author: "Mariana G. - Huertera Urbana",
        content: "A mí me ha funcionado de maravilla colocar trampas cromáticas amarillas. Compras un plástico amarillo rígido, lo untas con aceite de cocina usado o vaselina, y lo cuelgas cerca de las plantas. Las moscas blancas son fuertemente atraídas por el color amarillo brillante, vuelan hacia él y se quedan pegadas. ¡Es súper barato y efectivo para bajar la población rápido!",
        date: "Hace 10 horas"
      }
    ]
  },
  {
    id: "post-2",
    title: "Éxito con Bokashi en Suelos Arcillosos Compactados",
    category: "Casos de Éxito",
    author: "Finca El Renacer (Ecuador)",
    content: "Queremos compartir nuestra alegría. Nuestro suelo es extremadamente arcilloso, casi greda de ladrillo, y con la sequía se agrietaba y compactaba como piedra. Empezamos a aplicar 500g de abono Bokashi por metro cuadrado directamente sobre las camas de cultivo, cubriéndolas con 10cm de paja de trigo. En solo 6 meses, el suelo ha cambiado de color, está suave, retiene la humedad y las raíces de nuestras hortalizas se desarrollan el doble de rápido. ¡La microbiología funciona de verdad!",
    date: "Hace 3 días",
    likes: 42,
    replies: [
      {
        id: "rep-3",
        author: "MSc. Kenji Takahashi",
        content: "¡Excelente reporte! El Bokashi aporta ácidos húmicos y fúlvicos cargados negativamente que flocularán las arcillas compactadas, abriendo canales microscópicos para el agua y el aire. El mulching (paja) evita que el sol incida de manera directa evaporando la humedad y matando las micorrizas. ¡Sigan adelante!",
        date: "Hace 2 días"
      }
    ]
  },
  ...COMMUNITY_QA,
  ...COMMUNITY_QA_2,
  ...COMMUNITY_QA_3,
  ...COMMUNITY_QA_4,
  ...COMMUNITY_QA_5,
  ...COMMUNITY_QA_6,
  ...COMMUNITY_QA_7,
  ...COMMUNITY_QA_8,
  ...COMMUNITY_QA_9,
  ...COMMUNITY_QA_10,
  ...COMMUNITY_QA_11,
  ...COMMUNITY_QA_12
];
