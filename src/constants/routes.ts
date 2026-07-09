export const ROUTES = {
  HOME: '/',
  CAMPUS: '/campus',
  ACADEMIA: '/academia',
  ACADEMIA_COURSE: (id: string) => `/academia/${id}`,
  BIBLIOTECA: '/biblioteca',
  BIBLIOTECA_DOC: (id: string) => `/biblioteca/${id}`,
  RECURSOS: '/recursos',
  COMUNIDAD: '/comunidad',
  INSTITUCIONES: '/instituciones',
  PERFIL: '/perfil',
  AI_READY: '/ai-ready',
} as const;
