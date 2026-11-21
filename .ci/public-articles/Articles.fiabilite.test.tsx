import { act, StrictMode, useLayoutEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ArticlesIndex from '../../src/pages/ArticlesIndex';
import ArticleDetail from '../../src/pages/ArticleDetail';

type Reply = { data: unknown; error: unknown; count?: number | null; status?: number };
type Query = { table: string; columns: string; filters: unknown[][]; orders: unknown[][]; count?: string; single: boolean };
const h = vi.hoisted(() => ({ calls: [] as Query[], read: null as unknown as (q: Query) => Reply | Promise<Reply>, snapshots: [] as { path: string; body: string; canonical: string | null; title: string }[], forbidden: vi.fn(() => { throw new Error('Mutation interdite'); }) }));
// Seules les coques hors parcours et le SDK sont doubles, explicitement ici.
vi.mock('@/components/Header', () => ({ Header: () => <header>I-CA.RE</header> }));
vi.mock('@/components/Footer', () => ({ Footer: () => <footer>I-CA.RE, pied de page fictif</footer> }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { rpc: h.forbidden, functions: { invoke: h.forbidden }, from(table: string) {
  if (table !== 'articles') throw new Error('Source hors perimetre');
  const request: Query = { table, columns: '', filters: [], orders: [], single: false };
  const q = { select(columns: string, options?: { count?: string }) { request.columns = columns; request.count = options?.count; return q; }, eq(...args: unknown[]) { request.filters.push(args); return q; }, order(...args: unknown[]) { request.orders.push(args); return q; }, maybeSingle() { request.single = true; return q; }, insert: h.forbidden, update: h.forbidden, delete: h.forbidden, then(ok: (r: Reply) => unknown, ko?: (e: unknown) => unknown) { h.calls.push(structuredClone(request)); return Promise.resolve().then(() => h.read(request)).then(ok, ko); } }; return q;
} } }));
const article = (slug = 'alpha') => ({ slug, titre: `Article fictif ${slug}`, chapo: `Chapeau fictif ${slug}.`, contenu: `Texte **fictif** ${slug}.\n\n[Retour au catalogue](/patients/articles/)`, meta_title: `Titre éditorial ${slug}`, meta_description: `Description éditoriale ${slug}.`, published_at: '2026-04-01T00:00:00Z', updated_at: '2026-04-02T00:00:00Z' });
const ok = (data: unknown, count?: number): Reply => ({ data, error: null, count, status: 200 });
function normal(q: Query): Reply { return q.single ? ok(article(q.filters[0]?.[1] as string), 1) : ok([article()], 1); }
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }
let root: Root | undefined;
let locale: ReturnType<typeof createInstance>;
const body = () => document.body.textContent || '';
const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
const graphs = () => [...document.querySelectorAll('script[type="application/ld+json"]')].map(n => JSON.parse(n.textContent || '{}'));
function Probe() { const { pathname } = useLocation(); useLayoutEffect(() => { h.snapshots.push({ path: pathname, body: body(), canonical: canonical(), title: document.title }); }, [pathname]); return null; }
async function mount(path = '/patients/articles/alpha', strict = false) {
  const host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  const view = <I18nextProvider i18n={locale}><MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><nav><Link to="/patients/articles/alpha">Route A</Link><Link to="/patients/articles/beta">Route B</Link><Link to="/patients/articles">Catalogue</Link></nav><Routes><Route path="/patients/articles" element={<ArticlesIndex />} /><Route path="/patients/articles/:slug" element={<ArticleDetail />} /></Routes><Probe /></MemoryRouter></I18nextProvider>;
  await act(async () => root!.render(strict ? <StrictMode>{view}</StrictMode> : view));
}
async function go(text: string) { const link = [...document.querySelectorAll('a')].find(n => n.textContent === text)!; await act(async () => { link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); }); }
function ssrAlpha() { document.head.innerHTML = '<title>Titre SSR alpha</title><meta name="description" content="Résumé SSR alpha"><link rel="canonical" href="https://i-ca.re/patients/articles/alpha/">'; }
beforeEach(async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true); vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Reseau interdit'); }));
  h.calls = []; h.snapshots = []; h.read = normal; h.forbidden.mockClear();
  const error = console.error; vi.spyOn(console, 'error').mockImplementation((first, ...rest) => { if (!String(first).startsWith('404 Error:')) error(first, ...rest); });
  locale = createInstance(); await locale.init({ lng: 'fr', fallbackLng: 'fr', resources: { fr: { translation: { notFound: { title: 'Page introuvable', description: 'Cette page fictive est introuvable.', back: 'Retour à l’accueil' } } } }, initImmediate: false });
});
afterEach(async () => { if (root) await act(async () => root!.unmount()); root = undefined; expect(h.forbidden).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled(); document.body.innerHTML = ''; document.head.innerHTML = ''; vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('Articles recus ou inconnus, visite courante', () => {
  it('ne remplace pas le refus du catalogue par le vrai vide', async () => {
    h.read = () => ({ data: null, error: { message: 'refus fictif' }, count: null, status: 403 }); await mount('/patients/articles'); expect(body()).toContain("Le contenu n'a pas pu être chargé."); expect(body()).not.toContain('Nos premiers articles arrivent bientôt.');
  });
  it('ne publie pas ItemList vide pendant lattente', async () => {
    h.read = () => new Promise(() => {}); await mount('/patients/articles'); expect(graphs()).toHaveLength(0);
  });
  it('ne transforme pas une donnee catalogue absente en liste vide', async () => {
    h.read = () => ok(null, 0); await mount('/patients/articles'); expect(body()).toContain("Le contenu n'a pas pu être chargé."); expect(graphs()).toHaveLength(0);
  });
  it('nomme le catalogue tronque sans inventer une pagination', async () => {
    h.read = () => ok([article()], 2); await mount('/patients/articles'); expect(body()).toContain("Le contenu n'a pas pu être chargé."); expect(document.querySelector('article')).toBeNull(); expect(h.calls).toHaveLength(1);
  });
  it('ne classe pas une donnee article absente comme un vrai introuvable', async () => {
    h.read = () => ok(undefined); await mount(); expect(body()).toContain("Le contenu n'a pas pu être chargé."); expect(body()).not.toContain('404');
  });
  it('retire ancien article et canonical des le commit de navigation avant les effets', async () => {
    await mount(); expect(body()).toContain('Article fictif alpha'); h.read = () => new Promise(() => {}); await go('Route B');
    const frame = h.snapshots.find(s => s.path.endsWith('/beta'))!; expect(frame.body).not.toContain('Article fictif alpha'); expect(frame.canonical).not.toBe('https://i-ca.re/patients/articles/alpha/'); expect(frame.title).not.toBe('Titre éditorial alpha');
  });
  it('refuse un article recu pour un autre slug', async () => {
    h.read = () => ok(article('beta')); await mount(); expect(body()).toContain("Le contenu n'a pas pu être chargé."); expect(body()).not.toContain('Article fictif beta');
  });
  it.each(['attente', 'refus'])('conserve le head SSR courant au coldload en %s', async state => {
    ssrAlpha(); h.read = () => state === 'attente' ? new Promise(() => {}) : { data: null, error: { message: 'refus fictif' }, status: 403 }; await mount(); expect(document.title).toBe('Titre SSR alpha'); expect(canonical()).toBe('https://i-ca.re/patients/articles/alpha/'); expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Résumé SSR alpha'); expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });
  it('ecarte le head SSR du precedent article apres reception puis navigation', async () => {
    ssrAlpha(); await mount(); h.read = () => new Promise(() => {}); await go('Route B'); expect([...document.head.querySelectorAll('link[rel="canonical"]')].map(n => n.getAttribute('href'))).toEqual(['https://i-ca.re/patients/articles/beta/']); expect([...document.head.querySelectorAll('title')].some(n => n.textContent?.includes('alpha'))).toBe(false); expect(body()).not.toContain('Article fictif alpha');
  });
  it('ecarte un head SSR encore en attente quand la visite change', async () => {
    ssrAlpha(); h.read = () => new Promise(() => {}); await mount(); await go('Route B'); expect([...document.head.querySelectorAll('link[rel="canonical"]')].map(n => n.getAttribute('href'))).toEqual(['https://i-ca.re/patients/articles/beta/']); expect([...document.head.querySelectorAll('title')].some(n => n.textContent?.includes('alpha'))).toBe(false);
  });
  it('ecarte le head SSR de larticle quand le catalogue devient courant', async () => {
    ssrAlpha(); await mount(); await go('Catalogue'); expect([...document.head.querySelectorAll('link[rel="canonical"]')].map(n => n.getAttribute('href'))).toEqual(['https://i-ca.re/patients/articles/']); expect([...document.head.querySelectorAll('title')].some(n => n.textContent?.includes('alpha'))).toBe(false);
  });
  it.each(['rejet', 'compte-absent', 'ligne-malformee', 'doublon', 'statut'])('catalogue: garde une source inconnue %s sans ItemList', async kind => {
    h.read = () => kind === 'rejet' ? Promise.reject(new Error('transport fictif')) : kind === 'compte-absent' ? ok([article()]) : kind === 'ligne-malformee' ? ok([{ ...article(), titre: null }], 1) : kind === 'doublon' ? ok([article(), article()], 2) : { data: [article()], count: 1, error: null, status: 500 }; await mount('/patients/articles'); expect(body()).toContain("Le contenu n'a pas pu être chargé."); expect(body()).not.toContain('Nos premiers articles arrivent bientôt.'); expect(graphs()).toHaveLength(0);
  });
  it('catalogue: conserve le vrai vide, le CTA et le SEO statique', async () => {
    h.read = () => ok([], 0); await mount('/patients/articles'); expect(body()).toContain('Nos premiers articles arrivent bientôt.'); expect(document.querySelector('a[href="/patients/decrire-mon-besoin/"]')?.textContent).toBe('Décrire mon besoin'); expect(graphs()[0]['@graph'][1]).toEqual({ '@type': 'ItemList', itemListElement: [] }); expect(canonical()).toBe('https://i-ca.re/patients/articles/'); expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });
  it('catalogue: conserve projection, tri, cartes, dates, liens et ordre editorial recu', async () => {
    h.read = () => ok([article('beta'), article()], 2); await mount('/patients/articles'); expect(h.calls).toEqual([{ table: 'articles', columns: 'slug, titre, chapo, published_at', filters: [], orders: [['published_at', { ascending: false }]], count: 'exact', single: false }]); expect([...document.querySelectorAll('article h3 a')].map(n => [n.textContent, n.getAttribute('href')])).toEqual([['Article fictif beta', '/patients/articles/beta'], ['Article fictif alpha', '/patients/articles/alpha']]); expect(body()).toContain('1 avril 2026'); expect(graphs()[0]['@graph'][1].itemListElement).toEqual([{ '@type': 'ListItem', position: 1, name: 'Article fictif beta', url: 'https://i-ca.re/patients/articles/beta/' }, { '@type': 'ListItem', position: 2, name: 'Article fictif alpha', url: 'https://i-ca.re/patients/articles/alpha/' }]);
  });
  it('catalogue: propose une reprise explicite sans publier de resultat avant reception', async () => {
    h.read = () => ({ data: null, error: { message: 'refus fictif' }, status: 403 }); await mount('/patients/articles'); h.read = normal; await act(async () => document.querySelector('button')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))); expect(body()).toContain('Article fictif alpha'); expect(h.calls).toHaveLength(2); expect(graphs()).toHaveLength(1);
  });
  it.each(['rejet', 'objet', 'contenu', 'metadonnees', 'statut'])('article: garde une source inconnue %s sans faux introuvable', async kind => {
    h.read = () => kind === 'rejet' ? Promise.reject(new Error('transport fictif')) : kind === 'objet' ? ok({}) : kind === 'contenu' ? ok({ ...article(), contenu: null }) : kind === 'metadonnees' ? ok({ ...article(), meta_description: 4 }) : { data: article(), error: null, status: 206 }; await mount(); expect(body()).toContain("Le contenu n'a pas pu être chargé."); expect(body()).not.toContain('404'); expect(graphs()).toHaveLength(0);
  });
  it('article: reserve lintrouvable a null sans erreur et conserve son noindex', async () => {
    h.read = () => ok(null); await mount(); expect(document.querySelector('h1')?.textContent).toBe('404'); expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex'); expect(canonical()).toBe('https://i-ca.re/patients/articles/alpha/'); expect(graphs()).toHaveLength(0);
  });
  it('article: conserve Markdown, textes, CTA, dates, SEO et JSONLD confirmes', async () => {
    await mount(); expect(h.calls).toEqual([{ table: 'articles', columns: 'slug, titre, chapo, contenu, meta_title, meta_description, published_at, updated_at', filters: [['slug', 'alpha']], orders: [], single: true }]); expect(document.querySelector('h1')?.textContent).toBe('Article fictif alpha'); expect(document.querySelector('strong')?.textContent).toBe('fictif'); expect(body()).toContain('Publié le 1 avril 2026'); expect(document.querySelector('a[href="/patients/decrire-mon-besoin/"]')?.textContent).toBe('Décrire mon besoin'); expect(document.querySelector('a[href="/patients/articles/"]')).not.toBeNull(); expect(document.title).toBe('Titre éditorial alpha'); expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Description éditoriale alpha.'); expect(graphs()[0]['@graph'][0]).toEqual({ '@type': 'Article', headline: 'Article fictif alpha', description: 'Description éditoriale alpha.', datePublished: '2026-04-01T00:00:00Z', dateModified: '2026-04-02T00:00:00Z', author: { '@type': 'Organization', name: 'I-CA.RE', url: 'https://i-ca.re/' }, publisher: { '@type': 'Organization', name: 'I-CA.RE', url: 'https://i-ca.re/' }, mainEntityOfPage: 'https://i-ca.re/patients/articles/alpha/', url: 'https://i-ca.re/patients/articles/alpha/' });
  });
  it('article: conserve les replis editoriaux nulls et labsence de date', async () => {
    h.read = () => ok({ ...article(), meta_title: null, meta_description: null, published_at: null }); await mount(); expect(document.title).toBe('Article fictif alpha | I-CA.RE'); expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Chapeau fictif alpha.'); expect(body()).not.toContain('Publié le'); expect(graphs()[0]['@graph'][0].datePublished).toBeUndefined();
  });
  it('visite: un ancien catalogue ne remplace pas larticle courant apres demontage', async () => {
    const old = deferred<Reply>(); h.read = q => q.single ? normal(q) : old.promise; await mount('/patients/articles'); await go('Route B'); expect(body()).toContain('Article fictif beta'); await act(async () => old.resolve(ok([], 0))); expect(document.title).toBe('Titre éditorial beta'); expect(graphs()[0]['@graph'][0]['@type']).toBe('Article'); expect(body()).not.toContain('Nos premiers articles arrivent bientôt.');
  });
  it('visite: ignore un ancien article et son SEO en A B A', async () => {
    const old = deferred<Reply>(); let first = true; h.read = q => q.single && q.filters[0][1] === 'alpha' && first ? (first = false, old.promise) : normal(q); await mount(); await go('Route B'); expect(body()).toContain('Article fictif beta'); await go('Route A'); expect(body()).toContain('Article fictif alpha'); await act(async () => old.resolve(ok({ ...article(), titre: 'Ancien retour fictif' }))); expect(body()).not.toContain('Ancien retour fictif'); expect(document.title).toBe('Titre éditorial alpha'); expect(canonical()).toBe('https://i-ca.re/patients/articles/alpha/');
  });
  it('visite: ignore un ancien refus apres reception de la nouvelle fiche', async () => {
    const old = deferred<Reply>(); h.read = q => q.single && q.filters[0][1] === 'alpha' ? old.promise : normal(q); await mount(); await go('Route B'); await act(async () => old.resolve({ data: null, error: { message: 'ancien refus fictif' }, status: 403 })); expect(body()).toContain('Article fictif beta'); expect(body()).not.toContain("Le contenu n'a pas pu être chargé.");
  });
  it.each(['catalogue', 'article'])('visite: ignore un retour apres demontage de %s', async target => {
    const old = deferred<Reply>(); h.read = () => old.promise; await mount(target === 'catalogue' ? '/patients/articles' : '/patients/articles/alpha'); await act(async () => root!.unmount()); root = undefined; await act(async () => old.resolve(target === 'catalogue' ? ok([article()], 1) : ok(article()))); expect(graphs()).toHaveLength(0); expect(document.querySelector('h1')).toBeNull();
  });
  it.each(['catalogue', 'article'])('visite: garde la reception StrictMode de %s apres son premier effet annule', async target => {
    const old = deferred<Reply>(); let first = true; h.read = q => first ? (first = false, old.promise) : normal(q); await mount(target === 'catalogue' ? '/patients/articles' : '/patients/articles/alpha', true); expect(body()).toContain('Article fictif alpha'); await act(async () => old.resolve(ok(null))); expect(body()).toContain('Article fictif alpha'); expect(graphs()).toHaveLength(1);
  });
  it('SSR: preserve un noeud capture dont les attributs ont deja ete actualises', async () => {
    ssrAlpha(); h.read = () => new Promise(() => {}); await mount(); const captured = document.head.querySelector('link[rel="canonical"]')!; captured.setAttribute('href', 'https://i-ca.re/patients/articles/beta/'); await go('Route B'); expect(captured.parentNode).toBe(document.head); expect(captured.getAttribute('href')).toBe('https://i-ca.re/patients/articles/beta/'); expect([...document.head.querySelectorAll('link[rel="canonical"]')].every(n => n.getAttribute('href')?.endsWith('/beta/'))).toBe(true);
  });
  it('SSR: preserve scripts Organization, styles et viewport non attribuables a larticle', async () => {
    ssrAlpha(); const script = document.createElement('script'); script.type = 'application/ld+json'; script.textContent = '{"@type":"Organization","url":"https://i-ca.re/"}'; const style = document.createElement('style'); style.textContent = 'body { margin: 0; }'; const viewport = document.createElement('meta'); viewport.name = 'viewport'; viewport.content = 'width=device-width,initial-scale=1'; document.head.append(script, style, viewport); h.read = () => new Promise(() => {}); await mount(); await go('Route B'); expect(script.parentNode).toBe(document.head); expect(style.parentNode).toBe(document.head); expect(viewport.parentNode).toBe(document.head); expect(script.textContent).toBe('{"@type":"Organization","url":"https://i-ca.re/"}');
  });
  it('SSR: conserve le head courant en erreur StrictMode puis accepte la nouvelle reception', async () => {
    ssrAlpha(); h.read = () => ({ data: null, error: { message: 'refus fictif' }, status: 403 }); await mount('/patients/articles/alpha', true); expect(document.title).toBe('Titre SSR alpha'); expect(canonical()).toBe('https://i-ca.re/patients/articles/alpha/'); expect(document.head.querySelector('meta[name="robots"]')).toBeNull(); h.read = normal; await go('Route B'); expect(document.title).toBe('Titre éditorial beta'); expect(canonical()).toBe('https://i-ca.re/patients/articles/beta/'); expect([...document.head.querySelectorAll('title')].some(n => n.textContent?.includes('alpha'))).toBe(false);
  });
  it('SSR: passe de lattente nouvelle au recu puis revient sans ancien head', async () => {
    ssrAlpha(); await mount(); const pending = deferred<Reply>(); h.read = q => q.single && q.filters[0][1] === 'beta' ? pending.promise : normal(q); await go('Route B'); expect(canonical()).toBe('https://i-ca.re/patients/articles/beta/'); expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow'); await act(async () => pending.resolve(ok(article('beta')))); expect(document.title).toBe('Titre éditorial beta'); expect(document.head.querySelector('meta[name="robots"]')).toBeNull(); await go('Route A'); expect(document.title).toBe('Titre éditorial alpha'); expect([...document.head.querySelectorAll('link[rel="canonical"]')].map(n => n.getAttribute('href'))).toEqual(['https://i-ca.re/patients/articles/alpha/']);
  });
  it('SSR: borne le provisoire a une canonical initiale non correlee', async () => {
    ssrAlpha(); h.read = () => new Promise(() => {}); await mount('/patients/articles/beta'); expect(canonical()).toBe('https://i-ca.re/patients/articles/beta/'); expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow'); expect([...document.head.querySelectorAll('title')].some(n => n.textContent?.includes('alpha'))).toBe(false);
  });
  it.each(['attente', 'refus'])('SSR: preserve la canonical du catalogue courant en %s', async state => {
    document.head.innerHTML = '<link rel="canonical" href="https://i-ca.re/patients/articles/">'; const captured = document.head.querySelector('link')!; h.read = () => state === 'attente' ? new Promise(() => {}) : { data: null, error: { message: 'refus fictif' }, status: 403 }; await mount('/patients/articles'); expect(captured.parentNode).toBe(document.head); expect(document.head.querySelector('meta[name="robots"]')).toBeNull(); expect(graphs()).toHaveLength(0);
  });
});
