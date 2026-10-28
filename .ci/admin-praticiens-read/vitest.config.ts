import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(root, 'package.json'));
const toolModules = process.env.ADVISOR_TEST_TOOLS || path.join(root, '.ci/admin-praticiens-read/node_modules');
export default {
  root, cacheDir: path.join(root, 'proof/.vite-cache'), esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', include: ['.ci/admin-praticiens-read/*.test.tsx'] },
  resolve: { alias: [
    { find: '@', replacement: path.join(root, 'src') },
    ...['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client', 'react-dom/test-utils', 'react-router-dom', 'react-router', 'lucide-react'].map(name => ({ find: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), replacement: require.resolve(name) })),
    { find: /^vitest$/, replacement: path.join(toolModules, 'vitest/dist/index.js') },
  ] },
};
