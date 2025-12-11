import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Quote } from "lucide-react";
import healthcareProfessional from "@/assets/healthcare-professional.jpg";

const values = [
  {
    title: "Impact local",
    description: "Nous croyons que la santé se construit au plus près des habitants. Chaque projet renforce le tissu de santé d'un territoire.",
  },
  {
    title: "Excellence architecturale",
    description: "La qualité des espaces influence directement la qualité des soins. Nous ne faisons aucun compromis sur la conception.",
  },
  {
    title: "Engagement long terme",
    description: "Nous ne sommes pas des promoteurs. Nous restons impliqués dans la gestion et l'animation de nos centres sur la durée.",
  },
  {
    title: "Partenariat sincère",
    description: "Avec les praticiens, les élus, les investisseurs : nous construisons des relations de confiance durables.",
  },
];

const milestones = [
  { year: "2022", event: "Création d'I-CA.RE" },
  { year: "2023", event: "Premier projet à Floirac" },
  { year: "2024", event: "Expansion vers Toulouse" },
  { year: "2025", event: "3 centres opérationnels" },
];

export default function APropos() {
  return (
    <Layout>
      <Helmet>
        <title>À Propos — I-CA.RE</title>
        <meta name="description" content="Découvrez l'histoire, l'équipe et les valeurs d'I-CA.RE, spécialiste de la rénovation de lieux de santé." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              À Propos d'I-CA.RE
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">
              Une équipe engagée pour rapprocher la santé des territoires.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Vision */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src={healthcareProfessional}
                alt="Équipe I-CA.RE"
                className="rounded-3xl shadow-elevated w-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Quote className="w-12 h-12 text-primary" />
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium mb-6 leading-relaxed">
                "J'ai créé I-CA.RE avec la conviction que l'accès aux soins est un enjeu fondamental pour nos territoires. En rénovant des lieux de santé, nous ne construisons pas des murs : nous créons les conditions d'une médecine de proximité, humaine et de qualité."
              </blockquote>
              <div className="border-l-4 border-primary pl-6">
                <p className="font-semibold text-lg">Fondateur d'I-CA.RE</p>
                <p className="text-muted-foreground">Entrepreneur en immobilier de santé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              Notre histoire
            </h2>
            <p className="text-background/70 text-lg">
              De l'observation d'un problème territorial à la création d'une solution concrète.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8 text-background/80 text-lg leading-relaxed">
              <p>
                Tout a commencé par un constat simple : dans de nombreuses communes françaises, les médecins partent à la retraite sans être remplacés, les locaux se vident, et les habitants se retrouvent éloignés des soins.
              </p>
              <p>
                Face à ce défi, nous avons développé une approche originale : plutôt que de construire du neuf, nous réhabilitons des bâtiments existants pour créer des lieux de santé modernes, confortables pour les praticiens et accessibles aux patients.
              </p>
              <p>
                Notre conviction : des locaux de qualité attirent les meilleurs professionnels, qui à leur tour offrent les meilleurs soins aux habitants. C'est un cercle vertueux au service des territoires.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="text-center p-6 bg-background/10 rounded-xl">
                  <p className="text-2xl font-bold text-primary">{milestone.year}</p>
                  <p className="text-sm text-background/70 mt-2">{milestone.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Ce qui nous guide</h2>
            <p className="section-subtitle mx-auto">
              Les principes qui orientent chacune de nos décisions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="card-premium">
                <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground text-lg">{value.description}</p>
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

      {/* CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Envie d'en savoir plus ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Rencontrons-nous pour échanger sur notre approche et vos projets.
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
