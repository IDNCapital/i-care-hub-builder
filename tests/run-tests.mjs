#!/usr/bin/env node
// Filet de non-regression : la garde des donnees de scripts/publishedRoutes.mjs
// doit rendre NON PUBLIABLE la sortie des deux points d'entree de generation,
// scripts/generate-sitemap.mjs et scripts/prerender.mjs, avec un statut non nul,
// PRERENDER_OPTIONAL=true compris.
//
// Methode : les VRAIS scripts sont copies tels quels dans un repertoire
// temporaire propre par cas, puis executes en processus enfant avec un double
// de frontiere reseau (tests/doubles/fetch-double.mjs) et, pour prerender, des
// doubles de frontiere navigateur/serveur/DOM (tests/doubles/modules, copies
// dans le node_modules du bac : le dossier garde ce nom pour rester suivi par
// Git, un node_modules reel y serait ignore).
// Les assertions lisent les codes de sortie, les journaux et les artefacts ;
// elles ne reimplementent aucune regle de production.
//
// Limite assumee : le vrai puppeteer n'etant pas installable ici, le cas sain
// de prerender ne va pas jusqu'a l'exit 0. Le double de navigateur leve un
// marqueur a launch(), et l'atteindre prouve que la passe a depasse le point
// de garde et allait capturer. Le vert de bout en bout se prend dans le depot
// complet avec `bun run build:ci`.
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const NL = String.fromCharCode(10);
const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOUBLE_FETCH = pathToFileURL(join(RACINE, "tests", "doubles", "fetch-double.mjs")).href;

const FICHIERS_COPIES = [
  "scripts/publishedRoutes.mjs",
  "scripts/generate-sitemap.mjs",
  "scripts/prerender.mjs",
  "scripts/siteUrl.mjs",
  "scripts/jsonLdExpectations.mjs",
  "src/lib/norm.js",
  "public/sitemap.xml",
];

// Sentinelles : simulent les artefacts que `vite build` laisse dans dist/.
// Une passe en garde ne doit JAMAIS les ecraser ; une passe saine du sitemap
// doit remplacer la sentinelle sitemap par le resultat complet.
const SENTINELLE_SITEMAP =
  '<?xml version="1.0" encoding="UTF-8"?>' + NL +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + NL +
  "<!-- SENTINELLE-DIST-SITEMAP : copie vite d'avant generation -->" + NL +
  "</urlset>" + NL;
const SENTINELLE_SHELL =
  "<!DOCTYPE html><html><head><title>coquille de test</title></head>" +
  "<body><!-- SENTINELLE-DIST-INDEX --></body></html>" + NL;

function creerBac() {
  const bac = mkdtempSync(join(tmpdir(), "garde-web-"));
  for (const f of FICHIERS_COPIES) {
    const dst = join(bac, f);
    mkdirSync(dirname(dst), { recursive: true });
    cpSync(join(RACINE, f), dst);
  }
  cpSync(join(RACINE, "tests", "doubles", "modules"), join(bac, "node_modules"), {
    recursive: true,
  });
  mkdirSync(join(bac, "dist"), { recursive: true });
  writeFileSync(join(bac, "dist", "sitemap.xml"), SENTINELLE_SITEMAP, "utf8");
  writeFileSync(join(bac, "dist", "index.html"), SENTINELLE_SHELL, "utf8");
  return bac;
}

function executer(bac, script, { fixture, mode, optional, panneTable }) {
  const env = {
    ...process.env,
    VITE_SUPABASE_URL: "https://supabase.double.local",
    VITE_SUPABASE_PUBLISHABLE_KEY: "cle-publique-factice-de-test",
    PRERENDER_OPTIONAL: optional ? "true" : "false",
    PUPPETEER_EXECUTABLE_PATH: process.execPath,
    GARDE_TEST_MODE: mode || "fixture",
    GARDE_TEST_FIXTURE: fixture ? join(RACINE, "tests", "fixtures", fixture) : "",
    GARDE_TEST_PANNE_TABLE: panneTable || "",
  };
  const r = spawnSync(
    process.execPath,
    ["--import", DOUBLE_FETCH, join("scripts", script)],
    { cwd: bac, env, encoding: "utf8", timeout: 60000 },
  );
  if (r.error || r.signal || r.status === null) {
    throw new Error(`Processus de test interrompu : ${r.error?.message || r.signal || "statut absent"}`);
  }
  return {
    code: r.status,
    sortie: (r.stdout || "") + (r.stderr || ""),
  };
}

// Chaque cas rend la liste de ses assertions en echec (vide = vert).
const CAS = [
  {
    nom: "S1 sitemap, donnees saines, OPTIONAL=false : exit 0 et sitemap publie",
    script: "generate-sitemap.mjs",
    options: { fixture: "sain.json", optional: false },
    verifier(res, bac, echecs) {
      if (res.code !== 0) echecs.push(`code ${res.code}, attendu 0`);
      const xml = readFileSync(join(bac, "dist", "sitemap.xml"), "utf8");
      if (xml.includes("SENTINELLE-DIST-SITEMAP")) echecs.push("sentinelle non remplacee");
      for (const loc of [
        "https://i-ca.re/praticien/anna-dupont/",
        "https://i-ca.re/patients/problematiques/stress/",
        "https://i-ca.re/patients/specialite/sophrologie/",
      ]) {
        if (!xml.includes(`<loc>${loc}</loc>`)) echecs.push(`loc absente : ${loc}`);
      }
    },
  },
  {
    nom: "S2 sitemap, donnees adverses, OPTIONAL=false : exit non nul, sitemap intact",
    script: "generate-sitemap.mjs",
    options: { fixture: "adverse.json", optional: false },
    verifier(res, bac, echecs) {
      if (res.code === 0) echecs.push("code 0, attendu non nul");
      if (!res.sortie.includes("GARDE DECLENCHEE")) echecs.push("releve de garde absent des journaux");
      const xml = readFileSync(join(bac, "dist", "sitemap.xml"), "utf8");
      if (xml !== SENTINELLE_SITEMAP) echecs.push("dist/sitemap.xml ecrase malgre la garde");
    },
  },
  {
    nom: "S3 sitemap, donnees adverses, OPTIONAL=true : exit non nul, sitemap intact",
    script: "generate-sitemap.mjs",
    options: { fixture: "adverse.json", optional: true },
    verifier(res, bac, echecs) {
      if (res.code === 0) echecs.push("code 0, attendu non nul (OPTIONAL ne couvre pas la donnee)");
      if (!res.sortie.includes("GARDE DECLENCHEE")) echecs.push("releve de garde absent des journaux");
      const xml = readFileSync(join(bac, "dist", "sitemap.xml"), "utf8");
      if (xml !== SENTINELLE_SITEMAP) echecs.push("dist/sitemap.xml ecrase malgre la garde");
    },
  },
  {
    nom: "S4 sitemap, panne reseau, OPTIONAL=true : exit 0, sitemap intact",
    script: "generate-sitemap.mjs",
    options: { mode: "panne", optional: true },
    verifier(res, bac, echecs) {
      if (res.code !== 0) echecs.push(`code ${res.code}, attendu 0`);
      if (!res.sortie.includes("skipping")) echecs.push("avertissement de saut absent");
      const xml = readFileSync(join(bac, "dist", "sitemap.xml"), "utf8");
      if (xml !== SENTINELLE_SITEMAP) echecs.push("dist/sitemap.xml modifie malgre le saut");
    },
  },
  {
    nom: "S5 sitemap, panne reseau, OPTIONAL=false : exit non nul, sitemap intact",
    script: "generate-sitemap.mjs",
    options: { mode: "panne", optional: false },
    verifier(res, bac, echecs) {
      if (res.code === 0) echecs.push("code 0, attendu non nul");
      const xml = readFileSync(join(bac, "dist", "sitemap.xml"), "utf8");
      if (xml !== SENTINELLE_SITEMAP) echecs.push("dist/sitemap.xml modifie malgre l'echec");
    },
  },
  {
    nom: "S6 sitemap, garde apres matchProblematiques puis panne reseau tardive, OPTIONAL=true : exit non nul, sitemap intact",
    script: "generate-sitemap.mjs",
    options: { mode: "mixte", fixture: "adverse.json", panneTable: "specialites", optional: true },
    verifier(res, bac, echecs) {
      if (res.code === 0) echecs.push("code 0, attendu non nul (la garde ne doit pas disparaitre derriere la panne reseau)");
      if (!res.sortie.includes("GARDE DECLENCHEE")) echecs.push("releve de garde absent des journaux");
      const xml = readFileSync(join(bac, "dist", "sitemap.xml"), "utf8");
      if (xml !== SENTINELLE_SITEMAP) echecs.push("dist/sitemap.xml ecrase malgre la garde");
    },
  },
  {
    nom: "S7 sitemap, garde apres matchSpecialites puis panne reseau tardive, OPTIONAL=true : exit non nul, sitemap intact",
    script: "generate-sitemap.mjs",
    options: { mode: "mixte", fixture: "adverse-specialite.json", panneTable: "articles", optional: true },
    verifier(res, bac, echecs) {
      if (res.code === 0) echecs.push("code 0, attendu non nul (la garde ne doit pas disparaitre derriere la panne reseau)");
      if (!res.sortie.includes("GARDE DECLENCHEE")) echecs.push("releve de garde absent des journaux");
      const xml = readFileSync(join(bac, "dist", "sitemap.xml"), "utf8");
      if (xml !== SENTINELLE_SITEMAP) echecs.push("dist/sitemap.xml ecrase malgre la garde");
    },
  },
  {
    nom: "P1 prerender, donnees saines, OPTIONAL=false : garde muette, passe continue jusqu'a la frontiere navigateur",
    script: "prerender.mjs",
    options: { fixture: "sain.json", optional: false },
    verifier(res, bac, echecs) {
      if (res.sortie.includes("GARDE DECLENCHEE")) echecs.push("garde declenchee sur donnees saines");
      if (!res.sortie.includes("Dynamic routes: 1 praticiens + 1 problematiques + 1 specialites"))
        echecs.push("routes dynamiques saines non calculees");
      if (!res.sortie.includes("FRONTIERE_NAVIGATEUR_ATTEINTE"))
        echecs.push("la passe n'a pas depasse le point de garde (frontiere navigateur non atteinte)");
    },
  },
  {
    nom: "P2 prerender, donnees adverses, OPTIONAL=false : exit non nul avant toute capture",
    script: "prerender.mjs",
    options: { fixture: "adverse.json", optional: false },
    verifier(res, bac, echecs) {
      if (res.code === 0) echecs.push("code 0, attendu non nul");
      if (!res.sortie.includes("GARDE DECLENCHEE")) echecs.push("releve de garde absent des journaux");
      if (res.sortie.includes("FRONTIERE_NAVIGATEUR_ATTEINTE"))
        echecs.push("la passe a continue vers la capture malgre la garde");
      const shell = readFileSync(join(bac, "dist", "index.html"), "utf8");
      if (shell !== SENTINELLE_SHELL) echecs.push("dist/index.html modifie malgre la garde");
    },
  },
  {
    nom: "P3 prerender, donnees adverses, OPTIONAL=true : exit non nul (anomalie de donnees jamais silencieuse)",
    script: "prerender.mjs",
    options: { fixture: "adverse.json", optional: true },
    verifier(res, bac, echecs) {
      if (res.code === 0) echecs.push("code 0, attendu non nul (OPTIONAL ne couvre pas la donnee)");
      if (!res.sortie.includes("GARDE DECLENCHEE")) echecs.push("releve de garde absent des journaux");
      if (res.sortie.includes("FRONTIERE_NAVIGATEUR_ATTEINTE"))
        echecs.push("la passe a continue vers la capture malgre la garde");
    },
  },
  {
    nom: "P4 prerender, panne reseau, OPTIONAL=true : routes dynamiques sautees, passe continue jusqu'a la frontiere navigateur",
    script: "prerender.mjs",
    options: { mode: "panne", optional: true },
    verifier(res, bac, echecs) {
      if (res.sortie.includes("GARDE DECLENCHEE")) echecs.push("garde declenchee sur panne reseau");
      if (!res.sortie.includes("skipping dynamic routes")) echecs.push("avertissement de saut absent");
      if (!res.sortie.includes("FRONTIERE_NAVIGATEUR_ATTEINTE"))
        echecs.push("la passe n'a pas continue apres la panne toleree");
    },
  },
  {
    nom: "P5 prerender, panne reseau, OPTIONAL=false : exit non nul avant toute capture",
    script: "prerender.mjs",
    options: { mode: "panne", optional: false },
    verifier(res, bac, echecs) {
      if (res.code === 0) echecs.push("code 0, attendu non nul");
      if (!res.sortie.includes("Failed to fetch dynamic routes")) echecs.push("erreur de fetch absente des journaux");
      if (res.sortie.includes("FRONTIERE_NAVIGATEUR_ATTEINTE"))
        echecs.push("la passe a continue malgre l'echec de fetch");
    },
  },
  {
    nom: "P6 prerender, garde apres matchProblematiques puis panne reseau tardive, OPTIONAL=true : exit non nul avant toute capture",
    script: "prerender.mjs",
    options: { mode: "mixte", fixture: "adverse.json", panneTable: "specialites", optional: true },
    verifier(res, bac, echecs) {
      if (res.code === 0) echecs.push("code 0, attendu non nul (la garde ne doit pas disparaitre derriere la panne reseau)");
      if (!res.sortie.includes("GARDE DECLENCHEE")) echecs.push("releve de garde absent des journaux");
      if (res.sortie.includes("FRONTIERE_NAVIGATEUR_ATTEINTE"))
        echecs.push("la passe a continue vers la capture malgre la garde");
    },
  },
  {
    nom: "P7 prerender, garde apres matchSpecialites puis panne reseau tardive, OPTIONAL=true : exit non nul avant toute capture",
    script: "prerender.mjs",
    options: { mode: "mixte", fixture: "adverse-specialite.json", panneTable: "articles", optional: true },
    verifier(res, bac, echecs) {
      if (res.code === 0) echecs.push("code 0, attendu non nul (la garde ne doit pas disparaitre derriere la panne reseau)");
      if (!res.sortie.includes("GARDE DECLENCHEE")) echecs.push("releve de garde absent des journaux");
      if (res.sortie.includes("FRONTIERE_NAVIGATEUR_ATTEINTE"))
        echecs.push("la passe a continue vers la capture malgre la garde");
    },
  },
];

let rouges = 0;
for (const cas of CAS) {
  const bac = creerBac();
  let echecs = [];
  try {
    const res = executer(bac, cas.script, cas.options);
    cas.verifier(res, bac, echecs);
  } catch (err) {
    echecs.push(`exception du test : ${err && err.message}`);
  } finally {
    rmSync(bac, { recursive: true, force: true });
  }
  if (echecs.length === 0) {
    console.log(`VERT  ${cas.nom}`);
  } else {
    rouges++;
    console.log(`ROUGE ${cas.nom}`);
    for (const e of echecs) console.log(`      - ${e}`);
  }
}

console.log(`${NL}${CAS.length - rouges}/${CAS.length} cas verts.`);
process.exit(rouges > 0 ? 1 : 0);
