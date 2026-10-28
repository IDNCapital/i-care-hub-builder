import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DecrireMonBesoin from './DecrireMonBesoin';

type Row = { id: string; problematiques: unknown };
type Reply = { data: Row[] | null; error: { message: string } | null; count: number | null };
type Query = { columns: string; count?: string; filters: [string, unknown][]; orders: string[]; from: number; to: number };
const doubles = vi.hoisted(() => ({ invoke: vi.fn(), analytics: vi.fn(), read: null as unknown as (q: Query) => Reply | PromiseLike<Reply>, queries: [] as Query[] }));
// Les frontieres necessaires sont explicites dans le test livre, pas dans une config locale.
vi.mock('@/components/Layout', () => ({ Layout: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock('@/components/SeoHead', () => ({ SeoHead: () => null }));
vi.mock('@/lib/analytics', () => ({ Analytics: { formSubmission: doubles.analytics } }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  functions: { invoke: doubles.invoke },
  from(table: string) {
    if (table !== 'praticiens') throw new Error('Source non autorisee dans ce double.');
    const q: Query = { columns: '', filters: [], orders: [], from: 0, to: 999 };
    const builder = {
      select(columns: string, options?: { count: string }) { q.columns = columns; q.count = options?.count; return builder; },
      eq(name: string, value: unknown) { q.filters.push([name, value]); return builder; },
      order(name: string) { q.orders.push(name); return builder; },
      range(from: number, to: number) { q.from = from; q.to = to; return builder; },
      then(ok: (r: Reply) => unknown, ko?: (e: unknown) => unknown) { doubles.queries.push(structuredClone(q)); return Promise.resolve().then(() => doubles.read(q)).then(ok, ko); },
    };
    return builder;
  },
} }));

const ID = '00000000-0000-4000-8000-000000000001';
const MESSAGE = 'Message de test entierement fictif, sans information de sante.';
const PAYLOAD = { prenom: 'Personne', nom: 'Fictive', email: 'test@example.invalid', telephone: '0100000000', message: MESSAGE, problematiques_pressenties: ['Stress'], cabinet_prefere: null, consentement_rgpd: true, source: '/patients/decrire-mon-besoin', website: '' };
let rows: Row[], cap: number;
const roots: { root: Root; container: HTMLDivElement }[] = [];
const text = () => document.body.textContent ?? '';
const buttons = () => Array.from(document.querySelectorAll('button'));
const button = (label: string) => buttons().find(b => b.textContent?.trim() === label)!;
const field = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
function change(id: string, value: string) {
  const target = field(id), prototype = target instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(target, value);
  target.dispatchEvent(new Event('input', { bubbles: true }));
  target.dispatchEvent(new Event('change', { bubbles: true }));
}
async function waitFor(check: () => boolean) {
  const start = Date.now();
  while (!check()) { if (Date.now() - start > 1200) throw new Error('Etat attendu absent : ' + text()); await act(async () => { await new Promise(resolve => setTimeout(resolve, 5)); }); }
}
async function mount() {
  const container = document.createElement('div'); document.body.append(container); const root = createRoot(container); roots.push({ root, container });
  await act(async () => root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><DecrireMonBesoin /></MemoryRouter>));
  return { unmount: async () => { await act(async () => root.unmount()); container.remove(); roots.splice(roots.findIndex(x => x.root === root), 1); } };
}
async function fill() {
  await act(async () => {
    change('prenom', ' Personne '); change('nom', ' Fictive '); change('email', 'test@example.invalid'); change('telephone', '0100000000'); change('message', ' ' + MESSAGE + ' ');
    document.getElementById('consent')!.click(); button('Stress')?.click();
  });
}
const form = () => document.querySelector('form')!;
const submit = (element = form()) => element.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
function deferred<T>() { let resolve!: (r: T) => void; const promise = new Promise<T>(done => { resolve = done; }); return { resolve, promise }; }
const received = () => text().includes('Votre demande a bien été reçue.');

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
  rows = [{ id: ID, problematiques: ['Stress'] }]; cap = 1000;
  doubles.invoke.mockReset(); doubles.analytics.mockReset(); doubles.queries = [];
  doubles.invoke.mockResolvedValue({ data: { ok: true, id: ID }, error: null });
  doubles.read = q => ({ data: rows.slice(q.from, Math.min(q.to + 1, q.from + cap)), error: null, count: q.count === 'exact' ? rows.length : null });
  vi.spyOn(console, 'error').mockImplementation(() => {}); vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(async () => { for (const { root, container } of roots.splice(0)) { await act(async () => root.unmount()); container.remove(); } vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('recu conciergerie independant de sa mesure', () => {
  it('conserve le recu quand Analytics leve, avec le meme payload', async () => {
    doubles.analytics.mockImplementation(() => { throw new Error('mesure-fictive'); });
    await mount(); await fill(); expect(button('Envoyer ma demande').disabled).toBe(false); await act(async () => { submit(); });
    expect(doubles.invoke).toHaveBeenCalledTimes(1); expect(doubles.analytics).toHaveBeenCalledTimes(1);
    expect(received()).toBe(true); expect(text()).not.toContain('Une erreur est survenue');
    expect(doubles.invoke).toHaveBeenCalledExactlyOnceWith('submit-demande-conciergerie', { body: PAYLOAD });
    expect(doubles.analytics).toHaveBeenCalledExactlyOnceWith('conciergerie_patients', '/patients/decrire-mon-besoin');
  });
  it('une double soumission synchrone ne fait quune tentative', async () => {
    const pending = deferred<unknown>(); doubles.invoke.mockReturnValue(pending.promise);
    await mount(); await fill();
    await act(async () => { const target = form(); submit(target); submit(target); });
    expect(doubles.invoke).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve({ data: { ok: true, id: ID }, error: null }));
  });
  it.each([null, {}, { ok: 'true', id: ID }, { ok: 1, id: ID }, { ok: true }, { ok: true, id: 'invalide' }, { ok: true, id: ID, error: 'contradiction' }])('garde une reponse ambigue verrouillee : %j', async data => {
    doubles.invoke.mockResolvedValue({ data, error: null });
    await mount(); await fill(); await act(async () => { submit(); });
    expect(received()).toBe(false); expect(text()).toContain('Réception non confirmée');
    expect(button('Envoyer ma demande').disabled).toBe(true);
    await act(async () => { submit(); }); expect(doubles.invoke).toHaveBeenCalledTimes(1); expect(doubles.analytics).not.toHaveBeenCalled();
  });
  it.each([ID, 'honeypot'])('accepte le recu exact du backend sans changer les textes : %s', async id => {
    doubles.invoke.mockResolvedValue({ data: { ok: true, id }, error: null });
    await mount(); await fill(); if (id === 'honeypot') await act(async () => change('website', 'fictif.invalid'));
    await act(async () => { submit(); }); expect(received()).toBe(true); expect(text()).toContain('sous 48h ouvrées');
    expect(doubles.invoke).toHaveBeenCalledExactlyOnceWith('submit-demande-conciergerie', { body: { ...PAYLOAD, website: id === 'honeypot' ? 'fictif.invalid' : '' } });
  });
  it('ne rejoue pas un rejet reseau et conserve la saisie', async () => {
    doubles.invoke.mockRejectedValue(new Error('reseau-fictif')); await mount(); await fill(); await act(async () => { submit(); });
    expect(text()).toContain('Réception non confirmée'); expect(field('message').value).toBe(' ' + MESSAGE + ' ');
    await act(async () => { submit(); }); expect(doubles.invoke).toHaveBeenCalledTimes(1); expect(doubles.analytics).not.toHaveBeenCalled();
  });
  it('ferme une contradiction entre donnees et erreur SDK', async () => {
    doubles.invoke.mockResolvedValue({ data: { ok: true, id: ID }, error: { context: { status: 400 } } });
    await mount(); await fill(); await act(async () => { submit(); });
    expect(text()).toContain('Réception non confirmée'); expect(received()).toBe(false); expect(button('Envoyer ma demande').disabled).toBe(true);
  });
  it('ignore un recu tardif apres demontage sans mesure tardive', async () => {
    const pending = deferred<unknown>(); doubles.invoke.mockReturnValue(pending.promise);
    const view = await mount(); await fill(); await act(async () => { submit(); }); await view.unmount();
    await act(async () => pending.resolve({ data: { ok: true, id: ID }, error: null })); expect(doubles.analytics).not.toHaveBeenCalled();
  });
  it('preserve la validation locale et le consentement avant toute tentative', async () => {
    await mount(); await act(async () => { submit(); }); expect(doubles.invoke).not.toHaveBeenCalled();
    await fill(); await act(async () => { document.getElementById('consent')!.click(); }); await act(async () => { submit(); });
    expect(doubles.invoke).not.toHaveBeenCalled(); expect(document.querySelector('a[href="/confidentialite/"]')).not.toBeNull();
  });
  it.each([400, 429])('permet une correction volontaire apres le seul refus certain HTTP%s', async status => {
    doubles.invoke.mockResolvedValueOnce({ data: null, error: { context: { status } } }).mockResolvedValueOnce({ data: { ok: true, id: ID }, error: null });
    await mount(); await fill(); await act(async () => { submit(); });
    expect(received()).toBe(false); expect(button('Envoyer ma demande').disabled).toBe(false);
    if (status === 429) expect(text()).toContain('Merci de réessayer dans une heure.');
    await act(async () => { submit(); }); expect(received()).toBe(true); expect(doubles.invoke).toHaveBeenCalledTimes(2);
  });
});

describe('referentiel de problematiques recu ou inconnu', () => {
  it.each(['refus', 'rejet', 'page nulle', 'compte absent'])('nomme la source inconnue sans inventer de choix : %s', async failure => {
    doubles.read = () => failure === 'rejet' ? Promise.reject(new Error('refus-fictif')) : { data: failure === 'page nulle' ? null : [], count: failure === 'compte absent' ? null : 0, error: failure === 'refus' ? { message: 'refus-fictif' } : null };
    await mount(); await waitFor(() => text().includes('Les problématiques sont indisponibles'));
    expect(button('Stress')).toBeUndefined(); expect(doubles.invoke).not.toHaveBeenCalled();
  });
  it('lit toutes les pages sous plafond reduit avec compte exact, ID et filtres publics', async () => {
    cap = 2; rows = Array.from({ length: 5 }, (_, i) => ({ id: `00000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`, problematiques: ['Choix ' + i, 'Stress'] }));
    await mount(); await waitFor(() => Boolean(button('Choix 4')));
    expect(doubles.queries.map(q => q.from)).toEqual([0, 2, 4]);
    expect(doubles.queries.every(q => q.count === 'exact' && q.orders.join() === 'id' && JSON.stringify(q.filters) === JSON.stringify([['statut_validation', 'validee'], ['actif', true]]))).toBe(true);
    expect(button('Stress')).not.toBeUndefined();
  });
  it('reserve le vrai vide a une collection confirmee', async () => {
    rows = []; await mount(); await waitFor(() => text().includes('Aucune problématique proposée actuellement.'));
    expect(text()).not.toContain('Les problématiques sont indisponibles');
  });
  it('reprend seulement la lecture refusee sans soumettre une demande', async () => {
    doubles.read = () => ({ data: null, error: { message: 'refus-fictif' }, count: null }); await mount(); await waitFor(() => Boolean(button('Réessayer les problématiques')));
    doubles.read = q => ({ data: rows.slice(q.from, q.to + 1), error: null, count: rows.length });
    await act(async () => button('Réessayer les problématiques').click()); await waitFor(() => Boolean(button('Stress')));
    expect(doubles.queries).toHaveLength(2); expect(doubles.invoke).not.toHaveBeenCalled();
  });
  it.each(['compte variable', 'ID repete', 'page prematurement vide', 'choix malformes'])('ne publie aucun referentiel partiel : %s', async failure => {
    cap = 1; rows.push({ id: '00000000-0000-4000-8000-000000000002', problematiques: ['Autre choix'] });
    doubles.read = q => {
      const data = rows.slice(q.from, q.from + cap);
      if (failure === 'choix malformes') return { data: [{ id: ID, problematiques: 'invalide' }], count: 1, error: null };
      if (failure === 'compte variable') return { data, count: q.from === 0 ? 3 : 2, error: null };
      if (q.from > 0 && failure === 'ID repete') return { data: [rows[0]], count: 2, error: null };
      if (q.from > 0 && failure === 'page prematurement vide') return { data: [], count: 2, error: null };
      return { data, count: 2, error: null };
    };
    await mount(); await waitFor(() => text().includes('Les problématiques sont indisponibles'));
    expect(button('Stress')).toBeUndefined(); expect(button('Autre choix')).toBeUndefined();
  });
  it('ne poursuit pas la pagination du referentiel apres demontage', async () => {
    const pending = deferred<Reply>(); doubles.read = () => pending.promise;
    const view = await mount(); await view.unmount();
    await act(async () => pending.resolve({ data: rows, error: null, count: 2 }));
    expect(doubles.queries).toHaveLength(1); expect(doubles.invoke).not.toHaveBeenCalled();
  });
});


it.each(['lignes', 'pages'])('borne les appels de referentiel sans inventer de choix : %s', async boundary => {
  doubles.read = q => ({ data: [{ id: `00000000-0000-4000-8000-${String(q.from + 1).padStart(12, '0')}`, problematiques: ['Stress'] }], error: null, count: boundary === 'lignes' ? 10001 : 51 });
  await mount(); await waitFor(() => text().includes('Les problématiques sont indisponibles'));
  expect(doubles.queries).toHaveLength(boundary === 'lignes' ? 1 : 50);
  expect(button('Stress')).toBeUndefined(); expect(doubles.invoke).not.toHaveBeenCalled();
});
