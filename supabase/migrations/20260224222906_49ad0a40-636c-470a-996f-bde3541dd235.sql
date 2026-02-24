
-- Create lead status enum
CREATE TYPE public.investor_lead_status AS ENUM ('new', 'contacted', 'qualified', 'not_interested');

-- Create investor_leads table
CREATE TABLE public.investor_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  profile_type TEXT NOT NULL,
  ticket_range TEXT NOT NULL,
  area_interest TEXT,
  message TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  consent_at TIMESTAMP WITH TIME ZONE,
  source_page TEXT NOT NULL DEFAULT '/investissement',
  status investor_lead_status NOT NULL DEFAULT 'new',
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  notes_internal TEXT
);

-- Create unique index on email
CREATE UNIQUE INDEX idx_investor_leads_email ON public.investor_leads (email);

-- Enable RLS
ALTER TABLE public.investor_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public form submission)
CREATE POLICY "Anyone can submit investor interest"
  ON public.investor_leads
  FOR INSERT
  WITH CHECK (true);
