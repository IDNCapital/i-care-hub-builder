/**
 * Test ciblé de src/lib/geo.ts, exécuté avec `node --experimental-strip-types`.
 * Pas de framework ajouté ; assertions manuelles + process.exit(1) si échec.
 */
import assert from "node:assert/strict";
import { parseLat, parseLng } from "../src/lib/geo.ts";

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  try {
    assert.deepStrictEqual(actual, expected);
    console.log(`ok - ${label}`);
  } catch {
    failures += 1;
    console.error(`FAIL - ${label}: got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
  }
}

// Valeurs valides
check("lat valide (nombre)", parseLat(44.84), 44.84);
check("lng valide (nombre)", parseLng(-0.58), -0.58);
check("lat valide (chaîne)", parseLat("44.84"), 44.84);
check("lat bornes -90", parseLat(-90), -90);
check("lat bornes 90", parseLat(90), 90);
check("lng bornes -180", parseLng(-180), -180);
check("lng bornes 180", parseLng(180), 180);
check("lat zéro", parseLat(0), 0);

// Valeurs vides
check("lat null", parseLat(null), null);
check("lat undefined", parseLat(undefined), null);
check("lat chaîne vide", parseLat(""), null);
check("lat chaîne blancs", parseLat("   "), null);

// Valeurs non numériques
check("lat texte", parseLat("N/A"), null);
check("lat NaN direct", parseLat(NaN), null);
check("lat objet", parseLat({} as unknown), null);

// Valeurs infinies
check("lat +Infinity", parseLat(Infinity), null);
check("lng -Infinity", parseLng(-Infinity), null);
check("lat chaîne Infinity", parseLat("Infinity"), null);

// Hors bornes
check("lat > 90", parseLat(91), null);
check("lat < -90", parseLat(-91), null);
check("lng > 180", parseLng(181), null);
check("lng < -180", parseLng(-181), null);

if (failures > 0) {
  console.error(`\n${failures} échec(s).`);
  process.exit(1);
}
console.log("\nTous les tests géo passent.");
