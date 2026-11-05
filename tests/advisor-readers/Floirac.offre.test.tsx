import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
const ports=vi.hoisted(()=>({lang:"fr",translations:{} as Record<string,string>,calls:[]as string[],projects:[]as Record<string,unknown>[],cabinets:[]as Record<string,unknown>[],project:undefined as Record<string,unknown>|undefined,installation:undefined as Record<string,unknown>|undefined,readCalls:[]as string[],closed:(..._args:unknown[])=>{ports.calls.push("external/write");throw Error("closed");}}));
vi.mock("react-i18next",()=>({useTranslation:()=>({t:(key:string)=>ports.translations[key]??key,i18n:{language:ports.lang}})}));
vi.mock("@supabase/supabase-js",()=>({createClient:ports.closed}));
vi.mock("@/integrations/supabase/client",()=>({supabase:{functions:{invoke:ports.closed},from:(name:string)=>{if(name!=="projets")return ports.closed();const q={select:(columns:string)=>{ports.readCalls.push(columns);return q},not:()=>q,order:async()=>({data:ports.cabinets,error:null})};return q;}}}));
vi.mock("@/hooks/useProjects",()=>({useProjects:()=>({data:ports.projects}),useProject:(slug:string)=>{ports.readCalls.push("project:"+slug);return{data:ports.project,isLoading:false,isError:false}}}));
vi.mock("@/hooks/useInstallation",()=>({useCabinetsPipeline:()=>({data:ports.cabinets}),useCabinetsInstallation:()=>({data:ports.cabinets}),useProfessions:()=>({data:[]}),useProfessionsInstallation:()=>({data:[{slug:"psychologue",nom_masculin_singulier:"Psychologue",nom_inclusif_pluriel:"psychologues"}]}),useInstallationPage:()=>{ports.readCalls.push("installation");return{data:ports.installation,isLoading:false,isError:false}}}));
vi.mock("@/components/Layout",()=>({Layout:({children}:React.PropsWithChildren)=><main>{children}</main>}));
vi.mock("@/components/CarteCabinetsSection",()=>({CarteCabinetsSection:()=>null}));
vi.mock("@/components/SectionPraticiensDuCabinet",()=>({SectionPraticiensDuCabinet:()=>null}));
vi.mock("@/components/avis/SectionAvisGoogle",()=>({SectionAvisGoogle:()=>null}));
vi.mock("@/components/Lightbox",()=>({Lightbox:()=>null}));
vi.mock("@/components/FadeImage",()=>({FadeImage:({src,alt}:Pick<React.ComponentProps<"img">,"src"|"alt">)=><img src={src} alt={alt}/>}));
vi.mock("@/components/CabinetVisuel",()=>({CabinetVisuel:()=>null}));
vi.mock("@/components/SinstallerLinksCabinet",()=>({SinstallerLinksCabinet:({slugInstallation,cabinetLabel}:{slugInstallation:string;cabinetLabel:string})=><a href={"/sinstaller/psychologue/"+slugInstallation}>{cabinetLabel}</a>}));
vi.mock("@/components/FormulaireInteretInstallation",()=>({FormulaireInteretInstallation:(props:Record<string,unknown>)=><div data-form-props={JSON.stringify(props)}/> }));
vi.mock("@/lib/analytics",()=>({Analytics:{projectView:()=>{},formSubmission:ports.closed}}));
vi.mock("leaflet",()=>({default:{divIcon:()=>({}),latLngBounds:()=>({isValid:()=>true})}}));
vi.mock("react-leaflet",()=>({MapContainer:({children}:React.PropsWithChildren)=><div>{children}</div>,TileLayer:()=>null,Marker:({children}:React.PropsWithChildren)=><div>{children}</div>,Popup:({children}:React.PropsWithChildren)=><div>{children}</div>,useMap:()=>({invalidateSize:()=>{},setView:()=>{},fitBounds:()=>{},flyTo:()=>{},flyToBounds:()=>{}})}));
import { STATIC_CENTRES, getCentreBySlug } from "@/lib/centres";
import { CABINETS_A_LOUER, cabinetALouerParSlug } from "@/lib/cabinetsALouer";
import Projets from "@/pages/Projets";
import ProjetDetail from "@/pages/ProjetDetail";
import CabinetALouer from "@/pages/CabinetALouer";
import { CarteCabinets } from "@/components/CarteCabinets";
import Bordeaux from "@/pages/LocationCabinetBordeaux";
import Toulouse from "@/pages/LocationCabinetToulouse";
import SinstallerIndex from "@/pages/SinstallerIndex";
import SinstallerDetail from "@/pages/SinstallerDetail";
import Contact from "@/pages/Contact";
import { WithdrawnOfferContactGuard } from "@/components/WithdrawnOfferContactGuard";
const {FormulaireInteretInstallation:RealForm}=await vi.importActual<{FormulaireInteretInstallation:React.ComponentType<{villeSlug?:string}>}>("@/components/FormulaireInteretInstallation");
let root:Root,host:HTMLDivElement;
const cabinet=(slug:string,name:string,city="Bordeaux")=>({id:slug,slug,slug_installation:slug.replace("i-ca-re-",""),name,city,address:"Adresse fixture",status:"a_venir",date_ouverture_cible:"2027-03-01",lat:44.85,lng:-0.56,google_place_id:null});
const floirac=cabinet("i-ca-re-floirac","Floirac","Floirac");const chartrons=cabinet("i-ca-re-chartrons","Chartrons");
beforeEach(()=>{ports.lang="fr";ports.translations={};ports.calls=[];ports.readCalls=[];ports.cabinets=[floirac,chartrons];ports.projects=[floirac,chartrons];ports.project={...chartrons,slug_installation:"bordeaux-chartrons",status:"en_exploitation",short_description:"Centre témoin",long_description:"Archive témoin",key_features:[],image_gallery:[]};ports.installation=undefined;host=document.createElement("div");document.body.append(host);root=createRoot(host);Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});vi.spyOn(console,"error").mockImplementation(()=>{});vi.stubGlobal("ResizeObserver",class{observe(){}unobserve(){}disconnect(){}});vi.stubGlobal("fetch",ports.closed);for(const n of["XMLHttpRequest","WebSocket","EventSource"])vi.stubGlobal(n,ports.closed);vi.spyOn(window,"open").mockImplementation(ports.closed);vi.spyOn(HTMLFormElement.prototype,"submit").mockImplementation(ports.closed);vi.spyOn(HTMLFormElement.prototype,"requestSubmit").mockImplementation(ports.closed);Object.defineProperty(window,"matchMedia",{configurable:true,value:()=>({matches:true,addEventListener:()=>{},removeEventListener:()=>{}})});});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();expect(ports.calls).toEqual([]);vi.restoreAllMocks();vi.unstubAllGlobals();});
const mount=async(element:React.ReactNode,path="/",pattern="*")=>{await act(async()=>{root.render(<MemoryRouter initialEntries={[path]} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><Routes><Route path={pattern} element={element}/></Routes></MemoryRouter>);});};
const noFloirac=()=>{expect(host.textContent).not.toContain("Floirac");expect([...host.querySelectorAll("a")].some(a=>a.href.includes("floirac"))).toBe(false)};
const archived=()=>{expect(host.querySelector("h1")?.textContent).toBe("404");expect(document.querySelector('meta[name="robots"][content*="noindex"]')).not.toBeNull();expect(host.querySelector("form,[data-form-props],script[type='application/ld+json']")).toBeNull();};
it("causal: public catalogues no longer offer Floirac",()=>{expect(STATIC_CENTRES.some(c=>c.slug==="i-ca-re-floirac")).toBe(false);expect(CABINETS_A_LOUER.some(c=>c.projetSlug==="i-ca-re-floirac")).toBe(false);expect(getCentreBySlug("i-ca-re-floirac")).toBeUndefined();expect(cabinetALouerParSlug("floirac")).toBeUndefined();});
it("causal: map ignores still-published database Floirac and stale cabinet parameter",async()=>{await mount(<CarteCabinets/>,"/?cabinet=i-ca-re-floirac");noFloirac();expect(host.textContent).toContain("Chartrons");});
it("causal: direct Floirac project has no offer or reader",async()=>{ports.project={...ports.project,...floirac};await mount(<ProjetDetail/>,"/projets/i-ca-re-floirac","/projets/:slug");archived();expect(ports.readCalls).toEqual([]);});
for(const lang of["fr","en"])describe(lang,()=>{
it("real catalogue keeps other centres and removes retired card",async()=>{ports.lang=lang;await mount(<Projets/>);noFloirac();expect(host.textContent).toContain("Chartrons");expect(STATIC_CENTRES).toHaveLength(7);});
it("project direct access stays unavailable independently of backend data",async()=>{ports.lang=lang;ports.project={...ports.project,...floirac};await mount(<ProjetDetail/>,lang==="fr"?"/projets/i-ca-re-floirac":"/en/projects/i-ca-re-floirac",lang==="fr"?"/projets/:slug":"/en/projects/:slug");archived();expect(ports.readCalls).toEqual([]);});
it("other project keeps its description and interest component",async()=>{ports.lang=lang;await mount(<ProjetDetail/>,"/projets/i-ca-re-chartrons","/projets/:slug");expect(host.textContent).toContain("Archive témoin");expect(ports.readCalls).toEqual(["project:i-ca-re-chartrons"]);expect(host.querySelector("h1")).not.toBeNull();});
it("Bordeaux consumer removes Floirac pipeline even while DB returns it",async()=>{ports.lang=lang;await mount(<Bordeaux/>);noFloirac();expect(host.textContent).toContain("Chartrons");});
});
it("Toulouse consumer filters retired identity even if its city is wrong",async()=>{ports.cabinets=[{...floirac,city:"Toulouse"},cabinet("i-ca-re-toulouse-capitole","Toulouse Capitole","Toulouse")];await mount(<Toulouse/>);noFloirac();expect(host.textContent).toContain("Toulouse Capitole");});
it("installation index exposes other centres only",async()=>{await mount(<SinstallerIndex/>);noFloirac();expect(host.textContent).toContain("Chartrons");});
it("direct installation old link stops before readers or form",async()=>{await mount(<SinstallerDetail/>,"/sinstaller/psychologue/floirac","/sinstaller/:profession/:ville");archived();expect(ports.readCalls).toEqual([]);});
it("rental direct link stops offer JSON-LD and visit links",async()=>{await mount(<CabinetALouer/>,"/cabinet-a-louer/floirac","/cabinet-a-louer/:site");archived();});
it("other rental remains an offer with original full-time tariff",async()=>{await mount(<CabinetALouer/>,"/cabinet-a-louer/bordeaux-chartrons","/cabinet-a-louer/:site");expect(host.textContent).toContain("Chartrons");expect(host.textContent).toContain("Demander une visite");expect(host.querySelector('script[type="application/ld+json"]')?.textContent).toContain("Offer");});
it.each(["floirac","i-ca-re-floirac"])("real form does not render for retired preselection %s",async villeSlug=>{await mount(<RealForm villeSlug={villeSlug}/>);expect(host.querySelector("form")).toBeNull();expect(host.querySelector('[role="status"]')?.textContent).toContain("ne fait plus partie");});
it("real free-choice form removes retired option without invoking submission",async()=>{await mount(<RealForm/>);expect(host.querySelector("form")).not.toBeNull();expect([...host.querySelectorAll("select option")].map(o=>o.getAttribute("value"))).not.toContain("floirac");expect([...host.querySelectorAll("select option")].map(o=>o.getAttribute("value"))).toContain("chartrons");expect(host.textContent).not.toContain("Floirac");});
it("real form unmounts when previous valid preselection becomes retired",async()=>{await mount(<RealForm villeSlug="chartrons"/>);expect(host.querySelector("form")).not.toBeNull();await mount(<RealForm villeSlug="floirac"/>);expect(host.querySelector("form")).toBeNull();});
it("sitemap and prerender remove only the three withdrawn static routes",()=>{const sitemap=readFileSync("public/sitemap.xml","utf8");expect(sitemap).not.toContain("floirac");expect(sitemap).toContain("i-ca-re-chartrons");const script=readFileSync("scripts/prerender.mjs","utf8");const table=script.match(/const ROUTES = (\[[\s\S]*?\n\]);/);expect(table).not.toBeNull();const routes=runInNewContext(table![1]) as {path:string}[];expect(routes.some(r=>r.path.includes("floirac"))).toBe(false);expect(routes.some(r=>r.path==="/en/projects/i-ca-re-chartrons")).toBe(true);});
it("dynamic discovery excludes only withdrawn installation identity with unchanged GETs",async()=>{vi.stubEnv("VITE_SUPABASE_URL","https://fixture.invalid");vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY","fixture-key");const calls:string[]=[];vi.stubGlobal("fetch",async(url:string,options?:RequestInit)=>{expect(!options?.method||options.method==="GET").toBe(true);calls.push(String(url));const path=new URL(String(url)).pathname;const data=path.endsWith("/professions")?[{slug:"psychologue"}]:path.endsWith("/installation_content_profession")?[{profession_slug:"psychologue"}]:path.endsWith("/installation_content_ville")?[{ville_slug:"floirac"},{ville_slug:"bordeaux-chartrons"},{ville_slug:"toulouse-capitole"}]:ports.closed();return{ok:true,json:async()=>data};});const {fetchInstallationMatrix}=await import("../../scripts/publishedRoutes.mjs");const result=await fetchInstallationMatrix();expect(result.paths).toEqual(["/sinstaller/psychologue/bordeaux-chartrons","/sinstaller/psychologue/toulouse-capitole"]);expect(calls).toHaveLength(3);vi.unstubAllEnvs();});


for(const lang of["fr","en"])it(`withdrawal translation: Bordeaux copy ${lang} no longer announces Floirac`,async()=>{ports.lang=lang;const locale=JSON.parse(readFileSync(`src/locales/${lang}.json`,"utf8"));ports.translations={"locationBordeaux.why.neighbourhoodsDesc":locale.locationBordeaux.why.neighbourhoodsDesc};await mount(<Bordeaux/>);noFloirac();expect(host.textContent).toContain(lang==="fr"?"de nouveaux lieux en préparation à Lormont et au Bouscat":"new locations in preparation in Lormont and Le Bouscat");});

let contactMounts=0;
function TrackedContact(){contactMounts++;return <Contact/>;}
function ContactNavigation({target}:{target:string}){const navigate=useNavigate();return <button data-contact-navigation onClick={()=>navigate(target)}>Local navigation</button>;}
const contactRoute=async(path:string,target="/contact?centre=I-CA.RE%20Floirac")=>{contactMounts=0;await act(async()=>root.render(<MemoryRouter initialEntries={[path]} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><ContactNavigation target={target}/><Routes><Route path="/contact" element={<WithdrawnOfferContactGuard><TrackedContact/></WithdrawnOfferContactGuard>}/><Route path="/en/contact" element={<WithdrawnOfferContactGuard><TrackedContact/></WithdrawnOfferContactGuard>}/><Route path="/projets" element={<h1>Catalogue FR</h1>}/><Route path="/en/projects" element={<h1>Catalogue EN</h1>}/></Routes></MemoryRouter>));};
for(const lang of["fr","en"])describe(`Contact guard: ${lang}`,()=>{
const path=lang==="fr"?"/contact":"/en/contact";const catalogue=lang==="fr"?"Catalogue FR":"Catalogue EN";
it.each(["centre=I-CA.RE+Floirac&source=page-cabinet-floirac","centre=I-CA.RE+Floirac","centre=Floirac","centre=i-ca-re-floirac","centre=floirac","source=page-cabinet-floirac","utm_source=page-cabinet-floirac"])("stops withdrawn project before real Contact mounts: %s",async query=>{ports.lang=lang;await contactRoute(path+"?"+query);expect(host.textContent).toContain(catalogue);expect(contactMounts).toBe(0);expect(host.querySelector("form,textarea")).toBeNull();});
it("keeps explicit Chartrons despite old Floirac attribution",async()=>{ports.lang=lang;await contactRoute(path+"?centre=I-CA.RE+Chartrons&source=page-cabinet-floirac&utm_source=page-cabinet-floirac");expect(contactMounts).toBeGreaterThan(0);expect((host.querySelector("textarea")as HTMLTextAreaElement).value).toBe(lang==="fr"?"Je souhaite organiser une visite de I-CA.RE Chartrons.":"I would like to arrange a visit to I-CA.RE Chartrons.");});
it("preserves Floirac as free city or message without a project request",async()=>{ports.lang=lang;await contactRoute(path+"?ville=Floirac&message=Floirac");expect(contactMounts).toBeGreaterThan(0);expect(host.textContent).not.toContain(catalogue);});
it("handles changed query without leaving old Contact mounted",async()=>{ports.lang=lang;await contactRoute(path+"?centre=I-CA.RE+Chartrons",path+"?centre=I-CA.RE+Floirac");expect(host.querySelector("textarea")).not.toBeNull();await act(async()=>{(host.querySelector("[data-contact-navigation]")as HTMLButtonElement).click();});expect(host.textContent).toContain(catalogue);expect(host.querySelector("form,textarea")).toBeNull();});
});
