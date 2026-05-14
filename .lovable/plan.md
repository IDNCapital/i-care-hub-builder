# Lot 0bis — Extraction automatique des tags depuis la bio

## Vue d'ensemble
Automatiser l'extraction des tags filtrables (`specialites_derivees`, `problematiques_derivees`) depuis la bio de chaque praticien via OpenAI `gpt-4o-mini`. La bio reste source de vérité ; les tags dérivés alimentent le filtre `/patients`. Le slug devient auto-généré.

---

## Pré-requis
- **Secret à créer après déploiement** : `OPENAI_API_KEY` (Lovable Cloud → Secrets). Je demanderai sa valeur via `add_secret` dès le Lot 3.
- Réutilisation de `CRON_TOKEN` (cron/trigger) et `ADMIN_SESSION_SECRET` (proxy admin).

---

## Lot 0 — Snapshot
Snapshot des fichiers impactés avant modification dans `docs/icare-connect/snapshots/lot0bis/` :
- `PatientsOuvert.tsx`, `PraticienDrawer.tsx`, `AdminPraticiens.tsx`

## Lot 1 — Migration schéma `praticiens`
Ajout de 6 colonnes (sans toucher `specialites`/`problematiques` existantes) :
- `specialites_derivees text[]` default `'{}'`
- `problematiques_derivees text[]` default `'{}'`
- `tags_extraction_status text` default `'pending'` + CHECK (`pending|success|review|error|skipped`)
- `tags_extracted_at timestamptz`
- `tags_bio_hash text`
- `tags_extraction_log jsonb` default `'[]'`
RLS héritée (lecture publique sur `validee+actif`, écriture service_role).

## Lot 2 — Auto-slug
- `CREATE EXTENSION IF NOT EXISTS unaccent;`
- Fonction `public.set_praticien_slug()` :
  - calcule slug = `lower(unaccent(prenom || '-' || nom))`, regex non-alphanum → `-`, collapse, trim
  - vérifie unicité, suffixe `-2`, `-3`…
- Trigger `BEFORE INSERT OR UPDATE OF prenom, nom` sur `praticiens`
- Backfill : `UPDATE praticiens SET prenom = prenom` pour déclencher recalcul ; log éventuels changements via `RAISE NOTICE`

## Lot 3 — Edge Function `extract-praticien-tags`
Fichier `supabase/functions/extract-praticien-tags/index.ts` (Deno) :
- Auth via `x-cron-token` constant-time vs `CRON_TOKEN`, sinon délai 600 ms + 401
- Lit praticien (service_role), calcule SHA-256 bio (concat `bio_courte || bio_longue`)
- Si `tags_bio_hash === current` et `!force` → status `skipped`, exit
- Construit prompt système avec listes `SPECIALITY_GROUPS` et `PROBLEMATIQUE_GROUPS` aplaties (dupliquées dans la fonction depuis `src/components/patients/PatientsOuvert.tsx`)
- Appelle OpenAI `gpt-4o-mini`, `temperature: 0`, `response_format: json_schema strict`
- Filtre côté code les tags retournés contre la taxonomie
- `confiance==='basse'` → `review`, sinon `success` ; erreur OpenAI → `error` (sans écraser tags existants)
- Met à jour `specialites_derivees`, `problematiques_derivees`, `tags_bio_hash`, `tags_extracted_at`, append `tags_extraction_log` (10 max)
- Configuration `verify_jwt = false` dans `supabase/config.toml`
- Pas de log de bio/contenu personnel

## Lot 4 — Trigger Postgres → Edge Function
- Activer `pg_net` si pas actif
- Fonction `public.trigger_extract_praticien_tags()` qui POST async via `net.http_post` à l'Edge Function avec `x-cron-token` et `force:false`
- Trigger `AFTER INSERT OR UPDATE OF bio_courte, bio_longue` quand `statut_validation IN ('brouillon','preview_envoyee','validee')`
- L'URL et le token sont stockés dans `app_settings` (table key/value sécurisée) ou récupérés via fonction `current_setting` — implémentation via paramètres GUC posés par migration depuis env. **À défaut** : utiliser `vault.decrypted_secrets` (Supabase Vault) si dispo.

## Lot 5 — Admin
- `PraticienDrawer.tsx` (section « Profession & Spécialités ») :
  - pills lecture seule pour `specialites_derivees` / `problematiques_derivees`
  - badge `tags_extraction_status` coloré (sage/or/gris/rouge selon charte)
  - `tags_extracted_at` formaté FR
  - Bouton « Réextraire les tags » → appelle nouvelle Edge Function `admin-reextract-tags` (proxy avec `x-admin-token` qui forge `x-cron-token` côté serveur, force:true)
- Nouvelle Edge Function `admin-reextract-tags/index.ts` qui valide la session admin puis invoque `extract-praticien-tags`
- `AdminPraticiens.tsx` : ajouter filtre URL `?filter=tags-review` qui pré-coche un nouveau filtre logique « tags à vérifier » (status review/error)
- Mise à jour de `admin-list-praticiens` pour renvoyer les nouvelles colonnes
- Type `Praticien` étendu

## Lot 6 — Filtre `/patients`
Dans `PatientsOuvert.tsx` :
- Hook `usePraticiensPublics` : sélectionner aussi `specialites_derivees` et `problematiques_derivees`
- Filtre Type/Besoin lit `specialites_derivees ?? []` et `problematiques_derivees ?? []` (au lieu de `specialites`/`problematiques`)
- Aucun changement visuel
- `FichePraticien` continue d'afficher les colonnes brutes (inchangé)

## Lot 7 — Backfill 8 fiches validées
Insert SQL one-shot (via tool `supabase--insert`) :
```sql
SELECT net.http_post(...) FROM praticiens WHERE statut_validation='validee' AND actif=true;
```
Vérification via `read_query` que les 8 fiches ont `tags_extraction_status IN ('success','review')`.

---

## Détails techniques

### Taxonomie partagée
Pour éviter la divergence front/back, j'extrais `SPECIALITY_GROUPS` et `PROBLEMATIQUE_GROUPS` actuels de `PatientsOuvert.tsx` et les duplique dans la function (commentaire `// MIRROR — keep in sync`).

### Hash bio
SHA-256 hex de `${bio_courte ?? ''}\n---\n${bio_longue ?? ''}` (deno `crypto.subtle.digest`).

### Sécurité
- Service role key uniquement dans la fonction
- Constant-time compare via boucle XOR sur bytes
- Pas de log PII

### URL Edge Function dans trigger SQL
Stockée dans une nouvelle table `app_config(key text primary key, value text)` insérée par migration ; l'URL = `https://ttxxqxipnwbzeoohvseu.supabase.co/functions/v1/extract-praticien-tags`. Le `CRON_TOKEN` y est aussi stocké (RLS service_role only).

### Non-régression
Aucune modif sur `/`, `/projets`, `/investissement`, `/temoignages-praticiens`, `/parrainage`, `/preview/...`, `/admin/demandes`, pages confidentialité. `FichePraticien` inchangé.

---

## Ordre d'exécution
1. Snapshots
2. Migration Lot 1 (colonnes) — **demande approbation**
3. Migration Lot 2 (slug + backfill)
4. `add_secret` `OPENAI_API_KEY` (interaction utilisateur)
5. Edge Function `extract-praticien-tags` + config.toml
6. Migration Lot 4 (trigger pg_net + table app_config)
7. Edge Function `admin-reextract-tags`, mise à jour `admin-list-praticiens`
8. Front : `PraticienDrawer`, `AdminPraticiens`, hook `usePraticiensPublics`, `PatientsOuvert`
9. Backfill SQL Lot 7 + vérification

Travail conséquent en plusieurs migrations. Je confirme chaque migration avant la suivante.
