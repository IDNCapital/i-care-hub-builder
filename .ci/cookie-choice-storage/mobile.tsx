import { createRoot } from "react-dom/client";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { CookieBanner } from "../../src/components/CookieBanner";
import { useAnalytics } from "../../src/hooks/useAnalytics";
import fr from "../../src/locales/fr.json";
import en from "../../src/locales/en.json";
const lang = document.documentElement.lang === "en" ? "en" : "fr";
window.__cookieProof = {
  value: lang === "fr" ? "accepted" : "refused", readRefused: true, writeRefused: true,
  loads: 0, removes: 0, pages: [], scrolls: [],
};
Object.defineProperty(window, "localStorage", { configurable: true, value: {
  getItem: () => { if (window.__cookieProof.readRefused) throw Error("lecture refusee"); return window.__cookieProof.value; },
  setItem: (_key: string, value: string) => { if (window.__cookieProof.writeRefused) throw Error("ecriture refusee"); window.__cookieProof.value = value; },
} });
const i18n = createInstance();
await i18n.init({ lng: lang, fallbackLng: "fr", resources: { fr: { translation: fr }, en: { translation: en } } });
function Sonde() {
  useAnalytics();
  const navigate = useNavigate();
  return <button hidden data-testid="navigation" onClick={() => navigate("/page-" + Math.random())}>Fixture</button>;
}
createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}><MemoryRouter><Sonde /><CookieBanner /></MemoryRouter></I18nextProvider>,
);
