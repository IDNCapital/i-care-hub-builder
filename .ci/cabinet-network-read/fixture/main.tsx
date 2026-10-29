import { createRoot } from 'react-dom/client';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import { SectionPraticiensDuCabinet } from '../../../src/components/SectionPraticiensDuCabinet';
function Fixture(){const[params,setParams]=useSearchParams();const slug=params.get('cabinet')??'cabinet-a';return <main className="max-w-6xl mx-auto"><header className="p-4"><h1 className="text-2xl">Cabinet {slug}</h1><p>Fixture locale, aucune requête réelle</p>{params.get('scene')==='transition'&&<button type="button" onClick={()=>{const p=new URLSearchParams(params);p.set('cabinet','cabinet-b');setParams(p);}}>Afficher cabinet B</button>}</header><SectionPraticiensDuCabinet cabinetSlug={slug} cabinetNomCourt={'Cabinet '+slug} cabinetUrl={'https://i-ca.re/projets/'+slug+'/'}/></main>;}
createRoot(document.getElementById('root')!).render(<BrowserRouter><Fixture/></BrowserRouter>);
