import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
type Source = 'p0' | 'p200' | 'pHead' | 's0' | 'sHead';
type Mode = 'success' | 'hold' | 'late' | 'badHead' | 'empty' | 'badRow' | 'changedCount';
type Receipt = { data: unknown; error: unknown; status: number; count: number | null };
const f = vi.hoisted(() => {
  const state = { lang: 'fr', taille: 201, target: 'p200' as Source, mode: 'success' as Mode, calls: [] as { source: Source; signal?: AbortSignal; at: number }[], violations: [] as string[], expectedViolations: [] as string[], pending: 0 };
  const closed = (name: string): never => { state.violations.push(name); throw Error('CAPACITE FERMEE ' + name); };
  for (const key of ['fetch', 'WebSocket', 'XMLHttpRequest', 'EventSource', 'Worker', 'SharedWorker']) Object.defineProperty(globalThis, key, { configurable: true, value: () => closed(key) });
  for (const key of ['getItem', 'setItem', 'removeItem', 'clear', 'key']) Object.defineProperty(Storage.prototype, key, { configurable: true, value: () => closed('storage.' + key) });
  Object.defineProperty(window, 'open', { configurable: true, value: () => closed('navigation') });
  Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: () => closed('beacon') });
  HTMLAnchorElement.prototype.click = () => closed('anchor');
  Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, writable: true, value: true });
  const practitioner = (n: number) => ({ slug: 'fiche-' + n, prenom: 'Prenom', nom: n === 1 ? 'Cabinet <Rive>' : 'Nom' + String(n).padStart(3, '0'), profession: 'Kinésithérapie', photo_url: null, specialites: ['Kinésithérapie'], problematiques: [], specialites_derivees: ['Kinésithérapie'], problematiques_derivees: [], problematiques_manuelles: [], publics_derives: [], cabinet_slug: 'i-ca-re-chartrons' });
  const specialty = { slug: 'kinesitherapie', nom: 'Kinésithérapie', description_courte: 'Fictive', description_longue: null, synonymes: [], cabinet_slug: null };
  const receipt = (source: Source): Receipt => {
    const head = source.endsWith('Head'), isP = source.startsWith('p');
    const empty = state.mode === 'empty';
    const rows = empty ? [] : source === 'p0' ? Array.from({ length: Math.min(200, state.taille) }, (_, n) => practitioner(n)) : source === 'p200' ? [practitioner(200)] : [specialty];
    if (source === state.target && state.mode === 'badRow') rows[0] = { slug: '' } as never;
    const count = empty ? 0 : isP ? state.taille : 1;
    return { data: head ? null : rows, error: null, status: 200, count: source === state.target && ['badHead', 'changedCount'].includes(state.mode) ? count - 1 : count };
  };
  const execute = (source: Source, signal?: AbortSignal): Promise<Receipt> => {
    state.calls.push({ source, signal, at: Date.now() });
    if (signal?.aborted) return Promise.reject(Error('preaborted'));
    if (source !== state.target || !['hold', 'late'].includes(state.mode)) return Promise.resolve(receipt(source));
    return new Promise((resolve, reject) => {
      state.pending++; let done = false; let timer: ReturnType<typeof setTimeout> | undefined;
      const finish = () => { if (done) return false; done = true; state.pending--; clearTimeout(timer); signal?.removeEventListener('abort', abort); return true; };
      const abort = () => { if (state.mode !== 'late' && finish()) reject(Error('SIMULATION abort')); };
      signal?.addEventListener('abort', abort, { once: true });
      if (state.mode === 'late') timer = setTimeout(() => { if (finish()) resolve(receipt(source)); }, 15100);
    });
  };
  const query = (table: string) => {
    let head = false, start = 0, end = 199, signal: AbortSignal | undefined;
    const seen: string[] = [];
    const methods = {
      select: (columns: string, options: { count: string; head: boolean }) => {
        const expected = table === 'praticiens' ? 'slug,prenom,nom,profession,photo_url,specialites,problematiques,specialites_derivees,problematiques_derivees,problematiques_manuelles,publics_derives,cabinet_slug' : 'slug,nom,description_courte,description_longue,synonymes,cabinet_slug';
        if (columns.replaceAll(' ', '') !== expected || options.count !== 'exact' || typeof options.head !== 'boolean') return closed('projection');
        head = options.head; seen.push('select'); return proxy;
      },
      eq: (column: string, value: unknown) => { if (!((column === 'actif' && value === true) || (table === 'praticiens' && column === 'statut_validation' && value === 'validee'))) return closed('filtre'); seen.push(column); return proxy; },
      order: (column: string, options: { ascending: boolean }) => { if (!['nom', 'slug'].includes(column) || options.ascending !== true) return closed('ordre'); seen.push(column); return proxy; },
      range: (a: number, b: number) => { if (head || ![0, 200].includes(a) || b !== a + 199) return closed('range'); start = a; end = b; seen.push('range'); return proxy; },
      abortSignal: (value: AbortSignal) => { if (!(value instanceof AbortSignal)) return closed('signal'); signal = value; seen.push('signal'); return proxy; },
      then: (resolve: (v: Receipt) => void, reject: (e: unknown) => void) => {
        const needed = ['select', ...(table === 'praticiens' ? ['statut_validation'] : []), 'actif', 'nom', 'slug'];
        if (needed.some((v, i) => seen[i] !== v) || !head && end !== start + 199) return closed('contrat');
        const source: Source = table === 'praticiens' ? head ? 'pHead' : start === 200 ? 'p200' : 'p0' : head ? 'sHead' : 's0';
        return execute(source, signal).then(resolve, reject);
      },
    };
    const proxy: object = new Proxy({}, { get: (_target, key) => Reflect.get(methods, key) ?? closed('query.' + String(key)) });
    return proxy;
  };
  const client = new Proxy({}, { get: (_target, key) => key === 'from' ? (table: string) => ['praticiens', 'specialites'].includes(table) ? query(table) : closed('table') : closed('client.' + String(key)) });
  return { state, client, closed };
});
vi.mock('@/integrations/supabase/client', () => ({ supabase: f.client }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: f.state.lang }, t: (key: string) => key }) }));
vi.mock('@/components/Layout', () => ({ Layout: ({ children }: { children: ReactNode }) => <>{children}</> }));

vi.mock('@/components/CarteCabinetsSection', () => ({ CarteCabinetsSection: () => null }));


import Patients from '@/pages/Patients';
let root: Root | null, container: HTMLDivElement;
const flush = async () => { await act(async () => { for (let n = 0; n < 40; n++) await Promise.resolve(); await vi.advanceTimersByTimeAsync(0); }); };
const start = async () => { container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container); await act(async () => root?.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Patients /></MemoryRouter>)); await flush(); };
const marker = () => container.querySelector('[data-praticiens-annuaire]');
const cards = () => container.querySelectorAll('a[href^="/praticien/"]');
const button = (text: string, scope: ParentNode = container) => { const found = [...scope.querySelectorAll('button')].find(n => n.textContent?.trim() === text); if (!found) throw Error('Bouton absent : ' + text); return found; };
const click = async (text: string, scope: ParentNode = container) => { await act(async () => button(text, scope).click()); await flush(); };
const filter = async () => {
  const input = container.querySelector('input[aria-label="Rechercher par nom"]') as HTMLInputElement;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  await act(async () => { setter.call(input, 'Nom200'); input.dispatchEvent(new Event('input', { bubbles: true })); }); await flush();
  await click('Chartrons'); expect(cards()).toHaveLength(1); return input;
};
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-09T03:00:00Z')); Object.assign(f.state, { lang: 'fr', taille: 201, target: 'p200', mode: 'success', calls: [], violations: [], expectedViolations: [], pending: 0 }); root = null; });
afterEach(async () => {
  if (root) await act(async () => root?.unmount()); await flush(); container?.remove();
  document.head.replaceChildren();
  try { expect(f.state.violations).toEqual(f.state.expectedViolations); expect(f.state.pending).toBe(0); expect(vi.getTimerCount()).toBe(0); } finally { vi.useRealTimers(); }
});
it('composition : entier 201, compte final et SEO seulement après confirmation', async () => {
  await start(); expect(marker()?.getAttribute('data-praticiens-annuaire')).toBe('201'); expect(cards()).toHaveLength(201); expect(document.head.querySelector('meta[name="robots"][content*=noindex]')).toBeNull();
  expect(f.state.calls.map(c => c.source)).toEqual(['p0', 'p200', 'pHead', 's0', 'sHead']); expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true);
});
it.each<Source>(['p200', 'pHead'])('transport : %s muet borné sans résultat partiel puis reprise', async source => {
  f.state.target = source; f.state.mode = 'hold'; await start(); expect(marker()).toBeNull(); expect(cards()).toHaveLength(0);
  await act(async () => vi.advanceTimersByTimeAsync(15000)); await flush(); expect(marker()).toBeNull(); expect(container.querySelector('[role="alert"]')).not.toBeNull(); expect(container.textContent?.match(/0 sur 8/)).toBeNull(); expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true);
  f.state.mode = 'success'; await click("Réessayer l'annuaire"); expect(marker()?.getAttribute('data-praticiens-annuaire')).toBe('201');
});
it.each<Source>(['s0', 'sHead'])('reprise : %s muet conserve recherche, filtre, noeud et focus', async source => {
  f.state.target = source; f.state.mode = 'hold'; await start(); const input = await filter(); const cabinet = button('Chartrons'); cabinet.focus(); expect(cabinet.getAttribute('aria-pressed')).toBe('true'); const n = f.state.calls.filter(c => c.source.startsWith('p')).length;
  await act(async () => vi.advanceTimersByTimeAsync(15000)); await flush(); expect(container.querySelector('[role="alert"]')?.textContent).toContain('recherches fréquentes');
  f.state.mode = 'success'; await click('Réessayer les recherches fréquentes'); expect(cards()).toHaveLength(1); expect(container.querySelector('input')).toBe(input); expect(input.value).toBe('Nom200'); expect(button('Chartrons')).toBe(cabinet); expect(document.activeElement).toBe(cabinet); expect(cabinet.getAttribute('aria-pressed')).toBe('true'); expect(f.state.calls.filter(c => c.source.startsWith('p'))).toHaveLength(n);
  expect(container.querySelector('a[href="/patients/specialite/kinesitherapie"]')).not.toBeNull();
});
it('accessibilité : composant de section stable et focus conservé', async () => {
  await start(); const cabinet = button('Chartrons'); cabinet.focus(); await click('Chartrons'); expect(button('Chartrons')).toBe(cabinet); expect(document.activeElement).toBe(cabinet);
});
it('accessibilité : état pressé annoncé au lecteur', async () => {
  await start(); const cabinet = button('Chartrons'); expect(cabinet.getAttribute('aria-pressed')).toBe('false'); await click('Chartrons'); expect(button('Chartrons').getAttribute('aria-pressed')).toBe('true');
});
it('accessibilité : classes de protection texte long conservées', async () => {
  await start();
  expect(container.querySelector('section.min-w-0')?.className).toContain('[overflow-wrap:anywhere]');
});
it('accessibilité : vrai Sheet nommé et décrit', async () => {
  await start(); await click('Filtrer'); const dialog = document.querySelector('[role="dialog"]'); expect(dialog).not.toBeNull();
  const label = document.getElementById(dialog!.getAttribute('aria-labelledby')!); const description = document.getElementById(dialog!.getAttribute('aria-describedby')!);
  expect(label?.textContent).toBe('Filtrer les praticiens'); expect(description?.textContent).toContain('Rechercher par nom');
});
it('transport : HEAD tardif ignoré après expiration et reprise fraîche', async () => {
  f.state.target = 'pHead'; f.state.mode = 'late'; await start(); const old = f.state.calls.at(-1)!;
  await act(async () => vi.advanceTimersByTimeAsync(15100)); await flush(); expect(marker()).toBeNull(); expect(old.signal?.aborted).toBe(true);
  f.state.mode = 'success'; await click("Réessayer l'annuaire"); expect(marker()?.getAttribute('data-praticiens-annuaire')).toBe('201'); expect(f.state.calls.filter(c => c.source === 'pHead').at(-1)?.signal).not.toBe(old.signal);
});
it.each<Mode>(['badHead', 'badRow', 'changedCount'])('intégrité : %s refuse le compteur et le faux vide', async mode => {
  f.state.target = mode === 'badHead' ? 'pHead' : 'p200'; f.state.mode = mode; await start(); expect(marker()).toBeNull(); expect(cards()).toHaveLength(0); expect(container.querySelector('[role="alert"]')).not.toBeNull(); expect(container.textContent?.match(/0 sur 8/)).toBeNull();
});
it('intégrité : vrai vide confirmé distinct d’une panne', async () => {
  f.state.mode = 'empty'; await start(); expect(marker()?.getAttribute('data-praticiens-annuaire')).toBe('0'); expect(container.textContent?.match(/(0) sur 8/)?.[1]).toBe('0'); expect(f.state.calls.map(c => c.source)).toEqual(['p0', 'pHead']);
});
it('transport : démontage annule le transport et la borne', async () => {
  f.state.mode = 'hold'; await start(); await act(async () => root?.unmount()); root = null; await flush(); expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true);
});
it('frontières : réseau, Auth, RPC, Storage et écriture fermés avant dispatch', () => {
  f.state.expectedViolations = ['fetch', 'client.auth', 'client.rpc', 'client.storage', 'query.update', 'table'];
  expect(() => fetch('https://fixture.invalid')).toThrow('CAPACITE FERMEE');
  for (const key of ['auth', 'rpc', 'storage']) expect(() => Reflect.get(f.client, key)).toThrow('CAPACITE FERMEE');
  const from = Reflect.get(f.client, 'from'); expect(() => Reflect.get(from('praticiens'), 'update')).toThrow('CAPACITE FERMEE'); expect(() => from('secrets')).toThrow('CAPACITE FERMEE'); expect(f.state.calls).toHaveLength(0);
});

it('la tête React reprend le titre, la description et la directive du prérendu', async () => {
  document.head.innerHTML = '<title>Titre initial</title><meta name="description" content="Description initiale"><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="https://i-ca.re/patients/">';
  await start();
  expect(document.head.querySelectorAll("title")).toHaveLength(1);
  expect(document.title).toContain("Annuaire");
  expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  expect(document.head.querySelector('meta[name="robots"][content*=noindex]')).toBeNull();
  const script = container.querySelector('script[type="application/ld+json"]')!;
  expect(script.textContent).not.toContain("<");
  expect(JSON.parse(script.textContent!)["@graph"][1].itemListElement[1].name).toBe("Prenom Cabinet <Rive>");
});
it('la coquille de site conserve les balises communes et un seul titre en cas de refus', async () => {
  document.head.innerHTML = '<title>Accueil</title><meta name="description" content="Accueil"><meta name="application-name" content="Site">';
  f.state.lang = 'en'; f.state.target = 'pHead'; f.state.mode = 'badHead';
  await start();
  expect(document.head.querySelectorAll("title")).toHaveLength(1);
  expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  expect(document.head.querySelector('meta[name="application-name"]')).not.toBeNull();
  expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain("noindex");
  expect(container.querySelector('[role="alert"]')?.textContent).toContain("Profiles and their total");
  expect(button("Retry directory")).toBeTruthy();
  expect(marker()).toBeNull();
});

it.each([7, 8])('respecte le seuil de publication sur %i fiches confirmées', async taille => {
  f.state.taille = taille;
  await start();
  expect(marker()?.getAttribute('data-praticiens-annuaire')).toBe(String(taille));
  expect(!!document.head.querySelector('meta[name="robots"][content*=noindex]')).toBe(taille < 8);
  expect(!!container.querySelector('input[type="search"]')).toBe(taille >= 8);
});
it('préserve une directive générale distincte de celle de la page Patients', async () => {
  document.head.innerHTML = '<link rel="canonical" href="https://i-ca.re/patients/"><meta name="robots" content="noarchive">';
  await start();
  expect(document.head.querySelector('meta[name="robots"][content=noarchive]')).not.toBeNull();
});

it('nomme et décrit le panneau mobile de la route anglaise', async () => {
  f.state.lang = 'en';
  await start();
  await click('Filter');
  const dialog = document.querySelector('[role="dialog"]')!;
  expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)?.textContent).toBe('Filter practitioners');
  expect(document.getElementById(dialog.getAttribute('aria-describedby')!)?.textContent).toContain('Search by name');
});
