import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsBudget() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsCabinetMedical", labelFr: "Trouver un cabinet médical à Bordeaux", labelEn: "Finding a medical office in Bordeaux" },
    { routeKey: "insightsSurface", labelFr: "Quelle surface pour un cabinet", labelEn: "What size for an office" },
    { routeKey: "insightsLouerAcheter", labelFr: "Louer ou acheter son cabinet", labelEn: "Rent or buy your office" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="What budget to plan for a medical office in Bordeaux | I‑CA.RE"
        description="Rent, deposit, renovations, furniture, insurance, cash reserve: a detailed, realistic breakdown of costs for opening a medical or paramedical office in Bordeaux."
        path="/en/insights/office-budget-bordeaux"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
          What budget to plan for opening a medical or paramedical office in Bordeaux
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">How much does it really cost to set up as a practitioner in Bordeaux? The answer goes well beyond rent. Between deposit, renovations, furniture, insurance and cash reserves, the total budget can vary significantly depending on whether you choose a standalone office or a shared care space.</p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Always distinguish between one-off set-up costs and recurring monthly charges</li>
            <li>Renovation costs range from €500 to €1,500/sqm — sometimes more for ERP upgrades</li>
            <li>A cash reserve covering 3 to 6 months of fixed costs is essential</li>
            <li>Furniture, signage and insurance are often underestimated</li>
            <li>Shared spaces can reduce the initial outlay by 30 to 50% compared to a standalone set-up</li>
            <li>Build your budget before choosing your space, not the other way around</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">How to structure your budget</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A well-prepared budget separates three categories: one-off set-up costs (deposit, renovations, furniture, signage), recurring costs (rent, charges, insurance, maintenance) and a cash reserve for the ramp-up period. This distinction helps avoid confusing total investment with monthly outgoings.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Start by listing every foreseeable expense, then add a 10 to 15% contingency margin for unexpected costs. A realistic budget prepared before signing is your best protection against costly surprises.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Rent or acquisition: the main commitment</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">In Bordeaux, monthly rent for a small healthcare office typically ranges from €400 to €900, depending on location, quality and size. City-centre locations tend towards the upper end; peripheral areas offer more affordable options.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Buying is also possible but requires a much higher initial outlay — typically €2,000 to €4,000/sqm in Bordeaux, plus notary fees (7 to 8%) and potential renovation costs. For most early-career practitioners, renting or joining a shared space is the safer entry point.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Deposit and upfront payments</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A deposit equivalent to 1 to 3 months' rent is standard for commercial leases. Some landlords also require advance rent (first and last month). In a shared space, the deposit is typically lower — often limited to 1 month.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Renovation and fit-out costs</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Renovation work varies widely. Light cosmetic work (painting, flooring) may cost €500/sqm. Full fit-out including partitioning, plumbing, acoustic treatment and ERP accessibility upgrades can reach €1,500/sqm or more.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Key cost drivers include: plumbing and water points, acoustic insulation between consulting rooms, accessibility upgrades (ramps, door widths, adapted facilities), electrical upgrades and quality of finishes.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Furniture, equipment and signage</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Furnishing a small office typically costs €2,000 to €5,000 — desk, chairs, storage, treatment table if needed. External signage (nameplate, building directory, window decals) adds €500 to €2,000. Digital presence set-up (website, online directories) should also be budgeted.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Insurance and recurring charges</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Professional liability insurance (RC Pro) is mandatory for most healthcare professions — typically €300 to €1,000/year. Premises insurance adds €200 to €500/year. Charges (common areas, water, electricity, maintenance) typically represent 15 to 25% on top of base rent.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Cash reserve: the safety net</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The first months of practice are rarely at full capacity. A cash reserve covering 3 to 6 months of fixed costs (rent, charges, insurance, loan repayments) absorbs the ramp-up period without financial stress. This reserve is often the difference between a smooth start and a difficult one.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Standalone office vs shared space: the cost comparison</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A standalone set-up requires you to bear all costs alone: full renovation, your own waiting room, facilities, maintenance. In a shared space, these costs are pooled — often reducing the initial outlay by 30 to 50%.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Example comparison for a 14 sqm office in Bordeaux:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li>Standalone: deposit €1,500–2,700 + renovations €7,000–21,000 + furniture €3,000–5,000 = total entry cost €11,500–28,700</li>
            <li>Shared space: deposit €500–900 + furniture €1,000–2,000 (space already fitted) = total entry cost €1,500–2,900</li>
          </ul>
          <p className="text-sm text-muted-foreground italic">These ranges are illustrative and depend on the specific space and its condition.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Cost variations by location in Bordeaux</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">City-centre locations (Pey-Berland, Jardin Public, Chartrons) command higher rents but offer excellent visibility and transport access. Neighbourhoods like Nansouty, Saint-Augustin or Caudéran offer more affordable rents with good residential catchments. The best choice depends on your patient / client profile and practice type.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Starting the search without a clear budget framework</li>
            <li>Underestimating renovation costs, especially ERP accessibility upgrades</li>
            <li>Forgetting about charges and insurance in monthly cost projections</li>
            <li>Failing to plan a cash reserve for the first 3 to 6 months</li>
            <li>Comparing raw rents without accounting for included vs excluded services</li>
            <li>Overinvesting in premium finishes at the expense of cash flow</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Typical cost ranges in Bordeaux</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Monthly rent: €400 to €900</li>
            <li>Deposit: 1 to 3 months' rent</li>
            <li>Renovations: €500 to €1,500/sqm</li>
            <li>Furniture: €2,000 to €5,000</li>
            <li>Signage: €500 to €2,000</li>
            <li>Insurance (RC Pro + premises): €500 to €1,500/year</li>
            <li>Cash reserve: 3 to 6 months of fixed costs</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2 italic">These figures are indicative and may vary depending on location, condition and type of premises.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">How much does it cost to open an office in Bordeaux?</p><p className="text-muted-foreground leading-relaxed">For a standalone small office: plan €10,000 to €25,000 including deposit, renovations and furniture, plus a cash reserve. In a shared space, entry costs can be as low as €1,500 to €3,000.</p></div>
            <div><p className="font-semibold mb-1">Are shared spaces cheaper?</p><p className="text-muted-foreground leading-relaxed">Yes, significantly. Shared spaces pool renovation, common area and maintenance costs. The initial outlay is typically 30 to 50% lower than a standalone set-up.</p></div>
            <div><p className="font-semibold mb-1">Can I deduct set-up costs?</p><p className="text-muted-foreground leading-relaxed">Many set-up costs are deductible depending on your tax regime (BNC, micro-BNC). Consult an accountant familiar with healthcare professions for optimised treatment.</p></div>
            <div><p className="font-semibold mb-1">How long before the office becomes profitable?</p><p className="text-muted-foreground leading-relaxed">Most practitioners reach break-even within 6 to 12 months, depending on their existing patient / client base and referral network. A well-planned cash reserve covers this transition period.</p></div>
            <div><p className="font-semibold mb-1">Should I prepare my budget before or after finding a space?</p><p className="text-muted-foreground leading-relaxed">Before. A clear budget framework helps you filter options efficiently and avoid falling for spaces that exceed your financial capacity.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed">Planning a realistic, detailed budget is the foundation of a successful set-up. By distinguishing one-off costs from recurring charges, comparing standalone and shared options, and building in a cash reserve, you can make informed decisions and start your practice with confidence.</p>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Quel budget pour un cabinet médical à Bordeaux | I‑CA.RE"
      description="Loyer, dépôt, travaux, mobilier, assurances, trésorerie : un tour d'horizon détaillé et réaliste des coûts pour ouvrir un cabinet médical ou paramédical à Bordeaux."
      path="/insights/budget-cabinet-bordeaux"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
        Quel budget prévoir pour ouvrir un cabinet médical ou paramédical à Bordeaux
      </h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">Combien coûte réellement une installation à Bordeaux&nbsp;? La réponse va bien au-delà du loyer. Entre dépôt de garantie, travaux, mobilier, assurances et trésorerie de sécurité, le budget total peut varier considérablement selon que vous choisissez un cabinet indépendant ou un espace de soins mutualisé.</p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Toujours distinguer coûts ponctuels d'installation et charges mensuelles récurrentes</li>
          <li>Coût des travaux&nbsp;: 500 à 1&nbsp;500&nbsp;€/m² — parfois davantage pour les mises aux normes ERP</li>
          <li>Prévoir impérativement une trésorerie de départ de 3 à 6 mois de charges fixes</li>
          <li>Mobilier, signalétique et assurances sont souvent sous-estimés</li>
          <li>Les espaces mutualisés peuvent réduire le ticket d'entrée de 30 à 50&nbsp;% par rapport à une installation seul</li>
          <li>Construire son budget avant de choisir son local, pas l'inverse</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Comment structurer son budget</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un budget bien préparé distingue trois catégories&nbsp;: les coûts ponctuels d'installation (dépôt, travaux, mobilier, signalétique), les charges récurrentes (loyer, charges, assurances, entretien) et une trésorerie de sécurité pour la période de montée en activité. Cette distinction évite de confondre investissement total et dépenses mensuelles.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Commencez par lister chaque dépense prévisible, puis ajoutez une marge de 10 à 15&nbsp;% pour les imprévus. Un budget réaliste préparé avant la signature est votre meilleure protection contre les surprises coûteuses.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Loyer ou acquisition&nbsp;: l'engagement principal</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">À Bordeaux, le loyer mensuel pour un petit cabinet de santé se situe généralement entre 400 et 900&nbsp;€, selon l'emplacement, la qualité et la surface. Les localisations en centre-ville tendent vers le haut de la fourchette&nbsp;; les quartiers périphériques offrent des options plus accessibles.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">L'achat est aussi possible mais mobilise un capital initial bien plus important — généralement 2&nbsp;000 à 4&nbsp;000&nbsp;€/m² à Bordeaux, plus les frais de notaire (7 à 8&nbsp;%) et les travaux éventuels. Pour la plupart des praticiens en début de carrière, la location ou l'espace mutualisé est le point d'entrée le plus sûr.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Dépôt de garantie et paiements initiaux</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un dépôt de garantie équivalent à 1 à 3 mois de loyer est standard pour un bail commercial. Certains bailleurs demandent aussi un loyer d'avance (premier et dernier mois). En espace mutualisé, le dépôt est généralement plus faible — souvent limité à 1 mois.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Coût des travaux et de l'aménagement</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le montant des travaux varie fortement. Des travaux légers (peinture, sol) peuvent coûter 500&nbsp;€/m². Un aménagement complet incluant cloisonnement, plomberie, traitement acoustique et mise aux normes ERP peut atteindre 1&nbsp;500&nbsp;€/m² ou plus.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Les principaux postes de dépense sont&nbsp;: plomberie et points d'eau, isolation acoustique entre cabinets, mises aux normes d'accessibilité (rampes, largeurs de portes, sanitaires adaptés), mise à niveau électrique et qualité des finitions.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Mobilier, équipement et signalétique</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">L'équipement d'un petit cabinet représente généralement 2&nbsp;000 à 5&nbsp;000&nbsp;€ — bureau, sièges, rangements, table de soins si nécessaire. La signalétique extérieure (plaque, annuaire de l'immeuble, vitrophanie) ajoute 500 à 2&nbsp;000&nbsp;€. La création d'une présence en ligne (site web, annuaires professionnels) doit aussi être budgétée.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Assurances et charges récurrentes</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">L'assurance responsabilité civile professionnelle (RC Pro) est obligatoire pour la plupart des professions de santé — généralement 300 à 1&nbsp;000&nbsp;€/an. L'assurance du local ajoute 200 à 500&nbsp;€/an. Les charges (parties communes, eau, électricité, entretien) représentent généralement 15 à 25&nbsp;% en sus du loyer de base.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">La trésorerie de sécurité&nbsp;: le filet indispensable</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les premiers mois d'exercice sont rarement à pleine capacité. Une trésorerie couvrant 3 à 6 mois de charges fixes (loyer, charges, assurances, remboursements de prêt) absorbe la période de montée en activité sans stress financier. Cette réserve fait souvent la différence entre un démarrage serein et un démarrage difficile.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Cabinet seul vs espace mutualisé&nbsp;: la comparaison des coûts</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Une installation en cabinet indépendant exige d'assumer seul tous les coûts&nbsp;: rénovation complète, salle d'attente, sanitaires, entretien. En espace mutualisé, ces coûts sont partagés — ce qui réduit souvent le ticket d'entrée de 30 à 50&nbsp;%.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Exemple comparatif pour un cabinet de 14&nbsp;m² à Bordeaux&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li>Cabinet seul&nbsp;: dépôt 1&nbsp;500–2&nbsp;700&nbsp;€ + travaux 7&nbsp;000–21&nbsp;000&nbsp;€ + mobilier 3&nbsp;000–5&nbsp;000&nbsp;€ = coût d'entrée total 11&nbsp;500–28&nbsp;700&nbsp;€</li>
          <li>Espace mutualisé&nbsp;: dépôt 500–900&nbsp;€ + mobilier 1&nbsp;000–2&nbsp;000&nbsp;€ (local déjà aménagé) = coût d'entrée total 1&nbsp;500–2&nbsp;900&nbsp;€</li>
        </ul>
        <p className="text-sm text-muted-foreground italic">Ces fourchettes sont illustratives et dépendent du local et de son état.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Écarts de coût selon le quartier à Bordeaux</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les emplacements en centre-ville (Pey-Berland, Jardin Public, Chartrons) affichent des loyers plus élevés mais offrent une excellente visibilité et un accès transport. Les quartiers comme Nansouty, Saint-Augustin ou Caudéran proposent des loyers plus accessibles avec de bons bassins résidentiels. Le meilleur choix dépend de votre profil de patient / client et de votre type d'exercice.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Commencer la recherche de local sans cadre budgétaire clair</li>
          <li>Sous-estimer le coût des travaux, en particulier les mises aux normes ERP</li>
          <li>Oublier charges et assurances dans les projections de coût mensuel</li>
          <li>Ne pas prévoir de trésorerie de sécurité pour les 3 à 6 premiers mois</li>
          <li>Comparer des loyers bruts sans tenir compte des services inclus ou exclus</li>
          <li>Surinvestir dans les finitions premium au détriment de la trésorerie</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Ordres de grandeur à Bordeaux</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Loyer mensuel&nbsp;: 400 à 900&nbsp;€</li>
          <li>Dépôt de garantie&nbsp;: 1 à 3 mois de loyer</li>
          <li>Travaux&nbsp;: 500 à 1&nbsp;500&nbsp;€/m²</li>
          <li>Mobilier&nbsp;: 2&nbsp;000 à 5&nbsp;000&nbsp;€</li>
          <li>Signalétique&nbsp;: 500 à 2&nbsp;000&nbsp;€</li>
          <li>Assurances (RC Pro + local)&nbsp;: 500 à 1&nbsp;500&nbsp;€/an</li>
          <li>Trésorerie&nbsp;: 3 à 6 mois de charges fixes</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2 italic">Ces chiffres sont indicatifs et peuvent varier selon l'emplacement, l'état et le type de local.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Combien coûte l'ouverture d'un cabinet à Bordeaux&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Pour un cabinet seul&nbsp;: prévoyez 10&nbsp;000 à 25&nbsp;000&nbsp;€ incluant dépôt, travaux et mobilier, plus une trésorerie. En espace mutualisé, le coût d'entrée peut descendre à 1&nbsp;500–3&nbsp;000&nbsp;€.</p></div>
          <div><p className="font-semibold mb-1">Les espaces mutualisés sont-ils vraiment moins chers&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, nettement. Les espaces mutualisés partagent les coûts de rénovation, de parties communes et d'entretien. Le ticket d'entrée est généralement 30 à 50&nbsp;% inférieur à une installation seul.</p></div>
          <div><p className="font-semibold mb-1">Peut-on déduire les frais d'installation&nbsp;?</p><p className="text-muted-foreground leading-relaxed">De nombreux frais d'installation sont déductibles selon votre régime fiscal (BNC, micro-BNC). Consultez un comptable familier des professions de santé pour un traitement optimisé.</p></div>
          <div><p className="font-semibold mb-1">Au bout de combien de temps le cabinet est-il rentable&nbsp;?</p><p className="text-muted-foreground leading-relaxed">La plupart des praticiens atteignent l'équilibre en 6 à 12 mois, selon leur patientèle existante et leur réseau d'adressage. Une trésorerie bien dimensionnée couvre cette période de transition.</p></div>
          <div><p className="font-semibold mb-1">Faut-il préparer son budget avant ou après avoir trouvé un local&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Avant. Un cadre budgétaire clair permet de filtrer efficacement les options et d'éviter de s'engager sur un local qui dépasse votre capacité financière.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">Planifier un budget détaillé et réaliste est le socle d'une installation réussie. En distinguant coûts ponctuels et charges récurrentes, en comparant les options cabinet seul et mutualisé, et en intégrant une trésorerie de sécurité, vous pourrez prendre des décisions éclairées et démarrer votre activité en confiance.</p>
      </section>
    </InsightLayout>
  );
}
