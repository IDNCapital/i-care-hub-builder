import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, useNavigate, type NavigateFunction } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const h=vi.hoisted(()=>({invoke:vi.fn(),success:vi.fn(),error:vi.fn(),analytics:vi.fn(),lang:'fr'}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{functions:{invoke:h.invoke}}}));
vi.mock('@/lib/analytics',()=>({Analytics:{formSubmission:h.analytics}}));
vi.mock('sonner',()=>({toast:{success:h.success,error:h.error}}));
vi.mock('react-i18next',()=>({useTranslation:()=>({t:(k:string)=>k,i18n:{language:h.lang}})}));
vi.mock('@/components/Layout',()=>({Layout:({children}:{children:ReactNode})=><main>{children}</main>}));
vi.mock('@/components/BrandName',()=>({InlineBrand:({children}:{children:ReactNode})=><>{children}</>}));
vi.mock('@/components/LinkedInLink',()=>({LinkedInLink:()=>null}));
import Contact from '../../src/pages/Contact';
const ID='123e4567-e89b-42d3-a456-426614174000';
const recu=(...args:[data?:unknown,status?:number])=>{const data=args.length?args[0]:{status:'ok',lead_id:ID};const status=args[1]??200;return{data,error:null,response:new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}})};};
const refus=(code:string,status:number)=>{const response=new Response(JSON.stringify({error:code}),{status,headers:{'Content-Type':'application/json'}});return{data:null,error:{context:response},response};};
const differe=<T,>()=>{let resolve!:(v:T)=>void,reject!:(e:unknown)=>void;const promise=new Promise<T>((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};};
let root:Root|undefined,host:HTMLDivElement,navigate:NavigateFunction;
function Navigation(){navigate=useNavigate();return null;}
async function mount(path='/contact?utm_source=fixture'){window.history.replaceState({},'',path);host=document.createElement('div');document.body.append(host);root=createRoot(host);await act(async()=>root!.render(<MemoryRouter initialEntries={[path]}><Navigation/><Contact/></MemoryRouter>));}
async function fill(id:string,value:string){const el=host.querySelector('#'+id)as HTMLInputElement|HTMLTextAreaElement;await act(async()=>{Object.getOwnPropertyDescriptor(id==='message'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value')!.set!.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));});}
async function ready(nom='Nom fictif'){const type=[...host.querySelectorAll('button')].find(b=>b.textContent?.includes('contact.types.professionnel'))!;await act(async()=>type.click());await fill('nom',nom);await fill('email','contact@example.test');await fill('message','Message de démonstration');await act(async()=>(host.querySelector('#rgpd-contact')as HTMLElement).click());}
async function submit(){await act(async()=>host.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));}
async function go(path:string){await act(async()=>{window.history.replaceState({},'',path);navigate(path);});}
const text=()=>host.textContent??'';
const envoyer=()=>host.querySelector('button[type="submit"]')as HTMLButtonElement;
beforeEach(()=>{Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});h.lang='fr';vi.stubGlobal('ResizeObserver',class{observe(){}unobserve(){}disconnect(){}});vi.clearAllMocks();h.invoke.mockReset().mockResolvedValue(recu());vi.stubGlobal('fetch',vi.fn(()=>{throw Error('Réseau réel interdit');}));});
afterEach(async()=>{if(root)await act(async()=>root!.unmount());root=undefined;expect(fetch).not.toHaveBeenCalled();expect(h.invoke.mock.calls.every(([name])=>name==='send-contact-lead')).toBe(true);document.body.innerHTML='';document.head.innerHTML='';vi.unstubAllGlobals();Reflect.deleteProperty(globalThis,'IS_REACT_ACT_ENVIRONMENT');});
describe('CAUSES de réception',()=>{
 it('CAUSE un corps null ne confirme ni efface la demande',async()=>{h.invoke.mockResolvedValue(recu(null));await mount();await ready();await submit();expect(h.success).not.toHaveBeenCalled();expect((host.querySelector('#nom')as HTMLInputElement).value).toBe('Nom fictif');expect(text()).toContain('Résultat non confirmé');expect(envoyer().disabled).toBe(true);});
 it('CAUSE deux gestes synchrones n’envoient qu’une tentative',async()=>{const d=differe<unknown>();h.invoke.mockReturnValue(d.promise);await mount();await ready();const form=host.querySelector('form')!;await act(async()=>{form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});expect(h.invoke).toHaveBeenCalledTimes(1);});
 it('CAUSE un rejet réseau interdit le rejeu aveugle et garde la saisie',async()=>{h.invoke.mockRejectedValue(Error('Réseau fictif perdu'));await mount();await ready();await submit();expect(envoyer().disabled).toBe(true);await submit();expect(h.invoke).toHaveBeenCalledTimes(1);expect((host.querySelector('#nom')as HTMLInputElement).value).toBe('Nom fictif');});
 it('CAUSE un ancien reçu après navigation ne confirme pas ou efface la nouvelle saisie',async()=>{const d=differe<unknown>();h.invoke.mockReturnValue(d.promise);await mount();await ready('Ancien nom');await submit();await go('/contact?centre=Cabinet-B');await fill('nom','Nouveau nom');await act(async()=>d.resolve(recu()));expect((host.querySelector('#nom')as HTMLInputElement).value).toBe('Nouveau nom');expect(h.success).not.toHaveBeenCalled();expect(h.analytics).not.toHaveBeenCalled();});
 it('CAUSE ok sans identifiant n’est pas un reçu de demande',async()=>{h.invoke.mockResolvedValue(recu({status:'ok'}));await mount();await ready();await submit();expect(h.success).not.toHaveBeenCalled();expect(text()).toContain('Résultat non confirmé');expect(envoyer().disabled).toBe(true);});
});

describe('Contrats de reçus',()=>{
 it('confirme seulement le reçu courant sans effacer la saisie et sans promettre un email',async()=>{await mount();await ready();await submit();expect(text()).toContain('Votre demande a été enregistrée. Référence');expect(text()).toContain(ID);expect(h.success).toHaveBeenCalledTimes(1);expect(h.analytics).toHaveBeenCalledTimes(1);expect((host.querySelector('#nom')as HTMLInputElement).value).toBe('Nom fictif');expect(envoyer().disabled).toBe(true);await submit();expect(h.invoke).toHaveBeenCalledTimes(1);});
 it.each([{nom:'absent',data:undefined},{nom:'tableau',data:[]},{nom:'sentinelle',data:{status:'ok',lead_id:'unknown'}},{nom:'uuid incomplet',data:{status:'ok',lead_id:'123'}},{nom:'autre statut',data:{status:'sent',lead_id:ID}},{nom:'erreur résiduelle',data:{status:'ok',lead_id:ID,error:null}},{nom:'rate200',data:{error:'rate_limited'}}])('un reçu $nom reste ambigu',async({data})=>{h.invoke.mockResolvedValue(recu(data));await mount();await ready();await submit();expect(text()).toContain('Résultat non confirmé');expect(envoyer().disabled).toBe(true);expect(h.success).not.toHaveBeenCalled();expect(h.analytics).not.toHaveBeenCalled();});
 it.each([{code:'invalid_type',status:400},{code:'missing_fields',status:400},{code:'invalid_email',status:400},{code:'invalid_phone',status:400},{code:'invalid_profession',status:400},{code:'rate_limited',status:429}])('le refus $code HTTP$status est certain avant insertion',async({code,status})=>{h.invoke.mockResolvedValue(refus(code,status));await mount();await ready();await submit();expect(text()).toContain('Cette tentative a été refusée avant enregistrement');expect(envoyer().disabled).toBe(false);expect((host.querySelector('#nom')as HTMLInputElement).value).toBe('Nom fictif');expect(h.success).not.toHaveBeenCalled();expect(h.analytics).not.toHaveBeenCalled();expect(h.invoke).toHaveBeenCalledTimes(1);});
 it('internal_error500 reste ambigu car l’insertion peut déjà avoir eu lieu',async()=>{h.invoke.mockResolvedValue(refus('internal_error',500));await mount();await ready();await submit();expect(text()).toContain('Résultat non confirmé');expect(envoyer().disabled).toBe(true);});
 it('une erreur HTTP non documentée ne prouve pas un refus avant écriture',async()=>{h.invoke.mockResolvedValue(refus('internal_error',400));await mount();await ready();await submit();expect(text()).toContain('Résultat non confirmé');expect(envoyer().disabled).toBe(true);});
 it('un reçu sans Response HTTP confirmé reste inconnu',async()=>{h.invoke.mockResolvedValue({data:{status:'ok',lead_id:ID},error:null});await mount();await ready();await submit();expect(text()).toContain('Résultat non confirmé');expect(h.analytics).not.toHaveBeenCalled();});
 it('une erreur résiduelle avec données ne confirme jamais le succès',async()=>{const r=recu();h.invoke.mockResolvedValue({...r,error:Error('Erreur résiduelle')});await mount();await ready();await submit();expect(text()).toContain('Résultat non confirmé');expect(h.success).not.toHaveBeenCalled();});
 it('le refus certain permet une nouvelle soumission seulement au geste suivant',async()=>{h.invoke.mockResolvedValueOnce(refus('invalid_phone',400));await mount();await ready();await submit();expect(h.invoke).toHaveBeenCalledTimes(1);h.invoke.mockResolvedValue(recu());await submit();expect(h.invoke).toHaveBeenCalledTimes(2);expect(text()).toContain('Votre demande a été enregistrée');});
});
describe('Saisie, contexte et nouvelle tentative',()=>{
 it('conserve à l’octet le payload et sa provenance source/UTM',async()=>{await mount('/contact?centre=Cabinet-A&utm_source=fixture&utm_medium=medium&utm_campaign=campagne');await ready();await fill('nom',' Nom brut ');await fill('email',' contact@example.test ');await fill('telephone','01 02 03 04 05');await fill('organisation',' Organisation brute ');await submit();expect(h.invoke.mock.calls[0]).toEqual(['send-contact-lead',{body:{type:'praticien',full_name:' Nom brut ',email:'contact@example.test',phone:'01 02 03 04 05',organization:' Organisation brute ',message:'Message de démonstration',language:'fr',source_url:window.location.href,honeypot:'',utm_source:'fixture',utm_medium:'medium',utm_campaign:'campagne'}}]);expect([...host.querySelectorAll('input[maxlength],textarea[maxlength]')].map(e=>e.getAttribute('maxlength'))).toEqual(['200','255','30','200','5000']);});
 it('le verrou garde les champs et le type durant l’attente',async()=>{const d=differe<unknown>();h.invoke.mockReturnValue(d.promise);await mount();await ready();await submit();expect(host.querySelector('fieldset')?.disabled).toBe(true);expect([...host.querySelectorAll('button')].filter(b=>b.textContent?.includes('contact.types.')).every(b=>b.disabled)).toBe(true);expect(envoyer().disabled).toBe(true);});
 it('les deux gestes de sortie de l’inconnu n’envoient rien et ne vident rien',async()=>{h.invoke.mockRejectedValueOnce(Error('Transport'));await mount();await ready();await submit();const first=[...host.querySelectorAll('button')].find(b=>b.textContent==='Préparer une autre tentative')!;await act(async()=>first.click());expect(envoyer().disabled).toBe(true);expect(h.invoke).toHaveBeenCalledTimes(1);const second=[...host.querySelectorAll('button')].find(b=>b.textContent?.includes('Je comprends le risque de doublon'))!;await act(async()=>second.click());expect(h.invoke).toHaveBeenCalledTimes(1);expect(envoyer().disabled).toBe(false);expect((host.querySelector('#nom')as HTMLInputElement).value).toBe('Nom fictif');h.invoke.mockResolvedValue(recu());await submit();expect(h.invoke).toHaveBeenCalledTimes(2);});
 it('préparer une autre demande après confirmation ne soumet pas automatiquement',async()=>{await mount();await ready();await submit();const button=[...host.querySelectorAll('button')].find(b=>b.textContent==='Préparer une autre demande')!;await act(async()=>button.click());expect(h.invoke).toHaveBeenCalledTimes(1);expect(envoyer().disabled).toBe(false);expect((host.querySelector('#nom')as HTMLInputElement).value).toBe('Nom fictif');});
 it('un changement de centre initialise le bon brouillon et sa langue',async()=>{await mount('/contact?centre=Cabinet-A');expect((host.querySelector('#message')as HTMLTextAreaElement).value).toContain('Cabinet-A');await fill('nom','Ancien');await go('/contact?centre=Cabinet-B');expect((host.querySelector('#message')as HTMLTextAreaElement).value).toContain('Cabinet-B');expect((host.querySelector('#nom')as HTMLInputElement).value).toBe('');});
 it('un retour après démontage ne publie ni confirmation ni Analytics',async()=>{const d=differe<unknown>();h.invoke.mockReturnValue(d.promise);await mount();await ready();await submit();await act(async()=>root!.unmount());root=undefined;await act(async()=>d.resolve(recu()));expect(h.success).not.toHaveBeenCalled();expect(h.analytics).not.toHaveBeenCalled();});
 it('un échec de mesure ne modifie pas un reçu déjà confirmé',async()=>{h.analytics.mockImplementationOnce(()=>{throw Error('Mesure fictive');});await mount();await ready();await submit();expect(text()).toContain('Votre demande a été enregistrée');expect(text()).not.toContain('Résultat non confirmé');expect(envoyer().disabled).toBe(true);});
 it('le reçu et la sortie inconnue sont localisés en anglais',async()=>{h.lang='en';h.invoke.mockRejectedValueOnce(Error('Transport'));await mount('/en/contact');await ready();await submit();expect(text()).toContain('Result unconfirmed');expect([...host.querySelectorAll('button')].some(b=>b.textContent==='Prepare another attempt')).toBe(true);});
 it('la validation et le honeypot bloquent avant tout appel',async()=>{await mount();await submit();expect(h.invoke).not.toHaveBeenCalled();await ready();const honey=host.querySelector('input[name="company_url"]')as HTMLInputElement;await act(async()=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(honey,'robot');honey.dispatchEvent(new Event('input',{bubbles:true}));});await submit();expect(h.invoke).not.toHaveBeenCalled();});
});

describe('Reçu du relais',()=>{
 it('une réponse marquée comme erreur de relais ne prouve pas un refus avant insertion',async()=>{const r=refus('invalid_phone',400);r.response.headers.set('x-relay-error','true');h.invoke.mockResolvedValue(r);await mount();await ready();await submit();expect(text()).toContain('Résultat non confirmé');expect(envoyer().disabled).toBe(true);expect(h.success).not.toHaveBeenCalled();expect(h.analytics).not.toHaveBeenCalled();});
});


// La classification réelle doit refuser la coercition d'un JSON mal formé.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import * as ts from 'typescript';
describe('CONTRAT_CODE_STRING',()=>{it('un tableau JSON ne prouve pas un refus avant insertion',async()=>{
 const source=readFileSync('src/pages/Contact.tsx','utf8');
 const ast=ts.createSourceFile('Contact.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const fn=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='qualifierRecu');
 if(!fn)throw Error('Classificateur réel absent');
 const code=ts.transpileModule(fn.getText(ast)+'\nexports.qualifierRecu=qualifierRecu;', {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const context:{exports:{qualifierRecu?:(v:unknown)=>Promise<{etat:string}>};Response:typeof Response}={exports:{},Response};
 runInNewContext(code,context);
 const qualifier=context.exports.qualifierRecu;if(!qualifier)throw Error('Classificateur non chargé');
 const response=new Response(JSON.stringify({error:['invalid_email']}),{status:400});
 expect((await qualifier({data:null,error:{context:response},response})).etat).toBe('inconnu');
});});
