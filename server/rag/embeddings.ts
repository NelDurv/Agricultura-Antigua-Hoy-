import { pipeline } from '@xenova/transformers';

let embedPipe: any = null;

async function getPipe(): Promise<any> {
  if (!embedPipe) {
    embedPipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedPipe;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const pipe = await getPipe();
  const result = await pipe(text, { pooling: 'mean', normalize: true });
  const arr = Array.isArray(result) ? result[0] : result;
  return Array.from((arr as any).data || arr as number[]) as number[];
}
