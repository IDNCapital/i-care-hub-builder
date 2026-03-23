import { InsightArticleTemplate } from "@/components/InsightArticleTemplate";
import { useTranslation } from "react-i18next";
import jardinPublicCab1 from "@/assets/jardin-public/cab1.webp";

export default function InsightsSurface() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedGuides =
    lang === "fr"
      ? [
          { routeKey: "insightsBudget", title: "Quel budget pour un cabinet à Bordeaux", description: "Loyer, dépôt, travaux, mobilier : tour d'horizon détaillé des coûts." },
          { routeKey: "insightsProfessions", title: "Professions compatibles avec le partage", description: "Complémentarité, rythmes et confidentialité en cabinet partagé." },
          { routeKey: "insightsCabinetMedical", title: "Trouver un cabinet médical à Bordeaux", description: "Emplacement, surface, normes : guide complet pour les praticiens." },
        ]
      : [
          { routeKey: "insightsBudget", title: "What budget for an office in Bordeaux", description: "Rent, deposit, renovations, furniture: detailed cost breakdown." },
          { routeKey: "insightsProfessions", title: "Professions compatible with sharing", description: "Complementarity, schedules and confidentiality in shared offices." },
          { routeKey: "insightsCabinetMedical", title: "Finding a medical office in Bordeaux", description: "Location, size, standards: a complete guide for practitioners." },
        ];

  const keyFigures =
    lang === "fr"
      ? [
          { label: "Consultation assise", value: "11 à 15 m²" },
          { label: "Table de soins", value: "14 à 18 m²" },
          { label: "Cabinet indépendant", value: "25 à 40 m² total" },
          { label: "Surdimensionnement", value: "~8 000 €/an gaspillés" },
          { label: "Salle d'attente partagée", value: "1 000 à 2 000 €/praticien" },
          { label: "Confort", value: "Lumière, acoustique, agencement" },
        ]
      : [
          { label: "Seated practice", value: "11 to 15 sqm" },
          { label: "Treatment table", value: "14 to 18 sqm" },
          { label: "Standalone office", value: "25 to 40 sqm total" },
          { label: "Oversizing cost", value: "~€8,000/year wasted" },
          { label: "Shared waiting room", value: "€1,000–2,000/practitioner" },
          { label: "Comfort", value: "Light, acoustics, layout" },
        ];

  const faq =
    lang === "fr"
      ? [
          { question: "Peut-on exercer dans 11\u00a0m²\u00a0?", answer: "Oui, de nombreuses professions en consultation assise exercent très bien dans 11 à 13\u00a0m² — psychologues, diététiciens, sophrologues, naturopathes. La condition clé est l'accès à une salle d'attente et des sanitaires partagés." },
          { question: "Quelle surface pour un ostéopathe\u00a0?", answer: "Une table de soins et une circulation confortable nécessitent 14 à 18\u00a0m²." },
          { question: "Un cabinet plus grand améliore-t-il l'expérience patient\u00a0?", answer: "Pas nécessairement. L'expérience dépend de l'atmosphère, de la propreté, de l'intimité acoustique et de la lumière naturelle — pas de la taille." },
          { question: "Comment calculer la bonne surface\u00a0?", answer: "Listez votre mobilier essentiel, ajoutez l'espace de circulation, puis vérifiez si les parties communes couvrent vos besoins restants." },
          { question: "Les espaces mutualisés sont-ils trop petits\u00a0?", answer: "Non. La surface totale effective — cabinet privatif plus parties communes — est souvent plus grande et mieux équipée qu'un cabinet indépendant." },
        ]
      : [
          { question: "Can I practise in 11 sqm?", answer: "Yes, many seated-practice professions work very well in 11–13 sqm — psychologists, dietitians, sophrologists, naturopaths. The key is access to shared waiting room and facilities." },
          { question: "How much space does an osteopath need?", answer: "A treatment table and adequate circulation typically require 14 to 18 sqm." },
          { question: "Does a larger office improve patient experience?", answer: "Not necessarily. Experience depends on atmosphere, cleanliness, acoustic privacy and natural light — not on size alone." },
          { question: "How do I calculate the right size?", answer: "List your essential furniture, add circulation space, then check whether shared areas cover your remaining needs." },
          { question: "Are shared spaces too small?", answer: "No. The effective total space — private office plus shared areas — is often larger and better equipped than a standalone office." },
        ];

  if (lang === "en") {
    return (
      <InsightArticleTemplate
        title="What size for a medical or paramedical office | I‑CA.RE"
        description="From 11 to 18 sqm depending on your profession: realistic minimum areas, the role of shared spaces, oversizing traps and concrete examples by practice type."
        path="/en/insights/medical-office-size"
        heroImage={jardinPublicCab1}
        heroImageAlt="Well-designed consultation room – I-CA.RE Bordeaux"
        articleTitle="What size do you need for a medical or paramedical office"
        intro="Choosing the right size for your office is one of the most impactful decisions you'll make. Too large, and you overspend every month. Too small, and you compromise comfort. The answer depends on your profession, whether you work with equipment, and whether you have access to shared common areas."
        takeaways={[
          "A private office of 11 to 15 sqm suits most seated-practice professions",
          "Professions using a treatment table need 14 to 18 sqm",
          "Shared areas are essential complements to private space",
          "Oversizing is one of the most common and costly mistakes",
          "A well-designed small space outperforms a poorly laid-out large one",
          "In shared settings, the effective total space is much larger than the private office alone",
        ]}
        toc={[
          { id: "areas", label: "Realistic minimum areas by practice type" },
          { id: "standalone-vs-shared", label: "Standalone vs shared: the space equation" },
          { id: "common-areas", label: "The critical role of common areas" },
          { id: "oversizing", label: "The oversizing trap" },
          { id: "comfort", label: "What really determines comfort" },
          { id: "mistakes", label: "Common mistakes to avoid" },
        ]}
        keyFigures={keyFigures}
        faq={faq}
        ctaPrimaryRoute="locationBordeaux"
        ctaPrimaryLabel="Find an office"
        ctaSecondaryRoute="contact"
        ctaSecondaryLabel="Get in touch"
        relatedGuides={relatedGuides}
      >
        <section id="areas">
          <h2 className="text-xl font-heading font-bold mb-3">Realistic minimum areas by practice type</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Space needs vary by profession. Realistic minimums, assuming access to shared common areas:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li><strong>Psychology, psychotherapy:</strong> 11–13 sqm</li>
            <li><strong>Dietetics, nutrition:</strong> 11–14 sqm</li>
            <li><strong>Sophrology, naturopathy:</strong> 11–14 sqm</li>
            <li><strong>Osteopathy, manual therapy:</strong> 14–18 sqm</li>
            <li><strong>Speech therapy:</strong> 12–16 sqm</li>
            <li><strong>Psychomotor therapy:</strong> 13–16 sqm</li>
            <li><strong>Sexology, counselling:</strong> 11–13 sqm</li>
          </ul>
          <p className="text-xs text-muted-foreground italic">These ranges assume access to shared waiting room, facilities and entrance.</p>
        </section>

        <section id="standalone-vs-shared">
          <h2 className="text-xl font-heading font-bold mb-3">Standalone office vs shared space: the space equation</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A standalone office must fit everything — waiting area, facilities, storage — into your own square metres. This often means 25–40 sqm total.</p>
          <p className="text-muted-foreground leading-relaxed">In a shared setting, common functions are pooled. A 13 sqm private office can feel as professional as a 30 sqm standalone space.</p>
        </section>

        <section id="common-areas">
          <h2 className="text-xl font-heading font-bold mb-3">The critical role of common areas</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A well-designed waiting room, clean facilities and a professional entrance create the first impression for every patient. They directly influence perceived quality.</p>
          <p className="text-muted-foreground leading-relaxed">In a shared space, common areas are maintained collectively — higher quality at lower individual cost. A quality waiting room shared among five practitioners costs €1,000–2,000 each.</p>
        </section>

        <section id="oversizing">
          <h2 className="text-xl font-heading font-bold mb-3">The oversizing trap</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Every extra square metre increases rent, charges and maintenance every month. A practitioner paying €60/sqm/month for 25 sqm when 14 sqm would suffice wastes nearly €8,000 per year.</p>
          <p className="text-muted-foreground leading-relaxed">Start with the right size and expand if and when needed.</p>
        </section>

        <section id="comfort">
          <h2 className="text-xl font-heading font-bold mb-3">What really determines comfort</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Comfort depends on layout quality, natural light, acoustic insulation, ventilation and furniture choices — not raw square metres.</p>
          <p className="text-muted-foreground leading-relaxed">Invest in design quality over quantity of space.</p>
        </section>

        <section id="mistakes">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Renting too large "just in case" future needs arise</li>
            <li>Ignoring the contribution of shared areas to patient experience</li>
            <li>Confusing total building area with usable private office area</li>
            <li>Underestimating the impact of layout, light and acoustics</li>
            <li>Choosing a space based on raw size rather than functional design</li>
            <li>Paying for a standalone waiting room when shared alternatives exist</li>
          </ul>
        </section>
      </InsightArticleTemplate>
    );
  }

  return (
    <InsightArticleTemplate
      title="Quelle surface pour un cabinet médical ou paramédical | I‑CA.RE"
      description="De 11 à 18 m² selon votre métier : surfaces minimales réalistes, rôle des parties communes, piège du surdimensionnement et exemples concrets par type d'exercice."
      path="/insights/surface-cabinet-medical"
      heroImage={jardinPublicCab1}
      heroImageAlt="Cabinet de consultation bien agencé – I-CA.RE Bordeaux"
      articleTitle="Quelle surface faut-il pour un cabinet médical ou paramédical"
      intro={<>Choisir la bonne surface pour son cabinet est l'une des décisions les plus impactantes. Trop grand, vous surpayez chaque mois. Trop petit, vous compromettez le confort. La réponse dépend de votre métier, de votre mode d'exercice et de l'accès à des espaces communs partagés.</>}
      takeaways={[
        "Un cabinet privatif de 11 à 15\u00a0m² convient à la plupart des consultations assises",
        "Les métiers avec table de soins nécessitent 14 à 18\u00a0m²",
        "Les parties communes sont un complément essentiel",
        "Le surdimensionnement est l'une des erreurs les plus coûteuses",
        "Un petit espace bien conçu surpasse un grand espace mal agencé",
        "En mutualisé, la surface totale effective est bien supérieure au cabinet privatif seul",
      ]}
      toc={[
        { id: "surfaces", label: "Surfaces minimales réalistes par type d'exercice" },
        { id: "individuel-vs-mutualise", label: "Cabinet individuel vs espace mutualisé" },
        { id: "parties-communes", label: "Le rôle déterminant des parties communes" },
        { id: "surdimensionnement", label: "Le piège du surdimensionnement" },
        { id: "confort", label: "Ce qui détermine réellement le confort" },
        { id: "erreurs", label: "Les erreurs fréquentes à éviter" },
      ]}
      keyFigures={keyFigures}
      faq={faq}
      ctaPrimaryRoute="locationBordeaux"
      ctaPrimaryLabel="Trouver un cabinet"
      ctaSecondaryRoute="contact"
      ctaSecondaryLabel="Nous contacter"
      relatedGuides={relatedGuides}
    >
      <section id="surfaces">
        <h2 className="text-xl font-heading font-bold mb-3">Surfaces minimales réalistes par type d'exercice</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les besoins varient selon le métier. Fourchettes réalistes avec accès à des parties communes&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li><strong>Psychologie, psychothérapie&nbsp;:</strong> 11–13&nbsp;m²</li>
          <li><strong>Diététique, nutrition&nbsp;:</strong> 11–14&nbsp;m²</li>
          <li><strong>Sophrologie, naturopathie&nbsp;:</strong> 11–14&nbsp;m²</li>
          <li><strong>Ostéopathie, thérapie manuelle&nbsp;:</strong> 14–18&nbsp;m²</li>
          <li><strong>Orthophonie&nbsp;:</strong> 12–16&nbsp;m²</li>
          <li><strong>Psychomotricité, ergothérapie&nbsp;:</strong> 13–16&nbsp;m²</li>
          <li><strong>Sexologie, conseil&nbsp;:</strong> 11–13&nbsp;m²</li>
        </ul>
        <p className="text-xs text-muted-foreground italic">Ces fourchettes supposent un accès à salle d'attente, sanitaires et entrée partagés.</p>
      </section>

      <section id="individuel-vs-mutualise">
        <h2 className="text-xl font-heading font-bold mb-3">Cabinet individuel vs espace mutualisé&nbsp;: l'équation de surface</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un cabinet indépendant doit intégrer toutes les fonctions dans vos mètres carrés — souvent 25 à 40&nbsp;m² au total.</p>
        <p className="text-muted-foreground leading-relaxed">En mutualisé, votre cabinet se concentre sur la consultation. Un cabinet de 13&nbsp;m² en mutualisé peut être aussi professionnel qu'un local de 30&nbsp;m².</p>
      </section>

      <section id="parties-communes">
        <h2 className="text-xl font-heading font-bold mb-3">Le rôle déterminant des parties communes</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Une salle d'attente soignée, des sanitaires accessibles, une entrée professionnelle créent la première impression. En mutualisé, la qualité est meilleure à moindre coût individuel.</p>
        <p className="text-muted-foreground leading-relaxed">Créer une salle d'attente de qualité coûte 5&nbsp;000 à 10&nbsp;000&nbsp;€ seul — partagée entre cinq praticiens, c'est 1&nbsp;000 à 2&nbsp;000&nbsp;€ chacun.</p>
      </section>

      <section id="surdimensionnement">
        <h2 className="text-xl font-heading font-bold mb-3">Le piège du surdimensionnement</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Chaque m² supplémentaire augmente loyer, charges et entretien. Un praticien payant 60&nbsp;€/m²/mois pour 25&nbsp;m² quand 14&nbsp;m² suffiraient gaspille près de 8&nbsp;000&nbsp;€ par an.</p>
        <p className="text-muted-foreground leading-relaxed">Commencez avec la bonne taille et évoluez si le besoin se confirme.</p>
      </section>

      <section id="confort">
        <h2 className="text-xl font-heading font-bold mb-3">Ce qui détermine réellement le confort</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le confort dépend de l'agencement, de la lumière naturelle, de l'isolation acoustique, de la ventilation et du mobilier — pas des mètres carrés bruts.</p>
        <p className="text-muted-foreground leading-relaxed">Investissez dans la qualité de conception plutôt que dans la quantité de surface.</p>
      </section>

      <section id="erreurs">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Louer un espace trop grand «&nbsp;au cas où&nbsp;»</li>
          <li>Ignorer l'apport des parties communes à l'expérience patient</li>
          <li>Confondre surface totale du bâtiment et surface utile privatif</li>
          <li>Sous-estimer l'impact de l'agencement, de la lumière et de l'acoustique</li>
          <li>Choisir un local sur la base de la surface brute</li>
          <li>Payer seul une salle d'attente quand des alternatives mutualisées existent</li>
        </ul>
      </section>
    </InsightArticleTemplate>
  );
}
