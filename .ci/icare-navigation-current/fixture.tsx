import{createRoot}from'react-dom/client';
import App from '../../src/App';
import{go}from'./controller';
declare global{interface Window{navigationFixture:{go:(to:string|number)=>void}}}
window.navigationFixture={go:(to)=>go(to)};
createRoot(document.getElementById('root')!).render(<App/>);
