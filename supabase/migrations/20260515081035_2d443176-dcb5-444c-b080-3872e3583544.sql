
ALTER TABLE public.praticiens
  ADD COLUMN IF NOT EXISTS publics_derives text[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.taxonomy_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  term_normalized text NOT NULL,
  dimension text NOT NULL CHECK (dimension IN ('specialite', 'problematique', 'public')),
  occurrences int NOT NULL DEFAULT 1,
  praticiens_ids uuid[] NOT NULL DEFAULT '{}',
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','integrated','synonym','ignored')),
  resolution_action text,
  resolution_canonical text,
  resolution_group text,
  resolved_at timestamptz,
  resolved_by text,
  UNIQUE (term_normalized, dimension)
);

CREATE INDEX IF NOT EXISTS idx_taxonomy_candidates_status ON public.taxonomy_candidates(status);
CREATE INDEX IF NOT EXISTS idx_taxonomy_candidates_occurrences ON public.taxonomy_candidates(occurrences DESC) WHERE status = 'pending';

ALTER TABLE public.taxonomy_candidates ENABLE ROW LEVEL SECURITY;
-- No public policies: only service_role (which bypasses RLS) can read/write.

CREATE OR REPLACE FUNCTION public.upsert_taxonomy_candidate(
  p_term text,
  p_term_normalized text,
  p_dimension text,
  p_praticien_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.taxonomy_candidates (term, term_normalized, dimension, praticiens_ids)
  VALUES (p_term, p_term_normalized, p_dimension, ARRAY[p_praticien_id])
  ON CONFLICT (term_normalized, dimension)
  DO UPDATE SET
    occurrences = public.taxonomy_candidates.occurrences + 1,
    praticiens_ids = (
      SELECT ARRAY(SELECT DISTINCT unnest(public.taxonomy_candidates.praticiens_ids || ARRAY[p_praticien_id]))
    ),
    last_seen_at = now()
  WHERE public.taxonomy_candidates.status = 'pending';
END;
$$;
