import { createRequire } from "node:module";
import { dirname } from "node:path";
const rootRequire = createRequire(new URL("../../package.json", import.meta.url));
const { build } = rootRequire("esbuild");
const alias = {
  "@/lib/analytics": "./.ci/cookie-choice-storage/analytics-double.ts",
  "@": "./src",
};
for (const name of ["react", "react-dom", "react-router-dom", "react-router", "i18next", "react-i18next"]) {
  alias[name] = dirname(rootRequire.resolve(name + "/package.json"));
}
await build({
  entryPoints: [".ci/cookie-choice-storage/mobile.tsx"], bundle: true, format: "esm",
  jsx: "automatic", outfile: ".ci/cookie-choice-storage/mobile.js", alias,
});
