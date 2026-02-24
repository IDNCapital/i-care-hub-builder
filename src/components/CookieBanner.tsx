import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { loadGTM, removeGTM } from "@/lib/analytics";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    } else if (consent === "accepted") {
      loadGTM();
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    loadGTM();
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem("cookie-consent", "refused");
    removeGTM();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background border-t border-border shadow-elevated animate-fade-up">
      <div className="container flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          {t("cookies.message")} {t("cookies.learnMoreIntro")}{" "}
          <Link to={localePath(lang, "cookies")} className="text-primary underline hover:text-primary/80">
            {t("cookies.learnMore")}
          </Link>{" "}
          {t("cookies.learnMoreSuffix")}
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={refuse}>{t("cookies.reject")}</Button>
          <Button size="sm" onClick={accept}>{t("cookies.accept")}</Button>
        </div>
      </div>
    </div>
  );
}