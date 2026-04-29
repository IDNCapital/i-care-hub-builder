ALTER TABLE public.avis_google_cache
  ADD CONSTRAINT avis_google_cache_place_id_key UNIQUE (place_id);