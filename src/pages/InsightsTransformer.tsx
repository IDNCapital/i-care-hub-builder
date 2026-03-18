import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsTransformer() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsBudget", labelFr: "Quel budget pour un cabinet à Bordeaux", labelEn: "What budget for an office in Bordeaux" },
    { routeKey: "insightsSurface", labelFr: "Quelle surface pour un cabinet", labelEn: "What size for an office" },
    { routeKey: "insightsCabinetMedical", labelFr: "Trouver un cabinet médical à Bordeaux", labelEn: "Finding a medical office in Bordeaux" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="Converting a commercial space into a medical office | I‑CA.RE"
        description="Planning rules, designated use, ERP standards, co-ownership, acoustics, costs and timelines: a step-by-step guide for practitioners considering space conversion."
        path="/en/insights/converting-commercial-space"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Can you convert a commercial space into a medical or paramedical office</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">You've found a well-located commercial space and you're wondering whether it could become your consulting room. The short answer is often yes — but the path from commercial space to healthcare office involves regulatory checks, technical adaptations and a realistic budget. Understanding each step before committing protects you from costly mistakes.</p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Always check the designated use (destination) of the premises before signing anything</li>
            <li>Verify co-ownership rules — healthcare use may be restricted or require approval</li>
            <li>ERP accessibility standards are mandatory and can represent a significant cost</li>
            <li>Acoustic insulation, ventilation and patient privacy require specific treatment</li>
            <li>Conversion costs typically range from €500 to €1,500/sqm — more for complex cases</li>
            <li>Allow 2 to 6 months for the full process including administrative steps</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Is your space suitable for conversion?</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Not every commercial space is a good candidate. The best options are typically ground-floor units with street access, adequate ceiling height (at least 2.50m), natural light and a layout that can accommodate a consultation room, entrance and — if not shared — a small waiting area.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Spaces in basements, units without direct access, or very narrow configurations are generally unsuitable. Load-bearing walls, column positions and window placements also constrain the possible layout.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Step 1: Check the designated use (destination)</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">French planning law classifies premises by designated use. Converting from "commercial" to "healthcare" may require a prior declaration (déclaration préalable) or, in some cases, a planning permit (permis de construire). The local planning department (service d'urbanisme) at the town hall can confirm the current classification and the steps required.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Tip: request this information in writing before signing any lease or purchase agreement. A verbal confirmation is not sufficient to protect you.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Step 2: Verify co-ownership rules</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">If the premises are part of a co-owned building, the building rules (règlement de copropriété) may restrict certain activities or require general assembly approval. Check specifically for restrictions on healthcare use, signage, hours of operation and patient access (particularly if shared hallways or lifts are involved).</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Step 3: Assess ERP accessibility compliance</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Any premises receiving the public must comply with ERP (Établissement Recevant du Public) accessibility standards. This includes wheelchair access, compliant door widths (minimum 90cm), adapted facilities, appropriate signage and potentially a ramp or lift.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">For existing buildings, derogations (Ad'AP — Agenda d'Accessibilité Programmée) may be available, but the application process takes time and approval is not guaranteed. Budget for full compliance as a default and treat any derogation as a bonus.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Step 4: Address acoustics, ventilation and privacy</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Consultation rooms require specific attention to:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li><strong>Acoustic insulation:</strong> conversations must remain private. Partition walls, ceiling treatment and door seals are key</li>
            <li><strong>Ventilation:</strong> commercial spaces may lack adequate air renewal for a consultation room. Mechanical ventilation may be needed</li>
            <li><strong>Visual privacy:</strong> ground-floor windows may require frosting, curtains or repositioned layouts to protect patient dignity</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">These elements are often underestimated but directly affect patient / client comfort and regulatory compliance.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">What will it cost?</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Conversion costs depend heavily on the initial condition of the space and the scope of work required:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li><strong>Light adaptation</strong> (cosmetic work, minor partitioning): €500–800/sqm</li>
            <li><strong>Standard conversion</strong> (partitioning, plumbing, acoustics, basic ERP): €800–1,200/sqm</li>
            <li><strong>Full renovation</strong> (structural changes, full ERP compliance, high-quality finishes): €1,200–1,500+/sqm</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">Key cost drivers: plumbing (adding a water point), acoustic treatment, accessibility upgrades, electrical rewiring and finish quality. Always add a 10–15% contingency margin.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">How long does it take?</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A typical conversion timeline:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li>Administrative checks and approvals: 1 to 3 months</li>
            <li>Design and contractor selection: 2 to 4 weeks</li>
            <li>Renovation work: 4 to 12 weeks depending on scope</li>
            <li>Final inspections and compliance verification: 1 to 2 weeks</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">Total: 2 to 6 months from initial decision to opening. The administrative steps are often the longest part — start them early.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Signing a lease before checking the designated use and co-ownership rules</li>
            <li>Underestimating ERP compliance costs — accessibility upgrades alone can reach €5,000–15,000</li>
            <li>Ignoring acoustic insulation — patient confidentiality is non-negotiable</li>
            <li>Starting work before obtaining all necessary approvals</li>
            <li>Not budgeting for a contingency margin (10–15% of total works)</li>
            <li>Assuming all ground-floor commercial spaces are automatically suitable</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">Do I need a permit to convert a shop into a healthcare office?</p><p className="text-muted-foreground leading-relaxed">It depends on the current designated use. A change of use typically requires a prior declaration or planning permit from the local authority. Check with the town hall before committing.</p></div>
            <div><p className="font-semibold mb-1">How long does a conversion take?</p><p className="text-muted-foreground leading-relaxed">Typically 2 to 6 months, including administrative steps (1–3 months) and renovation work (1–3 months). Complex projects may take longer.</p></div>
            <div><p className="font-semibold mb-1">Can any commercial space be converted?</p><p className="text-muted-foreground leading-relaxed">No. Physical constraints (ceiling height, access, load-bearing walls, natural light), legal restrictions (planning rules, co-ownership) and accessibility requirements may make some spaces unsuitable.</p></div>
            <div><p className="font-semibold mb-1">What are the biggest hidden costs?</p><p className="text-muted-foreground leading-relaxed">ERP accessibility upgrades, acoustic insulation and plumbing (adding water points) are the most commonly underestimated items. Always get detailed quotes before committing.</p></div>
            <div><p className="font-semibold mb-1">Is it simpler to join a shared space instead?</p><p className="text-muted-foreground leading-relaxed">Often, yes. Shared spaces are already fitted out, compliant and ready to use. For practitioners who want to avoid the complexity and cost of conversion, they offer a practical alternative.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed">Converting a commercial space into a healthcare office is a viable path to a well-located practice, provided you check all regulatory, technical and financial aspects methodically. If the complexity or cost seems disproportionate, shared care spaces offer a ready-made alternative that lets you focus on your practice rather than on construction management.</p>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Transformer un local commercial en cabinet médical | I‑CA.RE"
      description="Urbanisme, destination, ERP, copropriété, acoustique, coûts et délais : guide étape par étape pour transformer un local commercial en cabinet médical ou paramédical."
      path="/insights/transformer-local-en-cabinet"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Peut-on transformer un local commercial en cabinet médical ou paramédical</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">Vous avez repéré un local commercial bien situé et vous vous demandez s'il pourrait devenir votre cabinet. La réponse est souvent oui — mais le chemin entre local commercial et cabinet de soins passe par des vérifications réglementaires, des adaptations techniques et un budget réaliste. Comprendre chaque étape avant de s'engager protège contre les erreurs coûteuses.</p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Toujours vérifier la destination du local (usage autorisé) avant de signer quoi que ce soit</li>
          <li>Consulter le règlement de copropriété — l'usage santé peut être restreint ou soumis à approbation</li>
          <li>Les normes ERP d'accessibilité sont obligatoires et peuvent représenter un coût significatif</li>
          <li>L'isolation acoustique, la ventilation et l'intimité du patient / client nécessitent un traitement spécifique</li>
          <li>Coûts de transformation&nbsp;: 500 à 1&nbsp;500&nbsp;€/m² en général — davantage pour les cas complexes</li>
          <li>Prévoir 2 à 6 mois pour l'ensemble du processus, démarches administratives incluses</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Votre local est-il adapté à une transformation&nbsp;?</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Tous les locaux commerciaux ne sont pas de bons candidats. Les meilleurs sont généralement des rez-de-chaussée avec accès direct sur rue, une hauteur sous plafond suffisante (au moins 2,50&nbsp;m), de la lumière naturelle et une configuration permettant d'aménager un cabinet de consultation, une entrée et — si le local n'est pas en espace partagé — un petit espace d'attente.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Les locaux en sous-sol, sans accès direct ou en configuration très étroite sont généralement inadaptés. Les murs porteurs, les poteaux et les positions de fenêtres contraignent aussi l'agencement possible.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Étape 1&nbsp;: vérifier la destination du local</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le droit de l'urbanisme classe les locaux par destination. Le passage de «&nbsp;commercial&nbsp;» à «&nbsp;santé&nbsp;» peut nécessiter une déclaration préalable ou, dans certains cas, un permis de construire. Le service d'urbanisme de la mairie peut confirmer la classification actuelle et les démarches requises.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Conseil&nbsp;: demandez cette information par écrit avant de signer tout bail ou compromis d'achat. Une confirmation orale ne vous protège pas.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Étape 2&nbsp;: consulter le règlement de copropriété</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Si le local fait partie d'une copropriété, le règlement peut restreindre certaines activités ou exiger l'approbation de l'assemblée générale. Vérifiez spécifiquement les restrictions sur l'usage santé, la signalétique, les horaires d'ouverture et l'accès des patient / clients (notamment si des couloirs ou ascenseurs communs sont impliqués).</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Étape 3&nbsp;: évaluer la conformité ERP</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Tout local recevant du public doit respecter les normes ERP d'accessibilité. Cela inclut l'accès pour les personnes à mobilité réduite, des largeurs de portes conformes (minimum 90&nbsp;cm), des sanitaires adaptés, une signalétique appropriée et éventuellement une rampe ou un ascenseur.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Pour les bâtiments existants, des dérogations (Ad'AP — Agenda d'Accessibilité Programmée) sont possibles, mais la procédure prend du temps et l'approbation n'est pas garantie. Budgétisez la mise aux normes complète par défaut et considérez toute dérogation comme un bonus.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Étape 4&nbsp;: traiter l'acoustique, la ventilation et l'intimité</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les cabinets de consultation nécessitent une attention particulière&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li><strong>Isolation acoustique&nbsp;:</strong> les conversations doivent rester confidentielles. Cloisons, traitement du plafond et joints de portes sont essentiels</li>
          <li><strong>Ventilation&nbsp;:</strong> un local commercial peut manquer de renouvellement d'air adapté à un cabinet. Une ventilation mécanique peut être nécessaire</li>
          <li><strong>Intimité visuelle&nbsp;:</strong> les vitrines en rez-de-chaussée peuvent nécessiter un vitrage opaque, des rideaux ou un réagencement pour protéger la dignité du patient / client</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-3">Ces éléments sont souvent sous-estimés mais affectent directement le confort du patient / client et la conformité réglementaire.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Combien ça coûte&nbsp;?</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le coût de transformation dépend fortement de l'état initial du local et de l'ampleur des travaux&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li><strong>Adaptation légère</strong> (travaux esthétiques, cloisonnement mineur)&nbsp;: 500–800&nbsp;€/m²</li>
          <li><strong>Transformation standard</strong> (cloisonnement, plomberie, acoustique, ERP basique)&nbsp;: 800–1&nbsp;200&nbsp;€/m²</li>
          <li><strong>Rénovation complète</strong> (modifications structurelles, conformité ERP totale, finitions haut de gamme)&nbsp;: 1&nbsp;200–1&nbsp;500+&nbsp;€/m²</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-3">Postes principaux&nbsp;: plomberie (ajout d'un point d'eau), traitement acoustique, mises aux normes d'accessibilité, mise à niveau électrique et qualité des finitions. Prévoyez toujours une marge de 10 à 15&nbsp;%.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Combien de temps faut-il&nbsp;?</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Calendrier type d'une transformation&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li>Vérifications et autorisations administratives&nbsp;: 1 à 3 mois</li>
          <li>Conception et choix des entreprises&nbsp;: 2 à 4 semaines</li>
          <li>Travaux de rénovation&nbsp;: 4 à 12 semaines selon l'ampleur</li>
          <li>Réceptions et vérifications de conformité&nbsp;: 1 à 2 semaines</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-3">Total&nbsp;: 2 à 6 mois de la décision initiale à l'ouverture. Les étapes administratives sont souvent les plus longues — lancez-les en premier.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Signer un bail avant d'avoir vérifié la destination et le règlement de copropriété</li>
          <li>Sous-estimer les coûts de mise aux normes ERP — les seules adaptations d'accessibilité peuvent atteindre 5&nbsp;000 à 15&nbsp;000&nbsp;€</li>
          <li>Ignorer l'isolation acoustique — la confidentialité du patient / client est non négociable</li>
          <li>Démarrer les travaux avant d'avoir obtenu toutes les autorisations nécessaires</li>
          <li>Ne pas budgétiser de marge pour imprévus (10 à 15&nbsp;% du total des travaux)</li>
          <li>Supposer que tout local commercial en rez-de-chaussée est automatiquement transformable</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Faut-il un permis pour transformer un commerce en cabinet&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Cela dépend de la destination actuelle. Un changement de destination nécessite généralement une déclaration préalable ou un permis auprès de la mairie. Consultez le service d'urbanisme avant de vous engager.</p></div>
          <div><p className="font-semibold mb-1">Combien de temps dure une transformation&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Généralement 2 à 6 mois, incluant les démarches administratives (1–3 mois) et les travaux (1–3 mois). Les projets complexes peuvent être plus longs.</p></div>
          <div><p className="font-semibold mb-1">Tout local commercial peut-il être transformé&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Non. Des contraintes physiques (hauteur sous plafond, accès, murs porteurs, lumière naturelle), juridiques (urbanisme, copropriété) et normatives (accessibilité) peuvent rendre certains locaux inadaptés.</p></div>
          <div><p className="font-semibold mb-1">Quels sont les coûts cachés les plus fréquents&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Les mises aux normes ERP, l'isolation acoustique et la plomberie (ajout de points d'eau) sont les postes les plus souvent sous-estimés. Demandez toujours des devis détaillés avant de vous engager.</p></div>
          <div><p className="font-semibold mb-1">Est-il plus simple de rejoindre un espace mutualisé&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Souvent, oui. Les espaces mutualisés sont déjà aménagés, conformes et prêts à l'usage. Pour les praticiens qui veulent éviter la complexité et le coût d'une transformation, ils offrent une alternative concrète.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">Transformer un local commercial en cabinet de soins est une voie viable vers un exercice bien situé, à condition de vérifier méthodiquement tous les aspects réglementaires, techniques et financiers. Si la complexité ou le coût semble disproportionné, les espaces de soins mutualisés offrent une alternative clé en main qui vous permet de vous concentrer sur votre pratique plutôt que sur la gestion de travaux.</p>
      </section>
    </InsightLayout>
  );
}
