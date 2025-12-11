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
  CheckCircle2,
} from "lucide-react";
import neighborhood from "@/assets/neighborhood.jpg";

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

const timeline = [
  {
    step: "01",
    title: "Identifier les besoins",
    description: "Analyse des territoires en tension, dialogue avec les élus et les professionnels de santé.",
  },
  {
    step: "02",
    title: "Concevoir des espaces adaptés",
    description: "Architecture pensée pour le parcours patient et le confort des praticiens.",
  },
  {
    step: "03",
    title: "Rénover avec excellence",
    description: "Travaux de qualité, dans le respect du patrimoine et des délais.",
  },
  {
    step: "04",
    title: "Accompagner l'installation",
    description: "De la recherche de praticiens à l'ouverture du centre, un suivi complet.",
  },
  {
    step: "05",
    title: "Gérer dans la durée",
    description: "Maintenance, services mutualisés, évolution selon les besoins.",
  },
];

export default function Vision() {
  return (
    <Layout>
      <Helmet>
        <title>Notre Vision — I-CA.RE</title>
        <meta name="description" content="Découvrez la vision et l'engagement sociétal d'I-CA.RE : rendre la santé accessible, moderne et proche de chacun." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              Notre Vision & Engagement Sociétal
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">
              Rendre la santé accessible, moderne et proche de chacun.
            </p>
          </div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-medium mb-4 block">Notre raison d'être</span>
              <h2 className="section-title mb-6">
                Face aux déserts médicaux, nous agissons
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  En France, des millions de personnes vivent dans des zones où l'accès aux soins est devenu difficile. Les médecins partent à la retraite, les locaux vétustes se vident, les habitants s'éloignent des services de santé.
                </p>
                <p>
                  I-CA.RE apporte une réponse concrète : nous identifions les bâtiments à fort potentiel, les transformons en espaces de santé modernes, et y installons des professionnels dans des conditions optimales.
                </p>
                <p>
                  Notre approche est à la fois architecturale et humaine. Nous ne construisons pas des murs, nous créons des lieux de vie au service de la santé des territoires.
                </p>
              </div>
            </div>
            <div>
              <img
                src={neighborhood}
                alt="Quartier avec pharmacie et services de santé"
                className="rounded-3xl shadow-elevated w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              Les défis de la santé en France
            </h2>
            <p className="text-background/70 text-lg">
              Des chiffres qui nous poussent à agir, au quotidien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* Our Response */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Notre réponse : l'architecture au service du soin</h2>
            <p className="section-subtitle mx-auto">
              Des lieux pensés pour accueillir, soigner et rassurer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "Réhabilitation intelligente",
                description: "Nous redonnons vie à des bâtiments existants, en respectant le patrimoine tout en apportant les standards modernes.",
              },
              {
                icon: Users,
                title: "Conception centrée usagers",
                description: "Chaque espace est pensé pour le parcours patient et le confort quotidien des professionnels de santé.",
              },
              {
                icon: Heart,
                title: "Impact territorial durable",
                description: "Nos projets créent de l'emploi local, renforcent l'attractivité des quartiers et améliorent la qualité de vie.",
              },
            ].map((item) => (
              <div key={item.title} className="card-premium">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
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

      {/* Timeline */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Comment nous agissons concrètement</h2>
            <p className="section-subtitle mx-auto">
              Une méthode éprouvée, de l'identification du besoin à l'installation des praticiens.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.step} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {item.step}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-4" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to="/contact">
                  Nous contacter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
