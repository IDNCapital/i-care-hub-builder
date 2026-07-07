-- Table : demandes d'installation praticiens (pages /sinstaller)
CREATE TABLE public.demandes_installation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profession_slug TEXT NOT NULL,
  ville_slug TEXT,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  message TEXT,
  consentement_rgpd BOOLEAN NOT NULL DEFAULT false,
  statut TEXT NOT NULL DEFAULT 'nouvelle',
  source_path TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  notes_internes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT demandes_installation_statut_check
    CHECK (statut IN ('nouvelle','en_cours','traitee','fermee'))
);

CREATE INDEX idx_demandes_installation_created_at
  ON public.demandes_installation (created_at DESC);
CREATE INDEX idx_demandes_installation_statut
  ON public.demandes_installation (statut);
CREATE INDEX idx_demandes_installation_ip_hash_created
  ON public.demandes_installation (ip_hash, created_at DESC);

CREATE TRIGGER demandes_installation_set_updated_at
  BEFORE UPDATE ON public.demandes_installation
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grants (aligned with existing public tables pattern)
GRANT INSERT ON public.demandes_installation TO anon, authenticated;
GRANT ALL ON public.demandes_installation TO service_role;

-- RLS : mêmes règles que demandes_conciergerie (INSERT public validé, aucun SELECT/UPDATE/DELETE public)
ALTER TABLE public.demandes_installation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an installation request with valid data"
ON public.demandes_installation
FOR INSERT
TO anon, authenticated
WITH CHECK (
  profession_slug IS NOT NULL AND length(trim(profession_slug)) > 0 AND length(profession_slug) <= 100
  AND (ville_slug IS NULL OR length(ville_slug) <= 100)
  AND nom IS NOT NULL AND length(trim(nom)) >= 2 AND length(nom) <= 100
  AND email IS NOT NULL AND length(trim(email)) > 0 AND length(email) <= 255
  AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  AND (telephone IS NULL OR length(telephone) <= 30)
  AND (message IS NULL OR length(message) <= 2000)
  AND consentement_rgpd = true
  AND (source_path IS NULL OR length(source_path) <= 500)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
  AND (ip_hash IS NULL OR length(ip_hash) <= 128)
  AND notes_internes IS NULL
  AND statut = 'nouvelle'
);

-- Aucun SELECT/UPDATE/DELETE policy → tout accès non-INSERT bloqué pour anon/authenticated.
-- L'admin et la lecture passeront par Edge Functions en service_role.