import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

let dict: Record<string, Record<string, string>> | null = null;
let compressRules: { re: RegExp; to: string }[] | null = null;

function load(): Record<string, Record<string, string>> {
  if (!dict) {
    const path = join(process.cwd(), 'simbolos-sfc.json');
    dict = existsSync(path) ? JSON.parse(readFileSync(path, 'utf-8')) : {};
  }
  return dict;
}

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isAlpha(s: string): boolean {
  return /^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]+$/.test(s);
}

function wordPattern(text: string, forExpand = false): string {
  const e = esc(text);
  if (isAlpha(text)) return `\\b${e}\\b`;
  const startsWord = /^[a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ]/.test(text);
  const endsWord = /[a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ]$/.test(text);
  if (endsWord && !forExpand) return `\\b${e}\\b`;
  if (startsWord && endsWord) return `\\b${e}\\b`;
  return e;
}

function getCompressRules(): { re: RegExp; to: string }[] {
  if (compressRules) return compressRules;
  const d = load();
  const flat: { term: string; sym: string }[] = [];
  for (const cat of Object.keys(d))
    for (const [term, sym] of Object.entries(d[cat]))
      flat.push({ term, sym });
  flat.sort((a, b) => {
    const d = b.term.length - a.term.length;
    if (d !== 0) return d;
    return (b.term.match(/\s/g) || []).length - (a.term.match(/\s/g) || []).length;
  });
  const patterns = flat.map(f => wordPattern(f.term));
  const combinedRe = new RegExp(`(?:${patterns.join('|')})`, 'gi');
  compressRules = [{ re: combinedRe, to: '' }];
  const lookup: Record<string, string> = {};
  for (const f of flat) lookup[f.term.toLowerCase()] = f.sym;
  (compressRules as any).lookup = lookup;
  (compressRules as any).flat = flat;
  return compressRules;
}

export function compress(text: string): string {
  const rules = getCompressRules();
  const re = rules[0].re;
  const lookup: Record<string, string> = (rules as any).lookup;
  const flat: { term: string; sym: string }[] = (rules as any).flat;

  let result = '';
  let lastIndex = 0;

  re.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    result += text.slice(lastIndex, match.index);
    const matched = match[0];
    const key = matched.toLowerCase();
    // Find the original term to get the right symbol
    const found = flat.find(f => f.term.toLowerCase() === key);
    result += found ? found.sym : matched;
    lastIndex = re.lastIndex;
  }
  result += text.slice(lastIndex);
  return result.replace(/\s+/g, ' ').trim();
}

export function expand(text: string): string {
  const d = load();
  const flat: { sym: string; term: string }[] = [];
  for (const cat of Object.keys(d))
    for (const [term, sym] of Object.entries(d[cat]))
      flat.push({ sym, term });
  flat.sort((a, b) => b.sym.length - a.sym.length);

  const patterns = flat.map(f => wordPattern(f.sym, true));
  const combinedRe = new RegExp(`(?:${patterns.join('|')})`, 'g');

  const lookup: Record<string, string> = {};
  for (const f of flat) {
    if (!(f.sym in lookup)) lookup[f.sym] = f.term;
  }

  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = combinedRe.exec(text)) !== null) {
    result += text.slice(lastIndex, match.index);
    const matched = match[0];
    result += lookup[matched] || matched;
    lastIndex = combinedRe.lastIndex;
  }
  result += text.slice(lastIndex);
  return result;
}

export function getLegend(): string {
  const d = load();
  const prefixes: Record<string, string> = {
    cultivos: '@cultivo', variables: '%variable', unidades: 'unidad',
    relaciones: 'relación', suelos: '#suelo', practicas: '~practica',
    enfermedades_plagas: '!plaga/enf',
  };
  const lines = ['Formato SFC (Semantic Frame Compression):'];
  for (const [cat, entries] of Object.entries(d)) {
    const pfx = prefixes[cat] || cat;
    const list = Object.entries(entries);
    const sample = list.slice(0, 4).map(([k, v]) => `${k} → ${v}`).join(', ');
    lines.push(`  ${pfx}: ${sample}${list.length > 4 ? ` (+${list.length - 4})` : ''}`);
  }
  return lines.join('\n');
}

export function getCompressionRatio(text: string): number {
  if (!text) return 0;
  const c = compress(text);
  return text.length > 0 ? (text.length - c.length) / text.length : 0;
}
