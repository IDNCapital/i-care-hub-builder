import { act, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PraticienPublic from '../../src/pages/PraticienPublic';

type Result = { data: unknown; error: unknown };
type Query = { table: string; columns: string; filters: unknown[][] };
const h = vi.hoisted(() => ({ calls: [] as Query[], google: [] as unknown[], read: null as unknown as (query: Query) => Result | Promise<Result> }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from(table: string) {
  if (!['praticiens', 'projets'].includes(table)) throw new Error('Lecture hors famille interdite');
  const request: Query = { table, columns: '', filters: [] };
  const q = { select(columns: string) { request.columns = columns; return q; }, eq(...args: unknown[]) { request.filters.push(args); return q; }, maybeSingle() { h.calls.push(request); return Promise.resolve().then(() => h.read(request)); } }; return q;
} } }));
vi.mock('@/components/avis/SectionAvisGoogle', () => ({ SectionAvisGoogle(props: unknown) { h.google.push(props); return null; } }));
const ok = (data: unknown): Result => ({ data, error: null });
const profile = (slug = 'alpha') => ({ id: `praticien-${slug}`, slug, cabinet_slug: `cabinet-${slug}`, prenom: slug === 'alpha' ? 'Alice' : 'Benoit', nom: 'Exemple', genre: null, profession: 'Profession fictive', specialites: ['Spécialité fictive'], problematiques: [], specialites_derivees: [], problematiques_derivees: [], tags_extraction_status: 'done', tags_extracted_at: null, tags_bio_hash: null, bio_courte: 'Présentation fictive courte.', bio_courte_en: null, bio_longue: 'Biographie **fictive** du praticien.', bio_longue_en: null, photo_url: null, lien_rdv: 'https://reservation.fixture.invalid/rdv', google_place_id: `google-fictif-${slug}`, google_kgmid: null, google_cid: null, statut_validation: 'validee', preview_token: 'jeton-interne-fictif', date_envoi_preview: null, date_validation: null, notes_internes: 'Note interne fictive hors affichage', actif: true, ordre_affichage: 0, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' });
const cabinet = (slug = 'alpha') => ({ slug: `cabinet-${slug}`, name: `I-CA.RE Quartier ${slug}`, city: slug === 'alpha' ? 'Bordeaux' : 'Toulouse', address: `Adresse masquée ${slug}`, show_address: false });
function normal(query: Query): Result { const slug = query.filters.find(([key]) => key === 'slug')?.[1] as string; return ok(query.table === 'praticiens' ? profile(slug) : cabinet(slug.replace('cabinet-', ''))); }
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }
let root: Root | undefined;
const text = () => document.body.textContent || '';
const person = () => { const node = document.querySelector('script[type="application/ld+json"]'); return node ? JSON.parse(node.textContent || '{}') : null; };
function Destination() { return <output>{useLocation().pathname}</output>; }
async function mount(path: string | string[] = '/praticien/alpha') {
  const host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  await act(async () => root!.render(<MemoryRouter initialEntries={Array.isArray(path) ? path : [path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><nav aria-label="Navigation fictive"><Link to="/praticien/alpha">Route A</Link><Link to="/praticien/beta">Route B</Link></nav><Routes><Route path="/praticien/:slug" element={<PraticienPublic />} /><Route path="/sans-slug" element={<PraticienPublic />} /><Route path="/projets/:cabinet" element={<Destination />} /><Route path="/" element={<Destination />} /></Routes></MemoryRouter>));
}
async function go(label: string) { const link = [...document.querySelectorAll('a')].find(a => a.textContent === label)!; await act(async () => { link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); }); }
beforeEach(() => { Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }); h.calls = []; h.google = []; h.read = normal; vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Reseau interdit, seuls les doubles SDK sont autorises'); })); });
afterEach(async () => { if (root) await act(async () => root!.unmount()); root = undefined; document.body.innerHTML = ''; document.head.innerHTML = ''; vi.unstubAllGlobals(); vi.restoreAllMocks(); Reflect.deleteProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT'); });

describe('Fiche publique du slug courant', () => {
  it('retire le profil, son cabinet et ses metadonnees pendant la lecture du nouveau slug', async () => {
    await mount(); expect(text()).toContain('Alice Exemple'); h.read = q => q.table === 'praticiens' ? new Promise(() => {}) : normal(q); await go('Route B');
    expect(text()).toContain('Chargement'); expect(text()).not.toContain('Alice Exemple'); expect(text()).not.toContain('Quartier alpha'); expect(person()).toBeNull(); expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });
  it('sort du vrai absent precedent quand le nouveau slug est recu', async () => {
    h.read = q => q.table === 'praticiens' && q.filters[0][1] === 'alpha' ? ok(null) : normal(q); await mount(); expect(text()).toContain("Cette fiche n'est pas disponible."); await go('Route B'); expect(text()).toContain('Benoit Exemple'); expect(text()).not.toContain("Cette fiche n'est pas disponible.");
  });
  it('sort du refus precedent quand le nouveau slug est recu', async () => {
    h.read = q => q.table === 'praticiens' && q.filters[0][1] === 'alpha' ? { data: null, error: { message: 'refus fictif' } } : normal(q); await mount(); expect(text()).toContain("Le contenu n'a pas pu être chargé."); await go('Route B'); expect(text()).toContain('Benoit Exemple'); expect(text()).not.toContain("Le contenu n'a pas pu être chargé.");
  });
  it('nomme le refus du cabinet sans fabriquer son absence', async () => {
    h.read = q => q.table === 'projets' ? { data: null, error: { message: 'refus fictif' } } : normal(q); await mount(); expect(text()).toContain("Le contenu n'a pas pu être chargé."); expect(text()).not.toContain("Cette fiche n'est pas disponible."); expect(person()).toBeNull();
  });
  it('ne classe pas une donnee praticien absente comme un vrai404', async () => {
    h.read = q => q.table === 'praticiens' ? ok(undefined) : normal(q); await mount(); expect(text()).toContain("Le contenu n'a pas pu être chargé."); expect(text()).not.toContain("Cette fiche n'est pas disponible.");
  });
  it('ne retire pas lattente courante quand lancien cabinet finit apres navigation', async () => {
    const old = deferred<Result>(); h.read = q => q.table === 'projets' ? old.promise : q.filters[0][1] === 'beta' ? new Promise(() => {}) : normal(q); await mount(); await go('Route B'); await act(async () => old.resolve(ok(cabinet()))); expect(text()).toContain('Chargement'); expect(text()).not.toContain('Alice Exemple');
  });
  it('annonce lattente initiale sans profil ni absence supposes', async () => {
    h.read = () => new Promise(() => {}); await mount(); expect(document.querySelector('[role="status"]')?.textContent).toContain('Chargement'); expect(person()).toBeNull(); expect(text()).not.toContain("Cette fiche n'est pas disponible."); expect(h.calls).toHaveLength(1); expect(h.google).toHaveLength(0);
  });
  it('reserve le vrai404 a une reponse null sans erreur', async () => {
    h.read = () => ok(null); await mount(); expect(text()).toContain("Cette fiche n'est pas disponible."); expect(document.title).toBe('Fiche indisponible · I-CA.RE'); expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,follow'); expect(h.calls).toHaveLength(1); expect(h.google).toHaveLength(0);
  });
  it.each(['rejet', 'donnee-malformee', 'donnee-erreur', 'doublons'])('garde la source praticien inconnue : %s', async kind => {
    h.read = q => q.table !== 'praticiens' ? normal(q) : kind === 'rejet' ? Promise.reject(new Error('transport fictif')) : kind === 'donnee-malformee' ? ok({}) : { data: kind === 'donnee-erreur' ? profile() : null, error: { message: 'refus fictif', code: 'PGRST116' } }; await mount(); expect(text()).toContain("Le contenu n'a pas pu être chargé."); expect(text()).not.toContain("Cette fiche n'est pas disponible."); expect(person()).toBeNull(); expect(h.google).toHaveLength(0);
  });
  it('refuse un profil recu pour un autre slug sans produire de canonical errone', async () => {
    h.read = q => q.table === 'praticiens' ? ok(profile('beta')) : normal(q); await mount(); expect(text()).toContain("Le contenu n'a pas pu être chargé."); expect(text()).not.toContain('Benoit Exemple'); expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });
  it.each(['rejet', 'donnee-absente', 'adresse-malformee'])('garde le cabinet inconnu sans le classer absent : %s', async kind => {
    h.read = q => q.table !== 'projets' ? normal(q) : kind === 'rejet' ? Promise.reject(new Error('transport fictif')) : kind === 'donnee-absente' ? ok(undefined) : ok({ ...cabinet(), show_address: 'false' }); await mount(); expect(text()).toContain("Le contenu n'a pas pu être chargé."); expect(text()).not.toContain("Cette fiche n'est pas disponible."); expect(text()).not.toContain('Adresse masquée'); expect(person()).toBeNull(); expect(h.google).toHaveLength(0);
  });
  it('conserve le praticien quand labsence du cabinet est confirmee', async () => {
    h.read = q => q.table === 'projets' ? ok(null) : normal(q); await mount(); expect(text()).toContain('Alice Exemple'); expect(text()).toContain("Aucun cabinet associé n'a été trouvé."); expect(person().worksFor).toBeUndefined(); expect(document.title).toBe('Alice Exemple, Profession fictive · I-CA.RE');
  });
  it('conserve les selecteurs publics, le head React19 natif et le JSONLD du cabinet adresse masquee', async () => {
    await mount(); expect(h.calls).toEqual([{ table: 'praticiens', columns: '*', filters: [['slug', 'alpha'], ['statut_validation', 'validee'], ['actif', true]] }, { table: 'projets', columns: 'name,city,address,show_address', filters: [['slug', 'cabinet-alpha']] }, { table: 'projets', columns: 'slug,name,city,address,show_address', filters: [['slug', 'cabinet-alpha']] }]);
    expect(person()).toEqual({ '@context': 'https://schema.org', '@type': 'Person', name: 'Alice Exemple', jobTitle: 'Profession fictive', image: 'https://i-ca.re/og-i-ca-re.png', description: 'Présentation fictive courte.', url: 'https://i-ca.re/praticien/alpha/', worksFor: { '@type': 'MedicalBusiness', name: 'I-CA.RE Quartier alpha', address: { '@type': 'PostalAddress', addressCountry: 'FR', addressLocality: 'Bordeaux', addressRegion: 'Quartier alpha' } } });
    expect(document.title).toBe('Alice Exemple, Profession fictive à Bordeaux · I-CA.RE'); expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://i-ca.re/praticien/alpha/'); expect([...document.head.querySelectorAll('link[rel="alternate"]')].map(n => [n.getAttribute('hreflang'), n.getAttribute('href')])).toEqual([['fr', 'https://i-ca.re/praticien/alpha/'], ['x-default', 'https://i-ca.re/praticien/alpha/']]);
    expect(text()).not.toContain('Adresse masquée'); expect(text()).not.toContain('jeton-interne-fictif'); expect(text()).not.toContain('Note interne fictive'); expect(h.google.at(-1)).toEqual({ placeId: 'google-fictif-alpha', nomPourLien: 'Alice Exemple' });
  });
  it('conserve une adresse publiee et les URLs de reservation et de cabinet sans geste externe', async () => {
    h.read = q => q.table === 'projets' ? ok({ ...cabinet(), show_address: true }) : normal(q); await mount(); expect(text()).toContain('Adresse masquée alpha'); expect(person().worksFor.address.streetAddress).toBe('Adresse masquée alpha');
    const link = [...document.querySelectorAll('a')].find(a => a.textContent?.includes('PRENDRE RENDEZ-VOUS'))!; expect(link.getAttribute('href')).toBe('https://reservation.fixture.invalid/rdv'); expect(link.getAttribute('target')).toBe('_blank'); expect(link.getAttribute('rel')).toBe('noopener noreferrer'); expect(document.querySelector('a[href="/projets/cabinet-alpha"]')).not.toBeNull();
  });
  it('conserve le repli de contact et limage du profil sans requete externe', async () => {
    const photo = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='; h.read = q => q.table === 'praticiens' ? ok({ ...profile(), lien_rdv: null, photo_url: photo }) : normal(q); await mount(); expect(document.querySelector('a[href="#contact-praticien"]')?.textContent).toContain('PRENDRE CONTACT'); expect(document.querySelector('img')?.getAttribute('src')).toBe(photo); expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(photo); expect(person().image).toBe(photo);
  });
  it('remonte le vrai enfant sans ancien cabinet lorsque sa nouvelle lecture attend', async () => {
    const pending = deferred<Result>(); await mount(); h.read = q => q.table === 'projets' && q.columns.startsWith('slug,') && q.filters[0][1] === 'cabinet-beta' ? pending.promise : normal(q); await go('Route B'); expect(text()).toContain('Benoit Exemple'); expect(text()).not.toContain('Quartier alpha'); expect(person().worksFor.address.addressLocality).toBe('Toulouse'); expect(h.google.at(-1)).toEqual({ placeId: 'google-fictif-beta', nomPourLien: 'Benoit Exemple' });
    await act(async () => pending.resolve(ok(cabinet('beta')))); expect(document.querySelector('a[href="/projets/cabinet-beta"]')).not.toBeNull();
  });
  it('ignore un ancien profil dans une navigation A B A', async () => {
    const old = deferred<Result>(); let alphaReads = 0; h.read = q => q.table === 'praticiens' && q.filters[0][1] === 'alpha' && ++alphaReads === 1 ? old.promise : normal(q); await mount(); await go('Route B'); expect(text()).toContain('Benoit Exemple'); await go('Route A'); expect(text()).toContain('Alice Exemple');
    await act(async () => old.resolve(ok({ ...profile(), prenom: 'Retour ancien fictif' }))); expect(text()).not.toContain('Retour ancien fictif'); expect(person().name).toBe('Alice Exemple'); expect(h.calls.filter(q => q.table === 'projets' && q.filters[0][1] === 'cabinet-alpha')).toHaveLength(2);
  });
  it('ignore un ancien cabinet refuse quand la nouvelle fiche est deja recue', async () => {
    const old = deferred<Result>(); h.read = q => q.table === 'projets' && q.filters[0][1] === 'cabinet-alpha' ? old.promise : normal(q); await mount(); await go('Route B'); expect(text()).toContain('Benoit Exemple'); await act(async () => old.resolve({ data: null, error: { message: 'ancien refus fictif' } })); expect(text()).toContain('Benoit Exemple'); expect(text()).not.toContain("Le contenu n'a pas pu être chargé."); expect(person().name).toBe('Benoit Exemple');
  });
  it('ne poursuit pas la lecture du profil apres demontage', async () => {
    const pending = deferred<Result>(); h.read = () => pending.promise; await mount(); await act(async () => root!.unmount()); root = undefined; await act(async () => pending.resolve(ok(profile()))); expect(h.calls).toHaveLength(1); expect(h.google).toHaveLength(0); expect(person()).toBeNull();
  });
  it('ne remplace pas une nouvelle visite par le cabinet retourne apres demontage', async () => {
    const pending = deferred<Result>(); h.read = q => q.table === 'projets' ? pending.promise : normal(q); await mount(); await act(async () => root!.unmount()); root = undefined; h.read = normal; await mount('/praticien/beta'); await act(async () => pending.resolve(ok(cabinet()))); expect(text()).toContain('Benoit Exemple'); expect(text()).not.toContain('Quartier alpha'); expect(person().name).toBe('Benoit Exemple');
  });
  it('ne relance pas les lecteurs pour un lien vers le meme slug', async () => {
    await mount(); const before = h.calls.length; await go('Route A'); expect(h.calls).toHaveLength(before); expect(text()).toContain('Alice Exemple');
  });
  it('classe un slug manquant sans requete ni ancien profil', async () => {
    await mount('/sans-slug'); expect(text()).toContain("Cette fiche n'est pas disponible."); expect(h.calls).toHaveLength(0); expect(person()).toBeNull();
  });
  it('conserve le retour direct vers le cabinet du profil courant', async () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1); await mount('/praticien/beta'); await act(async () => document.querySelector('button[aria-label="Revenir à la page précédente"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))); expect(document.querySelector('output')?.textContent).toBe('/projets/cabinet-beta');
  });
  it('conserve le retour dans lhistorique interne quand il existe', async () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(2); await mount(['/', '/praticien/alpha']); await act(async () => document.querySelector('button[aria-label="Revenir à la page précédente"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))); expect(document.querySelector('output')?.textContent).toBe('/');
  });
  it('ecarte le premier effet StrictMode sans dedoubler le head courant', async () => {
    const old = deferred<Result>(); let profiles = 0; h.read = q => q.table === 'praticiens' && ++profiles === 1 ? old.promise : normal(q);
    const current = document.createElement('div'); document.body.append(current); root = createRoot(current); await act(async () => root!.render(<StrictMode><MemoryRouter initialEntries={['/praticien/alpha']}><Routes><Route path="/praticien/:slug" element={<PraticienPublic />} /></Routes></MemoryRouter></StrictMode>));
    expect(text()).toContain('Alice Exemple'); await act(async () => old.resolve(ok({ ...profile(), prenom: 'Effet ancien fictif' }))); expect(text()).not.toContain('Effet ancien fictif'); expect(person().name).toBe('Alice Exemple'); expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1); expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
  });
});
