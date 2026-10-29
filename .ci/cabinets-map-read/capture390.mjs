import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
const dist=resolve('.ci/cabinets-map-read/proof/browser-dist');
const out=resolve('.ci/cabinets-map-read/proof/captures390');
const server=createServer(async(req,res)=>{try{const path=new URL(req.url,'http://fixture.invalid').pathname;const file=path==='/'?'index.html':path.slice(1);if(!['index.html','app.js','app.css','styles.css'].includes(file)){res.writeHead(404);res.end();return;}const content=await readFile(resolve(dist,file));res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'application/javascript'})[extname(file)]);res.end(content);}catch{res.writeHead(500);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
const blocked=[],errors=[],results=[];
await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.origin===base)return route.continue();blocked.push(url.origin+url.pathname);return route.abort();});
const page=await context.newPage();page.setDefaultTimeout(5000);page.on('pageerror',error=>errors.push(error.message));
await mkdir(out,{recursive:true});
try{
 for(const scene of ['nominal','refused','null','empty','loading','excluded','tiles','english']){
  const query=scene==='english'?'scene=nominal&lang=en&cabinet=beta':'scene='+scene;
  await page.goto(base+'/?'+query);
  if(['nominal','tiles','english'].includes(scene))await page.locator('li button[aria-pressed]').first().waitFor();
  else if(scene==='refused'||scene==='null')await page.getByRole('alert').waitFor();
  else if(scene==='empty')await page.getByText('Aucun cabinet géolocalisé.',{exact:true}).waitFor();
  else if(scene==='excluded')await page.getByText('La carte ne peut pas afficher nos cabinets pour le moment.',{exact:true}).waitFor();
  else await page.getByRole('status').waitFor();
  if(scene==='english')await page.getByRole('link',{name:'View office',exact:true}).waitFor();
  await page.screenshot({path:resolve(out,scene+'.png'),fullPage:true});
  results.push({scene,width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),cards:await page.locator('li button[aria-pressed]').count(),alerts:await page.getByRole('alert').allTextContents(),statuses:await page.getByRole('status').allTextContents(),links:await page.locator('a').evaluateAll(links=>links.map(a=>({text:a.textContent,href:a.getAttribute('href')})))});
 }
 await page.goto(base+'/?scene=nominal&keep=fixture');
 await page.locator('li button[aria-pressed]').first().waitFor();
 await page.locator('li button[aria-pressed]').first().click();
 await page.getByRole('link',{name:'Voir le cabinet',exact:true}).waitFor();
 if(await page.locator('li button[aria-pressed]').count()!==4)throw Error('Liste Toutes réduite par une sélection');
 await page.screenshot({path:resolve(out,'selection-list-popup.png'),fullPage:true});
 await page.getByRole('radio',{name:'Toulouse Métropole (1)',exact:true}).click();
 if(await page.locator('li button[aria-pressed]').count()!==1)throw Error('Filtre Toulouse absent');
 await page.screenshot({path:resolve(out,'filter-toulouse.png'),fullPage:true});
 results.push({scene:'selection-filter',cards:1,url:new URL(page.url()).search,width:await page.evaluate(()=>innerWidth),scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth)});
}finally{
 await writeFile(resolve(out,'results.json'),JSON.stringify({base,blocked,errors,results,limits:'Leaflet, SDK et tuiles doublés ; polices externes omises dans CSS de fixture seulement.'},null,2));
 await context.close();await browser.close();await new Promise(r=>server.close(r));
}
if(blocked.length||errors.length||results.some(r=>r.scrollWidth>r.width))throw Error('Capture en échec : erreurs, réseau externe ou débordement');
console.log(JSON.stringify({scenes:results.length,blocked,errors,maxScrollWidth:Math.max(...results.map(r=>r.scrollWidth))}));
