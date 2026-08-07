ALTER TABLE public.professions
  ADD COLUMN IF NOT EXISTS page_installation boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.professions.page_installation IS
  'commande la génération de la page /sinstaller/[profession]/[ville] et son entrée au sitemap ; une profession peut être actif=true sans page dédiée, elle reste alors proposée dans les formulaires de candidature';

UPDATE public.professions SET page_installation = true;

NOTIFY pgrst, 'reload schema';