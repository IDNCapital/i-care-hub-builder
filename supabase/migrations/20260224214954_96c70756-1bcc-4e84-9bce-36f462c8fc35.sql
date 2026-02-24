-- Create enum for project status
CREATE TYPE public.project_status AS ENUM ('en_exploitation', 'en_travaux', 'a_venir');

-- Create enum for project typology
CREATE TYPE public.project_typology AS ENUM ('cabinet_medical', 'pole_pluridisciplinaire', 'coworking_sante', 'centre_paramedical', 'maison_de_sante');

-- Create projects table
CREATE TABLE public.projets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  show_address BOOLEAN NOT NULL DEFAULT false,
  surface_m2 INTEGER NOT NULL,
  typology public.project_typology NOT NULL,
  status public.project_status NOT NULL DEFAULT 'a_venir',
  delivery_date TEXT,
  units_count INTEGER NOT NULL DEFAULT 1,
  short_description TEXT NOT NULL,
  long_description TEXT,
  hero_image_url TEXT,
  image_gallery TEXT[] DEFAULT '{}',
  key_features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read, no public write)
ALTER TABLE public.projets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are publicly readable"
  ON public.projets FOR SELECT
  USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projets_updated_at
  BEFORE UPDATE ON public.projets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

CREATE POLICY "Project images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');