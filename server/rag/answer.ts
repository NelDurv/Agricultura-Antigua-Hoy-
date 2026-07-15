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
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
    throw new Error('GEMINI_API_KEY no configurada');
  }

  const results = await searchChunks(query, topK);
  if (results.length === 0) {
    return { answer: 'No encontré información relevante para tu consulta en la base de conocimiento.', sources: [], chunksUsed: 0 };
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

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const answer = (response as any).text || 'Lo siento, no pude generar una respuesta en este momento.';

  const sources = results.map(r => ({
    title: r.title,
    source: r.source,
    sourceType: r.sourceType,
    score: Math.round(r.score * 1000) / 1000,
  }));

  return { answer, sources, chunksUsed: results.length };
}
