import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { FooterFamilleIdn } from "@/components/FooterFamilleIdn";

/**
 * /preview-footer-idn — page de validation visuelle du footer "Famille IDN"
 * avant déploiement sprint 7.
 *
 * - noindex,nofollow (Helmet) + Disallow dans robots.txt
 * - Affiche un contenu sobre puis le composant FooterFamilleIdn en bas de page,
 *   pour valider la transition visuelle palette I-CA.RE → palette écosystème IDN.
 */
export default function PreviewFooterIdn() {
  return (
    <>
      <Helmet>
        <title>Preview | Footer Famille IDN | I-CA.RE</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="bg-background pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
              <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-4">
                Preview interne
              </p>
              <h1 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-4">
                Footer Famille IDN, validation sprint&nbsp;7
              </h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Cette page sert uniquement à valider visuellement le composant
                <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground text-sm">
                  Footer
                </code>
                avant déploiement officiel. Elle est exclue de l'indexation
                (noindex,&nbsp;nofollow + robots.txt).
              </p>
            </div>
          </section>
        </main>
        <FooterFamilleIdn />
      </div>
    </>
  );
}