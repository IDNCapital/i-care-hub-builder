// Fixture de navigateur : vrais composants, seule la panne Leaflet est injectée.
// Ce fichier n'est pas une entrée du build de production.
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import L from 'leaflet';
import i18n from '../src/i18n';
import { CarteCabinetsSection } from '../src/components/CarteCabinetsSection';
import '../src/index.css';

const params = new URLSearchParams(location.search);
await i18n.changeLanguage(params.get('lang') === 'en' ? 'en' : 'fr');
if (params.get('failure') === 'bounds' && !sessionStorage.getItem('mapRecovered')) {
  const original = L.latLngBounds;
  L.latLngBounds = (...args: Parameters<typeof L.latLngBounds>) => {
    if (!sessionStorage.getItem('mapRecovered')) throw new Error('PANNE_LEAFLET_FICTIVE');
    return original(...args);
  };
}
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <header data-testid="outside-header">Navigation conservée</header>
    <main><h1>Page conservée</h1><CarteCabinetsSection /></main>
    <footer data-testid="outside-footer">Contact conservé</footer>
  </BrowserRouter>,
);
