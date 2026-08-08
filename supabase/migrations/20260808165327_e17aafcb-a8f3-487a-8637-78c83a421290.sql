UPDATE public.installation_content_ville SET acces_md = replace(acces_md, 'Jean Jaurès ' || chr(8212) || ' qui croise les lignes A et B ' || chr(8212) || ' est', 'Jean Jaurès, qui croise les lignes A et B, est') WHERE ville_slug = 'toulouse-capitole';

UPDATE public.installation_content_ville SET acces_md = replace(acces_md, 'rive droite ' || chr(8212) || ' l''option tram', 'rive droite, l''option tram') WHERE ville_slug = 'floirac';

UPDATE public.installation_content_ville SET quartier_md = replace(quartier_md, 'rattachent ' || chr(8212) || ' Notre Dame, Rode, Borie ' || chr(8212) || ' se succèdent', 'rattachent (Notre Dame, Rode, Borie) se succèdent') WHERE ville_slug = 'bordeaux-chartrons';

UPDATE public.installation_content_ville SET quartier_md = replace(quartier_md, 'ombragées ' || chr(8212) || ' la place du Président Wilson, la rue Saint Rome, la rue d''Alsace Lorraine ' || chr(8212) || ' concentre', 'ombragées (la place du Président Wilson, la rue Saint Rome, la rue d''Alsace Lorraine) concentre') WHERE ville_slug = 'toulouse-capitole';

UPDATE public.installation_content_ville SET quartier_md = replace(quartier_md, '24 heures sur 24 ' || chr(8212) || ' devenant', '24 heures sur 24, devenant') WHERE ville_slug = 'floirac';

UPDATE public.installation_content_ville SET cabinet_details_md = replace(cabinet_details_md, 'détaillées ' || chr(8212) || ' loyer par cabinet, modalités de location, planning précis de livraison par lot ' || chr(8212) || ' sont', 'détaillées (loyer par cabinet, modalités de location, planning précis de livraison par lot) sont') WHERE ville_slug = 'floirac';

UPDATE public.installation_content_ville SET cabinet_details_md = replace(cabinet_details_md, 'détaillées ' || chr(8212) || ' loyer par cabinet, modalités de location ' || chr(8212) || ' sont', 'détaillées (loyer par cabinet, modalités de location) sont') WHERE ville_slug = 'lormont';

UPDATE public.installation_content_common SET content_md = replace(content_md, 'est organisée ' || chr(8212) || ' sur place', 'est organisée : sur place') WHERE content_key = 'comment_sinstaller';