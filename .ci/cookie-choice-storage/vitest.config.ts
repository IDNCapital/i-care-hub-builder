import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const requireRoot = createRequire(path.join(root, "package.json"));
const modules = ["react", "react/jsx-runtime", "react/jsx-dev-runtime", "react-dom", "react-dom/client", "react-dom/test-utils", "react-router-dom", "react-router", "react-i18next", "i18next", "@radix-ui/react-slot"];
export default {
  root, cacheDir: path.join(root, ".ci/cookie-choice-storage/cache"),
  esbuild: { jsx: "automatic" },
  test: { environment: "jsdom", include: [".ci/cookie-choice-storage/CookieBanner.test.tsx"] },
  resolve: { alias: [
    { find: "@", replacement: path.join(root, "src") },
    ...modules.map((name) => ({ find: new RegExp("^" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"), replacement: requireRoot.resolve(name) })),
    { find: /^vitest$/, replacement: path.join(root, ".ci/cookie-choice-storage/node_modules/vitest/dist/index.js") },
  ] },
};
