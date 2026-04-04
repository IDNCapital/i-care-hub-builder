#!/usr/bin/env node
/**
 * Post-build prerender script.
 * Launches a local server on the dist/ folder, then uses Puppeteer to
 * crawl target routes and save the fully-rendered HTML (with meta tags,
 * JSON-LD, H1, content) as static index.html files.
 *
 * Usage: node scripts/prerender.mjs
 * Requires: PUPPETEER_EXECUTABLE_PATH or chromium in PATH
 */

import { launch } from "puppeteer";
import { createServer } from "http";
import handler from "serve-handler";
import { writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const PORT = 45678;

const ROUTES = [
  "/",
  "/en/",
  "/insights",
  "/en/insights",
  "/insights/cabinet-medical-bordeaux",
  "/insights/budget-cabinet-bordeaux",
  "/insights/surface-cabinet-medical",
  "/insights/transformer-local-en-cabinet",
  "/insights/professions-partage-cabinet",
  "/insights/louer-ou-acheter-cabinet",
  "/en/insights/medical-office-bordeaux",
  "/en/insights/office-budget-bordeaux",
  "/en/insights/medical-office-size",
  "/en/insights/converting-commercial-space",
  "/en/insights/professions-sharing-office",
  "/en/insights/rent-or-buy-office",
  "/trouver-cabinet-medical-bordeaux",
  "/en/finding-medical-office-bordeaux",
];

async function main() {
  // 1. Serve dist/ locally
  const server = createServer((req, res) =>
    handler(req, res, {
      public: DIST,
      rewrites: [{ source: "**", destination: "/index.html" }],
    })
  );
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[prerender] Serving dist/ on http://localhost:${PORT}`);

  // 2. Launch browser
  const browser = await launch({
    headless: true,
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || "/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  let ok = 0;
  let fail = 0;

  for (const route of ROUTES) {
    try {
      const page = await browser.newPage();
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle0",
        timeout: 15000,
      });

      // Wait for react-helmet to inject meta tags
      await page.waitForSelector("title", { timeout: 5000 });

      const html = await page.content();
      await page.close();

      // Determine output path
      const clean = route.replace(/\/$/, "") || "/index";
      const outPath =
        clean === "/index"
          ? join(DIST, "index.html")
          : join(DIST, clean, "index.html");

      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, "utf-8");
      console.log(`[prerender] ✓ ${route} → ${outPath.replace(DIST, "dist")}`);
      ok++;
    } catch (err) {
      console.error(`[prerender] ✗ ${route}: ${err.message}`);
      fail++;
    }
  }

  await browser.close();
  server.close();
  console.log(
    `\n[prerender] Done: ${ok} succeeded, ${fail} failed out of ${ROUTES.length} routes.`
  );
  process.exit(fail > 0 ? 1 : 0);
}

main();
