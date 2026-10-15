import { InsightArticleTemplate } from "@/components/InsightArticleTemplate";
import { useTranslation } from "react-i18next";
import chartronsFacade from "@/assets/chartrons/facade.webp";

export default function InsightsTransformer() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedGuides =
    lang === "fr"
      ? [
          { routeKey: "insightsBudget", title: "Quel budget pour un cabinet à Bordeaux", description: "Loyer, dépôt, travaux, mobilier : tour d'horizon détaillé des coûts." },
          { routeKey: "insightsSurface", title: "Quelle surface pour un cabinet", description: "De 11 à 18 m² selon votre métier." },
          { routeKey: "insightsCabinetMedical", title: "Trouver un cabinet médical à Bordeaux", description: "Emplacement, surface, normes : guide complet." },
        ]
      : [
          { routeKey: "insightsBudget", title: "What budget for an office in Bordeaux", description: "Rent, deposit, renovations: detailed cost breakdown." },
          { routeKey: "insightsSurface", title: "What size for an office", description: "From 11 to 18 sqm by profession." },
          { routeKey: "insightsCabinetMedical", title: "Finding a medical office in Bordeaux", description: "Location, size, standards: a complete guide." },
        ];

  const keyFigures =
    lang === "fr"
      ? [
          { label: "Adaptation légère", value: "500 à 800 €/m²" },
          { label: "Transformation standard", value: "800 à 1 200 €/m²" },
          { label: "Rénovation complète", value: "1 200 à 1 500+ €/m²" },
          { label: "Délai total", value: "2 à 6 mois" },
          { label: "Hauteur sous plafond min.", value: "2,50 m" },
          { label: "Largeur de porte ERP", value: "90 cm minimum" },
        ]
      : [
          { label: "Light adaptation", value: "€500 to 800/sqm" },
          { label: "Standard conversion", value: "€800 to 1,200/sqm" },
          { label: "Full renovation", value: "€1,200 to 1,500+/sqm" },
          { label: "Total timeline", value: "2 to 6 months" },
          { label: "Min. ceiling height", value: "2.50m" },
          { label: "ERP door width", value: "90cm minimum" },
        ];

  const faq =
    lang === "fr"
      ? [
          { question: "Faut-il un permis pour transformer un commerce en cabinet\u00a0?", answer: "Cela dépend de la destination actuelle. Un changement de destination nécessite généralement une déclaration préalable ou un permis auprès de la mairie." },
          { question: "Combien de temps dure une transformation\u00a0?", answer: "Généralement 2 à 6 mois, incluant les démarches administratives (1 à 3 mois) et les travaux (1 à 3 mois)." },
          { question: "Tout local commercial peut-il être transformé\u00a0?", answer: "Non. Des contraintes physiques, juridiques et normatives peuvent rendre certains locaux inadaptés." },
          { question: "Quels sont les coûts cachés les plus fréquents\u00a0?", answer: "Les mises aux normes ERP, l'isolation acoustique et la plomberie sont les postes les plus souvent sous-estimés." },
          { question: "Est-il plus simple de rejoindre un espace mutualisé\u00a0?", answer: "Souvent, oui. Les espaces mutualisés sont déjà aménagés, conformes et prêts à l'usage." },
        ]
      : [
          { question: "Do I need a permit to convert a shop?", answer: "It depends on the current designated use. A change of use typically requires a prior declaration or planning permit from the local authority." },
          { question: "How long does a conversion take?", answer: "Typically 2 to 6 months, including administrative steps (1 to 3 months) and renovation work (1 to 3 months)." },
          { question: "Can any commercial space be converted?", answer: "No. Physical, legal and regulatory constraints may make some spaces unsuitable." },
          { question: "What are the biggest hidden costs?", answer: "ERP accessibility upgrades, acoustic insulation and plumbing are the most commonly underestimated items." },
          { question: "Is it simpler to join a shared space?", answer: "Often, yes. Shared spaces are already fitted out, compliant and ready to use." },
        ];

  if (lang === "en") {
    return (
      <InsightArticleTemplate
        title="Converting a commercial space into a medical office | I‑CA.RE"
        description="Planning rules, designated use, ERP standards, co-ownership, acoustics, costs and timelines: a step-by-step guide for practitioners considering space conversion."
        path="/en/insights/converting-commercial-space"
        heroImage={chartronsFacade}
        heroImageAlt="Facade of the I‑CA.RE Chartrons practice in Bordeaux, a former commercial unit converted into a practice"
        articleTitle="Can you convert a commercial space into a medical or paramedical office"
        intro="You've found a well-located commercial space and you're wondering whether it could become your consulting room. The short answer is often yes, but the path involves regulatory checks, technical adaptations and a realistic budget. Understanding each step before committing protects you from costly mistakes."
        takeaways={[
          "Always check the designated use of the premises before signing",
          "Verify co-ownership rules, healthcare use may be restricted",
          "ERP accessibility standards are mandatory and can be costly",
          "Acoustic insulation, ventilation and privacy require specific treatment",
          "Conversion costs: €500 to €1,500/sqm, more for complex cases",
          "Allow 2 to 6 months for the full process",
        ]}
        toc={[
          { id: "suitability", label: "Is your space suitable for conversion?" },
          { id: "destination", label: "Step 1: Check the designated use" },
          { id: "co-ownership", label: "Step 2: Verify co-ownership rules" },
          { id: "erp", label: "Step 3: Assess ERP accessibility" },
          { id: "acoustics", label: "Step 4: Acoustics, ventilation and privacy" },
          { id: "costs", label: "What will it cost?" },
          { id: "timeline", label: "How long does it take?" },
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
        <section id="suitability">
          <h2 className="text-xl font-heading font-bold mb-3">Is your space suitable for conversion?</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The best candidates are ground-floor units with street access, adequate ceiling height (at least 2.50m), natural light and a suitable layout.</p>
          <p className="text-muted-foreground leading-relaxed">Basements, units without direct access, or very narrow spaces are generally unsuitable.</p>
        </section>

        <section id="destination">
          <h2 className="text-xl font-heading font-bold mb-3">Step 1: Check the designated use</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Converting from "commercial" to "healthcare" may require a prior declaration or planning permit. The local planning department can confirm requirements.</p>
          <p className="text-muted-foreground leading-relaxed">Request this information in writing before signing any lease or purchase agreement.</p>
        </section>

        <section id="co-ownership">
          <h2 className="text-xl font-heading font-bold mb-3">Step 2: Verify co-ownership rules</h2>
          <p className="text-muted-foreground leading-relaxed">Building rules may restrict healthcare activities or require general assembly approval. Check specifically for restrictions on healthcare use, signage and patient access.</p>
        </section>

        <section id="erp">
          <h2 className="text-xl font-heading font-bold mb-3">Step 3: Assess ERP accessibility compliance</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">ERP standards include wheelchair access, compliant door widths (min 90cm), adapted facilities and appropriate signage.</p>
          <p className="text-muted-foreground leading-relaxed">Budget for full compliance as a default and treat any derogation as a bonus.</p>
        </section>

        <section id="acoustics">
          <h2 className="text-xl font-heading font-bold mb-3">Step 4: Address acoustics, ventilation and privacy</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li><strong>Acoustic insulation:</strong> conversations must remain private</li>
            <li><strong>Ventilation:</strong> commercial spaces may lack adequate air renewal</li>
            <li><strong>Visual privacy:</strong> ground-floor windows may require frosting</li>
          </ul>
        </section>

        <section id="costs">
          <h2 className="text-xl font-heading font-bold mb-3">What will it cost?</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li><strong>Light adaptation:</strong> €500 to 800/sqm</li>
            <li><strong>Standard conversion:</strong> €800 to 1,200/sqm</li>
            <li><strong>Full renovation:</strong> €1,200 to 1,500+/sqm</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">Always add a 10 to 15% contingency margin.</p>
        </section>

        <section id="timeline">
          <h2 className="text-xl font-heading font-bold mb-3">How long does it take?</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li>Administrative checks: 1 to 3 months</li>
            <li>Design and contractors: 2 to 4 weeks</li>
            <li>Renovation work: 4 to 12 weeks</li>
            <li>Final inspections: 1 to 2 weeks</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">Total: 2 to 6 months. Start administrative steps early.</p>
        </section>

        <section id="mistakes">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Signing a lease before checking designated use and co-ownership rules</li>
            <li>Underestimating ERP compliance costs (€5,000 to 15,000 for accessibility alone)</li>
            <li>Ignoring acoustic insulation, confidentiality is non-negotiable</li>
            <li>Starting work before obtaining all approvals</li>
            <li>Not budgeting a contingency margin (10 to 15%)</li>
            <li>Assuming all ground-floor spaces are suitable</li>
          </ul>
        </section>
      </InsightArticleTemplate>
    );
  }

  return (
    <InsightArticleTemplate
      title="Transformer un local commercial en cabinet médical | I‑CA.RE"
      description="Urbanisme, destination, ERP, copropriété, acoustique, coûts et délais : guide étape par étape pour transformer un local commercial en cabinet."
      path="/insights/transformer-local-en-cabinet"
      heroImage={chartronsFacade}
      heroImageAlt="Façade du cabinet I‑CA.RE Chartrons à Bordeaux, ancien local commercial transformé en cabinet"
      articleTitle="Peut-on transformer un local commercial en cabinet médical ou paramédical"
      intro={<>Vous avez repéré un local commercial bien situé et vous vous demandez s'il pourrait devenir votre cabinet. La réponse est souvent oui, mais le chemin passe par des vérifications réglementaires, des adaptations techniques et un budget réaliste. Comprendre chaque étape avant de s'engager protège contre les erreurs coûteuses.</>}
      takeaways={[
        "Toujours vérifier la destination du local avant de signer quoi que ce soit",
        "Consulter le règlement de copropriété, l'usage santé peut être restreint",
        "Les normes ERP d'accessibilité sont obligatoires et peuvent coûter cher",
        "Acoustique, ventilation et intimité nécessitent un traitement spécifique",
        "Coûts de transformation\u00a0: 500 à 1\u00a0500\u00a0€/m² en général",
        "Prévoir 2 à 6 mois pour l'ensemble du processus",
      ]}
      toc={[
        { id: "aptitude", label: "Votre local est-il adapté ?" },
        { id: "destination", label: "Étape 1 : vérifier la destination du local" },
        { id: "copropriete", label: "Étape 2 : consulter le règlement de copropriété" },
        { id: "erp", label: "Étape 3 : évaluer la conformité ERP" },
        { id: "acoustique", label: "Étape 4 : acoustique, ventilation et intimité" },
        { id: "couts", label: "Combien ça coûte ?" },
        { id: "delais", label: "Combien de temps faut-il ?" },
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
      <section id="aptitude">
        <h2 className="text-xl font-heading font-bold mb-3">Votre local est-il adapté à une transformation&nbsp;?</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les meilleurs candidats sont des rez-de-chaussée avec accès direct, une hauteur sous plafond d'au moins 2,50&nbsp;m, de la lumière naturelle et une configuration adaptée.</p>
        <p className="text-muted-foreground leading-relaxed">Les sous-sols, les locaux sans accès direct ou en configuration très étroite sont généralement inadaptés.</p>
      </section>

      <section id="destination">
        <h2 className="text-xl font-heading font-bold mb-3">Étape 1&nbsp;: vérifier la destination du local</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le passage de «&nbsp;commercial&nbsp;» à «&nbsp;santé&nbsp;» peut nécessiter une déclaration préalable ou un permis de construire. Consultez le service d'urbanisme de la mairie.</p>
        <p className="text-muted-foreground leading-relaxed">Demandez cette information par écrit avant de signer tout bail ou compromis.</p>
      </section>

      <section id="copropriete">
        <h2 className="text-xl font-heading font-bold mb-3">Étape 2&nbsp;: consulter le règlement de copropriété</h2>
        <p className="text-muted-foreground leading-relaxed">Le règlement peut restreindre certaines activités ou exiger l'approbation de l'assemblée générale. Vérifiez les restrictions sur l'usage santé, la signalétique et l'accès des patients.</p>
      </section>

      <section id="erp">
        <h2 className="text-xl font-heading font-bold mb-3">Étape 3&nbsp;: évaluer la conformité ERP</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Normes ERP&nbsp;: accès PMR, largeurs de portes conformes (min 90&nbsp;cm), sanitaires adaptés, signalétique appropriée.</p>
        <p className="text-muted-foreground leading-relaxed">Budgétisez la mise aux normes complète par défaut.</p>
      </section>

      <section id="acoustique">
        <h2 className="text-xl font-heading font-bold mb-3">Étape 4&nbsp;: traiter l'acoustique, la ventilation et l'intimité</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li><strong>Isolation acoustique&nbsp;:</strong> confidentialité des conversations</li>
          <li><strong>Ventilation&nbsp;:</strong> renouvellement d'air adapté</li>
          <li><strong>Intimité visuelle&nbsp;:</strong> vitrines en rez-de-chaussée à traiter</li>
        </ul>
      </section>

      <section id="couts">
        <h2 className="text-xl font-heading font-bold mb-3">Combien ça coûte&nbsp;?</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li><strong>Adaptation légère&nbsp;:</strong> 500 à 800&nbsp;€/m²</li>
          <li><strong>Transformation standard&nbsp;:</strong> 800 à 1&nbsp;200&nbsp;€/m²</li>
          <li><strong>Rénovation complète&nbsp;:</strong> 1&nbsp;200 à 1&nbsp;500+&nbsp;€/m²</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">Prévoyez toujours une marge de 10 à 15&nbsp;%.</p>
      </section>

      <section id="delais">
        <h2 className="text-xl font-heading font-bold mb-3">Combien de temps faut-il&nbsp;?</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li>Vérifications administratives&nbsp;: 1 à 3 mois</li>
          <li>Conception et entreprises&nbsp;: 2 à 4 semaines</li>
          <li>Travaux&nbsp;: 4 à 12 semaines</li>
          <li>Réceptions et conformité&nbsp;: 1 à 2 semaines</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">Total&nbsp;: 2 à 6 mois. Lancez les démarches administratives en premier.</p>
      </section>

      <section id="erreurs">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Signer un bail avant d'avoir vérifié la destination et la copropriété</li>
          <li>Sous-estimer les coûts ERP, les adaptations d'accessibilité seules peuvent atteindre 5&nbsp;000 à 15&nbsp;000&nbsp;€</li>
          <li>Ignorer l'isolation acoustique, la confidentialité est non négociable</li>
          <li>Démarrer les travaux avant d'avoir toutes les autorisations</li>
          <li>Ne pas budgétiser de marge pour imprévus (10 à 15&nbsp;%)</li>
          <li>Supposer que tout rez-de-chaussée commercial est automatiquement transformable</li>
        </ul>
      </section>
    </InsightArticleTemplate>
  );
}
