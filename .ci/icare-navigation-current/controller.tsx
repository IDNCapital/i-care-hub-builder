import {useLocation,useNavigate}from'react-router-dom';
export let go:(to:string|number)=>void=()=>{throw Error('Router absent');};
export function ScrollToTop(){const navigate=useNavigate(),location=useLocation();go=(to)=>{if(typeof to==='number')navigate(to);else navigate(to);};return <aside><button data-testid="outside">Cible extérieure</button><output data-testid="location">{location.pathname+location.search+location.hash}</output></aside>;}

