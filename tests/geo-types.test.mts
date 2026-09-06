import assert from "node:assert/strict";
import { parseLat, parseLng } from "../src/lib/geo.ts";

// Valeurs numériques/string valides
assert.equal(parseLat(44.84), 44.84);
assert.equal(parseLat("44.84"), 44.84);
assert.equal(parseLat("  44.84  "), 44.84);
assert.equal(parseLng(-0.58), -0.58);
assert.equal(parseLng("-0.58"), -0.58);

// Hors bornes
assert.equal(parseLat(91), null);
assert.equal(parseLat(-91), null);
assert.equal(parseLng(181), null);
assert.equal(parseLng(-181), null);

// Vide / non numérique
assert.equal(parseLat(""), null);
assert.equal(parseLat("   "), null);
assert.equal(parseLat("invalide"), null);
assert.equal(parseLat(null), null);
assert.equal(parseLat(undefined), null);
assert.equal(parseLat(NaN), null);
assert.equal(parseLat(Infinity), null);
assert.equal(parseLat(-Infinity), null);

// Types rejetés SANS conversion (cas défensifs vérifiés le 6 septembre)
assert.equal(parseLat(true), null);
assert.equal(parseLat(false), null);
assert.equal(parseLat([]), null);
assert.equal(parseLat([1]), null);
assert.equal(parseLat([44.84]), null);
assert.equal(parseLat({}), null);
assert.equal(parseLat({ valueOf: () => 44.84 }), null);
assert.equal(parseLat(10n), null);
assert.doesNotThrow(() => parseLat(Symbol("x")));
assert.equal(parseLat(Symbol("x")), null);
assert.equal(parseLat(() => 44.84), null);

console.log("geo.ts: tous les tests de types passent.");
