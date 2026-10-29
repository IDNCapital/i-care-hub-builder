import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, symlinkSync, rmSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const routeMap = `export const routeMap={fr:{},en:{}};export const localePath=()=>'/';export const getEquivalentPath=()=>null;`;
const ordinary = { app: 'const App=()=> <Routes><Route path="/page" element={<Content/>}/><Route path="/sortie" element={<Navigate to="/destination"/>}/></Routes>;', pre: 'const ROUTES=[{path:"/destination"}];const REDIRECTS=[];', map: routeMap, xml: '<urlset><url><loc>https://i-ca.re/destination</loc></url></urlset>' };

function run(change = {}) {
  const f = { ...ordinary, ...change };
  const dir = mkdtempSync(join(tmpdir(), 'concordance-read-'));
  try {
    for (const d of ['scripts','src/lib','public']) mkdirSync(join(dir,d), {recursive:true});
    symlinkSync(join(ROOT, 'node_modules'), join(dir, 'node_modules'), 'dir');
    copyFileSync(join(ROOT, 'scripts/checkRoutesConcordance.mjs'),join(dir,'scripts/checkRoutesConcordance.mjs'));
    writeFileSync(join(dir,'src/App.tsx'),f.app);
    writeFileSync(join(dir,'scripts/prerender.mjs'),f.pre);
    writeFileSync(join(dir,'src/lib/routes.ts'),f.map);
    writeFileSync(join(dir,'public/sitemap.xml'),f.xml);
    writeFileSync(join(dir,'public/robots.txt'),f.robots ?? 'User-agent: *\n');
    const r = spawnSync(process.execPath,[join(dir,'scripts/checkRoutesConcordance.mjs')],{cwd:dir,encoding:'utf8',timeout:10000,env:{PATH:process.env.PATH}});
    assert.ifError(r.error);
    return {status:r.status,stdout:r.stdout,stderr:r.stderr};
  } finally { rmSync(dir,{recursive:true,force:true}); }
}

test('causal: Navigate belongs only to its own adjacent Route',()=>{
  const r=run(); assert.equal(r.status,0,r.stderr);
  assert.match(r.stdout,/App 2 fixes dont 1 Navigate, 0 parametrees/);
  assert.match(r.stderr,/redirection cote client seulement, donc 404 pour un robot : \/sortie/);
  assert.doesNotMatch(r.stderr,/redirection cote client seulement, donc 404 pour un robot : \/page(?:\s|$)/);
});

test('causal: comments, newlines and single quotes keep the real prerender inventory',()=>{
  const r=run({app:'const App=()=> <Routes/>;',pre:"export const ROUTES /*format*/ =\n [ { path: '/destination', type: 'strategic' } ];\nconst REDIRECTS = [ ];",map:"export const routeMap={fr:{entry:'/destination'},en:{}};export const localePath=(lang,key)=>routeMap[lang][key];export const getEquivalentPath=()=>'/destination';"});
  assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/prerendu 1 \+ 0 redirections/);
  assert.doesNotMatch(r.stderr,/bascule de langue vers le vide/);
});

test('causal: missing declared inventory is unreadable rather than empty',()=>{
  const r=run({pre:'const SOMETHING_ELSE=[];',app:'const App=()=> <Routes/>;',xml:'<urlset></urlset>'});
  assert.equal(r.status,1);assert.match(r.stderr,/Lecture de prerender\.mjs non confirmee/);
});

test('empty literal inventories are known and accepted',()=>{
  const r=run({app:'const App=()=> <Routes/>;',pre:'const ROUTES=[];const REDIRECTS=[];',xml:'<urlset></urlset>'});
  assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/App 0 fixes dont 0 Navigate, 0 parametrees \| prerendu 0 \+ 0 redirections \| sitemap 0/);
});

test('English nesting is structural and leaves the following French Route outside',()=>{
  const r=run({app:'const App=()=> <Routes><Route path="/en/*" element={<LangSync><Routes><Route path="/" element={<Page/>}/><Route path="/office/:slug" element={<Page/>}/><Route path="/redirect" element={<Navigate to="/en"/>}/></Routes></LangSync>}/><Route path="/fr-page" element={<Page/>}/></Routes>;',pre:'const ROUTES=[];const REDIRECTS=[];',xml:'<urlset></urlset>'});
  assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/App 3 fixes dont 1 Navigate, 1 parametrees/);
  assert.match(r.stderr,/ : \/en(?:\s|$)/);assert.match(r.stderr,/ : \/en\/redirect/);assert.match(r.stderr,/ : \/fr-page/);
  assert.doesNotMatch(r.stderr,/\/en\/fr-page|\/en\/en/);
});

test('Route text in comments and strings is not a router declaration',()=>{
  const r=run({app:`const text='<Route path="/fake" element={<Navigate/>}/>'; /* <Route path="/comment"/> */ const App=()=> <Routes><Route path={'/real'} element={<Page/>}/></Routes>;`,pre:'const ROUTES=[];const REDIRECTS=[];',xml:'<urlset></urlset>'});
  assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/App 1 fixes dont 0 Navigate/);assert.doesNotMatch(r.stderr,/\/fake|\/comment/);
});

test('unreadable App syntax or computed path does not become a partial inventory',()=>{
  for(const app of ['const App=()=> <Routes><Route path="/broken"','const App=()=> <Routes><Route path={computedPath} element={<Page/>}/></Routes>;']) {
    const r=run({app});assert.equal(r.status,1);assert.match(r.stderr,/Lecture de App\.tsx non confirmee/);
  }
});

test('unsupported or malformed prerender rows never yield an apparently known subset',()=>{
  for(const pre of ['const ROUTES=[{path:"/known"},...later];const REDIRECTS=[];','const ROUTES=[{type:"strategic"}];const REDIRECTS=[];','const ROUTES=buildRoutes();const REDIRECTS=[];','const ROUTES=[{path:"/broken"};const REDIRECTS=[];']) {
    const r=run({pre});assert.equal(r.status,1);assert.match(r.stderr,/Lecture de prerender\.mjs non confirmee/);
  }
});

test('array property order, extra fields, parentheses and trailing commas remain readable',()=>{
  const r=run({pre:'const ROUTES=([{ type: "strategic", path: "/destination", other: callNotExecuted(), },]);const REDIRECTS=[{to:"/destination",from:"/sortie",},];'});
  assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/prerendu 1 \+ 1 redirections/);
  assert.doesNotMatch(r.stderr,/redirection cote client seulement/);
});

test('calculated language failures stay blocking and membership stays advisory',()=>{
  const r=run({map:"export const routeMap={fr:{known:'/known'},en:{}};export const localePath=()=>'/known';export const getEquivalentPath=()=>'/unserved';"});
  assert.equal(r.status,1);assert.match(r.stderr,/bascule de langue vers le vide/);assert.match(r.stderr,/BUILD FAILED/);
  const advisory=run();assert.equal(advisory.status,0);assert.match(advisory.stdout,/0 incoherence\(s\) bloquante\(s\)/);
});

test('declared differences and robots exemptions retain their separate meanings',()=>{
  const r=run({app:'const App=()=> <Routes><Route path="/admin" element={<Navigate/>}/><Route path="/hidden" element={<Navigate/>}/></Routes>;',pre:'const ROUTES=[];const REDIRECTS=[];',xml:'<urlset></urlset>',robots:'User-agent: *\nDisallow: /hidden/\n'});
  assert.equal(r.status,0,r.stderr);assert.doesNotMatch(r.stderr,/redirection cote client seulement/);
});

test('a sitemap with no readable root or malformed loc is unreadable rather than empty',()=>{
  for(const xml of ['<broken/>','<urlset><url><loc>https://i-ca.re/destination</url></urlset>']) {
    const r=run({xml});assert.equal(r.status,1);assert.match(r.stderr,/Lecture de sitemap\.xml non confirmee/);
  }
});

test('review delta: calculated Routes children cannot report a known empty inventory',()=>{
  for(const enfant of ['{makeRoutes()}','{ready && <Route path="/later"/>}','<GeneratedRoutes/>']) {
    const r=run({app:`const App=()=> <Routes>${enfant}</Routes>;`,pre:'const ROUTES=[];const REDIRECTS=[];',xml:'<urlset></urlset>'});
    assert.equal(r.status,1);assert.match(r.stderr,/Lecture de App\.tsx non confirmee : enfants de Routes non litteraux/);
  }
  const fragment=run({app:'const App=()=> <Routes><><Route path="/one" element={<Page/>}/></><React.Fragment><Route path="/two" element={<Page/>}/></React.Fragment></Routes>;'});
  assert.equal(fragment.status,0,fragment.stderr);assert.match(fragment.stdout,/App 2 fixes dont 0 Navigate/);
});

test('review delta: mutation and alias escape of a prerender array require qualification',()=>{
  for(const usage of ['ROUTES.push({path:"/destination"});','const alias=ROUTES;alias.push({path:"/destination"});','ROUTES[0]={path:"/destination"};','consume(ROUTES);','const box={ROUTES};']) {
    const r=run({app:'const App=()=> <Routes/>;',pre:`const ROUTES=[];${usage}const REDIRECTS=[];`,xml:'<urlset></urlset>'});
    assert.equal(r.status,1);assert.match(r.stderr,/Lecture de prerender\.mjs non confirmee : usage de ROUTES non qualifie/);
  }
  const consommateur=run({pre:'const ROUTES=[{path:"/destination"}];const copie=[...ROUTES];const REDIRECTS=[];for(const r of REDIRECTS) { void r; }'});
  assert.equal(consommateur.status,0,consommateur.stderr);assert.match(consommateur.stdout,/prerendu 1 \+ 0 redirections/);
});
