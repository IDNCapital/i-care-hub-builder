import { act, StrictMode, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useNavigate, type NavigateFunction } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ArticleDetail from "../../src/pages/ArticleDetail";
import ArticlesIndex from "../../src/pages/ArticlesIndex";

type Reply = { data: unknown; error: unknown; status: number; count?: number | null };
type Request = {
  columns: string; count?: string; filters: unknown[][]; orders: unknown[][];
  single: boolean; signal?: AbortSignal; resolve: (reply: Reply) => void; reject: (reason: Error) => void;
};
type Query = {
  select: (columns: string, options?: { count?: string }) => Query;
  eq: (...args: unknown[]) => Query; order: (...args: unknown[]) => Query;
  maybeSingle: () => Query; abortSignal: (signal: AbortSignal) => Query;
  then: (yes: (reply: Reply) => unknown, no?: (reason: unknown) => unknown) => Promise<unknown>;
};
const h = vi.hoisted(() => ({ calls: [] as Request[], seo: [] as Array<{ title: string; path: string; noIndex?: boolean }> }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from(table: string) {
  if (table !== "articles") throw new Error("Source outside the closed fixture");
  const request: Request = { columns: "", filters: [], orders: [], single: false, resolve: () => {}, reject: () => {} };
  let pending: Promise<Reply> | undefined;
  const q: Query = {
    select(columns, options) { request.columns = columns; request.count = options?.count; return q; },
    eq(...args) { request.filters.push(args); return q; },
    order(...args) { request.orders.push(args); return q; },
    maybeSingle() { request.single = true; return q; },
    abortSignal(signal) { request.signal = signal; return q; },
    then(yes, no) {
      pending ??= new Promise<Reply>((resolve, reject) => { request.resolve = resolve; request.reject = reject; h.calls.push(request); });
      return pending.then(yes, no);
    },
  };
  return q;
} } }));
vi.mock("@/components/Layout", () => ({ Layout: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: "fr" } }) }));
vi.mock("@/components/SeoHead", async (load) => {
  const { SeoHead } = await load<typeof import("@/components/SeoHead")>();
  return { SeoHead: (props: Parameters<typeof SeoHead>[0]) => { h.seo.push(props); return <SeoHead {...props} />; } };
});
vi.mock("@/components/ui/MarkdownContent", () => ({ MarkdownContent: ({ content }: { content: string }) => <section data-testid="markdown-contract">{content}</section> }));
vi.mock("@/pages/NotFound", () => ({ default: () => <h1>404</h1> }));

let root: Root | undefined;
let host: HTMLDivElement;
let navigate: NavigateFunction;
function Navigation() { navigate = useNavigate(); return null; }
const flush = async () => { await act(async () => { for (let n = 0; n < 15; n++) await Promise.resolve(); await vi.advanceTimersByTimeAsync(0); }); };
const tick = async (ms: number) => { await act(() => vi.advanceTimersByTimeAsync(ms)); await flush(); };
const text = () => host.textContent ?? "";
async function mount(kind: "catalogue" | "article", strict = false) {
  root = createRoot(host);
  const view = <MemoryRouter initialEntries={[kind === "catalogue" ? "/patients/articles" : "/patients/articles/alpha"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Navigation /><Routes><Route path="/patients/articles" element={<ArticlesIndex />} /><Route path="/patients/articles/:slug" element={<ArticleDetail />} /></Routes></MemoryRouter>;
  await act(async () => root!.render(strict ? <StrictMode>{view}</StrictMode> : view));
  await flush();
}
const row = (slug = "alpha") => ({ slug, titre: `Article ${slug}`, chapo: `Chapeau ${slug}`, contenu: `Contenu ${slug}`, meta_title: `SEO ${slug}`, meta_description: `Description ${slug}`, published_at: "2026-11-01T00:00:00Z", updated_at: "2026-11-02T00:00:00Z" });
const ok = (kind: "catalogue" | "article", slug = "alpha"): Reply => ({ data: kind === "catalogue" ? [row(slug)] : row(slug), error: null, status: 200, count: 1 });
const receive = async (request: Request, reply: Reply) => { await act(async () => request.resolve(reply)); await flush(); };
const retry = async () => {
  const button = [...host.querySelectorAll("button")].find(node => node.textContent === "Réessayer");
  expect(button).toBeDefined();
  await act(async () => button!.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  await flush();
};
beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(new Date("2026-11-09T04:00:00Z"));
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  h.calls = []; h.seo = []; host = document.createElement("div"); document.body.append(host);
});
afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  root = undefined; host.remove(); document.head.innerHTML = ""; vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals();
});

describe("ICARE-ARTICLES-ATTENTE-BORNEE-0911", () => {
  it.each(["catalogue", "article"] as const)("%s quitte l'attente a 15000ms sans inventer un vide", async kind => {
    await mount(kind); expect(h.calls).toHaveLength(1);
    await tick(14999); expect(host.querySelector('[role="status"]')).not.toBeNull();
    await tick(1); expect(host.querySelector('[role="alert"]')).not.toBeNull();
    expect(host.querySelector('[role="status"]')).toBeNull();
    expect(text()).not.toContain("Nos premiers articles arrivent bientôt.");
    expect(text()).not.toContain("404");
    expect(h.calls).toHaveLength(1); expect(h.calls[0].signal?.aborted).toBe(true);
    expect(host.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it.each(["catalogue", "article"] as const)("%s refuse une reception tardive apres la borne", async kind => {
    await mount(kind); await tick(15000); const seoCount = h.seo.length;
    await receive(h.calls[0], ok(kind));
    expect(host.querySelector('[role="alert"]')).not.toBeNull();
    expect(text()).not.toContain("Article alpha"); expect(h.seo).toHaveLength(seoCount);
    expect(host.querySelector('script[type="application/ld+json"]')).toBeNull();
    expect(h.calls).toHaveLength(1); expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["catalogue", "article"] as const)("%s reprend avec budget et signal neufs sans retour ancien", async kind => {
    await mount(kind); await tick(15000); const old = h.calls[0];
    await retry(); expect(h.calls).toHaveLength(2); const current = h.calls[1];
    expect(old.signal?.aborted).toBe(true); expect(current.signal).not.toBe(old.signal); expect(current.signal?.aborted).toBe(false);
    await tick(14999); expect(host.querySelector('[role="status"]')).not.toBeNull();
    await receive(old, ok(kind, "ancien")); expect(text()).not.toContain("Article ancien");
    await receive(current, ok(kind)); expect(text()).toContain("Article alpha");
    expect(host.querySelector('[role="alert"]')).toBeNull(); expect(current.signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
    expect(h.calls[1].columns).toBe(kind === "catalogue" ? "slug, titre, chapo, published_at" : "slug, titre, chapo, contenu, meta_title, meta_description, published_at, updated_at");
    expect(h.calls[1].filters).toEqual(kind === "article" ? [["slug", "alpha"]] : []);
    expect(h.calls[1].orders).toEqual(kind === "catalogue" ? [["published_at", { ascending: false }]] : []);
    expect(h.calls[1].count).toBe(kind === "catalogue" ? "exact" : undefined);
    const graph = JSON.parse(host.querySelector('script[type="application/ld+json"]')!.textContent!)["@graph"];
    if (kind === "catalogue") expect(graph[1].itemListElement).toHaveLength(1);
    else { expect(graph[0].headline).toBe("Article alpha"); expect(h.seo.at(-1)?.title).toBe("SEO alpha"); }
  });

  it.each(["catalogue", "article"] as const)("%s controle l'echeance meme si le minuteur est retarde", async kind => {
    await mount(kind); vi.setSystemTime(Date.now() + 15000);
    await receive(h.calls[0], ok(kind));
    expect(host.querySelector('[role="alert"]')).not.toBeNull(); expect(text()).not.toContain("Article alpha");
    expect(h.calls[0].signal?.aborted).toBe(true); expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["catalogue", "article"] as const)("%s ferme le transport et le minuteur au demontage", async kind => {
    await mount(kind); const pending = h.calls[0];
    await act(async () => root!.unmount()); root = undefined; await flush();
    expect(pending.signal?.aborted).toBe(true); expect(vi.getTimerCount()).toBe(0);
    const seoCount = h.seo.length; await receive(pending, ok(kind));
    expect(host.textContent).toBe(""); expect(h.seo).toHaveLength(seoCount);
  });

  it("le slug courant recoit son propre budget et ignore le retour du precedent", async () => {
    await mount("article"); await tick(14999); const old = h.calls[0];
    await act(async () => navigate("/patients/articles/beta")); await flush();
    expect(old.signal?.aborted).toBe(true); expect(h.calls).toHaveLength(2);
    expect(h.calls[1].filters).toEqual([["slug", "beta"]]);
    await tick(14999); expect(host.querySelector('[role="status"]')).not.toBeNull();
    await receive(h.calls[1], ok("article", "beta")); await receive(old, ok("article"));
    expect(text()).toContain("Article beta"); expect(text()).not.toContain("Article alpha");
    expect(h.seo.at(-1)?.path).toBe("/patients/articles/beta");
  });

  it("le head SSR initial reste attribue pendant borne et reprise", async () => {
    document.head.innerHTML = '<title>SSR alpha</title><meta name="description" content="SSR description"><link rel="canonical" href="https://i-ca.re/patients/articles/alpha/">';
    const nodes = [...document.head.children]; const markup = document.head.innerHTML;
    await mount("article"); await tick(15000); await retry(); await tick(14999);
    expect(document.head.innerHTML).toBe(markup); expect(nodes.every(node => node.parentNode === document.head)).toBe(true);
    expect(h.seo).toHaveLength(0);
    await receive(h.calls[1], ok("article")); expect(h.seo.at(-1)?.title).toBe("SEO alpha");
    expect(document.title).toBe("SEO alpha");
    expect([...document.head.querySelectorAll("title")].map(node => node.textContent)).toEqual(["SEO alpha"]);
  });

  it("le catalogue remplace le titre préchargé de son propre chemin sans doublon", async () => {
    document.head.innerHTML = '<title>Titre ancien du catalogue</title><link rel="canonical" href="https://i-ca.re/patients/articles/"><meta name="viewport" content="width=device-width">';
    await mount("catalogue");
    await receive(h.calls[0], ok("catalogue"));
    expect(Array.from(document.head.querySelectorAll("title"), titre => titre.textContent))
      .toEqual(["Articles et conseils bien-être | Espace Patients I-CA.RE"]);
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelector('meta[name="viewport"]')).not.toBeNull();
  });

  it.each(["catalogue", "article"] as const)("%s remplace le repli sans canonique après réception", async kind => {
    document.head.innerHTML = '<title>Repli générique</title><meta name="description" content="Repli"><meta name="viewport" content="width=device-width"><meta name="robots" content="fixture"><script type="application/ld+json">{}</script>';
    const proteges = Array.from(document.head.querySelectorAll('meta[name="viewport"],meta[name="robots"],script'));
    await mount(kind);
    await receive(h.calls[0], ok(kind));
    expect(document.head.querySelectorAll("title")).toHaveLength(1);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.title).not.toBe("Repli générique");
    expect(proteges.every(node => node.parentNode === document.head)).toBe(true);
  });

  it("le nettoyage SSR de43 respecte les noeuds modifies et non attribues apres borne", async () => {
    document.head.innerHTML = '<title>SSR alpha</title><link rel="canonical" href="https://i-ca.re/patients/articles/alpha/"><meta name="viewport" content="width=device-width"><script type="application/ld+json">{"@type":"Organization"}</script>';
    const canonical = document.head.querySelector("link")!;
    const viewport = document.head.querySelector('meta[name="viewport"]')!;
    const organization = document.head.querySelector("script")!;
    await mount("article"); await tick(15000);
    canonical.setAttribute("href", "https://i-ca.re/patients/articles/beta/");
    await act(async () => navigate("/patients/articles/beta")); await flush();
    expect(document.title).not.toBe("SSR alpha");
    expect([canonical, viewport, organization].every(node => node.parentNode === document.head)).toBe(true);
    expect(h.seo.at(-1)).toMatchObject({ path: "/patients/articles/beta", noIndex: true });
  });

  it.each(["catalogue", "article"] as const)("%s laisse seulement la seconde tentative StrictMode recevoir", async kind => {
    await mount(kind, true); expect(h.calls).toHaveLength(2);
    expect(h.calls[0].signal?.aborted).toBe(true); expect(h.calls[1].signal?.aborted).toBe(false);
    await receive(h.calls[0], ok(kind, "ancien")); expect(text()).not.toContain("Article ancien");
    await receive(h.calls[1], ok(kind)); expect(text()).toContain("Article alpha");
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["catalogue", "article"] as const)("%s distingue une absence confirmee avant la borne", async kind => {
    await mount(kind); await tick(14999);
    await receive(h.calls[0], { data: kind === "catalogue" ? [] : null, error: null, status: 200, count: 0 });
    expect(host.querySelector('[role="alert"]')).toBeNull();
    expect(text()).toContain(kind === "catalogue" ? "Nos premiers articles arrivent bientôt." : "404");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("la reprise du catalogue refuse toujours un tableau partiel", async () => {
    await mount("catalogue"); await tick(15000); await retry();
    await receive(h.calls[1], { ...ok("catalogue"), count: 2 });
    expect(host.querySelector('[role="alert"]')).not.toBeNull(); expect(text()).not.toContain("Article alpha");
    expect(host.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it("la reprise de l'article refuse toujours un autre slug", async () => {
    await mount("article"); await tick(15000); await retry(); await receive(h.calls[1], ok("article", "beta"));
    expect(host.querySelector('[role="alert"]')).not.toBeNull(); expect(text()).not.toContain("Article beta");
    expect(host.querySelector("h1")).toBeNull();
  });
});
