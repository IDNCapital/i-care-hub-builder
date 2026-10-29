import {useSyncExternalStore} from 'react';
let language='fr';const listeners=new Set<()=>void>();
export const i18n={get language(){return language;},changeLanguage(next:string){if(next!==language){language=next;listeners.forEach(fn=>fn());}return Promise.resolve();}};
const labels:Record<string,Record<string,string>>={fr:{'nav.approach':'Notre approche','nav.contact':'Contact','nav.joinCta':'Nous rejoindre','cabinetJournee.navLabel':'Cabinet à la journée'},en:{'nav.approach':'Our approach','nav.contact':'Contact','nav.joinCta':'Join us','cabinetJournee.navLabel':'Day office'}};
const t=(key:string)=>labels[language]?.[key]??key;
export function useTranslation(){useSyncExternalStore((fn)=>{listeners.add(fn);return()=>{listeners.delete(fn);};},()=>language,()=>language);return {t,i18n};}
export function resetLanguage(){language='fr';}

