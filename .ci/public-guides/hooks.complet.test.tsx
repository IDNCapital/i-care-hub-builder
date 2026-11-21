import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const h=vi.hoisted(()=>({read:vi.fn(),write:vi.fn(),calls:[] as Array<{table:string;columns:string;count?:string;head:boolean;range:number[]|null;orders:unknown[];filters:unknown[]}>}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{from:(table:string)=>{const q={table,columns:'',count:undefined as string|undefined,head:false,range:null as number[]|null,orders:[] as unknown[],filters:[] as unknown[]};const b={select:(columns:string,options?:{head?:boolean;count?:string})=>{q.columns=columns;q.count=options?.count;q.head=!!options?.head;return b;},contains:(key:string,value:unknown)=>{q.filters.push([key,value]);return b;},order:(key:string,value:unknown)=>{q.orders.push([key,value]);return b;},range:(start:number,end:number)=>{q.range=[start,end];return b;},then:(ok:(v:unknown)=>unknown,no:(e:unknown)=>unknown)=>{h.calls.push(q);return Promise.resolve().then(()=>h.read(q)).then(ok,no);},insert:h.write,update:h.write,delete:h.write};return b;}}}));
import { useArticlesProblematiques, useProblematiques } from '@/hooks/useProblematiques';
const problem=(slug='stress')=>({slug,nom:'Nom '+slug,description_courte:'Description',description_longue:null,synonymes:['Synonyme']});
const recu=(data:unknown,count=Array.isArray(data)?data.length:0)=>({data,error:null,status:200,count});
let result:ReturnType<typeof useProblematiques>|ReturnType<typeof useArticlesProblematiques>,root:Root,container:HTMLDivElement;
function Harness(){result=useProblematiques();return <div>{result.loading?'pendant':result.error?'erreur':result.data.map(p=>p.slug).join(',')}</div>;}
const render=async()=>{await act(async()=>root.render(<Harness/>));};
beforeEach(()=>{vi.clearAllMocks();h.calls=[];h.read.mockReset().mockImplementation(async q=>recu(q.head?null:[problem()],1));(globalThis as {IS_REACT_ACT_ENVIRONMENT?:boolean}).IS_REACT_ACT_ENVIRONMENT=true;container=document.createElement('div');document.body.append(container);root=createRoot(container);vi.stubGlobal('fetch',vi.fn(()=>{throw Error('Réseau interdit');}));});
afterEach(async()=>{await act(async()=>root.unmount());expect(h.write).not.toHaveBeenCalled();expect(fetch).not.toHaveBeenCalled();container.remove();vi.unstubAllGlobals();});
describe('Causalités taxonomie',()=>{
 it('CAUSAL une première page ne prétend pas couvrir toute la taxonomie',async()=>{h.read.mockImplementation(async q=>q.head?recu(null,3):recu(q.range?.[0]===2?[problem('trois')]:[problem('un'),problem('deux')],3));await render();expect(result.data.map(p=>p.slug)).toEqual(['un','deux','trois']);expect(result.error).toBe(false);expect(h.calls[h.calls.length-1]?.head).toBe(true);});
 it('CAUSAL un reçu incomplet ne confirme pas une taxonomie vide',async()=>{h.read.mockResolvedValue({data:null,error:null,status:0,count:null});await render();expect(result.error).toBe(true);expect(result.data).toEqual([]);expect(result.loading).toBe(false);});
});

const differe=()=>{let resolve!:(v:unknown)=>void,reject!:(v:unknown)=>void;const promise=new Promise((ok,no)=>{resolve=ok;reject=no;});return{promise,resolve,reject};};
const article=(slug='article')=>({slug,titre:'Titre '+slug,chapo:'Résumé',published_at:null});
let slug:string|undefined='stress';
function Articles(){result=useArticlesProblematiques(slug);return <div>{result.loading?'pendant':result.error?'erreur':result.data.map(p=>p.slug).join(',')}</div>;}
const renderArticles=async()=>{await act(async()=>root.render(<Articles/>));};

describe('Famille du reçu complet',()=>{
 it('ne publie aucune page avant le compte final reçu',async()=>{const second=differe(),head=differe();h.read.mockImplementation(q=>q.head?head.promise:q.range?.[0]===2?second.promise:recu([problem('un'),problem('deux')],3));await render();expect(result.loading).toBe(true);expect(result.data).toEqual([]);await act(async()=>second.resolve(recu([problem('trois')],3)));expect(result.loading).toBe(true);expect(result.data).toEqual([]);await act(async()=>head.resolve(recu(null,3)));expect(result.data).toHaveLength(3);expect(h.calls.map(q=>q.range)).toEqual([[0,199],[2,201],null]);});
 it('confirme un vrai zéro avec deux reçus complets, sans refus silencieux',async()=>{h.read.mockImplementation(q=>recu(q.head?null:[],0));await render();expect(result).toMatchObject({data:[],loading:false,error:false});expect(h.calls).toHaveLength(2);});
 it('accepte un statut 206 avec un compte et des pages cohérents',async()=>{h.read.mockImplementation(q=>({...recu(q.head?null:[problem()],1),status:206}));await render();expect(result.data).toHaveLength(1);expect(result.error).toBe(false);});
 it.each([
  {data:[problem()],error:null,status:403,count:1},
  {data:[problem()],error:{message:'refus'},status:200,count:1},
  {data:[problem()],error:null,status:200,count:null},
  {data:[problem()],error:null,status:200,count:-1},
  {data:{slug:'objet'},error:null,status:200,count:1},
  {data:[],error:null,status:206,count:0},
  {data:[problem()],status:200,count:1},
 ])('un reçu incomplet ou refusé %j reste inconnu',async response=>{h.read.mockResolvedValue(response);await render();expect(result).toMatchObject({data:[],loading:false,error:true});});
 it('un compte qui change pendant les pages ne publie pas la première page',async()=>{h.read.mockImplementation(q=>recu([problem(String(q.range?.[0]))],q.range?.[0]===0?2:3));await render();expect(result.error).toBe(true);expect(result.data).toEqual([]);expect(h.calls).toHaveLength(2);});
 it('une page vide avant le compte final reste inconnue',async()=>{h.read.mockImplementation(q=>recu(q.range?.[0]===0?[problem()]:[],2));await render();expect(result.error).toBe(true);expect(result.data).toEqual([]);});
 it.each([
  {data:null,error:null,status:200,count:2},
  {data:null,error:{message:'refus final'},status:403,count:1},
  {data:[],error:null,status:200,count:1},
 ])('un compte final non confirmé %j retire toute la liste',async response=>{h.read.mockImplementation(q=>q.head?response:recu([problem()],1));await render();expect(result.error).toBe(true);expect(result.data).toEqual([]);});
 it('refuse deux slugs identiques même sur des pages distinctes',async()=>{h.read.mockResolvedValue(recu([problem('doublon')],2));await render();expect(result.error).toBe(true);expect(result.data).toEqual([]);});
 it.each([{synonymes:null},{description_longue:12},{slug:' '},{nom:null}])('une ligne taxonomie mal formée %j ne confirme aucune liste',async patch=>{h.read.mockResolvedValue(recu([{...problem(),...patch}],1));await render();expect(result.error).toBe(true);expect(result.data).toEqual([]);});
 it('une promesse rejetée est traitée comme inconnue',async()=>{h.read.mockRejectedValue(new Error('Rejet fictif'));await render();expect(result.error).toBe(true);expect(result.loading).toBe(false);});
 it('nomme et borne les volumes supérieurs à 20000 sans poursuivre',async()=>{h.read.mockResolvedValue(recu([problem()],20001));await render();expect(result.error).toBe(true);expect(h.calls).toHaveLength(1);});
 it('borne à cent pages même si le serveur ne livre qu’une ligne à la fois',async()=>{h.read.mockImplementation(q=>recu([problem('page-'+q.range?.[0])],101));await render();expect(result.error).toBe(true);expect(result.data).toEqual([]);expect(h.calls).toHaveLength(100);});
 it('un retour après démontage ne lit pas la page suivante',async()=>{const d=differe();h.read.mockReturnValue(d.promise);await render();await act(async()=>root.unmount());await act(async()=>d.resolve(recu([problem()],2)));expect(h.calls).toHaveLength(1);});
 it('un retry invalide l’ancienne lecture avant son cleanup et avant la page suivante',async()=>{const d=differe();let body=0;h.read.mockImplementation(q=>q.head?recu(null,1):++body===1?d.promise:recu([problem('nouveau')],1));await render();await act(async()=>{result.retry();d.resolve(recu([problem('ancien')],2));for(let n=0;n<8;n++)await Promise.resolve();expect(h.calls.every(q=>q.range===null||q.range[0]===0)).toBe(true);});expect(result.data.map(p=>p.slug)).toEqual(['nouveau']);expect(h.calls.filter(q=>!q.head)).toHaveLength(2);expect(h.calls.every(q=>q.range===null||q.range[0]===0)).toBe(true);});
 it('conserve colonnes et ordre métier, puis départage par slug',async()=>{await render();expect(h.calls[0]).toMatchObject({table:'problematiques',columns:'slug, nom, description_courte, description_longue, synonymes',orders:[['nom',{ascending:true}],['slug',{ascending:true}]],filters:[]});expect(h.calls.every(q=>q.count==='exact')).toBe(true);expect(h.calls[h.calls.length-1].head).toBe(true);});
});

describe('Famille des articles du slug courant',()=>{
 it('ne lit rien sans slug',async()=>{slug=undefined;await renderArticles();expect(h.calls).toHaveLength(0);expect(result).toMatchObject({data:[],loading:false,error:false});});
 it('conserve le filtre exact et le tri articles, sans toucher les droits',async()=>{slug='stress';h.read.mockImplementation(q=>recu(q.head?null:[article()],1));await renderArticles();expect(h.calls[0]).toMatchObject({table:'articles',columns:'slug, titre, chapo, published_at',filters:[['problematiques_associees',['stress']]],orders:[['published_at',{ascending:false}],['slug',{ascending:true}]]});expect(h.calls.every(q=>q.count==='exact')).toBe(true);expect(h.calls[h.calls.length-1].head).toBe(true);});
 it('un retour A après B ne publie ni ne poursuit les articles A',async()=>{slug='stress';const a=differe(),b=differe();h.read.mockImplementation(q=>q.head?recu(null,1):(q.filters[0] as [string,string[]])[1][0]==='stress'?a.promise:b.promise);await renderArticles();slug='sommeil';await renderArticles();await act(async()=>b.resolve(recu([article('article-B')],1)));await act(async()=>a.resolve(recu([article('article-A')],2)));expect(result.data.map(p=>p.slug)).toEqual(['article-B']);expect(h.calls).toHaveLength(3);expect(h.calls.filter(q=>q.head).map(q=>q.filters)).toEqual([[['problematiques_associees',['sommeil']]]]);});
 it('A puis B puis A attend un nouveau reçu sans reprendre le premier A',async()=>{slug='stress';h.read.mockImplementation(q=>recu(q.head?null:[article('ancien-A')],1));await renderArticles();const a=differe(),b=differe();h.read.mockImplementation(q=>q.head?recu(null,1):(q.filters[0] as [string,string[]])[1][0]==='stress'?a.promise:b.promise);slug='sommeil';await renderArticles();slug='stress';await renderArticles();expect(result.loading).toBe(true);expect(result.data).toEqual([]);await act(async()=>a.resolve(recu([article('nouveau-A')],1)));await act(async()=>b.resolve(recu([article('ancien-B')],1)));expect(result.data.map(p=>p.slug)).toEqual(['nouveau-A']);});
 it('un article mal formé ne devient pas une carte plausible',async()=>{slug='stress';h.read.mockResolvedValue(recu([{...article(),titre:null}],1));await renderArticles();expect(result.error).toBe(true);expect(result.data).toEqual([]);});
});
