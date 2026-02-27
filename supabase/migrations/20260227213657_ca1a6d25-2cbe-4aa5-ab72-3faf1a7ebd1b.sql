
CREATE TABLE public.contact_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  type text NOT NULL,
  firstname text,
  lastname text,
  full_name text,
  email text NOT NULL,
  phone text,
  organization text,
  city text,
  message text NOT NULL,
  language text NOT NULL DEFAULT 'fr',
  source_url text NOT NULL,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  extra_data jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new',
  last_email_sent_at timestamp with time zone,
  email_send_error text,
  consent boolean NOT NULL DEFAULT false,
  consent_at timestamp with time zone
);

ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact lead with valid data"
  ON public.contact_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    type IS NOT NULL AND length(type) <= 50
    AND email IS NOT NULL AND length(trim(email)) > 0 AND length(email) <= 255
    AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
    AND message IS NOT NULL AND length(trim(message)) > 0 AND length(message) <= 5000
    AND language IS NOT NULL AND language IN ('fr', 'en')
    AND source_url IS NOT NULL AND length(source_url) <= 500
    AND consent = true
    AND (firstname IS NULL OR length(firstname) <= 100)
    AND (lastname IS NULL OR length(lastname) <= 100)
    AND (full_name IS NULL OR length(full_name) <= 200)
    AND (phone IS NULL OR length(phone) <= 30)
    AND (organization IS NULL OR length(organization) <= 200)
    AND (city IS NULL OR length(city) <= 100)
  );
