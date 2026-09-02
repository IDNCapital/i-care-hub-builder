ALTER TABLE public.demandes_installation
  ADD COLUMN IF NOT EXISTS notified_at timestamptz,
  ADD COLUMN IF NOT EXISTS ack_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_send_error text;

NOTIFY pgrst, 'reload schema';