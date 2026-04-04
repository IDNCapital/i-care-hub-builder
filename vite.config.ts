import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";

const PRERENDER_ROUTES = [
  // Homepage
  "/",
  "/en/",
  // Insights hub
  "/insights",
  "/en/insights",
  // Insight articles FR
  "/insights/cabinet-medical-bordeaux",
  "/insights/budget-cabinet-bordeaux",
  "/insights/surface-cabinet-medical",
  "/insights/transformer-local-en-cabinet",
  "/insights/professions-partage-cabinet",
  "/insights/louer-ou-acheter-cabinet",
  // Insight articles EN
  "/en/insights/medical-office-bordeaux",
  "/en/insights/office-budget-bordeaux",
  "/en/insights/medical-office-size",
  "/en/insights/converting-commercial-space",
  "/en/insights/professions-sharing-office",
  "/en/insights/rent-or-buy-office",
  // Landing pages
  "/trouver-cabinet-medical-bordeaux",
  "/en/finding-medical-office-bordeaux",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" &&
      vitePrerender({
        staticDir: path.join(__dirname, "dist"),
        routes: PRERENDER_ROUTES,
        postProcess(renderedRoute: any) {
          // Ensure trailing slash consistency
          renderedRoute.route = renderedRoute.route.replace(/\/$/, "") || "/";
          return renderedRoute;
        },
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
