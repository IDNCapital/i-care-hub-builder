#!/usr/bin/env node
/**
 * Liste des routes publiees, calculee sans build.
 *
 * C'est la mesure de ce que norm() decide : l'appariement des libelles de
 * taxonomie, donc quelles pages de detail problematique et specialite sont
 * publiees. Elle se prend en quelques secondes, la ou un build en prend huit.
 *
 * Ce script N'IMPLEMENTE AUCUN appariement. Il compose les fonctions exportees
 * par scripts/publishedRoutes.mjs, qui est le code du depot, et se contente
 * d'appliquer les MEMES prefixes de chemin que scripts/generate-sitemap.mjs et
 * scripts/prerender.mjs, releves ligne a ligne :
 *   /praticien/<slug>                  generate-sitemap.mjs:143, prerender.mjs:574
 *   /patients/problematiques/<slug>    generate-sitemap.mjs:178, prerender.mjs:582
 *   /patients/specialite/<slug>        generate-sitemap.mjs:201, prerender.mjs:592
 *   /patients/articles/<slug>          generate-sitemap.mjs:234, prerender.mjs:602
 *   installation.paths                 fetchInstallationMatrix, prerender.mjs:606
 * Le nettoyage de slug est celui de prerender.mjs:571, (x?.slug ?? "").toString().trim().
 *
 * publishedRoutes.mjs n'exporte pas de fonction unique rendant la liste : elle
 * est assemblee dans le main() non exporte des deux scripts de build. Composer
 * ses exports est donc le seul moyen de prendre la mesure sur le code du depot,
 * sans en reimplementer la moindre regle d'appariement.
 *
 * Import par NAMESPACE et non par noms : ce script doit tourner AVANT le lot,
 * quand echouerSiGardesDeclenchees n'existe pas encore, et un import nomme
 * manquant serait une erreur de liaison.
 *
 * Node 20, ESM, zero dependance.
 *
 * Arguments :
 *   --out <chemin>       ecrit la liste dans ce fichier
 *   --baseline <chemin>  relit une liste ecrite plus tot, imprime les lignes en
 *                        ecart dans les deux sens, les deux totaux et les deux
 *                        empreintes, et sort en code 1 s'il y a un ecart.
 *
 * Seuls des slugs d'URL publiques sortent d'ici. Aucune autre donnee de la base.
 */

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import * as PR from "./publishedRoutes.mjs";

// Le canal d'edition de ce depot transforme une sequence d'echappement en son
// caractere : la fin de ligne se prend donc par son code, jamais en litteral.
const NL = String.fromCharCode(10);

function lireArgument(nom) {
  const i = process.argv.indexOf(nom);
  if (i === -1) return null;
  const v = process.argv[i + 1];
  if (!v || v.startsWith("--")) {
    console.error(`[dumpPublishedRoutes] ${nom} attend un chemin.`);
    process.exit(2);
  }
  return v;
}

function slugPropre(x) {
  return (x?.slug ?? "").toString().trim();
}

function empreinte(liste) {
  return createHash("sha256").update(liste.join(NL) + NL, "utf8").digest("hex");
}

async function calculerRoutes() {
  const praticiens = await PR.fetchPraticiensPublies();
  const problematiques = await PR.fetchProblematiques();
  const matchedPb = PR.matchProblematiques(problematiques, praticiens);
  const specialites = await PR.fetchSpecialites();
  const matchedSp = PR.matchSpecialites(specialites, praticiens);
  const articles = await PR.fetchArticlesPublies();
  const installation = await PR.fetchInstallationMatrix();

  const routes = [];
  const vues = new Set();
  const ajouter = (chemin) => {
    if (vues.has(chemin)) return;
    vues.add(chemin);
    routes.push(chemin);
  };

  let nbPraticiens = 0;
  for (const p of praticiens) {
    const slug = slugPropre(p);
    if (!slug) continue;
    if (vues.has(`/praticien/${slug}`)) continue;
    ajouter(`/praticien/${slug}`);
    nbPraticiens++;
  }
  let nbProblematiques = 0;
  for (const pb of matchedPb) {
    const slug = slugPropre(pb);
    if (!slug) continue;
    if (vues.has(`/patients/problematiques/${slug}`)) continue;
    ajouter(`/patients/problematiques/${slug}`);
    nbProblematiques++;
  }
  let nbSpecialites = 0;
  for (const sp of matchedSp) {
    const slug = slugPropre(sp);
    if (!slug) continue;
    if (vues.has(`/patients/specialite/${slug}`)) continue;
    ajouter(`/patients/specialite/${slug}`);
    nbSpecialites++;
  }
  let nbArticles = 0;
  for (const ar of articles) {
    const slug = slugPropre(ar);
    if (!slug) continue;
    if (vues.has(`/patients/articles/${slug}`)) continue;
    ajouter(`/patients/articles/${slug}`);
    nbArticles++;
  }
  let nbInstallation = 0;
  for (const chemin of installation.paths) {
    if (vues.has(chemin)) continue;
    ajouter(chemin);
    nbInstallation++;
  }

  return {
    // Tri binaire par defaut de Array.prototype.sort, jamais localeCompare :
    // la comparaison doit etre reproductible d'une machine a l'autre.
    liste: routes.slice().sort(),
    compte: { nbPraticiens, nbProblematiques, nbSpecialites, nbArticles, nbInstallation },
    sources: {
      praticiens: praticiens.length,
      problematiques: problematiques.length,
      specialites: specialites.length,
      articles: articles.length,
    },
  };
}

async function main() {
  const cheminOut = lireArgument("--out");
  const cheminBaseline = lireArgument("--baseline");

  let resultat;
  try {
    resultat = await calculerRoutes();
  } catch (err) {
    console.error("[dumpPublishedRoutes] BASE INJOIGNABLE OU CALCUL EN ECHEC");
    console.error(String(err && err.stack ? err.stack : err));
    process.exit(3);
  }

  const { liste, compte, sources } = resultat;

  for (const route of liste) console.log(route);
  console.log(`TOTAL ${liste.length}`);
  console.log(`SHA256 ${empreinte(liste)}`);
  console.log(
    `DETAIL ${compte.nbPraticiens} praticiens + ${compte.nbProblematiques} problematiques ` +
      `+ ${compte.nbSpecialites} specialites + ${compte.nbArticles} articles ` +
      `+ ${compte.nbInstallation} sinstaller`,
  );
  console.log(
    `SOURCES ${sources.praticiens} praticiens publies, ${sources.problematiques} problematiques actives, ` +
      `${sources.specialites} specialites actives, ${sources.articles} articles publies`,
  );

  if (cheminOut) {
    await writeFile(cheminOut, liste.join(NL) + NL, "utf8");
    console.log(`ECRIT ${cheminOut}`);
  }

  let ecartConstate = false;
  if (cheminBaseline) {
    let brut;
    try {
      brut = await readFile(cheminBaseline, "utf8");
    } catch (err) {
      console.error(`[dumpPublishedRoutes] reference illisible : ${cheminBaseline} : ${err.message}`);
      process.exit(4);
    }
    const reference = brut.split(NL).map((l) => l.trim()).filter(Boolean).sort();
    const ensRef = new Set(reference);
    const ensNow = new Set(liste);
    const disparues = reference.filter((r) => !ensNow.has(r));
    const apparues = liste.filter((r) => !ensRef.has(r));

    console.log("--- comparaison a la reference ---");
    console.log(`REFERENCE ${cheminBaseline}`);
    console.log(`TOTAL reference ${reference.length} | TOTAL courant ${liste.length}`);
    console.log(`SHA256 reference ${empreinte(reference)}`);
    console.log(`SHA256 courant   ${empreinte(liste)}`);
    for (const r of disparues) console.log(`- ${r}`);
    for (const r of apparues) console.log(`+ ${r}`);
    if (disparues.length === 0 && apparues.length === 0) {
      console.log("ECART 0, les deux listes sont identiques.");
    } else {
      console.log(`ECART ${disparues.length} disparue(s), ${apparues.length} apparue(s).`);
      ecartConstate = true;
    }
  }

  // La garde des scripts de build ne fait echouer la passe qu'ICI, en toute fin,
  // apres que la liste complete a ete imprimee : la preuve du lot doit rester
  // lisible meme quand la garde se declenche.
  const gardeDeclenchee =
    typeof PR.echouerSiGardesDeclenchees === "function"
      ? PR.echouerSiGardesDeclenchees("[dumpPublishedRoutes]")
      : false;

  if (gardeDeclenchee) process.exit(5);
  if (ecartConstate) process.exit(1);
  process.exit(0);
}

main();
