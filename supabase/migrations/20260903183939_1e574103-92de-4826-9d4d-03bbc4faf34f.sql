begin;
select set_config('lock_timeout', '3s', true);

-- Groupe A : douze tables de contenu public, SELECT seul
revoke all on table
  public.articles, public.avis_google_cache, public.avis_google_mis_en_avant,
  public.installation_content_common, public.installation_content_profession,
  public.installation_content_ville, public.praticiens, public.problematiques,
  public.professions, public.projets, public.specialites, public.temoignages_praticiens
from anon, authenticated;

grant select on table
  public.articles, public.avis_google_cache, public.avis_google_mis_en_avant,
  public.installation_content_common, public.installation_content_profession,
  public.installation_content_ville, public.praticiens, public.problematiques,
  public.professions, public.projets, public.specialites, public.temoignages_praticiens
to anon, authenticated;

-- Groupe A bis : la vue publique, SELECT seul
revoke all on table public.installation_pages from anon, authenticated;
grant select on table public.installation_pages to anon, authenticated;

-- Groupe B : trois tables sans policy, aucun droit public
revoke all on table
  public.icare_idnos_audit_log, public.praticien_revisions, public.taxonomy_candidates
from anon, authenticated;

-- Groupe C : six tables nominatives, SELECT et INSERT seuls, MAINTAIN retiré
revoke all on table
  public.contact_leads, public.declarations_parrainage, public.demandes_conciergerie,
  public.demandes_installation, public.investor_leads, public.practitioner_leads
from anon, authenticated;

grant select, insert on table
  public.contact_leads, public.declarations_parrainage, public.demandes_conciergerie,
  public.demandes_installation, public.investor_leads, public.practitioner_leads
to anon, authenticated;

commit;