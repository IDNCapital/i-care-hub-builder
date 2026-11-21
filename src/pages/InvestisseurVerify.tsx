import { Layout } from "@/components/Layout";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerifyState = "loading" | "success" | "error" | "expired" | "storage";

type VisiteVerify = { cle: string; active: boolean; initial: string | null | undefined; lecture?: Promise<{ res: Response; result: unknown }> };
export default function InvestisseurVerify() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const cle = `${location.key}:${location.pathname}${location.search}:${i18n.language}`;
  const courant = useRef<VisiteVerify | null>(null);
  if (!courant.current || courant.current.cle !== cle) {
    if (courant.current) courant.current.active = false;
    let initial: string | null | undefined;
    try { initial = localStorage.getItem("icare_investor_token"); } catch { initial = undefined; }
    courant.current = { cle, active: true, initial };
  }
  return <VerificationCourante key={cle} visite={courant.current} />;
}
function VerificationCourante({ visite }: { visite: VisiteVerify }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const [state, setState] = useState<VerifyState>("loading");
  const [stockage, setStockage] = useState(0);
  const acces = useRef<string | null>(null);
  useLayoutEffect(() => { visite.active = true; return () => { visite.active = false; }; }, [visite]);
  const ouvrir = () => {
    if (!visite.active || !acces.current) return;
    try { if (localStorage.getItem("icare_investor_token") !== acces.current) { setState("error"); return; } }
    catch { setState("storage"); return; }
    navigate(localePath(lang, "investmentMemo"), { replace: true });
  };
  useEffect(() => {
    let annule = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const active = () => !annule && visite.active;
    if (!token) { setState("error"); return; }
    visite.lecture ??= (async () => {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/verify-investor-token?token=${encodeURIComponent(token)}`, {
        method: "GET", headers: { "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const result: unknown = await res.json();
      return { res, result };
    })();
    void visite.lecture.then(({ res, result }) => {
      if (!active()) return;
      const r = result && typeof result === "object" && !Array.isArray(result) ? result as Record<string, unknown> : null;
      if (res.status === 200 && r?.status === "verified" && !Object.prototype.hasOwnProperty.call(r, "error") && typeof r.access_token === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r.access_token)) {
        acces.current = r.access_token;
        try {
          const actuel = localStorage.getItem("icare_investor_token");
          if (actuel !== r.access_token && (visite.initial === undefined ? actuel !== null : actuel !== visite.initial)) { setState("error"); return; }
          localStorage.setItem("icare_investor_token", r.access_token);
          if (!active()) return;
          setState("success");
          timer = setTimeout(() => {
            if (!active()) return;
            try { if (localStorage.getItem("icare_investor_token") === r.access_token) navigate(localePath(lang, "investmentMemo"), { replace: true }); else setState("error"); }
            catch { setState("storage"); }
          }, 3000);
        } catch { if (active()) setState("storage"); }
      } else setState(res.status === 400 && r?.error === "expired" ? "expired" : "error");
    }).catch(() => { if (active()) setState("error"); });
    return () => { annule = true; if (timer !== undefined) clearTimeout(timer); };
  }, [token, navigate, lang, visite, stockage]);

  return (
    <Layout>
      <title>{lang === "en" ? "Email Verification | I‑CA.RE" : "Vérification email | I‑CA.RE"}</title>
      <meta name="robots" content="noindex, nofollow" />

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
                <Button variant="hero" onClick={ouvrir}>
                  {lang === "en" ? "Access the memo now" : "Accéder au mémo"}
                </Button>
              </>
            )}

            {state === "storage" && <div role="alert"><h1>{lang === "en" ? "Local storage unavailable" : "Stockage local indisponible"}</h1><p>{lang === "en" ? "Access was received but could not be stored." : "L'accès a été reçu mais n'a pas pu être conservé."}</p><Button onClick={() => setStockage(n => n + 1)}>{lang === "en" ? "Retry storage" : "Réessayer le stockage"}</Button></div>}

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
