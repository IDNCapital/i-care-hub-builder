import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rootRequire = createRequire(path.join(projectRoot, 'package.json'));
const toolModules = process.env.PUBLIC_PROFESSIONALS_TOOLS_DIR || path.join(projectRoot, '.ci/investor-access/node_modules');

export default {
  root: projectRoot,
  cacheDir: path.join(projectRoot, 'proof/.vite-cache'),
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', include: ['.ci/investor-access/*.acces.test.tsx'] },
  resolve: { alias: [
    { find: /^sonner$/, replacement: rootRequire.resolve('sonner') },
    { find: '@', replacement: path.join(projectRoot, 'src') },
    ...['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client', 'react-dom/test-utils', 'react-router-dom', 'react-router', '@tanstack/react-query', '@tanstack/query-core', 'lucide-react', '@radix-ui/react-slot', '@radix-ui/react-dialog'].map(name => ({ find: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), replacement: rootRequire.resolve(name) })),
    { find: /^vitest$/, replacement: path.join(toolModules, 'vitest/dist/index.js') },
  ] },
};
