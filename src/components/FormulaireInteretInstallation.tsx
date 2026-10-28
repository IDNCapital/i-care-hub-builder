import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useProfessions, useCabinetsInstallation } from "@/hooks/useInstallation";
import { cabinetNomCourt } from "@/lib/installation";
import { Analytics } from "@/lib/analytics";

interface Props {
  professionSlug?: string;
  villeSlug?: string;
  professionLabel?: string;
  villeLabel?: string;
}

type State = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"nom" | "email" | "telephone" | "consent" | "profession" | "message" | "form", string>>;

/**
 * Formulaire d'intérêt installation (pattern B, réutilisable).
 * Appelle l'Edge Function `submit-demande-installation` (honeypot,
 * rate-limit, double email transactionnel).
 */
type Recu = { etat: "pret" | "confirme" | "refuse" | "inconnu"; id?: string; code?: string };
async function qualifierRecu(value: unknown): Promise<Recu> {
  if (!value || typeof value !== "object") return { etat: "inconnu" };
  const r = value as { data?: unknown; error?: unknown; response?: unknown };
  if (!(r.response instanceof Response) || r.response.headers.get("x-relay-error") === "true") return { etat: "inconnu" };
  const data = r.data && typeof r.data === "object" && !Array.isArray(r.data) ? r.data as Record<string, unknown> : null;
  if (r.response.status === 200 && r.error === null && data?.ok === true && !Object.prototype.hasOwnProperty.call(data, "error") && typeof data.id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.id)) return { etat: "confirme", id: data.id };
  // Seuls les refus explicitement documentés avant INSERT autorisent une correction directe.
  if (r.data === null && r.error && typeof r.error === "object" && (r.error as { context?: unknown }).context === r.response && [400, 429].includes(r.response.status)) {
    try {
      const corps: unknown = await r.response.clone().json();
      if (corps && typeof corps === "object" && !Array.isArray(corps)) {
        const code = (corps as Record<string, unknown>).error;
        if (typeof code === "string" && ((r.response.status === 429 && code === "rate_limited") || (r.response.status === 400 && ["consent_required", "missing_profession", "invalid_name", "invalid_email", "invalid_phone", "invalid_profession", "invalid_ville"].includes(code)))) return { etat: "refuse", code };
      }
    } catch { /* Une réponse illisible ne prouve pas l'absence d'écriture. */ }
  }
  return { etat: "inconnu" };
}

type Visite = { cle: string; active: boolean };
export function FormulaireInteretInstallation(props: Props) {
  const location = useLocation();
  const cle = JSON.stringify([location.key, location.pathname, location.search, location.hash, props.professionSlug ?? null, props.villeSlug ?? null]);
  const visite = useRef<Visite | null>(null);
  if (!visite.current || visite.current.cle !== cle) {
    if (visite.current) visite.current.active = false;
    visite.current = { cle, active: true };
  }
  return <InstallationCourante key={cle} {...props} visite={visite.current} />;
}

function InstallationCourante({
  professionSlug,
  villeSlug,
  professionLabel,
  villeLabel,
  visite,
}: Props & { visite: Visite }) {
  const professionLibre = !professionSlug;
  const villeLibre = !villeSlug;
  const { data: professions = [] } = useProfessions();
  const { data: cabinets = [] } = useCabinetsInstallation();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [selectedProfession, setSelectedProfession] = useState<string>(professionSlug ?? "");
  const [selectedVille, setSelectedVille] = useState<string>(villeSlug ?? "__all__");
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [recu, setRecu] = useState<Recu>({ etat: "pret" });
  const [preparerReprise, setPreparerReprise] = useState(false);
  const verrou = useRef(false);
  const generation = useRef(0);
  const bloque = state === "submitting" || recu.etat === "inconnu" || recu.etat === "confirme";
  useLayoutEffect(() => {
    const compteur = generation;
    visite.active = true;
    return () => { visite.active = false; ++compteur.current; };
  }, [visite]);
  const autreProfession = professionLibre && selectedProfession === "autre-profession";

  const isValid = useMemo(() => {
    if (!nom.trim() || nom.trim().length < 2) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return false;
    if (!consent) return false;
    if (professionLibre && !selectedProfession) return false;
    return true;
  }, [nom, email, consent, professionLibre, selectedProfession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verrou.current || !visite.active) return;
    const next: FieldErrors = {};
    if (nom.trim().length < 2) next.nom = "Merci d'indiquer votre nom (2 caractères minimum).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Adresse email invalide.";
    if (telephone.trim() && !/^[+\d\s.\-()]{6,20}$/.test(telephone.trim())) {
      next.telephone = "Numéro de téléphone invalide.";
    }
    if (!consent) next.consent = "Le consentement est obligatoire.";
    if (professionLibre && !selectedProfession) next.profession = "Merci de choisir votre profession.";
    if (autreProfession && message.trim().length < 3) next.message = "Merci de préciser votre profession dans le message.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    verrou.current = true;
    const tentative = ++generation.current;
    const sourceTentative = window.location.href;
    const active = () => visite.active && generation.current === tentative;
    setRecu({ etat: "pret" });
    setState("submitting");
    try {
      const villeToSend = villeSlug ?? (selectedVille === "__all__" ? null : selectedVille);

      const reponse = await supabase.functions.invoke<{ ok?: boolean; id?: string; error?: string }>(
        "submit-demande-installation",
        {
          body: {
            profession_slug: professionSlug ?? selectedProfession,
            ville_slug: villeToSend,
            nom: nom.trim(),
            email: email.trim(),
            telephone: telephone.trim() || null,
            message: message.trim() || null,
            consentement_rgpd: true,
            source_path: typeof window !== "undefined" ? window.location.pathname : null,
            website, // honeypot
          },
        },
      );
      const preuve = await qualifierRecu(reponse);
      if (!active()) return;
      if (window.location.href !== sourceTentative) { setRecu({ etat: "inconnu" }); setState("error"); return; }
      setRecu(preuve);
      if (preuve.etat === "inconnu") {
        setErrors({});
        setState("error");
        return;
      }
      if (preuve.etat === "refuse") {
        const code = preuve.code ?? "unknown";
        const map: Record<string, string> = {
          consent_required: "Le consentement est obligatoire.",
          invalid_email: "Adresse email invalide.",
          invalid_name: "Nom invalide.",
          invalid_phone: "Numéro de téléphone invalide.",
          invalid_profession: "Profession inconnue.",
          invalid_ville: "Cabinet inconnu.",
          missing_profession: "Merci de choisir votre profession.",
          rate_limited: "Trop de demandes envoyées, réessayez dans une heure.",
        };
        setErrors({ form: map[code] ?? "Une erreur est survenue. Merci de réessayer." });
        verrou.current = false;
        setState("error");
        return;
      }
      try {
        Analytics.formSubmission(
          "demande_installation",
          typeof window !== "undefined" ? window.location.pathname : "",
        );
      } catch {
        // ignore analytics errors
      }
      setState("success");
    } catch {
      if (active()) {
        setRecu({ etat: "inconnu" });
        setErrors({});
        setState("error");
      }
    }
  };

  if (state === "success") {
    return (
      <div className="bg-secondary rounded-lg p-8 border border-border text-center">
        <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-4">
          Demande envoyée
        </p>
        <h3 className="font-heading text-2xl md:text-3xl font-normal text-foreground mb-4">
          Votre demande a bien été envoyée
        </h3>
        <p className="text-base text-muted-foreground max-w-lg mx-auto">
          Nicolas revient vers vous <strong className="text-foreground">sous 24 h</strong>{" "}
          avec les informations détaillées sur les espaces disponibles et les conditions d'installation.
        </p>
        <p role="status" className="mt-4 text-sm text-muted-foreground">Référence d'enregistrement : <span className="break-all">{recu.id}</span></p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <fieldset disabled={bloque} className="space-y-5 min-w-0">
      {/* Honeypot invisible (off-screen, pas display:none) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="website">Ne pas remplir</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Rappel profession/ville pour pages détail */}
      {(!professionLibre || !villeLibre) && (professionLabel || villeLabel) && (
        <div className="bg-secondary rounded-md p-4 text-sm">
          {professionLabel && (
            <p className="mb-1">
              <span className="text-muted-foreground">Profession : </span>
              <span className="font-medium text-foreground">{professionLabel}</span>
            </p>
          )}
          {villeLabel && (
            <p>
              <span className="text-muted-foreground">Cabinet visé : </span>
              <span className="font-medium text-foreground">{villeLabel}</span>
            </p>
          )}
        </div>
      )}

      {/* Selects (mode index) */}
      {professionLibre && (
        <>
          <div>
            <Label htmlFor="profession">
              Profession <span className="text-primary">*</span>
            </Label>
            <Select value={selectedProfession} onValueChange={setSelectedProfession}>
              <SelectTrigger id="profession" className="mt-1.5">
                <SelectValue placeholder="Sélectionnez votre profession" />
              </SelectTrigger>
              <SelectContent>
                {professions.map((p) => (
                  <SelectItem key={p.id} value={p.slug}>
                    {p.nom_inclusif_pluriel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.profession && <p className="text-sm text-destructive mt-1">{errors.profession}</p>}
            {autreProfession && (
              <p className="text-xs text-muted-foreground mt-1">
                Indiquez votre profession dans le champ « Votre projet d'installation » ci-dessous.
              </p>
            )}
          </div>
          {villeLibre && (
            <div>
              <Label htmlFor="ville">Cabinet souhaité (facultatif)</Label>
              <Select value={selectedVille} onValueChange={setSelectedVille}>
                <SelectTrigger id="ville" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tous les cabinets</SelectItem>
                  {cabinets.map((c) => (
                    <SelectItem key={c.id} value={c.slug_installation}>
                      {cabinetNomCourt(c.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}

      <div>
        <Label htmlFor="nom">
          Nom <span className="text-primary">*</span>
        </Label>
        <Input
          id="nom"
          type="text"
          autoComplete="name"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          maxLength={100}
          className="mt-1.5"
          required
        />
        {errors.nom && <p className="text-sm text-destructive mt-1">{errors.nom}</p>}
      </div>

      <div>
        <Label htmlFor="email">
          Email <span className="text-primary">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={255}
          className="mt-1.5"
          required
        />
        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="telephone">Téléphone (facultatif)</Label>
        <Input
          id="telephone"
          type="tel"
          autoComplete="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          maxLength={20}
          className="mt-1.5"
        />
        {errors.telephone && <p className="text-sm text-destructive mt-1">{errors.telephone}</p>}
      </div>

      <div>
        <Label htmlFor="message">
          Votre projet d'installation {autreProfession ? <span className="text-primary">*</span> : "(facultatif)"}
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          rows={5}
          aria-required={autreProfession}
          placeholder="Précisez votre calendrier envisagé, votre mode d'exercice actuel, vos besoins particuliers (surface, équipements, temps partagé)…"
          className="mt-1.5"
        />
        <p className="text-xs text-muted-foreground mt-1">{message.length} / 2000 caractères</p>
        {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className="mt-0.5"
        />
        <Label htmlFor="consent" className="text-sm font-normal leading-relaxed cursor-pointer">
          J'accepte que mes informations soient utilisées par I‑CA.RE pour traiter ma demande
          d'installation, conformément à la{" "}
          <Link to="/confidentialite/" className="text-primary underline hover:no-underline">
            politique de confidentialité
          </Link>
          . <span className="text-primary">*</span>
        </Label>
      </div>
      {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}

      </fieldset>
      {recu.etat === "refuse" && <p role="status" className="text-sm">Cette tentative a été refusée avant enregistrement. Corrigez votre saisie ou patientez avant une nouvelle tentative.</p>}
      {recu.etat === "inconnu" && <div role="alert" className="space-y-3 text-sm"><p>Résultat non confirmé. Votre demande a pu être enregistrée. Votre saisie est conservée ; évitez de la renvoyer sans vérification auprès de l'équipe.</p>{!preparerReprise ? <Button type="button" variant="outline" className="h-auto whitespace-normal" onClick={() => setPreparerReprise(true)}>Préparer une autre tentative</Button> : <><p>Déverrouiller ne supprime ni n'annule la première tentative. Aucun envoi ne sera effectué par ce geste.</p><Button type="button" variant="outline" className="h-auto whitespace-normal" onClick={() => { ++generation.current; verrou.current = false; setPreparerReprise(false); setRecu({ etat: "pret" }); setErrors({}); setState("idle"); }}>Je comprends le risque de doublon et je souhaite modifier ma demande</Button></>}</div>}
      {errors.form && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
          {errors.form}
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={!isValid || bloque}
          className="w-full sm:w-auto"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours…
            </>
          ) : (
            "Envoyer ma demande"
          )}
        </Button>
      </div>
    </form>
  );
}

export default FormulaireInteretInstallation;