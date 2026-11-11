import '../../.ci/professionnels-refus-1011/closedEnvironment';
import { afterEach, expect, it, vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => import('../../.ci/professionnels-refus-1011/ports'));
vi.mock('@/lib/analytics', () => import('../../.ci/professionnels-refus-1011/ports'));
vi.mock('@/hooks/useInstallation', () => import('../../.ci/professionnels-refus-1011/ports'));
vi.mock('@/components/Layout', () => import('../../.ci/professionnels-refus-1011/ports'));
vi.mock('@/components/SeoHead', () => import('../../.ci/professionnels-refus-1011/ports'));
vi.mock('@/components/FadeImage', () => import('../../.ci/professionnels-refus-1011/ports'));
vi.mock('sonner', () => import('../../.ci/professionnels-refus-1011/ports'));
vi.mock('@supabase/supabase-js', () => { throw Error('SDK natif fermé avant import'); });
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '../../.ci/professionnels-refus-1011/testing';
import { ui } from '../../.ci/professionnels-refus-1011/ports';
import fr from '../../src/locales/fr.json';
import en from '../../src/locales/en.json';
import Professionnels from '../../src/pages/Professionnels';

const control = (id: string) => document.getElementById(id) as HTMLElement;
const input = (id: string) => control(id) as HTMLInputElement;
const form = () => document.querySelector('form') as HTMLFormElement;
const submit = () => fireEvent.click(form().querySelector('[type=submit]')!);
const text = (id: string, value: string) => fireEvent.change(input(id), { target: { value } });
async function mount(lang: 'fr' | 'en', websiteMessage?: string) {
  ui.errors = []; ui.forbidden = [];
  const i18n = createInstance(); await i18n.use(initReactI18next).init({ lng: lang, fallbackLng: 'fr', resources: structuredClone({ fr: { translation: fr }, en: { translation: en } }), interpolation: { escapeValue: false } });
  if (websiteMessage) i18n.addResource(lang, 'translation', 'professionals.formErrorWebsite', websiteMessage);
  render(<I18nextProvider i18n={i18n}><MemoryRouter><Professionnels /></MemoryRouter></I18nextProvider>);
}
async function choose(id: string, label: string) {
  const target = document.querySelectorAll('[role="combobox"]')[id === 'profession' ? 0 : 2] as HTMLElement;
  fireEvent.keyDown(target, { key: 'ArrowDown', code: 'ArrowDown' });
  const option = await screen.findByRole('option', { name: label });
  fireEvent.keyDown(option, { key: 'Enter', code: 'Enter' });
  await waitFor(() => expect(target).toHaveTextContent(label));
}
async function fill(lang: 'fr' | 'en', omit?: string, consent = true) {
  text('firstName', 'Prénom fixture'); text('lastName', 'Nom fixture'); text('email', 'fixture@example.invalid'); text('phone', '+33 6 00 00 00 00'); text('ville', 'Ville fixture');
  text('organisation', 'Organisation conservée'); text('message', 'Saisie conservée');
  if (omit !== 'profession') await choose('profession', (lang === 'fr' ? fr : en).professionals.formProfessionOther);
  if (omit !== 'cabinetCount') await choose('cabinetCount', (lang === 'fr' ? fr : en).professionals.cabinetCountOptions['1']);
  if (consent) fireEvent.click(control('rgpd'));
}
function focusReceipt(id: string) {
  const receipts: { invalid: string | null; described: string[]; messages: string[] }[] = [];
  control(id).addEventListener('focus', () => {
    const target = control(id), described = (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    receipts.push({ invalid: target.getAttribute('aria-invalid'), described, messages: described.map(key => document.getElementById(key)?.textContent ?? '') });
  });
  return receipts;
}
function assertRefusalAtFocus(id: string, receipts: ReturnType<typeof focusReceipt>, message: string, toast = true) {
  expect(control(id)).toHaveAttribute('aria-invalid', 'true'); expect(document.activeElement).toBe(control(id));
  expect(receipts.length).toBeGreaterThan(0); const receipt = receipts[receipts.length - 1]; expect(receipt.invalid).toBe('true'); expect(receipt.messages).toContain(message);
  for (const key of receipt.described) expect(document.getElementById(key)).not.toBeNull();
  expect(ui.errors).toEqual(toast ? [message] : []);
}
afterEach(() => { cleanup(); expect(ui.forbidden).toEqual([]); });

it('N1 FR consentement : erreur liée au moment du focus après commit', async () => {
  await mount('fr'); await fill('fr', undefined, false); expect(form().checkValidity()).toBe(true);
  const receipts = focusReceipt('rgpd'); submit(); assertRefusalAtFocus('rgpd', receipts, fr.professionals.formErrorConsent);
  fireEvent.click(control('rgpd')); expect(control('rgpd')).not.toHaveAttribute('aria-invalid', 'true'); expect(input('organisation')).toHaveValue('Organisation conservée');
});
it('N2 EN consentement : message durable traduit et aucun focus avant refus', async () => {
  await mount('en'); expect(document.querySelector('[aria-invalid="true"]')).toBeNull(); expect(document.activeElement).not.toBe(control('rgpd'));
  await fill('en', undefined, false); const receipts = focusReceipt('rgpd'); submit(); assertRefusalAtFocus('rgpd', receipts, en.professionals.formErrorConsent);
});
it.each(['firstName', 'lastName', 'phone', 'ville'])('N3 champ requis blanc %s : refus applicatif sur valeur native licite', async id => {
  await mount('fr'); await fill('fr'); text(id, '   '); expect(form().checkValidity()).toBe(true);
  const receipts = focusReceipt(id); submit(); assertRefusalAtFocus(id, receipts, fr.professionals.formErrorRequired);
});
it.each(['profession', 'cabinetCount'])('N4 Select requis %s : vrai contrôle nommé, erreur et reprise sans nouvelle lecture', async id => {
  await mount('en'); await fill('en', id); const target = document.querySelectorAll('[role="combobox"]')[id === 'profession' ? 0 : 2] as HTMLElement;
  expect(target).toHaveAccessibleName(id === 'profession' ? /Type of Practitioner/ : /Number of offices required/);
  const receipts = focusReceipt(id); submit(); assertRefusalAtFocus(id, receipts, en.professionals.formErrorRequired);
  await choose(id, id === 'profession' ? en.professionals.formProfessionOther : en.professionals.cabinetCountOptions['1']); expect(control(id)).not.toHaveAttribute('aria-invalid', 'true');
  expect(input('message')).toHaveValue('Saisie conservée');
});
it.each(['fr', 'en'] as const)('N5 email regex %s : a@b accepté nativement reste refusé par la règle reçue', async lang => {
  await mount(lang); await fill(lang); text('email', 'a@b'); expect(input('email').checkValidity()).toBe(true);
  const receipts = focusReceipt('email'); submit(); assertRefusalAtFocus('email', receipts, (lang === 'fr' ? fr : en).professionals.formErrorEmail);
});
it.each(['fr', 'en'] as const)('N6 téléphone regex %s : texte licite pour type tel refusé sans envoi', async lang => {
  await mount(lang); await fill(lang); text('phone', 'abcdef'); expect(input('phone').checkValidity()).toBe(true);
  const receipts = focusReceipt('phone'); submit(); assertRefusalAtFocus('phone', receipts, (lang === 'fr' ? fr : en).professionals.formErrorPhone);
});
it('N7 plusieurs champs blancs : premier refus dans ordre reçu, correction sans vol de focus', async () => {
  await mount('fr'); await fill('fr'); text('firstName', ' '); text('lastName', ' ');
  const receipts = focusReceipt('firstName'); submit(); assertRefusalAtFocus('firstName', receipts, fr.professionals.formErrorRequired); expect(control('lastName')).toHaveAttribute('aria-invalid', 'true');
  act(() => input('organisation').focus()); text('firstName', 'Correction fixture'); expect(document.activeElement).toBe(input('organisation')); expect(control('firstName')).not.toHaveAttribute('aria-invalid', 'true'); expect(control('lastName')).toHaveAttribute('aria-invalid', 'true'); expect(input('message')).toHaveValue('Saisie conservée');
});
it('N8 fermeture autonome avant imports : montage sans geste, aucun reader ni producteur natif', async () => {
  await mount('fr');
  expect(control('profession')).toHaveAccessibleName(/Type de praticien/i);
  expect(control('cabinetCount')).toHaveAccessibleName(/Nombre de cabinets souhaités/);
  expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid', 'true');
  expect(ui.errors).toEqual([]); expect(ui.forbidden).toEqual([]);
});

it.each(['fr', 'en'] as const)('N9 contraintes natives %s : priorité, DNS et URL optionnelle', async lang => {
  await mount(lang);
  expect(form().noValidate).toBe(false);
  expect(input('firstName').validity.valueMissing).toBe(true);
  expect(input('email').validity.valueMissing).toBe(true);
  let receipts = focusReceipt('firstName');
  submit();
  const messages = (lang === 'fr' ? fr : en).professionals;
  assertRefusalAtFocus('firstName', receipts, messages.formErrorRequired, false);
  expect(input('email')).not.toHaveAttribute('aria-invalid', 'true');

  await fill(lang);
  text('email', 'a@-b.example');
  expect(input('email').validity.typeMismatch).toBe(true);
  receipts = focusReceipt('email');
  submit();
  assertRefusalAtFocus('email', receipts, messages.formErrorEmail, false);
  text('email', 'a@b.example');
  expect(input('email')).not.toHaveAttribute('aria-invalid', 'true');

  text('website', 'example.invalid');
  expect(input('website').validity.typeMismatch).toBe(true);
  receipts = focusReceipt('website');
  submit();
  assertRefusalAtFocus(
    'website',
    receipts,
    messages.formErrorWebsite,
    false,
  );
  text('website', '');
  expect(input('website')).not.toHaveAttribute('aria-invalid', 'true');
  expect(ui.forbidden).toEqual([]);
});

it.each(['fr', 'en'] as const)('N10 traduction URL %s : la ressource active fournit le message', async lang => {
  const translated = lang === 'fr' ? 'URL fixture traduite FR.' : 'Translated fixture URL EN.';
  await mount(lang, translated); await fill(lang); text('website', 'example.invalid');
  expect(input('website').validity.typeMismatch).toBe(true);
  const receipts = focusReceipt('website'); submit();
  assertRefusalAtFocus('website', receipts, translated, false);
});
