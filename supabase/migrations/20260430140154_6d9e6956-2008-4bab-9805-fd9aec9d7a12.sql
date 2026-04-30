-- Table principale : demandes de conciergerie patients
CREATE TABLE public.demandes_conciergerie (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  message TEXT NOT NULL,
  problematiques_pressenties TEXT[] NOT NULL DEFAULT '{}',
  cabinet_prefere TEXT,
  consentement_rgpd BOOLEAN NOT NULL DEFAULT false,
  source TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  statut TEXT NOT NULL DEFAULT 'a_traiter',
  notes_internes TEXT,
  webhook_status TEXT DEFAULT 'pending',
  webhook_attempts INT NOT NULL DEFAULT 0,
  webhook_last_error TEXT,
  webhook_last_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT demandes_conciergerie_statut_check
    CHECK (statut IN ('a_traiter','en_cours','oriente','ferme')),
  CONSTRAINT demandes_conciergerie_webhook_status_check
    CHECK (webhook_status IS NULL OR webhook_status IN ('pending','ok','failed','skipped'))
);

-- Index utiles pour la vue admin
CREATE INDEX idx_demandes_conciergerie_created_at
  ON public.demandes_conciergerie (created_at DESC);
CREATE INDEX idx_demandes_conciergerie_statut
  ON public.demandes_conciergerie (statut);
CREATE INDEX idx_demandes_conciergerie_ip_hash_created
  ON public.demandes_conciergerie (ip_hash, created_at DESC);

-- Trigger updated_at (réutilise la fonction existante)
CREATE TRIGGER demandes_conciergerie_set_updated_at
  BEFORE UPDATE ON public.demandes_conciergerie
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.demandes_conciergerie ENABLE ROW LEVEL SECURITY;

-- INSERT public (anon + authenticated) avec validation stricte côté DB
-- (l'edge function applique aussi sa propre validation + rate limit IP).
CREATE POLICY "Anyone can submit a conciergerie request with valid data"
ON public.demandes_conciergerie
FOR INSERT
TO anon, authenticated
WITH CHECK (
  prenom IS NOT NULL AND length(trim(prenom)) > 0 AND length(prenom) <= 100
  AND nom IS NOT NULL AND length(trim(nom)) > 0 AND length(nom) <= 100
  AND email IS NOT NULL AND length(trim(email)) > 0 AND length(email) <= 255
  AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  AND message IS NOT NULL AND length(trim(message)) >= 30 AND length(message) <= 5000
  AND consentement_rgpd = true
  AND (telephone IS NULL OR length(telephone) <= 30)
  AND (cabinet_prefere IS NULL OR length(cabinet_prefere) <= 100)
  AND (source IS NULL OR length(source) <= 500)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
  AND (ip_hash IS NULL OR length(ip_hash) <= 128)
  AND (notes_internes IS NULL)            -- public ne peut pas pré-remplir
  AND statut = 'a_traiter'                -- valeur par défaut imposée
  AND coalesce(array_length(problematiques_pressenties, 1), 0) <= 20
);

-- Pas de SELECT/UPDATE/DELETE policy → totalement bloqué pour les clés publiques.
-- L'admin passera obligatoirement par des Edge Functions en service role.
