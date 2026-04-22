-- Normalize Nansouty street address: 106b -> 106 bis (AFNOR NF Z 10-011)
UPDATE public.projets
SET address = '106 bis rue Bertrand de Goth, 33800 Bordeaux',
    updated_at = now()
WHERE slug = 'i-ca-re-nansouty';
