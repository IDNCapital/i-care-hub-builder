
ALTER TABLE public.icare_idnos_audit_log DROP CONSTRAINT IF EXISTS event_type_check;

ALTER TABLE public.icare_idnos_audit_log ADD CONSTRAINT event_type_check
  CHECK (event_type IN (
    'snapshot',
    'edge_function_modified',
    'rollback',
    'webhook_added',
    'webhook_removed',
    'verification',
    'webhook_sent',
    'webhook_failed',
    'webhook_config_missing',
    'debug_ping'
  ));

COMMENT ON COLUMN public.icare_idnos_audit_log.event_type IS 'Liste des event types autorisés. Pour ajouter une valeur, DROP + RECREATE le constraint.';
