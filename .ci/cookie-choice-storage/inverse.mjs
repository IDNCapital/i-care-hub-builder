import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
const path = "src/lib/analyticsConsent.ts";
const original = await readFile(path, "utf8");
const mutant = original.replace("  if (choixVisite?.stockage === \"non-confirme\") return choixVisite;\n", "");
if (mutant === original) throw Error("Mutation absente");
const sha = (s) => createHash("sha256").update(s).digest("hex");
try {
  await writeFile(path, mutant);
  const run = spawnSync(process.execPath, [
    ".ci/cookie-choice-storage/node_modules/vitest/vitest.mjs", "run", "--config", ".ci/cookie-choice-storage/vitest.config.ts",
    "-t", "ferme les anciens evenements", "--reporter=json", "--outputFile=.ci/cookie-choice-storage/inverse-tests.json",
  ], { encoding: "utf8", timeout: 30000 });
  await writeFile(".ci/cookie-choice-storage/inverse.log", run.stdout + run.stderr);
  const report = JSON.parse(await readFile(".ci/cookie-choice-storage/inverse-tests.json", "utf8"));
  await writeFile(".ci/cookie-choice-storage/inverse.json", JSON.stringify({
    mutation: "priorite du choix de visite retiree", originalSha256: sha(original), mutantSha256: sha(mutant),
    exit: run.status, failed: report.numFailedTests, signal: run.signal,
  }, null, 2) + "\n");
  if (run.status !== 1 || report.numFailedTests !== 1) throw Error("Inverse non sensible");
} finally {
  await writeFile(path, original);
  if (sha(await readFile(path, "utf8")) !== sha(original)) throw Error("Restauration divergente");
}
