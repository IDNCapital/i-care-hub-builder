
ALTER FUNCTION public.set_praticien_slug() SECURITY INVOKER;
REVOKE EXECUTE ON FUNCTION public.set_praticien_slug() FROM PUBLIC, anon, authenticated;
