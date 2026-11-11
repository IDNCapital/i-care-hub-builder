import { defineConfig } from 'vitest/config';
import path from 'node:path';
const root = path.resolve(__dirname, '../..');
const runtime = process.env.ICARE_ANNUAIRE_RUNTIME;
const localReact = runtime ? [
  { find: 'react/jsx-runtime', replacement: path.join(runtime, 'react/jsx-runtime.js') },
  { find: 'react/jsx-dev-runtime', replacement: path.join(runtime, 'react/jsx-dev-runtime.js') },
  { find: 'react-dom/client', replacement: path.join(runtime, 'react-dom/client.js') },
  { find: 'react-dom', replacement: path.join(runtime, 'react-dom/index.js') },
  { find: 'react', replacement: path.join(runtime, 'react/index.js') },
  { find: '@tanstack/react-query', replacement: path.join(runtime, '@tanstack/react-query/build/modern/index.js') },
  { find: '@tanstack/query-core', replacement: path.join(runtime, '@tanstack/query-core/build/modern/index.js') },
  { find: 'react-router-dom', replacement: path.join(runtime, 'react-router-dom/dist/index.js') },
  { find: 'react-i18next', replacement: path.join(runtime, 'react-i18next/dist/es/index.js') },
  { find: 'i18next', replacement: path.join(runtime, 'i18next/dist/esm/i18next.js') },
  { find: 'lucide-react', replacement: path.join(runtime, 'lucide-react/dist/cjs/lucide-react.js') },
  { find: '@supabase/supabase-js', replacement: path.join(runtime, '@supabase/supabase-js/dist/index.mjs') },
] : [];
export default defineConfig({
  root, cacheDir: path.join(__dirname, '.cache'), esbuild: { jsx: 'automatic' },
  resolve: { alias: [...localReact,
    { find: '@/integrations/supabase/client', replacement: path.join(__dirname, 'client.ts') },
    { find: /^@\/components\/(Layout|SeoHead|CarteCabinetsSection|ui\/(button|input|sheet))$/, replacement: path.join(__dirname, 'ui.tsx') },
    { find: /^@\/assets\/.+$/, replacement: path.join(__dirname, 'asset.ts') },
    { find: '@', replacement: path.join(root, 'src') },
  ] },
  test: { environment: 'jsdom', include: ['.ci/icare-annuaire-transport-1635/Annuaire.transport.test.tsx'], maxWorkers: 1 },
});
