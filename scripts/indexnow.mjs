#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 20;
const TIMEOUT_MS = 10_000;
const PRIVATE_SEGMENT = /^(?:admin(?:istrator|istration)?|auth(?:entication)?|login|log-in|sign-?in|sign-?up|register|registration|connexion|inscription|operator|dashboard|dash-board|preview|pre-view|private|internal|account|compte|mon-compte|my-account|control-panel|back-office|backoffice)(?:[-_].*)?$/i;

function fail(message) {
  throw new Error(message);
}

function parseOrigin(value) {
  if (typeof value !== 'string' || !/^https:\/\//.test(value)) fail('Configuration: origin doit être une origine HTTPS.');
  let parsed;
  try { parsed = new URL(value); } catch { fail('Configuration: origin invalide.'); }
  if (parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/' || parsed.port ||
      (value !== parsed.origin && value !== `${parsed.origin}/`)) {
    fail('Configuration: origin doit être une origine HTTPS canonique, sans chemin, port ni identifiants.');
  }
  return parsed.origin;
}

export function validateConfig(config) {
  if (!config || typeof config !== 'object') fail('Configuration IndexNow absente.');
  const origin = parseOrigin(config.origin);
  if (typeof config.key !== 'string' || !/^[A-Za-z0-9-]{8,128}$/.test(config.key)) {
    fail('Configuration: clé IndexNow invalide (8 à 128 caractères alphanumériques ou tirets).');
  }
  return { origin, key: config.key };
}

export function validateUrls(input, origin) {
  if (!Array.isArray(input) || input.length < 1 || input.length > MAX_URLS) {
    fail(`Fournir 1 à ${MAX_URLS} URL explicites.`);
  }
  const seen = new Set();
  return input.map((raw) => {
    if (typeof raw !== 'string' || !/^https:\/\//.test(raw) || /[\s\\?#\x00-\x1f\x7f]/.test(raw)) fail('URL HTTPS absolue invalide.');
    let url;
    try { url = new URL(raw); } catch { fail('URL HTTPS absolue invalide.'); }
    if (url.username || url.password || url.search || url.hash || url.origin !== origin || url.port) {
      fail('URL hors origine, avec identifiants, port, query ou fragment refusée.');
    }
    // Reject normalization tricks and all encoded paths, including encoded dot/slash traversal.
    if (url.href !== raw || /%|\/\/|\\/.test(url.pathname)) fail('URL non canonique ou chemin encodé refusé.');
    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.some((part) => part === '.' || part === '..' || PRIVATE_SEGMENT.test(part))) {
      fail('Chemin privé ou traversée refusé.');
    }
    if (seen.has(raw)) fail('Liste contenant une URL en double.');
    seen.add(raw);
    return raw;
  });
}

async function request(fetchImpl, url, init = {}, maxBytes = 2_000_000) {
  const response = await fetchImpl(url, {
    ...init,
    redirect: 'manual',
    credentials: 'omit',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response || typeof response.status !== 'number') fail('Réponse HTTP invalide.');
  if (maxBytes === 0) return { response, text: '' };
  const length = Number(response.headers?.get('content-length'));
  if (Number.isFinite(length) && length > maxBytes) fail('Réponse HTTP trop volumineuse.');
  const decoder = new TextDecoder();
  let text = '';
  let bytes = 0;
  if (response.body) {
    for await (const chunk of response.body) {
      bytes += chunk.byteLength;
      if (bytes > maxBytes) fail('Réponse HTTP trop volumineuse.');
      text += decoder.decode(chunk, { stream: true });
    }
    text += decoder.decode();
  }
  return { response, text };
}

function require200(response, label) {
  if (response.status !== 200) fail(`${label} : HTTP ${response.status}, redirection ou erreur refusée.`);
}

function xmlDecode(value) {
  return value.replace(/&(?:amp|lt|gt|quot|apos|#(?:x[0-9a-f]+|[0-9]+));/gi, (entity) => {
    const name = entity.slice(1, -1).toLowerCase();
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
    if (name in named) return named[name];
    const code = name.startsWith('#x') ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  });
}

function sitemapUrls(xml) {
  if (!/<(?:[\w.-]+:)?urlset(?:\s|>)/i.test(xml)) fail('Sitemap : <urlset> XML attendu.');
  const found = new Set();
  const clean = xml.replace(/<!--[\s\S]*?-->/g, '');
  for (const entry of clean.matchAll(/<(?:[\w.-]+:)?url\b[^>]*>([\s\S]*?)<\/(?:[\w.-]+:)?url\s*>/gi)) {
    const loc = entry[1].match(/<(?:[\w.-]+:)?loc\b[^>]*>([\s\S]*?)<\/(?:[\w.-]+:)?loc\s*>/i);
    if (loc) found.add(xmlDecode(loc[1].trim()));
  }
  return found;
}

function attrs(tag) {
  const result = new Map();
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4]);
  }
  return result;
}

function validatePage(html, headers, url) {
  if (!/\btext\/html\b/i.test(headers?.get('content-type') ?? '')) fail(`Page ${url} : type HTML absent.`);
  const clean = html.replace(/<!--[\s\S]*?-->/g, '');
  const canonicals = [...clean.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => attrs(m[0]))
    .filter((a) => /(?:^|\s)canonical(?:\s|$)/i.test(a.get('rel') ?? ''));
  if (canonicals.length !== 1 || canonicals[0].get('href') !== url) fail(`Page ${url} : canonical unique et exacte requis.`);
  const directives = [headers?.get('x-robots-tag') ?? ''];
  for (const match of clean.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attrs(match[0]);
    if (/^(?:robots|[\w-]*bot(?:[-_][\w-]+)?)$/i.test(a.get('name') ?? '') ||
        /^x-robots-tag$/i.test(a.get('http-equiv') ?? '')) directives.push(a.get('content') ?? '');
  }
  if (directives.some((value) => /(?:^|[\s,;:])(?:noindex|nosnippet|none)(?=$|[\s,;])/i.test(value))) {
    fail(`Page ${url} : noindex/nosnippet interdit.`);
  }
}

export async function runIndexNow({ config, urls, submit = false, fetchImpl = globalThis.fetch }) {
  const { origin, key } = validateConfig(config);
  const pages = validateUrls(urls, origin);
  if (!submit) return { state: 'simulation', count: pages.length, urls: pages };
  if (typeof fetchImpl !== 'function') fail('Client HTTP absent.');

  const keyLocation = `${origin}/${key}.txt`;
  const keyFile = await request(fetchImpl, keyLocation, { method: 'GET' }, 256);
  require200(keyFile.response, 'Fichier-clé');
  if (keyFile.text !== key && keyFile.text !== `${key}\n` && keyFile.text !== `${key}\r\n`) fail('Fichier-clé : contenu différent.');

  const sitemap = await request(fetchImpl, `${origin}/sitemap.xml`, { method: 'GET' }, 8_000_000);
  require200(sitemap.response, 'Sitemap');
  const indexed = sitemapUrls(sitemap.text);
  for (const page of pages) if (!indexed.has(page)) fail(`URL absente du sitemap : ${page}`);

  for (const page of pages) {
    const result = await request(fetchImpl, page, { method: 'GET' });
    require200(result.response, `Page ${page}`);
    validatePage(result.text, result.response.headers, page);
  }

  const payload = { host: new URL(origin).host, key, keyLocation, urlList: pages };
  const { response } = await request(fetchImpl, ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  }, 0);
  if (response.status === 200) return { state: 'reçu', count: pages.length };
  if (response.status === 202) return { state: 'clé-en-attente', count: pages.length };
  fail(`IndexNow : HTTP ${response.status}, soumission non confirmée.`);
}

async function main(argv) {
  let urlsPath;
  let submit = false;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--urls' && !urlsPath) urlsPath = argv[++i];
    else if (argv[i] === '--submit' && !submit) submit = true;
    else fail('Usage : node scripts/indexnow.mjs --urls fichier.txt [--submit]');
  }
  if (!urlsPath || urlsPath.startsWith('--')) fail('Usage : node scripts/indexnow.mjs --urls fichier.txt [--submit]');
  const configPath = new URL('./indexnow.config.json', import.meta.url);
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  const urls = (await readFile(resolve(urlsPath), 'utf8')).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const result = await runIndexNow({ config, urls, submit });
  process.stdout.write(`${result.state} : ${result.count} URL(s)${submit ? ' ; réception ne signifie pas indexation ni citation.' : ' ; aucun accès réseau.'}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`IndexNow : ${error.message}\n`);
    process.exitCode = 1;
  });
}
