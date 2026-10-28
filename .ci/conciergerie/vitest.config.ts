import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rootRequire = createRequire(path.join(projectRoot, 'package.json'));
// Permet la verification locale avec les memes outils deja disponibles, sans installation.
const toolModules = process.env.CONCIERGERIE_TOOLS_DIR || path.join(projectRoot, '.ci/conciergerie/node_modules');

export default {
  root: projectRoot,
  cacheDir: path.join(projectRoot, 'proof/.vite-cache'),
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', include: ['src/pages/DecrireMonBesoin.fiabilite.test.tsx'] },
  resolve: { alias: [
    { find: '@', replacement: path.join(projectRoot, 'src') },
    ...['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client'].map(name => ({ find: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), replacement: rootRequire.resolve(name) })),
    { find: /^vitest$/, replacement: path.join(toolModules, 'vitest/dist/index.js') },
  ] },
};
