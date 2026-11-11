import { isPublicProjectOffer } from "@/lib/publicProjectOffer";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
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
import { localePath } from "@/lib/routes";
import { Analytics } from "@/lib/analytics";

interface Props {
  professionSlug?: string;
  villeSlug?: string;
  professionLabel?: string;
  villeLabel?: string;
}

type State = "idle" | "submitting" | "success" | "error";
type InstallationField = "nom" | "email" | "telephone" | "consent" | "profession" | "message";
type FieldErrors = Partial<Record<InstallationField | "form", string>>;

const englishProfessions: Record<string, string> = {
  osteopathe: "Osteopaths", sophrologue: "Sophrologists", psychologue: "Psychologists",
  psychotherapeute: "Psychotherapists", "dieteticien-nutritionniste": "Dietitians and nutritionists",
  naturopathe: "Naturopaths", hypnotherapeute: "Hypnotherapists", "medecin-generaliste": "General practitioners",
  "medecin-specialiste": "Medical specialists", "sage-femme": "Midwives", "chirurgien-dentiste": "Dentists",
  "masseur-kinesitherapeute": "Physiotherapists", infirmier: "Nurses", orthophoniste: "Speech therapists",
  "autre-profession": "Other healthcare profession",
};

const copy = {
  fr: {
    profession: "Profession", practice: "Cabinet visé", chooseProfession: "Sélectionnez votre profession",
    preferredPractice: "Cabinet souhaité (facultatif)", allPractices: "Tous les cabinets", name: "Nom", email: "Email",
    phone: "Téléphone (facultatif)", project: "Votre projet d'installation", optional: "(facultatif)",
    otherHelp: "Indiquez votre profession dans le champ « Votre projet d'installation » ci-dessous.",
    placeholder: "Précisez votre calendrier envisagé, votre mode d'exercice actuel, vos besoins particuliers (surface, équipements, temps partagé)…",
    characters: "caractères", consent: "J'accepte que mes informations soient utilisées par I‑CA.RE pour traiter ma demande d'installation, conformément à la",
    privacy: "politique de confidentialité", send: "Envoyer ma demande", sending: "Envoi en cours…", honeypot: "Ne pas remplir",
    unavailable: "Ce lieu ne fait plus partie de notre offre.", sent: "Demande envoyée", success: "Votre demande a bien été envoyée",
    reply: "Nicolas revient vers vous", deadline: "sous 24 h", details: "avec les informations détaillées sur les espaces disponibles et les conditions d'installation.",
    fields: {
      nom: "Merci d'indiquer votre nom (2 caractères minimum).", email: "Adresse email invalide.",
      telephone: "Numéro de téléphone invalide.", consent: "Le consentement est obligatoire.",
      profession: "Merci de choisir votre profession.", message: "Merci de préciser votre profession dans le message.",
    },
    server: {
      consent_required: "Le consentement est obligatoire.", invalid_email: "Adresse email invalide.", invalid_name: "Nom invalide.",
      invalid_phone: "Numéro de téléphone invalide.", invalid_profession: "Profession inconnue.", invalid_ville: "Cabinet inconnu.",
      missing_profession: "Merci de choisir votre profession.", rate_limited: "Trop de demandes envoyées, réessayez dans une heure.",
      unknown: "Une erreur est survenue. Merci de réessayer.",
    },
  },
  en: {
    profession: "Profession", practice: "Selected practice", chooseProfession: "Select your profession",
    preferredPractice: "Preferred practice (optional)", allPractices: "All practices", name: "Name", email: "Email",
    phone: "Phone (optional)", project: "Your practice project", optional: "(optional)",
    otherHelp: "Specify your profession in the ‘Your practice project’ field below.",
    placeholder: "Describe your planned timeline, current practice and specific needs (space, equipment, shared use)…",
    characters: "characters", consent: "I agree that I‑CA.RE may use my information to process my practice enquiry, in accordance with the",
    privacy: "privacy policy", send: "Send my request", sending: "Sending…", honeypot: "Leave empty",
    unavailable: "This location is no longer part of our offer.", sent: "Request sent", success: "Your request has been sent",
    reply: "Nicolas will get back to you", deadline: "within 24 hours", details: "with details of the available spaces and the conditions for setting up your practice.",
    fields: {
      nom: "Enter your name (at least 2 characters).", email: "Enter a valid email address.",
      telephone: "Enter a valid phone number.", consent: "Consent is required.",
      profession: "Select your profession.", message: "Specify your profession in the message.",
    },
    server: {
      consent_required: "Consent is required.", invalid_email: "Enter a valid email address.", invalid_name: "Enter a valid name.",
      invalid_phone: "Enter a valid phone number.", invalid_profession: "Unknown profession.", invalid_ville: "Unknown practice.",
      missing_profession: "Select your profession.", rate_limited: "Too many requests. Try again in one hour.",
      unknown: "An error occurred. Please try again.",
    },
  },
};

/**
 * Formulaire d'intérêt installation (pattern B, réutilisable).
 * Appelle l'Edge Function `submit-demande-installation` (honeypot,
 * rate-limit, double email transactionnel).
 */
export function FormulaireInteretInstallation({
  professionSlug,
  villeSlug,
  professionLabel,
  villeLabel,
}: Props) {
  const { i18n } = useTranslation();
  const english = (i18n.resolvedLanguage ?? i18n.language).split("-")[0] === "en";
  const text = copy[english ? "en" : "fr"];
  const professionName = (slug: string, label: string) => english
    ? englishProfessions[slug] ?? label
    : label;
  const formRef = useRef<HTMLFormElement>(null);
  const errorPrefix = useId();
  const professionLibre = !professionSlug;
  const villeLibre = !villeSlug;
  const { data: professions = [] } = useProfessions();
  const { data: cabinetsRecus = [] } = useCabinetsInstallation();
  const cabinets = cabinetsRecus.filter((cabinet) => isPublicProjectOffer(cabinet.slug) && isPublicProjectOffer(cabinet.slug_installation));

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
  const autreProfession = professionLibre && selectedProfession === "autre-profession";

  const isValid = useMemo(() => {
    if (!nom.trim() || nom.trim().length < 2) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return false;
    if (!consent) return false;
    if (professionLibre && !selectedProfession) return false;
    return true;
  }, [nom, email, consent, professionLibre, selectedProfession]);

  const errorId = (field: InstallationField) => `${errorPrefix}-${field}`;
  const errorAttributes = (field: InstallationField) => errors[field]
    ? { "aria-invalid": true, "aria-describedby": errorId(field) } as const
    : undefined;
  const fieldError = (field: InstallationField) => errors[field] && (
    <p id={errorId(field)} className="text-sm text-destructive mt-1">
      {text.fields[field]}
    </p>
  );

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    setState("submitting");
    try {
      const villeToSend = villeSlug ?? (selectedVille === "__all__" ? null : selectedVille);

      const { data, error } = await supabase.functions.invoke<{ ok?: boolean; id?: string; error?: string }>(
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
      if (error || !data?.ok) {
        const code = data?.error ?? "unknown";
        setErrors({ form: code });
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
    } catch (err) {
      console.error("[FormulaireInteretInstallation] submit error:", err);
      setErrors({ form: "unknown" });
      setState("error");
    }
  };

  if (!isPublicProjectOffer(villeSlug) || !isPublicProjectOffer(selectedVille)) {
    return <p role="status">{text.unavailable}</p>;
  }

  if (state === "success") {
    return (
      <div role="status" className="bg-secondary rounded-lg p-8 border border-border text-center">
        <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-4">
          {text.sent}
        </p>
        <h3 className="font-heading text-2xl md:text-3xl font-normal text-foreground mb-4">
          {text.success}
        </h3>
        <p className="text-base text-muted-foreground max-w-lg mx-auto">
          {text.reply} <strong className="text-foreground">{text.deadline}</strong>{" "}
          {text.details}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} aria-busy={state === "submitting"} onSubmit={handleSubmit} className="space-y-5" noValidate>
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
        <label htmlFor="website">{text.honeypot}</label>
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
              <span className="text-muted-foreground">{text.profession} : </span>
              <span className="font-medium text-foreground">{professionName(professionSlug ?? "", professionLabel)}</span>
            </p>
          )}
          {villeLabel && (
            <p>
              <span className="text-muted-foreground">{text.practice} : </span>
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
              {text.profession} <span className="text-primary">*</span>
            </Label>
            <Select value={selectedProfession} onValueChange={setSelectedProfession}>
              <SelectTrigger id="profession" {...errorAttributes("profession")} className="mt-1.5">
                <SelectValue placeholder={text.chooseProfession} />
              </SelectTrigger>
              <SelectContent>
                {professions.map((p) => (
                  <SelectItem key={p.id} value={p.slug}>
                    {professionName(p.slug, p.nom_inclusif_pluriel)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError("profession")}
            {autreProfession && (
              <p className="text-xs text-muted-foreground mt-1">
                {text.otherHelp}
              </p>
            )}
          </div>
          {villeLibre && (
            <div>
              <Label htmlFor="ville">{text.preferredPractice}</Label>
              <Select value={selectedVille} onValueChange={setSelectedVille}>
                <SelectTrigger id="ville" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{text.allPractices}</SelectItem>
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
          {text.name} <span className="text-primary">*</span>
        </Label>
        <Input
          id="nom"
          {...errorAttributes("nom")}
          type="text"
          autoComplete="name"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          maxLength={100}
          className="mt-1.5"
          required
        />
        {fieldError("nom")}
      </div>

      <div>
        <Label htmlFor="email">
          {text.email} <span className="text-primary">*</span>
        </Label>
        <Input
          id="email"
          {...errorAttributes("email")}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={255}
          className="mt-1.5"
          required
        />
        {fieldError("email")}
      </div>

      <div>
        <Label htmlFor="telephone">{text.phone}</Label>
        <Input
          id="telephone"
          {...errorAttributes("telephone")}
          type="tel"
          autoComplete="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          maxLength={20}
          className="mt-1.5"
        />
        {fieldError("telephone")}
      </div>

      <div>
        <Label htmlFor="message">
          {text.project} {autreProfession ? <span className="text-primary">*</span> : text.optional}
        </Label>
        <Textarea
          id="message"
          {...errorAttributes("message")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          rows={5}
          aria-required={autreProfession}
          placeholder={text.placeholder}
          className="mt-1.5"
        />
        <p className="text-xs text-muted-foreground mt-1">{message.length} / 2000 {text.characters}</p>
        {fieldError("message")}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          {...errorAttributes("consent")}
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className="mt-0.5"
        />
        <Label htmlFor="consent" className="text-sm font-normal leading-relaxed cursor-pointer">
          {text.consent}{" "}
          <Link to={localePath(english ? "en" : "fr", "privacy")} className="text-primary underline hover:no-underline">
            {text.privacy}
          </Link>
          . <span className="text-primary">*</span>
        </Label>
      </div>
      {fieldError("consent")}

      {errors.form && (
        <div role="alert" className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
          {text.server[errors.form as keyof typeof text.server] ?? text.server.unknown}
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={!isValid || state === "submitting"}
          className="w-full sm:w-auto"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {text.sending}
            </>
          ) : (
            text.send
          )}
        </Button>
      </div>
    </form>
  );
}

export default FormulaireInteretInstallation;