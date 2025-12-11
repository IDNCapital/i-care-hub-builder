import { Link } from "react-router-dom";

const footerLinks = {
  navigation: [
    { name: "Notre Vision", href: "/vision" },
    { name: "Professionnels de Santé", href: "/professionnels" },
    { name: "Nos Projets", href: "/projets" },
    { name: "Collectivités", href: "/collectivites" },
    { name: "Investisseurs", href: "/investisseurs" },
  ],
  company: [
    { name: "Notre Méthode", href: "/methode" },
    { name: "À Propos", href: "/a-propos" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Mentions Légales", href: "/mentions-legales" },
    { name: "Politique de Confidentialité", href: "/confidentialite" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-bold">
              I-CA.RE
            </Link>
            <p className="mt-4 text-background/70 text-sm leading-relaxed">
              Rendre la santé accessible, moderne et proche de chacun.
            </p>
            <p className="mt-6 text-background/50 text-xs">
              © {new Date().getFullYear()} I-CA.RE. Tous droits réservés.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Entreprise
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-background/70">
              <p>Bordeaux, France</p>
              <a
                href="mailto:contact@i-care.fr"
                className="block hover:text-background transition-colors"
              >
                contact@i-care.fr
              </a>
            </div>
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-2">Légal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-background/50 hover:text-background/70 transition-colors text-xs"
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
