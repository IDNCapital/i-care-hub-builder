import '@testing-library/jest-dom/vitest';
import{vi}from'vitest';
vi.stubGlobal('ResizeObserver',class ResizeObserver{observe(){}unobserve(){}disconnect(){}});
export const listeners=new Set<(event:MediaQueryListEvent)=>void>();
export const media={matches:false,media:'(min-width: 1024px)',addEventListener:(_name:string,fn:(event:MediaQueryListEvent)=>void)=>listeners.add(fn),removeEventListener:(_name:string,fn:(event:MediaQueryListEvent)=>void)=>listeners.delete(fn)};
Object.defineProperty(window,'matchMedia',{configurable:true,value:()=>media});
export function resize(desktop:boolean){media.matches=desktop;listeners.forEach(fn=>fn({matches:desktop}as MediaQueryListEvent));}
Object.defineProperty(HTMLElement.prototype,'getClientRects',{configurable:true,value(){if(!this.isConnected||this.closest('[hidden],[inert]')||this.style.display==='none')return[];if(media.matches&&(this.classList.contains('lg:hidden')||this.closest('.lg\\:hidden')))return[];return[{width:100,height:32}];}});
export const network=vi.fn(()=>{throw Error('Réseau fermé');});vi.stubGlobal('fetch',network);

