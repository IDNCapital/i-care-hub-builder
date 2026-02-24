import { Link } from "react-router-dom";

const footerLinks = {
  navigation: [
    { name: "Accueil", href: "/" },
    { name: "Projets", href: "/projets" },
    { name: "Professionnels de santé", href: "/professionnels" },
    { name: "Investissement", href: "/investissement" },
  ],
  company: [
    { name: "Notre approche", href: "/notre-approche" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "Politique de confidentialité", href: "/confidentialite" },
    { name: "Politique de cookies", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-heading font-bold tracking-tight">
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
              © {new Date().getFullYear()} I-CA.RE. Tous droits réservés.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-background/50 mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
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
              Entreprise
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
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
              Contact
            </h3>
            <div className="space-y-3 text-sm text-background/70">
              <p>Bordeaux, France</p>
              <a
                href="mailto:contact@i-care.fr"
                className="block hover:text-background transition-colors duration-300"
              >
                contact@i-care.fr
              </a>
            </div>
            <div className="mt-6">
              <h4 className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-background/40 mb-2">
                Légal
              </h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
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
