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

  const prompt = `Eres un experto en agricultura antigua, sostenible y regenerativa. Responde la pregunta del usuario usando SOLO el contexto proporcionado.

## Contexto comprimido (formato SFC)
${compressedContext}

## Leyenda SFC
${legend}

## Pregunta
${query}

## Instrucciones
- Responde en español, de forma clara, educativa y cálida como un agricultor experto.
- Usa ÚNICAMENTE la información del contexto para responder.
- Si el contexto no contiene suficiente información, indícalo honestamente.
- No inventes datos, cifras ni recomendaciones.
- Máximo 3 párrafos.`;

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
