-- Table for practitioner referral declarations
CREATE TABLE public.declarations_parrainage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parrain_nom text NOT NULL,
  parrain_email text NOT NULL,
  parrain_cabinet_slug text,
  filleul_nom text NOT NULL,
  filleul_profession text NOT NULL,
  filleul_email text,
  filleul_telephone text,
  contexte text,
  statut text NOT NULL DEFAULT 'declare',
  consentement_rgpd boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.declarations_parrainage ENABLE ROW LEVEL SECURITY;

-- Public can submit referrals with valid data (mirrors validation rules of the form)
CREATE POLICY "Anyone can submit referral with valid data"
ON public.declarations_parrainage
FOR INSERT
TO anon, authenticated
WITH CHECK (
  parrain_nom IS NOT NULL
  AND length(trim(parrain_nom)) > 0
  AND length(parrain_nom) <= 200
  AND parrain_email IS NOT NULL
  AND length(trim(parrain_email)) > 0
  AND length(parrain_email) <= 255
  AND parrain_email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  AND filleul_nom IS NOT NULL
  AND length(trim(filleul_nom)) > 0
  AND length(filleul_nom) <= 200
  AND filleul_profession IS NOT NULL
  AND length(trim(filleul_profession)) > 0
  AND length(filleul_profession) <= 100
  AND (parrain_cabinet_slug IS NULL OR length(parrain_cabinet_slug) <= 100)
  AND (filleul_email IS NULL OR (length(filleul_email) <= 255 AND filleul_email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'))
  AND (filleul_telephone IS NULL OR length(filleul_telephone) <= 30)
  AND (contexte IS NULL OR length(contexte) <= 500)
  AND (statut IS NULL OR statut IN ('declare','contacte','visite_planifiee','bail_signe','recompense_activee','abandon'))
  AND consentement_rgpd = true
);

-- No SELECT/UPDATE/DELETE policies = admin-only via Supabase Table Editor
