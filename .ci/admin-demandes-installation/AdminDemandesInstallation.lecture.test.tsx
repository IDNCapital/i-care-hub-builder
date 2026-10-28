import { act, StrictMode, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const h = vi.hoisted(() => ({ call: vi.fn(), logout: vi.fn(), token: 'session-fictive-A' as string | null, errors: [] as string[], ecritureAttendue: null as null | { id: string; statut: string; notes_internes: string } }));
vi.mock('@/lib/adminAuth', () => ({ callAdminFunction: h.call, adminLogout: h.logout, getAdminToken: () => h.token }));
vi.mock('sonner', () => ({ toast: { error: (s: string) => h.errors.push(s), success: vi.fn() } }));
vi.mock('@/components/ui/sheet', () => ({ Sheet: ({ open, children }: { open: boolean; children: ReactNode }) => open ? <div role="dialog">{children}</div> : null, SheetContent: ({ children }: { children: ReactNode }) => <div>{children}</div>, SheetHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>, SheetTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>, SheetFooter: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
import AdminDemandesInstallation from '../../src/pages/admin/AdminDemandesInstallation';
const demande = (id = 'demande-A', patch: Record<string, unknown> = {}) => ({ id, profession_slug: 'profession-fictive', ville_slug: null, nom: `Nom ${id}`, email: `${id}@example.test`, telephone: null, message: `Message ${id}`, consentement_rgpd: true, source_path: '/sinstaller', statut: 'nouvelle', notes_internes: null, created_at: '2026-10-28T10:00:00Z', ...patch });
const deferred = <T,>() => { let resolve!: (v: T) => void; let reject!: (e: unknown) => void; const promise = new Promise<T>((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
let root: Root | undefined;
let host: HTMLDivElement;
async function mount(strict = false) { host = document.createElement('div'); document.body.append(host); root = createRoot(host); await act(async () => root!.render(strict ? <StrictMode><MemoryRouter><AdminDemandesInstallation /></MemoryRouter></StrictMode> : <MemoryRouter><AdminDemandesInstallation /></MemoryRouter>)); }
const text = () => host.textContent ?? '';
const refresh = () => [...host.querySelectorAll('button')].find(b => b.textContent === 'Actualiser')!;
async function clickRefresh() { await act(async () => refresh().click()); }
async function selectFirst() { const row = host.querySelector('tbody tr') as HTMLElement; expect(row).toBeTruthy(); await act(async () => row.click()); }
beforeEach(() => { Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }); h.token = 'session-fictive-A'; h.errors = []; h.ecritureAttendue = null; h.call.mockReset().mockImplementation(async name => { if (name !== 'admin-list-demandes-installation') throw Error('Écriture interdite dans ces tests'); return { demandes: [demande()] }; }); h.logout.mockReset(); vi.stubGlobal('fetch', vi.fn(() => { throw Error('Réseau réel interdit'); })); });
afterEach(async () => { if (root) await act(async () => root!.unmount()); root = undefined; expect(fetch).not.toHaveBeenCalled(); expect(h.call.mock.calls.filter(([name]) => name === 'admin-list-demandes-installation').every(([, body]) => JSON.stringify(body) === '{}')).toBe(true); expect(h.call.mock.calls.filter(([name]) => name !== 'admin-list-demandes-installation')).toEqual(h.ecritureAttendue ? [['admin-update-demande-installation', h.ecritureAttendue]] : []); document.body.innerHTML = ''; document.head.innerHTML = ''; vi.unstubAllGlobals(); Reflect.deleteProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT'); });
describe('CAUSES de lecture', () => {
  it('CAUSE refus initial distinct de zéro reçu', async () => { h.call.mockRejectedValue(Error('Refus fictif')); await mount(); expect(host.querySelector('[role="alert"]')).toBeTruthy(); expect(text()).not.toContain('Aucune demande.'); expect(text()).not.toContain('0 / 0 demandes'); });
  it('CAUSE une nouvelle lecture retire la sélection et les anciennes notes', async () => { await mount(); await selectFirst(); expect(host.querySelector('[role="dialog"]')).toBeTruthy(); const d = deferred<unknown>(); h.call.mockReturnValue(d.promise); await clickRefresh(); expect(host.querySelector('[role="dialog"]')).toBeNull(); expect(text()).not.toContain('Nom demande-A'); expect(text()).not.toContain('1 / 1 demandes'); });
  it('CAUSE deux lectures inversées ne rétablissent pas la première réponse', async () => { await mount(); const a = deferred<unknown>(), b = deferred<unknown>(); h.call.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise); const bouton = refresh(); await act(async () => { bouton.click(); bouton.click(); }); expect(h.call).toHaveBeenCalledTimes(3); await act(async () => b.resolve({ demandes: [demande('demande-B')] })); await act(async () => a.resolve({ demandes: [demande('ancienne-A')] })); expect(text()).toContain('Nom demande-B'); expect(text()).not.toContain('Nom ancienne-A'); });
  it('CAUSE une enveloppe incomplète reste inconnue', async () => { h.call.mockResolvedValue({}); await mount(); expect(host.querySelector('[role="alert"]')).toBeTruthy(); expect(text()).not.toContain('Aucune demande.'); });
  it('CAUSE la limite 500 est explicite sans total global inventé', async () => { h.call.mockResolvedValue({ demandes: Array.from({ length: 500 }, (_, n) => demande(`demande-${n}`)) }); await mount(); expect(text()).toMatch(/500.*plus récentes/); expect(text()).toMatch(/limite atteinte/i); expect(text()).not.toContain('500 / 500 demandes'); });
});

describe('Reçus et inconnus', () => {
  it('confirme le vrai zéro reçu sans inventer un total global', async () => { h.call.mockResolvedValue({ demandes: [] }); await mount(); expect(text()).toContain('0 affichées / 0 reçues'); expect(text()).toContain('Aucune demande.'); expect(text()).toContain('Le serveur ne fournit pas de total global.'); expect(host.querySelector('[role="alert"]')).toBeNull(); });
  it.each([null, undefined, [], { demandes: null }, { demandes: {} }, { demandes: [null] }, { demandes: [demande(), demande()] }, { demandes: [demande(' ', {})] }, { demandes: [demande('A', { created_at: 'inconnue' })] }, { demandes: [demande('A', { statut: 'inconnu' })] }, { demandes: [demande('A', { statut: 'toString' })] }, { demandes: [demande('A', { notes_internes: 1 })] }, { demandes: [demande('A', { consentement_rgpd: 'true' })] }, { demandes: [demande('A', { email: undefined })] }, { demandes: [], error: false }])('un reçu mal formé %j ne devient ni liste vide ni liste partielle', async receipt => { h.call.mockResolvedValue(receipt); await mount(); expect(host.querySelector('[role="alert"]')).toBeTruthy(); expect(text()).toContain('Nombre de demandes inconnu'); expect(text()).not.toContain('Aucune demande.'); expect(host.querySelector('table')).toBeNull(); });
  it('un reçu de plus de 500 lignes ne tronque pas silencieusement la réponse', async () => { h.call.mockResolvedValue({ demandes: Array.from({ length: 501 }, (_, n) => demande(`id-${n}`)) }); await mount(); expect(host.querySelector('[role="alert"]')).toBeTruthy(); expect(host.querySelector('table')).toBeNull(); });
  it('les champs nullables réels restent consultables sans substitution', async () => { await mount(); await selectFirst(); expect(host.querySelector('[role="dialog"]')?.textContent).toContain('Aucun (index)'); expect(host.querySelector('textarea')?.value).toBe(''); expect(host.querySelector('[role="dialog"]')?.textContent).toContain('Message demande-A'); });
  it('un éventuel total hors contrat n’est pas pris pour un compte reçu', async () => { h.call.mockResolvedValue({ demandes: [demande()], total: 99999 }); await mount(); expect(text()).toContain('1 affichées / 1 reçues'); expect(text()).not.toContain('99999'); expect(text()).toContain('500 demandes les plus récentes'); });
  it('une reprise quitte le refus et ne relit que la liste admin existante', async () => { h.call.mockRejectedValueOnce(Error('Refus fictif')); await mount(); const bouton = [...host.querySelectorAll('button')].find(b => b.textContent === 'Réessayer la lecture')!; expect(bouton).toBeTruthy(); await act(async () => bouton.click()); expect(text()).toContain('Nom demande-A'); expect(host.querySelector('[role="alert"]')).toBeNull(); expect(h.call).toHaveBeenCalledTimes(2); });
});
describe('Session et retours', () => {
  it('une session absente ne lance pas la lecture admin', async () => { h.token = null; await mount(); expect(h.call).not.toHaveBeenCalled(); expect(text()).toContain('Session admin expirée'); expect(host.querySelector('[role="alert"]')).toBeTruthy(); });
  it.each(['session-fictive-B', null])('un changement de session pendant lecture %j retire le résultat', async token => { const d = deferred<unknown>(); h.call.mockReturnValue(d.promise); await mount(); h.token = token; await act(async () => d.resolve({ demandes: [demande()] })); expect(host.querySelector('[role="alert"]')).toBeTruthy(); expect(text()).toContain('Session admin modifiée'); expect(text()).not.toContain('Nom demande-A'); });
  it('un ancien refus après la nouvelle liste ne publie pas de toast ou erreur', async () => { await mount(); const a = deferred<unknown>(), b = deferred<unknown>(); h.call.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise); const bouton = refresh(); await act(async () => { bouton.click(); bouton.click(); }); await act(async () => b.resolve({ demandes: [demande('B')] })); await act(async () => a.reject(Error('Ancien refus'))); expect(text()).toContain('Nom B'); expect(h.errors).toEqual([]); expect(host.querySelector('[role="alert"]')).toBeNull(); });
  it('le refus de la nouvelle lecture ne rétablit pas une ancienne réponse réussie', async () => { await mount(); const a = deferred<unknown>(), b = deferred<unknown>(); h.call.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise); const bouton = refresh(); await act(async () => { bouton.click(); bouton.click(); }); await act(async () => b.reject(Error('Refus courant'))); await act(async () => a.resolve({ demandes: [demande('Ancienne')] })); expect(text()).toContain('Refus courant'); expect(text()).not.toContain('Nom Ancienne'); expect(host.querySelector('table')).toBeNull(); });
  it.each(['succès', 'rejet'])('un retour %s après démontage n’a pas d’effet', async kind => { const d = deferred<unknown>(); h.call.mockReturnValue(d.promise); await mount(); await act(async () => root!.unmount()); root = undefined; await act(async () => { if (kind === 'succès') d.resolve({ demandes: [demande()] }); else d.reject(Error('Ancien refus')); }); expect(h.errors).toEqual([]); expect(h.call).toHaveBeenCalledTimes(1); expect(host.textContent).toBe(''); });
  it('StrictMode n’utilise que la lecture encore active', async () => { const d = deferred<unknown>(); h.call.mockReturnValueOnce(d.promise).mockResolvedValue({ demandes: [demande('B')] }); await mount(true); expect(text()).toContain('Nom B'); await act(async () => d.resolve({ demandes: [demande('Ancienne')] })); expect(text()).not.toContain('Nom Ancienne'); expect(h.call).toHaveBeenCalledTimes(2); });
});
describe('Sélection et filtres de la visite', () => {
  it('le nouveau détail appartient uniquement au nouveau reçu', async () => { h.call.mockResolvedValueOnce({ demandes: [demande('A', { notes_internes: 'Notes anciennes A' })] }); await mount(); await selectFirst(); expect(host.querySelector('textarea')?.value).toBe('Notes anciennes A'); h.call.mockResolvedValue({ demandes: [demande('B', { notes_internes: 'Notes courantes B' })] }); await clickRefresh(); expect(host.querySelector('[role="dialog"]')).toBeNull(); await selectFirst(); expect(host.querySelector('[role="dialog"]')?.textContent).toContain('Nom B'); expect(host.querySelector('textarea')?.value).toBe('Notes courantes B'); expect(text()).not.toContain('Notes anciennes A'); });
  it('la recherche reste identique après une nouvelle lecture', async () => { h.call.mockResolvedValueOnce({ demandes: [demande('cible'), demande('autre')] }); await mount(); const input = host.querySelector('input')!; await act(async () => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'cible'); input.dispatchEvent(new Event('input', { bubbles: true })); }); expect(text()).toContain('1 affichées / 2 reçues'); h.call.mockResolvedValue({ demandes: [demande('cible-courante'), demande('autre-courante')] }); await clickRefresh(); expect(host.querySelector('input')?.value).toBe('cible'); expect(text()).toContain('1 affichées / 2 reçues'); expect(host.querySelectorAll('tbody tr')).toHaveLength(1); expect(text()).toContain('Nom cible-courante'); });
  it('le filtre actif existant conserve les statuts terminaux hors de la liste', async () => { h.call.mockResolvedValue({ demandes: [demande('active'), demande('terminee', { statut: 'traitee' }), demande('fermee', { statut: 'fermee' })] }); await mount(); expect(text()).toContain('1 affichées / 3 reçues'); expect(host.querySelectorAll('tbody tr')).toHaveLength(1); expect(text()).toContain('Nom active'); expect(text()).not.toContain('Nom terminee'); });
});


describe('Verrou d’écriture pendant une relecture', () => {
  it('un rejet de l’écriture après remontage libère le verrou sans restaurer un ancien détail', async () => {
    const id = '10000000-0000-4000-8000-000000000002';
    const pending = deferred<unknown>();
    h.ecritureAttendue = { id, statut: 'nouvelle', notes_internes: '' };
    h.call.mockImplementation(name => name === 'admin-list-demandes-installation'
      ? Promise.resolve({ demandes: [demande(id)] }) : pending.promise);
    await mount(); await selectFirst();
    await act(async () => [...host.querySelectorAll('button')].find(b => b.textContent === 'Enregistrer')!.click());
    await act(async () => [...host.querySelectorAll('button')].find(b => b.textContent === 'Fermer')!.click());
    await clickRefresh();
    expect(host.querySelector('[role="dialog"]')).toBeNull();
    await selectFirst();
    expect([...host.querySelectorAll('button')].find(b => b.textContent?.includes('Enregistrement…'))?.disabled).toBe(true);
    await act(async () => pending.reject(Error('Refus fictif de la fixture')));
    expect([...host.querySelectorAll('button')].find(b => b.textContent === 'Enregistrer')?.disabled).toBe(false);
    expect(host.querySelector('textarea')?.value).toBe('');
    expect(h.call.mock.calls.filter(([name]) => name === 'admin-list-demandes-installation')).toHaveLength(2);
  });
  it('la sauvegarde pendante reste verrouillée après remontage, puis une lecture explicite retrouve son reçu', async () => {
    const id = '10000000-0000-4000-8000-000000000001';
    const pending = deferred<unknown>();
    let confirme = false;
    h.ecritureAttendue = { id, statut: 'nouvelle', notes_internes: 'Note entièrement fictive' };
    h.call.mockImplementation(name => {
      if (name === 'admin-list-demandes-installation') return Promise.resolve({ demandes: [demande(id, { notes_internes: confirme ? 'Note entièrement fictive' : null })] });
      if (name === 'admin-update-demande-installation') return pending.promise;
      throw Error('Endpoint interdit dans la fixture');
    });
    await mount(); await selectFirst();
    const notes = host.querySelector('textarea')!;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(notes, 'Note entièrement fictive');
      notes.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const save = [...host.querySelectorAll('button')].find(b => b.textContent === 'Enregistrer')!;
    await act(async () => save.click());
    expect(save.disabled).toBe(true);
    const fermer = [...host.querySelectorAll('button')].find(b => b.textContent === 'Fermer')!;
    await act(async () => fermer.click());
    await clickRefresh(); await selectFirst();
    const verrou = [...host.querySelectorAll('button')].find(b => b.textContent?.includes('Enregistrement…'))!;
    expect(verrou).toBeTruthy(); expect(verrou.disabled).toBe(true);
    expect(host.querySelector('textarea')?.value).toBe('');
    expect(h.call.mock.calls.filter(([name]) => name === 'admin-update-demande-installation')).toHaveLength(1);
    confirme = true;
    await act(async () => pending.resolve({ demande: demande(id, { notes_internes: 'Note entièrement fictive' }) }));
    const disponible = [...host.querySelectorAll('button')].find(b => b.textContent === 'Enregistrer')!;
    expect(disponible).toBeTruthy(); expect(disponible.disabled).toBe(false);
    await act(async () => [...host.querySelectorAll('button')].find(b => b.textContent === 'Fermer')!.click());
    await clickRefresh(); await selectFirst();
    expect(host.querySelector('textarea')?.value).toBe('Note entièrement fictive');
    expect(h.call.mock.calls.filter(([name]) => name === 'admin-list-demandes-installation')).toHaveLength(3);
  });
});
