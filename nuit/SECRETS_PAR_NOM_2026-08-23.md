# Secrets references par les Edge Functions, PAR NOM · i-care-hub-builder · 2026-08-23

Mission de nuit XS, priorite 3. **Lecture seule. Aucune valeur n'apparait dans
ce fichier, ni dans aucune sortie de commande citee : les commandes ci-dessous
ne lisent que du code source, jamais un environnement.** Rollback : aucun.

## Perimetre, hypothese verifiee

La file annonce « les 24 Edge Functions ». Chiffre VERIFIE :

    ls supabase/functions | wc -l          -> 25
    ls -d supabase/functions/*/ | wc -l    -> 25

Vingt-cinq entrees, dont `_shared/`, qui est un repertoire de code commun et non
une fonction : **24 Edge Functions**, exactement le chiffre annonce. `_shared/`
ne reference d'ailleurs aucun secret.

## Le piege du grep naif, et pourquoi il compte

Un balayage sur le seul motif `Deno.env.get("NOM")` rend **15 noms**. Il en
**manque 7**, et pas les moins sensibles : six fonctions passent par un helper
local `requireEnv(name: string)` qui appelle `Deno.env.get(name)` sur une
VARIABLE. Le nom du secret n'apparait alors qu'au site d'appel du helper.

    grep -rhoE 'Deno\.env\.get\(\s*["'"'"'][A-Za-z0-9_]+["'"'"']' supabase/functions | wc -l
    grep -rnE 'function requireEnv' supabase/functions

Les sept noms que le grep naif ne voit pas : `INFOMANIAK_SMTP_HOST`,
`INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `INFOMANIAK_SMTP_PASS`,
`MAIL_FROM_NAME`, `MAIL_FROM_EMAIL`, `VERIFICATION_LINK_BASE`. Toute la chaine
courrier sortante tient dans cet angle mort.

**Commande retenue**, qui couvre les deux formes :

    grep -rhoE '(Deno\.env\.get|requireEnv)\(\s*["'"'"'][A-Za-z0-9_]+["'"'"']' supabase/functions \
      | sed -E 's/.*["'"'"']([A-Za-z0-9_]+)["'"'"']/\1/' | sort -u

Elle ne capture qu'un identifiant en majuscules entre guillemets : par
construction, elle ne peut pas rendre une valeur.

**Reserve, dite plutot que tue** : cette commande ne verrait pas un nom
construit dynamiquement (concatenation, gabarit). Aucun n'a ete trouve ici, et
`Deno.env.toObject()` n'apparait nulle part, mais l'absence est constatee sur ce
commit, pas garantie pour demain.

## Inventaire par fonction

| Edge Function | Nombre | Noms references | dont indirects (via `requireEnv`) |
|---|---|---|---|
| `admin-delete-praticien` | 3 | `ADMIN_SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `admin-get-audit-log` | 3 | `ADMIN_SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `admin-list-demandes` | 3 | `ADMIN_SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `admin-list-demandes-installation` | 3 | `ADMIN_SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `admin-list-praticiens` | 3 | `ADMIN_SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `admin-logout` | 0 | _aucun_ | — |
| `admin-reextract-tags` | 3 | `ADMIN_SESSION_SECRET`, `CRON_TOKEN`, `SUPABASE_URL` | — |
| `admin-update-demande` | 3 | `ADMIN_SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `admin-update-demande-installation` | 3 | `ADMIN_SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `admin-upload-praticien-photo` | 3 | `ADMIN_SESSION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `admin-upsert-praticien` | 4 | `ADMIN_SESSION_SECRET`, `CRON_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `bootstrap-cabinets-place-ids` | 5 | `ADMIN_SESSION_SECRET`, `CRON_TOKEN`, `GOOGLE_PLACES_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `bootstrap-praticiens` | 4 | `BOOTSTRAP_TOKEN`, `GOOGLE_PLACES_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `check-admin-password` | 2 | `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | — |
| `check-investor-access` | 2 | `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `extract-praticien-tags` | 4 | `CRON_TOKEN`, `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `receive-praticien-update-from-idnos` | 4 | `IDN_OS_PUSH_LIVE`, `IDN_OS_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `refresh-google-reviews` | 5 | `ADMIN_SESSION_SECRET`, `CRON_TOKEN`, `GOOGLE_PLACES_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | — |
| `send-contact-lead` | 11 | `IDN_OS_WEBHOOK_ENABLED`, `IDN_OS_WEBHOOK_SECRET`, `IDN_OS_WEBHOOK_URL`, `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` |
| `send-investor-verification` | 12 | `IDN_OS_WEBHOOK_ENABLED`, `IDN_OS_WEBHOOK_SECRET`, `IDN_OS_WEBHOOK_URL`, `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `VERIFICATION_LINK_BASE` | `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `VERIFICATION_LINK_BASE` |
| `send-practitioner-lead` | 11 | `IDN_OS_WEBHOOK_ENABLED`, `IDN_OS_WEBHOOK_SECRET`, `IDN_OS_WEBHOOK_URL`, `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` |
| `submit-demande-conciergerie` | 14 | `CONCIERGERIE_WEBHOOK_URL`, `IDN_OS_WEBHOOK_ENABLED`, `IDN_OS_WEBHOOK_SECRET`, `IDN_OS_WEBHOOK_URL`, `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `INTERNAL_NOTIFICATION_EMAIL`, `IP_HASH_SALT`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` |
| `submit-demande-installation` | 10 | `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `INTERNAL_NOTIFICATION_EMAIL`, `IP_HASH_SALT`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `IP_HASH_SALT`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` |
| `verify-investor-token` | 8 | `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` | `INFOMANIAK_SMTP_HOST`, `INFOMANIAK_SMTP_PASS`, `INFOMANIAK_SMTP_PORT`, `INFOMANIAK_SMTP_USER`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME` |

## Inventaire par nom

**22 noms distincts.**

| Nom du secret | Fonctions | Lesquelles |
|---|---|---|
| `ADMIN_PASSWORD` | 1 | `check-admin-password` |
| `ADMIN_SESSION_SECRET` | 13 | `admin-delete-praticien`, `admin-get-audit-log`, `admin-list-demandes`, `admin-list-demandes-installation`, `admin-list-praticiens`, `admin-reextract-tags`, `admin-update-demande`, `admin-update-demande-installation`, `admin-upload-praticien-photo`, `admin-upsert-praticien`, `bootstrap-cabinets-place-ids`, `check-admin-password`, `refresh-google-reviews` |
| `BOOTSTRAP_TOKEN` | 1 | `bootstrap-praticiens` |
| `CONCIERGERIE_WEBHOOK_URL` | 1 | `submit-demande-conciergerie` |
| `CRON_TOKEN` | 5 | `admin-reextract-tags`, `admin-upsert-praticien`, `bootstrap-cabinets-place-ids`, `extract-praticien-tags`, `refresh-google-reviews` |
| `GOOGLE_PLACES_API_KEY` | 3 | `bootstrap-cabinets-place-ids`, `bootstrap-praticiens`, `refresh-google-reviews` |
| `IDN_OS_PUSH_LIVE` | 1 | `receive-praticien-update-from-idnos` |
| `IDN_OS_WEBHOOK_ENABLED` | 4 | `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie` |
| `IDN_OS_WEBHOOK_SECRET` | 5 | `receive-praticien-update-from-idnos`, `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie` |
| `IDN_OS_WEBHOOK_URL` | 4 | `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie` |
| `INFOMANIAK_SMTP_HOST` | 6 | `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie`, `submit-demande-installation`, `verify-investor-token` |
| `INFOMANIAK_SMTP_PASS` | 6 | `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie`, `submit-demande-installation`, `verify-investor-token` |
| `INFOMANIAK_SMTP_PORT` | 6 | `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie`, `submit-demande-installation`, `verify-investor-token` |
| `INFOMANIAK_SMTP_USER` | 6 | `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie`, `submit-demande-installation`, `verify-investor-token` |
| `INTERNAL_NOTIFICATION_EMAIL` | 2 | `submit-demande-conciergerie`, `submit-demande-installation` |
| `IP_HASH_SALT` | 2 | `submit-demande-conciergerie`, `submit-demande-installation` |
| `MAIL_FROM_EMAIL` | 6 | `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie`, `submit-demande-installation`, `verify-investor-token` |
| `MAIL_FROM_NAME` | 6 | `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie`, `submit-demande-installation`, `verify-investor-token` |
| `OPENAI_API_KEY` | 1 | `extract-praticien-tags` |
| `SUPABASE_SERVICE_ROLE_KEY` | 21 | `admin-delete-praticien`, `admin-get-audit-log`, `admin-list-demandes`, `admin-list-demandes-installation`, `admin-list-praticiens`, `admin-update-demande`, `admin-update-demande-installation`, `admin-upload-praticien-photo`, `admin-upsert-praticien`, `bootstrap-cabinets-place-ids`, `bootstrap-praticiens`, `check-investor-access`, `extract-praticien-tags`, `receive-praticien-update-from-idnos`, `refresh-google-reviews`, `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie`, `submit-demande-installation`, `verify-investor-token` |
| `SUPABASE_URL` | 22 | `admin-delete-praticien`, `admin-get-audit-log`, `admin-list-demandes`, `admin-list-demandes-installation`, `admin-list-praticiens`, `admin-reextract-tags`, `admin-update-demande`, `admin-update-demande-installation`, `admin-upload-praticien-photo`, `admin-upsert-praticien`, `bootstrap-cabinets-place-ids`, `bootstrap-praticiens`, `check-investor-access`, `extract-praticien-tags`, `receive-praticien-update-from-idnos`, `refresh-google-reviews`, `send-contact-lead`, `send-investor-verification`, `send-practitioner-lead`, `submit-demande-conciergerie`, `submit-demande-installation`, `verify-investor-token` |
| `VERIFICATION_LINK_BASE` | 1 | `send-investor-verification` |

## Commandes de verification, rejouables telles quelles

    ls -d supabase/functions/*/ | wc -l
    grep -rhoE '(Deno\.env\.get|requireEnv)\(\s*["'"'"'][A-Za-z0-9_]+["'"'"']' supabase/functions \
      | sed -E 's/.*["'"'"']([A-Za-z0-9_]+)["'"'"']/\1/' | sort -u
    grep -rhoE '(Deno\.env\.get|requireEnv)\(\s*["'"'"'][A-Za-z0-9_]+["'"'"']' supabase/functions \
      | sed -E 's/.*["'"'"']([A-Za-z0-9_]+)["'"'"']/\1/' | sort -u | wc -l
    grep -rn 'Deno.env.toObject' supabase/functions   # aucun resultat attendu

Aucune de ces commandes ne lit une variable d'environnement ; toutes lisent des
fichiers du depot. Le critere d'arret de la mission -- « une valeur apparaitrait
dans une sortie » -- n'a jamais ete approche.
