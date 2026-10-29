import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const base = ".ci/cookie-choice-storage/";
const receipts = [];
function assert(value, message) { if (!value) throw Error(message); }
try {
  // Les polices distantes de la charte sont exclues de cette fixture hors ligne.
  const css = (await readFile(base + "mobile.css", "utf8")).replace(/@import\s+url\([^)]*\)\s*;/g, "");
  const js = await readFile(base + "mobile.js", "utf8");
  for (const lang of ["fr", "en"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    page.setDefaultTimeout(5000);
    const errors = [], requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/*", (route) => { requests.push(route.request().url()); return route.abort(); });
    await page.setContent(`<html lang="${lang}"><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body><div id="root"></div><script type="module">${js}</script></body></html>`);
    const region = page.getByRole("region", { name: lang === "fr" ? "Choix des cookies" : "Cookie choice" });
    try { await region.waitFor(); } catch (error) {
      await writeFile(base + "mobile-attempt.json", JSON.stringify({ lang, errors, requests, html: await page.content() }, null, 2) + "\n");
      throw error;
    }
    const initial = await page.evaluate(() => structuredClone(window.__cookieProof));
    assert(initial.loads === 0 && initial.pages.length === 0, "Activation par defaut");
    await page.evaluate(() => { window.__cookieProof.readRefused = false; });
    if (lang === "fr") await page.getByTestId("navigation").evaluate((e) => e.click());
    const before = await page.evaluate(() => window.__cookieProof.pages.length);
    const reject = region.getByRole("button", { name: lang === "fr" ? "Refuser" : "Reject", exact: true });
    const accept = region.getByRole("button", { name: lang === "fr" ? "Accepter" : "Accept", exact: true });
    await reject.focus();
    await page.keyboard.press("Tab");
    assert(await accept.evaluate((e) => e === document.activeElement), "Clavier");
    await (lang === "fr" ? reject : accept).click();
    await page.getByRole("status").waitFor();
    const status = await page.getByRole("status").textContent();
    assert(status.includes(lang === "fr" ? "après actualisation" : "after a refresh"), "Limite actualisation");
    const href = await region.getByRole("link").getAttribute("href");
    assert(href === (lang === "fr" ? "/cookies" : "/en/cookies"), "Lien contractuel");
    const measures = await page.evaluate(() => ({
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      buttons: [...document.querySelectorAll('[role="region"] button')].map((e) => e.getBoundingClientRect().height),
      contentsInViewport: [...document.querySelectorAll('[role="region"] p, [role="region"] button, [role="region"] a')]
        .every((e) => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }),
      bounds: [...document.querySelectorAll('[role="region"], [role="region"] div, [role="region"] p, [role="region"] button, [role="region"] a')]
        .map((e) => { const r = e.getBoundingClientRect(); return { tag: e.tagName, className: e.className, left: r.left, right: r.right }; }),
    }));
    await writeFile(base + "mobile-measures-" + lang + ".json", JSON.stringify(measures, null, 2) + "\n");
    await page.screenshot({ path: base + "mobile-attempt-" + lang + ".png", fullPage: true });
    assert(measures.width === measures.scrollWidth && measures.contentsInViewport && measures.buttons.every((h) => h >= 44), "Mobile390");
    await page.screenshot({ path: base + "mobile-" + lang + "-390.png", fullPage: true });
    await page.getByTestId("navigation").evaluate((e) => e.click());
    const after = await page.evaluate(() => structuredClone(window.__cookieProof));
    if (lang === "fr") assert(after.loads === 0 && after.pages.length === before && after.value === "accepted", "Refus visite prioritaire");
    else assert(after.loads === 1 && after.pages.length === before + 1 && after.value === "refused", "Acceptation explicite");
    assert(errors.length === 0 && requests.length === 0, "Erreur ou reseau");
    receipts.push({ lang, initial, after, measures, href, status, errors, externalRequests: requests });
    await page.close();
  }
  await writeFile(base + "mobile.json", JSON.stringify(receipts, null, 2) + "\n");
} finally { await browser.close(); }
