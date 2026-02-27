
CREATE TABLE public.practitioner_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  organisation text,
  website text,
  profession text NOT NULL,
  city text NOT NULL,
  neighbourhood text,
  move_in_date text,
  surface text,
  message text,
  lang text NOT NULL DEFAULT 'fr',
  source_url text,
  consent boolean NOT NULL DEFAULT false,
  consent_at timestamp with time zone,
  status text NOT NULL DEFAULT 'new',
  last_email_sent_at timestamp with time zone,
  notified_at timestamp with time zone
);

ALTER TABLE public.practitioner_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit practitioner lead with valid data"
  ON public.practitioner_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    first_name IS NOT NULL AND length(trim(first_name)) > 0 AND length(first_name) <= 100
    AND last_name IS NOT NULL AND length(trim(last_name)) > 0 AND length(last_name) <= 100
    AND email IS NOT NULL AND length(trim(email)) > 0 AND length(email) <= 255
    AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
    AND phone IS NOT NULL AND length(trim(phone)) > 0 AND length(phone) <= 30
    AND profession IS NOT NULL AND length(profession) <= 100
    AND city IS NOT NULL AND length(trim(city)) > 0 AND length(city) <= 100
    AND consent = true
    AND (organisation IS NULL OR length(organisation) <= 200)
    AND (website IS NULL OR length(website) <= 300)
    AND (neighbourhood IS NULL OR length(neighbourhood) <= 200)
    AND (message IS NULL OR length(message) <= 2000)
  );
