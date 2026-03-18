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
        description="Rent, renovations, charges, furniture, insurance: a realistic overview of costs for opening a medical or paramedical office in Bordeaux."
        path="/en/insights/office-budget-bordeaux"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
          What budget to plan for opening a medical or paramedical office in Bordeaux
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">Opening a medical or paramedical office in Bordeaux requires planning a realistic budget. Beyond rent, several cost categories must be anticipated to avoid unpleasant surprises and secure a smooth start.</p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Always distinguish between rent, one-off costs and recurring charges</li>
            <li>Include renovation costs: €500 to €1,500/sqm depending on the condition</li>
            <li>Plan a cash reserve covering 3 to 6 months of activity</li>
            <li>Don't underestimate furniture, signage and insurance costs</li>
            <li>Shared spaces often reduce the entry cost significantly</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Major cost categories</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Setting up an office involves several cost categories that should be analysed separately: rent or acquisition, deposit, charges, renovations, furniture, signage, insurance and starting cash.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Rent or acquisition</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">In Bordeaux, monthly rent for a small health office typically ranges from €400 to €900, depending on location and quality. Buying is also possible but requires a much higher initial outlay.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Deposit and charges</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A deposit equivalent to 1 to 3 months' rent is standard. Charges (common areas, water, electricity, maintenance) typically add 15 to 25% on top of the base rent.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Renovation costs</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Renovation work varies widely depending on the initial state of the premises. Typical costs range from €500 to €1,500 per sqm. Key areas include plumbing, acoustics, accessibility upgrades and finish quality.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Furniture and signage</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Furnishing a small office typically costs between €2,000 and €5,000. Signage (external sign, nameplate, directory listing) adds a further €500 to €2,000.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Insurance and cash reserve</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Professional liability insurance and premises insurance are essential. Plan a starting cash reserve covering 3 to 6 months of fixed costs to absorb the ramp-up period.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Cost variations by location</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Costs vary significantly between central Bordeaux and outlying areas. A city-centre location generally commands higher rents but may offer better visibility. Peripheral locations can reduce costs but require effort to build a patient base.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Underestimating renovation work, forgetting about charges, neglecting insurance or failing to plan a cash reserve are the most frequent errors. A detailed budget prepared before signing avoids costly surprises.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Typical cost ranges in Bordeaux</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Monthly rent: €400 to €900</li>
            <li>Deposit: 1 to 3 months' rent</li>
            <li>Renovations: €500 to €1,500/sqm</li>
            <li>Furniture: €2,000 to €5,000</li>
            <li>Signage: €500 to €2,000</li>
            <li>Insurance: €500 to €1,500/year</li>
            <li>Cash reserve: 3 to 6 months of charges</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2 italic">These figures are indicative and may vary depending on location, condition and type of premises.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">How much does it cost to open an office in Bordeaux?</p><p className="text-muted-foreground leading-relaxed">Including rent, deposit, basic renovations and furniture, plan a minimum of €8,000 to €15,000 for a small office, plus a cash reserve.</p></div>
            <div><p className="font-semibold mb-1">Are shared spaces cheaper?</p><p className="text-muted-foreground leading-relaxed">Yes, shared spaces typically reduce the entry cost by pooling renovation, waiting room and common area expenses.</p></div>
            <div><p className="font-semibold mb-1">Can I deduct set-up costs?</p><p className="text-muted-foreground leading-relaxed">Many set-up costs are deductible depending on your tax regime. Consult an accountant familiar with healthcare professions.</p></div>
            <div><p className="font-semibold mb-1">How long before the office becomes profitable?</p><p className="text-muted-foreground leading-relaxed">Most practitioners reach break-even within 6 to 12 months, depending on their existing patient base and referral network.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed">Planning a realistic, comprehensive budget is the first step to a successful set-up. By distinguishing between one-off and recurring costs, and by anticipating renovation work and charges, you can make informed decisions and avoid common pitfalls.</p>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Quel budget pour un cabinet médical à Bordeaux | I‑CA.RE"
      description="Loyer, travaux, charges, mobilier, assurances : un tour d'horizon réaliste des coûts pour ouvrir un cabinet médical ou paramédical à Bordeaux."
      path="/insights/budget-cabinet-bordeaux"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
        Quel budget prévoir pour ouvrir un cabinet médical ou paramédical à Bordeaux
      </h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">Ouvrir un cabinet médical ou paramédical à Bordeaux suppose de planifier un budget réaliste. Au-delà du loyer, plusieurs catégories de coûts doivent être anticipées pour éviter les mauvaises surprises et sécuriser le démarrage.</p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Toujours distinguer loyer, coûts ponctuels et charges récurrentes</li>
          <li>Intégrer le coût des travaux&nbsp;: 500 à 1&nbsp;500&nbsp;€/m² selon l'état du local</li>
          <li>Prévoir une trésorerie de départ couvrant 3 à 6 mois d'activité</li>
          <li>Ne pas sous-estimer mobilier, signalétique et assurances</li>
          <li>Les espaces mutualisés réduisent souvent significativement le ticket d'entrée</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les grandes catégories de coûts</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">L'installation dans un cabinet implique plusieurs catégories de coûts qu'il convient d'analyser séparément&nbsp;: loyer ou acquisition, dépôt de garantie, charges, travaux, mobilier, signalétique, assurances et trésorerie de départ.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Loyer ou acquisition</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">À Bordeaux, le loyer mensuel pour un petit cabinet de santé se situe généralement entre 400 et 900&nbsp;€, selon l'emplacement et la qualité du local. L'achat reste possible mais mobilise un capital initial bien plus important.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Dépôt de garantie et charges</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un dépôt de garantie équivalent à 1 à 3 mois de loyer est standard. Les charges (parties communes, eau, électricité, entretien) ajoutent généralement 15 à 25&nbsp;% au loyer de base.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Coût des travaux</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le montant des travaux varie fortement selon l'état initial du local. Les coûts typiques se situent entre 500 et 1&nbsp;500&nbsp;€/m². Les postes principaux concernent la plomberie, l'acoustique, la mise aux normes d'accessibilité et la qualité des finitions.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Mobilier et signalétique</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">L'équipement d'un petit cabinet représente généralement entre 2&nbsp;000 et 5&nbsp;000&nbsp;€. La signalétique (enseigne, plaque, annuaire) ajoute 500 à 2&nbsp;000&nbsp;€ supplémentaires.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Assurances et trésorerie de départ</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">L'assurance responsabilité civile professionnelle et l'assurance du local sont indispensables. Prévoyez une trésorerie de départ couvrant 3 à 6 mois de charges fixes pour absorber la période de montée en activité.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Écarts selon l'emplacement</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les coûts varient sensiblement entre le centre de Bordeaux et les quartiers périphériques. Un emplacement en centre-ville implique généralement des loyers plus élevés mais peut offrir une meilleure visibilité. Les emplacements en périphérie réduisent les coûts mais nécessitent un effort pour constituer sa patientèle.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Sous-estimer les travaux, oublier les charges, négliger les assurances ou ne pas prévoir de trésorerie de départ sont les erreurs les plus fréquentes. Un budget détaillé préparé avant la signature évite les surprises coûteuses.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Ordres de grandeur à Bordeaux</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Loyer mensuel&nbsp;: 400 à 900&nbsp;€</li>
          <li>Dépôt de garantie&nbsp;: 1 à 3 mois de loyer</li>
          <li>Travaux&nbsp;: 500 à 1&nbsp;500&nbsp;€/m²</li>
          <li>Mobilier&nbsp;: 2&nbsp;000 à 5&nbsp;000&nbsp;€</li>
          <li>Signalétique&nbsp;: 500 à 2&nbsp;000&nbsp;€</li>
          <li>Assurances&nbsp;: 500 à 1&nbsp;500&nbsp;€/an</li>
          <li>Trésorerie&nbsp;: 3 à 6 mois de charges</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2 italic">Ces chiffres sont indicatifs et peuvent varier selon l'emplacement, l'état et le type de local.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Combien coûte l'ouverture d'un cabinet à Bordeaux&nbsp;?</p><p className="text-muted-foreground leading-relaxed">En comptant loyer, dépôt, travaux de base et mobilier, prévoyez un minimum de 8&nbsp;000 à 15&nbsp;000&nbsp;€ pour un petit cabinet, plus une trésorerie de sécurité.</p></div>
          <div><p className="font-semibold mb-1">Les espaces mutualisés sont-ils moins chers&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, les espaces mutualisés réduisent généralement le ticket d'entrée en mutualisant les coûts de rénovation, de salle d'attente et de parties communes.</p></div>
          <div><p className="font-semibold mb-1">Peut-on déduire les frais d'installation&nbsp;?</p><p className="text-muted-foreground leading-relaxed">De nombreux frais d'installation sont déductibles selon votre régime fiscal. Consultez un comptable familier des professions de santé.</p></div>
          <div><p className="font-semibold mb-1">Au bout de combien de temps le cabinet est-il rentable&nbsp;?</p><p className="text-muted-foreground leading-relaxed">La plupart des praticiens atteignent l'équilibre en 6 à 12 mois, selon leur patientèle existante et leur réseau d'adressage.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">Planifier un budget réaliste et complet est la première étape d'une installation réussie. En distinguant coûts ponctuels et récurrents, et en anticipant les travaux et les charges, vous pourrez prendre des décisions éclairées et éviter les écueils classiques.</p>
      </section>
    </InsightLayout>
  );
}
