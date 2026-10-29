import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const resolve = createRequire(path.join(root, 'package.json')).resolve;
export default {
  root,
  cacheDir: path.join(root, '.ci/cabinet-network-read/proof/.vite-cache'),
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', include: ['.ci/cabinet-network-read/Network.read.test.tsx'] },
  resolve: { alias: [
    { find: '@', replacement: path.join(root, 'src') },
    ...['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client', 'react-dom/test-utils', 'react-router-dom', 'react-router', 'lucide-react'].map(name => ({ find: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), replacement: resolve(name) })),
    { find: /^vitest$/, replacement: path.join(root, '.ci/cabinet-network-read/node_modules/vitest/dist/index.js') },
  ] },
};
