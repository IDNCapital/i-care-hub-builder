#!/usr/bin/env node
/**
 * Sonde du rendu a 390 px.
 *
 * Pourquoi elle existe. La derniere condition non prouvee du palier 2 est le
 * mobile a 390 px. Deux tentatives depuis Cowork ont echoue de la meme facon :
 * la fenetre se declarait redimensionnee, le viewport restait a 1710 px, et la
 * mesure annoncee etait donc fausse. C'est pourquoi cette sonde CONSTATE la
 * largeur rendue par le moteur avant de conclure quoi que ce soit, et refuse de
 * mesurer une page dont la largeur rendue n'est pas celle demandee. Une largeur
 * ne se declare pas, elle se rend, et le rapport porte la largeur constatee.
 *
 * Ce qu'elle mesure, sur le contenu SERVI, dans un navigateur reel :
 *   1. la largeur effectivement rendue, par page ;
 *   2. le debordement horizontal, scrollWidth contre la largeur rendue ;
 *   3. les elements en cause, dedupliques par ascendance ;
 *   4. les elements fixes ou collants ROGNES par le viewport, qui n'etendent
 *      jamais scrollWidth et qu'une mesure naive ne voit donc jamais ;
 *   5. l'ecretage par overflow-x hidden, qui peut masquer un vrai debordement ;
 *   6. le meta viewport, dernier du document, celui que le moteur applique.
 *
 * Elle CONSTATE. Elle ne corrige rien, ne republie rien, ne relance aucun build.
 * Un rapport rouge est un resultat, pas une panne.
 *
 * Elle sort en 0 hors du mode strict, pour qu'un constat defavorable soit ecrit
 * et conserve plutot que d'interrompre le tour qui l'a produit. Elle ecrit son
 * rapport par tranches et a l'expiration de son budget : un passage interrompu
 * laisse une mesure partielle qui se declare partielle, jamais rien.
 *
 * Trois verdicts separes, et c'est voulu : un alea reseau sur une URL ne doit
 * pas faire dire NON CONFORME a un site qui ne deborde nulle part.
 *
 * Dette assumee et nommee : findChromium est recopiee de scripts/prerender.mjs,
 * qui ne l'exporte pas. Extraire la fonction obligerait a toucher la chaine de
 * prerendu, donc a la reprouver par un build complet, que ce lot n'a pas les
 * moyens de jouer. Duplication declaree, jamais silencieuse : WEB-NAVIGATEUR-DUPLIQUE.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const BASE = (process.env.SONDE390_BASE_URL || "https://i-ca.re").replace(/\/$/, "");
const LARGEUR = Number(process.env.SONDE390_LARGEUR || 390);
const HAUTEUR = Number(process.env.SONDE390_HAUTEUR || 844);
const CONCURRENCE = Number(process.env.SONDE390_CONCURRENCE || 6);
// Tolerance d'un pixel : les navigateurs rendent des largeurs sous-pixel et un
// scrollWidth de 390,4 arrondi a 391 n'est pas un debordement visible.
const TOLERANCE = Number(process.env.SONDE390_TOLERANCE || 1);
const DELAI_PAGE = Number(process.env.SONDE390_DELAI_PAGE || 9000);
const DELAI_MESURE = Number(process.env.SONDE390_DELAI_MESURE || 20000);
// Budget mural. L'appel qui lance cette sonde meurt a dix minutes ; a sept
// minutes on cesse d'enfiler de nouvelles URLs et on ecrit ce qu'on a.
const BUDGET_MS = Number(process.env.SONDE390_BUDGET_MS || 420000);
const LIMITE = Number(process.env.SONDE390_LIMITE || 0);
const STRICT = process.env.SONDE390_STRICT === "1";
const SITEMAP = `${BASE}/sitemap.xml`;
const DEBUT = Date.now();

const p2 = (n) => String(n).padStart(2, "0");
function horodateJour(d = new Date()) {
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}
function horodateSeconde(d = new Date()) {
  return `${horodateJour(d)} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
}

const RAPPORT = resolve(process.env.SONDE390_RAPPORT || `docs/RECETTE_390PX_${horodateJour()}.md`);

// Etat de portee module : le rapport doit pouvoir s'ecrire depuis n'importe ou,
// y compris depuis un gestionnaire de signal ou un catch de dernier recours.
const resultats = [];
let totalSitemap = 0;
let urlsDemandees = [];
let brancheNavigateur = "aucune";
let versionNavigateur = "inconnue";
let motifInterruption = null;

// Recopiee de scripts/prerender.mjs, voir la dette nommee en tete de fichier.
function findChromium() {
  const impose = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (impose) {
    if (existsSync(impose)) {
      brancheNavigateur = `1, PUPPETEER_EXECUTABLE_PATH, ${impose}`;
      console.log(`[sonde390] Navigateur, branche 1 : PUPPETEER_EXECUTABLE_PATH -> ${impose}`);
      return impose;
    }
    console.warn(`[sonde390] Navigateur, branche 1 ecartee : ${impose} est absent du disque.`);
  }
  return null;
}

function findChromiumSysteme() {
  const candidats = [
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  for (const candidat of candidats) {
    if (existsSync(candidat)) {
      brancheNavigateur = `3, chemin systeme, ${candidat}`;
      console.warn(`[sonde390] Navigateur, branche 3 : chemin systeme -> ${candidat}. Resolution non deterministe.`);
      return candidat;
    }
  }
  return null;
}

/**
 * Mesure une page. Rend des faits, jamais un verdict.
 * Tout est constate DANS la page : la largeur rendue comme le reste.
 */
function releve(largeurDemandee, tolerance) {
  const de = document.documentElement;
  const corps = document.body;
  const clientWidth = de.clientWidth;
  const scrollWidth = Math.max(de.scrollWidth, corps ? corps.scrollWidth : 0);
  const styleDe = getComputedStyle(de);
  const styleCorps = corps ? getComputedStyle(corps) : null;

  const metas = [...document.querySelectorAll('meta[name="viewport"]')];
  // Le moteur applique la DERNIERE balise viewport du document, pas la premiere :
  // une regression qui en injecte une seconde passerait inapercue autrement.
  const contenuMeta = metas.length ? metas[metas.length - 1].getAttribute("content") : null;

  const invisible = (el, st) => {
    if (st.visibility === "hidden" || st.visibility === "collapse") return true;
    if (Number(st.opacity) === 0) return true;
    if (el.closest('[aria-hidden="true"], [inert]')) return true;
    return false;
  };
  const chemin = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const brut = typeof el.className === "string" ? el.className.trim() : "";
    const cls = brut ? " ." + brut.split(/\s+/).slice(0, 3).join(" .") : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  };
  // Un enfant plus large que le viewport dans un conteneur qui defile
  // VRAIMENT ne pousse pas la page. On exige donc trois choses de l'ancetre :
  // un overflow-x auto ou scroll, une largeur qui tient dans le viewport, et un
  // defilement horizontal reel. `hidden` est exclu de l'exemption a dessein :
  // c'est un ecretage, pas un defilement, et l'exempter rendait la table des
  // coupables vide sur tout site qui pose overflow-x hidden sur son corps.
  const dansConteneurDefilant = (el) => {
    let p = el.parentElement;
    while (p && p !== corps && p !== de) {
      const st = getComputedStyle(p);
      if ((st.overflowX === "auto" || st.overflowX === "scroll") && p.scrollWidth > p.clientWidth + tolerance && p.getBoundingClientRect().right <= clientWidth + tolerance) {
        return true;
      }
      p = p.parentElement;
    }
    return false;
  };

  const bruts = [];
  const rognes = [];
  if (corps) {
    for (const el of corps.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      const st = getComputedStyle(el);
      if (invisible(el, st)) continue;
      // Un depassement a GAUCHE n'etend jamais la zone de defilement en sens de
      // lecture gauche-droite : le compter serait un faux positif, et les
      // decorations en -left-40 chasseraient la vraie cause de la table.
      const debord = Math.round(r.right - clientWidth);
      if (debord <= tolerance) continue;
      const fixe = st.position === "fixed" || st.position === "sticky";
      const entree = { selecteur: chemin(el), gauche: Math.round(r.left), droite: Math.round(r.right), largeur: Math.round(r.width), debord, position: st.position };
      // Un element fixe ou collant est ROGNE par le viewport : il n'apparait
      // dans aucun scrollWidth. C'est le mode de defaut qu'une mesure naive ne
      // voit jamais, et il rend un bouton inatteignable au doigt.
      if (fixe) rognes.push(entree);
      else if (!dansConteneurDefilant(el)) bruts.push({ el, entree });
    }
  }
  bruts.sort((a, b) => b.entree.debord - a.entree.debord);
  // Deduplication par ascendance : un conteneur trop large fait deborder tous
  // ses descendants. Annoncer « 43 elements en cause » pour une cause unique
  // rend le diagnostic inutilisable au lot de correction qui suivra.
  const causes = [];
  for (const c of bruts) {
    if (causes.some((garde) => garde.el.contains(c.el))) continue;
    causes.push(c);
  }
  rognes.sort((a, b) => b.debord - a.debord);

  return {
    clientWidth,
    innerWidth: window.innerWidth,
    visualWidth: window.visualViewport ? Math.round(window.visualViewport.width) : null,
    dpr: window.devicePixelRatio,
    scrollWidth: Math.round(scrollWidth),
    contenuMeta,
    nbMeta: metas.length,
    overflowXRacine: styleDe.overflowX,
    overflowXCorps: styleCorps ? styleCorps.overflowX : null,
    causes: causes.slice(0, 6).map((c) => c.entree),
    nbCauses: causes.length,
    rognes: rognes.slice(0, 6),
    nbRognes: rognes.length,
    hauteur: Math.round(de.scrollHeight),
    // Une racine applicative vide signifie que rien n'est monte : la page n'est
    // pas saine, elle n'est pas mesurable, et la confondre avec une page sans
    // debordement serait le mensonge le plus couteux de cette sonde.
    racineVide: !!document.querySelector("#root") && document.querySelector("#root").children.length === 0,
  };
}

// Le minuteur est annule des que la promesse retombe : sans cela, chaque appel
// laissait vivre la boucle d'evenements jusqu'a son echeance, et le processus
// restait en vie une vingtaine de secondes apres avoir tout dit.
const avecDelai = (promesse, ms, motif) => {
  let t;
  return Promise.race([
    promesse.finally(() => clearTimeout(t)),
    new Promise((_, rejeter) => {
      t = setTimeout(() => rejeter(new Error(motif)), ms);
    }),
  ]);
};

async function preparer(page) {
  // Animations et transitions neutralisees : une mesure prise en plein vol
  // n'est pas reproductible, et un rapport non reproductible ne prouve rien.
  // Defilement instantane : avec scroll-behavior smooth, un pas de defilement
  // n'aboutit jamais et le reveil du contenu paresseux ne se fait pas.
  await page.addStyleTag({
    content: "*,*::before,*::after{animation:none!important;transition:none!important}html{scroll-behavior:auto!important}",
  });
  try {
    await avecDelai(page.evaluate(() => document.fonts.ready.then(() => true)), 4000, "polices");
  } catch {
    /* police de repli : la mesure reste valable, elle est seulement moins fidele */
  }
}

async function parcourir(page) {
  return page.evaluate(async () => {
    const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
    // 25 pas de 800 px couvrent 20 000 px de haut, tres au-dela des pages du
    // site. Chaque pas coute 60 ms : la borne est ce qui tient le passage
    // entier sous son budget.
    const pas = 800;
    for (let n = 0; n < 25; n++) {
      const y = n * pas;
      if (y > document.documentElement.scrollHeight) break;
      window.scrollTo({ top: y, behavior: "instant" });
      await attendre(60);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await attendre(300);
    return true;
  });
}

async function sonder(page, url) {
  let statut = null;
  let urlFinale = null;
  try {
    // "load" et non "domcontentloaded" : les pages sont prerendues puis hydratees
    // par React, et ce sont les composants montes a l'hydratation, carrousels et
    // cartes, qui debordent le plus souvent. Mesurer le prerendu nu rendrait
    // conforme une page dont le vrai coupable n'existe pas encore.
    const reponse = await page.goto(url, { waitUntil: "load", timeout: DELAI_PAGE });
    statut = reponse ? reponse.status() : null;
  } catch (err) {
    return { url, acheminement: `chargement en echec : ${String(err && err.message).split("\n")[0]}`, griefs: [], ecretage: [] };
  }
  // 304 est une reponse valide servie depuis un cache intermediaire.
  if (statut !== 200 && statut !== 304) {
    return { url, statut, acheminement: `HTTP ${statut === null ? "inconnu" : statut}, URL declaree au sitemap et non servie`, griefs: [], ecretage: [] };
  }
  try {
    urlFinale = page.url();
    await preparer(page);
    // Mesure a mi-parcours PUIS au retour en haut, et on retient le pire des
    // deux : un composant monte au defilement, barre d'action collante ou
    // bouton de retour en haut, est demonte avant la mesure finale.
    await avecDelai(parcourir(page), DELAI_MESURE, "parcours trop long");
    try {
      await page.waitForNetworkIdle({ idleTime: 400, timeout: 1500 });
    } catch {
      /* trafic residuel, tuiles de carte ou mesure d'audience : sans effet sur la mise en page */
    }
    const m1 = await avecDelai(page.evaluate(releve, LARGEUR, TOLERANCE), DELAI_MESURE, "mesure trop longue");
    await page.evaluate(() => window.scrollTo({ top: Math.round(document.documentElement.scrollHeight / 2), behavior: "instant" }));
    await new Promise((r) => setTimeout(r, 400));
    const m2 = await avecDelai(page.evaluate(releve, LARGEUR, TOLERANCE), DELAI_MESURE, "mesure trop longue");

    const m = m2.scrollWidth > m1.scrollWidth ? { ...m2, causes: m2.causes, nbCauses: m2.nbCauses } : m1;
    m.rognes = m1.nbRognes >= m2.nbRognes ? m1.rognes : m2.rognes;
    m.nbRognes = Math.max(m1.nbRognes, m2.nbRognes);

    // Le meta viewport se releve AVANT tout ecart de largeur : son absence est
    // la cause la plus probable d'une page rendue a 980 px, et l'ecarter sans
    // dire pourquoi priverait le lot de correction du seul renseignement utile.
    const viewportFautif = [];
    if (!m.contenuMeta) viewportFautif.push("meta viewport absent");
    else {
      if (!/width\s*=\s*device-width/i.test(m.contenuMeta)) viewportFautif.push(`meta viewport sans width=device-width : "${m.contenuMeta}"`);
      if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\D|$)/i.test(m.contenuMeta)) viewportFautif.push(`meta viewport qui verrouille le zoom : "${m.contenuMeta}"`);
    }
    if (m.nbMeta > 1) viewportFautif.push(`${m.nbMeta} balises viewport dans le document, seule la derniere s'applique`);

    if (m.racineVide) {
      return { url, urlFinale, statut, ...m, nonMesuree: "racine applicative vide, page non montee au moment de la mesure, mesure ecartee", griefs: [], ecretage: [], viewportFautif };
    }
    // Le controle le plus important : la largeur rendue est-elle celle qu'on a
    // demandee. Les deux tentatives precedentes ont echoue ici sans le savoir.
    // Une page rendue a une autre largeur n'est pas fautive, elle est NON
    // MESUREE, et le dire est le seul comportement honnete.
    if (m.clientWidth !== LARGEUR) {
      return { url, urlFinale, statut, ...m, nonMesuree: `largeur rendue ${m.clientWidth} px au lieu de ${LARGEUR} px demandes, mesure ecartee`, griefs: [], ecretage: [], viewportFautif };
    }
    const griefs = [];
    const ecretage = [];
    if (m.scrollWidth > m.clientWidth + TOLERANCE) {
      griefs.push(`debordement horizontal : scrollWidth ${m.scrollWidth} px pour une largeur rendue de ${m.clientWidth} px, ${m.nbCauses} cause(s) racine(s)`);
    }
    // Honnetete du diagnostic : si la plus large cause nommee n'explique pas le
    // scrollWidth constate, le reste vient d'ailleurs, racine fantome, iframe,
    // ou element ecarte a dessein. Le dire vaut mieux qu'un tableau qui semble
    // complet et ne l'est pas.
    const plusLarge = m.causes && m.causes.length ? m.causes[0].droite : 0;
    if (m.scrollWidth > m.clientWidth + TOLERANCE && m.scrollWidth > plusLarge + TOLERANCE) {
      griefs.push(`debordement partiellement inexplique : scrollWidth ${m.scrollWidth} px, plus large cause nommee a ${plusLarge} px. Le reste vient d'un element ecarte de la table, d'une racine fantome ou d'une iframe`);
    }
    if (m.nbRognes > 0) {
      griefs.push(`${m.nbRognes} element(s) fixe(s) ou collant(s) rogne(s) par le viewport, invisibles a scrollWidth`);
    }
    // Un ecretage peut masquer un debordement reel. Il a son AXE A LUI et n'entre
    // pas dans le compte des pages qui debordent : overflow-x hidden pose
    // globalement est un reflexe de gabarit, et le compter comme un debordement
    // ferait sortir les 179 pages en NON CONFORME sur un grief non actionnable,
    // noyant les vraies coupables.
    if ((m.overflowXRacine === "hidden" || m.overflowXCorps === "hidden") && m.scrollWidth <= m.clientWidth + TOLERANCE) {
      ecretage.push(`overflow-x hidden sur ${m.overflowXRacine === "hidden" ? "html" : "body"}, un debordement eventuel serait masque a la mesure`);
    }
    return { url, urlFinale, statut, ...m, griefs, ecretage, viewportFautif };
  } catch (err) {
    return { url, urlFinale, statut, acheminement: `mesure interrompue : ${String(err && err.message).split("\n")[0]}`, griefs: [], ecretage: [] };
  }
}

const decoder = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

async function urlsDuSitemap() {
  const res = await fetch(SITEMAP, { headers: { "User-Agent": "i-ca.re-sonde-390px" }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`sitemap HTTP ${res.status}`);
  const xml = await res.text();
  // Un index de sitemaps porte les memes balises <loc> qu'un urlset : sans ce
  // controle, la sonde rendrait des fichiers XML dans Chrome, les trouverait
  // debordants, et n'aurait teste aucune vraie page.
  if (/<sitemapindex/i.test(xml)) throw new Error("sitemap d'index non gere par cette sonde");
  const urls = [...new Set([...xml.matchAll(/<(?:\w+:)?loc>([^<]+)<\/(?:\w+:)?loc>/g)].map((m) => decoder(m[1].trim())))];
  totalSitemap = urls.length;
  return LIMITE > 0 ? urls.slice(0, LIMITE) : urls;
}

function ecrireRapport({ injouable } = {}) {
  const lignes = [];
  const fin = horodateSeconde();
  lignes.push(`# Recette du rendu a ${LARGEUR} px`);
  lignes.push("");
  if (injouable) {
    lignes.push(`**PASSAGE INJOUABLE. Aucune page n'a ete mesuree, et rien de ce document ne dit quoi que ce soit de l'etat du site.**`);
    lignes.push("");
    lignes.push(`- Motif : ${injouable}`);
    lignes.push(`- Debut ${horodateSeconde(new Date(DEBUT))}, fin ${fin}`);
    lignes.push(`- Base visee : \`${BASE}\``);
    lignes.push(`- Navigateur : branche ${brancheNavigateur}, version ${versionNavigateur}`);
    lignes.push("");
    mkdirSync(dirname(RAPPORT), { recursive: true });
    writeFileSync(RAPPORT, lignes.join("\n"), "utf8");
    return;
  }

  const sondees = resultats.length;
  const nonMesurees = resultats.filter((r) => r.nonMesuree);
  const acheminement = resultats.filter((r) => r.acheminement);
  const debordantes = resultats.filter((r) => r.griefs && r.griefs.length);
  const viewportFautives = resultats.filter((r) => r.viewportFautif && r.viewportFautif.length);
  const ecretees = resultats.filter((r) => r.ecretage && r.ecretage.length);
  const vues = new Set(resultats.map((r) => r.url));
  const manquantes = urlsDemandees.filter((u) => !vues.has(u));
  // Le compte qui fait foi est celui des pages EFFECTIVEMENT mesurees, jamais
  // celui des URLs traversees. Une page ecartee pour largeur rendue et une URL
  // non atteinte ne portent aucun grief : les compter comme couvertes ferait
  // dire CONFORME a un passage qui n'a rien mesure du tout. C'est exactement le
  // mode d'echec des deux tentatives precedentes, retourne en verdict favorable.
  const mesurees = sondees - nonMesurees.length - acheminement.length;
  const complet = mesurees === totalSitemap && manquantes.length === 0 && !motifInterruption;
  const largeurs = [...new Set(resultats.filter((r) => r.clientWidth).map((r) => r.clientWidth))];

  lignes.push(`Produit par \`scripts/sonde390px.mjs\` dans un navigateur reel, sur le contenu SERVI par \`${BASE}\`. Debut ${horodateSeconde(new Date(DEBUT))}, fin ${fin}.`);
  lignes.push("");
  if (!complet) {
    lignes.push(`> **COUVERTURE PARTIELLE.** ${mesurees} page(s) effectivement mesuree(s) sur les ${totalSitemap} URLs du sitemap, ${sondees} URL(s) traversee(s). ${motifInterruption ? `Motif : ${motifInterruption}.` : ""} Aucun verdict de conformite n'est rendu sur une couverture partielle.`);
    lignes.push("");
  }
  lignes.push("## Verdicts");
  lignes.push("");
  lignes.push(`- **DEBORDEMENT** : ${complet ? (debordantes.length === 0 ? "CONFORME" : `NON CONFORME, ${debordantes.length} page(s)`) : `NON RENDU, ${mesurees} page(s) effectivement mesuree(s) sur ${totalSitemap}`}`);
  lignes.push(`- **ECRETAGE** : ${ecretees.length} page(s) ou un debordement serait masque par overflow-x hidden`);
  lignes.push(`- **VIEWPORT** : ${viewportFautives.length === 0 ? "conforme sur les pages relevees" : `${viewportFautives.length} page(s) fautive(s)`}`);
  lignes.push(`- **ACHEMINEMENT** : ${acheminement.length} URL(s) du sitemap non atteintes ou interrompues`);
  lignes.push("");
  lignes.push("## Ce qui a ete rendu, et a quelle largeur");
  lignes.push("");
  lignes.push(`- Largeur demandee : ${LARGEUR} px, hauteur ${HAUTEUR} px, isMobile, hasTouch, deviceScaleFactor 1`);
  lignes.push(`- **Largeur effectivement rendue, constatee dans la page** : ${largeurs.length ? largeurs.join(" px, ") + " px" : "aucune mesure"}`);
  lignes.push(`- Pages ecartees pour largeur rendue differente : **${nonMesurees.length}**`);
  lignes.push(`- Navigateur : branche ${brancheNavigateur}, version ${versionNavigateur}`);
  lignes.push(`- Tolerance ${TOLERANCE} px, concurrence ${CONCURRENCE}, delai de page ${DELAI_PAGE} ms, budget mural ${Math.round(BUDGET_MS / 1000)} s`);
  lignes.push("");
  lignes.push("## Compteurs");
  lignes.push("");
  lignes.push(`- URLs au sitemap : **${totalSitemap}**`);
  lignes.push(`- Pages effectivement mesurees : **${mesurees}**`);
  lignes.push(`- Pages qui debordent : **${debordantes.length}**`);
  lignes.push(`- URLs non atteintes ou interrompues : **${acheminement.length}**`);
  lignes.push(`- URLs jamais sondees : **${manquantes.length}**`);
  lignes.push(`- Pages a ecretage : **${ecretees.length}**`);
  lignes.push(`- Pages sauvees par la reprise en serie : **${resultats.filter((r) => r.repris).length}**`);
  lignes.push("");
  if (manquantes.length) {
    lignes.push("### URLs jamais sondees");
    lignes.push("");
    for (const u of manquantes.slice(0, 40)) lignes.push(`- \`${u}\``);
    if (manquantes.length > 40) lignes.push(`- et ${manquantes.length - 40} autre(s)`);
    lignes.push("");
  }
  if (nonMesurees.length) {
    lignes.push("### Pages ecartees, largeur rendue non conforme a la demande");
    lignes.push("");
    for (const r of nonMesurees) lignes.push(`- \`${r.url}\` : ${r.nonMesuree}`);
    lignes.push("");
  }
  if (acheminement.length) {
    lignes.push("### Non atteintes ou interrompues");
    lignes.push("");
    for (const r of acheminement) lignes.push(`- \`${r.url}\` : ${r.acheminement}`);
    lignes.push("");
  }
  lignes.push("## Pages qui debordent");
  lignes.push("");
  if (!debordantes.length) {
    lignes.push(complet ? "Aucune, sur la totalite du sitemap." : "Aucune sur les pages effectivement mesurees, couverture partielle.");
    lignes.push("");
  }
  for (const r of debordantes) {
    lignes.push(`### \`${r.url}\``);
    lignes.push("");
    lignes.push(`Largeur rendue ${r.clientWidth} px, scrollWidth ${r.scrollWidth} px, hauteur ${r.hauteur} px, statut HTTP ${r.statut}${r.urlFinale && r.urlFinale !== r.url ? `, servie depuis \`${r.urlFinale}\`` : ""}.`);
    lignes.push("");
    for (const g of r.griefs) lignes.push(`- ${g}`);
    if (r.causes && r.causes.length) {
      lignes.push("");
      lignes.push("| Cause racine | Gauche | Droite | Largeur | Debord | Position |");
      lignes.push("| --- | --- | --- | --- | --- | --- |");
      for (const c of r.causes) lignes.push(`| \`${c.selecteur}\` | ${c.gauche} | ${c.droite} | ${c.largeur} | ${c.debord} | ${c.position} |`);
    }
    if (r.rognes && r.rognes.length) {
      lignes.push("");
      lignes.push("Elements fixes ou collants rognes par le viewport :");
      lignes.push("");
      for (const c of r.rognes) lignes.push(`- \`${c.selecteur}\`, droite ${c.droite} px, debord ${c.debord} px, position ${c.position}`);
    }
    lignes.push("");
  }
  if (ecretees.length) {
    lignes.push("## Ecretage, debordement possiblement masque");
    lignes.push("");
    for (const r of ecretees) {
      lignes.push(`- \`${r.url}\``);
      for (const g of r.ecretage) lignes.push(`  - ${g}`);
    }
    lignes.push("");
  }
  if (viewportFautives.length) {
    lignes.push("## Meta viewport");
    lignes.push("");
    for (const r of viewportFautives) {
      lignes.push(`- \`${r.url}\``);
      for (const g of r.viewportFautif) lignes.push(`  - ${g}`);
    }
    lignes.push("");
  }
  lignes.push("## Ce que cette mesure ne prouve pas");
  lignes.push("");
  lignes.push("- La lisibilite, le contraste et la taille des cibles tactiles ne sont pas mesures ici.");
  lignes.push("- Un debordement contenu dans un conteneur qui defile vraiment n'est pas denonce, par construction.");
  lignes.push("- Une page d'erreur applicative servie en 200, la 404 douce, est mesuree comme une page normale.");
  lignes.push("- Le contenu place dans une racine fantome ou une iframe gonfle scrollWidth sans que sa cause soit nommee.");
  lignes.push("- La mesure porte sur le contenu servi au moment du passage, jamais sur le depot.");
  lignes.push("");
  mkdirSync(dirname(RAPPORT), { recursive: true });
  writeFileSync(RAPPORT, lignes.join("\n"), "utf8");
}

function verdictConsole() {
  const nonMesurees = resultats.filter((r) => r.nonMesuree).length;
  const acheminement = resultats.filter((r) => r.acheminement).length;
  const debordantes = resultats.filter((r) => r.griefs && r.griefs.length).length;
  const ecretees = resultats.filter((r) => r.ecretage && r.ecretage.length).length;
  const mesurees = resultats.length - nonMesurees - acheminement;
  const complet = mesurees === totalSitemap && !motifInterruption;
  console.log(`[sonde390] RAPPORT: ${RAPPORT}`);
  console.log(
    `[sonde390] COUVERTURE: ${mesurees}/${totalSitemap} page(s) effectivement mesuree(s)${complet ? ", complete" : ", PARTIELLE"}, ${nonMesurees} ecartee(s) pour largeur rendue, ${acheminement} non atteinte(s), ${ecretees} a ecretage`,
  );
  console.log(`[sonde390] VERDICT DEBORDEMENT: ${complet ? (debordantes === 0 ? "CONFORME" : `NON CONFORME, ${debordantes} page(s)`) : `NON RENDU, ${mesurees} sur ${totalSitemap}`}`);
  return { debordantes, acheminement, nonMesurees, complet };
}

// Trois lignes toujours, dans le meme ordre, y compris quand il n'y a rien a
// mesurer : le mandat demande a l'executant de les recopier, il doit toujours
// les trouver.
function verdictInjouable(motif) {
  console.log(`[sonde390] RAPPORT: ${RAPPORT}`);
  console.log(`[sonde390] COUVERTURE: 0/${totalSitemap} page(s) effectivement mesuree(s), PARTIELLE`);
  console.error(`[sonde390] VERDICT DEBORDEMENT: INJOUABLE, ${motif}`);
}

async function main() {
  let puppeteer;
  try {
    ({ default: puppeteer } = await import("puppeteer"));
  } catch (err) {
    ecrireRapport({ injouable: `module puppeteer non resolu, ${String(err && err.message).split("\n")[0]}` });
    verdictInjouable("module puppeteer non resolu");
    process.exitCode = STRICT ? 1 : 0;
    return;
  }

  let chromium = findChromium();
  if (!chromium) {
    try {
      const chemin = puppeteer.executablePath();
      if (existsSync(chemin)) {
        brancheNavigateur = `2, puppeteer.executablePath(), ${chemin}`;
        console.log(`[sonde390] Navigateur, branche 2 : puppeteer.executablePath() -> ${chemin}`);
        chromium = chemin;
      } else {
        console.warn(`[sonde390] Navigateur, branche 2 ecartee : ${chemin} est absent du disque.`);
      }
    } catch (err) {
      console.warn(`[sonde390] Navigateur, branche 2 ecartee : ${String(err && err.message).split("\n")[0]}`);
    }
  }
  if (!chromium) chromium = findChromiumSysteme();
  if (!chromium) {
    ecrireRapport({ injouable: "aucun navigateur resolu, les trois branches ont echoue" });
    verdictInjouable("aucun navigateur resolu");
    process.exitCode = STRICT ? 1 : 0;
    return;
  }

  try {
    urlsDemandees = await urlsDuSitemap();
  } catch (err) {
    ecrireRapport({ injouable: `sitemap illisible, ${err.message}` });
    verdictInjouable(`sitemap illisible, ${err.message}`);
    process.exitCode = STRICT ? 1 : 0;
    return;
  }
  if (urlsDemandees.length === 0) {
    ecrireRapport({ injouable: "sitemap sans aucune balise loc" });
    verdictInjouable("sitemap sans aucune balise loc");
    process.exitCode = STRICT ? 1 : 0;
    return;
  }
  console.log(`[sonde390] ${totalSitemap} URL(s) au sitemap de ${BASE}, ${urlsDemandees.length} a sonder, concurrence ${CONCURRENCE}.`);
  // Le chemin est annonce AVANT la mesure : si l'appel est tue en cours de
  // route, celui qui relit le journal a tout de meme de quoi retrouver le
  // rapport partiel deja ecrit sur le disque.
  console.log(`[sonde390] RAPPORT: ${RAPPORT}`);

  const navigateur = await puppeteer.launch({
    headless: true,
    executablePath: chromium,
    protocolTimeout: 30000,
    // --hide-scrollbars : une barre de defilement classique retirerait quinze
    // pixels a clientWidth et ferait ecarter toutes les pages pour largeur
    // rendue non conforme, sans que rien ne soit fautif.
    args: process.platform === "darwin" ? ["--hide-scrollbars"] : ["--hide-scrollbars", "--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    versionNavigateur = await navigateur.version();
  } catch {
    /* sans consequence sur la mesure */
  }

  const ecrireSansLever = () => {
    try {
      ecrireRapport();
    } catch (err) {
      console.error(`[sonde390] rapport non ecrit : ${String(err && err.message).split("\n")[0]}`);
    }
  };
  const surSignal = (sig) => {
    motifInterruption = `interruption ${sig}`;
    ecrireSansLever();
    try {
      verdictConsole();
    } catch {
      console.log(`[sonde390] RAPPORT: ${RAPPORT}`);
    }
    process.exit(STRICT ? 1 : 0);
  };
  process.on("SIGTERM", () => surSignal("SIGTERM"));
  process.on("SIGINT", () => surSignal("SIGINT"));

  let i = 0;
  let depuisEcriture = 0;
  await Promise.allSettled(
    Array.from({ length: Math.min(CONCURRENCE, urlsDemandees.length) }, async () => {
      let page = null;
      try {
        page = await navigateur.newPage();
        await page.setViewport({ width: LARGEUR, height: HAUTEUR, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
        await page.setUserAgent(
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 i-ca.re-sonde-390px",
        );
        while (i < urlsDemandees.length) {
          if (Date.now() - DEBUT > BUDGET_MS) {
            motifInterruption = motifInterruption || `budget mural de ${Math.round(BUDGET_MS / 1000)} s atteint`;
            break;
          }
          const url = urlsDemandees[i++];
          try {
            resultats.push(await sonder(page, url));
          } catch (err) {
            resultats.push({ url, acheminement: `erreur inattendue : ${String(err && err.message).split("\n")[0]}`, griefs: [], ecretage: [] });
          }
          // Ecriture par tranches : un passage tue laisse une mesure partielle
          // qui se declare partielle, jamais un fichier absent.
          if (++depuisEcriture >= 10) {
            depuisEcriture = 0;
            ecrireSansLever();
          }
        }
      } finally {
        if (page) {
          try {
            await page.close();
          } catch {
            /* onglet deja tombe */
          }
        }
      }
    }),
  );
  // Reprise en serie des non atteintes, une seule fois. Sur 179 chargements
  // contre la production, un alea transitoire est presque certain, et sans
  // cette reprise il suffirait d'un seul pour que le verdict de debordement
  // soit NON RENDU alors que rien ne deborde. Le tour n'etant pas rejouable,
  // c'est la reprise ou le verdict perdu.
  const aReprendre = resultats.filter((r) => r.acheminement);
  if (aReprendre.length && aReprendre.length <= 20 && Date.now() - DEBUT < BUDGET_MS) {
    console.log(`[sonde390] Reprise en serie de ${aReprendre.length} URL(s) non atteinte(s).`);
    let pageReprise = null;
    try {
      pageReprise = await navigateur.newPage();
      await pageReprise.setViewport({ width: LARGEUR, height: HAUTEUR, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      for (const ancien of aReprendre) {
        if (Date.now() - DEBUT > BUDGET_MS) break;
        let neuf;
        try {
          neuf = await sonder(pageReprise, ancien.url);
        } catch {
          continue;
        }
        if (neuf.acheminement) continue;
        const rang = resultats.indexOf(ancien);
        if (rang >= 0) resultats[rang] = { ...neuf, repris: true };
      }
    } catch {
      /* reprise impossible : les non atteintes restent non atteintes, et le rapport le dit */
    } finally {
      if (pageReprise) {
        try {
          await pageReprise.close();
        } catch {
          /* onglet deja tombe */
        }
      }
    }
  }

  try {
    await navigateur.close();
  } catch {
    /* deja ferme */
  }

  resultats.sort((a, b) => a.url.localeCompare(b.url));
  for (const r of resultats) {
    if (r.nonMesuree) console.error(`[sonde390] ! ${r.url} : ${r.nonMesuree}`);
    else if (r.acheminement) console.error(`[sonde390] ? ${r.url} : ${r.acheminement}`);
    else if (r.griefs && r.griefs.length) {
      console.error(`[sonde390] X ${r.url}`);
      for (const g of r.griefs) console.error(`[sonde390]     ${g}`);
      for (const c of r.causes || []) console.error(`[sonde390]     ${c.selecteur} droite ${c.droite} px, debord ${c.debord} px`);
    }
  }
  ecrireSansLever();
  const { debordantes, acheminement, complet } = verdictConsole();
  if (STRICT && (debordantes || acheminement || !complet)) process.exitCode = 1;
}

main().catch((err) => {
  motifInterruption = `erreur de dernier recours : ${String(err && err.message).split("\n")[0]}`;
  try {
    if (resultats.length) ecrireRapport();
    else ecrireRapport({ injouable: motifInterruption });
  } catch {
    /* rien de plus a tenter */
  }
  try {
    if (resultats.length) verdictConsole();
    else verdictInjouable(motifInterruption);
  } catch {
    console.log(`[sonde390] RAPPORT: ${RAPPORT}`);
  }
  process.exitCode = STRICT ? 1 : 0;
});
