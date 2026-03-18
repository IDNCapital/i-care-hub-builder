import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsSurface() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsBudget", labelFr: "Quel budget pour un cabinet à Bordeaux", labelEn: "What budget for an office in Bordeaux" },
    { routeKey: "insightsProfessions", labelFr: "Professions compatibles avec le partage de cabinet", labelEn: "Professions compatible with shared offices" },
    { routeKey: "insightsCabinetMedical", labelFr: "Trouver un cabinet médical à Bordeaux", labelEn: "Finding a medical office in Bordeaux" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="What size for a medical or paramedical office | I‑CA.RE"
        description="From 11 to 18 sqm depending on your profession: realistic minimum areas, the role of shared spaces, oversizing traps and concrete examples by practice type."
        path="/en/insights/medical-office-size"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">What size do you need for a medical or paramedical office</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">Choosing the right size for your office is one of the most impactful decisions you'll make. Too large, and you overspend every month on space you don't use. Too small, and you compromise comfort and patient experience. The answer depends on your profession, whether you work with equipment, and whether you have access to shared common areas.</p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>A private office of 11 to 15 sqm suits most seated-practice professions</li>
            <li>Professions using a treatment table need 14 to 18 sqm</li>
            <li>Shared areas (waiting room, facilities) are essential complements to private space</li>
            <li>Oversizing is one of the most common and costly mistakes</li>
            <li>A well-designed small space outperforms a poorly laid-out large one</li>
            <li>In shared settings, the effective total space per practitioner is much larger than the private office alone</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Realistic minimum areas by practice type</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Space needs vary by profession. Here are realistic minimums, assuming access to shared common areas:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li><strong>Psychology, psychotherapy:</strong> 11–13 sqm — a desk, two comfortable chairs and a calm atmosphere are sufficient</li>
            <li><strong>Dietetics, nutrition:</strong> 11–14 sqm — similar to psychology, with space for a desk and measurement equipment</li>
            <li><strong>Sophrology, naturopathy:</strong> 11–14 sqm — a reclining chair or treatment couch fits comfortably</li>
            <li><strong>Osteopathy, manual therapy:</strong> 14–18 sqm — a treatment table requires more floor space and circulation room</li>
            <li><strong>Speech therapy:</strong> 12–16 sqm — space for a desk, play materials and sometimes specific equipment</li>
            <li><strong>Psychomotor therapy, occupational therapy:</strong> 13–16 sqm — may require floor space for movement exercises</li>
            <li><strong>Sexology, counselling:</strong> 11–13 sqm — seated-practice model similar to psychology</li>
          </ul>
          <p className="text-sm text-muted-foreground italic">These ranges assume access to shared waiting room, facilities and entrance.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Standalone office vs shared space: the space equation</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A standalone office must fit everything — waiting area, reception, facilities, storage — into your own square metres. This means you often need 25 to 40 sqm total to provide a professional environment.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">In a shared setting, these common functions are pooled. Your private office focuses purely on the consultation, while patients benefit from a quality waiting room and facilities that would be hard to justify alone. The result: a 13 sqm private office in a shared space can feel as professional as a 30 sqm standalone space.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The critical role of common areas</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A well-designed waiting room, clean accessible facilities and a professional entrance create the first impression for every patient / client. These elements directly influence perceived quality and comfort.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">In a shared space, common areas are maintained collectively, which means higher quality at lower individual cost. A quality waiting room might cost €5,000–10,000 to create individually — shared across five practitioners, that's €1,000–2,000 each.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The oversizing trap</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Taking a space that is too large is one of the most expensive mistakes. Every extra square metre increases rent, charges and maintenance every month — costs that never go away. A practitioner paying €60/sqm/month for 25 sqm (€1,500/month) when 14 sqm (€840/month) would suffice wastes nearly €8,000 per year.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">The "just in case" mentality — renting extra space for future needs that may never materialise — is particularly costly. It is better to start with the right size and move or expand if and when needed.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">What really determines comfort</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Comfort in a consulting room depends on layout quality, natural light, acoustic insulation, ventilation and furniture choices — not raw square metres. A thoughtfully designed 13 sqm office with good light and sound insulation feels spacious and professional. A hastily furnished 25 sqm space with poor acoustics and no natural light feels cramped and unwelcoming.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Invest in design quality over quantity of space.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Renting a space that is too large "just in case" future needs arise</li>
            <li>Ignoring the contribution of shared areas to the overall patient experience</li>
            <li>Confusing total building area with usable private office area</li>
            <li>Underestimating the impact of layout, light and acoustics on perceived comfort</li>
            <li>Choosing a space based on raw size rather than functional design</li>
            <li>Paying for a standalone waiting room and facilities when shared alternatives exist</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">Can I practise in 11 sqm?</p><p className="text-muted-foreground leading-relaxed">Yes, many seated-practice professions work very well in 11 to 13 sqm — psychologists, dietitians, sophrologists, naturopaths. The key condition is access to a shared waiting room and facilities.</p></div>
            <div><p className="font-semibold mb-1">How much space does an osteopath need?</p><p className="text-muted-foreground leading-relaxed">A treatment table and adequate circulation space typically require 14 to 18 sqm. This allows comfortable movement around the table and space for equipment.</p></div>
            <div><p className="font-semibold mb-1">Does a larger office improve patient experience?</p><p className="text-muted-foreground leading-relaxed">Not necessarily. Patient experience depends on atmosphere, cleanliness, acoustic privacy, natural light and the quality of the waiting room — factors that are independent of office size.</p></div>
            <div><p className="font-semibold mb-1">How do I calculate the right size for my practice?</p><p className="text-muted-foreground leading-relaxed">List your essential furniture and equipment, add circulation space, then check whether shared areas cover your remaining needs (waiting, facilities, storage). Most practitioners find that 11 to 18 sqm of private space plus quality common areas is the optimal combination.</p></div>
            <div><p className="font-semibold mb-1">Are shared spaces too small?</p><p className="text-muted-foreground leading-relaxed">No. Shared spaces pool common functions, so the private office focuses purely on consultation. The effective total space — private office plus shared areas — is often larger and better equipped than a standalone office.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed">Choosing the right size means matching your space to your actual practice needs, not to a theoretical ideal. In a shared setting, a private office of 11 to 18 sqm combined with quality common areas offers the best balance between comfort, cost and professionalism.</p>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Quelle surface pour un cabinet médical ou paramédical | I‑CA.RE"
      description="De 11 à 18 m² selon votre métier : surfaces minimales réalistes, rôle des parties communes, piège du surdimensionnement et exemples concrets par type d'exercice."
      path="/insights/surface-cabinet-medical"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Quelle surface faut-il pour un cabinet médical ou paramédical</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">Choisir la bonne surface pour son cabinet est l'une des décisions les plus impactantes. Trop grand, vous surpayez chaque mois des mètres carrés inutilisés. Trop petit, vous compromettez le confort et l'expérience de vos patient / clients. La réponse dépend de votre métier, de votre mode d'exercice et de l'accès à des espaces communs partagés.</p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Un cabinet privatif de 11 à 15&nbsp;m² convient à la plupart des exercices en consultation assise</li>
          <li>Les métiers avec table de soins nécessitent 14 à 18&nbsp;m²</li>
          <li>Les parties communes (salle d'attente, sanitaires) sont un complément essentiel</li>
          <li>Le surdimensionnement est l'une des erreurs les plus fréquentes et les plus coûteuses</li>
          <li>Un petit espace bien conçu surpasse un grand espace mal agencé</li>
          <li>En mutualisé, la surface totale effective par praticien est bien supérieure au cabinet privatif seul</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Surfaces minimales réalistes par type d'exercice</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les besoins en surface varient selon le métier. Voici des fourchettes réalistes, en supposant un accès à des parties communes partagées&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li><strong>Psychologie, psychothérapie&nbsp;:</strong> 11–13&nbsp;m² — un bureau, deux fauteuils confortables et une atmosphère calme suffisent</li>
          <li><strong>Diététique, nutrition&nbsp;:</strong> 11–14&nbsp;m² — configuration similaire à la psychologie, avec de la place pour du matériel de mesure</li>
          <li><strong>Sophrologie, naturopathie&nbsp;:</strong> 11–14&nbsp;m² — un fauteuil inclinable ou une méridienne s'intègre confortablement</li>
          <li><strong>Ostéopathie, thérapie manuelle&nbsp;:</strong> 14–18&nbsp;m² — la table de soins exige plus de surface au sol et de circulation</li>
          <li><strong>Orthophonie&nbsp;:</strong> 12–16&nbsp;m² — espace pour un bureau, du matériel ludique et parfois des équipements spécifiques</li>
          <li><strong>Psychomotricité, ergothérapie&nbsp;:</strong> 13–16&nbsp;m² — peut nécessiter de l'espace au sol pour des exercices de mouvement</li>
          <li><strong>Sexologie, conseil&nbsp;:</strong> 11–13&nbsp;m² — modèle de consultation assise similaire à la psychologie</li>
        </ul>
        <p className="text-sm text-muted-foreground italic">Ces fourchettes supposent un accès à une salle d'attente, des sanitaires et une entrée partagés.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Cabinet individuel vs espace mutualisé&nbsp;: l'équation de surface</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un cabinet indépendant doit intégrer toutes les fonctions — salle d'attente, accueil, sanitaires, stockage — dans vos propres mètres carrés. Cela signifie qu'il faut souvent 25 à 40&nbsp;m² au total pour offrir un environnement professionnel.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Dans un espace mutualisé, ces fonctions communes sont partagées. Votre cabinet privatif se concentre uniquement sur la consultation, tandis que vos patient / clients bénéficient d'une salle d'attente et de sanitaires de qualité, difficilement justifiables seul. Résultat&nbsp;: un cabinet de 13&nbsp;m² en mutualisé peut être aussi professionnel qu'un local indépendant de 30&nbsp;m².</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Le rôle déterminant des parties communes</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Une salle d'attente soignée, des sanitaires accessibles et propres, une entrée professionnelle&nbsp;: ces éléments créent la première impression pour chaque patient / client. Ils influencent directement la qualité perçue et le confort.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">En mutualisé, les parties communes sont entretenues collectivement, ce qui signifie une meilleure qualité à moindre coût individuel. Créer une salle d'attente de qualité peut coûter 5&nbsp;000 à 10&nbsp;000&nbsp;€ seul — partagée entre cinq praticiens, c'est 1&nbsp;000 à 2&nbsp;000&nbsp;€ chacun.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Le piège du surdimensionnement</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Prendre un local trop grand est l'une des erreurs les plus coûteuses. Chaque mètre carré supplémentaire augmente le loyer, les charges et l'entretien chaque mois — des coûts qui ne disparaissent jamais. Un praticien payant 60&nbsp;€/m²/mois pour 25&nbsp;m² (1&nbsp;500&nbsp;€/mois) quand 14&nbsp;m² (840&nbsp;€/mois) suffiraient gaspille près de 8&nbsp;000&nbsp;€ par an.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">La logique du «&nbsp;au cas où&nbsp;» — louer de la surface supplémentaire pour des besoins futurs qui ne se matérialiseront peut-être jamais — est particulièrement coûteuse. Il est préférable de commencer avec la bonne taille et d'évoluer si et quand le besoin se confirme.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Ce qui détermine réellement le confort</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le confort d'un cabinet de consultation dépend de la qualité de l'agencement, de la lumière naturelle, de l'isolation acoustique, de la ventilation et du choix du mobilier — pas des mètres carrés bruts. Un cabinet de 13&nbsp;m² bien conçu avec de la lumière et une bonne isolation semble spacieux et professionnel. Un espace de 25&nbsp;m² mal aménagé avec une mauvaise acoustique et pas de lumière naturelle semble étriqué et peu accueillant.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Investissez dans la qualité de conception plutôt que dans la quantité de surface.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Louer un espace trop grand «&nbsp;au cas où&nbsp;» des besoins futurs se présenteraient</li>
          <li>Ignorer l'apport des parties communes à l'expérience globale du patient / client</li>
          <li>Confondre surface totale du bâtiment et surface utile privatif</li>
          <li>Sous-estimer l'impact de l'agencement, de la lumière et de l'acoustique sur le confort perçu</li>
          <li>Choisir un local sur la base de la surface brute plutôt que de la conception fonctionnelle</li>
          <li>Payer seul une salle d'attente et des sanitaires quand des alternatives mutualisées existent</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Peut-on exercer dans 11&nbsp;m²&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, de nombreuses professions en consultation assise exercent très bien dans 11 à 13&nbsp;m² — psychologues, diététiciens, sophrologues, naturopathes. La condition clé est l'accès à une salle d'attente et des sanitaires partagés.</p></div>
          <div><p className="font-semibold mb-1">Quelle surface pour un ostéopathe&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Une table de soins et une circulation confortable autour nécessitent généralement 14 à 18&nbsp;m². Cela permet de travailler à l'aise et de ranger le matériel.</p></div>
          <div><p className="font-semibold mb-1">Un cabinet plus grand améliore-t-il l'expérience patient&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Pas nécessairement. L'expérience patient / client dépend de l'atmosphère, de la propreté, de l'intimité acoustique, de la lumière naturelle et de la qualité de la salle d'attente — des facteurs indépendants de la taille du cabinet.</p></div>
          <div><p className="font-semibold mb-1">Comment calculer la bonne surface pour mon exercice&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Listez votre mobilier et équipement essentiels, ajoutez l'espace de circulation, puis vérifiez si les parties communes couvrent vos besoins restants (attente, sanitaires, stockage). La plupart des praticiens trouvent que 11 à 18&nbsp;m² privatifs plus des espaces communs de qualité est la combinaison optimale.</p></div>
          <div><p className="font-semibold mb-1">Les espaces mutualisés sont-ils trop petits&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Non. Les espaces mutualisés partagent les fonctions communes, ce qui concentre le cabinet privatif sur la consultation. La surface totale effective — cabinet privatif plus parties communes — est souvent plus grande et mieux équipée qu'un cabinet indépendant.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">Choisir la bonne surface, c'est adapter son espace à ses besoins réels de pratique, pas à un idéal théorique. Dans un cadre mutualisé, un cabinet privatif de 11 à 18&nbsp;m² combiné à des parties communes de qualité offre le meilleur équilibre entre confort, coût et professionnalisme.</p>
      </section>
    </InsightLayout>
  );
}
