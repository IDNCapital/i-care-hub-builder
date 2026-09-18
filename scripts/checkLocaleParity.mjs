#!/usr/bin/env node
/**
 * Parite des clefs entre src/locales/fr.json et src/locales/en.json.
 * Preuve demandee pour la dette WEB-TOULOUSE-NON-I18N (lot WEB-DETTES-1) :
 * verifie que toute clef presente d'un cote existe de l'autre, sans se
 * soucier des valeurs (traduction attendue, pas identite de texte).
 *
 * Usage : node scripts/checkLocaleParity.mjs
 * Sortie non nulle si au moins une clef manque d'un cote.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FR_PATH = join(__dirname, "..", "src", "locales", "fr.json");
const EN_PATH = join(__dirname, "..", "src", "locales", "en.json");

function collectKeys(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...collectKeys(v, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

const fr = JSON.parse(readFileSync(FR_PATH, "utf-8"));
const en = JSON.parse(readFileSync(EN_PATH, "utf-8"));

const frKeys = new Set(collectKeys(fr));
const enKeys = new Set(collectKeys(en));

const missingInEn = [...frKeys].filter((k) => !enKeys.has(k)).sort();
const missingInFr = [...enKeys].filter((k) => !frKeys.has(k)).sort();

console.log(`[locale-parity] fr.json : ${frKeys.size} clefs | en.json : ${enKeys.size} clefs`);

if (missingInEn.length === 0 && missingInFr.length === 0) {
  console.log("[locale-parity] parite complete : aucune clef manquante d'un cote ou de l'autre.");
  process.exit(0);
}

if (missingInEn.length > 0) {
  console.log(`[locale-parity] ${missingInEn.length} clef(s) presente(s) en fr, absente(s) en en :`);
  for (const k of missingInEn) console.log(`  - ${k}`);
}
if (missingInFr.length > 0) {
  console.log(`[locale-parity] ${missingInFr.length} clef(s) presente(s) en en, absente(s) en fr :`);
  for (const k of missingInFr) console.log(`  - ${k}`);
}
process.exit(1);
