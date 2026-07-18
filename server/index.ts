import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from './swagger';
import { statusRouter } from './routes/status';
import { coursesRouter } from './routes/courses';
import { documentsRouter } from './routes/documents';
import { recipesRouter } from './routes/recipes';
import { campusRouter } from './routes/campus';
import { glossaryRouter } from './routes/glossary';
import { searchRouter } from './routes/search';
import { sitemapRouter } from './routes/sitemap';
import { agrovocRouter } from './routes/agrovoc';
import { aiManifestRouter } from './routes/aiManifest';
import { recommendRouter } from './routes/recommend';
import { ragRouter } from './routes/rag';

const app = express();
const PORT = parseInt(process.env.API_PORT || '3001', 10);

// Startup validation
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
  console.warn('⚠️  [RAG] GEMINI_API_KEY no detectada. El endpoint /api/rag/answer operará en modo fallback local.');
} else {
  console.log('✅ [RAG] Gemini API Key configurada. Respuestas con IA activadas.');
}

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET'],
  maxAge: 86400,
}));

app.use(express.json());

// Helmet — HTTP security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://*.unsplash.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'http://localhost:3000', 'http://localhost:3001'],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: { policy: 'credentialless' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// Permissions-Policy (Helmet no lo incluye por defecto)
app.use((_req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), screen-wake-lock=(), autoplay=(), fullscreen=(self)'
  );
  next();
});

// Rate limiting global: 100 requests / 15 min por IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones. Intenta de nuevo en 15 minutos.' },
});
app.use('/api', globalLimiter);

// Swagger UI — documentación interactiva de la API
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, {
  customSiteTitle: 'Agricultura Antigua API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Rate limiting específico para búsqueda: 20 requests / min por IP
const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas búsquedas. Espera un minuto antes de buscar de nuevo.' },
});
app.use('/api/search', searchLimiter);

app.use('/api', statusRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/campus', campusRouter);
app.use('/api/glossary', glossaryRouter);
app.use('/api/search', searchRouter);
app.use('/api/sitemap', sitemapRouter);
app.use('/api/agrovoc', agrovocRouter);
app.use('/api/ai-manifest', aiManifestRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/rag', ragRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Endpoint no encontrado. Consulta /api/status para ver los endpoints disponibles.' });
});

app.use((_err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`[API] Servidor REST corriendo en http://localhost:${PORT}/api`);
});
