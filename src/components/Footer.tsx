import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";

export function Footer() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const navigationLinks = [
    { name: t("nav.home"), href: localePath(lang, "home") },
    { name: t("nav.projects"), href: localePath(lang, "projects") },
    { name: t("nav.professionals"), href: localePath(lang, "professionals") },
    { name: t("nav.investment"), href: localePath(lang, "investment") },
  ];

  const companyLinks = [
    { name: t("nav.approach"), href: localePath(lang, "approach") },
    { name: t("nav.contact"), href: localePath(lang, "contact") },
  ];

  const legalLinks = [
    { name: t("footer.legal"), href: localePath(lang, "legal") },
    { name: t("footer.privacy"), href: localePath(lang, "privacy") },
    { name: t("footer.cookies"), href: localePath(lang, "cookies") },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to={localePath(lang, "home")} className="inline-block">
            <span className="text-2xl font-heading font-bold tracking-tight whitespace-nowrap">
                <span className="text-primary">I-</span>
                <span className="text-background">CA</span>
                <span className="text-primary">.</span>
                <span className="text-background">RE</span>
              </span>
            </Link>
            <p className="mt-2 text-background/60 text-sm font-heading italic">
              Des lieux de soin, pensés comme des lieux de vie
            </p>
            <p className="mt-6 text-background/40 text-xs">
              © {new Date().getFullYear()} I-CA.RE. {t("footer.rights")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-background/50 mb-4">
              {t("footer.navigation")}
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-background transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-background/50 mb-4">
              {lang === "fr" ? "Entreprise" : "Company"}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-background transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-background/50 mb-4">
              {t("nav.contact")}
            </h3>
            <div className="space-y-3 text-sm text-background/70">
              <p>Bordeaux, France</p>
              <a
                href="mailto:contact@i-ca.re"
                className="block hover:text-background transition-colors duration-300"
              >
                contact@i-ca.re
              </a>
              <a
                href="tel:+33649808097"
                className="block hover:text-background transition-colors duration-300"
              >
                06 49 80 80 97
              </a>
            </div>
            <div className="mt-6">
              <h4 className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-background/40 mb-2">
                {lang === "fr" ? "Légal" : "Legal"}
              </h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-background/40 hover:text-background/70 transition-colors duration-300 text-xs"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
