import assert from 'node:assert/strict';
import { createServer } from 'vite';
import puppeteer from 'puppeteer';

// Vrais composants/Leaflet dans Chrome ; API publique remplacée par deux fixtures.
const server = await createServer({mode:'test',server:{host:'127.0.0.1',port:0,hmr:false}});
await server.listen();
const base = `http://127.0.0.1:${server.httpServer.address().port}`;
let browser;
let passed = 0;
const valid = {slug:'cabinet-fictif',name:'Cabinet fictif',address:'Adresse de test',city:'Bordeaux',status:'en_exploitation',lat:44.84,lng:-0.58,google_place_id:null,date_ouverture_cible:null};
async function fixturePage({lang='fr',failure='',invalid=false,allInvalid=false}={}) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({width:390,height:900});
  let blockModule = failure === 'chunk';
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = new URL(request.url());
    if (blockModule && url.pathname === '/src/components/CarteCabinets.tsx') return request.abort();
    if (url.origin === base || ['data:', 'blob:'].includes(url.protocol)) return request.continue();
    if (url.pathname.endsWith('/rest/v1/projets')) {
      const headers = {'access-control-allow-origin':'*','access-control-allow-methods':'GET, OPTIONS','access-control-allow-headers':request.headers()['access-control-request-headers'] || 'apikey, authorization, x-client-info, content-type'};
      if (request.method() === 'OPTIONS') return request.respond({status:204,headers});
      const bad = {...valid,slug:'cabinet-invalide',name:'Autre cabinet fictif',lat:'invalide'};
      const rows = allInvalid ? [bad] : invalid ? [valid,bad] : [valid];
      return request.respond({status:200,headers,contentType:'application/json',body:JSON.stringify(rows)});
    }
    // Aucune requête vers des données ou services externes, y compris les tuiles.
    return request.abort();
  });
  await page.goto(`${base}/tests/map-browser.html?lang=${lang}&failure=${failure}`,{waitUntil:'networkidle2'});
  return {context,page,recoverModule:()=>{blockModule=false;}};
}
async function retained(page) {
  assert.equal(await page.$eval('h1', el=>el.textContent),'Page conservée');
  assert.equal(await page.$$eval('[data-testid^="outside-"]', nodes=>nodes.length),2);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth));
}
try {
  browser = await puppeteer.launch({headless:true});
  for (const lang of ['fr','en']) {
    const {page,context} = await fixturePage({lang,failure:'bounds'});
    await page.waitForSelector('[role="alert"]');
    await retained(page);
    if (process.env.MAP_TEST_ARTIFACT_DIR) await page.screenshot({path:`${process.env.MAP_TEST_ARTIFACT_DIR}/carte-repli-${lang}.png`});
    assert.equal(await page.$eval('[role="alert"] a',el=>el.getAttribute('href')),lang==='fr'?'/projets':'/en/projects');
    assert.ok(await page.$$eval('a[href="/projets/cabinet-fictif"]',els=>els.length) > 0,'La liste des cabinets reste accessible');
    await page.evaluate(()=>sessionStorage.setItem('mapRecovered','true'));
    await page.$eval('[role="alert"] button',button=>button.click());
    await page.waitForSelector('.leaflet-marker-icon');
    assert.equal(await page.$('[role="alert"]'),null);
    await retained(page);
    console.log(`PASS erreur Leaflet et reprise locale ${lang}`);passed++;
    await context.close();
    const chunk = await fixturePage({lang,failure:'chunk'});
    await chunk.page.waitForSelector('[role="alert"]');
    await retained(chunk.page);
    chunk.recoverModule();
    await Promise.all([
      chunk.page.waitForNavigation({waitUntil:'networkidle2',timeout:20000}),
      chunk.page.$eval('[role="alert"] button',button=>button.click()),
    ]);
    await chunk.page.waitForSelector('.leaflet-marker-icon');
    assert.equal(await chunk.page.$('[role="alert"]'),null);
    await retained(chunk.page);
    console.log(`PASS module indisponible et rechargement ${lang}`);passed++;
    await chunk.context.close();
  }
  for (const allInvalid of [false,true]) {
    const {page,context} = await fixturePage({invalid:true,allInvalid});
    await retained(page);
    if (!allInvalid) await page.waitForSelector('.leaflet-marker-icon');
    assert.equal(await page.$$eval('.leaflet-marker-icon',nodes=>nodes.length),allInvalid?0:1);
    const text = await page.$eval('main',node=>node.textContent);
    assert.ok(/carte/i.test(text));
    assert.ok(await page.$$eval('a[href="/projets"]',nodes=>nodes.length)>0,'Accès à la liste complète requis');
    assert.equal(await page.$('[role="alert"]'),null);
    console.log(`PASS coordonnées ${allInvalid?'toutes':'partiellement'} invalides, page conservée`);passed++;
    await context.close();
  }
  assert.equal(passed,6);
  console.log('6/6 scénarios navigateur isolés réussis.');
} finally {
  await browser?.close();
  await server.close();
}
