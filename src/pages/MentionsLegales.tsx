import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";

export default function MentionsLegales() {
  return (
    <Layout>
      <Helmet>
        <title>Mentions légales — I-CA.RE</title>
        <meta name="description" content="Mentions légales du site I-CA.RE : informations sur l'éditeur, l'hébergeur et le directeur de publication." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mentions légales</h1>
          <p className="text-muted-foreground">Dernière mise à jour : février 2026</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl prose prose-lg">

          <h2 className="text-2xl font-semibold mt-10 mb-4">1. Éditeur du site</h2>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">Dénomination sociale :</strong> I-CA.RE SAS</li>
            <li><strong className="text-foreground">Forme juridique :</strong> Société par Actions Simplifiée (SAS)</li>
            <li><strong className="text-foreground">Capital social :</strong> [Montant] €</li>
            <li><strong className="text-foreground">Siège social :</strong> [Adresse complète], 33000 Bordeaux, France</li>
            <li><strong className="text-foreground">RCS :</strong> Bordeaux [Numéro RCS]</li>
            <li><strong className="text-foreground">SIRET :</strong> [Numéro SIRET]</li>
            <li><strong className="text-foreground">Numéro de TVA :</strong> FR [Numéro TVA]</li>
            <li><strong className="text-foreground">Directeur de la publication :</strong> [Nom du dirigeant], en qualité de Président</li>
            <li><strong className="text-foreground">Email :</strong> <a href="mailto:contact@i-care.fr" className="text-primary hover:underline">contact@i-care.fr</a></li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Hébergeur</h2>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">Raison sociale :</strong> Lovable (Lovable Technologies Inc.)</li>
            <li><strong className="text-foreground">Adresse :</strong> San Francisco, CA, États-Unis</li>
            <li><strong className="text-foreground">Site web :</strong> <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://lovable.dev</a></li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">3. Propriété intellectuelle</h2>
          <p className="text-muted-foreground leading-relaxed">
            L'ensemble du contenu du site (textes, images, graphismes, logo, icônes, sons, logiciels) est la propriété exclusive d'I-CA.RE SAS ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site est interdite sans autorisation écrite préalable.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">4. Limitation de responsabilité</h2>
          <p className="text-muted-foreground leading-relaxed">
            I-CA.RE SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. En conséquence, I-CA.RE SAS décline toute responsabilité pour les éventuelles imprécisions, inexactitudes ou omissions portant sur des informations disponibles sur le site.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Liens hypertextes</h2>
          <p className="text-muted-foreground leading-relaxed">
            Le site peut contenir des liens hypertextes vers d'autres sites. I-CA.RE SAS n'exerce aucun contrôle sur le contenu de ces sites tiers et n'assume aucune responsabilité quant à leur contenu ou aux éventuels dommages résultant de leur utilisation.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">6. Droit applicable</h2>
          <p className="text-muted-foreground leading-relaxed">
            Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux de Bordeaux seront seuls compétents.
          </p>
        </div>
      </section>
    </Layout>
  );
}
