import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  Phone,
  Building2,
  Landmark,
  Search,
  HandshakeIcon,
  ArrowRight,
} from "lucide-react";
import heroBuilding from "@/assets/hero-building.jpg";

const modelSteps = [
  {
    number: "01",
    title: "Acquisition",
    description:
      "Identification et sécurisation de rez-de-chaussée urbains sous-valorisés (commerces vacants, locaux obsolètes) dans des zones à forte demande de santé.",
  },
  {
    number: "02",
    title: "Requalification",
    description:
      "Transformation en 7 à 10 cabinets de santé et bien-être (12–18 m² chacun). Conception optimisée pour la confidentialité, la performance acoustique et le confort.",
  },
  {
    number: "03",
    title: "Stabilisation",
    description:
      "Commercialisation ciblée auprès des professionnels de santé. Remplissage locatif en 24 à 36 mois. Structure multi-locataires granulaire réduisant le risque de vacance.",
  },
  {
    number: "04",
    title: "Cession",
    description:
      "Revente de l'actif stabilisé après 4 ans. Le sponsor pilote la stratégie de sortie en coordination avec l'investisseur.",
  },
];

const partnerEncarts = [
  {
    icon: Landmark,
    title: "Banques & établissements de crédit",
    description:
      "Financement d'opérations structurées, dossiers complets, sponsor-led. Chaque projet fait l'objet d'un montage avec dette senior (~60 % LTV) au niveau de l'actif.",
    cta: "Discuter d'un financement",
  },
  {
    icon: Search,
    title: "Agents immobiliers & apporteurs",
    description:
      "Nous recherchons en permanence des rez-de-chaussée de 150 à 200 m², sous-valorisés, en zone urbaine dense. Rémunération d'apport d'affaires structurée.",
    cta: "Proposer un bien",
  },
  {
    icon: HandshakeIcon,
    title: "Bailleurs & propriétaires",
    description:
      "Revalorisation de votre actif par une requalification complète et une commercialisation multi-locataires. Vous conservez ou cédez un bien performant.",
    cta: "Revaloriser mon actif",
  },
];

export default function Investissement() {
  return (
    <Layout>
      <Helmet>
        <title>Investissement immobilier de santé — I-CA.RE</title>
        <meta
          name="description"
          content="I-CA.RE transforme des rez-de-chaussée urbains en espaces de santé : 150–200 m², 7–10 cabinets, stabilisation en 24–36 mois. Recevez notre note d'investissement."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <img
            src={heroBuilding}
            alt="Espace de santé I-CA.RE en cours de transformation"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/30" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 border border-background/20 text-background/70 text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6 opacity-0 animate-fade-up">
              Investissement immobilier de santé
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-background leading-tight mb-6 opacity-0 animate-fade-up stagger-1">
              Investir dans la santé de proximité
            </h1>
            <p className="text-xl md:text-2xl text-background/70 leading-relaxed mb-10 opacity-0 animate-fade-up stagger-2">
              Des actifs immobiliers tangibles, à forte valeur d'usage, portés par une demande structurelle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-3">
              <Button
                variant="hero"
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/investissement/interet">
                  <FileText className="mr-2 h-5 w-5" />
                  Recevoir la note d'investissement
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-background/30 text-background hover:bg-background hover:text-foreground"
              >
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Planifier un échange confidentiel
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Le concept */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6">Le concept I-CA.RE</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              I-CA.RE acquiert des rez-de-chaussée urbains sous-valorisés (150 à 200 m²) et les transforme en espaces de santé et de bien-être nouvelle génération.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Chaque actif accueille 7 à 10 cabinets indépendants (12–18 m²), conçus pour la confidentialité, la performance acoustique et le confort. La structure multi-locataires granulaire réduit structurellement le risque de vacance.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "150–200 m²", label: "surface par actif (RDC)" },
              { value: "7–10", label: "cabinets par opération" },
              { value: "12–18 m²", label: "par cabinet" },
              { value: "24–36 mois", label: "de stabilisation" },
            ].map((metric) => (
              <div key={metric.label} className="text-center bg-card rounded-xl border border-border p-6">
                <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modèle d'exécution */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-6 text-background">
              Modèle d'exécution
            </h2>
            <p className="text-background/70 text-lg">
              Une chaîne de valeur intégrée, de l'acquisition à la cession.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {modelSteps.map((step) => (
                <div
                  key={step.number}
                  className="relative bg-background/8 border border-background/15 rounded-xl p-8"
                >
                  <span className="text-5xl font-heading font-bold text-primary/40 absolute top-6 right-8">
                    {step.number}
                  </span>
                  <h3 className="text-2xl font-heading font-semibold mb-4 text-background pr-16">
                    {step.title}
                  </h3>
                  <p className="text-background/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pour les investisseurs (teaser) */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title mb-6">Pour les investisseurs</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              I-CA.RE structure des opérations immobilières de santé avec un modèle entrepreneurial sponsor-led. L'investisseur apporte 100 % de l'equity, I-CA.RE apporte 100 % de l'industrie : développement, ingénierie, construction, commercialisation, asset management et stratégie de sortie.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Notre note d'investissement détaille le modèle financier, la structure de distribution (waterfall), la gouvernance et la feuille de route.
            </p>
            <Button variant="hero" asChild>
              <Link to="/investissement/interet">
                <FileText className="mr-2 h-5 w-5" />
                Recevoir la note d'investissement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Accès confidentiel après dépôt d'un formulaire court. Aucun engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-title mb-6">Vous êtes un partenaire ?</h2>
            <p className="text-muted-foreground text-lg">
              Banques, agents immobiliers, bailleurs : nous recherchons des partenaires alignés avec notre modèle.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {partnerEncarts.map((partner) => (
              <div
                key={partner.title}
                className="bg-background border border-border rounded-xl p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-6">
                  <partner.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3">{partner.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {partner.description}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contact">
                    {partner.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              Échangeons sur vos objectifs
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Recevez notre note d'investissement détaillée ou planifiez un
              entretien confidentiel avec notre équipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to="/investissement/interet">
                  <FileText className="mr-2 h-5 w-5" />
                  Recevoir la note d'investissement
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Planifier un échange confidentiel
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Confidentialité garantie. Aucun engagement.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
