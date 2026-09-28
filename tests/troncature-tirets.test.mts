/**
 * Test ciblé WEB-DETTES-5 : la classe de caractères de troncature de
 * src/pages/SpecialiteDetail.tsx et src/pages/ProblematiqueDetail.tsx
 * (fonction privée truncateDesc, non exportée) ne doit plus contenir les
 * caractères littéraux U+2013 (tiret demi cadratin) ni U+2014 (tiret
 * cadratin), tout en conservant le même comportement de troncature.
 *
 * Méthode : la regex est extraite du texte source réel des deux fichiers
 * (pas une copie tapée à la main), puis rejouée sur des cas de troncature.
 * Exécution : `node --experimental-strip-types tests/troncature-tirets.test.mts`.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");

const FICHIERS = [
  "src/pages/SpecialiteDetail.tsx",
  "src/pages/ProblematiqueDetail.tsx",
];

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  try {
    assert.deepStrictEqual(actual, expected);
    console.log(`ok - ${label}`);
  } catch {
    failures += 1;
    console.error(`FAIL - ${label}: obtenu ${JSON.stringify(actual)}, attendu ${JSON.stringify(expected)}`);
  }
}

for (const relatif of FICHIERS) {
  const chemin = join(RACINE, relatif);
  const source = readFileSync(chemin, "utf8");

  // 1. Aucun caractère littéral U+2013 / U+2014 dans le fichier (le point
  //    corrigé par WEB-DETTES-5 : régression du caractère brut dans la classe).
  const contientLitteral = /[\u2013\u2014]/.test(source);
  check(`${relatif} : aucun U+2013/U+2014 littéral`, contientLitteral, false);

  // 2. Extraction de la classe de caractères réellement présente dans le
  //    fichier source (pas une regex retapée), pour prouver son comportement.
  const correspondance = source.match(/\.replace\(\/(.+?)\/,\s*""\)/);
  check(`${relatif} : regex de troncature trouvée`, correspondance !== null, true);
  if (!correspondance) continue;

  const sourceRegex = correspondance[1];

  // 3. La regex source (texte brut du fichier) contient bien les
  //    échappements attendus, preuve que le remplacement U+2013/U+2014 a
  //    eu lieu par échappement et non par simple suppression.
  check(`${relatif} : échappement \\u2013 présent`, sourceRegex.includes("\\u2013"), true);
  check(`${relatif} : échappement \\u2014 présent`, sourceRegex.includes("\\u2014"), true);

  // 4. Le comportement de troncature est inchangé : la classe de
  //    caractères, construite depuis le texte réel du fichier, retire
  //    toujours les tirets (cadratin, demi cadratin, simple), la
  //    ponctuation et les espaces en fin de chaîne.
  const regexTroncature = new RegExp(sourceRegex);
  check(
    `${relatif} : retire un tiret demi cadratin (U+2013) final`,
    "Texte de fin\u2013".replace(regexTroncature, ""),
    "Texte de fin",
  );
  check(
    `${relatif} : retire un tiret cadratin (U+2014) final`,
    "Texte de fin\u2014".replace(regexTroncature, ""),
    "Texte de fin",
  );
  check(
    `${relatif} : retire toujours virgule, espace et point finaux`,
    "Texte de fin, . ".replace(regexTroncature, ""),
    "Texte de fin",
  );
  check(
    `${relatif} : retire toujours un trait d'union simple final`,
    "Texte de fin-".replace(regexTroncature, ""),
    "Texte de fin",
  );
  check(
    `${relatif} : ne retire rien quand la chaîne ne finit pas par ces caractères`,
    "Texte de fin normal".replace(regexTroncature, ""),
    "Texte de fin normal",
  );
}

if (failures > 0) {
  console.error(`${failures} echec(s).`);
  process.exit(1);
} else {
  console.log("Tous les cas sont verts.");
}
