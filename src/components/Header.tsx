import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useMemo, useCallback, useRef, useId, memo, type ElementRef } from "react";
import { useTranslation } from "react-i18next";
import { getEquivalentPath, localePath } from "@/lib/routes";
import { masquerSelecteurLangue } from "@/lib/espacePatients";
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

function focusVisible(target: HTMLElement | null) {
  if (!target?.isConnected || !target.getClientRects().length || target.closest("[hidden], [inert]")) return;
  const style = window.getComputedStyle(target);
  if (style.display !== "none" && style.visibility !== "hidden") target.focus({ preventScroll: true });
}

export const Header = memo(function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const signature = JSON.stringify([location.key, location.pathname, location.search, location.hash, lang]);
  const identity = useRef({ signature, generation: 0 });
  if (identity.current.signature !== signature) identity.current = { signature, generation: identity.current.generation + 1 };
  const visit = identity.current;
  const [menu, setMenu] = useState(() => ({ visit, open: false, practitioners: false, desktop: "" }));
  const current = menu.visit === visit;
  const isOpen = current && menu.open;
  const practitionersOpen = current && menu.practitioners;
  const desktopValue = current ? menu.desktop : "";
  if (!current) setMenu({ visit, open: false, practitioners: false, desktop: "" });
  const [formatGeneration, setFormatGeneration] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLAnchorElement>(null);
  const desktopRef = useRef<ElementRef<typeof NavigationMenu>>(null);
  const desktopMedia = useRef<MediaQueryList | null>(null);
  const panelId = useId();
  const isCurrent = useCallback(() => identity.current === visit && !!headerRef.current?.isConnected, [visit]);
  const closeMenu = useCallback(() => {
    if (!isCurrent()) return;
    setMenu((state) => state.visit !== visit || (!state.open && !state.practitioners && !state.desktop)
      ? state : { ...state, open: false, practitioners: false, desktop: "" });
  }, [isCurrent, visit]);
  const ownsMobileFocus = useCallback(() => document.activeElement === toggleRef.current || !!panelRef.current?.contains(document.activeElement), []);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(min-width: 1024px)");
    desktopMedia.current = media;
    const closeAtBreakpoint = (event?: MediaQueryListEvent) => {
      const mobileOwned = ownsMobileFocus();
      const desktopOwned = !!desktopRef.current?.contains(document.activeElement);
      closeMenu();
      if (event) setFormatGeneration((generation) => generation + 1);
      if (media.matches && mobileOwned) focusVisible(homeRef.current);
      if (!media.matches && desktopOwned) focusVisible(toggleRef.current);
    };
    closeAtBreakpoint();
    media.addEventListener("change", closeAtBreakpoint);
    return () => {
      media.removeEventListener("change", closeAtBreakpoint);
      if (desktopMedia.current === media) desktopMedia.current = null;
    };
  }, [closeMenu, ownsMobileFocus]);

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || !isCurrent()) return;
      const owned = ownsMobileFocus();
      closeMenu();
      if (owned) {
        event.preventDefault();
        focusVisible(desktopMedia.current?.matches ? homeRef.current : toggleRef.current);
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [isOpen, isCurrent, closeMenu, ownsMobileFocus]);
  const otherLang = lang === "fr" ? "en" : "fr";
  // Depend uniquement du pathname : identique au rendu serveur, pas d'ecart d'hydratation.
  const selecteurLangueMasque = masquerSelecteurLangue(location.pathname);

  const labels = useMemo(() => ({
    practitioners: lang === "fr" ? "Praticiens" : "Practitioners",
    patients: lang === "fr" ? "Patients" : "Patients",
    approach: t("nav.approach"),
    contact: t("nav.contact"),
    sub: {
      spaces: lang === "fr" ? "Nos lieux de soin" : "Our care spaces",
      dayOffice: t("cabinetJournee.navLabel"),
      install: lang === "fr" ? "S'installer" : "Setting up",
      testimonials: lang === "fr" ? "Témoignages" : "Testimonials",
    },
  }), [t, lang]);

  const practitionerSubItems = useMemo(() => [
    { name: labels.sub.spaces, href: localePath(lang, "projects") },
    { name: labels.sub.dayOffice, href: localePath(lang, "cabinetJournee") },
    { name: labels.sub.install, href: lang === "fr" ? "/sinstaller" : localePath(lang, "insights") },
    { name: labels.sub.testimonials, href: localePath(lang, "temoignages") },
  ], [labels, lang]);

  const mainItems = useMemo(() => [
    { name: labels.patients, href: localePath(lang, "patients") },
    { name: labels.approach, href: localePath(lang, "approach") },
    { name: labels.contact, href: localePath(lang, "contact") },
  ], [labels, lang]);

  // Repli contextuel : sur une sous-page Patients sans équivalent EN, pointer vers
  // l'index Patients de l'autre langue (prérendu) plutôt que vers l'accueil.
  const equivalentPath = getEquivalentPath(location.pathname, otherLang);
  const isPatientsSection = /^\/(en\/)?patients(\/|$)/.test(location.pathname);
  const switchPath =
    equivalentPath ??
    (isPatientsSection ? localePath(otherLang, "patients") : localePath(otherLang, "home"));

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
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 header-blur">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link ref={homeRef} to={localePath(lang, "home")} onClick={closeMenu} className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu
            key={`${visit.generation}:${formatGeneration}`}
            ref={desktopRef}
            className="hidden lg:flex"
            delayDuration={100}
            value={desktopValue}
            onValueChange={(value) => {
              if (!isCurrent() || !desktopMedia.current?.matches) return;
              setMenu((state) => state.visit === visit ? { ...state, desktop: value, open: false, practitioners: false } : state);
            }}
          >
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
            {!selecteurLangueMasque && (
              <Link
                to={switchPath}
                onClick={() => i18n.changeLanguage(otherLang)}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className={lang === "fr" ? "text-foreground" : "text-muted-foreground"}>FR</span>
                <span className="mx-1 text-border">|</span>
                <span className={lang === "en" ? "text-foreground" : "text-muted-foreground"}>EN</span>
              </Link>
            )}

            <Link
              to={`${localePath(lang, "professionals")}#candidature`}
              className="inline-flex items-center justify-center min-h-[44px] whitespace-nowrap rounded-md bg-sage text-[#1E392B] font-sans font-bold uppercase text-[14px] tracking-[0.10em] px-7 py-[14px] transition-all duration-200 ease-out hover:bg-[#C5D4CA] hover:-translate-y-px hover:shadow-[0_6px_18px_-6px_hsl(var(--sage)/0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9C7A1] focus-visible:ring-offset-[3px] focus-visible:ring-offset-background"
            >
              {t("nav.joinCta")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            ref={toggleRef}
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => {
              if (!isCurrent() || desktopMedia.current?.matches) return;
              setMenu((state) => state.visit === visit ? { ...state, open: !state.open, practitioners: false, desktop: "" } : state);
            }}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
            aria-controls={panelId}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div ref={panelRef} id={panelId} className="lg:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {/* Praticiens : collapsible */}
              <button
                type="button"
                onClick={() => {
                  if (!isCurrent()) return;
                  setMenu((state) => state.visit === visit && state.open ? { ...state, practitioners: !state.practitioners } : state);
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isPractitionersActive
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
                aria-expanded={practitionersOpen}
                aria-controls={`${panelId}-practitioners`}
              >
                <span>{labels.practitioners}</span>
                <ChevronDown
                  size={16}
                  className={cn("transition-transform duration-200", practitionersOpen && "rotate-180")}
                />
              </button>
              {practitionersOpen && (
                <div id={`${panelId}-practitioners`} className="pl-4 flex flex-col space-y-1 border-l border-accent/30 ml-4">
                  {practitionerSubItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={closeMenu}
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
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Language Switch */}
              {!selecteurLangueMasque && (
                <Link
                  to={switchPath}
                  onClick={() => {
                    i18n.changeLanguage(otherLang);
                    closeMenu();
                  }}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {lang === "fr" ? "🇬🇧 English" : "🇫🇷 Français"}
                </Link>
              )}

              <div className="pt-4 flex flex-col space-y-2">
                <Link
                  to={`${localePath(lang, "professionals")}#candidature`}
                  onClick={closeMenu}
                  className="inline-flex w-full items-center justify-center min-h-[44px] whitespace-nowrap rounded-md bg-sage text-[#1E392B] font-sans font-bold uppercase text-[14px] tracking-[0.10em] px-7 py-[14px] transition-all duration-200 ease-out hover:bg-[#C5D4CA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9C7A1] focus-visible:ring-offset-[3px] focus-visible:ring-offset-background"
                >
                  {t("nav.joinCta")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
});
