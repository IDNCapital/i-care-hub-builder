import { InsightArticleTemplate } from "@/components/InsightArticleTemplate";
import { useTranslation } from "react-i18next";
import peyBerlandFacade from "@/assets/pey-berland/facade.webp";

export default function InsightsCabinetMedicalBordeaux() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedGuides =
    lang === "fr"
      ? [
          { routeKey: "insightsBudget", title: "Quel budget prévoir pour un cabinet à Bordeaux", description: "Loyer, dépôt, travaux, mobilier : un tour d'horizon détaillé des coûts." },
          { routeKey: "insightsSurface", title: "Quelle surface pour un cabinet médical", description: "De 11 à 18 m² selon votre métier : surfaces minimales réalistes." },
          { routeKey: "insightsLouerAcheter", title: "Faut-il louer ou acheter son cabinet", description: "Souplesse, patrimoine, maturité : les critères de choix concrets." },
        ]
      : [
          { routeKey: "insightsBudget", title: "What budget for an office in Bordeaux", description: "Rent, deposit, renovations, furniture: a detailed cost breakdown." },
          { routeKey: "insightsSurface", title: "What size for a medical office", description: "From 11 to 18 sqm depending on your profession." },
          { routeKey: "insightsLouerAcheter", title: "Should you rent or buy your office", description: "Flexibility, equity, maturity: the concrete criteria." },
        ];

  const keyFigures =
    lang === "fr"
      ? [
          { label: "Surface optimale", value: "11 à 18 m²" },
          { label: "Loyer mensuel", value: "400 à 900 €" },
          { label: "Travaux", value: "500 à 1 500 €/m²" },
          { label: "Trésorerie de départ", value: "3 à 6 mois" },
          { label: "Conformité", value: "ERP obligatoire" },
          { label: "Alternative", value: "Espaces mutualisés" },
        ]
      : [
          { label: "Optimal area", value: "11 to 18 sqm" },
          { label: "Monthly rent", value: "€400 to €900" },
          { label: "Renovations", value: "€500 to €1,500/sqm" },
          { label: "Cash reserve", value: "3 to 6 months" },
          { label: "Compliance", value: "ERP mandatory" },
          { label: "Alternative", value: "Shared spaces" },
        ];

  const faq =
    lang === "fr"
      ? [
          { question: "Quelle surface pour un cabinet médical\u00a0?", answer: "11 à 15\u00a0m² suffisent pour la plupart des exercices en consultation assise, à condition de disposer d'une salle d'attente et de sanitaires partagés. Les métiers nécessitant une table de soins ont besoin de 15 à 18\u00a0m²." },
          { question: "Quel budget prévoir à Bordeaux\u00a0?", answer: "En comptant loyer, dépôt, travaux de base et mobilier, prévoyez un minimum de 8\u00a0000 à 15\u00a0000\u00a0€ pour un petit cabinet, plus une trésorerie de sécurité de 3 à 6 mois." },
          { question: "Peut-on transformer un local commercial en cabinet\u00a0?", answer: "Oui, mais il faut vérifier la destination du local, le règlement de copropriété le cas échéant, et les normes ERP. Le coût des travaux se situe généralement entre 500 et 1\u00a0500\u00a0€/m²." },
          { question: "Faut-il acheter ou louer son cabinet\u00a0?", answer: "La location offre de la souplesse, surtout en début d'activité. L'achat permet de constituer un patrimoine mais mobilise un capital important. Les espaces mutualisés offrent souvent le meilleur compromis." },
          { question: "Les espaces mutualisés conviennent-ils à toutes les professions\u00a0?", answer: "La plupart des métiers en consultation fonctionnent très bien en mutualisé : psychologie, ostéopathie, diététique, sophrologie, naturopathie, orthophonie, etc." },
        ]
      : [
          { question: "What size for a medical office?", answer: "11 to 15 sqm is sufficient for most seated-practice professions, provided you have access to a waiting room and shared facilities. Treatment-table professions need 15 to 18 sqm." },
          { question: "What budget to plan in Bordeaux?", answer: "Including rent, deposit, basic renovations and furniture, plan €8,000–15,000 minimum for a small office, plus a cash reserve of 3 to 6 months." },
          { question: "Can you convert a commercial space?", answer: "Yes, but you need to check the designated use, co-ownership rules if applicable, and ERP accessibility standards. Conversion costs typically range from €500 to €1,500/sqm." },
          { question: "Should you buy or rent?", answer: "Renting offers flexibility, especially at the start. Buying builds equity but requires significant capital. Shared spaces often offer the best compromise." },
          { question: "Are shared spaces suitable for all professions?", answer: "Most consultation-based professions work very well in shared settings: psychology, osteopathy, dietetics, sophrology, naturopathy, speech therapy and more." },
        ];

  if (lang === "en") {
    return (
      <InsightArticleTemplate
        title="How to find a medical or paramedical office in Bordeaux | I‑CA.RE"
        description="A practical guide for care and wellbeing practitioners looking for an office in Bordeaux: location, size, budget, regulations, shared spaces."
        path="/en/insights/medical-office-bordeaux"
        heroImage={peyBerlandFacade}
        heroImageAlt="Elegant heritage building for healthcare offices – I-CA.RE Bordeaux"
        articleTitle="How to find a medical or paramedical office in Bordeaux"
        intro="Finding the right office in Bordeaux is a challenge many practitioners face. The market is tight for small spaces suited to healthcare and wellbeing professions, and the available options are not always visible or easy to evaluate. Location, size, regulatory compliance and overall budget must all be considered together, not in isolation."
        takeaways={[
          "Favour spaces between 11 and 18 sqm suited to your actual practice needs",
          "Choose a location consistent with your patient base, not just a premium address",
          "Check ERP accessibility compliance before committing",
          "Include renovation costs in your overall budget from the start",
          "Consider shared care spaces to optimise quality, cost and set-up time",
          "Visit multiple options and compare objectively before deciding",
        ]}
        toc={[
          { id: "market", label: "Why the market is tight in Bordeaux" },
          { id: "location", label: "What makes a good location" },
          { id: "space", label: "How much space do you need" },
          { id: "erp", label: "Accessibility and ERP standards" },
          { id: "budget", label: "What budget to plan" },
          { id: "shared", label: "Why shared care spaces are worth considering" },
          { id: "mistakes", label: "Common mistakes to avoid" },
          { id: "conclusion", label: "A structured approach makes the difference" },
        ]}
        keyFigures={keyFigures}
        faq={faq}
        ctaPrimaryRoute="locationBordeaux"
        ctaPrimaryLabel="Find an office"
        ctaSecondaryRoute="contact"
        ctaSecondaryLabel="Get in touch"
        relatedGuides={relatedGuides}
      >
        <section id="market">
          <h2 className="text-xl font-heading font-bold mb-3">Why the market is tight in Bordeaux</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Bordeaux has seen sustained demand for small healthcare-suitable spaces. Units between 10 and 25 sqm are rare on the open market, and many existing premises require significant work to meet current standards, particularly accessibility and acoustic insulation.</p>
          <p className="text-muted-foreground leading-relaxed">Most traditional commercial listings target retail or office use, not healthcare. This creates a gap: practitioners need purpose-fitted spaces, but the supply of ready-to-use offices is limited.</p>
        </section>

        <section id="location">
          <h2 className="text-xl font-heading font-bold mb-3">What makes a good location for a healthcare office</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A good location must be consistent with your activity. A busy high street is not always the best fit. For many practitioners, proximity to other health professionals, public transport, residential areas or complementary services matters more than footfall.</p>
          <p className="text-muted-foreground leading-relaxed">Consider ground-floor visibility, ease of access (parking, tram), signage possibilities and the general neighbourhood atmosphere. A calm, professional environment often suits healthcare better than a commercial one.</p>
        </section>

        <section id="space">
          <h2 className="text-xl font-heading font-bold mb-3">How much space do you actually need</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The ideal private office for most seated-practice professions is between 11 and 15 sqm. Professions requiring a treatment table or specific equipment may need 15 to 18 sqm. Access to shared common areas significantly reduces the individual space required.</p>
          <p className="text-muted-foreground leading-relaxed">A well-optimised 13 sqm office with access to quality shared spaces can be more effective than a poorly laid-out 30 sqm standalone space.</p>
        </section>

        <section id="erp">
          <h2 className="text-xl font-heading font-bold mb-3">Accessibility and ERP standards</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Any premises receiving the public must comply with ERP accessibility standards. This includes wheelchair access, adapted facilities, appropriate signage and compliant door widths. A non-compliant space can generate significant renovation costs.</p>
          <p className="text-muted-foreground leading-relaxed">Always check compliance before signing. Derogations exist for certain existing buildings, but the process takes time and is not guaranteed.</p>
        </section>

        <section id="budget">
          <h2 className="text-xl font-heading font-bold mb-3">What budget to plan</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The overall budget goes well beyond rent. Factor in deposit, renovation work, furniture, signage, insurance, charges and a cash reserve.</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li>Monthly rent: €400 to €900 for a small office</li>
            <li>Renovation costs: €500 to €1,500/sqm depending on condition</li>
            <li>Furniture and signage: €2,500 to €7,000</li>
          </ul>
          <p className="text-xs text-muted-foreground italic">These figures are indicative and vary by location, condition and type of premises.</p>
        </section>

        <section id="shared">
          <h2 className="text-xl font-heading font-bold mb-3">Why shared care spaces are worth considering</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Shared care spaces pool common functions (waiting room, reception, facilities, maintenance), across several practitioners. This reduces individual costs, improves the quality of the environment and creates natural referral networks.</p>
          <p className="text-muted-foreground leading-relaxed">For practitioners starting out or seeking flexibility, shared spaces offer a lower barrier to entry without compromising professionalism.</p>
        </section>

        <section id="mistakes">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Choosing a space based on impulse without checking regulatory compliance</li>
            <li>Underestimating renovation costs, especially ERP and acoustic upgrades</li>
            <li>Oversizing the space and paying for unused square metres</li>
            <li>Signing a lease before verifying the designated use</li>
            <li>Neglecting to plan a cash reserve for the first months</li>
            <li>Dismissing shared spaces without exploring the actual offering</li>
          </ul>
        </section>

        <section id="conclusion">
          <h2 className="text-xl font-heading font-bold mb-3">A structured approach makes the difference</h2>
          <p className="text-muted-foreground leading-relaxed">Preparing your search methodically (defining your needs, setting a realistic budget, visiting multiple options and checking all regulatory aspects), avoids the most common pitfalls. A well-prepared practitioner makes better decisions and secures a more sustainable set-up.</p>
        </section>
      </InsightArticleTemplate>
    );
  }

  return (
    <InsightArticleTemplate
      title="Comment trouver un cabinet médical ou paramédical à Bordeaux | I‑CA.RE"
      description="Guide pratique pour les praticiens du soin et du bien-être qui cherchent un cabinet à Bordeaux : emplacement, surface, budget, normes, lieux mutualisés."
      path="/insights/cabinet-medical-bordeaux"
      heroImage={peyBerlandFacade}
      heroImageAlt="Immeuble patrimonial élégant pour cabinets de soins – I-CA.RE Bordeaux"
      articleTitle="Comment trouver un cabinet médical ou paramédical à Bordeaux"
      intro={<>Trouver le bon cabinet à Bordeaux est un défi que de nombreux praticiens rencontrent. Le marché est tendu pour les petites surfaces adaptées aux professions du soin et du bien-être, et les options disponibles ne sont pas toujours visibles ni faciles à évaluer. Emplacement, surface, conformité réglementaire et budget global doivent être considérés ensemble, pas séparément.</>}
      takeaways={[
        "Privilégier des surfaces entre 11 et 18\u00a0m² adaptées à vos besoins réels",
        "Choisir un emplacement cohérent avec votre patientèle",
        "Vérifier la conformité ERP et l'accessibilité avant de s'engager",
        "Intégrer le coût des travaux dans votre budget global dès le départ",
        "Envisager les espaces mutualisés pour optimiser qualité, coût et délai",
        "Visiter plusieurs options et comparer objectivement avant de décider",
      ]}
      toc={[
        { id: "marche", label: "Pourquoi le marché est tendu à Bordeaux" },
        { id: "emplacement", label: "Qu'est-ce qui fait un bon emplacement" },
        { id: "surface", label: "De quelle surface avez-vous besoin" },
        { id: "erp", label: "Accessibilité et normes ERP" },
        { id: "budget", label: "Quel budget prévoir" },
        { id: "mutualise", label: "Pourquoi envisager un espace mutualisé" },
        { id: "erreurs", label: "Les erreurs fréquentes à éviter" },
        { id: "conclusion", label: "Une approche structurée fait la différence" },
      ]}
      keyFigures={keyFigures}
      faq={faq}
      ctaPrimaryRoute="locationBordeaux"
      ctaPrimaryLabel="Trouver un cabinet"
      ctaSecondaryRoute="contact"
      ctaSecondaryLabel="Nous contacter"
      relatedGuides={relatedGuides}
    >
      <section id="marche">
        <h2 className="text-xl font-heading font-bold mb-3">Pourquoi le marché est tendu à Bordeaux</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le marché bordelais connaît une demande soutenue pour les petites surfaces adaptées aux métiers de la santé et du bien-être. Les biens entre 10 et 25&nbsp;m² sont rares sur le marché ouvert, et les locaux existants nécessitent souvent des travaux importants pour répondre aux normes actuelles.</p>
        <p className="text-muted-foreground leading-relaxed">La plupart des annonces commerciales classiques ciblent le commerce ou le bureau, pas les professions de santé. Les praticiens ont besoin d'espaces aménagés spécifiquement, mais l'offre de cabinets prêts à l'emploi reste limitée.</p>
      </section>

      <section id="emplacement">
        <h2 className="text-xl font-heading font-bold mb-3">Qu'est-ce qui fait un bon emplacement pour un cabinet</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un bon emplacement doit être cohérent avec votre activité. Une rue très passante n'est pas toujours le meilleur choix. Pour beaucoup de praticiens, la proximité d'autres professionnels de santé, des transports en commun ou de zones résidentielles compte davantage.</p>
        <p className="text-muted-foreground leading-relaxed">Pensez à la visibilité en rez-de-chaussée, à la facilité d'accès, aux possibilités de signalétique et à l'atmosphère générale du quartier. Un environnement calme et professionnel convient souvent mieux aux métiers du soin.</p>
      </section>

      <section id="surface">
        <h2 className="text-xl font-heading font-bold mb-3">De quelle surface avez-vous réellement besoin</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">La surface idéale d'un cabinet privatif se situe entre 11 et 15&nbsp;m² pour les consultations assises. Les métiers nécessitant une table de soins ont plutôt besoin de 15 à 18&nbsp;m². L'accès à des parties communes réduit significativement la surface individuelle nécessaire.</p>
        <p className="text-muted-foreground leading-relaxed">Un cabinet de 13&nbsp;m² bien optimisé avec des espaces communs de qualité peut être plus efficace qu'un local indépendant de 30&nbsp;m² mal agencé.</p>
      </section>

      <section id="erp">
        <h2 className="text-xl font-heading font-bold mb-3">Accessibilité et normes ERP</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Tout local recevant du public doit respecter les normes ERP d'accessibilité. Cela inclut l'accès PMR, des sanitaires adaptés, une signalétique appropriée et des largeurs de passage conformes.</p>
        <p className="text-muted-foreground leading-relaxed">Vérifiez toujours la conformité avant de signer. Des dérogations existent pour certains bâtiments existants, mais la procédure prend du temps et n'est pas garantie.</p>
      </section>

      <section id="budget">
        <h2 className="text-xl font-heading font-bold mb-3">Quel budget prévoir</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le budget global va bien au-delà du loyer. Il faut intégrer le dépôt de garantie, les travaux, le mobilier, la signalétique, les assurances et une trésorerie de sécurité.</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li>Loyer mensuel&nbsp;: 400 à 900&nbsp;€ pour un petit cabinet</li>
          <li>Travaux&nbsp;: 500 à 1&nbsp;500&nbsp;€/m² selon l'état du local</li>
          <li>Mobilier et signalétique&nbsp;: 2&nbsp;500 à 7&nbsp;000&nbsp;€</li>
        </ul>
        <p className="text-xs text-muted-foreground italic">Ces chiffres sont indicatifs et varient selon l'emplacement, l'état et le type de local.</p>
      </section>

      <section id="mutualise">
        <h2 className="text-xl font-heading font-bold mb-3">Pourquoi envisager un espace de soins mutualisé</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les espaces mutualisés partagent les fonctions communes (salle d'attente, accueil, sanitaires, entretien) entre plusieurs praticiens. Cela réduit les coûts individuels et améliore la qualité de l'environnement.</p>
        <p className="text-muted-foreground leading-relaxed">Pour les praticiens en début d'activité ou en recherche de flexibilité, les espaces mutualisés offrent un ticket d'entrée plus accessible sans compromettre le professionnalisme.</p>
      </section>

      <section id="erreurs">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Choisir un local sur un coup de cœur sans vérifier la conformité réglementaire</li>
          <li>Sous-estimer le coût des travaux, surtout pour les mises aux normes ERP et acoustiques</li>
          <li>Surdimensionner la surface et payer des mètres carrés inutiles</li>
          <li>Signer un bail avant d'avoir vérifié la destination du local</li>
          <li>Négliger de prévoir une trésorerie de sécurité pour les premiers mois</li>
          <li>Écarter les espaces mutualisés sans avoir exploré l'offre existante</li>
        </ul>
      </section>

      <section id="conclusion">
        <h2 className="text-xl font-heading font-bold mb-3">Une approche structurée fait la différence</h2>
        <p className="text-muted-foreground leading-relaxed">Préparer sa recherche méthodiquement (définir ses besoins, cadrer un budget réaliste, visiter plusieurs options, vérifier tous les aspects réglementaires), évite les écueils les plus courants. Un praticien bien préparé prend de meilleures décisions et sécurise une installation plus pérenne.</p>
      </section>
    </InsightArticleTemplate>
  );
}
