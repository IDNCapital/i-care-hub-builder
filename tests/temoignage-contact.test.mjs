import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import ts from "typescript";

const require = createRequire(import.meta.url);
const componentUrl = new URL("../src/components/TestimonialsSlider.tsx", import.meta.url);
const source = readFileSync(process.env.TESTIMONIALS_SOURCE || componentUrl, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  reportDiagnostics: true,
});
assert.equal(compiled.diagnostics?.length, 0);

function renderTestimonials(translations) {
  const t = (key, options = {}) => {
    const value = key.split(".").reduce((current, part) => current?.[part], translations);
    return value ?? options.defaultValue ?? key;
  };
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module, exports: module.exports,
    require(name) {
      if (name === "react" || name === "react/jsx-runtime") return require(name);
      if (name === "react-i18next") return { useTranslation: () => ({ t }) };
      if (name === "embla-carousel-react") return { default: () => [null, undefined] };
      if (name === "embla-carousel-autoplay") return { default: () => ({}) };
      if (name === "lucide-react") return { ChevronLeft: () => null, ChevronRight: () => null };
      if (name === "@/lib/utils") return { cn: (...values) => values.filter(Boolean).join(" ") };
      if (name === "./BrandName") return { InlineBrand: ({ children }) => children };
      throw new Error(`Import inattendu : ${name}`);
    },
  });
  const html = renderToStaticMarkup(React.createElement(module.exports.TestimonialsSlider));
  return new JSDOM(html).window.document;
}

const loadTranslations = (language) => JSON.parse(readFileSync(new URL(`../src/locales/${language}.json`, import.meta.url), "utf8"));
const emailLinks = (document) => [...document.querySelectorAll('a[href^="mailto:"]')];

for (const language of ["fr", "en"]) {
  test(`${language} : seules les coordonnées réelles existantes sont rendues et nommées`, () => {
    const translations = loadTranslations(language);
    const document = renderTestimonials(translations);
    const expected = translations.testimonials.items.filter((item) => item.email?.trim());
    const links = emailLinks(document);
    assert.equal(links.length, expected.length);
    assert.ok(links.length > 0, "Le contact réel doit rester disponible");
    links.forEach((link, index) => {
      assert.equal(link.getAttribute("href"), `mailto:${expected[index].email}`);
      assert.equal(link.textContent, expected[index].email);
      assert.ok(link.textContent.trim(), "Le lien doit avoir un nom accessible");
    });
    assert.equal(document.querySelector("h2").textContent, translations.testimonials.sectionTitle);
    assert.equal(document.querySelectorAll("blockquote").length, translations.testimonials.items.length);
    assert.equal(document.querySelectorAll("button").length, 2);
    for (const item of translations.testimonials.items) {
      for (const field of ["quote", "name", "title", "speciality", "phone"]) {
        assert.ok(document.body.textContent.includes(item[field]));
      }
      if (item.website) assert.ok(document.querySelector(`a[href="https://${item.website}"]`));
    }
  });
}

test("une adresse vide ou composée d'espaces ne crée aucun lien", () => {
  for (const email of ["", "   ", "\t\n "]) {
    const translations = loadTranslations("fr");
    translations.testimonials.items.forEach((item) => { item.email = email; });
    assert.equal(emailLinks(renderTestimonials(translations)).length, 0);
  }
});

test("une clé d'adresse absente ne devient pas un destinataire", () => {
  const translations = loadTranslations("fr");
  translations.testimonials.items.forEach((item) => { delete item.email; });
  const document = renderTestimonials(translations);
  assert.equal(emailLinks(document).length, 0);
  assert.ok(!document.body.textContent.includes("testimonials.items."));
});
