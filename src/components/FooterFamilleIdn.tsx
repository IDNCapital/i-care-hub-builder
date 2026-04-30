/**
 * FooterFamilleIdn — Footer "Famille IDN" pour les sites de l'écosystème Groupe IDN.
 *
 * Édition : Sprint 7 (preview).
 * Statut  : EN PREVIEW UNIQUEMENT — ne pas déployer en production tant que le sprint 7
 *           n'a pas été validé. Accessible via /preview-footer-idn (noindex,nofollow).
 *
 * PROCÉDURE DE BASCULE EN PRODUCTION (sprint 7) :
 *   1. Importer ce composant dans le layout global :
 *        import { FooterFamilleIdn } from "@/components/FooterFamilleIdn";
 *   2. Dans `src/components/Layout.tsx` (ou équivalent root layout) :
 *      - Soit en REMPLACEMENT du <Footer /> actuel I-CA.RE,
 *      - Soit en COMPLÉMENT (ajouter <FooterFamilleIdn /> juste APRÈS <Footer />)
 *        si l'on souhaite conserver le footer historique I-CA.RE et signer la
 *        marque affiliée en bas de page.
 *   3. Retirer la route /preview-footer-idn de src/App.tsx (devenue inutile).
 *   4. Retirer la ligne "Disallow: /preview-footer-idn" de public/robots.txt.
 *
 * Charte Groupe IDN (édition 2026, v1) — couleurs écosystème utilisées ici :
 *   - Fond crème            : #F6F5F0
 *   - Anthracite écosystème : #2C2C2C
 *   - Vert IDN Capital      : #1E392B
 *   - Vert "écosystème" (N) : #4A6B58 (vert plus clair pour l'indice du N)
 *   - Or écosystème         : #C2A46C
 *   - Bleu RIVAGE           : #013571
 *   - Sauge I-CA.RE         : #9EB8A5
 *
 * Aucune image lourde n'est requise : tous les logos affiliés sont composés en CSS,
 * sauf RIVAGE qui peut, à terme, être remplacé par un SVG importé depuis /assets/.
 */

const COLORS = {
  cream: "#F6F5F0",
  anthracite: "#2C2C2C",
  forest: "#1E392B",
  ecoGreen: "#4A6B58",
  gold: "#C2A46C",
  rivageBlue: "#013571",
  sage: "#9EB8A5",
  greyMid: "#6B6B6B",
  greyLine: "#E5E3DB",
  creamMuted: "rgba(246,245,240,0.65)",
  sageHover: "#C8D6CD",
};

/* ─────────────────────────────────────────────────────────────────
 * Logos composés en CSS — chacun rendu dans sa typo / couleur charte
 * ───────────────────────────────────────────────────────────────── */

/** ID<sub>N</sub> Capital — marque centrale (vert forêt + N vert écosystème) */
function LogoIdnCapital({ size = "md" }: { size?: "md" | "lg" }) {
  const fontSize = size === "lg" ? "2.25rem" : "1.5rem";
  const subSize = size === "lg" ? "1.4rem" : "0.95rem";
  return (
    <span
      className="font-heading inline-flex items-baseline"
      style={{ color: COLORS.forest, fontSize, lineHeight: 1, letterSpacing: "0.01em" }}
    >
      ID
      <sub
        style={{
          color: COLORS.ecoGreen,
          fontSize: subSize,
          lineHeight: 1,
          marginLeft: "0.02em",
          marginRight: "0.18em",
          verticalAlign: "baseline",
          position: "relative",
          top: "0.18em",
        }}
      >
        N
      </sub>
      <span style={{ fontWeight: 400 }}> Capital</span>
    </span>
  );
}

/** Variante crème pour le bandeau anthracite */
function LogoIdnCapitalOnDark() {
  return (
    <span
      className="font-heading inline-flex items-baseline"
      style={{ color: COLORS.cream, fontSize: "1.25rem", lineHeight: 1 }}
    >
      ID
      <sub
        style={{
          color: COLORS.sage,
          fontSize: "0.8rem",
          lineHeight: 1,
          marginLeft: "0.02em",
          marginRight: "0.18em",
          position: "relative",
          top: "0.18em",
        }}
      >
        N
      </sub>
      <span style={{ fontWeight: 400 }}> Capital</span>
    </span>
  );
}

/** RIVAGE — bleu charte. Fallback texte si pas d'image dans /assets/. */
function LogoRivage() {
  return (
    <span
      className="font-sans"
      style={{
        color: COLORS.rivageBlue,
        fontSize: "1.1rem",
        fontWeight: 700,
        letterSpacing: "0.18em",
      }}
    >
      RIVAGE
    </span>
  );
}

/** IDNéa — anthracite + accent or sur le "é" */
function LogoIdnea() {
  return (
    <span
      className="font-heading"
      style={{ color: COLORS.anthracite, fontSize: "1.25rem", fontStyle: "italic", lineHeight: 1 }}
    >
      IDN<span style={{ color: COLORS.gold, fontStyle: "normal" }}>é</span>a
    </span>
  );
}

/** I-CA.RE — sauge + anthracite, point sauge */
function LogoIcare() {
  return (
    <span
      className="font-sans"
      style={{
        color: COLORS.anthracite,
        fontSize: "1.05rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
      }}
    >
      <span style={{ color: COLORS.sage }}>I</span>
      <span>‑CA</span>
      <span style={{ color: COLORS.sage }}>.</span>
      <span>RE</span>
    </span>
  );
}

/** INside BAT — anthracite + "BAT" or */
function LogoInsideBat() {
  return (
    <span
      className="font-sans"
      style={{ color: COLORS.anthracite, fontSize: "1.05rem", fontWeight: 700, letterSpacing: "0.04em" }}
    >
      INside <span style={{ color: COLORS.gold }}>BAT</span>
    </span>
  );
}

/** co-liv.ing — anthracite, points or */
function LogoColiving() {
  return (
    <span
      className="font-sans"
      style={{ color: COLORS.anthracite, fontSize: "1.1rem", fontWeight: 600, letterSpacing: "0.02em" }}
    >
      co<span style={{ color: COLORS.gold }}>-</span>liv<span style={{ color: COLORS.gold }}>.</span>ing
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Liens marques (TODO : confirmer URLs avant déploiement sprint 7)
 * ───────────────────────────────────────────────────────────────── */
const AFFILIATED_BRANDS: Array<{
  key: string;
  Logo: () => JSX.Element;
  href: string;
  external: boolean;
  label: string;
}> = [
  // TODO confirmer URL RIVAGE
  { key: "rivage", Logo: LogoRivage, href: "#", external: true, label: "RIVAGE" },
  // TODO confirmer URL IDNéa
  { key: "idnea", Logo: LogoIdnea, href: "#", external: true, label: "IDNéa" },
  // I-CA.RE — site courant
  { key: "icare", Logo: LogoIcare, href: "/", external: false, label: "I-CA.RE" },
  // TODO confirmer URL INside BAT
  { key: "insidebat", Logo: LogoInsideBat, href: "#", external: true, label: "INside BAT" },
  // TODO confirmer URL co-liv.ing
  { key: "coliving", Logo: LogoColiving, href: "#", external: true, label: "co-liv.ing" },
];

// TODO confirmer URL ID_N Capital (placeholder : https://idn-capital.com)
const IDN_CAPITAL_HREF = "#";

/* ─────────────────────────────────────────────────────────────────
 * Composant principal
 * ───────────────────────────────────────────────────────────────── */
export function FooterFamilleIdn() {
  const linkProps = (external: boolean) =>
    external
      ? { target: "_blank" as const, rel: "noopener noreferrer" }
      : {};

  return (
    <footer
      aria-label="Famille de marques Groupe IDN"
      className="font-sans"
      style={{ backgroundColor: COLORS.cream, color: COLORS.anthracite }}
    >
      {/* ── Bandeau 1 — Intro ─────────────────────────────────── */}
      <section className="px-6 md:px-10 lg:px-16 pt-14 md:pt-20 pb-10 md:pb-14">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <p
            className="font-sans uppercase font-bold mb-4"
            style={{
              color: COLORS.greyMid,
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
            }}
          >
            Groupe IDN
          </p>
          <h2
            className="font-heading"
            style={{
              color: COLORS.anthracite,
              fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
              fontWeight: 400,
              lineHeight: 1.25,
              maxWidth: "44ch",
              margin: "0 auto",
            }}
          >
            Une famille de marques au service du soin, du logement et de
            l'investissement durable.
          </h2>
          <p
            className="mt-4 font-sans"
            style={{
              color: COLORS.greyMid,
              fontSize: "0.9rem",
              lineHeight: 1.55,
              maxWidth: "52ch",
              margin: "1rem auto 0",
            }}
          >
            I-CA.RE est une marque affiliée du Groupe IDN.
          </p>
        </div>
      </section>

      {/* Filet séparateur */}
      <div
        aria-hidden="true"
        style={{ height: 1, backgroundColor: COLORS.greyLine }}
      />

      {/* ── Bandeau 2 — Marque centrale + affiliées ───────────── */}
      <section className="px-6 md:px-10 lg:px-16 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:grid md:grid-cols-12 md:gap-10 lg:gap-14 items-start">
            {/* Bloc gauche — marque centrale */}
            <div className="md:col-span-4 w-full mb-12 md:mb-0">
              <p
                className="font-sans uppercase font-bold mb-3"
                style={{
                  color: COLORS.greyMid,
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                }}
              >
                Marque centrale
              </p>
              <a
                href={IDN_CAPITAL_HREF}
                {...linkProps(true)}
                className="inline-block transition-opacity hover:opacity-80"
                aria-label="ID N Capital — site externe"
              >
                <LogoIdnCapital size="lg" />
              </a>
            </div>

            {/* Bloc droit — 5 affiliées */}
            <div className="md:col-span-8 w-full">
              <p
                className="font-sans uppercase font-bold mb-5"
                style={{
                  color: COLORS.greyMid,
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                }}
              >
                Marques affiliées
              </p>
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 list-none p-0 m-0"
              >
                {AFFILIATED_BRANDS.map(({ key, Logo, href, external, label }) => (
                  <li
                    key={key}
                    className="flex items-center justify-center sm:justify-start"
                    style={{ minHeight: 56 }}
                  >
                    <a
                      href={href}
                      {...linkProps(external)}
                      className="inline-flex items-center transition-opacity hover:opacity-70"
                      aria-label={`${label}${external ? " — site externe" : ""}`}
                    >
                      <Logo />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bandeau 3 — Signature anthracite ──────────────────── */}
      <section
        className="px-6 md:px-10 lg:px-16 py-8 md:py-10"
        style={{ backgroundColor: COLORS.anthracite, color: COLORS.cream }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Gauche : signature ID_N Capital + filet or + tagline */}
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href={IDN_CAPITAL_HREF}
              {...linkProps(true)}
              className="inline-flex items-center transition-opacity hover:opacity-80"
              aria-label="ID N Capital — site externe"
            >
              <LogoIdnCapitalOnDark />
            </a>
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: 1,
                height: 24,
                backgroundColor: COLORS.gold,
              }}
            />
            <span
              className="font-heading italic"
              style={{
                color: COLORS.creamMuted,
                fontSize: "0.95rem",
                lineHeight: 1.4,
              }}
            >
              L'écosystème d'investissement &amp; de maîtrise d'ouvrage
            </span>
          </div>

          {/* Droite : liens utilitaires */}
          <nav aria-label="Liens utilitaires" className="flex items-center">
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 list-none p-0 m-0">
              {[
                { label: "Mentions légales", href: "/mentions-legales" },
                { label: "Confidentialité", href: "/confidentialite" },
                { label: "Contact", href: "/contact" },
              ].map((link, i, arr) => (
                <li key={link.href} className="inline-flex items-center">
                  <a
                    href={link.href}
                    className="font-sans uppercase transition-colors"
                    style={{
                      color: COLORS.cream,
                      fontSize: "0.72rem",
                      letterSpacing: "0.16em",
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        COLORS.sageHover;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        COLORS.cream;
                    }}
                  >
                    {link.label}
                  </a>
                  {i < arr.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="ml-3"
                      style={{ color: COLORS.creamMuted, fontSize: "0.72rem" }}
                    >
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </footer>
  );
}

export default FooterFamilleIdn;