import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";

export default function PolitiqueCookies() {
  return (
    <Layout>
      <SeoHead
        title="Politique de cookies — I-CA.RE"
        description="Politique de cookies du site I-CA.RE : types de cookies utilisés, finalités et gestion de vos préférences."
        path="/cookies"
        noIndex
      />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Politique de cookies</h1>
          <p className="text-muted-foreground">Dernière mise à jour : février 2026</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl prose prose-lg">

          <h2 className="text-2xl font-semibold mt-10 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite, comme votre langue préférée et d'autres paramètres, afin de faciliter votre prochaine visite et de rendre le site plus utile pour vous.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Types de cookies utilisés</h2>

          <h3 className="text-xl font-semibold mt-8 mb-3">Cookies strictement nécessaires</h3>
          <p className="text-muted-foreground leading-relaxed">
            Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés. Ils sont généralement définis en réponse à des actions que vous avez effectuées, comme la définition de vos préférences de confidentialité ou la connexion.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Cookies analytiques / de performance</h3>
          <p className="text-muted-foreground leading-relaxed">
            Ces cookies nous permettent de compter les visites et les sources de trafic afin de mesurer et d'améliorer les performances de notre site. Ils nous aident à savoir quelles pages sont les plus et les moins populaires et à voir comment les visiteurs se déplacent sur le site. Toutes les informations collectées par ces cookies sont agrégées et donc anonymisées.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Cookies de fonctionnalité</h3>
          <p className="text-muted-foreground leading-relaxed">
            Ces cookies permettent au site de fournir des fonctionnalités et une personnalisation améliorées. Ils peuvent être définis par nous ou par des fournisseurs tiers dont nous avons ajouté les services à nos pages.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">3. Durée de conservation</h2>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">Cookies de session :</strong> supprimés à la fermeture du navigateur</li>
            <li><strong className="text-foreground">Cookies persistants :</strong> 13 mois maximum, conformément aux recommandations de la CNIL</li>
            <li><strong className="text-foreground">Consentement cookies :</strong> votre choix est conservé 6 mois</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">4. Gestion de vos préférences</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vous pouvez à tout moment modifier vos préférences en matière de cookies en cliquant sur le bouton « Gérer les cookies » situé en bas de chaque page du site, ou en configurant directement votre navigateur.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Voici comment gérer les cookies dans les principaux navigateurs :
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong className="text-foreground">Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
            <li>• <strong className="text-foreground">Firefox :</strong> Paramètres → Vie privée et sécurité → Cookies</li>
            <li>• <strong className="text-foreground">Safari :</strong> Préférences → Confidentialité → Cookies</li>
            <li>• <strong className="text-foreground">Edge :</strong> Paramètres → Cookies et autorisations de site</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Consentement</h2>
          <p className="text-muted-foreground leading-relaxed">
            Lors de votre première visite sur notre site, un bandeau vous informe de la présence de cookies et vous invite à accepter ou refuser leur utilisation. Le dépôt de cookies non essentiels est conditionné à votre consentement préalable, conformément à l'article 82 de la loi Informatique et Libertés et aux lignes directrices de la CNIL.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">6. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pour toute question concernant notre politique de cookies, vous pouvez nous contacter à l'adresse : <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a>.
          </p>
        </div>
      </section>
    </Layout>
  );
}
