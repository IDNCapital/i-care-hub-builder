-- Migration : journal d'audit des ecritures sur les tables nominatives
-- Site : I-CA.RE. Date : 2026-08-25. Version 3, apres deux relectures adversariales.
-- Idempotente, rejouable sans effet de bord. Tout ou rien : transaction explicite.
--
-- Motif : 35 lignes nominatives supprimees sans aucune trace applicative (WEB-DEMANDES-EFFACEES).
-- Le journal ne porte aucune valeur nominative : identifiant de ligne, operation, role effectif,
-- horodatage, noms des colonnes modifiees, volume tronque. Jamais le contenu.
--
-- Deuxieme objet, decouvert en relecture : TRUNCATE n'est pas soumis a la RLS, il ne depend
-- que du privilege. `anon` et `authenticated` le detiennent sur les six tables. Le lot le retire.

begin;

select set_config('lock_timeout', '3s', true);

-- 1. Le journal

create table if not exists public.audit_donnees_nominatives (
  id                  bigserial primary key,
  table_cible         text not null,
  ligne_id            uuid,
  operation           text not null check (operation in ('INSERT','UPDATE','DELETE','TRUNCATE')),
  role_effectif       text,
  utilisateur_session text,
  jwt_role            text,
  auth_sub            text,
  colonnes_modifiees  text[],
  lignes_avant        bigint,
  survenu_le          timestamptz not null default now()
);

comment on table public.audit_donnees_nominatives is
  'Journal des ecritures sur les tables nominatives. Aucune valeur nominative : identifiant de ligne, operation, role effectif, horodatage, noms de colonnes modifiees, volume avant troncature. auth_sub est l identifiant technique de la personne authentifiee, seul champ permettant de nommer un acteur, extension assumee de la liste blanche de la Doctrine. role_effectif vaut none pour une connexion directe, c est a dire l editeur SQL ou le MCP Lovable, et anon, authenticated ou service_role pour tout ce qui passe par PostgREST.';

create index if not exists idx_audit_nominatives_table_date
  on public.audit_donnees_nominatives (table_cible, survenu_le desc);

alter table public.audit_donnees_nominatives enable row level security;

-- 2. Personne n ecrit dans le journal, hors le trigger en contexte definer

revoke all on public.audit_donnees_nominatives from anon, authenticated;
revoke all on sequence public.audit_donnees_nominatives_id_seq from anon, authenticated;
revoke all on public.audit_donnees_nominatives from service_role;
revoke all on sequence public.audit_donnees_nominatives_id_seq from service_role;
grant select on public.audit_donnees_nominatives to service_role;

-- 3. Le rapporteur

create or replace function public.tracer_donnee_nominative()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $fn$
declare
  v_ligne    uuid;
  v_cols     text[];
  v_claims   jsonb;
  v_sub      text;
  v_jwt_role text;
  v_avant    bigint;
begin
  -- Sous SECURITY DEFINER, current_role vaut toujours le proprietaire, ici postgres.
  -- Seul le parametre `role`, pose par PostgREST, rend le role reel de l appelant.
  begin
    v_claims   := nullif(current_setting('request.jwt.claims', true), '')::jsonb;
    v_sub      := v_claims ->> 'sub';
    v_jwt_role := v_claims ->> 'role';
  exception when others then
    v_sub := null;
    v_jwt_role := null;
  end;

  if tg_op = 'TRUNCATE' then
    -- Trigger BEFORE : la table est encore pleine, le volume efface est donc mesurable.
    execute format('select count(*) from public.%I', tg_table_name) into v_avant;
    insert into public.audit_donnees_nominatives
      (table_cible, ligne_id, operation, role_effectif, utilisateur_session, jwt_role, auth_sub, colonnes_modifiees, lignes_avant)
    values
      (tg_table_name, null, 'TRUNCATE', current_setting('role', true), session_user, v_jwt_role, v_sub, '{}'::text[], v_avant);
    return null;
  end if;

  if tg_op = 'DELETE' then
    v_ligne := old.id;
  else
    v_ligne := new.id;
  end if;

  if tg_op = 'UPDATE' then
    select coalesce(array_agg(n.cle order by n.cle), '{}'::text[]) into v_cols
    from jsonb_each(to_jsonb(new)) as n(cle, valeur)
    where n.valeur is distinct from (to_jsonb(old) -> n.cle);
  else
    v_cols := '{}'::text[];
  end if;

  begin
    insert into public.audit_donnees_nominatives
      (table_cible, ligne_id, operation, role_effectif, utilisateur_session, jwt_role, auth_sub, colonnes_modifiees)
    values
      (tg_table_name, v_ligne, tg_op, current_setting('role', true), session_user, v_jwt_role, v_sub, v_cols);
  exception when others then
    -- Un INSERT public est une conversion : l audit ne la fait jamais echouer.
    -- Un UPDATE ou un DELETE vient d un chemin d administration : sans trace, il est refuse.
    -- Le message reprend le sqlstate, qui ne porte jamais de valeur metier, jamais le sqlerrm,
    -- qui peut en porter une.
    if tg_op = 'INSERT' then
      raise warning 'audit indisponible, % sur %, sqlstate %', tg_op, tg_table_name, sqlstate;
    else
      raise exception 'ecriture refusee : journal d audit indisponible, % sur %, sqlstate %',
        tg_op, tg_table_name, sqlstate;
    end if;
  end;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$fn$;

-- 4. Pose des triggers, et fermeture des privileges qui echappent a la RLS

do $do$
declare
  t text;
begin
  foreach t in array array[
    'demandes_conciergerie',
    'contact_leads',
    'investor_leads',
    'practitioner_leads',
    'demandes_installation',
    'declarations_parrainage'
  ]
  loop
    if to_regclass('public.' || quote_ident(t)) is null then
      raise exception 'table % absente : lot interrompu, aucune pose partielle', t;
    end if;

    execute format('drop trigger if exists trg_audit_nominatif on public.%I', t);
    execute format(
      'create trigger trg_audit_nominatif after insert or update or delete on public.%I for each row execute function public.tracer_donnee_nominative()',
      t
    );

    execute format('drop trigger if exists trg_audit_nominatif_truncate on public.%I', t);
    execute format(
      'create trigger trg_audit_nominatif_truncate before truncate on public.%I for each statement execute function public.tracer_donnee_nominative()',
      t
    );

    -- TRUNCATE ne passe pas par la RLS. UPDATE et DELETE n ont aucune policy et ne servent
    -- a personne sous ces deux roles. SELECT et INSERT sont conserves, la policy INSERT
    -- portant la conversion publique.
    execute format('revoke update, delete, truncate, references, trigger on public.%I from anon, authenticated', t);
  end loop;
end
$do$;

commit;
