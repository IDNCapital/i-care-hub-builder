import { act, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useNavigate, type NavigateFunction } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import PreviewPraticien from '../../src/pages/PreviewPraticien';

const h = vi.hoisted(() => ({ read: null as unknown as (name: string, args: unknown) => Promise<unknown>, calls: [] as unknown[] }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { rpc: (name: string, args: unknown) => { h.calls.push({ name, args }); return h.read(name, args); } } }));
vi.mock('@/components/praticiens/FichePraticien', () => ({ FichePraticien: ({ praticien }: { praticien: { prenom: string; slug: string } }) => <article>{praticien.prenom}|{praticien.slug}</article> }));
const row = (slug = 'a', prenom = 'Fiche A') => ({ id: slug, slug, prenom, nom: 'Fictif', statut_validation: 'brouillon', profession: 'Praticien', cabinet_slug: 'lieu-fictif', specialites: [] });
const deferred = <T,>() => { let resolve!: (value: T) => void; let reject!: (reason: unknown) => void; const promise = new Promise<T>((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
let root: Root | undefined;
let navigate: NavigateFunction;
function Navigation() { navigate = useNavigate(); return null; }
const text = () => document.body.textContent ?? '';
async function settle() { await act(async () => { await Promise.resolve(); }); }
async function mount(strict = false, path = '/preview/a/fictif-a') { const host = document.createElement('div'); document.body.append(host); root = createRoot(host); const content = <MemoryRouter initialEntries={[path]}><Navigation /><Routes><Route path="/preview/:slug/:token" element={<PreviewPraticien />} /><Route path="*" element={<PreviewPraticien />} /></Routes></MemoryRouter>; await act(async () => root!.render(strict ? <StrictMode>{content}</StrictMode> : content)); }
async function go(path: string) { await act(async () => { navigate(path); }); }
async function retry() { const button = [...document.querySelectorAll('button')].find(b => b.textContent === 'Réessayer'); expect(button).toBeTruthy(); await act(async () => button!.click()); }
beforeEach(() => { Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }); h.calls = []; h.read = async () => ({ data: [row()], error: null }); vi.stubGlobal('fetch', vi.fn(() => { throw Error('Réseau réel interdit'); })); });
afterEach(async () => { if (root) await act(async () => root!.unmount()); root = undefined; expect(fetch).not.toHaveBeenCalled(); document.body.innerHTML = ''; vi.unstubAllGlobals(); });

it('causal refus réseau distinct du lien invalide', async () => { h.read = async () => ({ data: null, error: { message: 'Refus fictif' } }); await mount(); expect(text()).toContain('Aperçu indisponible'); expect(text()).not.toContain('Lien expiré ou invalide'); expect(document.querySelector('article')).toBeNull(); });
it('causal nouvelle fiche retire A pendant B', async () => { await mount(); expect(text()).toContain('Fiche A'); const d = deferred<unknown>(); h.read = () => d.promise; await go('/preview/b/fictif-b'); expect(text()).not.toContain('Fiche A'); expect(text()).toContain("Chargement de l'aperçu"); });
it('causal nouveau token du même slug retire la fiche reçue', async () => { await mount(); const d = deferred<unknown>(); h.read = () => d.promise; await go('/preview/a/fictif-b'); expect(document.querySelector('article')).toBeNull(); });
it('causal lien invalide A ne masque pas B reçu', async () => { h.read = async () => ({ data: [], error: null }); await mount(); expect(text()).toContain('Lien expiré ou invalide'); h.read = async () => ({ data: [row('b', 'Fiche B')], error: null }); await go('/preview/b/fictif-b'); expect(text()).toContain('Fiche B'); expect(text()).not.toContain('Lien expiré ou invalide'); });
it('causal réponse malformée ne devient pas une fiche reçue', async () => { h.read = async () => ({ data: [{}], error: null }); await mount(); expect(text()).toContain('Aperçu indisponible'); expect(document.querySelector('article')).toBeNull(); });

it('complément rejet capturé et reprise avec les mêmes arguments', async () => { h.read = async () => { throw Error('Rejet fictif'); }; await mount(); expect(document.querySelector('[role="alert"]')?.textContent).toContain('Aperçu indisponible'); h.read = async () => ({ data: [row()], error: null }); await retry(); expect(text()).toContain('Fiche A'); expect(h.calls).toEqual([{ name: 'get_praticien_preview', args: { p_slug: 'a', p_token: 'fictif-a' } }, { name: 'get_praticien_preview', args: { p_slug: 'a', p_token: 'fictif-a' } }]); });
it('complément ancien succès A ne remplace pas B reçu', async () => { const a = deferred<unknown>(); h.read = () => a.promise; await mount(); h.read = async () => ({ data: [row('b', 'Fiche B')], error: null }); await go('/preview/b/fictif-b'); await act(async () => a.resolve({ data: [row()], error: null })); expect(text()).toContain('Fiche B'); expect(text()).not.toContain('Fiche A'); });
it('complément ancien rejet ne dégrade pas B reçu', async () => { const a = deferred<unknown>(); h.read = () => a.promise; await mount(); h.read = async () => ({ data: [row('b', 'Fiche B')], error: null }); await go('/preview/b/fictif-b'); await act(async () => a.reject(Error('Rejet ancien'))); expect(text()).toContain('Fiche B'); expect(document.querySelector('[role="alert"]')).toBeNull(); });
it('complément StrictMode ignore le premier reçu abandonné', async () => { const a = deferred<unknown>(); let n = 0; h.read = () => ++n === 1 ? a.promise : Promise.resolve({ data: [row('a', 'Fiche courante')], error: null }); await mount(true); await act(async () => a.resolve({ data: [row()], error: null })); expect(text()).toContain('Fiche courante'); expect(text()).not.toContain('Fiche A'); });
it('complément démontage ignore un rejet sans effet externe', async () => { const a = deferred<unknown>(); h.read = () => a.promise; await mount(); await act(async () => root!.unmount()); root = undefined; await act(async () => a.reject(Error('Rejet après démontage'))); expect(document.querySelector('article')).toBeNull(); });
it.each([null, [row('b')], [row(), row()], { id: 'a', slug: 'a', prenom: 1, nom: 'Fictif' }])('complément réponse incompatible %j reste indisponible', async data => { h.read = async () => ({ data, error: null }); await mount(); expect(text()).toContain('Aperçu indisponible'); expect(document.querySelector('article')).toBeNull(); });
it('complément compatible objet unique conserve le rendu existant', async () => { h.read = async () => ({ data: row(), error: null }); await mount(); expect(text()).toContain('Fiche A'); expect(text()).toContain('Cette fiche vous convient ?'); expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow,noarchive'); expect(document.body.innerHTML).not.toContain('fictif-a'); });
it('complément paramètres absents ne lancent aucun RPC', async () => { await mount(false, '/preview'); expect(h.calls).toHaveLength(0); expect(text()).toContain('Lien expiré ou invalide'); });
