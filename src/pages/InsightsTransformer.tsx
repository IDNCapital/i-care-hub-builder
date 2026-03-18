import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsTransformer() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsCabinetMedical", labelFr: "Trouver un cabinet médical à Bordeaux", labelEn: "Finding a medical office in Bordeaux" },
    { routeKey: "insightsBudget", labelFr: "Quel budget pour un cabinet à Bordeaux", labelEn: "What budget for an office in Bordeaux" },
    { routeKey: "insightsSurface", labelFr: "Quelle surface pour un cabinet", labelEn: "What size for an office" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="Converting a commercial space into a medical office | I‑CA.RE"
        description="Planning rules, ERP standards, co-ownership, renovation costs: what to know before converting a commercial space into a medical or paramedical office."
        path="/en/insights/converting-commercial-space"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Can you convert a commercial space into a medical or paramedical office</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">Converting a commercial space into a medical or paramedical office is feasible, but requires attention to planning rules, building regulations and several technical constraints. Understanding these before committing avoids costly mistakes.</p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Check the designated use (destination) of the premises before signing</li>
            <li>Verify co-ownership rules if applicable</li>
            <li>ERP accessibility standards are mandatory and can be costly</li>
            <li>Ventilation, acoustics and privacy require specific attention</li>
            <li>Budget for renovation costs of €500 to €1,500/sqm or more</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">General feasibility</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">In principle, many commercial spaces can be converted into healthcare offices. However, this depends on the building's use designation, its physical characteristics and local planning rules. A ground-floor shop or office is generally a good candidate.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Planning and designated use</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">French planning law classifies premises by use (destination). A change from commercial to healthcare use may require a declaration or permit. Check with the local planning department before committing.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Co-ownership considerations</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">If the premises are part of a co-owned building, the building rules (règlement de copropriété) may restrict certain activities. Verify that healthcare use is permitted and check for any restrictions on signage, hours or patient access.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">ERP and accessibility standards</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Healthcare offices receiving the public must comply with ERP (Établissement Recevant du Public) accessibility standards. This includes wheelchair access, adapted facilities and appropriate signage. Non-compliance can lead to administrative and legal complications.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Ventilation, acoustics and privacy</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A commercial space may lack adequate ventilation for a consultation room. Acoustic insulation is essential for patient confidentiality. Privacy considerations (window treatments, layout) must be addressed early in the design process.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Renovation costs</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Conversion costs typically range from €500 to €1,500 per sqm, but can be higher for complex accessibility upgrades or significant structural work. Key cost drivers include plumbing, partitioning, acoustic treatment and finishing quality.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Timelines and key checkpoints</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A typical conversion takes 2 to 6 months, depending on the scope of work and administrative processes. Key milestones include planning approval, contractor selection, ERP compliance verification and final inspection.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Signing a lease before checking the designated use</li>
            <li>Underestimating ERP compliance costs</li>
            <li>Ignoring acoustic insulation requirements</li>
            <li>Skipping co-ownership verification</li>
            <li>Starting work before obtaining necessary approvals</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">Do I need a permit to convert a shop into an office?</p><p className="text-muted-foreground leading-relaxed">It depends on the current designated use. A change of use may require a prior declaration or a planning permit from the local authority.</p></div>
            <div><p className="font-semibold mb-1">How long does a conversion take?</p><p className="text-muted-foreground leading-relaxed">Typically 2 to 6 months, including administrative steps and renovation work.</p></div>
            <div><p className="font-semibold mb-1">Can any commercial space be converted?</p><p className="text-muted-foreground leading-relaxed">No. Physical constraints (ceiling height, access, load-bearing walls) and legal restrictions (planning rules, co-ownership) may make some spaces unsuitable.</p></div>
            <div><p className="font-semibold mb-1">Who handles the conversion process?</p><p className="text-muted-foreground leading-relaxed">You can manage it yourself, but working with professionals experienced in healthcare spaces is recommended. I‑CA.RE specialises in this type of conversion.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed">Converting a commercial space is a viable path to a well-located healthcare office, provided you check all regulatory, technical and financial aspects upfront. A methodical approach avoids the most common pitfalls.</p>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Transformer un local commercial en cabinet médical | I‑CA.RE"
      description="Urbanisme, normes ERP, copropriété, coût des travaux : ce qu'il faut savoir pour transformer un local commercial en cabinet médical ou paramédical."
      path="/insights/transformer-local-en-cabinet"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Peut-on transformer un local commercial en cabinet médical ou paramédical</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">Transformer un local commercial en cabinet médical ou paramédical est faisable, mais nécessite de maîtriser les règles d'urbanisme, les normes du bâtiment et plusieurs contraintes techniques. Bien les comprendre en amont évite des erreurs coûteuses.</p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Vérifier la destination du local avant de signer</li>
          <li>Consulter le règlement de copropriété si applicable</li>
          <li>Les normes ERP d'accessibilité sont obligatoires et peuvent être coûteuses</li>
          <li>Ventilation, acoustique et intimité nécessitent une attention particulière</li>
          <li>Prévoir un budget travaux de 500 à 1&nbsp;500&nbsp;€/m² ou plus</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Faisabilité générale</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">En principe, de nombreux locaux commerciaux peuvent être transformés en cabinets de santé. Toutefois, cela dépend de la destination du bâtiment, de ses caractéristiques physiques et des règles d'urbanisme locales. Un commerce ou bureau en rez-de-chaussée est généralement un bon candidat.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Urbanisme et destination du local</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le droit de l'urbanisme classe les locaux par destination. Un changement de destination peut nécessiter une déclaration préalable ou un permis. Consultez le service d'urbanisme de la commune avant de vous engager.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Copropriété</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Si le local fait partie d'une copropriété, le règlement peut restreindre certaines activités. Vérifiez que l'usage en cabinet de santé est autorisé et qu'il n'existe pas de restrictions sur la signalétique, les horaires ou l'accès des patient / clients.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">ERP et accessibilité</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les cabinets recevant du public doivent respecter les normes ERP (Établissement Recevant du Public) d'accessibilité. Cela inclut l'accès pour les personnes à mobilité réduite, des sanitaires adaptés et une signalétique appropriée. La non-conformité peut entraîner des complications administratives et juridiques.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Ventilation, acoustique et intimité</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un local commercial peut manquer de ventilation adaptée à un cabinet de consultation. L'isolation acoustique est essentielle pour la confidentialité. Les questions d'intimité (vitrage, agencement) doivent être traitées dès la conception.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Coût potentiel des adaptations</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les coûts de transformation se situent généralement entre 500 et 1&nbsp;500&nbsp;€/m², mais peuvent être supérieurs pour des mises aux normes complexes ou des travaux structurels importants. Les principaux postes de dépense sont la plomberie, le cloisonnement, le traitement acoustique et la qualité des finitions.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Délais et points de vigilance</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Une transformation type prend 2 à 6 mois, selon l'ampleur des travaux et les démarches administratives. Les étapes clés incluent l'obtention des autorisations d'urbanisme, le choix des entreprises, la vérification de la conformité ERP et la réception finale.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Signer un bail avant d'avoir vérifié la destination du local</li>
          <li>Sous-estimer les coûts de mise aux normes ERP</li>
          <li>Ignorer les exigences d'isolation acoustique</li>
          <li>Ne pas consulter le règlement de copropriété</li>
          <li>Démarrer les travaux avant d'avoir obtenu les autorisations nécessaires</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Faut-il un permis pour transformer un commerce en cabinet&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Cela dépend de la destination actuelle. Un changement de destination peut nécessiter une déclaration préalable ou un permis auprès de la mairie.</p></div>
          <div><p className="font-semibold mb-1">Combien de temps dure une transformation&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Généralement 2 à 6 mois, incluant les démarches administratives et les travaux.</p></div>
          <div><p className="font-semibold mb-1">Tout local commercial peut-il être transformé&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Non. Des contraintes physiques (hauteur sous plafond, accès, murs porteurs) et juridiques (urbanisme, copropriété) peuvent rendre certains locaux inadaptés.</p></div>
          <div><p className="font-semibold mb-1">Qui gère le processus de transformation&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Vous pouvez le gérer vous-même, mais il est recommandé de travailler avec des professionnels expérimentés dans les espaces de santé. I‑CA.RE est spécialisé dans ce type de transformation.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">Transformer un local commercial est une voie viable vers un cabinet bien situé, à condition de vérifier en amont tous les aspects réglementaires, techniques et financiers. Une approche méthodique évite les écueils les plus courants.</p>
      </section>
    </InsightLayout>
  );
}
