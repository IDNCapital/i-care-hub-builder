import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rootRequire = createRequire(path.join(projectRoot, 'package.json'));
const toolModules = process.env.INVESTOR_INTEREST_TOOLS_DIR || path.join(projectRoot, '.ci/investor-interest/node_modules');

export default {
  root: projectRoot,
  cacheDir: path.join(projectRoot, 'proof/.vite-cache'),
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', include: ['.ci/investor-interest/InvestisseurInteret.recu.test.tsx'] },
  resolve: { alias: [
    { find: '@', replacement: path.join(projectRoot, 'src') },
    ...['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client', 'react-dom/test-utils','react-router-dom','react-i18next','sonner'].map(name => ({ find: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), replacement: rootRequire.resolve(name) })),
    { find: /^vitest$/, replacement: path.join(toolModules, 'vitest/dist/index.js') },
  ] },
};
