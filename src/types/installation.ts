export interface InstallationContentVille {
  ville_slug: string;
  cabinet_details_md: string | null;
  quartier_md: string | null;
  acces_md: string | null;
}

export interface InstallationContentProfession {
  profession_slug: string;
  enjeux_md: string | null;
  patientele_md: string | null;
  pourquoi_idn_md: string | null;
}

export interface InstallationContentCommon {
  content_key: string;
  content_md: string;
  titre_section: string;
  ordre: number;
  actif: boolean;
}