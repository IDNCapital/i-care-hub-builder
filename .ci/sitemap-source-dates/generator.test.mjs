import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const SOURCES = ["package.json", "scripts/generate-sitemap.mjs", "scripts/publishedRoutes.mjs", "scripts/siteUrl.mjs", "src/lib/norm.js", "public/sitemap.xml"];
const FAMILIES = ["praticien", "patients/problematiques", "patients/specialite", "patients/articles"];

function rows(updated_at) {
  return {
    praticiens: [{ slug: "fixture-date-praticien", updated_at, profession: "Fixture specialite", problematiques: ["Fixture sujet"] }],
    problematiques: [{ slug: "fixture-date-sujet", nom: "Fixture sujet", updated_at }],
    specialites: [{ slug: "fixture-date-specialite", nom: "Fixture specialite", updated_at }],
    articles: [{ slug: "fixture-date-article", updated_at }],
    professions: [{ slug: "fixture-date-profession" }],
    installation_content_ville: [{ ville_slug: "fixture-date-ville" }],
    installation_content_profession: [{ profession_slug: "fixture-date-profession" }],
  };
}

function generate(fixture, { clock = "2040-01-01T00:00:00Z", optional = false, staticXml, distMissing = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "sitemap-source-dates-"));
  try {
    for (const file of SOURCES) {
      mkdirSync(dirname(join(dir, file)), { recursive: true });
      copyFileSync(join(ROOT, file), join(dir, file));
    }
    if (!distMissing) mkdirSync(join(dir, "dist"));
    const sentinel = "UNCHANGED-SITEMAP-FIXTURE";
    if (!distMissing) writeFileSync(join(dir, "dist/sitemap.xml"), sentinel);
    if (staticXml !== undefined) writeFileSync(join(dir, "public/sitemap.xml"), staticXml);
    writeFileSync(join(dir, "fixture.json"), JSON.stringify(fixture));
    const result = spawnSync(process.execPath, ["--import", join(HERE, "preload.mjs"), join(dir, "scripts/generate-sitemap.mjs")], {
      cwd: dir,
      env: { ...process.env, VITE_SUPABASE_URL: "https://sitemap-fixture.invalid", VITE_SUPABASE_PUBLISHABLE_KEY: "fixture-public-key", PRERENDER_OPTIONAL: String(optional), SITEMAP_FIXTURE_FILE: join(dir, "fixture.json"), SITEMAP_FIXTURE_CLOCK: clock, SITEMAP_FIXTURE_CALLS: join(dir, "calls.json") },
      encoding: "utf8",
      timeout: 10000,
    });
    assert.ifError(result.error);
    return { status: result.status, stdout: result.stdout, stderr: result.stderr, xml: distMissing ? null : readFileSync(join(dir, "dist/sitemap.xml"), "utf8"), calls: JSON.parse(readFileSync(join(dir, "calls.json"), "utf8")), sentinel };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function blocks(xml) {
  return [...xml.matchAll(/<url>\s*([\s\S]*?)<\/url>/g)].map((match) => ({
    loc: match[1].match(/<loc>([^<]+)<\/loc>/)?.[1],
    lastmod: match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null,
  }));
}

function dynamic(result) {
  assert.equal(result.status, 0, result.stderr);
  const selected = blocks(result.xml).filter((b) => b.loc.includes("fixture-date-") && !b.loc.includes("/sinstaller/"));
  assert.equal(selected.length, 4, "All four dynamic families retain their route");
  for (const family of FAMILIES) assert.equal(selected.filter((b) => b.loc.includes(`/${family}/`)).length, 1);
  return selected;
}

test("causal: unknown or invalid source dates do not become the build date", () => {
  for (const value of [null, "not-a-date"]) {
    const result = generate(rows(value));
    assert.deepEqual(dynamic(result).map((b) => b.lastmod), [null, null, null, null]);
  }
});

test("known source dates survive in every dynamic family", () => {
  const result = generate(rows("2026-09-12T08:15:30.123456+00:00"));
  assert.deepEqual(dynamic(result).map((b) => b.lastmod), Array(4).fill("2026-09-12"));
});

test("generation preserves the static base, routes and installation matrix", () => {
  const result = generate(rows("2026-09-12T08:15:30Z"));
  dynamic(result);
  const base = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");
  assert.ok(result.xml.startsWith(base.slice(0, base.indexOf("</urlset>"))));
  const all = blocks(result.xml);
  assert.equal(new Set(all.map((b) => b.loc)).size, all.length);
  assert.equal(all.filter((b) => b.loc.endsWith("/sinstaller/fixture-date-profession/fixture-date-ville/")).length, 1);
  assert.ok(!all.find((b) => b.loc.includes("/sinstaller/fixture-date-")).lastmod);
  assert.equal(result.calls.length, 7);
});

test("source dates are independent from the build clock", () => {
  const a = generate(rows(null), { clock: "2040-01-01T00:00:00Z" });
  const b = generate(rows(null), { clock: "2041-12-31T23:59:59Z" });
  assert.equal(a.status, 0, a.stderr);
  assert.equal(b.status, 0, b.stderr);
  assert.equal(a.xml === b.xml, true, "No source date may depend on the build clock");
});

test("required network refusal still leaves the output untouched", () => {
  const fixture = { ...rows(null), fail: "articles" };
  const result = generate(fixture);
  assert.equal(result.status, 1);
  assert.equal(result.xml, result.sentinel);
});

test("optional network refusal still leaves the output untouched", () => {
  const result = generate({ ...rows(null), fail: "articles" }, { optional: true });
  assert.equal(result.status, 0);
  assert.equal(result.xml, result.sentinel);
});

test("optional mode cannot hide an editorial guard", () => {
  const fixture = rows(null);
  fixture.installation_content_profession = [];
  const result = generate(fixture, { optional: true });
  assert.equal(result.status, 1);
  assert.equal(result.xml, result.sentinel);
});

test("date-only and timezone sources have their expected UTC date", () => {
  for (const [source, expected] of [["2024-02-29", "2024-02-29"], ["2026-10-28T00:30:00+02:00", "2026-10-27"], ["2026-10-28T23:30:00-02:00", "2026-10-29"]]) {
    assert.deepEqual(dynamic(generate(rows(source))).map((b) => b.lastmod), Array(4).fill(expected));
  }
});

test("malformed or non-string dates remain unknown", () => {
  for (const source of ["", " ", 42, true, {}, [], "2026-02-30", "2023-02-29", "2026-13-01", "2026-01-01T24:00:00Z", "2026-01-01T12:00:00", "2026-01-01T12:00:00Zjunk", "2026-01-01\n", "0000-01-01", "0001-01-01T00:30:00+02:00", "9999-12-31T23:30:00-02:00"]) {
    assert.deepEqual(dynamic(generate(rows(source))).map((b) => b.lastmod), [null, null, null, null], String(source));
  }
});


test("missing updated_at fields omit lastmod independently in all four families", () => {
  const fixture = rows(undefined);
  // JSON.stringify omits each undefined field: this is not a null surrogate.
  const result = generate(fixture);
  assert.deepEqual(dynamic(result).map((b) => b.lastmod), [null, null, null, null]);
});

test("mixed source states retain only the known family date", () => {
  const fixture = rows(undefined);
  fixture.praticiens[0].updated_at = "2026-09-12T08:15:30Z";
  fixture.problematiques[0].updated_at = null;
  fixture.specialites[0].updated_at = "2026-02-30";
  assert.deepEqual(dynamic(generate(fixture)).map((b) => b.lastmod), ["2026-09-12", null, null, null]);
});

test("matching, static and dynamic deduplication, XML escaping and route order stay intact", () => {
  const fixture = rows("2026-09-12");
  fixture.praticiens.push({ ...fixture.praticiens[0] }, { ...fixture.praticiens[0], slug: "fixture-date-other", cabinet_slug: "cabinet-a", profession: "Other profession" });
  fixture.problematiques.push({ ...fixture.problematiques[0] }, { slug: "fixture-date-unmatched", nom: "Unmatched", updated_at: "2026-09-12" });
  fixture.specialites.push({ ...fixture.specialites[0] }, { slug: "fixture-date-scoped", nom: "Fixture specialite", cabinet_slug: "cabinet-other" });
  fixture.articles.push({ ...fixture.articles[0] }, { slug: "fixture-date-escaped&article", updated_at: "2026-09-12" });
  const staticXml = '<?xml version="1.0"?><urlset><url><loc>https://i-ca.re/praticien/fixture-date-other/</loc><lastmod>2020-01-01</lastmod></url></urlset>';
  const result = generate(fixture, { staticXml });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.xml.startsWith(staticXml.slice(0, staticXml.indexOf("</urlset>"))), true);
  assert.deepEqual(blocks(result.xml).map((b) => b.loc), [
    "https://i-ca.re/praticien/fixture-date-other/",
    "https://i-ca.re/praticien/fixture-date-praticien/",
    "https://i-ca.re/patients/problematiques/",
    "https://i-ca.re/patients/problematiques/fixture-date-sujet/",
    "https://i-ca.re/patients/specialite/fixture-date-specialite/",
    "https://i-ca.re/patients/articles/",
    "https://i-ca.re/patients/articles/fixture-date-article/",
    "https://i-ca.re/patients/articles/fixture-date-escaped&amp;article/",
    "https://i-ca.re/sinstaller/fixture-date-profession/fixture-date-ville/",
  ]);
  assert.equal(blocks(result.xml)[0].lastmod, "2020-01-01");
});

test("problematic data guard wins before the next optional network refusal", () => {
  const fixture = { ...rows(null), fail: "specialites" };
  fixture.problematiques[0].synonymes = [42];
  const result = generate(fixture, { optional: true });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /GARDE DECLENCHEE/);
  assert.match(result.stderr, /apres matchProblematiques/);
  assert.equal(result.xml, result.sentinel);
  assert.deepEqual(result.calls, ["praticiens", "problematiques"]);
});

test("specialty data guard wins before the next optional network refusal", () => {
  const fixture = { ...rows(null), fail: "articles" };
  fixture.specialites[0].synonymes = [42];
  const result = generate(fixture, { optional: true });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /GARDE DECLENCHEE/);
  assert.match(result.stderr, /apres matchSpecialites/);
  assert.equal(result.xml, result.sentinel);
  assert.deepEqual(result.calls, ["praticiens", "problematiques", "specialites"]);
});

test("existing malformed static XML, duplicate loc and missing build directory still fail", () => {
  for (const options of [
    { staticXml: "<urlset>" },
    { staticXml: "<urlset><url></urlset>" },
    { staticXml: "<urlset><url><loc>https://i-ca.re/</loc></url><url><loc>https://i-ca.re/</loc></url></urlset>" },
    { distMissing: true },
  ]) {
    const result = generate(rows(null), options);
    assert.equal(result.status, 1, result.stderr);
    assert.equal(result.xml, options.distMissing ? null : result.sentinel);
    assert.match(result.stderr, /Static sitemap has no|Malformed XML|Duplicate <loc>|dist\/ directory not found/);
  }
});


test("invalid source date alone omits lastmod in each of the four families", () => {
  const result = generate(rows("not-a-date"));
  assert.deepEqual(dynamic(result).map((b) => b.lastmod), [null, null, null, null]);
});
