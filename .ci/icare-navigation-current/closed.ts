export const effects: string[]=[];
function forbidden(name:string):never{effects.push(name);throw new Error('Effet fermé : '+name);}
export const supabase={functions:{invoke:()=>forbidden('SDK')},from:()=>forbidden('table'),auth:{}};
export const Analytics={formSubmission:()=>forbidden('analytics')};
export function useAnalytics(){}
export const ICARE_TELEPHONE_E164='+33000000000', ICARE_TELEPHONE_AFFICHAGE='Téléphone fictif';
export const SECTION_IMAGES={homeWhyChoose:'',homeImpact:''};
export function getDefaultHero(){return '';}

