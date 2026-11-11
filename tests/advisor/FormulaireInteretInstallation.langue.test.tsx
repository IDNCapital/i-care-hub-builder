import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { act, cleanup, fireEvent, render, screen, waitFor } from '../../.ci/installation-feedback-1111/testing';
import { blocked, fixtureCalls, replyWith } from '../../.ci/installation-feedback-1111/ports';
import FormulaireInteretInstallation from '../../src/components/FormulaireInteretInstallation';

async function mount(lang: string, props = {}) {
  const i18n = createInstance();
  await i18n.init({ lng: lang, fallbackLng: 'fr', resources: { fr: { translation: {} }, en: { translation: {} } } });
  render(<I18nextProvider i18n={i18n}><MemoryRouter><FormulaireInteretInstallation {...props} /></MemoryRouter></I18nextProvider>);
  return i18n;
}
const byId = (id: string) => document.getElementById(id)!;
const form = () => document.querySelector('form')!;
function fill() {
  fireEvent.change(byId('nom'), { target: { value: 'Personne fictive' } });
  fireEvent.change(byId('email'), { target: { value: 'fixture@example.invalid' } });
  fireEvent.click(byId('consent'));
}
afterEach(() => { cleanup(); expect(blocked).toEqual([]); replyWith(); });

it('N1 tout le formulaire anglais, pas seulement les erreurs', async () => {
  await mount('en');
  expect(screen.getByLabelText('Name *')).toBeInTheDocument();
  expect(screen.getByText('Preferred practice (optional)')).toBeInTheDocument();
  expect(screen.getByText('All practices', { selector: 'span' })).toBeInTheDocument();
  expect(screen.getByText('Select your profession')).toBeInTheDocument();
  expect(screen.getByLabelText('Phone (optional)')).toBeInTheDocument();
  expect(screen.getByLabelText('Your practice project (optional)')).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Describe your planned timeline/)).toBeInTheDocument();
  expect(screen.getByText('0 / 2000 characters')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'privacy policy' })).toHaveAttribute('href', '/en/privacy');
  expect(screen.getByLabelText(/I agree that I‑CA.RE/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Send my request' })).toBeDisabled();
  expect(document.querySelector('option[value="psychologue"]')).toHaveTextContent('Psychologists');
  expect(document.querySelector('option[value="autre-profession"]')).toHaveTextContent('Other healthcare profession');
  expect(document.querySelector('option[value="fixture-unknown"]')).toHaveTextContent('Profession fictive');
  expect(fixtureCalls).toEqual([]);
});
it('N2 les libelles, aides et options francais sont conserves', async () => {
  await mount('fr');
  expect(screen.getByLabelText('Nom *')).toBeInTheDocument();
  expect(screen.getByLabelText('Téléphone (facultatif)')).toBeInTheDocument();
  expect(screen.getByText('Cabinet souhaité (facultatif)')).toBeInTheDocument();
  expect(screen.getByText('Tous les cabinets', { selector: 'span' })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Précisez votre calendrier/)).toBeInTheDocument();
  expect(screen.getByText('0 / 2000 caractères')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'politique de confidentialité' })).toHaveAttribute('href', '/confidentialite');
  expect(screen.getByRole('button', { name: 'Envoyer ma demande' })).toBeDisabled();
  expect(document.querySelector('option[value="psychologue"]')).toHaveTextContent('Psychologues');
});
it('N3 variantes anglaises et changement de langue sans perte de saisie', async () => {
  const i18n = await mount('en-GB', { professionSlug: 'psychologue', professionLabel: 'Psychologues', villeSlug: 'ville-fictive', villeLabel: 'Cabinet fictif' });
  expect(screen.getByText('Psychologists')).toBeInTheDocument();
  expect(screen.getByText('Selected practice :')).toBeInTheDocument();
  fill();
  await act(async () => { await i18n.changeLanguage('fr'); });
  expect(screen.getByText('Psychologues')).toBeInTheDocument();
  expect(screen.getByText('Cabinet visé :')).toBeInTheDocument();
  expect(byId('nom')).toHaveValue('Personne fictive');
  expect(screen.getByRole('button', { name: 'Envoyer ma demande' })).toBeEnabled();
});
for (const lang of ['fr', 'en'] as const) {
  it('N4 refus accessible et description avant focus ' + lang, async () => {
    await mount(lang, { professionSlug: 'psychologue' });
    fill();
    fireEvent.change(byId('telephone'), { target: { value: 'invalide' } });
    let descriptionAtFocus: string | null = null;
    byId('telephone').addEventListener('focus', () => {
      const id = byId('telephone').getAttribute('aria-describedby');
      descriptionAtFocus = id ? document.getElementById(id)?.textContent ?? null : null;
    }, { once: true });
    fireEvent.click(screen.getByRole('button', { name: lang === 'en' ? 'Send my request' : 'Envoyer ma demande' }));
    expect(byId('telephone')).toHaveAttribute('aria-invalid', 'true');
    expect(byId('telephone')).toHaveFocus();
    expect(descriptionAtFocus).toBe(lang === 'en' ? 'Enter a valid phone number.' : 'Numéro de téléphone invalide.');
    expect(byId('telephone')).toHaveValue('invalide');
    expect(fixtureCalls).toEqual([]);
  });
}
it('N5 toutes les erreurs suivent la langue active apres refus', async () => {
  const i18n = await mount('fr');
  fireEvent.submit(form());
  expect(screen.getByText("Merci d'indiquer votre nom (2 caractères minimum).")).toBeInTheDocument();
  await act(async () => { await i18n.changeLanguage('en'); });
  expect(screen.getByText('Enter your name (at least 2 characters).')).toBeInTheDocument();
  expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
  expect(screen.getByText('Consent is required.')).toBeInTheDocument();
  expect(screen.getAllByText('Select your profession.')).toHaveLength(1);
  expect(fixtureCalls).toEqual([]);
});
it('N6 autre profession : aide et erreur du message en anglais', async () => {
  await mount('en');
  fireEvent.change(document.querySelector('select')!, { target: { value: 'autre-profession' } });
  expect(screen.getByText('Specify your profession in the ‘Your practice project’ field below.')).toBeInTheDocument();
  expect(screen.getByLabelText('Your practice project *')).toHaveAttribute('aria-required', 'true');
  fill();
  fireEvent.submit(form());
  expect(screen.getByText('Specify your profession in the message.')).toBeInTheDocument();
  expect(byId('message')).toHaveFocus();
  expect(fixtureCalls).toEqual([]);
});
for (const lang of ['fr', 'en'] as const) {
  it('N7 garde Floirac directe et options filtrees ' + lang, async () => {
    for (const slug of ['floirac', 'i-ca-re-floirac']) {
      await mount(lang, { villeSlug: slug });
      expect(screen.getByRole('status')).toHaveTextContent(lang === 'en' ? 'This location is no longer part of our offer.' : 'Ce lieu ne fait plus partie de notre offre.');
      expect(document.querySelector('form')).toBeNull();
      cleanup();
    }
    await mount(lang);
    const values = Array.from(document.querySelectorAll('select option'), (option) => (option as HTMLOptionElement).value);
    expect(values).toContain('ville-fictive');
    expect(values).not.toContain('floirac');
    expect(values).not.toContain('i-ca-re-floirac');
    expect(fixtureCalls).toEqual([]);
  });
}
it('N8 attente puis succes simules integralement anglais, corps du transport conserve', async () => {
  let resolve!: (result: { data: { ok: boolean }; error: null }) => void;
  replyWith(() => new Promise((done) => { resolve = done; }));
  await mount('en', { professionSlug: 'psychologue', villeSlug: 'ville-fictive' });
  fill();
  fireEvent.submit(form());
  expect(form()).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
  expect(fixtureCalls).toEqual([{ name: 'submit-demande-installation', options: { body: {
    profession_slug: 'psychologue', ville_slug: 'ville-fictive', nom: 'Personne fictive', email: 'fixture@example.invalid', telephone: null,
    message: null, consentement_rgpd: true, source_path: '/installation', website: '',
  } } }]);
  await act(async () => { resolve({ data: { ok: true }, error: null }); });
  expect(screen.getByRole('status')).toHaveTextContent('Request sent');
  expect(screen.getByRole('heading', { name: 'Your request has been sent' })).toBeInTheDocument();
  expect(screen.getByText('within 24 hours')).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('with details of the available spaces and the conditions for setting up your practice.');
  expect(fixtureCalls).toHaveLength(2);
});
it('N9 refus serveur simule et langue changee apres reponse', async () => {
  replyWith(async () => ({ data: { error: 'rate_limited' }, error: null }));
  const i18n = await mount('en', { professionSlug: 'psychologue' });
  fill(); await act(async () => { fireEvent.submit(form()); });
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Too many requests. Try again in one hour.'));
  await act(async () => { await i18n.changeLanguage('fr'); });
  expect(screen.getByRole('alert')).toHaveTextContent('Trop de demandes envoyées, réessayez dans une heure.');
  expect(byId('nom')).toHaveValue('Personne fictive');
  expect(fixtureCalls).toHaveLength(1);
});
it('N10 refus inconnu et rejet simules gardent le retour anglais', async () => {
  replyWith(async () => ({ data: { error: 'fixture-unknown' }, error: null }));
  await mount('en', { professionSlug: 'psychologue' });
  fill(); await act(async () => { fireEvent.submit(form()); });
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('An error occurred. Please try again.'));
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  replyWith(async () => { throw new Error('fixture rejection'); });
  await act(async () => { fireEvent.submit(form()); });
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('An error occurred. Please try again.'));
  expect(consoleError).toHaveBeenCalledOnce();
  consoleError.mockRestore();
});
