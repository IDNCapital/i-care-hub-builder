// DOUBLE DE FRONTIERE RESEAU, explicitement qualifie comme tel.
//
// Charge via `node --import` AVANT le point d'entree teste, il remplace le
// fetch global pour que les vrais scripts de build tournent hors reseau. Il ne
// reimplemente aucune regle de production : il sert telles quelles les lignes
// des tables declarees par la fixture JSON de GARDE_TEST_FIXTURE, ou simule
// une panne reseau locale quand GARDE_TEST_MODE=panne, du meme type que celle
// qu'undici leve quand l'hote est injoignable.
//
// Mode "mixte" : sert la fixture normalement jusqu'a la table nommee par
// GARDE_TEST_PANNE_TABLE (incluse), sur laquelle il simule la meme panne. Sert
// le cas d'une garde de donnees deja declenchee par un matcher, suivie d'une
// panne reseau locale sur le fetch suivant.
import { readFileSync } from "node:fs";

const mode = process.env.GARDE_TEST_MODE || "fixture";
const cheminFixture = process.env.GARDE_TEST_FIXTURE;
const panneTable = process.env.GARDE_TEST_PANNE_TABLE || null;
const tables =
  (mode === "fixture" || mode === "mixte") && cheminFixture
    ? JSON.parse(readFileSync(cheminFixture, "utf8"))
    : {};

globalThis.fetch = async (url) => {
  if (mode === "panne") {
    throw new TypeError("fetch failed (double de frontiere : panne reseau locale simulee)");
  }
  const pathname = new URL(url).pathname;
  const m = pathname.match(/\/rest\/v1\/([^/?]+)/);
  const table = m ? m[1] : null;
  if (mode === "mixte" && table === panneTable) {
    throw new TypeError(
      `fetch failed (double de frontiere : panne reseau locale simulee, tardive sur ${table})`,
    );
  }
  if (!table || !(table in tables)) {
    return new Response(JSON.stringify({ message: `table absente de la fixture : ${table}` }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(tables[table]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
