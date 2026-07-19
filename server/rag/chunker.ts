import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { RagChunk } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { COURSES } from '../../src/data/courses/index';
import { COURSES32 } from '../../src/data/courses32';
import { BIBLIOTECA } from '../../src/data/biblioteca/index';
import { GLOSARIO } from '../../src/data/herramientas';
import { RECETAS } from '../../src/data/herramientas';
import { MITOS, PILARES, HERO } from '../../src/data/inicio';
import { COMMUNITY_POSTS } from '../../src/data/comunidad';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function chunkText(text: string, maxLen = 600): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = '';
  for (const s of sentences) {
    if ((current + ' ' + s).length > maxLen && current.length > 0) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += (current ? ' ' : '') + s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function buildChunks(items: RagChunk[]): RagChunk[] {
  const result: RagChunk[] = [];
  for (const item of items) {
    const parts = chunkText(item.text);
    if (parts.length === 1) {
      result.push(item);
    } else {
      for (let i = 0; i < parts.length; i++) {
        result.push({ ...item, id: `${item.id}__p${i}`, text: parts[i] });
      }
    }
  }
  return result;
}

export function chunkAllContent(): RagChunk[] {
  const chunks: RagChunk[] = [];

  for (const c of COURSES) {
    chunks.push({
      id: `course__${c.id}`,
      text: `${c.title}. ${c.description} ${c.extendedDescription || ''}`,
      source: c.id,
      sourceType: 'course',
      title: c.title,
      tags: [c.category, c.level],
      metadata: { duracion: c.duration, autor: c.author },
    });
    for (const m of c.modules) {
      chunks.push({
        id: `course__${c.id}__${m.id}`,
        text: `${m.title}. ${m.content}`,
        source: c.id,
        sourceType: 'course',
        title: `${c.title} — ${m.title}`,
        tags: [c.category, c.level, m.type],
        metadata: { duracion: m.duration, tipo: m.type },
      });
    }
  }

  for (const c of COURSES32) {
    const qTexts = c.questions.map(q => `P: ${q.q} R: ${q.a}`).join(' ');
    chunks.push({
      id: `course32__${c.id}`,
      text: `${c.title}. ${c.objective} ${qTexts}`,
      source: c.id,
      sourceType: 'course32',
      title: c.title,
      tags: ['modelo-utopia'],
      metadata: { numero: String(c.number) },
    });
    if (c.studyContent) {
      for (const sc of c.studyContent) {
        chunks.push({
          id: `course32__${c.id}__${slugify(sc.topic)}`,
          text: `${sc.topic}: ${sc.subtitle}. ${sc.body}${sc.farmerNote ? ' Nota: ' + sc.farmerNote : ''}`,
          source: c.id,
          sourceType: 'course32',
          title: `${c.title} — ${sc.topic}`,
          tags: ['modelo-utopia'],
          metadata: { topic: sc.topic },
        });
      }
    }
  }

  for (const d of BIBLIOTECA) {
    chunks.push({
      id: `bib__${d.id}`,
      text: `${d.title}. ${d.description} ${d.fullText}`,
      source: d.id,
      sourceType: 'biblioteca',
      title: d.title,
      tags: d.tags,
      metadata: { categoria: d.category, dificultad: d.difficulty, autor: d.author },
    });
  }

  for (const g of GLOSARIO) {
    chunks.push({
      id: `glos__${slugify(g.termino)}`,
      text: `${g.termino}: ${g.definicion}`,
      source: g.termino,
      sourceType: 'glosario',
      title: g.termino,
      tags: ['glosario'],
      metadata: {},
    });
  }

  for (const r of RECETAS) {
    chunks.push({
      id: `rec__${r.id}`,
      text: `${r.titulo}. ${r.descripcion}. Ingredientes: ${r.ingredientes.join(', ')}. Pasos: ${r.pasos.join(' ')}. Tiempo: ${r.tiempo}.`,
      source: r.id,
      sourceType: 'receta',
      title: r.titulo,
      tags: [r.categoria],
      metadata: { tiempo: r.tiempo },
    });
  }

  for (const m of MITOS) {
    chunks.push({
      id: `mito__${m.id}`,
      text: `${m.titulo}. Mito: ${m.mito}. Realidad: ${m.realidad}. Evidencia: ${m.evidencia}. Accion: ${m.accion}.`,
      source: m.id,
      sourceType: 'mito',
      title: m.titulo,
      tags: ['mito'],
      metadata: {},
    });
  }

  for (const p of PILARES) {
    chunks.push({
      id: `pilar__${p.id}`,
      text: `${p.titulo}: ${p.subtitulo}. ${p.descripcion}. Temas: ${p.temas.join(', ')}.`,
      source: p.id,
      sourceType: 'pilar',
      title: p.titulo,
      tags: ['pilar'],
      metadata: {},
    });
  }

  for (const p of COMMUNITY_POSTS) {
    const repliesText = p.replies.map(r => r.content).join(' ');
    chunks.push({
      id: `qa__${p.id}`,
      text: `${p.title}. ${p.content} ${repliesText}`,
      source: p.id,
      sourceType: 'comunidad',
      title: p.title,
      tags: [p.category, 'comunidad'],
      metadata: { author: p.author, category: p.category },
    });
  }

  // load auto-learned QA from rag_data/auto-learned.json
  const autoLearnedPath = path.resolve(__dirname, '../../rag_data/auto-learned.json');
  if (fs.existsSync(autoLearnedPath)) {
    try {
      const raw = fs.readFileSync(autoLearnedPath, 'utf-8');
      const learnedEntries = JSON.parse(raw) as { id: string; question: string; answer: string; intent?: string; timestamp: number }[];
      for (const entry of learnedEntries) {
        chunks.push({
          id: `auto__${entry.id}`,
          text: `${entry.question}. ${entry.answer}`,
          source: entry.id,
          sourceType: 'aprendido',
          title: entry.question,
          tags: ['aprendido', entry.intent || 'qa'],
          metadata: { intent: entry.intent || 'qa' },
        });
      }
      console.log(`[RAG] Loaded ${learnedEntries.length} auto-learned Q&A entries.`);
    } catch (err) {
      console.warn('[RAG] Error loading auto-learned Q&A:', err);
    }
  }

  chunks.push({
    id: 'hero',
    text: `${HERO.titulo}. ${HERO.subtitulo}. ${HERO.descripcion}`,
    source: 'hero',
    sourceType: 'home',
    title: HERO.titulo,
    tags: ['inicio'],
    metadata: {},
  });

  return buildChunks(chunks);
}
