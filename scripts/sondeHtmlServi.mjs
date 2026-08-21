#!/usr/bin/env node
/**
 * Sonde du HTML SERVI en production.
 *
 * Pourquoi elle existe. Douze pages sont sorties de l'index de Google avec la
 * mention « Page en double sans URL canonique selectionnee par l'utilisateur »,
 * et le defaut n'a ete compris que trois semaines plus tard, dans un rapport
 * d'indexation. Rien, dans le depot, n'etait capable de dire AU MOMENT ou cela
 * se produit qu'un <head> manque en production. C'est ce que cette sonde fait,
 * et c'est tout ce qu'elle fait.
 *
 * Elle N'EXECUTE AUCUN JAVASCRIPT : elle lit l'octet servi, comme un robot qui
 * n'ouvrirait pas de moteur de rendu. Un defaut visible seulement apres rendu
 * n'est pas de son ressort.
 *
 * Elle ne repare pas, ne republie pas, ne relance aucun build. Elle constate,
 * et elle fait echouer le job.
 *
 * Perimetre : toutes les URLs du sitemap SERVI, c'est-a-dire exactement
 * l'ensemble que nous declarons indexable a Google. Le sitemap etant produit
 * par publishedRoutes.mjs, la liste n'est jamais tenue a la main. Couvrir tout
 * plutot qu'echantillonner coute quelques centaines de requetes par jour et
 * supprime la question « cette famille est-elle representee ».
 */
import { regleJsonLd } from "./jsonLdExpectations.mjs";

const BASE = process.env.SONDE_BASE_URL || "https://i-ca.re";
const CONCURRENCE = Number(process.env.SONDE_CONCURRENCE || 6);
const SITEMAP = `${BASE.replace(/\/$/, "")}/sitemap.xml`;

const sansCommentaires = (s) => s.replace(/<!--[\s\S]*?-->/g, "");
const attr = (balise, nom) => (balise.match(new RegExp(`${nom}="([^"]*)"`, "i")) || [])[1] ?? null;

async function texte(url) {
  const res = await fetch(url, { headers: { "User-Agent": "i-ca.re-sonde-html-servi" }, redirect: "manual" });
  return { statut: res.status, corps: res.ok ? await res.text() : "" };
}

/** Analyse une page servie et rend la liste de ce qui manque ou contredit. */
export function analyser(url, html) {
  const griefs = [];
  const coupe = html.indexOf("</head>");
  if (coupe === -1) return ["pas de </head> dans le document servi"];
  const head = sansCommentaires(html.slice(0, coupe));

  const titres = [...head.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map((m) => m[1].trim());
  if (titres.length === 0 || titres.every((t) => t === "")) griefs.push("aucun <title> non vide");
  else if (new Set(titres).size > 1) griefs.push(`${titres.length} <title> de valeurs differentes : ${[...new Set(titres)].join(" | ")}`);

  const balisesLien = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  const canoniques = [...new Set(balisesLien.filter((t) => (attr(t, "rel") || "").toLowerCase() === "canonical").map((t) => attr(t, "href")))];
  if (canoniques.length === 0) griefs.push("aucune <link rel=canonical>");
  else if (canoniques.length > 1) griefs.push(`${canoniques.length} canoniques differentes : ${canoniques.join(" | ")}`);
  else if (canoniques[0] !== url) griefs.push(`canonical ${canoniques[0]} au lieu de l'URL demandee ${url}`);

  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const valeurs = (cle) => [...new Set(metas.filter((t) => (attr(t, "name") || attr(t, "property")) === cle).map((t) => attr(t, "content")))];
  const desc = valeurs("description");
  if (desc.length === 0 || desc.every((d) => !d || !d.trim())) griefs.push("aucune meta description non vide");
  else if (desc.length > 1) griefs.push(`${desc.length} descriptions differentes`);

  const ogUrl = valeurs("og:url");
  if (ogUrl.length === 0) griefs.push("aucun og:url");
  else if (ogUrl.length > 1) griefs.push(`${ogUrl.length} og:url differents : ${ogUrl.join(" | ")}`);
  else if (canoniques.length === 1 && ogUrl[0] !== canoniques[0]) griefs.push(`og:url ${ogUrl[0]} different de la canonical ${canoniques[0]}`);

  // JSON-LD : meme table que le controle du prerendu, jamais une copie.
  const chemin = new URL(url).pathname.replace(/\/$/, "") || "/";
  const regle = regleJsonLd(chemin);
  if (regle) {
    const types = new Set();
    let illisible = false;
    for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        const parcourir = (n, prof) => {
          if (!n || prof > 10) return;
          if (Array.isArray(n)) return n.forEach((x) => parcourir(x, prof + 1));
          if (typeof n !== "object") return;
          const t = n["@type"];
          if (typeof t === "string") types.add(t);
          else if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x));
          if (n["@graph"]) parcourir(n["@graph"], prof + 1);
        };
        parcourir(JSON.parse(m[1]), 0);
      } catch {
        illisible = true;
      }
    }
    if (illisible) griefs.push("bloc JSON-LD illisible");
    const manquants = regle.expect.filter((t) => !types.has(t));
    if (manquants.length) griefs.push(`JSON-LD ${regle.label} : manque ${manquants.join(", ")}`);
  }
  return griefs;
}

async function main() {
  const sm = await texte(SITEMAP);
  if (sm.statut !== 200) {
    console.error(`[sonde] sitemap injoignable : HTTP ${sm.statut} sur ${SITEMAP}`);
    process.exit(1);
  }
  const urls = [...new Set([...sm.corps.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()))];
  if (urls.length === 0) {
    console.error("[sonde] sitemap sans aucune <loc> : rien a controler, ce qui est deja un defaut.");
    process.exit(1);
  }
  console.log(`[sonde] ${urls.length} URL(s) declarees au sitemap de ${BASE}, concurrence ${CONCURRENCE}.`);

  const fautives = [];
  let injoignables = 0;
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCE, urls.length) }, async () => {
      while (i < urls.length) {
        const url = urls[i++];
        try {
          const { statut, corps } = await texte(url);
          if (statut !== 200) {
            fautives.push({ url, griefs: [`HTTP ${statut}`] });
            injoignables++;
            continue;
          }
          const griefs = analyser(url, corps);
          if (griefs.length) fautives.push({ url, griefs });
        } catch (err) {
          fautives.push({ url, griefs: [`requete en echec : ${err?.message || err}`] });
          injoignables++;
        }
      }
    }),
  );

  fautives.sort((a, b) => a.url.localeCompare(b.url));
  for (const f of fautives) {
    console.error(`[sonde] ✗ ${f.url}`);
    for (const g of f.griefs) console.error(`[sonde]     ${g}`);
  }
  console.log(
    `[sonde] ${urls.length - fautives.length}/${urls.length} conforme(s), ${fautives.length} fautive(s), dont ${injoignables} injoignable(s).`,
  );
  if (fautives.length) {
    console.error("[sonde] ECHEC : le HTML servi ne porte pas ce qu'il devrait.");
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
