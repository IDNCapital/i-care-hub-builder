CREATE TABLE public.icare_idnos_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL CHECK (event_type IN ('snapshot', 'edge_function_modified', 'rollback', 'webhook_added', 'webhook_removed', 'verification')),
  function_name TEXT,
  description TEXT NOT NULL,
  triggered_by TEXT,
  payload_json JSONB
);

ALTER TABLE public.icare_idnos_audit_log ENABLE ROW LEVEL SECURITY;

-- No public access at all. Admin operations use service role (bypasses RLS).