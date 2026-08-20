import { InsightArticleTemplate } from "@/components/InsightArticleTemplate";
import { useTranslation } from "react-i18next";
import nansoutyFacade from "@/assets/nansouty/facade.webp";

export default function InsightsBudget() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedGuides =
    lang === "fr"
      ? [
          { routeKey: "insightsCabinetMedical", title: "Trouver un cabinet médical à Bordeaux", description: "Emplacement, surface, normes : guide complet pour les praticiens." },
          { routeKey: "insightsSurface", title: "Quelle surface pour un cabinet", description: "De 11 à 18 m² selon votre métier : les fourchettes réalistes." },
          { routeKey: "insightsLouerAcheter", title: "Louer ou acheter son cabinet", description: "Flexibilité, patrimoine : les critères concrets de choix." },
        ]
      : [
          { routeKey: "insightsCabinetMedical", title: "Finding a medical office in Bordeaux", description: "Location, size, standards: a complete guide for practitioners." },
          { routeKey: "insightsSurface", title: "What size for an office", description: "From 11 to 18 sqm: realistic ranges by profession." },
          { routeKey: "insightsLouerAcheter", title: "Rent or buy your office", description: "Flexibility, equity: the concrete criteria." },
        ];

  const keyFigures =
    lang === "fr"
      ? [
          { label: "Loyer mensuel", value: "400 à 900 €" },
          { label: "Dépôt de garantie", value: "1 à 3 mois" },
          { label: "Travaux", value: "500 à 1 500 €/m²" },
          { label: "Mobilier", value: "2 000 à 5 000 €" },
          { label: "Assurances", value: "500 à 1 500 €/an" },
          { label: "Trésorerie", value: "3 à 6 mois" },
        ]
      : [
          { label: "Monthly rent", value: "€400 to €900" },
          { label: "Deposit", value: "1 to 3 months" },
          { label: "Renovations", value: "€500 to €1,500/sqm" },
          { label: "Furniture", value: "€2,000 to €5,000" },
          { label: "Insurance", value: "€500 to €1,500/year" },
          { label: "Cash reserve", value: "3 to 6 months" },
        ];

  const faq =
    lang === "fr"
      ? [
          { question: "Combien coûte l'ouverture d'un cabinet à Bordeaux\u00a0?", answer: "Pour un cabinet seul\u00a0: prévoyez 10\u00a0000 à 25\u00a0000\u00a0€ incluant dépôt, travaux et mobilier, plus une trésorerie. En mutualisé\u00a0: 1\u00a0500 à 3\u00a0000\u00a0€." },
          { question: "Les espaces mutualisés sont-ils vraiment moins chers\u00a0?", answer: "Oui, nettement. Le ticket d'entrée est généralement 30 à 50\u00a0% inférieur à une installation seul." },
          { question: "Peut-on déduire les frais d'installation\u00a0?", answer: "De nombreux frais sont déductibles selon votre régime fiscal (BNC, micro-BNC). Consultez un comptable familier des professions de santé." },
          { question: "Au bout de combien de temps le cabinet est-il rentable\u00a0?", answer: "La plupart des praticiens atteignent l'équilibre en 6 à 12 mois, selon leur patientèle existante et leur réseau d'adressage." },
          { question: "Faut-il préparer son budget avant ou après avoir trouvé un local\u00a0?", answer: "Avant. Un cadre budgétaire clair permet de filtrer efficacement les options et d'éviter de s'engager au-delà de ses capacités." },
        ]
      : [
          { question: "How much does it cost to open an office in Bordeaux?", answer: "For a standalone office: plan €10,000–25,000 including deposit, renovations and furniture, plus a cash reserve. In a shared space: €1,500–3,000." },
          { question: "Are shared spaces cheaper?", answer: "Yes, significantly. The initial outlay is typically 30–50% lower than a standalone set-up." },
          { question: "Can I deduct set-up costs?", answer: "Many set-up costs are deductible depending on your tax regime (BNC, micro-BNC). Consult an accountant familiar with healthcare professions." },
          { question: "How long before the office becomes profitable?", answer: "Most practitioners reach break-even within 6 to 12 months, depending on their existing patient base and referral network." },
          { question: "Should I prepare my budget before or after finding a space?", answer: "Before. A clear budget framework helps you filter options efficiently." },
        ];

  if (lang === "en") {
    return (
      <InsightArticleTemplate
        title="What budget to plan for a medical office in Bordeaux | I‑CA.RE"
        description="Rent, deposit, renovations, furniture, insurance, cash reserve: a detailed, realistic breakdown of costs for opening a medical or paramedical office in Bordeaux."
        path="/en/insights/office-budget-bordeaux"
        heroImage={nansoutyFacade}
        heroImageAlt="I‑CA.RE Nansouty healthcare building facade in Bordeaux"
        articleTitle="What budget to plan for opening a medical or paramedical office in Bordeaux"
        intro="How much does it really cost to set up as a practitioner in Bordeaux? The answer goes well beyond rent. Between deposit, renovations, furniture, insurance and cash reserves, the total budget can vary significantly depending on whether you choose a standalone office or a shared care space."
        takeaways={[
          "Always distinguish between one-off set-up costs and recurring monthly charges",
          "Renovation costs range from €500 to €1,500/sqm, sometimes more for ERP upgrades",
          "A cash reserve covering 3 to 6 months of fixed costs is essential",
          "Furniture, signage and insurance are often underestimated",
          "Shared spaces can reduce the initial outlay by 30 to 50%",
          "Build your budget before choosing your space, not the other way around",
        ]}
        toc={[
          { id: "structure", label: "How to structure your budget" },
          { id: "rent", label: "Rent or acquisition: the main commitment" },
          { id: "deposit", label: "Deposit and upfront payments" },
          { id: "renovation", label: "Renovation and fit-out costs" },
          { id: "furniture", label: "Furniture, equipment and signage" },
          { id: "insurance", label: "Insurance and recurring charges" },
          { id: "reserve", label: "Cash reserve: the safety net" },
          { id: "comparison", label: "Standalone vs shared: the cost comparison" },
          { id: "location-costs", label: "Cost variations by location" },
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
        <section id="structure">
          <h2 className="text-xl font-heading font-bold mb-3">How to structure your budget</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A well-prepared budget separates three categories: one-off set-up costs (deposit, renovations, furniture, signage), recurring costs (rent, charges, insurance, maintenance) and a cash reserve for the ramp-up period.</p>
          <p className="text-muted-foreground leading-relaxed">Start by listing every foreseeable expense, then add a 10–15% contingency margin. A realistic budget prepared before signing is your best protection.</p>
        </section>

        <section id="rent">
          <h2 className="text-xl font-heading font-bold mb-3">Rent or acquisition: the main commitment</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">In Bordeaux, monthly rent for a small healthcare office typically ranges from €400 to €900, depending on location, quality and size.</p>
          <p className="text-muted-foreground leading-relaxed">Buying requires €2,000–4,000/sqm plus notary fees (7–8%). For most early-career practitioners, renting or joining a shared space is the safer entry point.</p>
        </section>

        <section id="deposit">
          <h2 className="text-xl font-heading font-bold mb-3">Deposit and upfront payments</h2>
          <p className="text-muted-foreground leading-relaxed">A deposit of 1 to 3 months' rent is standard. Some landlords also require advance rent. In a shared space, the deposit is typically lower, often limited to 1 month.</p>
        </section>

        <section id="renovation">
          <h2 className="text-xl font-heading font-bold mb-3">Renovation and fit-out costs</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Light cosmetic work may cost €500/sqm. Full fit-out including partitioning, plumbing, acoustic treatment and ERP upgrades can reach €1,500/sqm or more.</p>
          <p className="text-muted-foreground leading-relaxed">Key cost drivers: plumbing, acoustic insulation, accessibility upgrades, electrical work and quality of finishes.</p>
        </section>

        <section id="furniture">
          <h2 className="text-xl font-heading font-bold mb-3">Furniture, equipment and signage</h2>
          <p className="text-muted-foreground leading-relaxed">Furnishing a small office typically costs €2,000–5,000. External signage adds €500–2,000. Digital presence set-up should also be budgeted.</p>
        </section>

        <section id="insurance">
          <h2 className="text-xl font-heading font-bold mb-3">Insurance and recurring charges</h2>
          <p className="text-muted-foreground leading-relaxed">RC Pro insurance: €300–1,000/year. Premises insurance: €200–500/year. Charges represent 15–25% on top of base rent.</p>
        </section>

        <section id="reserve">
          <h2 className="text-xl font-heading font-bold mb-3">Cash reserve: the safety net</h2>
          <p className="text-muted-foreground leading-relaxed">A cash reserve covering 3 to 6 months of fixed costs absorbs the ramp-up period. This reserve is often the difference between a smooth start and a difficult one.</p>
        </section>

        <section id="comparison">
          <h2 className="text-xl font-heading font-bold mb-3">Standalone office vs shared space: the cost comparison</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Example for a 14 sqm office in Bordeaux:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li>Standalone: deposit €1,500–2,700 + renovations €7,000–21,000 + furniture €3,000–5,000 = total €11,500–28,700</li>
            <li>Shared space: deposit €500–900 + furniture €1,000–2,000 = total €1,500–2,900</li>
          </ul>
          <p className="text-xs text-muted-foreground italic">These ranges are illustrative and depend on the specific space.</p>
        </section>

        <section id="location-costs">
          <h2 className="text-xl font-heading font-bold mb-3">Cost variations by location in Bordeaux</h2>
          <p className="text-muted-foreground leading-relaxed">City-centre locations (Pey-Berland, Jardin Public, Chartrons) command higher rents but offer excellent visibility. Neighbourhoods like Nansouty or Caudéran offer more affordable rents with good residential catchments.</p>
        </section>

        <section id="mistakes">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Starting the search without a clear budget framework</li>
            <li>Underestimating renovation costs, especially ERP accessibility upgrades</li>
            <li>Forgetting about charges and insurance in monthly projections</li>
            <li>Failing to plan a cash reserve for the first 3–6 months</li>
            <li>Comparing raw rents without accounting for included services</li>
            <li>Overinvesting in premium finishes at the expense of cash flow</li>
          </ul>
        </section>
      </InsightArticleTemplate>
    );
  }

  return (
    <InsightArticleTemplate
      title="Quel budget pour un cabinet médical à Bordeaux | I‑CA.RE"
      description="Loyer, dépôt, travaux, mobilier, assurances, trésorerie : un tour d'horizon détaillé et réaliste des coûts pour ouvrir un cabinet médical ou paramédical à Bordeaux."
      path="/insights/budget-cabinet-bordeaux"
      heroImage={nansoutyFacade}
      heroImageAlt="Façade I‑CA.RE Nansouty – espace de soins à Bordeaux"
      articleTitle="Quel budget prévoir pour ouvrir un cabinet médical ou paramédical à Bordeaux"
      intro={<>Combien coûte réellement une installation à Bordeaux&nbsp;? La réponse va bien au-delà du loyer. Entre dépôt de garantie, travaux, mobilier, assurances et trésorerie de sécurité, le budget total peut varier considérablement selon que vous choisissez un cabinet indépendant ou un espace mutualisé.</>}
      takeaways={[
        "Toujours distinguer coûts ponctuels d'installation et charges mensuelles récurrentes",
        "Coût des travaux\u00a0: 500 à 1\u00a0500\u00a0€/m², parfois davantage pour les normes ERP",
        "Prévoir impérativement une trésorerie de 3 à 6 mois de charges fixes",
        "Mobilier, signalétique et assurances sont souvent sous-estimés",
        "Les espaces mutualisés réduisent le ticket d'entrée de 30 à 50\u00a0%",
        "Construire son budget avant de choisir son local, pas l'inverse",
      ]}
      toc={[
        { id: "structurer", label: "Comment structurer son budget" },
        { id: "loyer", label: "Loyer ou acquisition : l'engagement principal" },
        { id: "depot", label: "Dépôt de garantie et paiements initiaux" },
        { id: "travaux", label: "Coût des travaux et de l'aménagement" },
        { id: "mobilier", label: "Mobilier, équipement et signalétique" },
        { id: "assurances", label: "Assurances et charges récurrentes" },
        { id: "tresorerie", label: "La trésorerie de sécurité" },
        { id: "comparaison", label: "Cabinet seul vs espace mutualisé" },
        { id: "quartiers", label: "Écarts de coût selon le quartier" },
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
      <section id="structurer">
        <h2 className="text-xl font-heading font-bold mb-3">Comment structurer son budget</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un budget bien préparé distingue trois catégories&nbsp;: les coûts ponctuels d'installation (dépôt, travaux, mobilier, signalétique), les charges récurrentes (loyer, charges, assurances, entretien) et une trésorerie de sécurité pour la montée en activité.</p>
        <p className="text-muted-foreground leading-relaxed">Commencez par lister chaque dépense prévisible, puis ajoutez une marge de 10 à 15&nbsp;% pour les imprévus.</p>
      </section>

      <section id="loyer">
        <h2 className="text-xl font-heading font-bold mb-3">Loyer ou acquisition&nbsp;: l'engagement principal</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">À Bordeaux, le loyer mensuel pour un petit cabinet de santé se situe entre 400 et 900&nbsp;€, selon l'emplacement, la qualité et la surface.</p>
        <p className="text-muted-foreground leading-relaxed">L'achat mobilise 2&nbsp;000 à 4&nbsp;000&nbsp;€/m² plus les frais de notaire (7 à 8&nbsp;%). Pour la plupart des praticiens en début de carrière, la location ou le mutualisé est le point d'entrée le plus sûr.</p>
      </section>

      <section id="depot">
        <h2 className="text-xl font-heading font-bold mb-3">Dépôt de garantie et paiements initiaux</h2>
        <p className="text-muted-foreground leading-relaxed">Un dépôt de 1 à 3 mois de loyer est standard pour un bail commercial. En espace mutualisé, le dépôt est généralement plus faible, souvent limité à 1 mois.</p>
      </section>

      <section id="travaux">
        <h2 className="text-xl font-heading font-bold mb-3">Coût des travaux et de l'aménagement</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Travaux légers (peinture, sol)&nbsp;: 500&nbsp;€/m². Aménagement complet incluant cloisonnement, plomberie, acoustique et ERP&nbsp;: jusqu'à 1&nbsp;500&nbsp;€/m² ou plus.</p>
        <p className="text-muted-foreground leading-relaxed">Postes principaux&nbsp;: plomberie, isolation acoustique, accessibilité, mise à niveau électrique et finitions.</p>
      </section>

      <section id="mobilier">
        <h2 className="text-xl font-heading font-bold mb-3">Mobilier, équipement et signalétique</h2>
        <p className="text-muted-foreground leading-relaxed">L'équipement d'un petit cabinet représente 2&nbsp;000 à 5&nbsp;000&nbsp;€. La signalétique extérieure ajoute 500 à 2&nbsp;000&nbsp;€. Prévoyez aussi la création d'une présence en ligne.</p>
      </section>

      <section id="assurances">
        <h2 className="text-xl font-heading font-bold mb-3">Assurances et charges récurrentes</h2>
        <p className="text-muted-foreground leading-relaxed">RC Pro&nbsp;: 300 à 1&nbsp;000&nbsp;€/an. Assurance du local&nbsp;: 200 à 500&nbsp;€/an. Les charges représentent 15 à 25&nbsp;% en sus du loyer de base.</p>
      </section>

      <section id="tresorerie">
        <h2 className="text-xl font-heading font-bold mb-3">La trésorerie de sécurité&nbsp;: le filet indispensable</h2>
        <p className="text-muted-foreground leading-relaxed">Une trésorerie couvrant 3 à 6 mois de charges fixes absorbe la période de montée en activité sans stress financier. Cette réserve fait souvent la différence entre un démarrage serein et un démarrage difficile.</p>
      </section>

      <section id="comparaison">
        <h2 className="text-xl font-heading font-bold mb-3">Cabinet seul vs espace mutualisé&nbsp;: la comparaison des coûts</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Exemple comparatif pour un cabinet de 14&nbsp;m² à Bordeaux&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li>Cabinet seul&nbsp;: dépôt 1&nbsp;500–2&nbsp;700&nbsp;€ + travaux 7&nbsp;000–21&nbsp;000&nbsp;€ + mobilier 3&nbsp;000–5&nbsp;000&nbsp;€ = total 11&nbsp;500–28&nbsp;700&nbsp;€</li>
          <li>Espace mutualisé&nbsp;: dépôt 500–900&nbsp;€ + mobilier 1&nbsp;000–2&nbsp;000&nbsp;€ = total 1&nbsp;500–2&nbsp;900&nbsp;€</li>
        </ul>
        <p className="text-xs text-muted-foreground italic">Ces fourchettes sont illustratives et dépendent du local et de son état.</p>
      </section>

      <section id="quartiers">
        <h2 className="text-xl font-heading font-bold mb-3">Écarts de coût selon le quartier à Bordeaux</h2>
        <p className="text-muted-foreground leading-relaxed">Centre-ville (Pey-Berland, Jardin Public, Chartrons)&nbsp;: loyers plus élevés mais excellente visibilité. Quartiers comme Nansouty, Saint-Augustin ou Caudéran&nbsp;: loyers plus accessibles avec de bons bassins résidentiels.</p>
      </section>

      <section id="erreurs">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Commencer la recherche sans cadre budgétaire clair</li>
          <li>Sous-estimer le coût des travaux, en particulier les mises aux normes ERP</li>
          <li>Oublier charges et assurances dans les projections mensuelles</li>
          <li>Ne pas prévoir de trésorerie pour les 3 à 6 premiers mois</li>
          <li>Comparer des loyers bruts sans tenir compte des services inclus ou exclus</li>
          <li>Surinvestir dans les finitions premium au détriment de la trésorerie</li>
        </ul>
      </section>
    </InsightArticleTemplate>
  );
}
