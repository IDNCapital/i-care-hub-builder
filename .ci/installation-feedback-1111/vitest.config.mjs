import { fileURLToPath } from 'node:url';
const local = (file) => fileURLToPath(new URL(file, import.meta.url));
export default {
  root: local('../../'),
  envDir: local('./empty-env'),
  envPrefix: 'IDN_CLOSED_UNUSED_',
  cacheDir: local('./cache/vite'),
  css: { postcss: { plugins: [] } },
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      { find: /^@\/integrations\/supabase\/client$/, replacement: local('./ports.ts') },
      { find: /^@\/lib\/analytics$/, replacement: local('./ports.ts') },
      { find: /^@\/hooks\/useInstallation$/, replacement: local('./ports.ts') },
      { find: /^vitest$/, replacement: local('./node_modules/vitest/dist/index.js') },
      { find: /^@testing-library\/dom$/, replacement: local('./node_modules/@testing-library/dom/dist/index.js') },
      { find: '@', replacement: local('../../src') },
    ],
    dedupe: ['react', 'react-dom', 'react-router-dom', 'react-i18next', 'i18next'],
  },
  plugins: [{
    name: 'installation-ports-fermes',
    enforce: 'pre',
    load(id) {
      if (['/src/integrations/supabase/client.ts', '/src/lib/analytics.ts', '/src/hooks/useInstallation.ts', '/node_modules/@supabase/']
        .some((path) => id.includes(path))) throw new Error('Producteur réel interdit : ' + id);
    },
  }],
  test: {
    include: ['tests/advisor/FormulaireInteretInstallation.langue.test.tsx'],
    setupFiles: [local('./closedEnvironment.ts')],
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'https://fixture.invalid/installation' } },
    maxWorkers: 1,
  },
};
