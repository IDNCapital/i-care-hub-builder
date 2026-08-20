import { InsightArticleTemplate } from "@/components/InsightArticleTemplate";
import { useTranslation } from "react-i18next";
import jardinPublicAttente from "@/assets/jardin-public/attente.webp";

export default function InsightsLouerAcheter() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedGuides =
    lang === "fr"
      ? [
          { routeKey: "insightsBudget", title: "Quel budget pour un cabinet à Bordeaux", description: "Loyer, dépôt, travaux, mobilier : tour d'horizon détaillé des coûts." },
          { routeKey: "insightsSurface", title: "Quelle surface pour un cabinet", description: "De 11 à 18 m² selon votre métier : les fourchettes réalistes." },
          { routeKey: "insightsCabinetMedical", title: "Trouver un cabinet médical à Bordeaux", description: "Emplacement, surface, normes : guide complet." },
        ]
      : [
          { routeKey: "insightsBudget", title: "What budget for an office in Bordeaux", description: "Rent, deposit, renovations: detailed cost breakdown." },
          { routeKey: "insightsSurface", title: "What size for an office", description: "From 11 to 18 sqm: realistic ranges." },
          { routeKey: "insightsCabinetMedical", title: "Finding a medical office in Bordeaux", description: "Location, size, standards: a complete guide." },
        ];

  const keyFigures =
    lang === "fr"
      ? [
          { label: "Dépôt location", value: "1 à 3 mois de loyer" },
          { label: "Apport achat", value: "10 à 20 % du prix" },
          { label: "Frais de notaire", value: "7 à 8 %" },
          { label: "Entrée mutualisé", value: "1 500 à 3 000 €" },
          { label: "Stabilité avant achat", value: "3 à 5+ ans" },
          { label: "Charges propriétaire", value: "Entretien + copro + taxes" },
        ]
      : [
          { label: "Rental deposit", value: "1 to 3 months' rent" },
          { label: "Purchase deposit", value: "10 to 20%" },
          { label: "Notary fees", value: "7 to 8%" },
          { label: "Shared space entry", value: "€1,500–3,000" },
          { label: "Stability before buying", value: "3–5+ years" },
          { label: "Ownership costs", value: "Maintenance + taxes" },
        ];

  const faq =
    lang === "fr"
      ? [
          { question: "Louer, c'est jeter de l'argent par les fenêtres\u00a0?", answer: "Non. La location préserve votre capital, offre de la flexibilité et évite les risques de la propriété. De nombreux praticiens performants louent tout au long de leur carrière." },
          { question: "Quand est-ce le bon moment pour acheter\u00a0?", answer: "Lorsque votre activité est stable (3 à 5+ ans), votre emplacement confirmé, et que vous avez la capacité financière d'investir sans compromettre votre exercice." },
          { question: "Peut-on acheter via une structure\u00a0?", answer: "Oui. L'achat via une SCI peut offrir des avantages fiscaux et patrimoniaux. Consultez un comptable ou un notaire." },
          { question: "Les espaces mutualisés sont-ils viables à long terme\u00a0?", answer: "Oui. De nombreux praticiens exercent en mutualisé tout au long de leur carrière, bénéficiant de locaux de qualité et de zéro charge de gestion." },
          { question: "Comment décider\u00a0?", answer: "Partez de votre situation professionnelle : stade de carrière, stabilité de la patientèle, réserves financières. La décision immobilière doit servir votre exercice." },
        ]
      : [
          { question: "Is renting a waste of money?", answer: "No. Renting preserves capital, offers flexibility and avoids ownership risks. Many successful practitioners rent throughout their career." },
          { question: "When is the right time to buy?", answer: "When your practice is stable (3–5+ years), your location confirmed, and you have the financial capacity without compromising your activity." },
          { question: "Can I buy through a company structure?", answer: "Yes. Purchasing through an SCI can offer tax and estate planning advantages. Seek professional advice." },
          { question: "Are shared spaces viable long-term?", answer: "Yes. Many practitioners use shared spaces throughout their career, benefiting from quality premises and zero property management." },
          { question: "How do I decide?", answer: "Start from your professional situation: career stage, patient base stability, financial reserves. The property decision should serve your practice." },
        ];

  if (lang === "en") {
    return (
      <InsightArticleTemplate
        title="Should you rent or buy your medical office | I‑CA.RE"
        description="Flexibility, equity, professional maturity, shared spaces: the concrete criteria for choosing between renting and buying a medical or paramedical office."
        path="/en/insights/rent-or-buy-office"
        heroImage={jardinPublicAttente}
        heroImageAlt="Welcoming waiting room in a shared care space – I‑CA.RE Bordeaux"
        articleTitle="Should you rent or buy your medical or paramedical office"
        intro="Rent or buy? It's one of the most frequently asked questions when setting up. There is no universal right answer, the best choice depends on your career stage, financial situation and long-term vision. What matters is making a decision based on professional needs, not property market pressure."
        takeaways={[
          "Renting offers maximum flexibility, ideal for early-career practitioners",
          "Buying builds equity but requires significant capital and reduces mobility",
          "Shared care spaces combine rental flexibility with enhanced quality",
          "The decision should follow your professional strategy, not speculation",
          "Many successful practitioners rent or use shared spaces their entire career",
          "Consider the total cost of ownership, not just the monthly payment",
        ]}
        toc={[
          { id: "renting", label: "Renting: flexibility and focus" },
          { id: "renting-limits", label: "The real limitations of renting" },
          { id: "buying", label: "Buying: stability and equity" },
          { id: "buying-limits", label: "The real limitations of buying" },
          { id: "early-career", label: "Early career: prioritise flexibility" },
          { id: "established", label: "Established practice: consider buying" },
          { id: "shared", label: "Shared care spaces: the third option" },
          { id: "comparison", label: "A comparison framework" },
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
        <section id="renting">
          <h2 className="text-xl font-heading font-bold mb-3">Renting: flexibility and focus</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Renting requires a lower initial outlay and preserves financial flexibility. You can change location, test a neighbourhood, and focus on building your patient base.</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Lower barrier to entry, deposit of 1–3 months' rent</li>
            <li>Geographic mobility, relocate if your catchment changes</li>
            <li>Predictable costs, rent and charges known in advance</li>
            <li>No property management burden</li>
          </ul>
        </section>

        <section id="renting-limits">
          <h2 className="text-xl font-heading font-bold mb-3">The real limitations of renting</h2>
          <p className="text-muted-foreground leading-relaxed">Rent doesn't build equity. You may face increases, non-renewal or restrictions. However, a well-negotiated lease provides stability, and capital not invested in property can work elsewhere.</p>
        </section>

        <section id="buying">
          <h2 className="text-xl font-heading font-bold mb-3">Buying: stability and equity</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Buying builds equity over time. You gain full control over the premises.</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Asset building, each payment contributes to your estate</li>
            <li>Full control, renovate without restrictions</li>
            <li>No rent increases (fixed-rate loans)</li>
            <li>Potential tax advantages (SCI, personal ownership)</li>
          </ul>
        </section>

        <section id="buying-limits">
          <h2 className="text-xl font-heading font-bold mb-3">The real limitations of buying</h2>
          <p className="text-muted-foreground leading-relaxed">Buying ties up significant capital (10–20% deposit, 7–8% notary fees), reduces mobility and adds management responsibilities. The total cost of ownership is often higher than it appears.</p>
        </section>

        <section id="early-career">
          <h2 className="text-xl font-heading font-bold mb-3">Early career: prioritise flexibility</h2>
          <p className="text-muted-foreground leading-relaxed">Renting or using a shared space limits financial risk and preserves capital. Committing to a purchase before your practice is established is one of the most common financial mistakes.</p>
        </section>

        <section id="established">
          <h2 className="text-xl font-heading font-bold mb-3">Established practice: consider buying if conditions align</h2>
          <p className="text-muted-foreground leading-relaxed">Once stable for several years, buying becomes legitimate. The right time is when you can do so without compromising your practice cash flow.</p>
        </section>

        <section id="shared">
          <h2 className="text-xl font-heading font-bold mb-3">Shared care spaces: the third option</h2>
          <p className="text-muted-foreground leading-relaxed">Shared spaces combine rental flexibility with quality environments. They pool costs and let you focus on your practice rather than property management.</p>
        </section>

        <section id="comparison">
          <h2 className="text-xl font-heading font-bold mb-3">A comparison framework</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>Renting:</strong> low entry cost, high flexibility, no equity, dependent on landlord</li>
            <li><strong>Buying:</strong> high entry cost, low flexibility, equity building, management burden</li>
            <li><strong>Shared space:</strong> very low entry, good flexibility, no equity, high quality, minimal burden</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">None is inherently superior. The right choice depends on your career stage and priorities.</p>
        </section>

        <section id="mistakes">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Buying too early, before practice and location are confirmed</li>
            <li>Treating purchase as automatically superior to renting</li>
            <li>Comparing rent to mortgage without accounting for total ownership costs</li>
            <li>Underestimating the management burden of property ownership</li>
            <li>Making the decision based on speculation rather than professional needs</li>
            <li>Dismissing shared spaces without understanding the offering</li>
          </ul>
        </section>
      </InsightArticleTemplate>
    );
  }

  return (
    <InsightArticleTemplate
      title="Faut-il louer ou acheter son cabinet médical | I‑CA.RE"
      description="Souplesse, patrimoine, maturité professionnelle, espaces mutualisés : les critères concrets pour choisir entre location et achat d'un cabinet."
      path="/insights/louer-ou-acheter-cabinet"
      heroImage={jardinPublicAttente}
      heroImageAlt="Salle d'attente accueillante dans un espace de soins partagé – I‑CA.RE Bordeaux"
      articleTitle="Faut-il louer ou acheter son cabinet médical ou paramédical"
      intro={<>Louer ou acheter&nbsp;? C'est l'une des questions les plus posées lors d'une installation. Il n'y a pas de réponse universelle, le meilleur choix dépend de votre stade de carrière, de votre situation financière et de votre vision à long terme. L'important est de décider sur la base de vos besoins professionnels, pas de la pression du marché.</>}
      takeaways={[
        "La location offre un maximum de flexibilité, idéal en début de carrière",
        "L'achat permet de constituer un patrimoine mais mobilise un capital important",
        "Les espaces mutualisés combinent flexibilité et qualité d'environnement",
        "La décision doit suivre votre stratégie professionnelle, pas la spéculation",
        "De nombreux praticiens confirmés louent ou exercent en mutualisé toute leur carrière",
        "Considérez le coût total de propriété, pas seulement la mensualité",
      ]}
      toc={[
        { id: "location", label: "La location : flexibilité et concentration" },
        { id: "limites-location", label: "Les vraies limites de la location" },
        { id: "achat", label: "L'achat : stabilité et patrimoine" },
        { id: "limites-achat", label: "Les vraies limites de l'achat" },
        { id: "debut-carriere", label: "Début de carrière : privilégier la souplesse" },
        { id: "exercice-etabli", label: "Exercice établi : envisager l'achat" },
        { id: "mutualise", label: "Les espaces mutualisés : la troisième voie" },
        { id: "comparaison", label: "Un cadre de comparaison" },
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
      <section id="location">
        <h2 className="text-xl font-heading font-bold mb-3">La location&nbsp;: flexibilité et concentration sur l'essentiel</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">La location nécessite un investissement initial plus faible et préserve votre flexibilité. Vous pouvez changer de lieu, tester un quartier, et concentrer votre énergie sur votre patientèle.</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Ticket d'entrée réduit, dépôt de 1 à 3 mois de loyer</li>
          <li>Mobilité géographique, possibilité de déménager</li>
          <li>Coûts prévisibles, loyer et charges connus à l'avance</li>
          <li>Pas de charge de gestion immobilière</li>
        </ul>
      </section>

      <section id="limites-location">
        <h2 className="text-xl font-heading font-bold mb-3">Les vraies limites de la location</h2>
        <p className="text-muted-foreground leading-relaxed">Le loyer ne constitue pas de patrimoine. Vous pouvez subir des hausses ou un non-renouvellement. Mais un bail bien négocié assure une stabilité, et le capital non investi peut travailler ailleurs.</p>
      </section>

      <section id="achat">
        <h2 className="text-xl font-heading font-bold mb-3">L'achat&nbsp;: stabilité et patrimoine</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">L'achat permet de constituer un patrimoine et d'avoir un contrôle total sur le local.</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Constitution de patrimoine, chaque paiement contribue à votre actif</li>
          <li>Contrôle total, rénovation et personnalisation sans restriction</li>
          <li>Pas de hausse de loyer (crédit à taux fixe)</li>
          <li>Avantages fiscaux potentiels (SCI, propriété personnelle)</li>
        </ul>
      </section>

      <section id="limites-achat">
        <h2 className="text-xl font-heading font-bold mb-3">Les vraies limites de l'achat</h2>
        <p className="text-muted-foreground leading-relaxed">L'achat immobilise un capital important (apport 10–20&nbsp;%, frais de notaire 7–8&nbsp;%), réduit votre mobilité et ajoute des charges de gestion. Le coût total de propriété est souvent plus élevé qu'il n'y paraît.</p>
      </section>

      <section id="debut-carriere">
        <h2 className="text-xl font-heading font-bold mb-3">Début de carrière&nbsp;: privilégier la souplesse</h2>
        <p className="text-muted-foreground leading-relaxed">La location ou le mutualisé limite le risque financier et préserve le capital. S'engager dans un achat avant que votre activité ne soit établie est l'une des erreurs les plus fréquentes.</p>
      </section>

      <section id="exercice-etabli">
        <h2 className="text-xl font-heading font-bold mb-3">Exercice établi&nbsp;: envisager l'achat si les conditions sont réunies</h2>
        <p className="text-muted-foreground leading-relaxed">Lorsque votre activité est stable depuis plusieurs années, l'achat devient légitime. Le bon moment est celui où vous pouvez acheter sans compromettre votre trésorerie.</p>
      </section>

      <section id="mutualise">
        <h2 className="text-xl font-heading font-bold mb-3">Les espaces mutualisés&nbsp;: la troisième voie</h2>
        <p className="text-muted-foreground leading-relaxed">Les espaces mutualisés combinent la flexibilité de la location avec une qualité d'environnement difficile à atteindre seul. Ils partagent les coûts et vous permettent de vous concentrer sur votre pratique.</p>
      </section>

      <section id="comparaison">
        <h2 className="text-xl font-heading font-bold mb-3">Un cadre de comparaison</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li><strong>Location&nbsp;:</strong> coût d'entrée faible, grande flexibilité, pas de patrimoine, dépendance au bailleur</li>
          <li><strong>Achat&nbsp;:</strong> coût d'entrée élevé, faible flexibilité, patrimoine, charge de gestion</li>
          <li><strong>Mutualisé&nbsp;:</strong> coût d'entrée très faible, bonne flexibilité, pas de patrimoine, haute qualité, charge minimale</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">Aucune option n'est intrinsèquement supérieure. Le bon choix dépend de votre situation.</p>
      </section>

      <section id="erreurs">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Acheter trop tôt, avant que votre activité ne soit confirmée</li>
          <li>Considérer l'achat comme automatiquement supérieur à la location</li>
          <li>Comparer loyer et mensualité de crédit sans tenir compte du coût total</li>
          <li>Sous-estimer la charge de gestion liée à la propriété</li>
          <li>Fonder la décision sur la spéculation plutôt que les besoins professionnels</li>
          <li>Écarter les espaces mutualisés sans comprendre l'offre réelle</li>
        </ul>
      </section>
    </InsightArticleTemplate>
  );
}
