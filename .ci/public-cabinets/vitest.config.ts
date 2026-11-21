import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rootRequire = createRequire(path.join(root, 'package.json'));
const tools = process.env.PUBLIC_CABINETS_TOOLS_DIR || path.join(root, '.ci/public-cabinets/node_modules');
export default {
  root,
  cacheDir: path.join(root, 'proof/.vite-cache'),
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', include: ['.ci/public-cabinets/Projets.fiabilite.test.tsx'] },
  resolve: { alias: [
    { find: '@', replacement: path.join(root, 'src') },
    ...['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client'].map(name => ({ find: new RegExp('^' + name + '$'), replacement: rootRequire.resolve(name) })),
    { find: /^vitest$/, replacement: path.join(tools, 'vitest/dist/index.js') },
  ] },
};
