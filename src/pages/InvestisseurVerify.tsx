import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerifyState = "loading" | "success" | "error" | "expired" | "unknown";

export default function InvestisseurVerify() {
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const token = searchParams.get("token");
  return <VerificationCourante key={token ?? ""} token={token} lang={lang} />;
}

function VerificationCourante({ token, lang }: { token: string | null; lang: "fr" | "en" }) {
  const navigate = useNavigate();
  const [state, setState] = useState<VerifyState>(token ? "loading" : "error");

  useEffect(() => {
    if (!token) return;
    let active = true;
    const controller = new AbortController();
    const deadline = Date.now() + 15000;
    const commit = (next: VerifyState) => { if (active) setState(next); };
    const timer = setTimeout(() => {
      active = false;
      controller.abort();
      setState("unknown");
    }, 15000);

    (async () => {
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/verify-investor-token?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            signal: controller.signal,
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        const result = await res.json();
        if (!active) return;
        if (Date.now() >= deadline) {
          commit("unknown");
          active = false;
          controller.abort();
          return;
        }
        // Le service émet exactement un UUID v4 natif après vérification du lien.
        const champs = result && typeof result === "object" && !Array.isArray(result) ? Object.keys(result).sort().join(",") : "";
        if (res.headers.get("x-relay-error") === "true") {
          commit("unknown");
        } else if (res.status === 200 && champs === "access_token,status" && result.status === "verified" &&
            typeof result.access_token === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(result.access_token)) {
          localStorage.setItem("icare_investor_token", result.access_token);
          commit("success");
        } else if (res.status === 400 && champs === "error" && result.error === "expired") {
          commit("expired");
        } else if (res.status === 400 && champs === "error" && (result?.error === "invalid_token" || result?.error === "invalid_or_expired")) {
          commit("error");
        } else {
          commit("unknown");
        }
      } catch {
        if (active) commit("unknown");
      } finally {
        clearTimeout(timer);
      }
    })();
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [token]);

  useEffect(() => {
    if (state !== "success") return;
    const redirect = setTimeout(() => navigate(localePath(lang, "investmentMemo"), { replace: true }), 3000);
    return () => clearTimeout(redirect);
  }, [state, lang, navigate]);

  return (
    <Layout>
      <title>{lang === "en" ? "Email Verification | I‑CA.RE" : "Vérification email | I‑CA.RE"}</title>
      <meta name="robots" content="noindex, nofollow" />

      <section className="pt-32 pb-20">
        <div className="container">
          <div className="max-w-lg mx-auto text-center">
            {state === "unknown" && (
              <div className="space-y-6">
                <p role="alert">{lang === "en" ? "Verification not confirmed. A technical problem prevents confirming this link." : "Vérification non confirmée. Un problème technique empêche de confirmer ce lien."}</p>
                <Button variant="hero" onClick={() => navigate(localePath(lang, "investmentInterest"))}>{lang === "en" ? "Back to the form" : "Retour au formulaire"}</Button>
              </div>
            )}
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
