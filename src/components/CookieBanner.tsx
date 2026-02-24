import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { loadGTM, removeGTM } from "@/lib/analytics";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

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
          Ce site utilise des cookies pour améliorer votre expérience et mesurer l'audience. Consultez notre{" "}
          <Link to="/cookies" className="text-primary underline hover:text-primary/80">
            politique de cookies
          </Link>{" "}
          pour en savoir plus.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={refuse}>
            Refuser
          </Button>
          <Button size="sm" onClick={accept}>
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
