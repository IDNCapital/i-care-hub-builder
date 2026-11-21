import { act, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { createInstance, type i18n as I18n } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import fr from '../../src/locales/fr.json';
import en from '../../src/locales/en.json';
import { createRoot, type Root } from 'react-dom/client';
import { QueryClient, QueryClientProvider, notifyManager } from '@tanstack/react-query';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
type Mode = 'success' | 'hold' | 'retry' | 'late';
type Page = 0 | 200;
type Call = { page: Page; at: number; signal: AbortSignal | null | undefined; mode: Mode };
type State = { client: SupabaseClient<Database> | null; mode: Mode; target: Page; delayFirst: boolean;
  calls: Call[]; entries: { path: string; method: string; body: boolean; aborted: boolean }[];
  negatives: string[]; expected: string[]; pending: number; responses: { page: Page; at: number }[] };
const f = vi.hoisted(() => {
  const state: State = { client: null, mode: 'success', target: 200, delayFirst: false, calls: [], entries: [], negatives: [], expected: [], pending: 0, responses: [] };
  const close = (name: string): never => { state.negatives.push(name); throw Error('CAPACITE FERMEE ' + name); };
  for (const key of ['fetch', 'WebSocket', 'XMLHttpRequest', 'EventSource', 'Worker', 'SharedWorker']) Object.defineProperty(globalThis, key, { configurable: true, value: () => close(key) });
  for (const key of ['getItem', 'setItem', 'removeItem', 'clear', 'key']) Object.defineProperty(Storage.prototype, key, { configurable: true, value: () => close('storage.' + key) });
  for (const key of ['open', 'confirm']) Object.defineProperty(window, key, { configurable: true, value: () => close(key) });
  Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: () => close('sendBeacon') });
  HTMLAnchorElement.prototype.click = () => close('navigation');
  Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', { configurable: true, value: true, writable: true });
  const ui = {
    Layout: ({ children }: { children: ReactNode }) => <>{children}</>,
    SeoHead: () => null, CarteCabinetsSection: () => null,
    Button: ({ children, asChild, variant: _variant, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; asChild?: boolean }) => asChild ? <span>{children}</span> : <button {...props}>{children}</button>,
  };
  return { state, close, ui };
});
vi.mock('@/integrations/supabase/client', () => ({ supabase: new Proxy({}, { get(_t, key) {
  const client = f.state.client;
  if (key === 'from' && client) return client.from;
  return f.close('client.' + String(key));
} }) }));
vi.mock('@/components/Layout', () => f.ui);
vi.mock('@/components/SeoHead', () => f.ui);
vi.mock('@/components/CarteCabinetsSection', () => f.ui);
vi.mock('@/components/ui/button', () => f.ui);
const { createClient } = await vi.importActual<typeof import('@supabase/supabase-js')>('@supabase/supabase-js');
import Projets from '../../src/pages/Projets';
const project = (id: number) => ({ id: 'fixture-' + id, slug: id === 0 ? 'i-ca-re-chartrons' : 'fixture-' + id, short_description: 'Complement FR ' + id, short_description_en: 'Complement EN ' + id, created_at: '2026-10-30T00:00:00Z' });
const data = (page: Page) => page === 0 ? Array.from({ length: 200 }, (_, i) => project(i)) : [project(200)];
const response = (page: Page) => new Response(JSON.stringify(data(page)), { status: 200, headers: { 'content-type': 'application/json', 'content-range': page === 0 ? '0-199/201' : '200-200/201' } });
const fetchFixture: typeof fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
  const method = init?.method ?? 'GET';
  f.state.entries.push({ path: url.pathname, method, body: init?.body != null, aborted: init?.signal?.aborted === true });
  if (url.origin !== 'https://fixture.invalid' || url.username || url.password || url.hash || url.pathname !== '/rest/v1/projets' || !['GET', 'HEAD'].includes(method) || init?.body != null) return f.close('transport ' + method + ' ' + url.pathname);
  const offset = url.searchParams.get('offset');
  const page: Page = offset === '200' ? 200 : 0;
  if (!['0', '200'].includes(offset ?? '0') || url.searchParams.get('limit') !== '200' || url.searchParams.get('select') !== '*' || url.searchParams.get('order') !== 'created_at.desc,id.desc') return f.close('perimetre catalogue');
  if (init?.signal?.aborted) throw new DOMException('SIMULATION preaborted avant dispatch', 'AbortError');
  const call: Call = { page, at: Date.now(), signal: init?.signal, mode: page === f.state.target ? f.state.mode : 'success' }; f.state.calls.push(call);
  const delay = page === 0 && f.state.delayFirst ? 8000 : 0;
  if (call.mode !== 'success' || delay) return new Promise<Response>((resolve, reject) => {
    f.state.pending++; let done = false, timer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => { if (done) return false; done = true; f.state.pending--; clearTimeout(timer); call.signal?.removeEventListener('abort', abort); return true; };
    const abort = () => { if (call.mode !== 'late' && finish()) reject(new DOMException('SIMULATION abandon', 'AbortError')); };
    call.signal?.addEventListener('abort', abort, { once: true }); if (call.signal?.aborted) { abort(); return; }
    const timeout = call.mode === 'retry' ? 14900 : call.mode === 'late' ? 15100 : delay;
    if (timeout) timer = setTimeout(() => { if (finish()) { f.state.responses.push({ page, at: Date.now() }); resolve(call.mode === 'retry' ? new Response('{"message":"SIMULATION520"}', { status: 520 }) : response(page)); } }, timeout);
  });
  return response(page);
};
function readonlyQuery<T extends object>(query: T): T { return new Proxy(query, { get(target, key) {
  if (!['select', 'order', 'range', 'abortSignal', 'then'].includes(String(key))) return f.close('query.' + String(key));
  const fn = Reflect.get(target, key); if (typeof fn !== 'function') return f.close('query absente');
  return (...args: unknown[]) => { if (key === 'abortSignal' && (args.length !== 1 || !(args[0] instanceof AbortSignal))) return f.close('signal'); const value = Reflect.apply(fn, target, args); return key === 'then' ? value : readonlyQuery(value); };
} }); }
function fixtureClient() {
  const sdk = createClient<Database>('https://fixture.invalid', 'fixture-public', { accessToken: async () => 'fixture-local', global: { fetch: fetchFixture }, auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  return new Proxy(sdk, { get(target, key) {
    if (key === 'from') return (table: string) => { if (table !== 'projets') return f.close('table ' + table); return readonlyQuery(target.from('projets')); };
    return f.close('SDK.' + String(key));
  } });
}
let query: QueryClient, root: Root | null, container: HTMLDivElement;
let language: I18n;
const received = () => query.getQueryData<unknown[]>(['projets']);
const status = () => query.getQueryState(['projets'])?.status;
const flush = async () => { await act(async () => { for (let j = 0; j < 3; j++) { for (let i = 0; i < 100; i++) await Promise.resolve(); await vi.advanceTimersByTimeAsync(0); } }); };
const start = async (lang = 'fr') => {
  language = createInstance(); await language.use(initReactI18next).init({ resources: { fr: { translation: fr }, en: { translation: en } }, lng: lang, fallbackLng: 'fr', initImmediate: false, react: { useSuspense: false } });
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  await act(async () => root?.render(<I18nextProvider i18n={language}><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={[lang === 'en' ? '/en/projects' : '/projets']}><QueryClientProvider client={query}><Projets /></QueryClientProvider></MemoryRouter></I18nextProvider>)); await flush();
};
const retry = async () => {
  const button = [...container.querySelectorAll('button')].find(b => b.textContent?.trim() === (language.language === 'en' ? 'Try again' : 'Réessayer'));
  if (!button) throw Error('Reprise visiteur absente');
  await act(async () => button.click()); await flush();
};
beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-31T12:00:00Z')); notifyManager.setScheduler(cb => { void Promise.resolve().then(cb); });
  Object.assign(f.state, { mode: 'success', target: 200, delayFirst: false, calls: [], entries: [], negatives: [], expected: [], pending: 0, responses: [] });
  f.state.client = fixtureClient(); root = null; query = new QueryClient({ defaultOptions: { queries: { gcTime: 0 } } });
});
afterEach(async () => {
  if (root) await act(async () => root?.unmount()); await flush(); container?.remove(); query.clear();
  console.log('CATALOGUE_TRACE', JSON.stringify({ entries: f.state.entries, dispatches: f.state.calls.map(c => ({ page: c.page, at: c.at, mode: c.mode, aborted: c.signal?.aborted })), negatives: f.state.negatives }));
  try { expect(f.state.negatives).toEqual(f.state.expected); expect(f.state.pending).toBe(0); expect(vi.getTimerCount()).toBe(0); }
  finally { notifyManager.setScheduler(cb => { setTimeout(cb, 0); }); f.state.client = null; vi.useRealTimers(); }
});
it('succes201 : catalogue entier et signal ferme sans annuler le cache recu', async () => {
  await start(); expect(received()).toHaveLength(201); expect(status()).toBe('success'); expect(f.state.calls.map(c => c.page)).toEqual([0, 200]);
  expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true); expect(query.getQueryData(['projets'])).toHaveLength(201);
});
it('page2 a8000 : borne globale15000 et fermeture sans catalogue partiel', async () => {
  f.state.delayFirst = true; f.state.mode = 'hold'; await start(); await act(() => vi.advanceTimersByTimeAsync(8000)); await flush(); expect(f.state.calls.map(c => c.page)).toEqual([0, 200]); expect(received()).toBeUndefined();
  await act(() => vi.advanceTimersByTimeAsync(7000)); await flush(); expect(status()).toBe('error'); expect(received()).toBeUndefined(); expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true); expect(f.state.pending).toBe(0);
});
it('GET52014900 : UI15000 ferme signal et interdit dispatch15900', async () => {
  f.state.target = 0; f.state.mode = 'retry'; await start(); const at = f.state.calls[0].at;
  await act(() => vi.advanceTimersByTimeAsync(14900)); await flush(); expect(f.state.responses).toEqual([{ page: 0, at: at + 14900 }]);
  await act(() => vi.advanceTimersByTimeAsync(100)); await flush(); expect(status()).toBe('error');
  await act(() => vi.advanceTimersByTimeAsync(900)); await flush(); expect(f.state.calls).toHaveLength(1); expect(f.state.calls[0].signal?.aborted).toBe(true);
});
it('borne puis refetch explicite : nouveau signal et catalogue complet', async () => {
  f.state.mode = 'hold'; await start(); const old = f.state.calls[1]; await act(() => vi.advanceTimersByTimeAsync(15000)); await flush(); expect(old.signal?.aborted).toBe(true);
  f.state.mode = 'success'; await retry(); expect(received()).toHaveLength(201); expect(f.state.calls.map(c => c.page)).toEqual([0, 200, 0, 200]); expect(f.state.calls[3].signal).not.toBe(old.signal);
});
it('demontage : annulation ReactQuery propagee au transport propre', async () => {
  f.state.mode = 'hold'; await start(); expect(f.state.pending).toBe(1); await act(async () => root?.unmount()); root = null; await flush(); expect(f.state.calls.every(c => c.signal?.aborted)).toBe(true); expect(f.state.pending).toBe(0);
});
it('transport ignorant abort : page tardive jamais admise apres borne', async () => {
  f.state.mode = 'late'; await start(); await act(() => vi.advanceTimersByTimeAsync(15000)); await flush(); expect(f.state.calls[1].signal?.aborted).toBe(true);
  await act(() => vi.advanceTimersByTimeAsync(100)); await flush(); expect(status()).toBe('error'); expect(received()).toBeUndefined();
});
it('frontieres strictes avant preaborted : corps methode auth et insert refuses', async () => {
  const c = new AbortController(); c.abort(); const url = 'https://fixture.invalid/rest/v1/projets?select=*&order=created_at.desc,id.desc&offset=0&limit=200';
  await expect(fetchFixture(url, { method: 'GET', signal: c.signal })).rejects.toThrow('SIMULATION preaborted');
  f.state.expected = ['transport GET /rest/v1/projets', 'transport POST /rest/v1/projets', 'query.insert', 'SDK.auth'];
  await expect(fetchFixture(url, { method: 'GET', body: 'interdit', signal: c.signal })).rejects.toThrow('CAPACITE FERMEE'); await expect(fetchFixture(url, { method: 'POST', signal: c.signal })).rejects.toThrow('CAPACITE FERMEE');
  const client = f.state.client; if (!client) throw Error('client absent'); expect(() => Reflect.get(client.from('projets'), 'insert')).toThrow('CAPACITE FERMEE'); expect(() => Reflect.get(client, 'auth')).toThrow('CAPACITE FERMEE'); expect(f.state.calls).toHaveLength(0); expect(f.state.entries).toHaveLength(3);
});

it.each(['fr', 'en'])('%s : vraie page reprise, langue implantations et liens conserves', async lang => {
  f.state.mode = 'hold'; await start(lang);
  const headings = () => [...container.querySelectorAll('h3')].map(n => n.textContent);
  const links = () => [...container.querySelectorAll('a')].map(n => n.getAttribute('href'));
  const h = headings(), l = links(); expect(h.length).toBeGreaterThan(0);
  await act(() => vi.advanceTimersByTimeAsync(15000)); await flush();
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(lang === 'fr' ? 'Informations complémentaires indisponibles.' : 'Additional information unavailable.');
  expect(headings()).toEqual(h); expect(links()).toEqual(l);
  f.state.mode = 'success'; await retry();
  expect(received()).toHaveLength(201); expect(language.language).toBe(lang); expect(headings()).toEqual(h); expect(links()).toEqual(l);
  expect(container.textContent).toContain(lang === 'fr' ? 'Complement FR 0' : 'Complement EN 0');
});
