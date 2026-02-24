import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Shield,
  Building2,
  Headphones,
  Search,
  MapPin,
  HardHat,
  Key,
  Quote,
  Star,
  CheckCircle2,
} from "lucide-react";
import medicalOffice from "@/assets/medical-office.jpg";

const pillars = [
  {
    icon: Shield,
    title: "Sécurité réglementaire",
    description:
      "Conformité ERP, accessibilité PMR, normes incendie et sanitaires : chaque cabinet est livré aux normes en vigueur. Zéro risque, zéro mauvaise surprise.",
    features: [
      "Conformité ERP & PMR",
      "Normes incendie validées",
      "Diagnostics complets fournis",
    ],
  },
  {
    icon: Building2,
    title: "Confort architectural",
    description:
      "Lumière naturelle, isolation acoustique, matériaux nobles et ergonomie pensée pour votre pratique quotidienne. Un lieu où il fait bon exercer.",
    features: [
      "Isolation acoustique renforcée",
      "Lumière naturelle optimisée",
      "Matériaux premium durables",
    ],
  },
  {
    icon: Headphones,
    title: "Accompagnement administratif",
    description:
      "De la signature du bail à l'ouverture, nous gérons les démarches : assurances, raccordements, signalétique, maintenance. Vous vous concentrez sur vos patients.",
    features: [
      "Bail simplifié clé en main",
      "Maintenance incluse",
      "Interlocuteur dédié",
    ],
  },
];

const processSteps = [
  {
    icon: Search,
    number: "01",
    title: "Analyse du besoin",
    description:
      "Nous échangeons sur votre spécialité, vos contraintes et vos attentes pour identifier le lieu idéal.",
  },
  {
    icon: MapPin,
    number: "02",
    title: "Proposition d'implantation",
    description:
      "Nous vous présentons les espaces disponibles ou à venir, adaptés à votre pratique et à votre zone géographique.",
  },
  {
    icon: HardHat,
    number: "03",
    title: "Aménagement & conformité",
    description:
      "Nous pilotons l'aménagement de votre cabinet selon vos besoins, dans le respect des normes sanitaires et d'accessibilité.",
  },
  {
    icon: Key,
    number: "04",
    title: "Installation",
    description:
      "Remise des clés, accompagnement opérationnel et suivi post-installation. Vous exercez sereinement dès le premier jour.",
  },
];

const testimonials = [
  {
    quote:
      "J'ai trouvé en I-CA.RE un partenaire qui comprend les réalités de mon métier. Mon cabinet est lumineux, fonctionnel et mes patients le remarquent.",
    name: "Dr. Marie L.",
    role: "Médecin généraliste",
    location: "Floirac",
    rating: 5,
  },
  {
    quote:
      "L'accompagnement administratif m'a fait gagner un temps précieux. Je me suis concentrée sur mon installation clinique, I-CA.RE a géré le reste.",
    name: "Sophie D.",
    role: "Kinésithérapeute",
    location: "Bordeaux Bastide",
    rating: 5,
  },
  {
    quote:
      "L'isolation acoustique est exceptionnelle. Mes patients se sentent en confiance dès qu'ils entrent dans le cabinet. C'est exactement ce que je cherchais.",
    name: "Thomas R.",
    role: "Psychologue",
    location: "Bordeaux Bastide",
    rating: 5,
  },
];

export default function Professionnels() {
  const [formData, setFormData] = useState({
    profession: "",
    ville: "",
    dateInstallation: "",
    surface: "",
    message: "",
  });
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rgpdConsent) {
      toast.error("Veuillez accepter la politique de confidentialité.");
      return;
    }
    if (!formData.profession || !formData.ville) {
      toast.error("Veuillez remplir les champs obligatoires.");
      return;
    }
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      toast.success(
        "Votre demande a été envoyée avec succès ! Notre équipe vous recontactera sous 48h."
      );
      setFormData({
        profession: "",
        ville: "",
        dateInstallation: "",
        surface: "",
        message: "",
      });
      setRgpdConsent(false);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <Layout>
      <Helmet>
        <title>Professionnels de Santé — Rejoindre I-CA.RE</title>
        <meta
          name="description"
          content="Installez votre cabinet dans un lieu de soin pensé pour durer. Espaces clé en main, conformes et adaptés à votre pratique. Rejoignez I-CA.RE."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <img
            src={medicalOffice}
            alt="Cabinet médical lumineux et moderne aménagé par I-CA.RE"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/40" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-foreground text-sm font-medium rounded-full mb-6 opacity-0 animate-fade-up">
              Pour les professionnels de santé
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 opacity-0 animate-fade-up stagger-1">
              Installez votre activité dans un lieu de soin pensé pour durer
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 opacity-0 animate-fade-up stagger-2">
              Des espaces clé en main, conformes, lumineux et adaptés à votre
              pratique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-3">
              <Button variant="hero" asChild>
                <Link to="/projets">
                  Voir les disponibilités
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <a href="#candidature">Planifier un échange</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-6 bg-foreground text-background">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-center">
            <div>
              <span className="text-3xl font-bold text-primary">+50</span>
              <p className="text-sm text-background/70">praticiens installés</p>
            </div>
            <div className="w-px h-10 bg-background/20 hidden sm:block" />
            <div>
              <span className="text-3xl font-bold text-primary">3</span>
              <p className="text-sm text-background/70">centres opérationnels</p>
            </div>
            <div className="w-px h-10 bg-background/20 hidden sm:block" />
            <div>
              <span className="text-3xl font-bold text-primary">98%</span>
              <p className="text-sm text-background/70">taux de satisfaction</p>
            </div>
            <div className="w-px h-10 bg-background/20 hidden sm:block" />
            <div>
              <span className="text-3xl font-bold text-primary">48h</span>
              <p className="text-sm text-background/70">délai de réponse</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">
              Pourquoi les professionnels choisissent I-CA.RE
            </h2>
            <p className="section-subtitle mx-auto">
              Trois piliers pour exercer en toute sérénité.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="card-premium group hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                  <pillar.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{pillar.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {pillar.description}
                </p>
                <ul className="space-y-3">
                  {pillar.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">
              De votre projet à votre installation
            </h2>
            <p className="section-subtitle mx-auto">
              Un parcours balisé, un interlocuteur unique.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-0.5 bg-border" />

              {processSteps.map((step) => (
                <div key={step.number} className="relative text-center">
                  <div className="w-[104px] h-[104px] rounded-full bg-background border-4 border-primary flex flex-col items-center justify-center mx-auto mb-6 relative z-10">
                    <step.icon className="w-8 h-8 text-primary mb-1" />
                    <span className="text-xs font-bold text-primary">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Ils exercent chez I-CA.RE</h2>
            <p className="section-subtitle mx-auto">
              Des professionnels qui ont fait le choix de la qualité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-secondary rounded-3xl p-8 relative"
              >
                <Quote className="w-10 h-10 text-primary/30 absolute top-6 right-6" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} — {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segmented Form */}
      <section id="candidature" className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Trouvez votre futur cabinet
              </h2>
              <p className="text-background/70 text-lg">
                Décrivez votre projet en quelques clics. Notre équipe vous
                recontacte sous 48h avec une proposition personnalisée.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Field 1: Profession */}
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-background">
                  Type de professionnel *
                </Label>
                <select
                  id="profession"
                  value={formData.profession}
                  onChange={(e) =>
                    setFormData({ ...formData, profession: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-xl border border-background/20 bg-background/10 text-background text-base"
                  required
                >
                  <option value="">Sélectionnez votre profession</option>
                  <option value="medecin_generaliste">
                    Médecin généraliste
                  </option>
                  <option value="medecin_specialiste">
                    Médecin spécialiste
                  </option>
                  <option value="infirmier">Infirmier(ère)</option>
                  <option value="kinesitherapeute">Kinésithérapeute</option>
                  <option value="osteopathe">Ostéopathe</option>
                  <option value="psychologue">Psychologue</option>
                  <option value="orthophoniste">Orthophoniste</option>
                  <option value="sage_femme">Sage-femme</option>
                  <option value="dentiste">Chirurgien-dentiste</option>
                  <option value="autre">Autre profession de santé</option>
                </select>
              </div>

              {/* Field 2: Ville */}
              <div className="space-y-2">
                <Label htmlFor="ville" className="text-background">
                  Ville recherchée *
                </Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) =>
                    setFormData({ ...formData, ville: e.target.value })
                  }
                  placeholder="Ex : Bordeaux, Toulouse, Floirac…"
                  className="h-12 bg-background/10 border-background/20 text-background placeholder:text-background/40"
                  required
                  maxLength={100}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Field 3: Date souhaitée */}
                <div className="space-y-2">
                  <Label htmlFor="dateInstallation" className="text-background">
                    Date souhaitée d'installation
                  </Label>
                  <select
                    id="dateInstallation"
                    value={formData.dateInstallation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateInstallation: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 rounded-xl border border-background/20 bg-background/10 text-background text-base"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="immediat">Dès que possible</option>
                    <option value="3mois">Dans les 3 prochains mois</option>
                    <option value="6mois">Dans les 6 prochains mois</option>
                    <option value="1an">Dans l'année</option>
                    <option value="plus">Plus d'un an</option>
                  </select>
                </div>

                {/* Field 4: Surface */}
                <div className="space-y-2">
                  <Label htmlFor="surface" className="text-background">
                    Surface approximative (m²)
                  </Label>
                  <select
                    id="surface"
                    value={formData.surface}
                    onChange={(e) =>
                      setFormData({ ...formData, surface: e.target.value })
                    }
                    className="w-full h-12 px-4 rounded-xl border border-background/20 bg-background/10 text-background text-base"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="15-20">15 – 20 m²</option>
                    <option value="20-30">20 – 30 m²</option>
                    <option value="30-50">30 – 50 m²</option>
                    <option value="50-80">50 – 80 m²</option>
                    <option value="80+">Plus de 80 m²</option>
                  </select>
                </div>
              </div>

              {/* Field 5: Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-background">
                  Message (optionnel)
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Précisez vos besoins : équipements, contraintes, questions…"
                  rows={4}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/40"
                  maxLength={1000}
                />
              </div>

              {/* RGPD Consent */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="rgpd"
                  checked={rgpdConsent}
                  onCheckedChange={(checked) =>
                    setRgpdConsent(checked === true)
                  }
                  className="mt-1 border-background/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor="rgpd"
                  className="text-background/70 text-sm leading-relaxed cursor-pointer"
                >
                  J'accepte que mes données soient traitées par I-CA.RE dans le
                  cadre de ma demande, conformément à la{" "}
                  <Link
                    to="/confidentialite"
                    className="underline hover:text-background"
                  >
                    politique de confidentialité
                  </Link>
                  . *
                </Label>
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours…" : "Envoyer ma demande"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-background/50 text-xs text-center">
                Réponse garantie sous 48h ouvrées. Vos données ne sont jamais
                partagées.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Prêt à exercer dans un cadre d'exception ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Découvrez nos espaces disponibles ou échangez directement avec
              notre équipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to="/projets">
                  Voir les disponibilités
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
