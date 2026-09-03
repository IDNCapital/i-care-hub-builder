# BARRIERE D'ERREUR REACT - i-care-hub-builder - 2026-09-03
# RENDU EN LECTURE SEULE : le diff ci-dessous est PROPOSE, il n'a PAS ete applique.

La mission s'est arretee sur son propre critere de phase 0 : `node_modules` est absent du clone de
nuit, `npm run lint` et `npm run build` ne peuvent donc pas tourner, et la file interdit de jouer
`npm install` comme `npm ci`. Poser du code sans filet est interdit. Ce fichier tient le rendu que
la mission demande dans ce cas : le diff exact, les deux points de montage, et l'etat du filet.

## Etat du depot, verifie

- `src/components/ErrorBoundary.tsx` : absent.
- `git grep -n "ErrorBoundary\|componentDidCatch\|getDerivedStateFromError" -- src scripts` :
  aucune occurrence. Le releve du 01/09 est confirme, la barriere manque a tout le depot.
- `src/App.tsx` porte bien TROIS elements `<Routes>` : celui de plus haut niveau ouvre ligne 99 et
  ferme ligne 255, enfant direct de `<AnalyticsProvider>` ouvert ligne 98 ; les deux autres sont
  imbriques dans `<LangSync lang="en">` ligne 160 et `<LangSync lang="fr">` ligne 212. Seul le
  premier est enveloppe par le diff, les deux autres ne sont pas touches.
- `src/main.tsx` fait six lignes et rend `<App />` sans enveloppe.

## Filet, phase 0

    $ ls node_modules
    absent

    $ npm run lint
    > eslint .
    sh: 1: eslint: not found
    rc=127

    $ npm run build
    ERR_MODULE_NOT_FOUND
    rc=1

    $ node scripts/checkRoutesConcordance.mjs
    ERR_MODULE_NOT_FOUND
    rc=1

Le compte exact d'erreurs et d'avertissements de lint, qui devait etre le point de comparaison de
la mission, n'a donc pas pu etre releve. Il n'est pas estime : une commande qui echoue ne fonde
aucun verdict, elle se rapporte comme echec.

## Les deux points de montage proposes

1. `src/App.tsx` : `<ErrorBoundary>` ouvert juste apres `<AnalyticsProvider>` et ferme juste avant
   `<ScrollToTop />`, donc autour du seul `<Routes>` de plus haut niveau.
2. `src/main.tsx` : `<ErrorBoundary>` autour de `<App />`, en dernier recours.

## Les deux methodes du composant

`static getDerivedStateFromError(): State` bascule l'etat vers le repli.
`componentDidCatch(error: Error, info: ErrorInfo): void` consigne dans la console du navigateur.
Aucune telemetrie, aucun appel reseau, aucune dependance nouvelle.

## Ce que ce montage sauve, dit exactement

L'en-tete et le pied ne sont PAS dans `src/App.tsx` : ils vivent dans `Layout`, que chaque page
enveloppe elle-meme, et ils tombent donc avec la page. Ce qui survit a une erreur de page, ce sont
`<ScrollToTop />` et `<CookieBanner />`, freres du `<Routes>` externe, plus le repli lui-meme a la
place de la page blanche.

## Concordance des routes

`scripts/checkRoutesConcordance.mjs` lit `src/App.tsx` en texte et extrait ses declarations par
`txt.matchAll(/<Route\b/g)` puis `path="([^"]+)"`. Un element englobant n'ajoute aucun `<Route`, donc
l'extraction ne devrait pas bouger. Ce raisonnement est une lecture du script, pas une mesure : le
script n'a pas pu tourner.

## Le diff exact, propose et NON applique

```diff
--- /dev/null
+++ b/src/components/ErrorBoundary.tsx
@@ -0,0 +1,59 @@
+import { Component, type ErrorInfo, type ReactNode } from "react";
+
+/**
+ * Barriere d'erreur React.
+ *
+ * Une erreur levee pendant le rendu d'une page laisse aujourd'hui une page
+ * blanche. Cette barriere intercepte l'erreur, la consigne dans la console du
+ * navigateur, et affiche un repli sobre en francais avec un bouton qui
+ * recharge la page.
+ *
+ * Aucune telemetrie, aucun appel reseau, aucune dependance nouvelle : la seule
+ * trace part dans la console, la ou un developpeur la lit deja.
+ */
+
+type Props = { children: ReactNode };
+type State = { hasError: boolean };
+
+class ErrorBoundary extends Component<Props, State> {
+  state: State = { hasError: false };
+
+  static getDerivedStateFromError(): State {
+    return { hasError: true };
+  }
+
+  componentDidCatch(error: Error, info: ErrorInfo): void {
+    console.error("ErrorBoundary a intercepte une erreur de rendu", error, info);
+  }
+
+  private handleReload = (): void => {
+    window.location.reload();
+  };
+
+  render(): ReactNode {
+    if (!this.state.hasError) {
+      return this.props.children;
+    }
+    return (
+      <div
+        role="alert"
+        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center"
+      >
+        <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
+        <p className="max-w-md text-sm text-muted-foreground">
+          Cette page n'a pas pu s'afficher. Vous pouvez recharger la page ; si le
+          probleme persiste, revenez un peu plus tard.
+        </p>
+        <button
+          type="button"
+          onClick={this.handleReload}
+          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
+        >
+          Recharger la page
+        </button>
+      </div>
+    );
+  }
+}
+
+export default ErrorBoundary;
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -57,6 +57,7 @@
 import PreviewFooterIdn from "./pages/PreviewFooterIdn";
 import PreviewFooterIdnV3 from "./pages/PreviewFooterIdnV3";
 import PreviewCarteCabinets from "./pages/PreviewCarteCabinets";
+import ErrorBoundary from "./components/ErrorBoundary";
 
 const queryClient = new QueryClient();
 
@@ -96,6 +97,7 @@
       <Sonner />
       <BrowserRouter>
         <AnalyticsProvider>
+          <ErrorBoundary>
           <Routes>
             {/* Preview privée praticien (langue-agnostique, hors i18n) */}
             <Route path="/preview/:slug/:token" element={<PreviewPraticien />} />
@@ -253,6 +255,7 @@
               <Route path="*" element={<NotFound />} />
             </Routes></LangSync>} />
           </Routes>
+          </ErrorBoundary>
           <ScrollToTop />
           <CookieBanner />
         </AnalyticsProvider>
--- a/src/main.tsx
+++ b/src/main.tsx
@@ -1,6 +1,11 @@
 import "./i18n";
 import { createRoot } from "react-dom/client";
 import App from "./App.tsx";
+import ErrorBoundary from "./components/ErrorBoundary";
 import "./index.css";
 
-createRoot(document.getElementById("root")!).render(<App />);
+createRoot(document.getElementById("root")!).render(
+  <ErrorBoundary>
+    <App />
+  </ErrorBoundary>,
+);
```

## Reserve sur l'indentation

Le diff n'ajoute que deux lignes a `src/App.tsx` et ne reindente pas le bloc `<Routes>` qu'il
enveloppe, pour rester lisible en relecture. Une session de jour qui dispose du formateur voudra
peut-etre reindenter les cent cinquante lignes concernees : c'est un choix de style, laisse ouvert.

## Portee de la preuve

Le depot n'a aucun harnais de test, ni vitest ni testing-library, et la file interdit toute mission
dont la preuve depend du rendu. Aucun composant d'epreuve n'a ete monte, aucun harnais n'a ete
ajoute. La recette du repli, verifier qu'il s'affiche vraiment, est un geste de jour, hors de portee
de la nuit.
