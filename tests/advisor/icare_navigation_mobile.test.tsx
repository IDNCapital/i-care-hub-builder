// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useLayoutEffect, useRef } from "react";
import { MemoryRouter, useLocation, useNavigate, type NavigateFunction } from "react-router-dom";
import { Header } from "../../src/components/Header";
import { changerLangue } from "./icare_navigation_mobile.i18n-double";
import { localePath } from "../../src/lib/routes";
vi.mock("react-i18next", () => import("./icare_navigation_mobile.i18n-double"));
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof ResizeObserver;
let naviguer: NavigateFunction;
function Page() {
 const location = useLocation(); naviguer = useNavigate();
 const cible = useRef<HTMLButtonElement>(null);
 useLayoutEffect(() => { cible.current?.focus(); }, [location.key]);
 return <><Header /><button ref={cible}>Contenu courant</button><p data-testid="route">{location.pathname+location.search+location.hash}</p></>;
}
function afficher(path="/contact") {
 return render(<MemoryRouter initialEntries={["/",path]} initialIndex={1}><Page /></MemoryRouter>);
}
const bouton = () => screen.getByRole("button", { name: /^(Ouvrir le menu|Fermer le menu|Open menu|Close menu)$/ });
const ouvrir = () => { fireEvent.click(bouton()); };
const menu = () => bouton().parentElement!.nextElementSibling as HTMLElement;
const praticiens = () => within(menu()).getByRole("button", { name: /^(Praticiens|Practitioners)$/ });
const liens = () => Array.from(menu().querySelectorAll<HTMLAnchorElement>("a")).map(a => a.getAttribute("href"));
beforeEach(() => { changerLangue("fr"); });
afterEach(cleanup);

describe("ICARE-NAVIGATION-MOBILE-0611", () => {
 it("Escape desktop ne ramène pas le focus au bouton mobile", () => {
  afficher(); ouvrir();
  const desktop = screen.getAllByRole("button", { name: "Praticiens" })[0];
  desktop.focus(); fireEvent.keyDown(desktop,{key:"Escape"});
  expect(document.activeElement).toBe(desktop);
 });
 it("Escape ferme depuis un lien et rend le focus au bouton", () => {
  afficher(); ouvrir(); fireEvent.click(praticiens());
  const lien = within(menu()).getByRole("link", { name:"Nos lieux de soin" }); lien.focus();
  fireEvent.keyDown(lien,{key:"Escape"});
  expect(bouton().getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(bouton());
 });
 it("fermeture puis réouverture repartent avec sous-menu fermé", () => {
  afficher(); ouvrir(); fireEvent.click(praticiens());
  expect(praticiens().getAttribute("aria-expanded")).toBe("true");
  fireEvent.click(bouton()); ouvrir();
  expect(praticiens().getAttribute("aria-expanded")).toBe("false");
 });
 it("navigation de fragment courant ferme le menu sans voler le focus", () => {
  afficher(); ouvrir(); fireEvent.click(praticiens());
  act(() => { naviguer("/contact#suite"); });
  expect(bouton().getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(screen.getByRole("button",{name:"Contenu courant"}));
 });
 it("liens FR publics et CTA restent exacts dans le vrai routeur", () => {
  afficher(); expect(bouton().getAttribute("aria-expanded")).toBe("false");
  ouvrir(); fireEvent.click(praticiens());
  expect(liens()).toEqual([
   localePath("fr","projects"),localePath("fr","cabinetJournee"),"/sinstaller",localePath("fr","temoignages"),
   localePath("fr","patients"),localePath("fr","approach"),localePath("fr","contact"),"/en/contact",
   localePath("fr","professionals")+"#candidature",
  ]);
  fireEvent.click(within(menu()).getByRole("link",{name:"Nos lieux de soin"}));
  expect(screen.getByTestId("route").textContent).toBe("/projets");
  expect(bouton().getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(screen.getByRole("button",{name:"Contenu courant"}));
 });
 it("langue et liens EN conservés, commande et reprise cohérentes", () => {
  changerLangue("en"); afficher("/en/contact"); ouvrir(); fireEvent.click(praticiens());
  expect(liens()).toEqual([
   localePath("en","projects"),localePath("en","cabinetJournee"),localePath("en","insights"),localePath("en","temoignages"),
   localePath("en","patients"),localePath("en","approach"),localePath("en","contact"),"/contact",
   localePath("en","professionals")+"#candidature",
  ]);
  expect(bouton().getAttribute("aria-label")).toBe("Close menu");
  fireEvent.click(bouton()); expect(bouton().getAttribute("aria-label")).toBe("Open menu");
  ouvrir(); expect(praticiens().getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(within(menu()).getByRole("link",{name:"🇫🇷 Français"}));
  expect(screen.getByTestId("route").textContent).toBe("/contact");
  expect(bouton().getAttribute("aria-label")).toBe("Ouvrir le menu");
 });
 it("historique et changement de recherche ferment et réinitialisent", () => {
  afficher(); ouvrir(); fireEvent.click(praticiens());
  act(() => { naviguer("/contact?source=test"); });
  expect(bouton().getAttribute("aria-expanded")).toBe("false");
  ouvrir(); expect(praticiens().getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(praticiens()); act(() => { naviguer(-1); });
  expect(bouton().getAttribute("aria-expanded")).toBe("false");
  expect(screen.getByTestId("route").textContent).toBe("/contact");
  expect(document.activeElement).toBe(screen.getByRole("button",{name:"Contenu courant"}));
 });
 it("règle Patients et destinations inchangées, menu toujours consultable", () => {
  afficher("/patients/fiche"); ouvrir(); fireEvent.click(praticiens());
  expect(within(menu()).queryByRole("link",{name:"🇬🇧 English"})).toBeNull();
  expect(within(menu()).getByRole("link",{name:"Nos lieux de soin"}).getAttribute("href")).toBe("/projets");
 });
 it("Escape au bouton ferme, autre touche ne ferme pas", () => {
  afficher(); ouvrir(); bouton().focus();
  fireEvent.keyDown(bouton(),{key:"ArrowDown"});
  expect(bouton().getAttribute("aria-expanded")).toBe("true");
  fireEvent.keyDown(bouton(),{key:"Escape"});
  expect(bouton().getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(bouton());
 });
});
