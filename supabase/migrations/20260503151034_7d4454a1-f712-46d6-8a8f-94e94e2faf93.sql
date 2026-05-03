
CREATE TABLE public.praticien_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  praticien_id UUID NOT NULL REFERENCES public.praticiens(id) ON DELETE CASCADE,
  modified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  modified_by_external TEXT NOT NULL DEFAULT 'idn_os',
  changes JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.praticien_revisions ENABLE ROW LEVEL SECURITY;

-- No public policies — only service_role inserts via edge function
COMMENT ON TABLE public.praticien_revisions IS 'Audit log of practitioner profile changes pushed from IDN OS (IC-06).';
