import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Dynamic import to avoid tsx module resolution issues at top level
  const { buildKnowledgeGraph } = await import('../src/core/knowledge/graph');
  const graph = buildKnowledgeGraph();
  
  if (!graph || !graph.nodes || !graph.edges) {
    throw new Error('Grafo inválido');
  }

  const json = JSON.stringify(graph);
  const outPath = resolve(__dirname, '..', 'public', 'knowledge-graph.json');
  writeFileSync(outPath, json, 'utf-8');

  const size = (Buffer.byteLength(json) / 1024).toFixed(1);
  console.log(`[build-graph] Grafo generado: ${outPath} (${size} KB, ${graph.nodes.length} nodos, ${graph.edges.length} aristas)`);
}

main().catch(err => {
  console.error('[build-graph] Error:', err.message);
  process.exit(1);
});
