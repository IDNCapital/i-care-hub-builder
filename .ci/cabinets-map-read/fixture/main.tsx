import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CarteCabinets } from '../../../src/components/CarteCabinets';
const params=new URLSearchParams(location.search);
const en=params.get('lang')==='en';
createRoot(document.getElementById('root')!).render(<BrowserRouter><main className="p-4 max-w-6xl mx-auto"><h1 className="text-2xl mb-5">{en?'Office map':'Carte des cabinets'}</h1><CarteCabinets showSidebar={params.get('scene')!=='tiles'}/></main></BrowserRouter>);
