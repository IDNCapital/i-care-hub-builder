import { act, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const h = vi.hoisted(() => ({ call: vi.fn(), token: 'session-fictive-A' as string | null, errors: [] as string[], relanceAttendue: null as string | null }));
vi.mock('@/lib/adminAuth', () => ({ callAdminFunction: h.call, getAdminToken: () => h.token }));
vi.mock('sonner', () => ({ toast: { error: (s: string) => h.errors.push(s), success: vi.fn() } }));
import AdminExtractions from '../../src/pages/admin/AdminExtractions';
const praticien = (id = 'A', patch: Record<string, unknown> = {}) => ({ id, slug: `fiche-${id}`, prenom: `Prénom-${id}`, nom: `Nom-${id}`, profession: 'Profession fictive', cabinet_slug: 'cabinet-fictif', tags_extraction_status: 'error', tags_extracted_at: null, tags_extraction_log: [], ...patch });
const deferred = <T,>() => { let resolve!: (v: T) => void; let reject!: (e: unknown) => void; const promise = new Promise<T>((a,b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
let root: Root | undefined;
let host: HTMLDivElement;
async function mount(strict = false) { host = document.createElement('div'); document.body.append(host); root = createRoot(host); const app = <MemoryRouter><AdminExtractions /></MemoryRouter>; await act(async () => root!.render(strict ? <StrictMode>{app}</StrictMode> : app)); }
const text = () => host.textContent ?? '';
const refresh = () => [...host.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Rafraîchir')!;
async function clickRefresh() { await act(async () => refresh().click()); }
beforeEach(() => { Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }); h.errors = []; h.relanceAttendue = null; h.token = 'session-fictive-A'; h.call.mockReset().mockImplementation(async name => { if (name !== 'admin-list-praticiens') throw Error('Déclenchement métier interdit'); return { praticiens: [praticien()] }; }); vi.stubGlobal('fetch', vi.fn(() => { throw Error('Réseau réel interdit'); })); });
afterEach(async () => { if (root) await act(async () => root!.unmount()); root = undefined; expect(fetch).not.toHaveBeenCalled(); expect(h.call.mock.calls.filter(([name]) => name === 'admin-list-praticiens').every(([, body]) => JSON.stringify(body) === '{}')).toBe(true); expect(h.call.mock.calls.filter(([name]) => name !== 'admin-list-praticiens')).toEqual(h.relanceAttendue ? [['admin-reextract-tags', { praticien_id: h.relanceAttendue }]] : []); document.body.innerHTML = ''; document.head.innerHTML = ''; vi.unstubAllGlobals(); Reflect.deleteProperty(globalThis,'IS_REACT_ACT_ENVIRONMENT'); });
describe('CAUSES compteurs et reçus', () => {
  it('CAUSE refus initial ne confirme aucun groupe vide', async () => { h.call.mockRejectedValue(Error('Refus fictif')); await mount(); expect(host.querySelector('[role="alert"]')).toBeTruthy(); expect(text()).not.toContain('0 succès'); expect(text()).not.toContain('Aucune fiche dans cet état.'); expect(text()).toContain('Erreurs (?)'); });
  it('CAUSE une nouvelle lecture retire les compteurs et fiches précédents', async () => { await mount(); const d = deferred<unknown>(); h.call.mockReturnValue(d.promise); await clickRefresh(); expect(text()).not.toContain('Prénom-A'); expect(text()).not.toContain('Erreurs (1)'); expect(text()).toContain('Erreurs (?)'); });
  it('CAUSE deux retours inversés conservent le dernier reçu demandé', async () => { await mount(); const a = deferred<unknown>(), b = deferred<unknown>(); h.call.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise); const button = refresh(); await act(async () => { button.click(); button.click(); }); await act(async () => b.resolve({ praticiens: [praticien('B')] })); await act(async () => a.resolve({ praticiens: [praticien('Ancien')] })); expect(text()).toContain('Prénom-B'); expect(text()).not.toContain('Prénom-Ancien'); });
  it('CAUSE une enveloppe incomplète ne devient pas cinq compteurs zéro', async () => { h.call.mockResolvedValue({}); await mount(); expect(host.querySelector('[role="alert"]')).toBeTruthy(); expect(text()).toContain('Erreurs (?)'); });
  it('CAUSE un changement de session pendant lecture ne publie pas le reçu', async () => { const d = deferred<unknown>(); h.call.mockReturnValue(d.promise); await mount(); h.token = 'session-fictive-B'; await act(async () => d.resolve({ praticiens: [praticien()] })); expect(host.querySelector('[role="alert"]')).toBeTruthy(); expect(text()).not.toContain('Prénom-A'); });
});

describe('Réceptions qualifiées', () => {
  it('le vrai zéro reçu affiche cinq comptes connus', async () => { h.call.mockResolvedValue({ praticiens: [] }); await mount(); expect(text()).toContain('0 succès'); expect(text()).toContain('Erreurs (0)'); expect(text()).toContain('Aucune fiche dans cet état.'); expect(text()).toContain('0 fiches reçues'); expect(host.querySelector('[role="alert"]')).toBeNull(); });
  it.each([null, undefined, {}, { praticiens: null }, { praticiens: {} }, { praticiens: [null] }, { praticiens: [praticien(), praticien()] }, { praticiens: [praticien(' ')] }, { praticiens: [praticien('A', { nom: 1 })] }, { praticiens: [praticien('A', { tags_extraction_status: 'étranger' })] }, { praticiens: [praticien('A', { tags_extraction_status: null })] }, { praticiens: [praticien('A', { tags_extracted_at: 'invalide' })] }, { praticiens: [praticien('A', { tags_extraction_log: [{ reason: {} }] })] }, { praticiens: [praticien('A', { tags_extraction_log: [{ specialites_count: -1 }] })] }])('un reçu incohérent %j reste inconnu', async receipt => { h.call.mockResolvedValue(receipt); await mount(); expect(host.querySelector('[role="alert"]')).toBeTruthy(); expect(text()).toContain('Comptes des extractions indisponibles'); expect(text()).toContain('Erreurs (?)'); expect(text()).not.toContain('Aucune fiche dans cet état.'); expect(host.querySelector('tbody')).toBeNull(); });
  it('une racine tableau est une enveloppe inconnue', async () => { h.call.mockResolvedValue([]); await mount(); expect(host.querySelector('[role="alert"]')).toBeTruthy(); expect(text()).toContain('Erreurs (?)'); expect(text()).not.toContain('Aucune fiche dans cet état.'); });
  it('les cinq statuts conservent leur groupe et leur comptage', async () => { h.call.mockResolvedValue({ praticiens: ['success','review','error','skipped','pending'].map(s => praticien(s, { tags_extraction_status: s })) }); await mount(); expect(text()).toContain('1 succès'); expect(text()).toContain('1 à vérifier'); expect(text()).toContain('1 erreurs'); expect(text()).toContain('1 ignorés'); expect(text()).toContain('1 en attente'); expect(host.querySelectorAll('tbody tr')).toHaveLength(1); });
  it('le dernier message réel conserve sa description sans lire les anciens journaux', async () => { h.call.mockResolvedValue({ praticiens: [praticien('A', { tags_extraction_log: [null, { reason: 'motif courant', confiance: 'haute', specialites_count: 2, problematiques_count: 3, taxonomy_version: 'inchangée' }] })] }); await mount(); expect(text()).toContain('motif courant, confiance haute, 2 spé · 3 pb'); expect(host.querySelector('[role="alert"]')).toBeNull(); });
  it.each([{ journal: null }, { journal: [] }, { journal: [null] }, { journal: undefined }])('un journal absent qualifié %j garde le parseur historique et les comptes reçus', async ({ journal: tags_extraction_log }) => { h.call.mockResolvedValue({ praticiens: [praticien('A', { tags_extraction_log })] }); await mount(); expect(text()).toContain('Erreurs (1)'); expect(text()).toContain('Prénom-A'); expect(host.querySelector('[role="alert"]')).toBeNull(); });
  it('une reprise relit seulement la liste existante et quitte le refus', async () => { h.call.mockRejectedValueOnce(Error('Refus')); await mount(); const retry = [...host.querySelectorAll('button')].find(b => b.textContent === 'Réessayer la lecture')!; expect(retry).toBeTruthy(); await act(async () => retry.click()); expect(text()).toContain('Prénom-A'); expect(host.querySelector('[role="alert"]')).toBeNull(); expect(h.call).toHaveBeenCalledTimes(2); });
  it('un rejet sans message conserve le statut inconnu et une reprise', async () => { h.call.mockRejectedValue(new Error('')); await mount(); expect(text()).toContain('Erreur de chargement'); expect(text()).toContain('Erreurs (?)'); expect(host.querySelector('[role="alert"]')).toBeTruthy(); });
});
describe('Reprises et générations', () => {
  it('un ancien refus ne modifie pas la liste nouvelle ni les toasts', async () => { await mount(); const a = deferred<unknown>(), b = deferred<unknown>(); h.call.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise); const button = refresh(); await act(async () => { button.click(); button.click(); }); await act(async () => b.resolve({ praticiens: [praticien('B')] })); await act(async () => a.reject(Error('Ancien refus'))); expect(text()).toContain('Prénom-B'); expect(h.errors).toEqual([]); });
  it('le dernier refus ne laisse pas revenir une ancienne réussite', async () => { await mount(); const a = deferred<unknown>(), b = deferred<unknown>(); h.call.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise); const button = refresh(); await act(async () => { button.click(); button.click(); }); await act(async () => b.reject(Error('Refus courant'))); await act(async () => a.resolve({ praticiens: [praticien('Ancien')] })); expect(text()).toContain('Refus courant'); expect(text()).not.toContain('Prénom-Ancien'); expect(text()).toContain('Erreurs (?)'); });
  it.each(['succès','rejet'])('un retour %s après démontage est abandonné', async kind => { const d = deferred<unknown>(); h.call.mockReturnValue(d.promise); await mount(); await act(async () => root!.unmount()); root = undefined; await act(async () => { if (kind === 'succès') d.resolve({ praticiens: [praticien()] }); else d.reject(Error('Trop tard')); }); expect(h.errors).toEqual([]); expect(host.textContent).toBe(''); expect(h.call).toHaveBeenCalledTimes(1); });
  it('StrictMode ne publie que la lecture encore active', async () => { const d = deferred<unknown>(); h.call.mockReturnValueOnce(d.promise).mockResolvedValue({ praticiens: [praticien('B')] }); await mount(true); expect(text()).toContain('Prénom-B'); await act(async () => d.resolve({ praticiens: [praticien('Ancien')] })); expect(text()).not.toContain('Prénom-Ancien'); expect(h.call).toHaveBeenCalledTimes(2); });
  it('une session absente ne lit pas la liste admin', async () => { h.token = null; await mount(); expect(h.call).not.toHaveBeenCalled(); expect(text()).toContain('Session admin expirée'); });
  it('une session expirée pendant lecture retire le reçu', async () => { const d = deferred<unknown>(); h.call.mockReturnValue(d.promise); await mount(); h.token = null; await act(async () => d.resolve({ praticiens: [praticien()] })); expect(text()).toContain('Session admin modifiée'); expect(text()).not.toContain('Prénom-A'); });
});


describe('Verrou de relance et générations de lecture', () => {
  it.each(['réception', 'rejet'])('une relance pendante garde son verrou après Rafraîchir puis %s', async issue => {
    const id = '10000000-0000-4000-8000-000000000001';
    const pending = deferred<unknown>();
    let confirme = false;
    h.relanceAttendue = id;
    h.call.mockImplementation(name => {
      if (name === 'admin-list-praticiens') return Promise.resolve({ praticiens: [praticien(id, { tags_extraction_log: [{ reason: confirme ? 'Message relu après la réponse fictive' : 'Message de la lecture fictive' }] })] });
      if (name === 'admin-reextract-tags') return pending.promise;
      return Promise.reject(Error('Endpoint interdit dans la fixture'));
    });
    await mount();
    const bouton = () => [...host.querySelectorAll('button')].find(b => b.textContent?.trim() === 'Relancer')!;
    await act(async () => bouton().click());
    expect(bouton().disabled).toBe(true);
    await clickRefresh();
    expect(bouton().disabled).toBe(true);
    expect(text()).toContain('Message de la lecture fictive');
    expect(h.call.mock.calls.filter(([name]) => name === 'admin-reextract-tags')).toHaveLength(1);
    await act(async () => {
      if (issue === 'réception') { confirme = true; pending.resolve({ ok: true }); }
      else pending.reject(Error('Refus entièrement fictif'));
    });
    expect(bouton().disabled).toBe(false);
    if (issue === 'réception') expect(text()).toContain('Message relu après la réponse fictive');
    expect(h.call.mock.calls.filter(([name]) => name === 'admin-list-praticiens')).toHaveLength(issue === 'réception' ? 3 : 2);
  });
});
