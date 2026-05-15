## Lot 0ter — Refonte taxonomique vivante (3 dimensions + candidats GPT)

Objectif : centraliser la taxonomie, ajouter une 3ᵉ dimension (publics), et créer un système vivant où GPT remonte des candidats que l'admin valide.

---

### Lot 1 — Centralisation `src/lib/taxonomy.ts`

- Créer `src/lib/taxonomy.ts` (source unique) avec `SPECIALITY_GROUPS`, `PROBLEMATIQUE_GROUPS`, `PUBLIC_CIBLE_GROUPS`, `SYNONYM_MAP`, `ALL_*` aplaties, `TAXONOMY_VERSION = "0ter-2026-05-15"`.
- Créer `supabase/functions/_shared/taxonomy.ts` (miroir documenté `// MIRROR — keep in sync with src/lib/taxonomy.ts`, mêmes constantes + même `TAXONOMY_VERSION`). Choix pragmatique : duplication contrôlée avec en-tête fort, version comparée au runtime (warning si divergence).
- Snapshot avant modif dans `docs/icare-connect/snapshots/lot0ter/`.

### Lot 2 — Migration BDD

- `ALTER TABLE praticiens ADD COLUMN publics_derives text[] NOT NULL DEFAULT '{}'`.
- Création table `taxonomy_candidates` (term, term_normalized, dimension, occurrences, praticiens_ids[], first_seen_at, last_seen_at, status, resolution_*, UNIQUE(term_normalized, dimension)). RLS service_role only.
- Fonction `upsert_taxonomy_candidate(term, term_normalized, dimension, praticien_id)` SECURITY DEFINER.

### Lot 3 — Edge Function `extract-praticien-tags` (3 dimensions + candidats)

- Refactor pour produire `specialites`, `problematiques`, `publics_cibles` séparés.
- Prompt système réécrit (R1-R7), schema JSON strict avec 3 arrays + `notes`.
- Pipeline : normalisation → `SYNONYM_MAP` → `intersectAllowed` par dimension → union avec déclarations formelles (specialités/problématiques) → écriture `specialites_derivees`, `problematiques_derivees`, `publics_derives`.
- Parsing du champ `notes` pour `[CANDIDAT-specialite|problematique|public]` → appel `upsert_taxonomy_candidate`.
- Log enrichi par dimension dans `tags_extraction_log`.

### Lot 4 — Filtre `/patients` 4 blocs

- `PatientsOuvert.tsx` : import depuis `@/lib/taxonomy` (suppression définitions locales), suppression du groupe "Enfants et adolescents" obsolète côté problématiques.
- Ajout bloc « PUBLIC » (Enfants, Adolescents, Couples, Familles) dans sidebar et drawer mobile, sous « BESOIN ».
- Filtrage `.some()` sur `publics_derives`. ET inter-blocs, OU intra-bloc.
- `usePraticiensPublics` : ajout `publics_derives` dans le SELECT et le type.

### Lot 5 — Page `/admin/taxonomie`

- Nouvelle route protégée par `AdminGuard`, ajoutée dans `App.tsx`, lien dans la nav admin.
- Header + compteurs (en attente / intégrés / synonymes / ignorés).
- Filtres statut + dimension. Tableau trié par occurrences DESC, pending en haut.
- Actions par ligne : **Intégrer** (modal + suggestion GPT), **Synonyme** (modal autocomplete), **Ignorer**.
- Bouton « Lancer le re-backfill » manuel.

### Lot 6 — Edge Function `suggest-taxonomy-group`

- Auth `x-admin-token`, gpt-4o-mini, response_format json_schema strict.
- Prompt classifie un terme dans le bon groupe selon la dimension.
- Renvoie `{ groupe_recommande, justification, alternative_synonyme }`.

### Lot 7 — Edge Functions admin pour résolution candidats

- `admin-resolve-taxonomy-candidate` : update du candidat (`integrated|synonym|ignored`), trace `resolved_by`, `resolved_at`.
- **Choix pragmatique sur l'écriture de `taxonomy.ts`** : pas d'écriture runtime du fichier (impossible en prod statique GitHub Pages). La modal de validation affiche le snippet à coller dans `taxonomy.ts` avec bouton « Copier », et le candidat passe quand même en `integrated` côté DB. Re-backfill via bouton manuel.
- `admin-trigger-rebackfill` : déclenche extraction sur toutes fiches validées + actives.

### Lot 8 — Re-backfill initial

- Edge function temporaire `oneshot-backfill-lot0ter` qui itère sur les 8 fiches validées, puis suppression.

---

### Détails techniques

- **Pas d'écriture auto de `taxonomy.ts`** : l'admin colle le snippet, recompile via Lovable. Trade-off accepté pour ne pas bricoler un système d'écriture de fichiers en prod.
- **TAXONOMY_VERSION** : constante incrémentée à chaque modif, présente dans les 2 fichiers. L'Edge Function compare et `console.warn` si divergence (sans bloquer).
- **Suppression du groupe "Enfants et adolescents"** côté problématiques : les anciens tags `adolescents`, `stress scolaire enfants & ados`, `tensions liées à la pression scolaire` sont remplacés. `adolescents` migre vers `publics_derives`. `stress scolaire` reste dans groupe `Scolarité`.
- **Pas de nouveau secret** : réutilisation `OPENAI_API_KEY`, `CRON_TOKEN`, `ADMIN_SESSION_SECRET`.
- **Snapshots** : `docs/icare-connect/snapshots/lot0ter/` pour `taxonomy` Edge Function, `PatientsOuvert.tsx`, `usePraticiensPublics.ts`.

### Ordre d'exécution

1. Snapshots
2. `src/lib/taxonomy.ts` + `supabase/functions/_shared/taxonomy.ts`
3. Migration BDD (table + colonne + fonction)
4. Refactor `extract-praticien-tags` (3 dim + candidats)
5. `usePraticiensPublics` + `PatientsOuvert` (4 blocs)
6. Edge functions `suggest-taxonomy-group` + `admin-resolve-taxonomy-candidate` + `admin-trigger-rebackfill` + `admin-list-taxonomy-candidates`
7. Page `/admin/taxonomie` + lien nav
8. Re-backfill initial via oneshot
9. Vérifications BDD + logs
