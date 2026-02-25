import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function MentionsLegales() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "fr";

  return (
    <Layout>
      <Helmet>
        <title>{lang === "en" ? "Legal Notice — I-CA.RE" : "Mentions légales — I-CA.RE"}</title>
        <meta name="description" content={lang === "en" ? "Legal notice for the I-CA.RE website: publisher, host and director of publication." : "Mentions légales du site I-CA.RE : informations sur l'éditeur, l'hébergeur et le directeur de publication."} />
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{lang === "en" ? "Legal Notice" : "Mentions légales"}</h1>
          <p className="text-muted-foreground">{lang === "en" ? "Last updated: February 2026" : "Dernière mise à jour : février 2026"}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl prose prose-lg">

          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "1. Publisher" : "1. Éditeur du site"}</h2>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">{lang === "en" ? "Company name:" : "Dénomination sociale :"}</strong> I-CA.RE SAS</li>
            <li><strong className="text-foreground">{lang === "en" ? "Legal form:" : "Forme juridique :"}</strong> {lang === "en" ? "Simplified Joint Stock Company (SAS)" : "Société par Actions Simplifiée (SAS)"}</li>
            <li><strong className="text-foreground">{lang === "en" ? "Registered office:" : "Siège social :"}</strong> Bordeaux, France</li>
            <li><strong className="text-foreground">Email :</strong> <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a></li>
            <li><strong className="text-foreground">{lang === "en" ? "Phone:" : "Téléphone :"}</strong> <a href="tel:+33649808097" className="text-primary hover:underline">06 49 80 80 97</a></li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "2. Host" : "2. Hébergeur"}</h2>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">{lang === "en" ? "Company:" : "Raison sociale :"}</strong> Lovable (Lovable Technologies Inc.)</li>
            <li><strong className="text-foreground">{lang === "en" ? "Address:" : "Adresse :"}</strong> San Francisco, CA, {lang === "en" ? "United States" : "États-Unis"}</li>
            <li><strong className="text-foreground">{lang === "en" ? "Website:" : "Site web :"}</strong> <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://lovable.dev</a></li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "3. Intellectual Property" : "3. Propriété intellectuelle"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {lang === "en"
              ? "All content on this site (text, images, graphics, logo, icons, sounds, software) is the exclusive property of I-CA.RE SAS or its partners and is protected by French and international intellectual property laws. Any reproduction, representation, modification, publication or adaptation of all or part of the elements of the site is prohibited without prior written authorisation."
              : "L'ensemble du contenu du site (textes, images, graphismes, logo, icônes, sons, logiciels) est la propriété exclusive d'I-CA.RE SAS ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site est interdite sans autorisation écrite préalable."}
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "4. Limitation of Liability" : "4. Limitation de responsabilité"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {lang === "en"
              ? "I-CA.RE SAS endeavours to ensure the accuracy and currency of information published on this site. However, it cannot guarantee the accuracy, precision or completeness of the information provided. Accordingly, I-CA.RE SAS declines all liability for any inaccuracies, errors or omissions in the information available on the site."
              : "I-CA.RE SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. En conséquence, I-CA.RE SAS décline toute responsabilité pour les éventuelles imprécisions, inexactitudes ou omissions portant sur des informations disponibles sur le site."}
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "5. Hyperlinks" : "5. Liens hypertextes"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {lang === "en"
              ? "The site may contain hyperlinks to other sites. I-CA.RE SAS exercises no control over the content of these third-party sites and assumes no liability for their content or any damage resulting from their use."
              : "Le site peut contenir des liens hypertextes vers d'autres sites. I-CA.RE SAS n'exerce aucun contrôle sur le contenu de ces sites tiers et n'assume aucune responsabilité quant à leur contenu ou aux éventuels dommages résultant de leur utilisation."}
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "6. Applicable Law" : "6. Droit applicable"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {lang === "en"
              ? "These legal notices are governed by French law. In the event of a dispute, the courts of Bordeaux shall have sole jurisdiction."
              : "Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux de Bordeaux seront seuls compétents."}
          </p>
        </div>
      </section>
    </Layout>
  );
}
