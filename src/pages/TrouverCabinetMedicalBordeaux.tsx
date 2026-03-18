import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { Link } from "react-router-dom";
import { BrandName } from "@/components/BrandName";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TrouverCabinetMedicalBordeaux() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const title =
    lang === "fr"
      ? "Comment trouver un cabinet médical ou paramédical à Bordeaux"
      : "How to find a medical or paramedical office in Bordeaux";

  const metaDesc =
    lang === "fr"
      ? "Guide complet pour trouver un cabinet médical ou paramédical à Bordeaux : critères de choix, erreurs à éviter, avantages des lieux mutualisés et accompagnement I‑CA.RE."
      : "Complete guide to finding a medical or paramedical office in Bordeaux: selection criteria, mistakes to avoid, benefits of shared spaces and I‑CA.RE support.";

  const faqItems =
    lang === "fr"
      ? [
          {
            q: "Quelle surface minimale pour un cabinet médical ?",
            a: "En pratique, une surface de 12 à 15 m² est souvent suffisante pour de nombreuses professions, à condition d'avoir accès à des espaces communs.",
          },
          {
            q: "Peut-on transformer un local commercial en cabinet ?",
            a: "Oui, mais cela nécessite de vérifier les règles d'urbanisme, la destination du local et les normes ERP.",
          },
          {
            q: "Quel budget prévoir pour s'installer ?",
            a: "Le budget dépend fortement du type de local et de son état, mais il faut généralement anticiper un coût global intégrant travaux et aménagement.",
          },
          {
            q: "Est-il préférable de s'installer seul ou en collectif ?",
            a: "Les deux options existent, mais les lieux mutualisés offrent souvent un meilleur équilibre entre coût, confort et développement d'activité.",
          },
        ]
      : [
          {
            q: "What is the minimum surface area for a medical office?",
            a: "In practice, 12 to 15 sqm is often sufficient for many professions, provided there is access to shared common areas.",
          },
          {
            q: "Can a commercial space be converted into a medical office?",
            a: "Yes, but you need to check planning regulations, the premises' designated use, and ERP accessibility standards.",
          },
          {
            q: "What budget should you plan for?",
            a: "The budget depends heavily on the type of premises and their condition, but you should generally anticipate an overall cost including renovation and fit-out.",
          },
          {
            q: "Is it better to set up alone or in a shared space?",
            a: "Both options exist, but shared spaces often offer a better balance between cost, comfort and business development.",
          },
        ];

  return (
    <Layout>
      <SeoHead
        title={`${title} | I‑CA.RE`}
        description={metaDesc}
        path={
          lang === "fr"
            ? "/trouver-cabinet-medical-bordeaux"
            : "/en/finding-medical-office-bordeaux"
        }
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-primary/15 text-primary text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6">
              {lang === "fr" ? "Guide praticien" : "Practitioner guide"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 opacity-0 animate-fade-up">
              {title}
            </h1>
          </div>
        </div>
      </section>

      <article className="section-padding">
        <div className="container max-w-3xl">
          {/* Intro */}
          <div className="prose-section mb-16">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {lang === "fr"
                ? "Trouver un cabinet médical à Bordeaux peut rapidement devenir complexe, entre la rareté de certaines surfaces, les contraintes réglementaires et la nécessité de s'implanter dans un secteur cohérent avec sa patientèle."
                : "Finding a medical office in Bordeaux can quickly become complex, between the scarcity of suitable spaces, regulatory constraints and the need to set up in an area consistent with your patient base."}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "Que vous soyez médecin, thérapeute ou professionnel du bien-être, il est essentiel d'aborder cette recherche avec une vision claire : emplacement, typologie de local, budget global et potentiel de développement de votre activité."
                : "Whether you are a doctor, therapist or wellbeing professional, it is essential to approach this search with a clear vision: location, type of premises, overall budget and potential for developing your practice."}
            </p>
          </div>

          {/* Résumé structuré */}
          <section className="mb-16 p-8 bg-secondary rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "Ce qu'il faut retenir pour trouver un cabinet médical à Bordeaux"
                : "Key takeaways for finding a medical office in Bordeaux"}
            </h2>
            <ul className="space-y-3 pl-5 list-disc marker:text-primary text-muted-foreground leading-relaxed">
              <li>{lang === "fr" ? "Privilégier des surfaces entre 12 et 20 m² adaptées à votre activité" : "Favour spaces between 12 and 20 sqm suited to your practice"}</li>
              <li>{lang === "fr" ? "Choisir un emplacement cohérent avec votre patientèle plutôt qu'un emplacement premium" : "Choose a location consistent with your patient base rather than a premium location"}</li>
              <li>{lang === "fr" ? "Anticiper les contraintes réglementaires (ERP, accessibilité)" : "Anticipate regulatory constraints (ERP, accessibility)"}</li>
              <li>{lang === "fr" ? "Intégrer le coût des travaux dans votre budget global" : "Factor renovation costs into your overall budget"}</li>
              <li>{lang === "fr" ? "Envisager des lieux mutualisés pour optimiser votre installation" : "Consider shared spaces to optimise your setup"}</li>
            </ul>
          </section>

          {/* Pourquoi est-il difficile */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "Pourquoi est-il difficile de trouver un cabinet à Bordeaux ?"
                : "Why is it difficult to find an office in Bordeaux?"}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {lang === "fr"
                  ? "Le marché bordelais est particulièrement tendu sur les petites surfaces adaptées aux professions de santé."
                  : "The Bordeaux market is particularly tight for small spaces suited to health professions."}
              </p>
              <p>
                {lang === "fr"
                  ? "Plusieurs facteurs expliquent cette difficulté :"
                  : "Several factors explain this difficulty:"}
              </p>
              <ul className="space-y-3 pl-5 list-disc marker:text-primary">
                <li>{lang === "fr" ? "Peu d'offres adaptées entre 10 et 25 m²" : "Few suitable options between 10 and 25 sqm"}</li>
                <li>{lang === "fr" ? "Concurrence entre professions libérales et commerces" : "Competition between liberal professions and retail businesses"}</li>
                <li>{lang === "fr" ? "Transformation de bureaux en logements" : "Conversion of offices into housing"}</li>
                <li>{lang === "fr" ? "Exigences croissantes en matière de normes (ERP, accessibilité)" : "Increasing regulatory requirements (ERP, accessibility)"}</li>
              </ul>
              <p>
                {lang === "fr"
                  ? "Cela conduit souvent les praticiens à faire des compromis, parfois au détriment de leur confort de travail ou de leur rentabilité."
                  : "This often leads practitioners to compromise, sometimes at the expense of their working comfort or profitability."}
              </p>
            </div>
          </section>

          {/* Critères essentiels */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "Les critères essentiels pour choisir son cabinet"
                : "Essential criteria for choosing your office"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {lang === "fr"
                ? "Avant même de visiter des biens, il est important de clarifier plusieurs points structurants."
                : "Before even visiting properties, it is important to clarify several key points."}
            </p>

            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {lang === "fr" ? "Emplacement" : "Location"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "fr"
                    ? "Un bon emplacement ne signifie pas nécessairement une rue très passante. Il doit être cohérent avec votre spécialité, votre clientèle cible et l'écosystème local (autres praticiens, pharmacies, transports)."
                    : "A good location does not necessarily mean a busy street. It should be consistent with your speciality, your target clientele and the local ecosystem (other practitioners, pharmacies, transport)."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {lang === "fr" ? "Surface et organisation" : "Surface area and layout"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "fr"
                    ? "La majorité des praticiens exercent efficacement dans des surfaces comprises entre 12 et 20 m², à condition que les espaces soient bien pensés et complétés par des parties communes (salle d'attente, sanitaires)."
                    : "Most practitioners work effectively in spaces between 12 and 20 sqm, provided the spaces are well-designed and complemented by common areas (waiting room, facilities)."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {lang === "fr" ? "Accessibilité" : "Accessibility"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "fr"
                    ? "Les normes d'accessibilité sont un point clé, notamment pour les établissements recevant du public (ERP). Un local non conforme peut générer des coûts importants de mise aux normes."
                    : "Accessibility standards are a key point, particularly for public-access establishments (ERP). A non-compliant premises can generate significant compliance costs."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {lang === "fr" ? "Budget global" : "Overall budget"}
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {lang === "fr"
                      ? "Il ne faut pas se limiter au loyer ou au prix d'acquisition. Il faut intégrer :"
                      : "You should not limit yourself to rent or purchase price. You need to factor in:"}
                  </p>
                  <ul className="space-y-3 pl-5 list-disc marker:text-primary">
                    <li>{lang === "fr" ? "Travaux" : "Renovation work"}</li>
                    <li>{lang === "fr" ? "Charges" : "Service charges"}</li>
                    <li>{lang === "fr" ? "Fiscalité" : "Tax"}</li>
                    <li>{lang === "fr" ? "Éventuels temps de vacance" : "Potential vacancy periods"}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Louer ou acheter */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "Faut-il louer ou acheter son cabinet ?"
                : "Should you rent or buy your office?"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {lang === "fr"
                ? "Les deux approches ont leurs avantages."
                : "Both approaches have their advantages."}
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {lang === "fr" ? "Location" : "Renting"}
                </h3>
                <ul className="space-y-3 pl-5 list-disc marker:text-primary text-muted-foreground leading-relaxed">
                  <li>{lang === "fr" ? "Plus flexible" : "More flexible"}</li>
                  <li>{lang === "fr" ? "Moins de capital mobilisé" : "Less capital required"}</li>
                  <li>{lang === "fr" ? "Adapté en début d'activité" : "Suitable when starting out"}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {lang === "fr" ? "Achat" : "Buying"}
                </h3>
                <ul className="space-y-3 pl-5 list-disc marker:text-primary text-muted-foreground leading-relaxed">
                  <li>{lang === "fr" ? "Constitution de patrimoine" : "Building equity"}</li>
                  <li>{lang === "fr" ? "Sécurisation du long terme" : "Long-term security"}</li>
                  <li>{lang === "fr" ? "Possibilité de valorisation" : "Potential appreciation"}</li>
                </ul>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mt-6">
              {lang === "fr"
                ? "Dans de nombreux cas, une approche intermédiaire consiste à intégrer un espace mutualisé permettant de limiter le risque tout en bénéficiant d'un cadre professionnel qualitatif."
                : "In many cases, an intermediate approach involves joining a shared space, limiting risk while benefiting from a high-quality professional environment."}
            </p>
          </section>

          {/* Erreurs fréquentes */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "Les erreurs fréquentes à éviter"
                : "Common mistakes to avoid"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {lang === "fr"
                ? "Certaines erreurs reviennent régulièrement :"
                : "Some mistakes come up regularly:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc marker:text-primary text-muted-foreground leading-relaxed mb-6">
              <li>{lang === "fr" ? "Choisir un local uniquement sur un coup de cœur" : "Choosing a space based purely on a gut feeling"}</li>
              <li>{lang === "fr" ? "Sous-estimer les travaux" : "Underestimating renovation work"}</li>
              <li>{lang === "fr" ? "Négliger les contraintes réglementaires" : "Neglecting regulatory constraints"}</li>
              <li>{lang === "fr" ? "Surdimensionner la surface" : "Over-sizing the space"}</li>
              <li>{lang === "fr" ? "S'isoler sans dynamique de lieu" : "Isolating yourself without a sense of community"}</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "Ces erreurs peuvent impacter directement la rentabilité et le développement de votre activité."
                : "These mistakes can directly impact the profitability and growth of your practice."}
            </p>
          </section>

          {/* Lieux mutualisés */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "L'intérêt des lieux mutualisés pour les praticiens"
                : "The benefits of shared spaces for practitioners"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {lang === "fr"
                ? "Depuis quelques années, une nouvelle approche se développe : les lieux de soins mutualisés."
                : "In recent years, a new approach has been developing: shared care spaces."}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {lang === "fr" ? "Ils permettent :" : "They allow:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc marker:text-primary text-muted-foreground leading-relaxed mb-6">
              <li>{lang === "fr" ? "De réduire les coûts" : "Reduced costs"}</li>
              <li>{lang === "fr" ? "De bénéficier d'espaces partagés de qualité" : "Access to high-quality shared spaces"}</li>
              <li>{lang === "fr" ? "De créer des synergies entre praticiens" : "Creating synergies between practitioners"}</li>
              <li>{lang === "fr" ? "D'améliorer l'expérience patient" : "Improved patient experience"}</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "Ce modèle est particulièrement adapté aux professions paramédicales et au bien-être."
                : "This model is particularly suited to paramedical and wellbeing professions."}
            </p>
          </section>

          {/* I-CA.RE */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? <>Comment <BrandName /> accompagne les praticiens</>
                : <>How <BrandName /> supports practitioners</>}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {lang === "fr"
                ? <><BrandName /> développe des lieux de soins pensés spécifiquement pour les praticiens.</>
                : <><BrandName /> develops care spaces designed specifically for practitioners.</>}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {lang === "fr"
                ? "Chaque projet est conçu avec une attention particulière portée à :"
                : "Each project is designed with particular attention to:"}
            </p>
            <ul className="space-y-3 pl-5 list-disc marker:text-primary text-muted-foreground leading-relaxed mb-6">
              <li>{lang === "fr" ? "La qualité des espaces" : "Space quality"}</li>
              <li>{lang === "fr" ? "La fonctionnalité des cabinets" : "Office functionality"}</li>
              <li>{lang === "fr" ? "L'intégration dans le tissu local" : "Integration into the local fabric"}</li>
              <li>{lang === "fr" ? "La cohérence économique" : "Economic coherence"}</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "L'objectif est simple : permettre aux praticiens de se concentrer sur leur activité, dans un environnement adapté et pérenne."
                : "The goal is simple: to allow practitioners to focus on their practice, in a suitable and sustainable environment."}
            </p>
          </section>

          {/* Données concrètes */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "Ordres de grandeur observés à Bordeaux pour un cabinet paramédical"
                : "Typical figures observed in Bordeaux for a paramedical office"}
            </h2>
            <ul className="space-y-3 pl-5 list-disc marker:text-primary text-muted-foreground leading-relaxed mb-6">
              <li>{lang === "fr" ? "Surface moyenne : 12 à 18 m²" : "Average surface area: 12 to 18 sqm"}</li>
              <li>{lang === "fr" ? "Loyer mensuel : 400 à 900 € selon emplacement et qualité" : "Monthly rent: €400 to €900 depending on location and quality"}</li>
              <li>{lang === "fr" ? "Coût de travaux : 500 à 1 500 €/m² selon état initial" : "Renovation cost: €500 to €1,500/sqm depending on initial condition"}</li>
              <li>{lang === "fr" ? "Taux d'occupation cible : supérieur à 80 %" : "Target occupancy rate: above 80%"}</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "Ces données peuvent varier selon le quartier et la nature du projet, mais elles permettent de cadrer une première approche réaliste."
                : "These figures may vary depending on the neighbourhood and the nature of the project, but they help frame a realistic initial approach."}
            </p>
          </section>

          {/* CTA */}
          <div className="text-center py-8 mb-16">
            <Button variant="gold" size="lg" asChild>
              <Link to={localePath(lang, "professionals")}>
                {lang === "fr" ? "Découvrir nos espaces" : "Discover our spaces"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-8">
              {lang === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          {/* Conclusion expert */}
          <section className="mt-16 pt-10 border-t border-border">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {lang === "fr"
                ? "Trouver un cabinet médical à Bordeaux ne se résume pas à une recherche immobilière classique. C'est un équilibre entre emplacement, contraintes techniques et modèle économique."
                : "Finding a medical office in Bordeaux is not simply a standard property search. It is a balance between location, technical constraints and business model."}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "Une approche structurée permet d'éviter les erreurs fréquentes et de sécuriser son installation sur le long terme."
                : "A structured approach helps avoid common mistakes and secure your setup for the long term."}
            </p>
          </section>
        </div>
      </article>
    </Layout>
  );
}
