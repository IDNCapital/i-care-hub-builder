
-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can submit investor interest" ON public.investor_leads;

-- Create a tighter INSERT policy that validates required fields and consent
CREATE POLICY "Anyone can submit investor interest with valid data"
  ON public.investor_leads
  FOR INSERT
  WITH CHECK (
    first_name IS NOT NULL AND length(trim(first_name)) > 0 AND length(first_name) <= 100
    AND last_name IS NOT NULL AND length(trim(last_name)) > 0 AND length(last_name) <= 100
    AND email IS NOT NULL AND length(trim(email)) > 0 AND length(email) <= 255
    AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
    AND profile_type IS NOT NULL AND length(profile_type) <= 100
    AND ticket_range IS NOT NULL AND length(ticket_range) <= 100
    AND consent = true
    AND (phone IS NULL OR length(phone) <= 30)
    AND (message IS NULL OR length(message) <= 2000)
    AND (area_interest IS NULL OR length(area_interest) <= 200)
  );
