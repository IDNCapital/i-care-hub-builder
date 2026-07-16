-- Extend event_type CHECK to include 'email_failed' and 'praticien_deleted'
ALTER TABLE public.icare_idnos_audit_log DROP CONSTRAINT event_type_check;
ALTER TABLE public.icare_idnos_audit_log
  ADD CONSTRAINT event_type_check CHECK (event_type = ANY (ARRAY[
    'snapshot','edge_function_modified','rollback',
    'webhook_added','webhook_removed','verification',
    'webhook_sent','webhook_failed','webhook_config_missing',
    'debug_ping','email_failed','praticien_deleted'
  ]));

-- Remove public SELECT policy; reads go through admin Edge Function (service_role)
DROP POLICY IF EXISTS "Audit log publicly readable" ON public.icare_idnos_audit_log;