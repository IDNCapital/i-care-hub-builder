import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Analytics } from "@/lib/analytics";

const CABINETS = [
  { slug: "", label: "Sans préférence" },
  { slug: "i-ca-re-nansouty", label: "Nansouty" },
  { slug: "i-ca-re-pey-berland", label: "Pey-Berland" },
  { slug: "i-ca-re-jardin-public", label: "Jardin Public" },
  { slug: "i-ca-re-chartrons", label: "Chartrons" },
];

type FormState = "idle" | "submitting" | "success" | "error" | "unknown";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const useClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Page publique du formulaire de conciergerie patient.
 * - Multi-select problématiques dérivé dynamiquement depuis les fiches
 *   praticiens validées (table publiquement lisible).
 * - Honeypot field caché (champ `website`).
 * - Soumission via Edge Function `submit-demande-conciergerie`.
 */
export default function DecrireMonBesoin() {
  const navigate = useNavigate();
  const [problematiquesAvailable, setProblematiquesAvailable] = useState<string[]>([]);
  const [problematiquesSelected, setProblematiquesSelected] = useState<Set<string>>(
    new Set(),
  );
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [cabinet, setCabinet] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [referenceState, setReferenceState] = useState<"loading" | "ready" | "error">("loading");
  const [referenceAttempt, setReferenceAttempt] = useState(0);
  const locked = useRef(false);
  const actif = useRef(false);
  useClientLayoutEffect(() => {
    actif.current = true;
    return () => { actif.current = false; };
  }, []);

  // Charge les problématiques distinctes depuis les praticiens validés
  useEffect(() => {
    let cancelled = false;
    setReferenceState("loading");
    setProblematiquesAvailable([]);
    (async () => {
      try {
        const rows: { id: string; problematiques: string[] | null }[] = [];
        const ids = new Set<string>();
        let total: number | null = null;
        let pages = 0;
        do {
          if (++pages > 50) throw new Error("Limite de lecture du référentiel atteinte.");
          if (cancelled) return;
          const { data, error, count } = await supabase
            .from("praticiens")
            .select("id,problematiques", { count: "exact" })
            .eq("statut_validation", "validee")
            .eq("actif", true)
            .order("id")
            .range(rows.length, rows.length + 199);
          if (cancelled) return;
          if (error !== null || !Array.isArray(data) || typeof count !== "number" || !Number.isSafeInteger(count) || count < 0 || count > 10000 || data.length > 200 || (total !== null && total !== count)) throw new Error("Référentiel non confirmé.");
          total = count;
          for (const row of data) {
            if (!row || typeof row.id !== "string" || !UUID.test(row.id) || ids.has(row.id) ||
              (row.problematiques !== null && (!Array.isArray(row.problematiques) || row.problematiques.some(p => typeof p !== "string")))) throw new Error("Référentiel non confirmé.");
            ids.add(row.id); rows.push(row);
          }
          if (rows.length > total || (data.length === 0 && rows.length < total)) throw new Error("Référentiel incomplet.");
        } while (rows.length < total);
        const set = new Set<string>();
        rows.forEach((row: { problematiques: string[] | null }) => {
          (row.problematiques ?? []).forEach((p) => p && set.add(p));
        });
        setProblematiquesAvailable(Array.from(set).sort((a, b) => a.localeCompare(b, "fr")));
        setReferenceState("ready");
      } catch {
        if (!cancelled) { setProblematiquesAvailable([]); setReferenceState("error"); }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [referenceAttempt]);

  const messageLength = message.trim().length;
  const canSubmit = useMemo(
    () =>
      prenom.trim() &&
      nom.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
      messageLength >= 30 &&
      consent &&
      state !== "submitting" && state !== "unknown",
    [prenom, nom, email, messageLength, consent, state],
  );

  const toggleProblematique = (p: string) => {
    const next = new Set(problematiquesSelected);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setProblematiquesSelected(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || locked.current || !actif.current) return;
    locked.current = true;
    setState("submitting");
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.functions.invoke<{ ok?: boolean; id?: string; error?: string }>(
        "submit-demande-conciergerie",
        {
          body: {
            prenom: prenom.trim(),
            nom: nom.trim(),
            email: email.trim(),
            telephone: telephone.trim() || null,
            message: message.trim(),
            problematiques_pressenties: Array.from(problematiquesSelected),
            cabinet_prefere: cabinet || null,
            consentement_rgpd: true,
            source: "/patients/decrire-mon-besoin",
            website, // honeypot
          },
        },
      );
      if (!actif.current) return;
      const statusCode = (error as { context?: { status?: number } } | null)?.context?.status;
      if (error && data == null && (statusCode === 400 || statusCode === 429)) {
        const code = statusCode === 429 ? "rate_limited" : "unknown";
        const msgByCode: Record<string, string> = {
          consent_required: "Le consentement RGPD est obligatoire.",
          invalid_email: "L'adresse email n'est pas valide.",
          message_too_short: "Le message doit comporter au moins 30 caractères.",
          invalid_phone: "Le numéro de téléphone n'est pas valide.",
          rate_limited:
            "Trop de soumissions récentes depuis votre connexion. Merci de réessayer dans une heure.",
        };
        setErrorMsg(msgByCode[code] ?? "Une erreur est survenue. Merci de réessayer.");
        locked.current = false;
        setState("error");
        return;
      }
      const recu = data && typeof data === "object" && !Array.isArray(data) ? data : null;
      if (error || recu?.ok !== true || typeof recu.id !== "string" ||
        (recu.id !== "honeypot" && !UUID.test(recu.id)) || recu.error != null) {
        setErrorMsg("Réception non confirmée : votre demande a pu être reçue. Votre saisie est conservée. Ne renvoyez pas le formulaire ; contactez I-CA.RE pour vérifier sa réception.");
        setState("unknown");
        return;
      }
      setState("success");
      try {
        Analytics.formSubmission("conciergerie_patients", "/patients/decrire-mon-besoin");
      } catch {
        console.warn("[decrire-mon-besoin] mesure non confirmée.");
      }
    } catch (err) {
      if (!actif.current) return;
      console.error("[decrire-mon-besoin] submit error:", err);
      setErrorMsg("Réception non confirmée : votre demande a pu être reçue. Votre saisie est conservée. Ne renvoyez pas le formulaire ; contactez I-CA.RE pour vérifier sa réception.");
      setState("unknown");
    }
  };

  return (
    <Layout>
      <SeoHead
        title="Décrire mon besoin | Conciergerie patients I-CA.RE"
        description="Décrivez votre besoin en quelques lignes : nous vous orientons vers la praticienne ou le praticien I-CA.RE le plus adapté, sous 48h ouvrées."
        path="/patients/decrire-mon-besoin"
        noIndex
      />
      <section className="pt-32 pb-16 bg-secondary/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-6">
            Conciergerie patients
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-normal text-foreground leading-tight mb-6 text-balance">
            Décrivez-nous votre besoin
          </h1>
          <p className="font-heading italic text-xl text-muted-foreground leading-relaxed text-balance max-w-2xl mx-auto">
            En quelques lignes, dites-nous ce que vous cherchez. Notre équipe vous oriente
            vers la praticienne ou le praticien I‑CA.RE le plus adapté, sous 48h ouvrées.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          {state === "success" ? (
            <div className="text-center bg-secondary/40 border border-primary/30 rounded-2xl p-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
                <Check className="w-8 h-8 text-foreground" strokeWidth={2.5} />
              </div>
              <h2 className="font-heading text-3xl font-normal text-foreground mb-4">
                Votre demande a bien été reçue.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto mb-8">
                Un accusé de réception vient de vous être envoyé par email. Notre équipe
                revient vers vous sous 48h ouvrées.
              </p>
              <Button variant="outline" onClick={() => navigate("/patients")}>
                Retour à l'Espace Patients
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <fieldset disabled={state === "submitting"} className="space-y-6 min-w-0">
              {/* Honeypot : caché aux humains, visible aux bots */}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
              >
                <label htmlFor="website">Ne pas remplir</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    maxLength={100}
                    autoComplete="given-name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    maxLength={100}
                    autoComplete="family-name"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                    autoComplete="email"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    maxLength={30}
                    autoComplete="tel"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cabinet">Cabinet préféré</Label>
                <Select value={cabinet || "none"} onValueChange={(v) => setCabinet(v === "none" ? "" : v)}>
                  <SelectTrigger id="cabinet" className="mt-2">
                    <SelectValue placeholder="Sans préférence" />
                  </SelectTrigger>
                  <SelectContent>
                    {CABINETS.map((c) => (
                      <SelectItem key={c.slug || "none"} value={c.slug || "none"}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {referenceState === "loading" && <p role="status" className="text-sm text-muted-foreground">Chargement des problématiques...</p>}
              {referenceState === "error" && <p role="alert" className="text-sm text-destructive">Les problématiques sont indisponibles. Vous pouvez décrire votre besoin dans le message. <button type="button" className="underline" onClick={() => setReferenceAttempt(n => n + 1)}>Réessayer les problématiques</button></p>}
              {referenceState === "ready" && problematiquesAvailable.length === 0 && <p className="text-sm text-muted-foreground">Aucune problématique proposée actuellement.</p>}
              {referenceState === "ready" && problematiquesAvailable.length > 0 && (
                <div>
                  <Label>Problématiques pressenties</Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    Sélectionnez celles qui vous concernent (facultatif).
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {problematiquesAvailable.map((p) => {
                      const active = problematiquesSelected.has(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => toggleProblematique(p)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground border-border hover:border-primary/50"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="message">Votre message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  minLength={30}
                  maxLength={5000}
                  rows={6}
                  className="mt-2 resize-y"
                  placeholder="Décrivez votre situation, ce que vous recherchez, vos contraintes éventuelles…"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {messageLength < 30
                    ? `Encore ${30 - messageLength} caractère${30 - messageLength > 1 ? "s" : ""} minimum.`
                    : `${messageLength} caractères.`}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  required
                  className="mt-1"
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed font-normal text-muted-foreground">
                  J'accepte que mes informations soient utilisées pour traiter ma demande,
                  conformément à la{" "}
                  <Link to="/confidentialite/" className="text-primary underline">
                    politique de confidentialité
                  </Link>
                  . *
                </Label>
              </div>

              {(state === "error" || state === "unknown") && errorMsg && (
                <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {errorMsg}
                  {state === "unknown" && <> <Link to="/contact/" className="underline">Contacter I-CA.RE</Link></>}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  disabled={!canSubmit}
                  className="min-w-[200px]"
                >
                  {state === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    "Envoyer ma demande"
                  )}
                </Button>
              </div>
              </fieldset>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
