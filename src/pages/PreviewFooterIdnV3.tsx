import { Header } from "@/components/Header";
import { FooterFamilleIdn } from "@/components/FooterFamilleIdn";

/**
 * /preview-footer-idn-v3 : preview du footer compact unifié (v3).
 * noindex,nofollow + Disallow robots.txt.
 */
export default function PreviewFooterIdnV3() {
  return (
    <>
      <title>Preview v3 | Footer compact | I-CA.RE</title>
      <meta name="robots" content="noindex,nofollow" />
      <meta name="googlebot" content="noindex,nofollow" />

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="bg-background pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
              <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-4">
                Preview interne, v3
              </p>
              <h1 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-4">
                Footer compact unifié, validation
              </h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Cible 320 à 400px desktop. 3 bandeaux empilés sans gap : liens utiles
                (anthracite), signature Famille IDN une ligne (crème), copyright
                (anthracite). Page exclue de l'indexation.
              </p>
            </div>
          </section>
        </main>
        <FooterFamilleIdn />
      </div>
    </>
  );
}