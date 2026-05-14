import { Link, useLocation } from "react-router-dom";
import { InlineBrand } from "./BrandName";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { getEquivalentPath, localePath } from "@/lib/routes";
import { BrandName } from "./BrandName";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Logo = memo(function Logo() {
  return (
    <div className="flex flex-col items-start">
      <BrandName className="text-2xl font-heading font-bold tracking-tight leading-none" />
    </div>
  );
});

export const Header = memo(function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [practitionersOpen, setPractitionersOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const otherLang = lang === "fr" ? "en" : "fr";

  const labels = useMemo(() => ({
    practitioners: lang === "fr" ? "Praticiens" : "Practitioners",
    patients: lang === "fr" ? "Patients" : "Patients",
    investment: t("nav.investment"),
    approach: t("nav.approach"),
    contact: t("nav.contact"),
    sub: {
      spaces: lang === "fr" ? "Nos lieux de soin" : "Our care spaces",
      install: lang === "fr" ? "S'installer" : "Setting up",
      testimonials: lang === "fr" ? "Témoignages" : "Testimonials",
      referral: lang === "fr" ? "Parrainage" : "Referral",
    },
  }), [t, lang]);

  const practitionerSubItems = useMemo(() => [
    { name: labels.sub.spaces, href: localePath(lang, "projects") },
    { name: labels.sub.install, href: localePath(lang, "insights") },
    { name: labels.sub.testimonials, href: localePath(lang, "temoignages") },
    { name: labels.sub.referral, href: localePath(lang, "parrainage") },
  ], [labels, lang]);

  const mainItems = useMemo(() => [
    { name: labels.patients, href: localePath(lang, "patients") },
    { name: labels.investment, href: localePath(lang, "investment") },
    { name: labels.approach, href: localePath(lang, "approach") },
    { name: labels.contact, href: localePath(lang, "contact") },
  ], [labels, lang]);

  const switchPath = getEquivalentPath(location.pathname, otherLang);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setPractitionersOpen(false);
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

  const isPractitionersActive = practitionerSubItems.some((i) => isActive(i.href));

  const navLinkClass = (active: boolean) =>
    cn(
      "px-4 py-2 text-[0.95rem] font-normal rounded-lg transition-colors duration-200",
      active
        ? "text-foreground bg-muted"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
    );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-blur">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to={localePath(lang, "home")} className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex" delayDuration={100}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "h-10 px-4 py-2 text-[0.95rem] font-normal bg-transparent rounded-lg transition-colors duration-200 hover:bg-muted/50 data-[state=open]:bg-muted/60",
                    isPractitionersActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground data-[state=open]:text-foreground",
                  )}
                >
                  {labels.practitioners}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="min-w-[240px] p-3 bg-background border border-accent/30 rounded-lg shadow-card">
                    {practitionerSubItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            "group/item relative flex items-center gap-3 px-3 py-2.5 rounded-md text-[0.9rem] transition-colors duration-200",
                            isActive(item.href)
                              ? "text-foreground bg-muted"
                              : "text-foreground/80 hover:text-foreground hover:bg-muted/60",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "absolute left-0 top-1.5 bottom-1.5 w-px bg-accent transition-opacity duration-200",
                              isActive(item.href) ? "opacity-100" : "opacity-0 group-hover/item:opacity-100",
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {mainItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link to={item.href} className={navLinkClass(isActive(item.href))}>
                    {item.name}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

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

            <Button variant="gold" asChild className="whitespace-nowrap">
              <Link to={`${localePath(lang, "professionals")}#candidature`}>
                <InlineBrand>{t("nav.joinCta")}</InlineBrand>
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {/* Praticiens — collapsible */}
              <button
                type="button"
                onClick={() => setPractitionersOpen((v) => !v)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isPractitionersActive
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
                aria-expanded={practitionersOpen}
              >
                <span>{labels.practitioners}</span>
                <ChevronDown
                  size={16}
                  className={cn("transition-transform duration-200", practitionersOpen && "rotate-180")}
                />
              </button>
              {practitionersOpen && (
                <div className="pl-4 flex flex-col space-y-1 border-l border-accent/30 ml-4">
                  {practitionerSubItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "px-4 py-2.5 text-sm rounded-lg transition-colors",
                        isActive(item.href)
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              {mainItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive(item.href)
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
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
                <Button variant="gold" asChild className="whitespace-nowrap">
                  <Link
                    to={`${localePath(lang, "professionals")}#candidature`}
                    onClick={() => setIsOpen(false)}
                  >
                    <InlineBrand>{t("nav.joinCta")}</InlineBrand>
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
