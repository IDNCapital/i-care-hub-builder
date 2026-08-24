#!/usr/bin/env node
/**
 * Verificateur d'identite fonctionnelle de norm().
 *
 * Compare, sur un jeu d'essai, les DEUX corps d'origine de norm() qui vivaient
 * en double dans le depot, et le module unique src/lib/norm.js une fois qu'il
 * existe. Les deux corps d'origine sont portes ici EN DUR, recopies caractere
 * pour caractere en retirant les seules annotations de type : apres le lot ils
 * n'existent plus dans le depot, et cette copie est ce qui permet encore de
 * les comparer.
 *
 * Node 20, ESM, zero dependance.
 *
 * Sortie : derniere ligne EQUIVALENCE OK (code 0) ou EQUIVALENCE KO (code 1).
 * Les exceptions attendues n'affectent pas le code de sortie.
 */

// ---------------------------------------------------------------------------
// Corps d'origine 1 : src/lib/taxonomy.ts, lignes 14 a 18.
// Contrat STRICT : leve sur null, undefined et tout non-chaine.
// Recopie a l'identique, seule l'annotation `: string` a ete retiree.
// ---------------------------------------------------------------------------
const normClientOrigine = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// ---------------------------------------------------------------------------
// Corps d'origine 2 : scripts/publishedRoutes.mjs, lignes 15 a 20.
// Contrat TOLERANT : rend "" sur null, undefined et tout non-chaine.
// Recopie a l'identique, aucune annotation de type a retirer.
// ---------------------------------------------------------------------------
function normScriptsOrigine(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ---------------------------------------------------------------------------
// Le module unique, charge par import dynamique TOLERANT : ce fichier doit
// pouvoir tourner avant que le module existe.
// ---------------------------------------------------------------------------
const mod = await import(new URL("../src/lib/norm.js", import.meta.url)).catch(() => null);

// ---------------------------------------------------------------------------
// Jeu d'essai.
//
// D'abord les libelles REELS releves dans le depot : specialites et
// problematiques de src/lib/taxonomy.ts (SPECIALITY_GROUPS,
// PROBLEMATIQUE_GROUPS, PUBLIC_CIBLE_GROUPS), professions et slugs publics
// releves dans scripts/prerender.mjs et dans le sitemap statique.
// C'est sur eux, et sur eux seuls, qu'une divergence est un arret.
// ---------------------------------------------------------------------------
const LIBELLES_REELS = [
  // Specialites, SPECIALITY_GROUPS de src/lib/taxonomy.ts
  "Soin psychique",
  "Psychologie clinique",
  "Psychologie du travail",
  "Psychotherapie humaniste",
  "Psychothérapie humaniste",
  "Psychothérapie intégrative",
  "Thérapie EMDR",
  "Thérapie brève",
  "Thérapie cognitivo-comportementale (TCC)",
  "TBSI",
  "Sophrologie",
  "Sophrothérapie",
  "Gestalt-thérapie",
  "Thérapie de couple",
  "Thérapie familiale",
  "Art-thérapie",
  "Hypnothérapie",
  "EFT",
  "Psychotraumatologie",
  "Soin du corps",
  "Massage bien-être",
  "Kobido",
  "Réflexologie plantaire",
  "Shiatsu",
  "Breathwork",
  "Fasciathérapie",
  "Fasciathérapie biodynamique",
  "Pratiques énergétiques",
  "Reiki",
  "Rebirthing",
  "Périnatalité & parentalité",
  "Sage-femme",
  "Accompagnement périnatal",
  "Yoga prénatal",
  "Préparation à la naissance",
  // Problematiques, PROBLEMATIQUE_GROUPS de src/lib/taxonomy.ts
  "Stress et anxiété",
  "anxiété",
  "anxiété de performance",
  "crises d'angoisse",
  "stress",
  "gestion des émotions",
  "surcharge mentale",
  "prise de parole en public",
  "charge mentale",
  "phobies",
  "Travail",
  "burn-out",
  "souffrance au travail",
  "transition professionnelle",
  "orientation professionnelle",
  "Vie et transitions",
  "transitions de vie",
  "périodes de doute",
  "blocages personnels",
  "deuil",
  "dépression",
  "perte de sens",
  "situation de crise",
  "solitude",
  "souffrance psychique",
  "Estime et confiance",
  "estime de soi",
  "peur de l'échec",
  "manque de confiance",
  "développement personnel",
  "hypersensibilité",
  "Relations",
  "difficultés relationnelles",
  "difficultés de couple",
  "difficultés familiales",
  "parentalité",
  "schémas répétitifs",
  "séparation",
  "Corps et bien-être",
  "douleur chronique",
  "gestion de la douleur",
  "relation au corps",
  "troubles du comportement alimentaire",
  "traumatismes",
  "troubles du sommeil",
  "arrêt du tabac",
  "addictions",
  "alimentation émotionnelle",
  "détente et relaxation",
  "fatigue",
  "gestion du poids",
  "mal de dos",
  "ménopause",
  "tensions corporelles",
  "Scolarité",
  "stress scolaire",
  "difficultés de concentration",
  "phobie scolaire",
  "pression scolaire",
  "Périnatalité",
  "grossesse",
  "post-partum",
  "allaitement",
  "dépression post-partum",
  "sommeil du nourrisson",
  "diversification alimentaire",
  "gestion des émotions de l'enfant",
  "périnatalité",
  // Publics cibles, PUBLIC_CIBLE_GROUPS de src/lib/taxonomy.ts
  "Enfants",
  "enfants",
  "Adolescents",
  "adolescents",
  "Couples",
  "couples",
  "Familles",
  "familles",
  "Femmes enceintes",
  "femmes enceintes",
  "Jeunes parents",
  "jeunes parents",
  "Parents de jeunes enfants",
  "parents de jeunes enfants",
  "Sportifs",
  "sportifs",
  // Slugs publics releves dans scripts/prerender.mjs
  "i-ca-re-nansouty",
  "i-ca-re-pey-berland",
  "i-ca-re-jardin-public",
  "i-ca-re-chartrons",
  "i-ca-re-floirac",
  "i-ca-re-lormont",
  "i-ca-re-toulouse-capitole",
  "i-ca-re-le-bouscat",
  "burn-out-reconnaitre-les-signes",
  "exercer-en-lieu-pluridisciplinaire",
  // Libelles de cabinets, CABINETS_LABEL de src/lib/taxonomy.ts
  "Nansouty",
  "Pey-Berland",
  "Jardin Public",
  "Chartrons",
];

// ---------------------------------------------------------------------------
// Cas synthetiques : accents, casse, tirets, points, apostrophes, espaces
// multiples. Une divergence ici se consigne mais n'arrete pas le lot.
// ---------------------------------------------------------------------------
const CAS_SYNTHETIQUES = [
  "",
  " ",
  "   ",
  "A",
  "a",
  "AAA",
  "Éé",
  "ÀÂÄÇÈÉÊËÎÏÔÖÙÛÜŸ",
  "àâäçèéêëîïôöùûüÿ",
  "é",
  "é",
  "Ça  va   bien",
  "tiret-simple",
  "tiret--double",
  "point.median.absent",
  "apostrophe'droite",
  "apostrophe’courbe",
  "  espaces  multiples  ",
  "MiXeD CaSe Avec Accents ÉÈÊ",
  "ﬁligrane",
  "Ångstrom",
  "Å",
  "Straße",
  "ǅ",
  "123",
  "!?;:,",
  "\t\n",
  "emoji \u{1F600} conserve",
];

// ---------------------------------------------------------------------------
// Divergence CONNUE, hors critere : c'est elle qui motive le lot.
// normScriptsOrigine rend "" la ou normClientOrigine leve. Jamais un arret.
// ---------------------------------------------------------------------------
const CAS_DIVERGENCE_CONNUE = [
  ["null", null],
  ["undefined", undefined],
  ["nombre", 42],
  ["objet", { nom: "x" }],
];

function evaluer(fn, valeur) {
  try {
    return { ok: true, valeur: fn(valeur) };
  } catch (err) {
    return { ok: false, erreur: err && err.constructor ? err.constructor.name : "Error" };
  }
}

function rendu(r) {
  return r.ok ? JSON.stringify(r.valeur) : `leve ${r.erreur}`;
}

function memeResultat(a, b) {
  if (a.ok !== b.ok) return false;
  if (a.ok) return a.valeur === b.valeur;
  return true;
}

let ko = false;

if (!mod) {
  console.log("MODULE ABSENT");
  console.log("src/lib/norm.js introuvable ou non chargeable : seuls les deux corps d'origine sont compares.");
} else if (typeof mod.norm !== "function") {
  console.error("MODULE CHARGE MAIS SANS EXPORT norm : " + Object.keys(mod).join(", "));
  ko = true;
}

const normUnique = mod && typeof mod.norm === "function" ? mod.norm : null;

// --- Section 1 : libelles reels -------------------------------------------
console.log(`--- libelles reels (${LIBELLES_REELS.length}) ---`);
let ecartsReelsOrigine = 0;
let ecartsReelsModule = 0;
for (const v of LIBELLES_REELS) {
  const a = evaluer(normClientOrigine, v);
  const b = evaluer(normScriptsOrigine, v);
  if (!memeResultat(a, b)) {
    ecartsReelsOrigine++;
    console.error(`ECART ORIGINE sur libelle reel ${JSON.stringify(v)} : client ${rendu(a)} vs scripts ${rendu(b)}`);
  }
  if (normUnique) {
    const c = evaluer(normUnique, v);
    if (!memeResultat(a, c)) {
      ecartsReelsModule++;
      console.error(`ECART MODULE sur libelle reel ${JSON.stringify(v)} : client ${rendu(a)} vs module ${rendu(c)}`);
    }
  }
}
console.log(
  `libelles reels : ${ecartsReelsOrigine} ecart(s) entre les deux corps d'origine, ` +
    (normUnique ? `${ecartsReelsModule} ecart(s) entre le module unique et le corps client.` : "module non charge."),
);
if (ecartsReelsOrigine > 0 || ecartsReelsModule > 0) ko = true;

// --- Section 2 : synthetique ----------------------------------------------
console.log(`--- synthetique (${CAS_SYNTHETIQUES.length}) ---`);
let ecartsSyntOrigine = 0;
let ecartsSyntModule = 0;
for (const v of CAS_SYNTHETIQUES) {
  const a = evaluer(normClientOrigine, v);
  const b = evaluer(normScriptsOrigine, v);
  if (!memeResultat(a, b)) {
    ecartsSyntOrigine++;
    console.warn(`ecart synthetique consigne, hors critere, ${JSON.stringify(v)} : client ${rendu(a)} vs scripts ${rendu(b)}`);
  }
  if (normUnique) {
    const c = evaluer(normUnique, v);
    if (!memeResultat(a, c)) {
      ecartsSyntModule++;
      console.error(`ECART MODULE sur cas synthetique ${JSON.stringify(v)} : client ${rendu(a)} vs module ${rendu(c)}`);
    }
  }
}
console.log(
  `synthetique : ${ecartsSyntOrigine} ecart(s) consigne(s) entre les deux corps d'origine, ` +
    (normUnique ? `${ecartsSyntModule} ecart(s) entre le module unique et le corps client.` : "module non charge."),
);
// Un ecart synthetique entre les DEUX CORPS D'ORIGINE se consigne et ne bloque
// pas. Un ecart du MODULE UNIQUE vis a vis du corps client bloque : le module
// doit reproduire le contrat strict a l'identique.
if (ecartsSyntModule > 0) ko = true;

// --- Section 3 : divergence connue, hors critere ---------------------------
console.log(`--- divergence connue, hors critere (${CAS_DIVERGENCE_CONNUE.length}) ---`);
let contratStrictTenu = 0;
for (const [nom, v] of CAS_DIVERGENCE_CONNUE) {
  const a = evaluer(normClientOrigine, v);
  const b = evaluer(normScriptsOrigine, v);
  const c = normUnique ? evaluer(normUnique, v) : null;
  console.log(
    `${nom} : client ${rendu(a)} | scripts ${rendu(b)}` + (c ? ` | module ${rendu(c)}` : ""),
  );
  if (c && !c.ok) contratStrictTenu++;
}
if (normUnique) {
  console.log(
    `contrat strict du module unique : ${contratStrictTenu}/${CAS_DIVERGENCE_CONNUE.length} cas levent, comme le corps client.`,
  );
  if (contratStrictTenu !== CAS_DIVERGENCE_CONNUE.length) {
    console.error("Le module unique n'est pas strict sur les quatre cas de la divergence connue.");
    ko = true;
  }
}

console.log(ko ? "EQUIVALENCE KO" : "EQUIVALENCE OK");
process.exit(ko ? 1 : 0);
