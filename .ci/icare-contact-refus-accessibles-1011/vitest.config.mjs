import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import crypto from 'node:crypto';
const q=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(q,'../..'),app=createRequire(path.join(root,'package.json'));
const empty=path.join(q,'empty-env');if(fs.lstatSync(empty).isSymbolicLink()||fs.realpathSync(empty)!==empty||fs.readdirSync(empty).length)throw Error('ENV NON VIDE OU LIE');
const pins=JSON.parse(fs.readFileSync(path.join(q,'ACTIVE_PINS.json'),'utf8'));
for(const f of pins.files){const b=fs.readFileSync(path.join(root,f.path));if(b.length!==f.bytes||crypto.createHash('sha256').update(b).digest('hex')!==f.sha256)throw Error('PIN INVALIDE '+f.path);}
const exact=name=>new RegExp('^'+name+'$');
const packages=['react','react/jsx-runtime','react/jsx-dev-runtime','react-dom','react-dom/client','react-dom/test-utils','react-router-dom','react-router','react-i18next','i18next'];
const aliases=packages.map(name=>({find:exact(name),replacement:app.resolve(name)}));
aliases.unshift({find:/^react-i18next$/,replacement:path.join(root,'node_modules/react-i18next/dist/es/index.js')},{find:/^i18next$/,replacement:path.join(root,'node_modules/i18next/dist/esm/i18next.js')});
aliases.push({find:/^@testing-library\/react$/,replacement:path.join(q,'node_modules/@testing-library/react/dist/index.js')},{find:/^@testing-library\/dom$/,replacement:path.join(q,'node_modules/@testing-library/dom/dist/index.js')},{find:/^vitest$/,replacement:path.join(q,'node_modules/vitest/dist/index.js')},{find:/^@\/integrations\/supabase\/client$/,replacement:path.join(q,'ports.ts')},{find:/^@\/lib\/analytics$/,replacement:path.join(q,'ports.ts')},{find:/^sonner$/,replacement:path.join(q,'ports.ts')},{find:/^@\/components\/Layout$/,replacement:path.join(q,'layout.tsx')},{find:'@',replacement:path.join(root,'src')});
const allowed=new Set(pins.files.map(f=>path.join(root,f.path))),observed=new Set();
export default {root,envDir:empty,envPrefix:'IDN_CLOSED_UNUSED_',cacheDir:path.join(q,'cache/vite'),css:{postcss:{plugins:[]}},esbuild:{jsx:'automatic'},resolve:{alias:aliases,dedupe:['react','react-dom','react-router-dom','react-i18next','i18next']},plugins:[{name:'icare-contact-graph-closed',enforce:'pre',resolveId(id){if(/^@supabase\//.test(id)||/^https?:/.test(id))throw Error('IMPORT INTERDIT '+id);},load(id){const p=id.split('?')[0];if(p===path.join(root,'src/integrations/supabase/client.ts')||p===path.join(root,'src/lib/analytics.ts')||p.includes('/node_modules/@supabase/'))throw Error('PRODUCTEUR NATIF FERME');if(p.startsWith(root+'/src/')){if(!allowed.has(p))throw Error('SOURCE HORS GRAPHE '+p);observed.add(p);}},closeBundle(){fs.writeFileSync(path.join(q,'GRAPH_OBSERVED.json'),JSON.stringify([...observed],null,2)+'\n');}}],test:{include:['tests/advisor/Contact.refusApplicatifs.test.tsx'],setupFiles:[path.join(q,'closedEnvironment.ts')],environment:'jsdom',environmentOptions:{jsdom:{url:'https://fixture.invalid/contact'}},maxWorkers:1,minWorkers:1,fileParallelism:false,passWithNoTests:false,server:{deps:{inline:[/@testing-library\/react/,/@testing-library\/dom/]}}}};
