import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rootRequire = createRequire(path.join(projectRoot, 'package.json'));
const toolModules = process.env.TOULOUSE_INTEREST_TOOLS_DIR || path.join(projectRoot, '.ci/toulouse-interest-receipts/node_modules');

export default {
  root: projectRoot,
  cacheDir: path.join(projectRoot, 'proof/.vite-cache'),
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', include: ['.ci/toulouse-interest-receipts/Toulouse.recu.test.tsx'] },
  resolve: { alias: [
    { find: '@', replacement: path.join(projectRoot, 'src') },
    ...['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client', 'react-dom/test-utils', 'react-router-dom', 'react-router', 'lucide-react', 'sonner', '@radix-ui/react-slot', '@radix-ui/react-select', '@radix-ui/react-tabs'].map(name => ({ find: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), replacement: rootRequire.resolve(name) })),
    { find: /^vitest$/, replacement: path.join(toolModules, 'vitest/dist/index.js') },
  ] },
};
