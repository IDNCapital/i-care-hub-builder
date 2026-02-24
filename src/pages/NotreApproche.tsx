import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Heart,
  Target,
  Users,
  Building2,
  HandHeart,
  Lightbulb,
  ArrowRight,
  Search,
  FileSearch,
  Ruler,
  HardHat,
  Settings,
  TrendingUp,
  Shield,
  Quote,
} from "lucide-react";
import neighborhood from "@/assets/neighborhood.jpg";
import healthcareProfessional from "@/assets/healthcare-professional.jpg";
import renovationBeforeAfter from "@/assets/renovation-before-after.jpg";

const values = [
  {
    icon: Heart,
    title: "Responsabilité",
    description: "Nous assumons notre rôle dans l'amélioration de l'accès aux soins pour tous.",
  },
  {
    icon: Target,
    title: "Impact Local",
    description: "Chaque projet renforce le tissu de santé d'un quartier, d'une ville.",
  },
  {
    icon: HandHeart,
    title: "Bienveillance",
    description: "Envers les praticiens, les patients, les riverains et nos partenaires.",
  },
  {
    icon: Lightbulb,
    title: "Exigence",
    description: "La qualité architecturale et technique au service du soin.",
  },
  {
    icon: Users,
    title: "Pragmatisme & Humanité",
    description: "Des solutions concrètes, ancrées dans la réalité des territoires.",
  },
];

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Identification",
    description: "Nous identifions les territoires en tension médicale et les bâtiments à fort potentiel de transformation.",
    details: ["Analyse des besoins de santé locaux", "Cartographie des déserts médicaux", "Sourcing d'opportunités foncières", "Dialogue avec les élus locaux"],
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Diagnostic",
    description: "Nous réalisons une étude approfondie du bâtiment et de son environnement pour valider le potentiel du projet.",
    details: ["Audit technique du bâtiment", "Étude de marché", "Analyse réglementaire", "Faisabilité économique"],
  },
  {
    icon: Ruler,
    number: "03",
    title: "Conception",
    description: "Nos partenaires architectes (Rivage IC et IDNéa) conçoivent des espaces optimisés pour la santé.",
    details: ["Plans fonctionnels métiers", "Parcours patient optimisé", "Accessibilité PMR", "Normes sanitaires"],
  },
  {
    icon: HardHat,
    number: "04",
    title: "Travaux",
    description: "Notre partenaire Inside BAT pilote les travaux de réhabilitation avec exigence et respect des délais.",
    details: ["Maîtrise d'œuvre intégrée", "Suivi qualité permanent", "Respect du patrimoine", "Livraison clé en main"],
  },
  {
    icon: Users,
    number: "05",
    title: "Commercialisation",
    description: "Nous recrutons les professionnels de santé et constituons une équipe pluridisciplinaire équilibrée.",
    details: ["Sourcing ciblé par profession", "Accompagnement installation", "Constitution d'équipe", "Intégration locale"],
  },
  {
    icon: Settings,
    number: "06",
    title: "Installation & Gestion",
    description: "Nous accompagnons l'ouverture et assurons la gestion technique et locative sur le long terme.",
    details: ["Maintenance préventive", "Services mutualisés", "Animation du collectif", "Évolution des espaces"],
  },
];

const partners = [
  { name: "Rivage IC", role: "Architecture & conception", description: "Cabinet d'architecture spécialisé dans les projets de santé et de bien-être." },
  { name: "IDNéa", role: "Ingénierie & design", description: "Bureau d'études techniques pour l'optimisation des espaces de santé." },
  { name: "Inside BAT", role: "Travaux & réalisation", description: "Entreprise générale de bâtiment, experte en réhabilitation de qualité." },
];

const collectiviteBenefits = [
  { icon: Users, title: "Service de santé local", description: "Ramenez des professionnels de santé dans votre commune et améliorez l'accès aux soins pour vos administrés." },
  { icon: Building2, title: "Revalorisation du bâti", description: "Donnez une nouvelle vie à des bâtiments sous-utilisés ou dégradés grâce à une réhabilitation de qualité." },
  { icon: TrendingUp, title: "Emploi & attractivité", description: "Créez de l'emploi local et renforcez l'attractivité de votre territoire pour les habitants et les entreprises." },
  { icon: Shield, title: "Sécurité & pérennité", description: "Bénéficiez d'un opérateur solide qui s'engage sur le long terme dans la gestion et l'animation du lieu." },
];

const milestones = [
  { year: "2022", event: "Création d'I-CA.RE" },
  { year: "2023", event: "Premier projet à Floirac" },
  { year: "2024", event: "Expansion vers Toulouse" },
  { year: "2025", event: "3 centres opérationnels" },
];

export default function NotreApproche() {
  return (
    <Layout>
      <Helmet>
        <title>Notre Approche — Vision et méthode I-CA.RE</title>
        <meta name="description" content="Vision, méthode en 6 étapes et engagement sociétal d'I-CA.RE : rénovation de lieux de santé, lutte contre les déserts médicaux en Nouvelle-Aquitaine et Occitanie." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              Notre Approche
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">
              Vision, méthode et engagement au service de la santé des territoires.
            </p>
            <Button variant="hero" asChild className="mt-8 opacity-0 animate-fade-up stagger-2">
              <Link to="/contact">
                Échanger avec notre équipe
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Founder Vision */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img src={healthcareProfessional} alt="Fondateur d'I-CA.RE présentant la vision de l'entreprise" className="rounded-3xl shadow-elevated w-full" loading="lazy" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Quote className="w-12 h-12 text-primary" />
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium mb-6 leading-relaxed">
                "J'ai créé I-CA.RE avec la conviction que l'accès aux soins est un enjeu fondamental pour nos territoires. En rénovant des lieux de santé, nous créons les conditions d'une médecine de proximité, humaine et de qualité."
              </blockquote>
              <div className="border-l-4 border-primary pl-6">
                <p className="font-semibold text-lg">Fondateur d'I-CA.RE</p>
                <p className="text-muted-foreground">Entrepreneur en immobilier de santé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose & Healthcare Challenges */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              Face aux déserts médicaux, nous agissons
            </h2>
            <p className="text-background/70 text-lg">
              Des chiffres qui nous poussent à agir, au quotidien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { value: "6 millions", label: "de Français sans médecin traitant" },
              { value: "30%", label: "des médecins généralistes partiront à la retraite d'ici 2030" },
              { value: "87%", label: "du territoire classé en zone de tension médicale" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl md:text-6xl font-bold text-primary mb-4">{stat.value}</p>
                <p className="text-background/70">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-4 text-background/80 text-lg leading-relaxed">
            <p>
              En France, des millions de personnes vivent dans des zones où l'accès aux soins est devenu difficile. Les médecins partent à la retraite, les locaux vétustes se vident, les habitants s'éloignent des services de santé.
            </p>
            <p>
              I-CA.RE apporte une réponse concrète : nous identifions les bâtiments à fort potentiel, les transformons en espaces de santé modernes, et y installons des professionnels dans des conditions optimales.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="text-center p-6 bg-background/10 rounded-xl">
                <p className="text-2xl font-bold text-primary">{milestone.year}</p>
                <p className="text-sm text-background/70 mt-2">{milestone.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Nos valeurs</h2>
            <p className="section-subtitle mx-auto">
              Les principes qui guident chacune de nos décisions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method - 6 Steps */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="section-title mb-6">La Méthode I-CA.RE en 6 étapes</h2>
              <p className="text-lg text-muted-foreground">
                Chaque projet I-CA.RE suit une méthodologie éprouvée qui garantit la qualité de réalisation et le succès de l'exploitation. Du sourcing à la gestion, nous maîtrisons l'ensemble de la chaîne de valeur.
              </p>
            </div>
            <div>
              <img src={renovationBeforeAfter} alt="Transformation avant-après d'un local en centre de santé par I-CA.RE" className="rounded-3xl shadow-elevated w-full" loading="lazy" />
            </div>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <span className="text-6xl font-bold text-muted/30">{step.number}</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                </div>
                <div className={`bg-secondary rounded-2xl p-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <h4 className="font-semibold mb-4">Ce que nous faisons :</h4>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              Nos partenaires clés
            </h2>
            <p className="text-background/70 text-lg">
              Nous nous entourons des meilleurs experts pour garantir l'excellence de nos réalisations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div key={partner.name} className="bg-background/10 backdrop-blur rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-semibold mb-2">{partner.name}</h3>
                <p className="text-primary font-medium mb-4">{partner.role}</p>
                <p className="text-background/70">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Une équipe pluridisciplinaire</h2>
            <p className="section-subtitle mx-auto">
              Des expertises complémentaires au service d'une même mission.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: "Direction & stratégie", desc: "Vision, développement, partenariats" },
              { role: "Architecture & conception", desc: "Design, ergonomie, conformité" },
              { role: "Travaux & technique", desc: "Réhabilitation, qualité, délais" },
              { role: "Commercial & gestion", desc: "Praticiens, exploitation, services" },
            ].map((member) => (
              <div key={member.role} className="bg-background rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{member.role}</h3>
                <p className="text-sm text-muted-foreground">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collectivités Section */}
      <section id="collectivites" className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <span className="text-primary font-medium mb-4 block">Pour les collectivités</span>
              <h2 className="section-title mb-6">Luttez contre la désertification médicale</h2>
              <p className="text-lg text-muted-foreground mb-8">
                I-CA.RE accompagne les collectivités dans la création de centres de santé attractifs pour les professionnels et accessibles pour les habitants.
              </p>
              <Button asChild>
                <Link to="/contact">
                  Organiser un rendez-vous institutionnel
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div>
              <img src={neighborhood} alt="Quartier résidentiel bénéficiant d'un centre de santé I-CA.RE" className="rounded-3xl shadow-elevated w-full" loading="lazy" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {collectiviteBenefits.map((benefit) => (
              <div key={benefit.title} className="card-premium text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-5">
                  <benefit.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Case Study */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-medium">Exemple de réalisation</span>
              <h3 className="text-2xl md:text-3xl font-semibold mt-2">Floirac : un centre de santé exemplaire</h3>
            </div>
            <div className="bg-secondary rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold mb-2">Le contexte</h4>
                  <p className="text-muted-foreground">
                    Commune de 17 000 habitants en périphérie de Bordeaux, Floirac faisait face à un manque criant de professionnels de santé.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">La solution I-CA.RE</h4>
                  <p className="text-muted-foreground">
                    Réhabilitation d'un ancien local commercial de 800m² en pôle de santé pluridisciplinaire, avec 8 cabinets et accessibilité PMR complète.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "8", label: "cabinets" },
                  { value: "12", label: "praticiens" },
                  { value: "800m²", label: "de surface" },
                  { value: "2025", label: "ouverture" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-background rounded-xl">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Envie de contribuer à cette vision ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Que vous soyez professionnel de santé, élu local ou investisseur, rejoignez-nous dans cette mission.
            </p>
            <Button variant="hero" asChild>
              <Link to="/contact">
                Nous contacter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
