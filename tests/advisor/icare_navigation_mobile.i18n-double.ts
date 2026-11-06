import { useSyncExternalStore } from "react";
let langue = "fr";
const ecouteurs = new Set<() => void>();
export const changerLangue = (valeur: string) => { langue = valeur; ecouteurs.forEach(f => f()); };
const souscrire = (f: () => void) => { ecouteurs.add(f); return () => { ecouteurs.delete(f); }; };
const mots: Record<string, Record<string,string>> = {
 fr: { "nav.approach":"Notre approche", "nav.contact":"Contact", "nav.joinCta":"Nous rejoindre", "cabinetJournee.navLabel":"Cabinet à la journée" },
 en: { "nav.approach":"Our approach", "nav.contact":"Contact", "nav.joinCta":"Join us", "cabinetJournee.navLabel":"Office by the day" },
};
export function useTranslation() {
 const language = useSyncExternalStore(souscrire, () => langue, () => langue);
 return { t: (cle: string) => mots[language]?.[cle] ?? cle, i18n: { language, changeLanguage: changerLangue } };
}
