import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Analytics } from "@/lib/analytics";
import { FileText, ArrowLeft } from "lucide-react";

const PROFILE_OPTIONS = [
  { value: "family_office", label: "Family office" },
  { value: "investisseur_prive", label: "Investisseur privé" },
  { value: "cgp", label: "CGP / Conseiller en gestion de patrimoine" },
  { value: "banque", label: "Banque / Établissement de crédit" },
  { value: "autre", label: "Autre" },
];

const TICKET_OPTIONS = [
  { value: "<100k", label: "Moins de 100 000 €" },
  { value: "100-250k", label: "100 000 – 250 000 €" },
  { value: "250-500k", label: "250 000 – 500 000 €" },
  { value: "500k-1M", label: "500 000 – 1 000 000 €" },
  { value: ">1M", label: "Plus de 1 000 000 €" },
];

export default function InvestisseurInteret() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileType: "",
    ticketRange: "",
    areaInterest: "",
    message: "",
  });
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      toast.error("Veuillez accepter la politique de confidentialité.");
      return;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.profileType || !formData.ticketRange) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Veuillez saisir une adresse email valide.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("investor_leads").insert({
        first_name: formData.firstName.trim().slice(0, 100),
        last_name: formData.lastName.trim().slice(0, 100),
        email: formData.email.trim().toLowerCase().slice(0, 255),
        phone: formData.phone.trim().slice(0, 30) || null,
        profile_type: formData.profileType,
        ticket_range: formData.ticketRange,
        area_interest: formData.areaInterest.trim().slice(0, 200) || null,
        message: formData.message.trim().slice(0, 2000) || null,
        consent: true,
        consent_at: new Date().toISOString(),
        source_page: "/investissement",
      });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint on email — still grant access
          toast.success("Vous avez déjà manifesté votre intérêt. Accès au mémorandum accordé.");
        } else {
          throw error;
        }
      } else {
        toast.success("Votre demande a été enregistrée. Bienvenue dans l'espace investisseurs.");
      }

      Analytics.formSubmission("investor_interest", "/investissement/interet");
      sessionStorage.setItem("icare_investor_access", "granted");
      navigate("/investissement/memo");
    } catch (err) {
      console.error("Investor lead submission error:", err);
      toast.error("Une erreur est survenue. Veuillez réessayer ou nous contacter directement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <Helmet>
        <title>Manifester mon intérêt — Investissement I-CA.RE</title>
        <meta
          name="description"
          content="Remplissez un formulaire court pour recevoir la note d'investissement I-CA.RE et accéder aux informations détaillées de notre modèle financier."
        />
      </Helmet>

      <section className="pt-32 pb-8">
        <div className="container">
          <Link
            to="/investissement"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la page Investissement
          </Link>
        </div>
      </section>

      <section className="pb-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Manifester mon intérêt
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Remplissez ce formulaire court pour accéder à notre note d'investissement et aux informations détaillées du modèle I-CA.RE.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Votre prénom"
                    required
                    maxLength={100}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Votre nom"
                    required
                    maxLength={100}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="votre@email.com"
                    required
                    maxLength={255}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Téléphone <span className="text-muted-foreground text-xs">(recommandé)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+33 6 00 00 00 00"
                    maxLength={30}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profileType">Profil *</Label>
                  <select
                    id="profileType"
                    value={formData.profileType}
                    onChange={(e) => updateField("profileType", e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm"
                  >
                    <option value="">Sélectionnez votre profil</option>
                    {PROFILE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketRange">Ticket envisagé *</Label>
                  <select
                    id="ticketRange"
                    value={formData.ticketRange}
                    onChange={(e) => updateField("ticketRange", e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm"
                  >
                    <option value="">Sélectionnez un montant</option>
                    {TICKET_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaInterest">
                  Ville / zone d'intérêt <span className="text-muted-foreground text-xs">(optionnel)</span>
                </Label>
                <Input
                  id="areaInterest"
                  value={formData.areaInterest}
                  onChange={(e) => updateField("areaInterest", e.target.value)}
                  placeholder="Ex : Bordeaux, Toulouse, Bayonne…"
                  maxLength={200}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  Message <span className="text-muted-foreground text-xs">(optionnel)</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Précisez votre projet ou vos questions…"
                  maxLength={2000}
                  rows={4}
                />
              </div>

              {/* RGPD */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked === true)}
                    className="mt-1"
                  />
                  <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                    J'accepte d'être recontacté par I-CA.RE et que mes données soient traitées conformément à la{" "}
                    <Link to="/confidentialite" className="text-primary underline" target="_blank">
                      Politique de confidentialité
                    </Link>
                    . *
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Finalité : recontact et envoi de la note d'investissement. Vos données sont conservées pendant 3 ans à compter de votre dernier contact. Vous disposez d'un droit d'accès, de rectification et de suppression en écrivant à contact@i-ca.re.
                </p>
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours…" : "Accéder à la note d'investissement"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
