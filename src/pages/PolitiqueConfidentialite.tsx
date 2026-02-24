import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";

export default function PolitiqueConfidentialite() {
  return (
    <Layout>
      <Helmet>
        <title>Politique de confidentialité — I-CA.RE</title>
        <meta name="description" content="Politique de confidentialité et protection des données personnelles d'I-CA.RE, conforme au RGPD." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Politique de confidentialité</h1>
          <p className="text-muted-foreground">Dernière mise à jour : février 2026</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl prose prose-lg">

          <h2 className="text-2xl font-semibold mt-10 mb-4">1. Responsable du traitement</h2>
          <p className="text-muted-foreground leading-relaxed">
            I-CA.RE SAS, dont le siège social est situé à Bordeaux, est responsable du traitement des données personnelles collectées sur ce site.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Données collectées et finalités</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Nous collectons les données suivantes dans le cadre de nos formulaires de contact et de candidature :</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-left p-3 font-semibold text-foreground">Donnée</th>
                  <th className="text-left p-3 font-semibold text-foreground">Finalité</th>
                  <th className="text-left p-3 font-semibold text-foreground">Base légale</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-t border-border">
                  <td className="p-3">Nom, prénom</td>
                  <td className="p-3">Identification et suivi de la demande</td>
                  <td className="p-3">Consentement</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Adresse email</td>
                  <td className="p-3">Réponse aux demandes, envoi d'informations</td>
                  <td className="p-3">Consentement</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Téléphone</td>
                  <td className="p-3">Contact téléphonique si souhaité</td>
                  <td className="p-3">Consentement</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Profession, ville, surface</td>
                  <td className="p-3">Qualification du projet d'installation</td>
                  <td className="p-3">Intérêt légitime</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Données de navigation</td>
                  <td className="p-3">Amélioration du site, statistiques</td>
                  <td className="p-3">Consentement (cookies)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">3. Durée de conservation</h2>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">Données de contact :</strong> 3 ans à compter du dernier échange</li>
            <li><strong className="text-foreground">Données de candidature :</strong> 2 ans à compter de la soumission</li>
            <li><strong className="text-foreground">Cookies :</strong> 13 mois maximum</li>
            <li><strong className="text-foreground">Logs de connexion :</strong> 12 mois</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">4. Destinataires des données</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vos données sont destinées exclusivement à l'équipe I-CA.RE. Elles ne sont en aucun cas cédées ou vendues à des tiers. Elles peuvent être transmises à nos sous-traitants techniques (hébergement, envoi d'emails) dans le strict cadre de l'exécution de leurs prestations et sous contrat de confidentialité.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Vos droits</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>✓ Droit d'accès à vos données personnelles</li>
            <li>✓ Droit de rectification des données inexactes</li>
            <li>✓ Droit à l'effacement (« droit à l'oubli »)</li>
            <li>✓ Droit à la limitation du traitement</li>
            <li>✓ Droit à la portabilité de vos données</li>
            <li>✓ Droit d'opposition au traitement</li>
            <li>✓ Droit de retirer votre consentement à tout moment</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">6. Contact DPO</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pour exercer vos droits ou pour toute question relative à la protection de vos données personnelles, vous pouvez contacter notre Délégué à la Protection des Données :
          </p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0 mt-4">
            <li><strong className="text-foreground">Email :</strong> <a href="mailto:dpo@i-care.fr" className="text-primary hover:underline">dpo@i-care.fr</a></li>
            <li><strong className="text-foreground">Courrier :</strong> I-CA.RE SAS — DPO, [Adresse], 33000 Bordeaux</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">7. Transferts de données</h2>
          <p className="text-muted-foreground leading-relaxed">
            Certains de nos sous-traitants techniques peuvent être situés en dehors de l'Union européenne. Dans ce cas, des garanties appropriées sont mises en place (clauses contractuelles types de la Commission européenne) pour assurer un niveau de protection adéquat de vos données.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">8. Sécurité</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation, notamment le chiffrement des données en transit (HTTPS) et au repos.
          </p>
        </div>
      </section>
    </Layout>
  );
}
