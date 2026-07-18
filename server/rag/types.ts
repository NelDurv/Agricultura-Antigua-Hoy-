export interface RagChunk {
  id: string;
  text: string;
  source: string;
  sourceType: 'course' | 'course32' | 'biblioteca' | 'glosario' | 'receta' | 'mito' | 'pilar' | 'home' | 'comunidad';
  title: string;
  tags: string[];
  metadata: Record<string, string>;
}

export interface RagSearchResult {
  chunkId: string;
  text: string;
  source: string;
  sourceType: string;
  title: string;
  tags: string[];
  metadata: Record<string, string>;
  score: number;
}

export interface RagQuery {
  query: string;
  topK?: number;
  type?: string;
  tags?: string[];
}
