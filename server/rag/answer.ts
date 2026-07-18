import { GoogleGenAI } from '@google/genai';
import { searchChunks } from './chroma';
import { compress, getLegend } from './sfc';

export interface RagAnswerResult {
  answer: string;
  sources: { title: string; source: string; sourceType: string; score: number }[];
  chunksUsed: number;
}

export async function generateAnswer(query: string, topK = 5): Promise<RagAnswerResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const noApiKey = !apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '';

  const results = await searchChunks(query, topK);
  if (results.length === 0) {
    return { answer: 'No encontré información relevante para tu consulta en la base de conocimiento.', sources: [], chunksUsed: 0 };
  }

  if (noApiKey) {
    console.warn('[RAG] GEMINI_API_KEY no configurada, usando fallback local');
    const isDev = process.env.NODE_ENV === 'development';
    const footer = isDev
      ? '\n\n_Para respuestas con IA, configura GEMINI_API_KEY en el archivo .env._'
      : '\n\n_Puedes seguir explorando los recursos completos en las secciones del sitio._';
    const answer = `*Modo sin conexión — usando base de conocimiento local:*\n\n${results.map(r => `**${r.title}** — ${r.text.slice(0, 400)}`).join('\n\n')}${footer}`;
    const sources = results.map(r => ({ title: r.title, source: r.source, sourceType: r.sourceType, score: Math.round(r.score * 1000) / 1000 }));
    return { answer, sources, chunksUsed: results.length };
  }

  const compressedContext = results.map(r => compress(r.text)).join('\n\n---\n\n');
  const legend = getLegend();

  const prompt = `Eres un asistente experto en agricultura sostenible para pequeños productores. Responde la pregunta del usuario usando SOLO el contexto proporcionado.

## Contexto comprimido (formato SFC)
${compressedContext}

## Leyenda SFC
${legend}

## Pregunta
${query}

## Instrucciones
- Responde en español, claro, práctico y cálido como un agricultor experto.
- Usa ÚNICAMENTE la información del contexto para responder.
- Si el contexto no contiene suficiente información, di: "No tengo información suficiente sobre eso en mi base de conocimiento."
- No inventes datos, cifras ni recomendaciones.
- Máximo 3 párrafos.
- Cita las fuentes al final usando el formato: [1], [2], etc. según el orden del contexto.

## Ejemplos de respuestas correctas
Ejemplo 1:
Pregunta: ¿Cómo mejoro el pH de mi suelo?
Respuesta: Puedes aplicar cal agrícola (carbonato de calcio) si tu suelo es ácido, o azufre elemental si es alcalino. La dosis exacta depende del tipo de suelo y del pH actual, que debe medirse con un análisis previo. [1]

Ejemplo 2:
Pregunta: ¿Qué es el Trichoderma?
Respuesta: Trichoderma es un hongo benéfico del suelo que controla patógenos como Fusarium y Rhizoctonia mediante micoparasitismo: se enreda en las hifas del hongo dañino, secreta enzimas que disuelven su pared celular y lo destruye. También estimula el crecimiento radicular. [2]`;

  let answer: string;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    answer = (response as any).text || 'Lo siento, no pude generar una respuesta en este momento.';
  } catch (err) {
    console.warn('[RAG] Gemini falló, usando fallback local:', (err as Error)?.message);
    const isDev = process.env.NODE_ENV === 'development';
    const footer = isDev
      ? '\n\n_Para respuestas con IA, configura GEMINI_API_KEY en el archivo .env._'
      : '\n\n_Puedes explorar los recursos completos en las secciones del sitio._';
    answer = `*El asistente IA no está disponible en este momento, pero encontré información relevante en mi base de conocimiento:*\n\n${results.map(r => `**${r.title}** — ${r.text.slice(0, 400)}`).join('\n\n')}${footer}`;
  }

  const sources = results.map(r => ({
    title: r.title,
    source: r.source,
    sourceType: r.sourceType,
    score: Math.round(r.score * 1000) / 1000,
  }));

  return { answer, sources, chunksUsed: results.length };
}
