/**
 * FooterFamilleIdn — Footer "Famille IDN" (sprint 7 preview, v2).
 *
 * v2 — corrections appliquées :
 *   1. RIVAGE rendu via PNG officiel (src/assets/rivage-logo.png), masqué sur
 *      bandeau anthracite (signature dark = ID(N) Capital uniquement).
 *   2. Réduction globale des tailles (signature de fin de page) :
 *      - Titre Playfair 22-26px desktop / 18-20px mobile
 *      - ID(N) Capital central : ~30px de hauteur visuelle
 *      - Logos affiliés uniformisés à ~22px desktop / 18px mobile
 *      - Padding section 48px desktop / 32px mobile
 *   3. Compositions CSS recalées sur charte Groupe IDN :
 *      - ID(N) Capital : "ID" anthracite + "N" subscript vert forêt #1E392B
 *        + " Capital" anthracite, sans-serif (PAS Playfair)
 *      - IDNéa : "IDN" anthracite + "éa" italique or écosystème #C2A46C
 *      - I-CA.RE : "I", "-", "." sauge ; "CA", "RE" anthracite sur cream,
 *        cream sur anthracite (lisibilité corrigée)
 *
 * Statut : EN PREVIEW UNIQUEMENT — accessible via /preview-footer-idn.
 */
import type { ReactElement } from "react";
import rivageLogo from "@/assets/rivage-logo.png";

const COLORS = {
  cream: "#F6F5F0",
  anthracite: "#2C2C2C",
  forest: "#1E392B",
  gold: "#C2A46C",
  sage: "#9EB8A5",
  greyMid: "#6B6B6B",
  greyLine: "#E5E3DB",
  creamMuted: "rgba(246,245,240,0.65)",
  sageHover: "#C8D6CD",
};

/* ─────────────────────────────────────────────────────────────────
 * Logos composés en CSS — segmentation charte Groupe IDN
 * Hauteur visuelle cible : ~22px desktop / 18px mobile
 * ───────────────────────────────────────────────────────────────── */

/** ID<sub>N</sub> Capital — central (52px) ou inline (1.05rem) ou onDark */
function LogoIdnCapital({ variant = "inline" }: { variant?: "inline" | "central" | "onDark" }) {
  const fontSize = variant === "central" ? "3.25rem" : "1.05rem";
  const nColor = variant === "onDark" ? COLORS.sage : COLORS.forest;
  const baseColor = variant === "onDark" ? COLORS.cream : COLORS.anthracite;
  return (
    <span
      className="font-sans inline-flex items-baseline"
      style={{ color: baseColor, fontSize, lineHeight: 1, fontWeight: 700, letterSpacing: "0.01em" }}
    >
      ID
      <sub
        style={{
          color: nColor,
          fontSize: "0.62em",
          lineHeight: 1,
          marginLeft: "0.01em",
          marginRight: "0.15em",
          verticalAlign: "sub",
          position: "relative",
          top: "0.18em",
          fontWeight: 700,
        }}
      >
        N
      </sub>
      <span style={{ fontWeight: 600, marginLeft: "0.15em" }}>Capital</span>
    </span>
  );
}

/** RIVAGE — PNG officiel, hauteur uniformisée aux affiliées */
function LogoRivage() {
  return (
    <img
      src={rivageLogo}
      alt="RIVAGE"
      className="block w-auto mx-auto"
      style={{ height: "26px" }}
    />
  );
}

/** IDNéa — "IDN" anthracite, "éa" italique or */
function LogoIdnea() {
  return (
    <span
      className="font-sans inline-flex items-baseline"
      style={{ color: COLORS.anthracite, fontSize: "1.5rem", lineHeight: 1, fontWeight: 700, letterSpacing: "0.01em" }}
    >
      IDN
      <span style={{ color: COLORS.gold, fontStyle: "italic", fontWeight: 500 }}>éa</span>
    </span>
  );
}

/** I-CA.RE — sauge + anthracite (sur cream) */
function LogoIcare() {
  return (
    <span
      className="font-sans"
      style={{
        fontSize: "1.35rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        lineHeight: 1,
      }}
    >
      <span style={{ color: COLORS.sage }}>I</span>
      <span style={{ color: COLORS.sage }}>‑</span>
      <span style={{ color: COLORS.anthracite }}>CA</span>
      <span style={{ color: COLORS.sage }}>.</span>
      <span style={{ color: COLORS.anthracite }}>RE</span>
    </span>
  );
}

/** I-CA.RE — variante sur fond anthracite (CA et RE en crème pour lisibilité) */
function LogoIcareOnDark() {
  return (
    <span
      className="font-sans"
      style={{
        fontSize: "0.9rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        lineHeight: 1,
      }}
    >
      <span style={{ color: COLORS.sage }}>I</span>
      <span style={{ color: COLORS.sage }}>‑</span>
      <span style={{ color: COLORS.cream }}>CA</span>
      <span style={{ color: COLORS.sage }}>.</span>
      <span style={{ color: COLORS.cream }}>RE</span>
    </span>
  );
}

/** INside BAT — anthracite + "BAT" or */
function LogoInsideBat() {
  return (
    <span
      className="font-sans"
      style={{ color: COLORS.anthracite, fontSize: "1.35rem", fontWeight: 700, letterSpacing: "0.04em", lineHeight: 1 }}
    >
      INside <span style={{ color: COLORS.gold }}>BAT</span>
    </span>
  );
}

/** co-liv.ing — anthracite, ponctuation or */
function LogoColiving() {
  return (
    <span
      className="font-sans"
      style={{ color: COLORS.anthracite, fontSize: "1.4rem", fontWeight: 600, letterSpacing: "0.02em", lineHeight: 1 }}
    >
      co<span style={{ color: COLORS.gold }}>-</span>liv<span style={{ color: COLORS.gold }}>.</span>ing
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Liens marques (TODO : confirmer URLs avant déploiement sprint 7)
 * ───────────────────────────────────────────────────────────────── */
type AffiliatedBrand = {
  key: string;
  Logo: () => ReactElement;
  href: string;
  external: boolean;
  label: string;
  tagline: string;
  /** Position desktop dans la grille 3×3 (col / row, 1-indexé). */
  desktop: { col: number; row: number };
};

const AFFILIATED_BRANDS: Record<string, AffiliatedBrand> = {
  rivage: {
    key: "rivage",
    Logo: LogoRivage,
    href: "#",
    external: true,
    label: "RIVAGE",
    tagline: "Ingénierie immobilière complexe et réhabilitation",
    desktop: { col: 1, row: 1 },
  },
  idnea: {
    key: "idnea",
    Logo: LogoIdnea,
    href: "#",
    external: true,
    label: "IDNéa",
    tagline: "Conseil stratégique et accompagnement de la maîtrise d'ouvrage",
    desktop: { col: 3, row: 1 },
  },
  icare: {
    key: "icare",
    Logo: LogoIcare,
    href: "/",
    external: false,
    label: "I-CA.RE",
    tagline: "Immobilier santé et bien-être",
    desktop: { col: 1, row: 3 },
  },
  insidebat: {
    key: "insidebat",
    Logo: LogoInsideBat,
    href: "#",
    external: true,
    label: "INside BAT",
    tagline: "Construction intérieure et second œuvre",
    desktop: { col: 2, row: 3 },
  },
  coliving: {
    key: "coliving",
    Logo: LogoColiving,
    href: "#",
    external: true,
    label: "co-liv.ing",
    tagline: "Plateforme de logement partagé",
    desktop: { col: 3, row: 3 },
  },
};

const AFFILIATED_ORDER: Array<keyof typeof AFFILIATED_BRANDS> = [
  "rivage",
  "idnea",
  "icare",
  "insidebat",
  "coliving",
];

const IDN_CAPITAL_HREF = "#";

/* ─────────────────────────────────────────────────────────────────
 * Composant principal
 * ───────────────────────────────────────────────────────────────── */
export function FooterFamilleIdn() {
  const linkProps = (external: boolean) =>
    external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};

  return (
    <footer
      aria-label="Famille de marques Groupe IDN"
      className="font-sans"
      style={{ backgroundColor: COLORS.cream, color: COLORS.anthracite }}
    >
      {/* ── Bandeau 1 — Famille IDN (compact) ─────────────────── */}
      <section className="px-6 md:px-10 lg:px-16 pt-8 md:pt-12 pb-8 md:pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Intro centrée */}
          <div className="text-center mb-8 md:mb-10">
            <p
              className="font-sans uppercase font-bold mb-3"
              style={{
                color: COLORS.greyMid,
                fontSize: "0.6875rem",
                letterSpacing: "0.18em",
              }}
            >
              Groupe IDN
            </p>
            <h2
              className="font-heading mx-auto"
              style={{
                color: COLORS.anthracite,
                fontSize: "clamp(1.125rem, 1.6vw, 1.5rem)",
                fontWeight: 400,
                lineHeight: 1.35,
                maxWidth: "44ch",
              }}
            >
              Une famille de marques au service du soin, du logement et de
              l'investissement durable.
            </h2>
            <p
              className="font-sans mx-auto"
              style={{
                color: COLORS.greyMid,
                fontSize: "0.875rem",
                lineHeight: 1.5,
                marginTop: "1rem",
              }}
            >
              I-CA.RE est une marque affiliée du Groupe IDN.
            </p>
          </div>

          {/* Marque centrale + affiliées */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-10">
            {/* Marque centrale */}
            <div className="flex flex-col items-center md:items-start shrink-0">
              <p
                className="font-sans uppercase font-bold mb-2"
                style={{
                  color: COLORS.greyMid,
                  fontSize: "0.6875rem",
                  letterSpacing: "0.2em",
                }}
              >
                Marque centrale
              </p>
              <a
                href={IDN_CAPITAL_HREF}
                {...linkProps(true)}
                className="inline-block transition-opacity hover:opacity-70"
                aria-label="ID N Capital — site externe"
              >
                <LogoIdnCapital variant="central" />
              </a>
            </div>

            {/* Affiliées */}
            <div className="flex-1 w-full">
              <p
                className="font-sans uppercase font-bold mb-3 text-center md:text-left"
                style={{
                  color: COLORS.greyMid,
                  fontSize: "0.6875rem",
                  letterSpacing: "0.2em",
                }}
              >
                Marques affiliées
              </p>
              <ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-4 list-none p-0 m-0">
                {AFFILIATED_BRANDS.map(({ key, Logo, href, external, label }) => (
                  <li key={key} className="flex items-center" style={{ minHeight: 24 }}>
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

      {/* ── Bandeau 2 — Signature anthracite ──────────────────── */}
      <section
        className="px-6 md:px-10 lg:px-16 py-6 md:py-8"
        style={{ backgroundColor: COLORS.anthracite, color: COLORS.cream }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          {/* Signature ID(N) Capital */}
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href={IDN_CAPITAL_HREF}
              {...linkProps(true)}
              className="inline-flex items-center transition-opacity hover:opacity-80"
              aria-label="ID N Capital — site externe"
            >
              <LogoIdnCapital variant="onDark" />
            </a>
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: 1,
                height: 20,
                backgroundColor: COLORS.gold,
              }}
            />
            <span
              className="font-heading italic"
              style={{
                color: COLORS.creamMuted,
                fontSize: "0.875rem",
                lineHeight: 1.4,
              }}
            >
              L'écosystème d'investissement &amp; de maîtrise d'ouvrage
            </span>
          </div>

          {/* Liens utilitaires + I-CA.RE © */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
            <span
              className="font-sans"
              style={{
                color: COLORS.creamMuted,
                fontSize: "0.75rem",
                letterSpacing: "0.04em",
              }}
            >
              © 2026 <LogoIcareOnDark /> — Tous droits réservés
            </span>
            <nav aria-label="Liens utilitaires">
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
                        fontSize: "0.6875rem",
                        letterSpacing: "0.16em",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = COLORS.sageHover;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = COLORS.cream;
                      }}
                    >
                      {link.label}
                    </a>
                    {i < arr.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="ml-3"
                        style={{ color: COLORS.creamMuted, fontSize: "0.6875rem" }}
                      >
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default FooterFamilleIdn;
