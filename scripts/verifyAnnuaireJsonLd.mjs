#!/usr/bin/env node
/**
 * Sonde de preuve du lot 4 du sprint 15 : le balisage de l'index annuaire.
 *
 * Lit dist/patients/index.html puis dist/en/patients/index.html et imprime,
 * pour chacun, des COMPTES et la seule URL du premier element du fil d'ariane.
 * Aucun nom de personne n'est imprime : le balisage contient des noms affiches
 * publiquement, la sortie d'un script de build n'a pas a les recopier.
 *
 * Sort en code non nul si un fichier manque.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const FICHIERS = [
  { label: "fr", chemin: "dist/patients/index.html" },
  { label: "en", chemin: "dist/en/patients/index.html" },
];

/** Extrait le contenu brut de chaque <script type="application/ld+json">. */
function blocsLdJson(html) {
  const blocs = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) blocs.push(m[1]);
  return blocs;
}

function typesDuNoeud(noeud) {
  const t = noeud && noeud["@type"];
  if (!t) return [];
  return Array.isArray(t) ? t : [t];
}

let manquant = false;

for (const { label, chemin } of FICHIERS) {
  const abs = resolve(process.cwd(), chemin);
  if (!existsSync(abs)) {
    console.error(`[annuaire:${label}] FICHIER ABSENT ${chemin}`);
    manquant = true;
    continue;
  }
  const html = readFileSync(abs, "utf8");
  const blocs = blocsLdJson(html);

  let graphesConformes = 0;
  let elementsItemList = null;
  let position1 = null;

  for (const brut of blocs) {
    let data;
    try {
      data = JSON.parse(brut);
    } catch {
      continue;
    }
    const graph = data && Array.isArray(data["@graph"]) ? data["@graph"] : null;
    if (!graph) continue;
    const fil = graph.find((n) => typesDuNoeud(n).includes("BreadcrumbList"));
    const liste = graph.find((n) => typesDuNoeud(n).includes("ItemList"));
    if (!fil || !liste) continue;
    graphesConformes += 1;
    elementsItemList = Array.isArray(liste.itemListElement) ? liste.itemListElement.length : 0;
    const premier = (fil.itemListElement || []).find((e) => e && e.position === 1);
    position1 = premier ? premier.item : null;
  }

  const urlsFiches = new Set();
  const reFiche = /["'(]((?:https:\/\/i-ca\.re)?\/praticien\/[a-z0-9-]+)\/?["')]/gi;
  let f;
  while ((f = reFiche.exec(html)) !== null) {
    urlsFiches.add(f[1].replace(/^https:\/\/i-ca\.re/, "").replace(/\/$/, ""));
  }

  console.log(
    `[annuaire:${label}] ${chemin} | blocs ld+json ${blocs.length} | graphes BreadcrumbList+ItemList ${graphesConformes} | elements ItemList ${elementsItemList ?? "n/a"} | URL /praticien/ distinctes ${urlsFiches.size} | fil position 1 ${position1 ?? "n/a"}`,
  );
}

process.exit(manquant ? 1 : 0);
