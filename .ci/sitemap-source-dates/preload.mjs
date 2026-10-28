import { readFileSync, writeFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(process.env.SITEMAP_FIXTURE_FILE, "utf8"));
const calls = [];
const RealDate = Date;
const clock = process.env.SITEMAP_FIXTURE_CLOCK || "2040-01-01T00:00:00Z";
globalThis.Date = class extends RealDate {
  constructor(...args) { super(...(args.length ? args : [clock])); }
  static now() { return RealDate.parse(clock); }
};

globalThis.fetch = async (input) => {
  const url = new URL(String(input));
  if (url.origin !== "https://sitemap-fixture.invalid") {
    throw new Error("External requests are blocked by the fixture");
  }
  const resource = url.pathname.replace(/^\/rest\/v1\//, "");
  calls.push(resource);
  if (fixture.fail === resource) return new Response("fixture refusal", { status: 503 });
  if (!(resource in fixture)) throw new Error("Unexpected fixture resource");
  return Response.json(fixture[resource]);
};
process.on("exit", () => writeFileSync(process.env.SITEMAP_FIXTURE_CALLS, JSON.stringify(calls)));
