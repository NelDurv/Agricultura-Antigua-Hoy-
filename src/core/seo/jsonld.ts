export interface JsonLdContext {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

interface JsonLdWebSite extends JsonLdContext {
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  inLanguage: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

interface JsonLdOrganization extends JsonLdContext {
  '@type': 'Organization';
  name: string;
  description: string;
  url: string;
  logo: string;
  foundingDate: string;
  knowsAbout: string[];
}

interface JsonLdCourse extends JsonLdContext {
  '@type': 'Course';
  name: string;
  description: string;
  provider: { '@type': 'Organization'; name: string };
  educationalLevel: string;
  timeRequired: string;
  hasCourseInstance: {
    '@type': 'CourseInstance';
    courseMode: string;
    inLanguage: string;
  };
}

interface JsonLdArticle extends JsonLdContext {
  '@type': 'Article';
  headline: string;
  description: string;
  author: { '@type': 'Person'; name: string } | { '@type': 'Organization'; name: string };
  datePublished: string;
  inLanguage: string;
  publisher: { '@type': 'Organization'; name: string };
}

interface JsonLdRecipe extends JsonLdContext {
  '@type': 'Recipe';
  name: string;
  description: string;
  recipeIngredient: string[];
  recipeInstructions: { '@type': 'HowToStep'; text: string }[];
  totalTime: string;
  author: { '@type': 'Organization'; name: string };
}

interface JsonLdBreadcrumbList extends JsonLdContext {
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[];
}

interface JsonLdWebPage extends JsonLdContext {
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf: { '@type': 'WebSite'; name: string; url: string };
}

type JsonLdObject =
  | JsonLdWebSite
  | JsonLdOrganization
  | JsonLdCourse
  | JsonLdArticle
  | JsonLdRecipe
  | JsonLdBreadcrumbList
  | JsonLdWebPage
  | JsonLdContext;

const BASE_URL = 'https://agriculturaantigua.com';
const ORG_NAME = 'Agricultura Antigua';
const ORG_DESC = 'Campus digital y base de conocimientos de agricultura sostenible para pequeños productores y capacitadores.';

export function website(): JsonLdWebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Agricultura Antigua — Campus Agroecológico',
    url: BASE_URL,
    description: ORG_DESC,
    inLanguage: 'es',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/buscar?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organization(): JsonLdOrganization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    description: ORG_DESC,
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    foundingDate: '2023',
    knowsAbout: [
      'Agricultura sostenible',
      'Agroecología',
      'Suelos',
      'Bioinsumos',
      'Agricultura orgánica',
      'Compostaje',
      'Microbiología de suelos',
    ],
  };
}

export function course(data: {
  name: string;
  description: string;
  level: string;
  duration: string;
  about?: string[];
}): JsonLdCourse {
  const levelMap: Record<string, string> = {
    Principiante: 'Beginner',
    Intermedio: 'Intermediate',
    Avanzado: 'Advanced',
  };
  const obj: JsonLdCourse = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: data.name,
    description: data.description,
    provider: { '@type': 'Organization', name: ORG_NAME },
    educationalLevel: levelMap[data.level] || 'Beginner',
    timeRequired: data.duration,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      inLanguage: 'es',
    },
  };
  if (data.about?.length) obj.about = data.about.map((uri) => ({ '@id': uri }));
  return obj;
}

export function article(data: {
  headline: string;
  description: string;
  author: string;
  date: string;
  about?: string[];
}): JsonLdArticle {
  const obj: JsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    author: { '@type': 'Person', name: data.author },
    datePublished: data.date,
    inLanguage: 'es',
    publisher: { '@type': 'Organization', name: ORG_NAME },
  };
  if (data.about?.length) obj.about = data.about.map((uri) => ({ '@id': uri }));
  return obj;
}

export function recipe(data: {
  name: string;
  description: string;
  ingredientes: string[];
  pasos: string[];
  tiempo: string;
}): JsonLdRecipe {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: data.name,
    description: data.description,
    recipeIngredient: data.ingredientes,
    recipeInstructions: data.pasos.map((text) => ({
      '@type': 'HowToStep',
      text,
    })),
    totalTime: data.tiempo,
    author: { '@type': 'Organization', name: ORG_NAME },
  };
}

export function breadcrumbList(items: { name: string; url?: string }[]): JsonLdBreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: `${BASE_URL}${item.url}` } : {}),
    })),
  };
}

export function webPage(data: {
  name: string;
  description: string;
  url: string;
}): JsonLdWebPage {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.name,
    description: data.description,
    url: `${BASE_URL}${data.url}`,
    inLanguage: 'es',
    isPartOf: { '@type': 'WebSite', name: 'Agricultura Antigua', url: BASE_URL },
  };
}

export function toJsonLdScript(obj: JsonLdObject): string {
  return JSON.stringify(obj, null, 2);
}
