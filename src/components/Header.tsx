import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { getEquivalentPath, localePath } from "@/lib/routes";

const Logo = memo(function Logo() {
  return (
    <div className="flex flex-col items-start">
      <span className="text-2xl font-heading font-bold tracking-tight leading-none whitespace-nowrap">
        <span className="text-primary">I-</span>
        <span className="text-foreground">CA</span>
        <span className="text-primary">.</span>
        <span className="text-foreground">RE</span>
      </span>
    </div>
  );
});

export const Header = memo(function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const otherLang = lang === "fr" ? "en" : "fr";

  const navigation = useMemo(() => [
    { name: t("nav.home"), href: localePath(lang, "home") },
    { name: t("nav.projects"), href: localePath(lang, "projects") },
    { name: t("nav.professionals"), href: localePath(lang, "professionals") },
    { name: lang === "fr" ? "S'installer" : "Setting up", href: localePath(lang, "installerCabinet") },
    { name: t("nav.investment"), href: localePath(lang, "investment") },
    { name: t("nav.approach"), href: localePath(lang, "approach") },
    { name: t("nav.contact"), href: localePath(lang, "contact") },
  ], [t, lang]);

  const switchPath = getEquivalentPath(location.pathname, otherLang);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    const homePath = localePath(lang, "home");
    if (href === homePath) {
      if (lang === "fr") {
        return location.pathname === "/";
      }
      return location.pathname === "/en" || location.pathname === "/en/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-blur">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to={localePath(lang, "home")} className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                  isActive(item.href)
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {/* Language Switch */}
            <Link
              to={switchPath}
              onClick={() => i18n.changeLanguage(otherLang)}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className={lang === "fr" ? "text-foreground" : "text-muted-foreground"}>FR</span>
              <span className="mx-1 text-border">|</span>
              <span className={lang === "en" ? "text-foreground" : "text-muted-foreground"}>EN</span>
            </Link>

            <Button asChild>
              <Link to={`${localePath(lang, "professionals")}#candidature`}>
                {t("nav.joinCta")}
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Language Switch */}
              <Link
                to={switchPath}
                onClick={() => {
                  i18n.changeLanguage(otherLang);
                  setIsOpen(false);
                }}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {lang === "fr" ? "🇬🇧 English" : "🇫🇷 Français"}
              </Link>

              <div className="pt-4 flex flex-col space-y-2">
                <Button asChild>
                  <Link
                    to={`${localePath(lang, "professionals")}#candidature`}
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav.joinCta")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
});
