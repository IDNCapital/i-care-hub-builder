import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rootRequire = createRequire(path.join(projectRoot, 'package.json'));
const toolModules = process.env.PUBLIC_AVIS_TOOLS_DIR || path.join(projectRoot, '.ci/public-specialty/node_modules');

export default {
  root: projectRoot,
  cacheDir: path.join(projectRoot, 'proof/.vite-cache'),
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', include: ['.ci/public-specialty/SpecialiteDetail.lecture.test.tsx'] },
  resolve: { dedupe: ['react', 'react-dom'], alias: [
    ...(process.env.PUBLIC_SPECIALTY_HOOKS_DIR ? ['useSpecialites', 'usePraticiensPublics'].map(name => ({ find: new RegExp('^@/hooks/' + name + '$'), replacement: path.join(process.env.PUBLIC_SPECIALTY_HOOKS_DIR!, name + '.ts') })) : []),
    { find: /^react-router-dom$/, replacement: rootRequire.resolve('react-router-dom') },
    { find: '@', replacement: path.join(projectRoot, 'src') },
    ...['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client', 'react-dom/test-utils'].map(name => ({ find: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), replacement: rootRequire.resolve(name) })),
    { find: /^vitest$/, replacement: path.join(toolModules, 'vitest/dist/index.js') },
  ] },
};
