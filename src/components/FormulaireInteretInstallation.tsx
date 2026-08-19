import { useMemo, useState } from "react";
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
import { useProfessions, useCabinetsPipeline } from "@/hooks/useInstallation";
import { cabinetNomCourt } from "@/lib/installation";
import { Analytics } from "@/lib/analytics";

interface Props {
  professionSlug?: string;
  villeSlug?: string;
  professionLabel?: string;
  villeLabel?: string;
}

type State = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"nom" | "email" | "telephone" | "consent" | "profession" | "form", string>>;

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
  const modeSelects = !professionSlug;
  const { data: professions = [] } = useProfessions();
  const { data: cabinets = [] } = useCabinetsPipeline();

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

  const isValid = useMemo(() => {
    if (!nom.trim() || nom.trim().length < 2) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return false;
    if (!consent) return false;
    if (modeSelects && !selectedProfession) return false;
    return true;
  }, [nom, email, consent, modeSelects, selectedProfession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {};
    if (nom.trim().length < 2) next.nom = "Merci d'indiquer votre nom (2 caractères minimum).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Adresse email invalide.";
    if (telephone.trim() && !/^[+\d\s.\-()]{6,20}$/.test(telephone.trim())) {
      next.telephone = "Numéro de téléphone invalide.";
    }
    if (!consent) next.consent = "Le consentement est obligatoire.";
    if (modeSelects && !selectedProfession) next.profession = "Merci de choisir votre profession.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setState("submitting");
    try {
      const villeToSend = modeSelects
        ? (selectedVille === "__all__" ? null : selectedVille)
        : (villeSlug ?? null);

      const { data, error } = await supabase.functions.invoke<{ ok?: boolean; id?: string; error?: string }>(
        "submit-demande-installation",
        {
          body: {
            profession_slug: modeSelects ? selectedProfession : professionSlug,
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
      setErrors({ form: "Une erreur est survenue. Merci de réessayer." });
      setState("error");
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
          Notre équipe revient vers vous <strong className="text-foreground">sous 48h ouvrées</strong>{" "}
          avec les informations détaillées sur les espaces disponibles et les conditions d'installation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
      {!modeSelects && (professionLabel || villeLabel) && (
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
      {modeSelects && (
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
          </div>
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
        <Label htmlFor="message">Votre projet d'installation (facultatif)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          rows={5}
          placeholder="Précisez votre calendrier envisagé, votre mode d'exercice actuel, vos besoins particuliers (surface, équipements, temps partagé)…"
          className="mt-1.5"
        />
        <p className="text-xs text-muted-foreground mt-1">{message.length} / 2000 caractères</p>
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
          <Link to="/confidentialite" className="text-primary underline hover:no-underline">
            politique de confidentialité
          </Link>
          . <span className="text-primary">*</span>
        </Label>
      </div>
      {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}

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
          disabled={!isValid || state === "submitting"}
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