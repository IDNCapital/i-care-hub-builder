import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsCabinetMedicalBordeaux() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsBudget", labelFr: "Quel budget prévoir pour un cabinet à Bordeaux", labelEn: "What budget to plan for an office in Bordeaux" },
    { routeKey: "insightsSurface", labelFr: "Quelle surface pour un cabinet médical", labelEn: "What size for a medical office" },
    { routeKey: "insightsLouerAcheter", labelFr: "Faut-il louer ou acheter son cabinet", labelEn: "Should you rent or buy your office" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="How to find a medical or paramedical office in Bordeaux | I‑CA.RE"
        description="A practical guide for care and wellbeing practitioners looking for an office in Bordeaux: location, size, budget, regulations, shared spaces."
        path="/en/insights/medical-office-bordeaux"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
          How to find a medical or paramedical office in Bordeaux
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          Finding the right office in Bordeaux is a challenge many practitioners face. The market is tight for small spaces suited to healthcare and wellbeing professions, and the available options are not always visible or easy to evaluate. Location, size, regulatory compliance and overall budget must all be considered together — not in isolation.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Favour spaces between 11 and 18 sqm suited to your actual practice needs</li>
            <li>Choose a location consistent with your patient / client base, not just a premium address</li>
            <li>Check ERP accessibility compliance before committing</li>
            <li>Include renovation costs in your overall budget from the start</li>
            <li>Consider shared care spaces to optimise quality, cost and set-up time</li>
            <li>Visit multiple options and compare objectively before deciding</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Why the market is tight in Bordeaux</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Bordeaux has seen sustained demand for small healthcare-suitable spaces. Units between 10 and 25 sqm are rare on the open market, and many existing premises require significant work to meet current standards — particularly accessibility and acoustic insulation.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Most traditional commercial listings target retail or office use, not healthcare. This creates a gap: practitioners need purpose-fitted spaces, but the supply of ready-to-use offices is limited.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">What makes a good location for a healthcare office</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A good location must be consistent with your activity. A busy high street is not always the best fit. For many practitioners, proximity to other health professionals, public transport, residential areas or complementary services matters more than footfall.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Consider ground-floor visibility, ease of access (parking, tram), signage possibilities and the general neighbourhood atmosphere. A calm, professional environment often suits healthcare better than a commercial one.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">How much space do you actually need</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The ideal private office for most seated-practice professions is between 11 and 15 sqm. Professions requiring a treatment table or specific equipment may need 15 to 18 sqm. Access to shared common areas (waiting room, facilities) significantly reduces the individual space required.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">A well-optimised 13 sqm office with access to quality shared spaces can be more effective than a poorly laid-out 30 sqm standalone space.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Accessibility and ERP standards</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Any premises receiving the public must comply with ERP accessibility standards. This includes wheelchair access, adapted facilities, appropriate signage and compliant door widths. A non-compliant space can generate significant — and sometimes unexpected — renovation costs.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Always check compliance before signing. Derogations exist for certain existing buildings, but the process takes time and is not guaranteed.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">What budget to plan</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The overall budget goes well beyond rent or purchase price. You need to factor in deposit, renovation work, furniture, signage, insurance, charges and a cash reserve for the first months.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Typical ranges in Bordeaux:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li>Monthly rent: €400 to €900 for a small office</li>
            <li>Renovation costs: €500 to €1,500/sqm depending on condition</li>
            <li>Furniture and signage: €2,500 to €7,000</li>
          </ul>
          <p className="text-sm text-muted-foreground italic">These figures are indicative and vary by location, condition and type of premises.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Why shared care spaces are worth considering</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Shared care spaces pool common functions — waiting room, reception, facilities, maintenance — across several practitioners. This reduces individual costs, improves the quality of the environment and creates natural referral networks between complementary professions.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">For practitioners starting out or seeking flexibility, shared spaces offer a lower barrier to entry without compromising professionalism. They also simplify the administrative burden of managing a standalone office.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Choosing a space based on impulse or aesthetics alone, without checking regulatory compliance</li>
            <li>Underestimating renovation costs, especially for ERP and acoustic upgrades</li>
            <li>Oversizing the space and paying for square metres you don't need</li>
            <li>Signing a lease before verifying the designated use of the premises</li>
            <li>Neglecting to plan a cash reserve for the first months of activity</li>
            <li>Dismissing shared spaces without exploring the actual offering</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">A structured approach makes the difference</h2>
          <p className="text-muted-foreground leading-relaxed">Preparing your search methodically — defining your needs, setting a realistic budget, visiting multiple options and checking all regulatory aspects — avoids the most common pitfalls. A well-prepared practitioner makes better decisions and secures a more sustainable set-up.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">What size for a medical office?</p><p className="text-muted-foreground leading-relaxed">11 to 15 sqm is sufficient for most seated-practice professions, provided you have access to a waiting room and shared facilities. Professions requiring a treatment table may need 15 to 18 sqm.</p></div>
            <div><p className="font-semibold mb-1">What budget to plan in Bordeaux?</p><p className="text-muted-foreground leading-relaxed">Including rent, deposit, basic renovations and furniture, plan a minimum of €8,000 to €15,000 for a small office, plus a cash reserve of 3 to 6 months.</p></div>
            <div><p className="font-semibold mb-1">Can you convert a commercial space into an office?</p><p className="text-muted-foreground leading-relaxed">Yes, but you need to check the designated use, co-ownership rules if applicable, and ERP accessibility standards. Conversion costs typically range from €500 to €1,500/sqm.</p></div>
            <div><p className="font-semibold mb-1">Should you buy or rent your office?</p><p className="text-muted-foreground leading-relaxed">Renting offers flexibility, especially at the start. Buying builds equity but requires significant capital. Shared spaces often offer the best compromise for practitioners who want quality without property constraints.</p></div>
            <div><p className="font-semibold mb-1">Are shared spaces suitable for all professions?</p><p className="text-muted-foreground leading-relaxed">Most seated-practice professions work well in shared settings — psychology, osteopathy, dietetics, sophrology, naturopathy, speech therapy and more. Professions requiring very large floor areas are generally less suited.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Key figures</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Optimal area: 11 to 18 sqm</li>
            <li>Monthly rent: €400 to €900</li>
            <li>Renovations: €500 to €1,500/sqm</li>
            <li>Cash reserve: 3 to 6 months of charges</li>
            <li>Favour shared spaces for cost and quality</li>
            <li>Always check ERP compliance before signing</li>
          </ul>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Comment trouver un cabinet médical ou paramédical à Bordeaux | I‑CA.RE"
      description="Guide pratique pour les praticiens du soin et du bien-être qui cherchent un cabinet à Bordeaux : emplacement, surface, budget, normes, lieux mutualisés."
      path="/insights/cabinet-medical-bordeaux"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
        Comment trouver un cabinet médical ou paramédical à Bordeaux
      </h1>

      <p className="text-lg text-muted-foreground leading-relaxed mb-4">
        Trouver le bon cabinet à Bordeaux est un défi que de nombreux praticiens rencontrent. Le marché est tendu pour les petites surfaces adaptées aux professions du soin et du bien-être, et les options disponibles ne sont pas toujours visibles ni faciles à évaluer. Emplacement, surface, conformité réglementaire et budget global doivent être considérés ensemble — pas séparément.
      </p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Privilégier des surfaces entre 11 et 18&nbsp;m² adaptées à vos besoins réels de pratique</li>
          <li>Choisir un emplacement cohérent avec votre patientèle, pas seulement un emplacement premium</li>
          <li>Vérifier la conformité ERP et l'accessibilité avant de s'engager</li>
          <li>Intégrer le coût des travaux dans votre budget global dès le départ</li>
          <li>Envisager les espaces de soins mutualisés pour optimiser qualité, coût et délai d'installation</li>
          <li>Visiter plusieurs options et comparer objectivement avant de décider</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Pourquoi le marché est tendu à Bordeaux</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le marché bordelais connaît une demande soutenue pour les petites surfaces adaptées aux métiers de la santé et du bien-être. Les biens entre 10 et 25&nbsp;m² sont rares sur le marché ouvert, et les locaux existants nécessitent souvent des travaux importants pour répondre aux normes actuelles — notamment l'accessibilité et l'isolation acoustique.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">La plupart des annonces commerciales classiques ciblent le commerce ou le bureau, pas les professions de santé. Cela crée un décalage&nbsp;: les praticiens ont besoin d'espaces aménagés spécifiquement, mais l'offre de cabinets prêts à l'emploi reste limitée.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Qu'est-ce qui fait un bon emplacement pour un cabinet</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un bon emplacement doit être cohérent avec votre activité. Une rue très passante n'est pas toujours le meilleur choix. Pour beaucoup de praticiens, la proximité d'autres professionnels de santé, des transports en commun, de zones résidentielles ou de services complémentaires compte davantage que le flux piéton.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Pensez à la visibilité en rez-de-chaussée, à la facilité d'accès (stationnement, tram), aux possibilités de signalétique et à l'atmosphère générale du quartier. Un environnement calme et professionnel convient souvent mieux aux métiers du soin qu'un environnement commercial.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">De quelle surface avez-vous réellement besoin</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">La surface idéale d'un cabinet privatif pour la plupart des exercices en consultation assise se situe entre 11 et 15&nbsp;m². Les métiers nécessitant une table de soins ou un équipement spécifique ont plutôt besoin de 15 à 18&nbsp;m². L'accès à des parties communes (salle d'attente, sanitaires) réduit significativement la surface individuelle nécessaire.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Un cabinet de 13&nbsp;m² bien optimisé avec des espaces communs de qualité peut être plus efficace qu'un local indépendant de 30&nbsp;m² mal agencé.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Accessibilité et normes ERP</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Tout local recevant du public doit respecter les normes ERP d'accessibilité. Cela inclut l'accès pour les personnes à mobilité réduite, des sanitaires adaptés, une signalétique appropriée et des largeurs de passage conformes. Un local non conforme peut générer des travaux importants — et parfois imprévus.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Vérifiez toujours la conformité avant de signer. Des dérogations existent pour certains bâtiments existants, mais la procédure prend du temps et n'est pas garantie.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Quel budget prévoir</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le budget global va bien au-delà du loyer ou du prix d'acquisition. Il faut intégrer le dépôt de garantie, les travaux, le mobilier, la signalétique, les assurances, les charges et une trésorerie pour les premiers mois.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Ordres de grandeur à Bordeaux&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li>Loyer mensuel&nbsp;: 400 à 900&nbsp;€ pour un petit cabinet</li>
          <li>Travaux&nbsp;: 500 à 1&nbsp;500&nbsp;€/m² selon l'état du local</li>
          <li>Mobilier et signalétique&nbsp;: 2&nbsp;500 à 7&nbsp;000&nbsp;€</li>
        </ul>
        <p className="text-sm text-muted-foreground italic">Ces chiffres sont indicatifs et varient selon l'emplacement, l'état et le type de local.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Pourquoi envisager un espace de soins mutualisé</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les espaces de soins mutualisés partagent les fonctions communes — salle d'attente, accueil, sanitaires, entretien — entre plusieurs praticiens. Cela réduit les coûts individuels, améliore la qualité de l'environnement et crée des parcours d'adressage naturels entre professions complémentaires.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Pour les praticiens en début d'activité ou en recherche de flexibilité, les espaces mutualisés offrent un ticket d'entrée plus accessible sans compromettre le professionnalisme. Ils simplifient aussi la gestion administrative liée à un local indépendant.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Choisir un local sur un coup de cœur ou sur l'esthétique seule, sans vérifier la conformité réglementaire</li>
          <li>Sous-estimer le coût des travaux, surtout pour les mises aux normes ERP et acoustiques</li>
          <li>Surdimensionner la surface et payer des mètres carrés inutiles</li>
          <li>Signer un bail avant d'avoir vérifié la destination du local</li>
          <li>Négliger de prévoir une trésorerie de sécurité pour les premiers mois d'activité</li>
          <li>Écarter les espaces mutualisés sans avoir exploré l'offre existante</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Une approche structurée fait la différence</h2>
        <p className="text-muted-foreground leading-relaxed">Préparer sa recherche méthodiquement — définir ses besoins, cadrer un budget réaliste, visiter plusieurs options, vérifier tous les aspects réglementaires — évite les écueils les plus courants. Un praticien bien préparé prend de meilleures décisions et sécurise une installation plus pérenne.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Quelle surface pour un cabinet médical&nbsp;?</p><p className="text-muted-foreground leading-relaxed">11 à 15&nbsp;m² suffisent pour la plupart des exercices en consultation assise, à condition de disposer d'une salle d'attente et de sanitaires partagés. Les métiers nécessitant une table de soins ont besoin de 15 à 18&nbsp;m².</p></div>
          <div><p className="font-semibold mb-1">Quel budget prévoir à Bordeaux&nbsp;?</p><p className="text-muted-foreground leading-relaxed">En comptant loyer, dépôt, travaux de base et mobilier, prévoyez un minimum de 8&nbsp;000 à 15&nbsp;000&nbsp;€ pour un petit cabinet, plus une trésorerie de sécurité de 3 à 6 mois.</p></div>
          <div><p className="font-semibold mb-1">Peut-on transformer un local commercial en cabinet&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, mais il faut vérifier la destination du local, le règlement de copropriété le cas échéant, et les normes ERP. Le coût des travaux se situe généralement entre 500 et 1&nbsp;500&nbsp;€/m².</p></div>
          <div><p className="font-semibold mb-1">Faut-il acheter ou louer son cabinet&nbsp;?</p><p className="text-muted-foreground leading-relaxed">La location offre de la souplesse, surtout en début d'activité. L'achat permet de constituer un patrimoine mais mobilise un capital important. Les espaces mutualisés offrent souvent le meilleur compromis entre qualité et contraintes.</p></div>
          <div><p className="font-semibold mb-1">Les espaces mutualisés conviennent-ils à toutes les professions&nbsp;?</p><p className="text-muted-foreground leading-relaxed">La plupart des métiers en consultation fonctionnent très bien en mutualisé — psychologie, ostéopathie, diététique, sophrologie, naturopathie, orthophonie, etc. Les métiers nécessitant de très grandes surfaces sont généralement moins adaptés.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Points clés à retenir</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Surface optimale&nbsp;: 11 à 18&nbsp;m²</li>
          <li>Loyer mensuel&nbsp;: 400 à 900&nbsp;€</li>
          <li>Travaux&nbsp;: 500 à 1&nbsp;500&nbsp;€/m²</li>
          <li>Trésorerie de départ&nbsp;: 3 à 6 mois de charges</li>
          <li>Privilégier les espaces mutualisés pour le coût et la qualité</li>
          <li>Toujours vérifier la conformité ERP avant de signer</li>
        </ul>
      </section>
    </InsightLayout>
  );
}
