import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const h=vi.hoisted(()=>({read:vi.fn(),write:vi.fn(),calls:[] as Array<{table:string;columns:string;placeId:unknown}>}));
vi.mock('@/integrations/supabase/client',()=>({supabase:{from:(table:string)=>{const q={table,columns:'',placeId:null as unknown};const b={select:(columns:string)=>{q.columns=columns;return b;},eq:(field:string,value:unknown)=>{if(field!=='place_id')throw Error('Filtre inattendu');q.placeId=value;return b;},maybeSingle:()=>{h.calls.push(q);return h.read(q);},insert:h.write,update:h.write,delete:h.write};return b;},functions:{invoke:h.write},storage:{from:()=>({upload:h.write,remove:h.write})}}}));
import { SectionAvisGoogle } from '@/components/avis/SectionAvisGoogle';
const row=(id='place-A',extra:Record<string,unknown>={})=>({place_id:id,rating:4.7,user_ratings_total:12,google_display_name:`Profil ${id}`,last_updated_at:'2026-10-27T10:00:00Z',google_url:'https://maps.google.com/?cid=123456789',reviews:[{author:`Auteur ${id}`,rating:5,text:`Avis ${id}`,published_at:'2026-10-26T10:00:00Z',profile_photo_url:null}],...extra});
const recu=(data:unknown)=>({data,error:null,status:200});
const differe=<T,>()=>{let resolve!:(v:T)=>void,reject!:(v:unknown)=>void;const promise=new Promise<T>((ok,no)=>{resolve=ok;reject=no;});return{promise,resolve,reject};};
let racine:Root,conteneur:HTMLDivElement;
const monter=async(...args:[id?:string|null,extra?:Record<string,unknown>])=>{const id=args.length?args[0]:'place-A';const extra=args[1]??{};await act(async()=>racine.render(<SectionAvisGoogle placeId={id} nomPourLien="Nom de la fixture" {...extra}/>));};
const texte=()=>conteneur.textContent??'';
beforeEach(()=>{vi.clearAllMocks();h.calls=[];h.read.mockReset().mockImplementation(async q=>recu(row(String(q.placeId))));(globalThis as {IS_REACT_ACT_ENVIRONMENT?:boolean}).IS_REACT_ACT_ENVIRONMENT=true;conteneur=document.createElement('div');document.body.append(conteneur);racine=createRoot(conteneur);vi.stubGlobal('fetch',vi.fn(()=>{throw Error('Réseau interdit');}));});
afterEach(async()=>{await act(async()=>racine.unmount());conteneur.remove();vi.unstubAllGlobals();});

describe('Avis du lieu courant',()=>{
 it('CAUSAL retire immédiatement avis et lien A pendant la lecture de B',async()=>{await monter();expect(texte()).toContain('Avis place-A');const b=differe<unknown>();h.read.mockReturnValue(b.promise);await monter('place-B');expect(texte()).not.toContain('Avis place-A');expect(conteneur.querySelector('a')).toBeNull();expect(conteneur.querySelector('[role="status"]')).not.toBeNull();await act(async()=>b.resolve(recu(row('place-B'))));expect(texte()).toContain('Avis place-B');});
 it('CAUSAL une ligne d’un autre place_id ne confirme aucun avis',async()=>{h.read.mockResolvedValue(recu(row('autre-lieu')));await monter();expect(conteneur.querySelector('section')).toBeNull();expect(texte()).toContain('indisponibles');expect(conteneur.querySelector('a')).toBeNull();});
 it('CAUSAL utilise l’URL Google reçue sans reconstruire un identifiant',async()=>{await monter();expect(conteneur.querySelector('a')?.getAttribute('href')).toBe('https://maps.google.com/?cid=123456789');expect(h.calls).toEqual([{table:'avis_google_cache',columns:'place_id,rating,user_ratings_total,google_display_name,last_updated_at,google_url,reviews',placeId:'place-A'}]);expect(h.write).not.toHaveBeenCalled();expect(fetch).not.toHaveBeenCalled();});
 it('CAUSAL un refus portant encore des données ne publie pas ces avis',async()=>{h.read.mockResolvedValue({data:row(),error:{message:'lecture refusée fictive'},status:403});await monter();expect(conteneur.querySelector('section')).toBeNull();expect(texte()).toContain('indisponibles');expect(conteneur.querySelector('a')).toBeNull();});
});

describe('Comptage reçu ou inconnu',()=>{
 it('ne transforme pas un total inconnu en zéro avis',async()=>{h.read.mockResolvedValue(recu(row('place-A',{user_ratings_total:null})));await monter();expect(texte()).not.toContain('0 avis Google');expect(texte()).toContain("Nombre d'avis Google non disponible");});
});

describe('Visites, retours inverses et refus',()=>{
 it.each([null,undefined,'','   '])('sans identifiant exploitable %j ne lit et n’affiche rien',async id=>{await monter(id);expect(h.calls).toHaveLength(0);expect(texte()).toBe('');});
 it('ignore le retour A après le reçu B sans mélanger avis et URL',async()=>{const a=differe<unknown>(),b=differe<unknown>();h.read.mockImplementation(q=>q.placeId==='place-A'?a.promise:b.promise);await monter();await monter('place-B');await act(async()=>b.resolve(recu(row('place-B',{google_url:'https://www.google.com/maps/search/?api=1&query=B&query_place_id=place-B'}))));expect(texte()).toContain('Avis place-B');await act(async()=>a.resolve(recu(row())));expect(texte()).not.toContain('Avis place-A');expect(conteneur.querySelector('a')?.getAttribute('href')).toContain('query_place_id=place-B');});
 it('A puis B puis A ouvre une nouvelle lecture A sans réafficher son ancien cache',async()=>{await monter();const b=differe<unknown>(),a=differe<unknown>();h.read.mockImplementation(q=>q.placeId==='place-B'?b.promise:a.promise);await monter('place-B');await monter();expect(texte()).not.toContain('Avis place-A');await act(async()=>a.resolve(recu(row('place-A',{reviews:[{text:'Nouvel avis A',rating:4}]}))));expect(texte()).toContain('Nouvel avis A');await act(async()=>b.resolve(recu(row('place-B'))));expect(texte()).not.toContain('Avis place-B');expect(h.calls.map(c=>c.placeId)).toEqual(['place-A','place-B','place-A']);});
 it('un refus B après A reste indisponible sans retour des avis ou du lien A',async()=>{await monter();h.read.mockResolvedValue({data:null,error:{message:'refus fictif'},status:403});await monter('place-B');expect(texte()).toContain('indisponibles');expect(texte()).not.toContain('Avis place-A');expect(conteneur.querySelector('a')).toBeNull();});
 it('un rejet asynchrone devient indisponible sans promesse non traitée',async()=>{h.read.mockRejectedValue(new Error('réseau fictif perdu'));await monter();expect(texte()).toContain('indisponibles');expect(conteneur.querySelector('section')).toBeNull();});
 it('un retour après démontage ne publie rien et ne déclenche aucun autre appel',async()=>{const r=differe<unknown>();h.read.mockReturnValue(r.promise);await monter();await act(async()=>racine.unmount());await act(async()=>r.reject(new Error('retour ancien fictif')));expect(texte()).toBe('');expect(h.calls).toHaveLength(1);expect(h.write).not.toHaveBeenCalled();});
});

describe('Contrat du cache reçu',()=>{
 it.each([{rating:'4.7'},{reviews:{}},{reviews:[null]},{user_ratings_total:-1},{google_display_name:3},{reviews:[{text:17}]},{reviews:[{rating:9,text:'avis incohérent'}]}])('une ligne mal formée %j reste inconnue',async patch=>{h.read.mockResolvedValue(recu(row('place-A',patch)));await monter();expect(texte()).toContain('indisponibles');expect(conteneur.querySelector('section')).toBeNull();expect(conteneur.querySelector('a')).toBeNull();});
 it.each([{data:undefined,error:null,status:200},{data:null,error:null,status:0},{data:[row()],error:null,status:200},{data:row(),status:200}])('un reçu incomplet %j ne donne pas un cache connu',async response=>{h.read.mockResolvedValue(response);await monter();expect(texte()).toContain('indisponibles');expect(conteneur.querySelector('a')).toBeNull();});
 it('une lecture complète sans ligne conserve la couverture absente, pas une note zéro',async()=>{h.read.mockResolvedValue(recu(null));await monter();expect(texte()).toBe('');expect(conteneur.querySelector('a')).toBeNull();});
 it('une note nulle ou une couverture stricte sans avis ne produit pas de section',async()=>{h.read.mockResolvedValue(recu(row('place-A',{rating:null})));await monter();expect(texte()).toBe('');h.read.mockResolvedValue(recu(row('place-B',{reviews:[]})));await monter('place-B',{exigerAuMoinsUnAvis:true});expect(texte()).toBe('');});
 it('les champs d’avis nulls du véritable service sont acceptés sans inventer d’auteur',async()=>{h.read.mockResolvedValue(recu(row('place-A',{reviews:[{author:null,rating:null,text:'Avis sans attribution',published_at:null,profile_photo_url:null}]})));await monter();expect(texte()).toContain('Anonyme');expect(texte()).toContain('Avis sans attribution');expect(conteneur.querySelector('section')).not.toBeNull();});
});

describe('Lien reçu ou inconnu, sans conversion d’identifiant',()=>{
 it.each([null,'javascript:alert(1)','http://maps.google.com/?cid=1','https://www.google.com.evil.test/maps/place/A','https://user:mot@maps.google.com/?cid=1','https://www.google.com/accounts/test','https://www.google.com/maps/search/?query_place_id=autre-lieu','https://www.google.com/maps/search/?query_place_id=place-A&query_place_id=place-B'])('ne publie pas le lien absent ou contradictoire %j',async google_url=>{h.read.mockResolvedValue(recu(row('place-A',{google_url})));await monter();expect(texte()).toContain('Avis place-A');expect(conteneur.querySelector('a')).toBeNull();expect(texte()).toContain('Lien Google indisponible');expect(h.calls).toHaveLength(1);expect(fetch).not.toHaveBeenCalled();});
 it.each(['https://www.google.com/maps/place/?q=place_id%3Aplace-A','https://maps.app.goo.gl/fiche-recue-A'])('conserve à l’octet le lien reçu %s',async google_url=>{h.read.mockResolvedValue(recu(row('place-A',{google_url})));await monter();expect(conteneur.querySelector('a')?.getAttribute('href')).toBe(google_url);expect(conteneur.querySelector('a')?.getAttribute('rel')).toBe('noopener noreferrer');expect(fetch).not.toHaveBeenCalled();});
});

describe('Présentation et langue conservées',()=>{
 it('garde le tri par date décroissante, le filtre des textes et la limite de trois',async()=>{h.read.mockResolvedValue(recu(row('place-A',{reviews:[{text:'Ancien',published_at:'2026-01-01T10:00:00Z'},{text:'Milieu',published_at:'2026-10-10T10:00:00Z'},{text:'',published_at:'2026-10-28T11:00:00Z'},{text:'Récent',published_at:'2026-10-20T10:00:00Z'},{text:'Dernier',published_at:'2026-10-27T10:00:00Z'}]})));await monter();expect([...conteneur.querySelectorAll('section p')].map(p=>p.textContent)).toEqual(['Dernier','Récent','Milieu']);expect(texte()).not.toContain('Ancien');});
 it('un changement de langue ou de nom ne mélange pas une autre clé ou une autre URL',async()=>{await monter();await monter('place-A',{lang:'en',nomPourLien:'Another supplied name'});expect(h.calls).toHaveLength(1);expect(texte()).toContain('Google reviews');expect(texte()).toContain('4.7');expect(texte()).toContain('See all reviews on Google');expect(conteneur.querySelector('a')?.getAttribute('href')).toBe('https://maps.google.com/?cid=123456789');});
 it('localise aussi le chargement et le refus en anglais',async()=>{const d=differe<unknown>();h.read.mockReturnValue(d.promise);await monter('place-A',{lang:'en'});expect(texte()).toContain('Loading Google reviews');await act(async()=>d.reject(new Error('refus fictif')));expect(texte()).toContain('Google reviews are unavailable');});
 it('une nouvelle identité retire aussi l’expansion d’un avis précédent',async()=>{const long='Texte long de la fixture. '.repeat(20);h.read.mockImplementation(async q=>recu(row(String(q.placeId),{reviews:[{author:'Auteur',text:long}]})));await monter();const button=conteneur.querySelector('button')!;await act(async()=>button.dispatchEvent(new MouseEvent('click',{bubbles:true})));expect(texte()).toContain('Voir moins');await monter('place-B');expect(texte()).toContain('Voir plus');expect(texte()).not.toContain('Voir moins');});
});

describe('REVUE_REPRISE_LOCALE',()=>{
 it('propose une reprise explicite de la lecture refusée sans changer de place_id',async()=>{
  h.read.mockRejectedValue(new Error('Transport fictif interrompu'));
  await monter();expect(texte()).toContain('indisponibles');
  h.read.mockResolvedValue(recu(row()));
  await monter('place-A',{nomPourLien:'Même lieu, propriétés réactualisées'});
  expect(h.calls).toHaveLength(1);expect(texte()).toContain('indisponibles');
  expect(h.write).not.toHaveBeenCalled();expect(fetch).not.toHaveBeenCalled();
  const bouton=[...conteneur.querySelectorAll('button')].find(b=>/réessayer|recharger|actualiser/i.test(b.textContent??''));
  expect(bouton,'Aucun geste local de reprise de la lecture du même lieu').toBeTruthy();
  await act(async()=>bouton!.click());
  expect(texte()).toContain('Avis place-A');expect(h.calls).toHaveLength(2);
 });
});

 describe('REPRISE_CONCURRENCE',()=>{
 it('regroupe deux gestes en une lecture et retire le bouton pendant attente',async()=>{
  h.read.mockRejectedValueOnce(new Error('Refus fictif'));await monter();const d=differe<unknown>();h.read.mockReturnValue(d.promise);
  const b=conteneur.querySelector('button')!;await act(async()=>{b.click();b.click();});
  expect(h.calls).toHaveLength(2);expect(conteneur.querySelector('button')).toBeNull();expect(texte()).toContain('Chargement');
  await act(async()=>d.resolve(recu(row())));expect(texte()).toContain('Avis place-A');expect(h.write).not.toHaveBeenCalled();expect(fetch).not.toHaveBeenCalled();
 });
 it('ignore une reprise A terminee apres navigation B',async()=>{
  h.read.mockRejectedValueOnce(new Error('Refus fictif'));await monter();const d=differe<unknown>();h.read.mockReturnValueOnce(d.promise);
  await act(async()=>conteneur.querySelector('button')!.click());await monter('place-B');
  await act(async()=>d.resolve(recu(row())));expect(texte()).toContain('Avis place-B');expect(texte()).not.toContain('Avis place-A');
 });
 it('traduit le geste explicite de reprise en anglais',async()=>{h.read.mockRejectedValueOnce(new Error('Refus fictif'));await monter('place-A',{lang:'en'});expect(conteneur.querySelector('button')?.textContent).toBe('Retry reading reviews');});
 });
