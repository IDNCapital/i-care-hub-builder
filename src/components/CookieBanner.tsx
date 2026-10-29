import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { loadGTM, removeGTM } from "@/lib/analytics";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { choisirMesure, lireChoixMesure, type ChoixMesure, type EtatChoixMesure } from "@/lib/analyticsConsent";

export function CookieBanner() {
  const [etat, setEtat] = useState<EtatChoixMesure | null>(null);
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  useEffect(() => {
    const choix = lireChoixMesure();
    setEtat(choix);
    if (choix.choix === "accepted") loadGTM();
    else removeGTM();
  }, []);

  const choisir = (choix: ChoixMesure) => {
    setEtat(choisirMesure(choix));
    if (choix === "accepted") loadGTM();
    else removeGTM();
  };

  if (!etat || (etat.choix !== null && etat.stockage === "confirme")) return null;

  const statut = etat.choix !== null
    ? (lang === "en"
      ? `You have ${etat.choix === "accepted" ? "accepted" : "rejected"} for this visit. Your choice could not be saved; after a refresh or on a later visit, the browser may return to an earlier choice or ask you again.`
      : `Vous avez ${etat.choix === "accepted" ? "accepté" : "refusé"} pour cette visite. Ce choix n'a pas pu être enregistré ; après actualisation ou lors d'une prochaine visite, le navigateur peut reprendre un choix antérieur ou vous le redemander.`)
    : etat.stockage === "illisible"
      ? (lang === "en" ? "Your saved choice could not be read. You can choose for this visit." : "Votre choix enregistré n'a pas pu être lu. Vous pouvez choisir pour cette visite.")
      : etat.stockage === "inconnu"
        ? (lang === "en" ? "The saved choice is not recognised. Please choose for this visit." : "Le choix enregistré n'est pas reconnu. Vous pouvez choisir pour cette visite.")
        : null;

  return (
    <div role="region" aria-label={lang === "en" ? "Cookie choice" : "Choix des cookies"} className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background border-t border-border shadow-elevated animate-fade-up">
      <div className="container flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1 min-w-0 w-full md:w-auto space-y-2">
        <p className="text-sm text-muted-foreground">
          {t("cookies.message")} {t("cookies.learnMoreIntro")}{" "}
          <Link to={localePath(lang, "cookies")} className="text-primary underline hover:text-primary/80">
            {t("cookies.learnMore")}
          </Link>{" "}
          {t("cookies.learnMoreSuffix")}
        </p>
        {statut ? <p role="status" aria-live="polite" className="text-sm">{statut}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3 flex-shrink-0">
          <Button variant="outline" size="sm" className="min-h-11" onClick={() => choisir("refused")}>{t("cookies.reject")}</Button>
          <Button size="sm" className="min-h-11" onClick={() => choisir("accepted")}>{t("cookies.accept")}</Button>
        </div>
      </div>
    </div>
  );
}
