import test from 'node:test';
import assert from 'node:assert/strict';
import { runIndexNow, validateConfig, validateUrls } from '../scripts/indexnow.mjs';

const origin = 'https://example.org';
const key = 'ValidKey-2026';
const page = `${origin}/projets/toulouse`;
const config = { origin, key };
const keyUrl = `${origin}/${key}.txt`;
const sitemapUrl = `${origin}/sitemap.xml`;
const endpoint = 'https://api.indexnow.org/indexnow';

function html(canonical = page, extra = '') {
  return `<!doctype html><html><head><link rel="canonical" href="${canonical}">${extra}</head><body>Projet public</body></html>`;
}

function response(body, status = 200, headers = {}) {
  return new Response(body, { status, headers });
}

function fixture(overrides = {}) {
  const calls = [];
  const replies = new Map([
    [keyUrl, response(key)],
    [sitemapUrl, response(`<urlset><url><loc>${page}</loc></url></urlset>`, 200, { 'content-type': 'application/xml' })],
    [page, response(html(), 200, { 'content-type': 'text/html; charset=utf-8' })],
    [endpoint, response('', 200)],
  ]);
  for (const [url, value] of Object.entries(overrides)) replies.set(url, value);
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    assert.equal(init.redirect, 'manual');
    assert.equal(init.credentials, 'omit');
    return replies.get(url) ?? response('missing', 404);
  };
  return { calls, fetchImpl };
}

test('simulation valide mais ne fait aucun accès réseau', async () => {
  const result = await runIndexNow({ config, urls: [page], fetchImpl: () => { throw Error('réseau interdit'); } });
  assert.deepEqual(result, { state: 'simulation', count: 1, urls: [page] });
});

test('refuse configuration et URL non publiques avant le premier GET', async () => {
  assert.throws(() => validateConfig({ origin: 'http://example.org', key }), /HTTPS/);
  assert.throws(() => validateConfig({ origin, key: 'short' }), /clé/);
  const bad = [
    'https://other.org/projets/toulouse',
    'https://user:pass@example.org/projets/toulouse',
    `${page}?src=mail`,
    `${page}?`,
    `${page}#section`,
    `${page}#`,
    `${origin}/en/dashboard`,
    `${origin}/fr/sign-in`,
    `${origin}/admin/../projets/toulouse`,
    `${origin}/%61dmin`,
    `${origin}/projets%2Ftoulouse`,
  ];
  for (const url of bad) assert.throws(() => validateUrls([url], origin), undefined, url);
  assert.throws(() => validateUrls([page, page], origin), /double/);
  assert.throws(() => validateUrls(Array(21).fill(page), origin), /1 à 20/);
  const { calls, fetchImpl } = fixture();
  await assert.rejects(runIndexNow({ config, urls: [`${origin}/preview/page`], submit: true, fetchImpl }), /privé/);
  assert.equal(calls.length, 0);
});

test('clé absente, redirigée ou erronée arrête sans consulter les pages ni soumettre', async () => {
  for (const badKey of [response('', 404), response('', 302), response('different')]) {
    const { calls, fetchImpl } = fixture({ [keyUrl]: badKey });
    await assert.rejects(runIndexNow({ config, urls: [page], submit: true, fetchImpl }));
    assert.deepEqual(calls.map((x) => x.url), [keyUrl]);
  }
});

test('sitemap direct requis et URL exacte présente avant toute page', async () => {
  for (const badMap of [
    response('', 404),
    response('<urlset><url><loc>https://example.org/other</loc></url></urlset>'),
    response('<sitemapindex><sitemap><loc>https://example.org/other.xml</loc></sitemap></sitemapindex>'),
  ]) {
    const { calls, fetchImpl } = fixture({ [sitemapUrl]: badMap });
    await assert.rejects(runIndexNow({ config, urls: [page], submit: true, fetchImpl }));
    assert.deepEqual(calls.map((x) => x.url), [keyUrl, sitemapUrl]);
  }
});

test('canonical absent, doublé ou différent et interdiction robots empêchent le POST', async () => {
  const variants = [
    html('https://example.org/autre'),
    html(page, `<link rel='canonical' href='${page}'>`),
    '<html><head></head><body>Sans canonical</body></html>',
    html(page, '<meta content="noindex, follow" name="robots">'),
    html(page, '<meta name="bingbot" content="nosnippet">'),
    html(page, '<meta name="googlebot-news" content="none">'),
  ];
  for (const body of variants) {
    const { calls, fetchImpl } = fixture({ [page]: response(body, 200, { 'content-type': 'text/html' }) });
    await assert.rejects(runIndexNow({ config, urls: [page], submit: true, fetchImpl }));
    assert.deepEqual(calls.map((x) => x.url), [keyUrl, sitemapUrl, page]);
  }
  const { calls, fetchImpl } = fixture({ [page]: response(html(), 200, { 'content-type': 'text/html', 'x-robots-tag': 'bingbot: noindex' }) });
  await assert.rejects(runIndexNow({ config, urls: [page], submit: true, fetchImpl }), /noindex/);
  assert.deepEqual(calls.map((x) => x.url), [keyUrl, sitemapUrl, page]);
});

test('une seconde page invalide empêche tout POST groupé', async () => {
  const second = `${origin}/actualites`;
  const { calls, fetchImpl } = fixture({
    [sitemapUrl]: response(`<urlset><url><loc>${page}</loc></url><url><loc>${second}</loc></url></urlset>`),
    [second]: response(html(page), 200, { 'content-type': 'text/html' }),
  });
  await assert.rejects(runIndexNow({ config, urls: [page, second], submit: true, fetchImpl }), /canonical/);
  assert.deepEqual(calls.map((x) => x.url), [keyUrl, sitemapUrl, page, second]);
});

test('un seul POST après les contrôles, 200 reçu et 202 en attente distincts', async () => {
  for (const [status, state] of [[200, 'reçu'], [202, 'clé-en-attente']]) {
    const { calls, fetchImpl } = fixture({ [endpoint]: response('', status) });
    const result = await runIndexNow({ config, urls: [page], submit: true, fetchImpl });
    assert.equal(result.state, state);
    assert.deepEqual(calls.map((x) => x.url), [keyUrl, sitemapUrl, page, endpoint]);
    assert.equal(calls[3].init.method, 'POST');
    assert.deepEqual(JSON.parse(calls[3].init.body), {
      host: 'example.org', key, keyLocation: keyUrl, urlList: [page],
    });
  }
});

test('erreur POST signalée sans relance automatique', async () => {
  const { calls, fetchImpl } = fixture({ [endpoint]: response('', 429) });
  await assert.rejects(runIndexNow({ config, urls: [page], submit: true, fetchImpl }), /HTTP 429/);
  assert.equal(calls.filter((x) => x.url === endpoint).length, 1);
});
