import { chunkAllContent } from './chunker';
import { indexChunks, getCollectionStats } from './chroma';

export async function runIndexer(): Promise<{ chunks: number; indexed: number }> {
  console.log('[RAG] Chunking all content...');
  const chunks = chunkAllContent();
  console.log(`[RAG] Generated ${chunks.length} chunks. Indexing...`);

  const indexed = await indexChunks(chunks);
  const stats = await getCollectionStats();

  console.log(`[RAG] Done. ${stats.count} vectors in collection "${stats.name}".`);
  return { chunks: chunks.length, indexed };
}


