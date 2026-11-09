import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Projets from "../../src/pages/Projets";
import { useProject, useProjects } from "../../src/hooks/useProjects";
import { STATIC_CENTRES } from "../../src/lib/centres";

type Reply = { data: unknown; error: unknown; count?: number | null };
const sdk = vi.hoisted(() => ({
  queue: [] as Array<Reply | Promise<Reply>>,
  requests: [] as Array<{ table: string; select?: unknown[]; orders: unknown[][]; range?: number[]; signal?: AbortSignal; eq?: unknown[] }>,
  lang: "fr",
  seo: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: (table: string) => {
    const request: typeof sdk.requests[number] = { table, orders: [] };
    sdk.requests.push(request);
    let promise: Promise<Reply> | undefined;
    const receive = () => promise ??= Promise.resolve(sdk.queue.shift() ?? { data: null, error: new Error("Unexpected SDK read") });
    const query = {
      select: (...args: unknown[]) => { request.select = args; return query; },
      order: (...args: unknown[]) => { request.orders.push(args); return query; },
      range: (from: number, to: number) => { request.range = [from, to]; return query; },
      abortSignal: (signal: AbortSignal) => { request.signal = signal; return query; },
      eq: (...args: unknown[]) => { request.eq = args; return query; },
      maybeSingle: () => query,
      then: (yes: (r: Reply) => unknown, no: (e: unknown) => unknown) => receive().then(yes, no),
    };
    return query;
  } },
}));
vi.mock("@/components/Layout", () => ({ Layout: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("@/components/SeoHead", () => ({ SeoHead: (props: unknown) => { sdk.seo(props); return null; } }));
vi.mock("@/components/CarteCabinetsSection", () => ({ CarteCabinetsSection: () => <section aria-label="Carte doublee" /> }));
vi.mock("@/lib/projectImages", () => ({ getProjectHero: () => null }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: sdk.lang } }) }));

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root | undefined;
let host: HTMLDivElement;
let client: QueryClient;
const row = (id = "id-1", slug = "i-ca-re-chartrons") => ({
  id, slug, created_at: "2026-10-01T00:00:00Z", short_description: "Description recue",
  short_description_en: "Received description", date_ouverture_cible: "2027-03-01", hero_image_url: null,
});
const ok = (data: unknown[], count = data.length): Reply => ({ data, error: null, count });
const deferred = () => { let resolve!: (r: Reply) => void; let reject!: (e: unknown) => void; const promise = new Promise<Reply>((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const view = (child: ReactNode = <Projets />) => <QueryClientProvider client={client}><MemoryRouter>{child}</MemoryRouter></QueryClientProvider>;
async function mount(child?: ReactNode) { await act(async () => { root = createRoot(host); root.render(view(child)); }); }
async function until(check: () => boolean) {
  for (let i = 0; i < 100 && !check(); i++) await act(async () => { await new Promise(r => setTimeout(r, 5)); });
  expect(check()).toBe(true);
}
const alert = () => host.querySelector('[role="alert"]');
const status = () => host.querySelector('[role="status"]');
const text = () => host.textContent ?? "";
async function failed(reply: Reply | Promise<Reply>) { sdk.queue.push(reply); await mount(); await until(() => !!alert()); }
function Probe() { const query = useProjects(); return <output>{query.isError ? "error" : query.isSuccess ? JSON.stringify(query.data) : "pending"}</output>; }
function DetailProbe() { const query = useProject("cabinet-test"); return <output>{query.isSuccess ? query.data?.slug : "pending"}</output>; }

beforeEach(() => {
  sdk.queue = []; sdk.requests = []; sdk.lang = "fr"; sdk.seo.mockClear();
  host = document.createElement("div"); document.body.append(host);
  client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0, refetchOnWindowFocus: false } } });
});
afterEach(async () => { await act(async () => root?.unmount()); root = undefined; client.clear(); host.remove(); vi.restoreAllMocks(); });

describe("catalogue public, vraie page et vrai hook React Query", () => {
  it("nomme le refus SDK et conserve les huit implantations statiques", async () => {
    await failed({ data: null, error: { message: "refus" }, count: null });
    expect(text()).toContain("Informations complémentaires indisponibles");
    expect(host.querySelectorAll("h3").length).toBe(STATIC_CENTRES.length);
    expect(sdk.requests).toHaveLength(1);
  });
  it("annonce l'attente sans masquer centres ou CTA", async () => {
    sdk.queue.push(deferred().promise); await mount();
    expect(status()?.textContent).toContain("Chargement");
    expect(host.querySelector('a[href="/contact"]')).not.toBeNull();
    expect(host.querySelectorAll("h3").length).toBe(8);
  });
  it("annonce un vrai vide des complements sans annoncer aucun cabinet", async () => {
    sdk.queue.push(ok([])); await mount(); await until(() => text().includes("Aucune information complémentaire"));
    expect(host.querySelectorAll("h3").length).toBe(8);
    expect(text()).not.toContain("Aucun cabinet");
    expect(alert()).toBeNull();
  });
  it("recoit le catalogue apres progression selon le plafond serveur reduit", async () => {
    sdk.queue.push(ok([row("3")], 3), ok([row("2")], 3), ok([row("1")], 3));
    await mount(<Probe />); await until(() => text().includes('"id":"1"'));
    expect(sdk.requests.map(r => r.range)).toEqual([[0, 199], [1, 200], [2, 201]]);
    expect(sdk.requests.every(r => JSON.stringify(r.select) === JSON.stringify(["*", { count: "exact" }]))).toBe(true);
    expect(sdk.requests[0].orders).toEqual([["created_at", { ascending: false }], ["id", { ascending: false }]]);
  });
  it("cache tout catalogue partiel si la page suivante refuse", async () => {
    sdk.queue.push(ok([row()], 2), { data: null, error: new Error("page 2"), count: null });
    await mount(); await until(() => !!alert());
    expect(text()).not.toContain("Description recue");
    expect(sdk.requests).toHaveLength(2);
  });
  it.each([
    ["compte absent", { data: [], error: null }],
    ["compte nul", { data: [], error: null, count: null }],
    ["compte negatif", { data: [], error: null, count: -1 }],
    ["compte fractionnaire", { data: [], error: null, count: 0.5 }],
    ["compte au dela de la borne", { data: [], error: null, count: 10001 }],
    ["donnees nulles", { data: null, error: null, count: 0 }],
    ["donnees objet", { data: {}, error: null, count: 1 }],
    ["donnees et erreur contradictoires", { data: [row()], error: new Error("refus"), count: 1 }],
    ["id absent", { data: [{ slug: "sans-id" }], error: null, count: 1 }],
    ["id vide", { data: [{ ...row(), id: "" }], error: null, count: 1 }],
    ["plus de lignes que compte", { data: [row()], error: null, count: 0 }],
  ] satisfies Array<[string, Reply]>)("ferme la reception ambigue : %s", async (_name, reply) => {
    await failed(reply); expect(text()).not.toContain("Description recue"); expect(sdk.requests).toHaveLength(1);
  });
  it("rejette le compte qui change entre pages", async () => {
    sdk.queue.push(ok([row("2")], 2), ok([row("1")], 3)); await mount(); await until(() => !!alert());
    expect(text()).not.toContain("Description recue");
  });
  it("rejette un identifiant repete entre pages", async () => {
    sdk.queue.push(ok([row()], 2), ok([row()], 2)); await mount(); await until(() => !!alert());
    expect(text()).not.toContain("Description recue");
  });
  it("rejette un arret premature avant le compte recu", async () => {
    sdk.queue.push(ok([row()], 2), ok([], 2)); await mount(); await until(() => !!alert());
    expect(sdk.requests).toHaveLength(2);
  });
  it("borne le nombre de pages meme si le plafond serveur rend une ligne", async () => {
    for (let i = 0; i < 50; i++) sdk.queue.push(ok([row(String(i))], 51));
    await mount(); await until(() => !!alert());
    expect(sdk.requests).toHaveLength(50); expect(text()).not.toContain("Description recue");
  });
  it("traite le rejet de promesse sans retry automatique", async () => {
    const pending = deferred(); sdk.queue.push(pending.promise); await mount();
    await act(async () => pending.reject(new Error("reseau double"))); await until(() => !!alert());
    expect(sdk.requests).toHaveLength(1);
  });
  it("reprend seulement sur geste et recoit description et trimestre", async () => {
    await failed({ data: null, error: new Error("refus") });
    sdk.queue.push(ok([row("id", "i-ca-re-floirac")]));
    await act(async () => (host.querySelector('[role="alert"] button') as HTMLButtonElement).click());
    await until(() => text().includes("Description recue"));
    expect(text()).toContain("T1 2027"); expect(alert()).toBeNull(); expect(sdk.requests).toHaveLength(2);
  });
  it("retire les anciens complements pendant une reprise et apres refus", async () => {
    sdk.queue.push(ok([row()])); await mount(); await until(() => text().includes("Description recue"));
    const pending = deferred(); sdk.queue.push(pending.promise);
    await act(async () => { void client.invalidateQueries({ queryKey: ["projets"], exact: true }); });
    await until(() => status()?.textContent?.includes("Chargement") ?? false);
    expect(text()).not.toContain("Description recue"); expect(status()).not.toBeNull();
    await act(async () => pending.resolve({ data: null, error: new Error("refus") })); await until(() => !!alert());
    expect(text()).not.toContain("Description recue");
  });
  it("ignore la fin ancienne apres demontage et fournit un signal SDK", async () => {
    const old = deferred(); sdk.queue.push(old.promise); await mount(); const oldSignal = sdk.requests[0].signal;
    await act(async () => root?.unmount()); root = undefined;
    sdk.queue.push(ok([row("nouveau")])); await mount(<Probe />); await until(() => text().includes("nouveau"));
    await act(async () => old.resolve(ok([row("ancien")])));
    expect(oldSignal?.aborted).toBe(true); expect(text()).not.toContain("ancien");
  });
  it("conserve les liens et SEO en anglais avec etat inconnu localise", async () => {
    sdk.lang = "en"; await failed({ data: null, error: new Error("refus") });
    expect(text()).toContain("Additional information unavailable");
    expect(host.querySelector('a[href="/en/projects/i-ca-re-chartrons"]')).not.toBeNull();
    expect(host.querySelector('a[href="/en/contact"]')).not.toBeNull();
    expect(sdk.seo).toHaveBeenLastCalledWith(expect.objectContaining({ path: "/en/projects" }));
  });
  it("conserve description anglaise et ordre editorial statique", async () => {
    sdk.lang = "en"; sdk.queue.push(ok([row()])); await mount(); await until(() => text().includes("Received description"));
    expect([...host.querySelectorAll("h3")].map(n => n.textContent)).toEqual(STATIC_CENTRES.filter(c => c.region === "bordeaux").concat(STATIC_CENTRES.filter(c => c.region === "toulouse")).map(c => c.name));
  });
  it("conserve le contrat tableau du hook partage avec Investissement", async () => {
    sdk.queue.push(ok([row("id-api")])); await mount(<Probe />); await until(() => text().includes("id-api"));
    expect(JSON.parse(text())).toEqual([row("id-api")]);
  });
  it("laisse useProject et sa lecture unitaire inchanges", async () => {
    sdk.queue.push({ data: { slug: "cabinet-test" }, error: null }); await mount(<DetailProbe />); await until(() => text().includes("cabinet-test"));
    expect(sdk.requests[0].eq).toEqual(["slug", "cabinet-test"]); expect(sdk.requests[0].range).toBeUndefined();
  });
  it("refuse une page qui depasse la taille demandee", async () => {
    await failed(ok(Array.from({ length: 201 }, (_, i) => row(String(i))), 201));
    expect(sdk.requests).toHaveLength(1); expect(text()).not.toContain("Description recue");
  });
  it("refuse les identifiants repetes dans une meme page", async () => {
    await failed(ok([row(), row()], 2)); expect(text()).not.toContain("Description recue");
  });
  it("partage une seule reprise quand le meme bouton recoit deux clics synchrones", async () => {
    await failed({ data: null, error: new Error("refus") });
    const pending = deferred(); sdk.queue.push(pending.promise);
    const retry = host.querySelector('[role="alert"] button') as HTMLButtonElement;
    await act(async () => { retry.click(); retry.click(); });
    await until(() => sdk.requests.length === 2);
    await act(async () => pending.resolve(ok([row()]))); await until(() => text().includes("Description recue"));
    expect(sdk.requests).toHaveLength(2);
  });
});

