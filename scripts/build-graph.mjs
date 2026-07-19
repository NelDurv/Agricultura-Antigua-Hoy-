import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Use tsx to evaluate the TypeScript module that builds + serializes the graph
const code = `
const { buildKnowledgeGraph } = require('./src/core/knowledge/graph');
const graph = buildKnowledgeGraph();
console.log(JSON.stringify(graph));
`;

try {
  const output = execSync(`npx tsx -e "${code.replace(/"/g, '\\"')}"`, {
    cwd: root,
    encoding: 'utf-8',
    timeout: 30000,
  });

  const json = output.trim();
  JSON.parse(json); // validate

  const outPath = resolve(root, 'public', 'knowledge-graph.json');
  writeFileSync(outPath, json, 'utf-8');

  const size = (Buffer.byteLength(json) / 1024).toFixed(1);
  console.log(`[build-graph] Grafo generado: ${outPath} (${size} KB)`);
} catch (err) {
  console.error('[build-graph] Error:', err.message);
  process.exit(1);
}
