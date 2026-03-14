import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerifyState = "loading" | "success" | "error" | "expired";

export default function InvestisseurVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const [state, setState] = useState<VerifyState>("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      return;
    }

    (async () => {
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/verify-investor-token?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        const result = await res.json();

        if (result.status === "verified" && result.access_token) {
          localStorage.setItem("icare_investor_token", result.access_token);
          setState("success");
          setTimeout(() => {
            navigate(localePath(lang, "investmentMemo"), { replace: true });
          }, 3000);
        } else if (result.error === "expired") {
          setState("expired");
        } else {
          setState("error");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setState("error");
      }
    })();
  }, [searchParams, navigate, lang]);

  return (
    <Layout>
      <Helmet>
        <title>{lang === "en" ? "Email Verification — I‑CA.RE" : "Vérification email — I‑CA.RE"}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="pt-32 pb-20">
        <div className="container">
          <div className="max-w-lg mx-auto text-center">
            {state === "loading" && (
              <>
                <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
                <h1 className="text-2xl font-heading font-bold mb-4">
                  {lang === "en" ? "Verifying your email…" : "Vérification en cours…"}
                </h1>
              </>
            )}

            {state === "success" && (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-heading font-bold mb-4">
                  {lang === "en" ? "Email confirmed!" : "Email confirmé !"}
                </h1>
                <p className="text-muted-foreground mb-8">
                  {lang === "en"
                    ? "You now have access to the investment memo. Redirecting…"
                    : "Vous avez maintenant accès à la note d'investissement. Redirection…"}
                </p>
                <Button variant="hero" onClick={() => navigate(localePath(lang, "investmentMemo"), { replace: true })}>
                  {lang === "en" ? "Access the memo now" : "Accéder au mémo"}
                </Button>
              </>
            )}

            {state === "expired" && (
              <>
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-heading font-bold mb-4">
                  {lang === "en" ? "Link expired" : "Lien expiré"}
                </h1>
                <p className="text-muted-foreground mb-8">
                  {lang === "en"
                    ? "This verification link has expired. Please submit the form again to receive a new link."
                    : "Ce lien de vérification a expiré. Veuillez remplir le formulaire à nouveau pour recevoir un nouveau lien."}
                </p>
                <Button variant="hero" onClick={() => navigate(localePath(lang, "investmentInterest"))}>
                  {lang === "en" ? "Request a new link" : "Demander un nouveau lien"}
                </Button>
              </>
            )}

            {state === "error" && (
              <>
                <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-heading font-bold mb-4">
                  {lang === "en" ? "Invalid link" : "Lien invalide"}
                </h1>
                <p className="text-muted-foreground mb-8">
                  {lang === "en"
                    ? "This verification link is invalid or has already been used."
                    : "Ce lien de vérification est invalide ou a déjà été utilisé."}
                </p>
                <Button variant="hero" onClick={() => navigate(localePath(lang, "investmentInterest"))}>
                  {lang === "en" ? "Request a new link" : "Demander un nouveau lien"}
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
