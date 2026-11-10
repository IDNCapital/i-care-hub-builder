import '../../.ci/icare-contact-refus-accessibles-1011/closedEnvironment';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '../../.ci/icare-contact-refus-accessibles-1011/testing';
import { MemoryRouter } from 'react-router-dom';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import Contact from '../../src/pages/Contact';
import fr from '../../src/locales/fr.json';
import en from '../../src/locales/en.json';
import { ui } from '../../.ci/icare-contact-refus-accessibles-1011/ports';
let locale=createInstance();
async function mount(lang:'fr'|'en') {locale=createInstance();await locale.init({lng:lang,fallbackLng:'fr',resources:{fr:{translation:fr},en:{translation:en}},initImmediate:false,interpolation:{escapeValue:false}});return render(<I18nextProvider i18n={locale}><MemoryRouter initialEntries={[lang==='en'?'/en/contact':'/contact']}><Contact/></MemoryRouter></I18nextProvider>);}
const byId=(id:string)=>document.getElementById(id)!;
const fill=(values:Record<string,string>={})=>{for(const [id,value] of Object.entries({nom:'Personne Fictive',email:'personne@example.invalid',message:'Question fictive sans envoi',...values}))fireEvent.change(byId(id),{target:{value}});};
const choose=()=>fireEvent.click(screen.getByRole('button',{name:name=>name.startsWith(String(locale.t('contact.types.professionnel')))}));
const form=()=>document.querySelector('form')!;
const submit=()=>{expect(form().checkValidity()).toBe(true);expect(byId('rgpd-contact')).toHaveAttribute('aria-checked','false');fireEvent.click(screen.getByRole('button',{name:String(locale.t('contact.submit'))}));};
function feedback(target:HTMLElement,key:string){expect(ui.errors).toEqual([String(locale.t(key))]);expect(target).toHaveAttribute('aria-invalid','true');const description=target.getAttribute('aria-describedby')!;expect(description).toBeTruthy();expect(document.getElementById(description)).toHaveTextContent(String(locale.t(key)));expect(target).toHaveFocus();expect(screen.getByRole('alert')).toHaveTextContent(String(locale.t(key)));expect(ui.forbidden).toEqual([]);}
beforeEach(()=>{ui.errors=[];ui.forbidden=[];});afterEach(()=>{cleanup();expect(ui.forbidden).toEqual([]);});
for(const lang of ['fr','en'] as const){
 it('N1 '+lang+' type absent : groupe relié et annoncé avant le focus',async()=>{await mount(lang);fill();submit();const group=screen.getByRole('group',{name:String(locale.t('contact.selectType'))});feedback(group,'contact.selectType');expect(byId('nom')).toHaveValue('Personne Fictive');});
 it('N2 '+lang+' valeur blanche : refus applicatif dans un formulaire nativement valide',async()=>{await mount(lang);choose();const id=lang==='fr'?'nom':'message';fill({[id]:'   '});let atFocus:string|null=null;byId(id).addEventListener('focus',()=>{atFocus=byId(id).getAttribute('aria-describedby');},{once:true});submit();feedback(byId(id),'contact.errorRequired');expect(atFocus).toBeTruthy();expect(document.getElementById(atFocus!)).toHaveTextContent(String(locale.t('contact.errorRequired')));expect(byId(id)).toHaveValue('   ');});
 it('N3 '+lang+' email accepté nativement mais refusé par la regex applicative',async()=>{await mount(lang);choose();fill({email:'personne@example'});submit();feedback(byId('email'),'contact.errorEmail');expect(byId('email')).toHaveValue('personne@example');});
 it('N4 '+lang+' consentement absent : reprise au bon contrôle sans accepter',async()=>{await mount(lang);choose();fill();submit();feedback(byId('rgpd-contact'),'contact.errorConsent');expect(byId('rgpd-contact')).toHaveAttribute('aria-checked','false');expect(byId('message')).toHaveValue('Question fictive sans envoi');});
}

for(const lang of ['fr','en'] as const)it('N5 '+lang+' correction et choix annoncé sans déplacer le focus pendant la saisie',async()=>{
 await mount(lang);expect(screen.queryByRole('alert')).toBeNull();fill();submit();choose();
 const buttons=['professionnel','collectivite','investisseur'].map(type=>screen.getByRole('button',{name:name=>name.startsWith(String(locale.t('contact.types.'+type)))}));
 expect(buttons.map(button=>button.getAttribute('aria-pressed'))).toEqual(['true','false','false']);expect(screen.queryByRole('alert')).toBeNull();
 fireEvent.change(byId('nom'),{target:{value:'   '}});submit();byId('email').focus();
 fireEvent.change(byId('nom'),{target:{value:'Nom corrigé'}});expect(screen.queryByRole('alert')).toBeNull();expect(byId('nom')).not.toHaveAttribute('aria-invalid');expect(byId('nom')).not.toHaveAttribute('aria-describedby');expect(byId('email')).toHaveFocus();expect(byId('nom')).toHaveValue('Nom corrigé');expect(byId('message')).toHaveValue('Question fictive sans envoi');expect(byId('rgpd-contact')).toHaveAttribute('aria-checked','false');
});
for (const lang of ['fr', 'en'] as const) {
  it('N6 ' + lang + ' le premier champ nativement invalide reçoit sa description puis le focus', async () => {
    await mount(lang);
    expect(form().noValidate).toBe(false);
    for (const [id, key] of [['nom', 'fullName'], ['email', 'email'], ['message', 'message']]) {
      expect(screen.getByLabelText(new RegExp('^' + String(locale.t('contact.' + key))))).toBe(byId(id));
      expect(byId(id)).toBeRequired();
    }

    const clickSubmit = () => fireEvent.click(screen.getByRole('button', { name: String(locale.t('contact.submit')) }));
    let descriptionAtFocus: string | null = null;
    const nom = byId('nom') as HTMLInputElement;
    nom.addEventListener('focus', () => {
      const description = nom.getAttribute('aria-describedby');
      descriptionAtFocus = description ? document.getElementById(description)?.textContent ?? null : null;
    }, { once: true });

    expect(nom.validity.valueMissing).toBe(true);
    clickSubmit();
    expect(nom).toHaveFocus();
    expect(nom).toHaveAttribute('aria-invalid', 'true');
    expect(descriptionAtFocus).toBe(String(locale.t('contact.errorRequired')));
    expect(screen.getByRole('alert')).toHaveTextContent(String(locale.t('contact.errorRequired')));
    expect(byId('email')).not.toHaveAttribute('aria-invalid');
    expect(byId('message')).not.toHaveAttribute('aria-invalid');

    fill({ email: 'pas-un-email' });
    const email = byId('email') as HTMLInputElement;
    expect(email.validity.typeMismatch).toBe(true);
    expect(email).toHaveAttribute('type', 'email');
    clickSubmit();
    expect(email).toHaveFocus();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(document.getElementById(email.getAttribute('aria-describedby')!))
      .toHaveTextContent(String(locale.t('contact.errorEmail')));
    expect(ui.errors).toEqual([]);
    expect(ui.forbidden).toEqual([]);
  });
}

it('N7 un domaine avec tiret initial reste signalé tant que la contrainte native échoue', async () => {
  await mount('fr');
  choose();
  fill({ email: 'a@-b.example' });
  const email = byId('email') as HTMLInputElement;
  expect(email.validity.typeMismatch).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: String(locale.t('contact.submit')) }));
  expect(email).toHaveFocus();
  expect(email).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByRole('alert')).toHaveTextContent(String(locale.t('contact.errorEmail')));
  fireEvent.change(email, { target: { value: 'a@b.example' } });
  expect(email.validity.valid).toBe(true);
  expect(email).not.toHaveAttribute('aria-invalid');
  expect(screen.queryByRole('alert')).toBeNull();
  expect(ui.forbidden).toEqual([]);
});
