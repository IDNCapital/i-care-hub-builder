# Secrets référencés par les Edge Functions, PAR NOM · i-care-hub-builder · 2026-08-22

Mission de nuit `[XS] [3]`. **Lecture seule : aucun fichier de fonction n'a été
modifié.** Rollback : aucun.

> **Aucune valeur ne figure dans ce document.** Tout ce qui suit est un NOM de
> variable d'environnement, lu dans le code source. Le critère d'arrêt de la
> mission — « une valeur apparaîtrait dans une sortie : arrêt immédiat » — n'a
> pas été déclenché : les commandes ci-dessous ne peuvent rendre que des noms,
> et leur sortie a été relue.

## Périmètre, vérifié et non supposé

La mission annonce 24 Edge Functions. Le chiffre est exact :

```
$ ls supabase/functions | wc -l
25
$ ls supabase/functions | grep -v '^_shared$' | wc -l
24
```

La 25ᵉ entrée est `_shared/`, un répertoire de code partagé et non une fonction.

Sur ces 24 fonctions, **23 référencent au moins une variable d'environnement** :

```
$ grep -rl 'Deno.env.get' supabase/functions | wc -l
23
```

La seule qui n'en référence aucune est **`admin-logout`** — elle ne fait
qu'invalider un cookie de session, ce qui n'exige aucun secret.

## Méthode, et le piège qu'elle évite

Un simple relevé de `Deno.env.get("…")` est **incomplet**. Six fonctions passent
par un helper local — `Deno.env.get(name)`, où `name` est un paramètre :

```
$ grep -rnE 'Deno\.env\.get\(' supabase/functions | grep -vE 'Deno\.env\.get\(\s*"[^"]+"\s*\)'
supabase/functions/send-contact-lead/index.ts:80:  const value = Deno.env.get(name);
supabase/functions/submit-demande-installation/index.ts:29:  const v = Deno.env.get(name);
supabase/functions/submit-demande-conciergerie/index.ts:102:  const v = Deno.env.get(name);
supabase/functions/send-investor-verification/index.ts:88:  const value = Deno.env.get(name);
supabase/functions/verify-investor-token/index.ts:19:  const value = Deno.env.get(name);
supabase/functions/send-practitioner-lead/index.ts:80:  const value = Deno.env.get(name);
```

Le relevé additionne donc deux passes : les littéraux, et les noms passés à ces
helpers. La première seule rend 15 noms, la seconde 10, l'union 22 — sept noms
(toute la famille SMTP, l'expéditeur de courriel et le lien de vérification)
seraient **invisibles** à un relevé naïf.

## Commandes

```
# 1. appels directs, nom littéral
grep -rhoE 'Deno\.env\.get\(\s*"[^"]+"\s*\)' supabase/functions \
  | sed -E 's/.*"([^"]+)".*/\1/' | sort -u          # -> 15 noms

# 2. appels indirects : noms passés aux helpers
grep -rhoE '\b(requireEnv|optionalEnv|getEnv|env)\(\s*"[A-Z0-9_]+"' supabase/functions \
  | sed -E 's/.*"([A-Z0-9_]+)".*/\1/' | sort -u     # -> 10 noms

# 3. union
sort -u <(passe 1) <(passe 2)                        # -> 22 noms
```

Chaque commande est construite pour ne pouvoir extraire qu'un **nom** : le motif
capture ce qui est entre guillemets dans l'argument de lecture, jamais ce que
l'environnement rend.

## Les 22 noms, et les fonctions qui les lisent

| # | Nom de la variable | Nature | Fonctions qui la lisent |
|---|---|---|---|
| 1 | `ADMIN_PASSWORD` | secret d'authentification | check-admin-password _(1)_ |
| 2 | `ADMIN_SESSION_SECRET` | secret d'authentification | admin-delete-praticien, admin-get-audit-log, admin-list-demandes, admin-list-demandes-installation, admin-list-praticiens, admin-reextract-tags, admin-update-demande, admin-update-demande-installation, admin-upload-praticien-photo, admin-upsert-praticien, bootstrap-cabinets-place-ids, check-admin-password, refresh-google-reviews _(13)_ |
| 3 | `BOOTSTRAP_TOKEN` | secret d'authentification | bootstrap-praticiens _(1)_ |
| 4 | `CONCIERGERIE_WEBHOOK_URL` | adresse | submit-demande-conciergerie _(1)_ |
| 5 | `CRON_TOKEN` | secret d'authentification | admin-reextract-tags, admin-upsert-praticien, bootstrap-cabinets-place-ids, extract-praticien-tags, refresh-google-reviews _(5)_ |
| 6 | `GOOGLE_PLACES_API_KEY` | **clé d'API / privilège** | bootstrap-cabinets-place-ids, bootstrap-praticiens, refresh-google-reviews _(3)_ |
| 7 | `IDN_OS_PUSH_LIVE` | drapeau d'activation | receive-praticien-update-from-idnos _(1)_ |
| 8 | `IDN_OS_WEBHOOK_ENABLED` | drapeau d'activation | send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie _(4)_ |
| 9 | `IDN_OS_WEBHOOK_SECRET` | secret d'authentification | receive-praticien-update-from-idnos, send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie _(5)_ |
| 10 | `IDN_OS_WEBHOOK_URL` | adresse | send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie _(4)_ |
| 11 | `INFOMANIAK_SMTP_HOST` | configuration | send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie, submit-demande-installation, verify-investor-token _(6)_ |
| 12 | `INFOMANIAK_SMTP_PASS` | **clé d'API / privilège** | send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie, submit-demande-installation, verify-investor-token _(6)_ |
| 13 | `INFOMANIAK_SMTP_PORT` | configuration | send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie, submit-demande-installation, verify-investor-token _(6)_ |
| 14 | `INFOMANIAK_SMTP_USER` | identifiant | send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie, submit-demande-installation, verify-investor-token _(6)_ |
| 15 | `INTERNAL_NOTIFICATION_EMAIL` | configuration | submit-demande-conciergerie, submit-demande-installation _(2)_ |
| 16 | `IP_HASH_SALT` | secret d'authentification | submit-demande-conciergerie, submit-demande-installation _(2)_ |
| 17 | `MAIL_FROM_EMAIL` | configuration | send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie, submit-demande-installation, verify-investor-token _(6)_ |
| 18 | `MAIL_FROM_NAME` | configuration | send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie, submit-demande-installation, verify-investor-token _(6)_ |
| 19 | `OPENAI_API_KEY` | **clé d'API / privilège** | extract-praticien-tags _(1)_ |
| 20 | `SUPABASE_SERVICE_ROLE_KEY` | **clé d'API / privilège** | admin-delete-praticien, admin-get-audit-log, admin-list-demandes, admin-list-demandes-installation, admin-list-praticiens, admin-update-demande, admin-update-demande-installation, admin-upload-praticien-photo, admin-upsert-praticien, bootstrap-cabinets-place-ids, bootstrap-praticiens, check-investor-access, extract-praticien-tags, receive-praticien-update-from-idnos, refresh-google-reviews, send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie, submit-demande-installation, verify-investor-token _(21)_ |
| 21 | `SUPABASE_URL` | adresse | admin-delete-praticien, admin-get-audit-log, admin-list-demandes, admin-list-demandes-installation, admin-list-praticiens, admin-reextract-tags, admin-update-demande, admin-update-demande-installation, admin-upload-praticien-photo, admin-upsert-praticien, bootstrap-cabinets-place-ids, bootstrap-praticiens, check-investor-access, extract-praticien-tags, receive-praticien-update-from-idnos, refresh-google-reviews, send-contact-lead, send-investor-verification, send-practitioner-lead, submit-demande-conciergerie, submit-demande-installation, verify-investor-token _(22)_ |
| 22 | `VERIFICATION_LINK_BASE` | adresse | send-investor-verification _(1)_ |

## Lecture

- **`SUPABASE_SERVICE_ROLE_KEY` et `SUPABASE_URL` sont lus par 21 et 22 des 24
  fonctions.** La clé `service_role` contourne toute politique RLS : c'est la
  variable dont la fuite coûterait le plus cher, et c'est aussi la plus
  répandue. Constat, pas verdict.
- La famille `INFOMANIAK_SMTP_*` et `MAIL_FROM_*` est lue par les six fonctions
  qui envoient du courriel, toujours par le même helper.
- `IDN_OS_PUSH_LIVE` et `IDN_OS_WEBHOOK_ENABLED` ne sont pas des secrets mais des
  **drapeaux d'activation** — ils décident si un flux vers IDN OS part ou non.
  Ils sont listés parce qu'ils sont lus au même endroit et par le même
  mécanisme ; la nuit ne les touche pas.
- Aucun nom relevé ne ressemble à une valeur codée en dur : les 22 passent tous
  par la lecture d'environnement.

## Filet local

```
$ node scripts/checkRoutesConcordance.mjs
[concordance] 0 incoherence(s) bloquante(s), 0 absence(s) signalee(s).
$ echo $?
0
```

Aucun fichier de rendu n'a été touché : ni build ni prérendu requis.
