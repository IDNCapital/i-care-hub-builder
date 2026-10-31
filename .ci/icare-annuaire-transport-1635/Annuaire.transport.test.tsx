import { act, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
type Source = 'p0' | 'p200' | 'pHead' | 's0' | 'sHead';
type Mode = 'success' | 'hold' | 'retry' | 'late' | 'badHead' | 'empty';
type Call = { source: Source; at: number; signal: AbortSignal | null | undefined; mode: Mode };
type State = { client: SupabaseClient<Database> | null; target: Source; mode: Mode; calls: Call[];
  entries: { method: string; path: string; body: boolean; aborted: boolean }[]; negatives: string[]; expected: string[]; pending: number };
const f = vi.hoisted(() => {
  const state: State = { client: null, target: 'p200', mode: 'success', calls: [], entries: [], negatives: [], expected: [], pending: 0 };
  const close = (name: string): never => { state.negatives.push(name); throw Error('CAPACITE FERMEE ' + name); };
  for (const key of ['fetch', 'WebSocket', 'XMLHttpRequest', 'EventSource', 'Worker', 'SharedWorker']) Object.defineProperty(globalThis, key, { configurable: true, value: () => close(key) });
  for (const key of ['getItem', 'setItem', 'removeItem', 'clear', 'key']) Object.defineProperty(Storage.prototype, key, { configurable: true, value: () => close('storage.' + key) });
  Object.defineProperty(window, 'open', { configurable: true, value: () => close('navigation') });
  Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: () => close('beacon') });
  HTMLAnchorElement.prototype.click = () => close('anchor');
  Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true, writable: true });
  const ui = {
    Layout: ({ children }: { children: ReactNode }) => <>{children}</>, SeoHead: () => null, CarteCabinetsSection: () => null,
    Button: ({ children, asChild, variant: _variant, size: _size, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: string; size?: string }) => asChild ? <span>{children}</span> : <button {...props}>{children}</button>,
    Input: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
    Sheet: ({ children }: { children: ReactNode }) => <>{children}</>, SheetTrigger: ({ children }: { children: ReactNode }) => <>{children}</>, SheetContent: () => null,
  };
  return { state, close, ui };
});
vi.mock('@/integrations/supabase/client', () => ({ supabase: new Proxy({}, { get(_target, key) {
  if (key === 'from' && f.state.client) return f.state.client.from;
  return f.close('client.' + String(key));
} }) }));
vi.mock('@/components/Layout', () => f.ui);
vi.mock('@/components/SeoHead', () => f.ui);
vi.mock('@/components/CarteCabinetsSection', () => f.ui);
vi.mock('@/components/ui/button', () => f.ui);
vi.mock('@/components/ui/input', () => f.ui);
vi.mock('@/components/ui/sheet', () => f.ui);
const { createClient } = await vi.importActual<typeof import('@supabase/supabase-js')>('@supabase/supabase-js');
import Patients from '../../src/pages/Patients';
const praticien = (n: number) => ({ slug: 'fiche-' + n, prenom: 'Prenom', nom: 'Nom' + String(n).padStart(3, '0'), profession: 'Kinésithérapie', photo_url: null,
  specialites: ['Kinésithérapie'], problematiques: [], specialites_derivees: ['Kinésithérapie'], problematiques_derivees: [], problematiques_manuelles: [], publics_derives: [], cabinet_slug: 'i-ca-re-chartrons' });
const specialite = { slug: 'kinesitherapie', nom: 'Kinésithérapie', description_courte: 'Reference fictive', description_longue: null, synonymes: [], cabinet_slug: null };
const columnsP = 'slug,prenom,nom,profession,photo_url,specialites,problematiques,specialites_derivees,problematiques_derivees,problematiques_manuelles,publics_derives,cabinet_slug';
const columnsS = 'slug,nom,description_courte,description_longue,synonymes,cabinet_slug';
function response(source: Source, empty = false, badHead = false): Response {
  const isP = source.startsWith('p'), head = source.endsWith('Head');
  const rows = empty ? [] : source === 'p0' ? Array.from({ length: 200 }, (_, n) => praticien(n)) : source === 'p200' ? [praticien(200)] : [specialite];
  const total = empty ? 0 : isP ? 201 : 1;
  return new Response(head ? null : JSON.stringify(rows), { status: 200, headers: { 'content-type': 'application/json', 'content-range': '0-' + Math.max(0, rows.length - 1) + '/' + (badHead ? total - 1 : total) } });
}
const fetchFixture: typeof fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url), method = init?.method ?? 'GET';
  f.state.entries.push({ method, path: url.pathname, body: init?.body != null, aborted: init?.signal?.aborted === true });
  if (url.origin !== 'https://fixture.invalid' || url.username || url.password || url.hash || !['GET', 'HEAD'].includes(method) || init?.body != null || !['/rest/v1/praticiens', '/rest/v1/specialites'].includes(url.pathname)) return f.close('transport');
  const isP = url.pathname.endsWith('/praticiens'), head = method === 'HEAD', offset = url.searchParams.get('offset') ?? '0';
  if (url.searchParams.get('select') !== (isP ? columnsP : columnsS) || url.searchParams.get('actif') !== 'eq.true' || url.searchParams.get('order') !== 'nom.asc,slug.asc' || (isP && url.searchParams.get('statut_validation') !== 'eq.validee') || (!isP && url.searchParams.has('statut_validation'))) return f.close('perimetre');
  if (!head && (url.searchParams.get('limit') !== '200' || !['0', '200'].includes(offset) || !isP && offset !== '0')) return f.close('pagination');
  if (head && (url.searchParams.has('offset') || url.searchParams.has('limit'))) return f.close('HEAD');
  if (init?.signal?.aborted) throw new DOMException('SIMULATION preaborted avant dispatch', 'AbortError');
  const source: Source = isP ? head ? 'pHead' : offset === '200' ? 'p200' : 'p0' : head ? 'sHead' : 's0';
  const mode = f.state.mode === 'empty' ? 'empty' : source === f.state.target ? f.state.mode : 'success';
  const call: Call = { source, mode, at: Date.now(), signal: init?.signal }; f.state.calls.push(call);
  if (['hold', 'retry', 'late'].includes(mode)) return new Promise<Response>((resolve, reject) => {
    f.state.pending++; let done = false, timer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => { if (done) return false; done = true; f.state.pending--; clearTimeout(timer); call.signal?.removeEventListener('abort', abort); return true; };
    const abort = () => { if (mode !== 'late' && finish()) reject(new DOMException('SIMULATION abandon', 'AbortError')); };
    call.signal?.addEventListener('abort', abort, { once: true });
    if (mode !== 'hold') timer = setTimeout(() => { if (finish()) resolve(mode === 'retry' ? new Response('{}', { status: 520 }) : response(source)); }, mode === 'retry' ? 14900 : 15100);
  });
  return response(source, mode === 'empty', mode === 'badHead');
};
function readQuery<T extends object>(query: T): T { return new Proxy(query, { get(target, key) {
  if (!['select', 'eq', 'order', 'range', 'abortSignal', 'then'].includes(String(key))) return f.close('query.' + String(key));
  const fn = Reflect.get(target, key); if (typeof fn !== 'function') return f.close('query absente');
  return (...args: unknown[]) => { if (key === 'abortSignal' && (args.length !== 1 || !(args[0] instanceof AbortSignal))) return f.close('signal'); const value = Reflect.apply(fn, target, args); return key === 'then' ? value : readQuery(value); };
} }); }
function fixtureClient() {
  const sdk = createClient<Database>('https://fixture.invalid', 'fixture-public', { accessToken: async () => 'fixture-token', global: { fetch: fetchFixture }, auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  return new Proxy(sdk, { get(target, key) {
    if (key === 'from') return (table: string) => { if (table === 'praticiens') return readQuery(target.from('praticiens')); if (table === 'specialites') return readQuery(target.from('specialites')); return f.close('table'); };
    return f.close('SDK.' + String(key));
  } });
}
let root: Root | null, container: HTMLDivElement;
const flush = async () => { await act(async () => { for (let j = 0; j < 3; j++) { for (let i = 0; i < 100; i++) await Promise.resolve(); await vi.advanceTimersByTimeAsync(0); } }); };
const start = async () => {
  const i18n = createInstance(); await i18n.use(initReactI18next).init({ lng: 'fr', fallbackLng: 'fr', resources: { fr: { translation: {} } }, initImmediate: false });
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  await act(async () => root?.render(<I18nextProvider i18n={i18n}><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/patients']}><Patients /></MemoryRouter></I18nextProvider>)); await flush();
};
const marker = () => container.querySelector('[data-praticiens-annuaire]');
const cardLinks = () => [...container.querySelectorAll('a[href^="/praticien/"]')];
const click = async (text: string) => { const button = [...container.querySelectorAll('button')].find(n => n.textContent?.trim() === text); if (!button) throw Error('Bouton de reprise absent ' + text); await act(async () => button.click()); await flush(); };
const filter = async () => {
  const input = container.querySelector('input[aria-label="Rechercher par nom"]'); if (!(input instanceof HTMLInputElement)) throw Error('Recherche absente');
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set; if (!setter) throw Error('Setter absent');
  await act(async () => { setter.call(input, 'Nom200'); input.dispatchEvent(new Event('input', { bubbles: true })); }); await flush();
  await click('Chartrons'); expect(input.value).toBe('Nom200'); expect(cardLinks()).toHaveLength(1); return input;
};
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-31T12:00:00Z')); Object.assign(f.state, { client: null, target: 'p200', mode: 'success', calls: [], entries: [], negatives: [], expected: [], pending: 0 }); root = null; f.state.client = fixtureClient(); });
afterEach(async () => {
  if (root) await act(async () => root?.unmount()); await flush(); container?.remove();
  console.log('ANNUAIRE_TRACE', JSON.stringify({ entries: f.state.entries, dispatches: f.state.calls.map(c => ({ source: c.source, mode: c.mode, at: c.at, aborted: c.signal?.aborted })), negatives: f.state.negatives, pending: f.state.pending }));
  try { expect(f.state.negatives).toEqual(f.state.expected); expect(f.state.pending).toBe(0); expect(vi.getTimerCount()).toBe(0); }
  finally { f.state.client = null; vi.useRealTimers(); }
});
it('succes entier : 201 fiches et recherches, GET/HEAD tous fermes', async () => {
  await start(); expect(marker()?.getAttribute('data-praticiens-annuaire')).toBe('201'); expect(cardLinks()).toHaveLength(201);
  expect(f.state.calls.map(c => c.source)).toEqual(['p0', 'p200', 'pHead', 's0', 'sHead']); expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true);
});
it.each<Source>(['p200', 'pHead'])('%s muet : borne complete sans faux nombre puis vraie reprise', async source => {
  f.state.target = source; f.state.mode = 'hold'; await start(); expect(marker()).toBeNull();
  await act(() => vi.advanceTimersByTimeAsync(15000)); await flush(); expect(container.querySelector('[role="alert"]')).not.toBeNull(); expect(marker()).toBeNull(); expect(cardLinks()).toHaveLength(0);
  expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true); f.state.mode = 'success'; await click("Réessayer l'annuaire"); expect(marker()?.getAttribute('data-praticiens-annuaire')).toBe('201');
});
it.each<Source>(['s0', 'sHead'])('%s muet : recherche et filtre conserves a la reprise des references', async source => {
  f.state.target = source; f.state.mode = 'hold'; await start(); const input = await filter(); const pCount = f.state.calls.filter(c => c.source.startsWith('p')).length;
  await act(() => vi.advanceTimersByTimeAsync(15000)); await flush(); expect(container.querySelector('[role="alert"]')?.textContent).toContain('recherches fréquentes');
  expect(f.state.calls.filter(c => c.source.startsWith('s')).every(c => c.signal?.aborted)).toBe(true); f.state.mode = 'success'; await click('Réessayer les recherches fréquentes');
  expect(input.value).toBe('Nom200'); expect(cardLinks()).toHaveLength(1); expect(f.state.calls.filter(c => c.source.startsWith('p'))).toHaveLength(pCount); expect(container.querySelector('a[href="/patients/specialite/kinesitherapie"]')).not.toBeNull();
  const currentInput = container.querySelector('input[aria-label="Rechercher par nom"]');
  expect(currentInput).toBe(input); expect((currentInput as HTMLInputElement).value).toBe('Nom200');
  const cabinet = [...container.querySelectorAll('button')].find(n => n.textContent?.trim() === 'Chartrons');
  expect(cabinet?.classList.contains('bg-sage')).toBe(true);
});
it('demontage ferme le transport courant', async () => {
  f.state.mode = 'hold'; await start(); await act(async () => root?.unmount()); root = null; await flush(); expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true); expect(f.state.pending).toBe(0);
});
it('HEAD tardif ignorant abort : pas de compteur admis puis reprise fraiche', async () => {
  f.state.target = 'pHead'; f.state.mode = 'late'; await start(); const old = f.state.calls[f.state.calls.length - 1]; await act(() => vi.advanceTimersByTimeAsync(15000)); await flush(); expect(old?.signal?.aborted).toBe(true);
  await act(() => vi.advanceTimersByTimeAsync(100)); await flush(); expect(marker()).toBeNull(); f.state.mode = 'success'; await click("Réessayer l'annuaire"); expect(marker()?.getAttribute('data-praticiens-annuaire')).toBe('201'); expect(f.state.calls.filter(c => c.source === 'pHead').slice(-1)[0]?.signal).not.toBe(old?.signal);
});
it('erreur GET52014900 : ferme transport et aucun dispatch apres borne', async () => {
  f.state.target = 'p0'; f.state.mode = 'retry'; await start(); await act(() => vi.advanceTimersByTimeAsync(15900)); await flush(); expect(f.state.calls).toHaveLength(1); expect(f.state.calls[0].signal?.aborted).toBe(true); expect(marker()).toBeNull(); expect(container.querySelector('[role="alert"]')).not.toBeNull();
});
it('compte HEAD incoherent : nombre inconnu, jamais faux amorcage zero', async () => {
  f.state.target = 'pHead'; f.state.mode = 'badHead'; await start(); expect(marker()).toBeNull(); expect(container.querySelector('[role="alert"]')).not.toBeNull(); expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true);
});
it('vrai vide confirme par HEAD : compteur zero connu et transport ferme', async () => {
  f.state.mode = 'empty'; await start(); expect(marker()?.getAttribute('data-praticiens-annuaire')).toBe('0'); expect(f.state.calls.map(c => c.source)).toEqual(['p0', 'pHead']); expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true);
});
it('frontieres avant preaborted : POST corps Auth RPC Storage update refuses', async () => {
  const c = new AbortController(); c.abort(); const url = 'https://fixture.invalid/rest/v1/praticiens?select=' + columnsP + '&actif=eq.true&statut_validation=eq.validee&order=nom.asc,slug.asc&offset=0&limit=200';
  await expect(fetchFixture(url, { signal: c.signal })).rejects.toThrow('SIMULATION preaborted'); f.state.expected = ['transport', 'transport', 'SDK.auth', 'SDK.rpc', 'SDK.storage', 'query.update'];
  await expect(fetchFixture(url, { signal: c.signal, method: 'POST' })).rejects.toThrow('CAPACITE FERMEE'); await expect(fetchFixture(url, { signal: c.signal, body: 'interdit' })).rejects.toThrow('CAPACITE FERMEE');
  const client = f.state.client; if (!client) throw Error('Client absent'); for (const key of ['auth', 'rpc', 'storage']) expect(() => Reflect.get(client, key)).toThrow('CAPACITE FERMEE'); expect(() => Reflect.get(client.from('praticiens'), 'update')).toThrow('CAPACITE FERMEE'); expect(f.state.calls).toHaveLength(0); expect(f.state.entries).toHaveLength(3);
});
