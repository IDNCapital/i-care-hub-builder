# Snapshot pré-I-CA.RE Connect — Mai 2026

**Date du snapshot** : 2026-05-03  
**Auteur** : Lovable (audit automatisé)  
**Objectif** : Documenter l'état des 4 edge functions lead avant ajout des webhooks sortants IDN OS.

---

## 1. submit-demande-conciergerie

| Propriété | Valeur |
|---|---|
| **Fichier** | `supabase/functions/submit-demande-conciergerie/index.ts` |
| **Snapshot** | `docs/icare-connect/snapshots/submit-demande-conciergerie.ts` |
| **Lignes** | 349 |
| **Dépendances** | `@supabase/supabase-js@2.49.1`, `nodemailer@6.9.16` |

### Secrets utilisés
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INFOMANIAK_SMTP_HOST`
- `INFOMANIAK_SMTP_PORT`
- `INFOMANIAK_SMTP_USER`
- `INFOMANIAK_SMTP_PASS`
- `MAIL_FROM_NAME`
- `MAIL_FROM_EMAIL`
- `INTERNAL_NOTIFICATION_EMAIL` (optionnel, fallback sur MAIL_FROM_EMAIL)
- `CONCIERGERIE_WEBHOOK_URL` (optionnel — webhook CRM existant)
- `IP_HASH_SALT` (optionnel, fallback hardcodé)

### Tables Supabase
- **INSERT** : `demandes_conciergerie`
- **SELECT** : `demandes_conciergerie` (rate limit IP)
- **UPDATE** : `demandes_conciergerie` (webhook_status)

### Comportement
1. Honeypot check → faux succès silencieux
2. Validation champs (prénom, nom, email, message ≥30 chars, RGPD)
3. Hash IP (SHA-256 + salt) → rate limit 3/h/IP
4. INSERT dans `demandes_conciergerie` via service role
5. Email 1 → accusé réception au demandeur (charte I-CA.RE)
6. Email 2 → notification équipe interne avec lien admin
7. Webhook CRM optionnel (fire-and-forget, 3 retries exponentiels)
8. Retour HTTP 200 `{ ok: true, id }` ou erreur 4xx/5xx

### Gestion d'erreur
- Erreurs SMTP catchées individuellement (ne bloquent pas la réponse)
- Webhook fire-and-forget avec MAJ `webhook_status` en BDD
- Erreur non gérée → 500 `internal_error`

---

## 2. send-contact-lead

| Propriété | Valeur |
|---|---|
| **Fichier** | `supabase/functions/send-contact-lead/index.ts` |
| **Snapshot** | `docs/icare-connect/snapshots/send-contact-lead.ts` |
| **Lignes** | 280 |
| **Dépendances** | `@supabase/supabase-js@2.49.1`, `nodemailer@6.9.16` |

### Secrets utilisés
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INFOMANIAK_SMTP_HOST`
- `INFOMANIAK_SMTP_PORT`
- `INFOMANIAK_SMTP_USER`
- `INFOMANIAK_SMTP_PASS`
- `MAIL_FROM_NAME`
- `MAIL_FROM_EMAIL`

### Tables Supabase
- **INSERT** : `contact_leads`
- **SELECT** : `contact_leads` (rate limit email)
- **UPDATE** : `contact_leads` (email_send_error)

### Comportement
1. Honeypot check
2. Validation type (praticien/collectivite/investisseur/cabinet_request/contact_general)
3. Validation email, message, language, source_url
4. Rate limit : 1 par 30s par email
5. INSERT dans `contact_leads` via service role
6. Email 1 → notification interne + CC n.idelot@idn-capital.fr
7. Email 2 → accusé réception bilingue (FR/EN)
8. Retour HTTP 200 `{ status: "ok", lead_id }`

### Gestion d'erreur
- Erreurs SMTP catchées → MAJ `email_send_error` en BDD
- Erreur non gérée → 500 `internal_error`

---

## 3. send-practitioner-lead

| Propriété | Valeur |
|---|---|
| **Fichier** | `supabase/functions/send-practitioner-lead/index.ts` |
| **Snapshot** | `docs/icare-connect/snapshots/send-practitioner-lead.ts` |
| **Lignes** | ~210 |
| **Dépendances** | `@supabase/supabase-js@2.49.1`, `nodemailer@6.9.16` |

### Secrets utilisés
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INFOMANIAK_SMTP_HOST`
- `INFOMANIAK_SMTP_PORT`
- `INFOMANIAK_SMTP_USER`
- `INFOMANIAK_SMTP_PASS`
- `MAIL_FROM_NAME`
- `MAIL_FROM_EMAIL`

### Tables Supabase
- **INSERT** : `practitioner_leads`
- **SELECT** : `practitioner_leads` (rate limit email)

### Comportement
1. Honeypot check
2. Validation champs (prénom, nom, email, téléphone, profession, ville)
3. Rate limit : 1 par 60s par email
4. INSERT dans `practitioner_leads` via service role
5. Email 1 → notification interne (contact@i-ca.re)
6. Email 2 → accusé réception bilingue (FR/EN)
7. Retour HTTP 200 `{ status: "ok" }`

### Gestion d'erreur
- Erreur insert → throw → 500
- Erreurs SMTP non catchées individuellement (throw global)

---

## 4. send-investor-verification

| Propriété | Valeur |
|---|---|
| **Fichier** | `supabase/functions/send-investor-verification/index.ts` |
| **Snapshot** | `docs/icare-connect/snapshots/send-investor-verification.ts` |
| **Lignes** | ~210 |
| **Dépendances** | `@supabase/supabase-js@2.49.1`, `nodemailer@6.9.16` |

### Secrets utilisés
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INFOMANIAK_SMTP_HOST`
- `INFOMANIAK_SMTP_PORT`
- `INFOMANIAK_SMTP_USER`
- `INFOMANIAK_SMTP_PASS`
- `MAIL_FROM_NAME`
- `MAIL_FROM_EMAIL`
- `VERIFICATION_LINK_BASE`

### Tables Supabase
- **INSERT** : `investor_leads`
- **SELECT** : `investor_leads` (check existing lead)
- **UPDATE** : `investor_leads` (verification token, access token)

### Comportement
1. Validation champs (first_name, last_name, email, profile_type, ticket_range)
2. Check si lead existant → rate limit 1 email / 60s
3. Si déjà vérifié → génère nouveau access_token → retour `already_verified`
4. Sinon → génère verification_token (UUID) + hash SHA-256
5. Upsert dans `investor_leads`
6. Email → lien de vérification bilingue (FR/EN) valide 24h
7. Retour HTTP 200 `{ status: "verification_sent" }`

### Gestion d'erreur
- Race condition insert (23505) → re-fetch + update
- Erreur non gérée → 500 `Internal server error`

---

## 5. Métriques d'invocation (30 derniers jours)

> ⚠️ Les logs analytiques Supabase (function_edge_logs) ne retournent aucune donnée sur la période demandée.  
> Les métriques d'invocation et taux d'échec ne sont pas disponibles via l'API analytics.  
> Pour des données précises, consulter le tableau de bord Lovable Cloud → Edge Functions.

---

## 6. Backup Supabase

> ⚠️ Le timestamp du dernier backup automatique Supabase n'est pas accessible programmatiquement depuis l'API disponible.  
> **Action requise** : Vérifier dans Lovable Cloud que le dernier backup date de moins de 24h avant de poursuivre le sprint IC-05.  
> Le numéro de release Supabase n'est pas exposé via les outils disponibles.

---

## 7. Fichiers de snapshot

| Fichier | Chemin |
|---|---|
| submit-demande-conciergerie | `docs/icare-connect/snapshots/submit-demande-conciergerie.ts` |
| send-contact-lead | `docs/icare-connect/snapshots/send-contact-lead.ts` |
| send-practitioner-lead | `docs/icare-connect/snapshots/send-practitioner-lead.ts` |
| send-investor-verification | `docs/icare-connect/snapshots/send-investor-verification.ts` |

---

## 8. Table d'audit

Table `icare_idnos_audit_log` créée dans Supabase I-CA.RE.  
Première ligne insérée : `event_type = 'snapshot'`, date 2026-05-03.

---

**✅ Snapshot pre-I-CA.RE Connect terminé. Le projet I-CA.RE est prêt pour IC-05. Rollback possible en revert du commit ci-dessus.**