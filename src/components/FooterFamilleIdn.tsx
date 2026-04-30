/**
 * FooterFamilleIdn — Footer unifié I-CA.RE (v3 compact).
 *
 * 3 bandeaux empilés sans gap :
 *   A — anthracite : liens utiles (4 colonnes compactes)
 *   B — crème     : signature Famille IDN sur UNE ligne
 *   C — anthracite : copyright + légal sur UNE ligne
 *
 * Cible hauteur desktop : 320-400px.
 * Statut : preview /preview-footer-idn-v3 — pas encore en prod.
 */
import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import rivageLogo from "@/assets/rivage-logo.png";
import { localePath } from "@/lib/routes";
import { BrandName } from "./BrandName";
import { LinkedInLink } from "./LinkedInLink";

const COLORS = {
  cream: "#F6F5F0",
  anthracite: "#2C2C2C",
  forest: "#1E392B",
  gold: "#C2A46C",
  sage: "#9EB8A5",
  greyMid: "#6B6B6B",
  greyLight: "#9A9A9A",
  creamMuted: "rgba(246,245,240,0.6)",
  creamDim: "rgba(246,245,240,0.45)",
};

/* ─────────────── Compositions CSS des logos (charte Groupe IDN) ─────────────── */

/** ID(N) Capital — variant light (cream bg) / dark (anthracite bg) */
function LogoIdnCapital({
  variant = "light",
  sizeEm = 1,
}: {
  variant?: "light" | "dark";
  sizeEm?: number;
}) {
  const baseColor = variant === "dark" ? COLORS.cream : COLORS.anthracite;
  // Charte : vert forêt sur clair, or sur anthracite (lisibilité)
  const nColor = variant === "dark" ? COLORS.gold : COLORS.forest;
  return (
    <span
      className="font-sans inline-flex items-baseline"
      style={{
        color: baseColor,
        fontSize: `${sizeEm}em`,
        lineHeight: 1,
        fontWeight: 700,
        letterSpacing: "0.01em",
      }}
    >
      ID
      <sub
        style={{
          color: nColor,
          fontSize: "0.62em",
          lineHeight: 1,
          marginLeft: "0.01em",
          marginRight: "0.05em",
          verticalAlign: "sub",
          position: "relative",
          top: "0.18em",
          fontWeight: 700,
        }}
      >
        N
      </sub>
      <span style={{ fontWeight: 600, marginLeft: "0.18em" }}>Capital</span>
    </span>
  );
}

/** RIVAGE — PNG officiel */
function LogoRivage() {
  return (
    <img
      src={rivageLogo}
      alt="RIVAGE"
      className="block w-auto"
      style={{ height: "20px" }}
      loading="lazy"
    />
  );
}

/** IDNéa — "ID" + "N" subscript anthracite + "éa" italique or */
function LogoIdnea() {
  return (
    <span
      className="font-sans inline-flex items-baseline"
      style={{
        color: COLORS.anthracite,
        fontSize: "1.1rem",
        lineHeight: 1,
        fontWeight: 400,
        letterSpacing: "0.01em",
      }}
    >
      ID
      <sub
        style={{
          color: COLORS.anthracite,
          fontSize: "0.62em",
          lineHeight: 1,
          marginLeft: "0.01em",
          marginRight: "0.02em",
          verticalAlign: "sub",
          position: "relative",
          top: "0.18em",
          fontWeight: 400,
        }}
      >
        N
      </sub>
      <span style={{ color: COLORS.gold, fontStyle: "italic", fontWeight: 500 }}>éa</span>
    </span>
  );
}

/** I-CA.RE — sauge + anthracite (sur cream) */
function LogoIcareLight() {
  return (
    <span
      className="font-sans"
      style={{ fontSize: "1.05rem", fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1 }}
    >
      <span style={{ color: COLORS.sage }}>I</span>
      <span style={{ color: COLORS.sage }}>‑</span>
      <span style={{ color: COLORS.anthracite }}>CA</span>
      <span style={{ color: COLORS.sage }}>.</span>
      <span style={{ color: COLORS.anthracite }}>RE</span>
    </span>
  );
}

/** I-CA.RE — variant sur anthracite (CA et RE en crème) */
function LogoIcareDark({ sizeEm = 0.9 }: { sizeEm?: number }) {
  return (
    <span
      className="font-sans inline-block"
      style={{ fontSize: `${sizeEm}rem`, fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1 }}
    >
      <span style={{ color: COLORS.sage }}>I</span>
      <span style={{ color: COLORS.sage }}>‑</span>
      <span style={{ color: COLORS.cream }}>CA</span>
      <span style={{ color: COLORS.sage }}>.</span>
      <span style={{ color: COLORS.cream }}>RE</span>
    </span>
  );
}

/** INside BAT — "IN" or, "side BAT" anthracite (charte) */
function LogoInsideBat() {
  return (
    <span
      className="font-sans"
      style={{ fontSize: "1.05rem", letterSpacing: "0.02em", lineHeight: 1 }}
    >
      <span style={{ color: COLORS.gold, fontWeight: 600 }}>IN</span>
      <span style={{ color: COLORS.anthracite, fontWeight: 400 }}>side BAT</span>
    </span>
  );
}

/** co-liv.ing — anthracite, "-" et "." or */
function LogoColiving() {
  return (
    <span
      className="font-sans"
      style={{ color: COLORS.anthracite, fontSize: "1.05rem", fontWeight: 400, letterSpacing: "0.01em", lineHeight: 1 }}
    >
      co<span style={{ color: COLORS.gold }}>-</span>liv<span style={{ color: COLORS.gold }}>.</span>ing
    </span>
  );
}

/* ─────────────── Marques affiliées (config) ─────────────── */
type Brand = {
  key: string;
  Logo: () => ReactElement;
  href: string;
  external: boolean;
  label: string;
  tagline: string;
};

const IDN_CAPITAL_HREF = "#";

const BRANDS_INLINE: Brand[] = [
  { key: "rivage", Logo: LogoRivage, href: "#", external: true, label: "RIVAGE", tagline: "Ingénierie immobilière complexe et réhabilitation" },
  { key: "idnea", Logo: LogoIdnea, href: "#", external: true, label: "IDNéa", tagline: "Conseil stratégique et accompagnement de la maîtrise d'ouvrage" },
  { key: "icare", Logo: LogoIcareLight, href: "/", external: false, label: "I-CA.RE", tagline: "Immobilier de soin, paramédical et bien-être" },
  { key: "insidebat", Logo: LogoInsideBat, href: "#", external: true, label: "INside BAT", tagline: "Construction intérieure et second œuvre" },
  { key: "coliving", Logo: LogoColiving, href: "#", external: true, label: "co-liv.ing", tagline: "Plateforme de logement partagé" },
];

/* ─────────────── Composant principal ─────────────── */
export function FooterFamilleIdn() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const linkProps = (external: boolean) =>
    external ? { target: "_blank" as const, rel: "noopener noreferrer" as const } : {};

  const navigationLinks = [
    { name: t("nav.home"), href: localePath(lang, "home") },
    { name: t("nav.projects"), href: localePath(lang, "projects") },
    { name: t("nav.professionals"), href: localePath(lang, "professionals") },
    { name: t("nav.investment"), href: localePath(lang, "investment") },
  ];
  const companyLinks = [
    { name: t("nav.approach"), href: localePath(lang, "approach") },
    { name: lang === "fr" ? "Questions fréquentes" : "FAQ", href: localePath(lang, "faq") },
    { name: t("nav.contact"), href: localePath(lang, "contact") },
  ];
  const resourceLinks = [
    { name: lang === "fr" ? "Guides pratiques" : "Practical guides", href: localePath(lang, "insights") },
    { name: lang === "fr" ? "S'installer" : "Setting up", href: localePath(lang, "installerCabinet") },
    { name: lang === "fr" ? "Cabinet à louer Bordeaux" : "Office Bordeaux", href: localePath(lang, "locationBordeaux") },
  ];

  const surTitre: React.CSSProperties = {
    fontSize: "11px",
    letterSpacing: "0.12em",
    fontWeight: 700,
    textTransform: "uppercase",
    color: "rgba(246,245,240,0.5)",
    marginBottom: "12px",
  };
  const linkBase: React.CSSProperties = {
    fontSize: "13px",
    lineHeight: 1.4,
    color: "rgba(246,245,240,0.75)",
  };

  return (
    <footer aria-label="Pied de page I-CA.RE" className="font-sans">
      {/* ── BANDEAU A — anthracite, liens utiles ─────────────── */}
      <section
        style={{ backgroundColor: COLORS.anthracite, color: COLORS.cream }}
        className="px-4 sm:px-6 lg:px-8"
      >
        <div
          className="container mx-auto"
          style={{ paddingTop: "48px", paddingBottom: "48px" }}
        >
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            style={{ columnGap: "48px", rowGap: "32px" }}
          >
            {/* Brand */}
            <div>
              <Link to={localePath(lang, "home")} className="inline-block">
                <BrandName variant="light" className="text-xl font-heading font-bold tracking-tight" />
              </Link>
              <p
                className="font-heading italic mt-2"
                style={{ fontSize: "14px", lineHeight: 1.4, color: "rgba(246,245,240,0.6)" }}
              >
                Des lieux de soin, pensés comme des lieux de vie
              </p>
              <p style={{ fontSize: "12px", color: "rgba(246,245,240,0.4)", marginTop: "16px" }}>
                © {new Date().getFullYear()} <BrandName className="text-xs" variant="light" />. {t("footer.rights")}
              </p>
              <div style={{ marginTop: "16px" }}>
                <LinkedInLink showLabel labelTone="light" className="-ml-2" />
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 style={surTitre}>{t("footer.navigation")}</h3>
              <ul className="space-y-2 list-none p-0 m-0">
                {navigationLinks.map((l) => (
                  <li key={l.name}>
                    <Link to={l.href} style={linkBase} className="hover:text-background transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Entreprise + Ressources */}
            <div>
              <h3 style={surTitre}>{lang === "fr" ? "Entreprise" : "Company"}</h3>
              <ul className="space-y-2 list-none p-0 m-0" style={{ marginBottom: "20px" }}>
                {companyLinks.map((l) => (
                  <li key={l.name}>
                    <Link to={l.href} style={linkBase} className="hover:text-background transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <h3 style={surTitre}>{lang === "fr" ? "Ressources" : "Resources"}</h3>
              <ul className="space-y-2 list-none p-0 m-0">
                {resourceLinks.map((l) => (
                  <li key={l.name}>
                    <Link to={l.href} style={linkBase} className="hover:text-background transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 style={surTitre}>{t("nav.contact")}</h3>
              <ul className="space-y-2 list-none p-0 m-0">
                <li style={linkBase}>Bordeaux, France</li>
                <li>
                  <a href="mailto:contact@i-ca.re" style={linkBase} className="hover:text-background transition-colors">
                    contact@i-ca.re
                  </a>
                </li>
                <li>
                  <a href="tel:+33649808097" style={linkBase} className="hover:text-background transition-colors">
                    06 49 80 80 97
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── BANDEAU B — crème, signature Famille IDN sur UNE ligne ─────────── */}
      <section
        aria-label="Famille de marques Groupe IDN"
        style={{ backgroundColor: COLORS.cream, color: COLORS.anthracite }}
        className="px-4 sm:px-6 lg:px-8"
      >
        <div
          className="container mx-auto text-center"
          style={{ paddingTop: "24px", paddingBottom: "24px" }}
        >
          <ul
            className="list-none p-0 m-0 flex flex-wrap items-center justify-center"
            style={{ columnGap: "14px", rowGap: "10px" }}
          >
            {/* ID(N) Capital, central, légèrement plus grand */}
            <li className="inline-flex items-center">
              <a
                href={IDN_CAPITAL_HREF}
                {...linkProps(true)}
                title="ID N Capital — Holding d'investissement"
                aria-label="ID N Capital"
                className="inline-flex items-center transition-opacity hover:opacity-70"
              >
                <LogoIdnCapital variant="light" sizeEm={1.25} />
              </a>
            </li>
            {BRANDS_INLINE.map((b) => (
              <li key={b.key} className="inline-flex items-center" style={{ columnGap: "14px" }}>
                <span
                  aria-hidden="true"
                  style={{ color: COLORS.greyLight, fontSize: "13px", marginRight: "14px" }}
                >
                  ·
                </span>
                <a
                  href={b.href}
                  {...linkProps(b.external)}
                  title={b.tagline}
                  aria-label={b.label}
                  className="inline-flex items-center transition-opacity hover:opacity-70"
                  style={{ minHeight: "20px" }}
                >
                  <b.Logo />
                </a>
              </li>
            ))}
          </ul>
          <p
            className="font-sans"
            style={{
              fontSize: "12px",
              color: COLORS.greyMid,
              lineHeight: 1.4,
              marginTop: "12px",
            }}
          >
            I-CA.RE est une marque affiliée du Groupe IDN.
          </p>
        </div>
      </section>

      {/* ── BANDEAU C — anthracite, copyright + légal sur UNE ligne ─────────── */}
      <section
        style={{ backgroundColor: COLORS.anthracite, color: COLORS.cream }}
        className="px-4 sm:px-6 lg:px-8"
      >
        <div
          className="container mx-auto"
          style={{ paddingTop: "20px", paddingBottom: "20px" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Gauche : ID(N) Capital + filet or + tagline */}
            <div className="flex items-center justify-center md:justify-start flex-wrap" style={{ columnGap: "12px", rowGap: "6px" }}>
              <a
                href={IDN_CAPITAL_HREF}
                {...linkProps(true)}
                aria-label="ID N Capital"
                className="inline-flex items-center transition-opacity hover:opacity-80"
              >
                <LogoIdnCapital variant="dark" sizeEm={1} />
              </a>
              <span
                aria-hidden="true"
                style={{ display: "inline-block", width: 1, height: 14, backgroundColor: COLORS.gold }}
              />
              <span
                className="font-heading italic"
                style={{ color: COLORS.creamMuted, fontSize: "13px", lineHeight: 1.3 }}
              >
                L'écosystème d'investissement &amp; de maîtrise d'ouvrage
              </span>
            </div>

            {/* Droite : copyright + liens légaux */}
            <div
              className="flex items-center justify-center md:justify-end flex-wrap font-sans"
              style={{ columnGap: "10px", rowGap: "6px" }}
            >
              <span style={{ fontSize: "11px", color: COLORS.creamMuted, letterSpacing: "0.02em" }}>
                © {new Date().getFullYear()} <LogoIcareDark sizeEm={0.75} /> — Tous droits réservés
              </span>
              {[
                { label: lang === "fr" ? "Mentions légales" : "Legal", href: localePath(lang, "legal") },
                { label: lang === "fr" ? "Confidentialité" : "Privacy", href: localePath(lang, "privacy") },
                { label: t("nav.contact"), href: localePath(lang, "contact") },
              ].map((l, i, arr) => (
                <span key={l.href} className="inline-flex items-center" style={{ columnGap: "10px" }}>
                  <span aria-hidden="true" style={{ color: COLORS.creamDim, fontSize: "11px", marginRight: "10px" }}>·</span>
                  <Link
                    to={l.href}
                    className="uppercase hover:opacity-80 transition-opacity"
                    style={{ fontSize: "11px", letterSpacing: "0.14em", color: COLORS.cream, fontWeight: 500 }}
                  >
                    {l.label}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default FooterFamilleIdn;