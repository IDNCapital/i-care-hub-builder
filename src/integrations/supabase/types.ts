export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          chapo: string
          contenu: string
          created_at: string
          id: string
          meta_description: string | null
          meta_title: string | null
          problematiques_associees: string[]
          published_at: string | null
          slug: string
          statut: string
          titre: string
          updated_at: string
        }
        Insert: {
          chapo: string
          contenu: string
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          problematiques_associees?: string[]
          published_at?: string | null
          slug: string
          statut?: string
          titre: string
          updated_at?: string
        }
        Update: {
          chapo?: string
          contenu?: string
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          problematiques_associees?: string[]
          published_at?: string | null
          slug?: string
          statut?: string
          titre?: string
          updated_at?: string
        }
        Relationships: []
      }
      avis_google_cache: {
        Row: {
          google_display_name: string | null
          google_url: string | null
          last_error: string | null
          last_error_at: string | null
          last_updated_at: string
          place_id: string
          rating: number | null
          reviews: Json
          user_ratings_total: number | null
        }
        Insert: {
          google_display_name?: string | null
          google_url?: string | null
          last_error?: string | null
          last_error_at?: string | null
          last_updated_at?: string
          place_id: string
          rating?: number | null
          reviews?: Json
          user_ratings_total?: number | null
        }
        Update: {
          google_display_name?: string | null
          google_url?: string | null
          last_error?: string | null
          last_error_at?: string | null
          last_updated_at?: string
          place_id?: string
          rating?: number | null
          reviews?: Json
          user_ratings_total?: number | null
        }
        Relationships: []
      }
      avis_google_mis_en_avant: {
        Row: {
          actif: boolean
          auteur_initiale_nom: string | null
          auteur_prenom: string
          cabinet_nom_affichage: string
          cabinet_slug: string
          created_at: string
          date_publication: string
          id: string
          lien_avis_google: string | null
          lien_fiche_gbp: string | null
          note: number
          ordre_affichage: number
          texte_avis: string
        }
        Insert: {
          actif?: boolean
          auteur_initiale_nom?: string | null
          auteur_prenom: string
          cabinet_nom_affichage: string
          cabinet_slug: string
          created_at?: string
          date_publication: string
          id?: string
          lien_avis_google?: string | null
          lien_fiche_gbp?: string | null
          note?: number
          ordre_affichage?: number
          texte_avis: string
        }
        Update: {
          actif?: boolean
          auteur_initiale_nom?: string | null
          auteur_prenom?: string
          cabinet_nom_affichage?: string
          cabinet_slug?: string
          created_at?: string
          date_publication?: string
          id?: string
          lien_avis_google?: string | null
          lien_fiche_gbp?: string | null
          note?: number
          ordre_affichage?: number
          texte_avis?: string
        }
        Relationships: []
      }
      contact_leads: {
        Row: {
          city: string | null
          consent: boolean
          consent_at: string | null
          created_at: string
          email: string
          email_send_error: string | null
          extra_data: Json | null
          firstname: string | null
          full_name: string | null
          id: string
          language: string
          last_email_sent_at: string | null
          lastname: string | null
          message: string
          organization: string | null
          phone: string | null
          source_url: string
          status: string
          type: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          city?: string | null
          consent?: boolean
          consent_at?: string | null
          created_at?: string
          email: string
          email_send_error?: string | null
          extra_data?: Json | null
          firstname?: string | null
          full_name?: string | null
          id?: string
          language?: string
          last_email_sent_at?: string | null
          lastname?: string | null
          message: string
          organization?: string | null
          phone?: string | null
          source_url: string
          status?: string
          type: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          city?: string | null
          consent?: boolean
          consent_at?: string | null
          created_at?: string
          email?: string
          email_send_error?: string | null
          extra_data?: Json | null
          firstname?: string | null
          full_name?: string | null
          id?: string
          language?: string
          last_email_sent_at?: string | null
          lastname?: string | null
          message?: string
          organization?: string | null
          phone?: string | null
          source_url?: string
          status?: string
          type?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      declarations_parrainage: {
        Row: {
          consentement_rgpd: boolean
          contexte: string | null
          created_at: string
          filleul_email: string | null
          filleul_nom: string
          filleul_profession: string
          filleul_telephone: string | null
          id: string
          parrain_cabinet_slug: string | null
          parrain_email: string
          parrain_nom: string
          statut: string
        }
        Insert: {
          consentement_rgpd?: boolean
          contexte?: string | null
          created_at?: string
          filleul_email?: string | null
          filleul_nom: string
          filleul_profession: string
          filleul_telephone?: string | null
          id?: string
          parrain_cabinet_slug?: string | null
          parrain_email: string
          parrain_nom: string
          statut?: string
        }
        Update: {
          consentement_rgpd?: boolean
          contexte?: string | null
          created_at?: string
          filleul_email?: string | null
          filleul_nom?: string
          filleul_profession?: string
          filleul_telephone?: string | null
          id?: string
          parrain_cabinet_slug?: string | null
          parrain_email?: string
          parrain_nom?: string
          statut?: string
        }
        Relationships: []
      }
      demandes_conciergerie: {
        Row: {
          cabinet_prefere: string | null
          consentement_rgpd: boolean
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          message: string
          nom: string
          notes_internes: string | null
          prenom: string
          problematiques_pressenties: string[]
          source: string | null
          statut: string
          telephone: string | null
          updated_at: string
          user_agent: string | null
          webhook_attempts: number
          webhook_last_attempt_at: string | null
          webhook_last_error: string | null
          webhook_status: string | null
        }
        Insert: {
          cabinet_prefere?: string | null
          consentement_rgpd?: boolean
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          message: string
          nom: string
          notes_internes?: string | null
          prenom: string
          problematiques_pressenties?: string[]
          source?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_agent?: string | null
          webhook_attempts?: number
          webhook_last_attempt_at?: string | null
          webhook_last_error?: string | null
          webhook_status?: string | null
        }
        Update: {
          cabinet_prefere?: string | null
          consentement_rgpd?: boolean
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          message?: string
          nom?: string
          notes_internes?: string | null
          prenom?: string
          problematiques_pressenties?: string[]
          source?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_agent?: string | null
          webhook_attempts?: number
          webhook_last_attempt_at?: string | null
          webhook_last_error?: string | null
          webhook_status?: string | null
        }
        Relationships: []
      }
      demandes_installation: {
        Row: {
          consentement_rgpd: boolean
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          message: string | null
          nom: string
          notes_internes: string | null
          profession_slug: string
          source_path: string | null
          statut: string
          telephone: string | null
          updated_at: string
          user_agent: string | null
          ville_slug: string | null
        }
        Insert: {
          consentement_rgpd?: boolean
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          message?: string | null
          nom: string
          notes_internes?: string | null
          profession_slug: string
          source_path?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_agent?: string | null
          ville_slug?: string | null
        }
        Update: {
          consentement_rgpd?: boolean
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          message?: string | null
          nom?: string
          notes_internes?: string | null
          profession_slug?: string
          source_path?: string | null
          statut?: string
          telephone?: string | null
          updated_at?: string
          user_agent?: string | null
          ville_slug?: string | null
        }
        Relationships: []
      }
      icare_idnos_audit_log: {
        Row: {
          created_at: string
          description: string
          event_type: string
          function_name: string | null
          id: string
          payload_json: Json | null
          triggered_by: string | null
        }
        Insert: {
          created_at?: string
          description: string
          event_type: string
          function_name?: string | null
          id?: string
          payload_json?: Json | null
          triggered_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          event_type?: string
          function_name?: string | null
          id?: string
          payload_json?: Json | null
          triggered_by?: string | null
        }
        Relationships: []
      }
      installation_content_common: {
        Row: {
          actif: boolean
          content_key: string
          content_md: string
          created_at: string
          ordre: number
          titre_section: string
          updated_at: string
        }
        Insert: {
          actif?: boolean
          content_key: string
          content_md: string
          created_at?: string
          ordre?: number
          titre_section: string
          updated_at?: string
        }
        Update: {
          actif?: boolean
          content_key?: string
          content_md?: string
          created_at?: string
          ordre?: number
          titre_section?: string
          updated_at?: string
        }
        Relationships: []
      }
      installation_content_profession: {
        Row: {
          created_at: string
          enjeux_md: string | null
          patientele_md: string | null
          pourquoi_idn_md: string | null
          profession_slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enjeux_md?: string | null
          patientele_md?: string | null
          pourquoi_idn_md?: string | null
          profession_slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enjeux_md?: string | null
          patientele_md?: string | null
          pourquoi_idn_md?: string | null
          profession_slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "installation_content_profession_profession_slug_fkey"
            columns: ["profession_slug"]
            isOneToOne: true
            referencedRelation: "installation_pages"
            referencedColumns: ["profession_slug"]
          },
          {
            foreignKeyName: "installation_content_profession_profession_slug_fkey"
            columns: ["profession_slug"]
            isOneToOne: true
            referencedRelation: "professions"
            referencedColumns: ["slug"]
          },
        ]
      }
      installation_content_ville: {
        Row: {
          acces_md: string | null
          cabinet_details_md: string | null
          created_at: string
          quartier_md: string | null
          updated_at: string
          ville_slug: string
        }
        Insert: {
          acces_md?: string | null
          cabinet_details_md?: string | null
          created_at?: string
          quartier_md?: string | null
          updated_at?: string
          ville_slug: string
        }
        Update: {
          acces_md?: string | null
          cabinet_details_md?: string | null
          created_at?: string
          quartier_md?: string | null
          updated_at?: string
          ville_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "installation_content_ville_ville_slug_fkey"
            columns: ["ville_slug"]
            isOneToOne: true
            referencedRelation: "installation_pages"
            referencedColumns: ["ville_slug"]
          },
          {
            foreignKeyName: "installation_content_ville_ville_slug_fkey"
            columns: ["ville_slug"]
            isOneToOne: true
            referencedRelation: "projets"
            referencedColumns: ["slug_installation"]
          },
        ]
      }
      investor_leads: {
        Row: {
          access_token_expires_at: string | null
          access_token_hash: string | null
          area_interest: string | null
          consent: boolean
          consent_at: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_contacted_at: string | null
          last_email_sent_at: string | null
          last_name: string
          message: string | null
          notes_internal: string | null
          notified_at: string | null
          phone: string | null
          profile_type: string
          source_page: string
          status: Database["public"]["Enums"]["investor_lead_status"]
          ticket_range: string
          verification_expires_at: string | null
          verification_sent_at: string | null
          verification_token_hash: string | null
          verified_at: string | null
        }
        Insert: {
          access_token_expires_at?: string | null
          access_token_hash?: string | null
          area_interest?: string | null
          consent?: boolean
          consent_at?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_contacted_at?: string | null
          last_email_sent_at?: string | null
          last_name: string
          message?: string | null
          notes_internal?: string | null
          notified_at?: string | null
          phone?: string | null
          profile_type: string
          source_page?: string
          status?: Database["public"]["Enums"]["investor_lead_status"]
          ticket_range: string
          verification_expires_at?: string | null
          verification_sent_at?: string | null
          verification_token_hash?: string | null
          verified_at?: string | null
        }
        Update: {
          access_token_expires_at?: string | null
          access_token_hash?: string | null
          area_interest?: string | null
          consent?: boolean
          consent_at?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_contacted_at?: string | null
          last_email_sent_at?: string | null
          last_name?: string
          message?: string | null
          notes_internal?: string | null
          notified_at?: string | null
          phone?: string | null
          profile_type?: string
          source_page?: string
          status?: Database["public"]["Enums"]["investor_lead_status"]
          ticket_range?: string
          verification_expires_at?: string | null
          verification_sent_at?: string | null
          verification_token_hash?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      practitioner_leads: {
        Row: {
          city: string
          consent: boolean
          consent_at: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          lang: string
          last_email_sent_at: string | null
          last_name: string
          message: string | null
          move_in_date: string | null
          neighbourhood: string | null
          notified_at: string | null
          organisation: string | null
          phone: string
          profession: string
          source_url: string | null
          status: string
          surface: string | null
          website: string | null
        }
        Insert: {
          city: string
          consent?: boolean
          consent_at?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          lang?: string
          last_email_sent_at?: string | null
          last_name: string
          message?: string | null
          move_in_date?: string | null
          neighbourhood?: string | null
          notified_at?: string | null
          organisation?: string | null
          phone: string
          profession: string
          source_url?: string | null
          status?: string
          surface?: string | null
          website?: string | null
        }
        Update: {
          city?: string
          consent?: boolean
          consent_at?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          lang?: string
          last_email_sent_at?: string | null
          last_name?: string
          message?: string | null
          move_in_date?: string | null
          neighbourhood?: string | null
          notified_at?: string | null
          organisation?: string | null
          phone?: string
          profession?: string
          source_url?: string | null
          status?: string
          surface?: string | null
          website?: string | null
        }
        Relationships: []
      }
      praticien_revisions: {
        Row: {
          changes: Json
          created_at: string
          id: string
          modified_at: string
          modified_by_external: string
          praticien_id: string
        }
        Insert: {
          changes?: Json
          created_at?: string
          id?: string
          modified_at?: string
          modified_by_external?: string
          praticien_id: string
        }
        Update: {
          changes?: Json
          created_at?: string
          id?: string
          modified_at?: string
          modified_by_external?: string
          praticien_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "praticien_revisions_praticien_id_fkey"
            columns: ["praticien_id"]
            isOneToOne: false
            referencedRelation: "praticiens"
            referencedColumns: ["id"]
          },
        ]
      }
      praticiens: {
        Row: {
          actif: boolean
          bio_courte: string | null
          bio_courte_en: string | null
          bio_longue: string | null
          bio_longue_en: string | null
          cabinet_slug: string
          created_at: string
          date_envoi_preview: string | null
          date_validation: string | null
          genre: string | null
          google_cid: string | null
          google_kgmid: string | null
          google_place_id: string | null
          id: string
          lien_rdv: string | null
          nom: string
          notes_internes: string | null
          ordre_affichage: number
          photo_url: string | null
          prenom: string
          preview_token: string
          problematiques: string[]
          problematiques_derivees: string[]
          problematiques_manuelles: string[]
          profession: string
          publics_derives: string[]
          slug: string
          specialites: string[]
          specialites_derivees: string[]
          statut_validation: string
          tags_bio_hash: string | null
          tags_extracted_at: string | null
          tags_extraction_log: Json
          tags_extraction_status: string
          updated_at: string
        }
        Insert: {
          actif?: boolean
          bio_courte?: string | null
          bio_courte_en?: string | null
          bio_longue?: string | null
          bio_longue_en?: string | null
          cabinet_slug: string
          created_at?: string
          date_envoi_preview?: string | null
          date_validation?: string | null
          genre?: string | null
          google_cid?: string | null
          google_kgmid?: string | null
          google_place_id?: string | null
          id?: string
          lien_rdv?: string | null
          nom: string
          notes_internes?: string | null
          ordre_affichage?: number
          photo_url?: string | null
          prenom: string
          preview_token?: string
          problematiques?: string[]
          problematiques_derivees?: string[]
          problematiques_manuelles?: string[]
          profession: string
          publics_derives?: string[]
          slug: string
          specialites?: string[]
          specialites_derivees?: string[]
          statut_validation?: string
          tags_bio_hash?: string | null
          tags_extracted_at?: string | null
          tags_extraction_log?: Json
          tags_extraction_status?: string
          updated_at?: string
        }
        Update: {
          actif?: boolean
          bio_courte?: string | null
          bio_courte_en?: string | null
          bio_longue?: string | null
          bio_longue_en?: string | null
          cabinet_slug?: string
          created_at?: string
          date_envoi_preview?: string | null
          date_validation?: string | null
          genre?: string | null
          google_cid?: string | null
          google_kgmid?: string | null
          google_place_id?: string | null
          id?: string
          lien_rdv?: string | null
          nom?: string
          notes_internes?: string | null
          ordre_affichage?: number
          photo_url?: string | null
          prenom?: string
          preview_token?: string
          problematiques?: string[]
          problematiques_derivees?: string[]
          problematiques_manuelles?: string[]
          profession?: string
          publics_derives?: string[]
          slug?: string
          specialites?: string[]
          specialites_derivees?: string[]
          statut_validation?: string
          tags_bio_hash?: string | null
          tags_extracted_at?: string | null
          tags_extraction_log?: Json
          tags_extraction_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      problematiques: {
        Row: {
          actif: boolean
          created_at: string
          description_courte: string
          description_longue: string | null
          id: string
          nom: string
          slug: string
          synonymes: string[]
          updated_at: string
        }
        Insert: {
          actif?: boolean
          created_at?: string
          description_courte: string
          description_longue?: string | null
          id?: string
          nom: string
          slug: string
          synonymes?: string[]
          updated_at?: string
        }
        Update: {
          actif?: boolean
          created_at?: string
          description_courte?: string
          description_longue?: string | null
          id?: string
          nom?: string
          slug?: string
          synonymes?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      professions: {
        Row: {
          actif: boolean
          created_at: string
          id: string
          nom_feminin_singulier: string
          nom_inclusif_pluriel: string
          nom_masculin_singulier: string
          ordre_affichage: number
          page_installation: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          actif?: boolean
          created_at?: string
          id?: string
          nom_feminin_singulier: string
          nom_inclusif_pluriel: string
          nom_masculin_singulier: string
          ordre_affichage?: number
          page_installation?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          actif?: boolean
          created_at?: string
          id?: string
          nom_feminin_singulier?: string
          nom_inclusif_pluriel?: string
          nom_masculin_singulier?: string
          ordre_affichage?: number
          page_installation?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      projets: {
        Row: {
          address: string | null
          city: string
          created_at: string
          date_ouverture_cible: string | null
          delivery_date: string | null
          google_kgmid: string | null
          google_place_id: string | null
          hero_image_url: string | null
          id: string
          image_gallery: string[] | null
          key_features: string[] | null
          key_features_en: string[] | null
          lat: number | null
          lng: number | null
          long_description: string | null
          long_description_en: string | null
          name: string
          short_description: string
          short_description_en: string | null
          show_address: boolean
          slug: string
          slug_installation: string | null
          status: Database["public"]["Enums"]["project_status"]
          surface_m2: number
          typology: Database["public"]["Enums"]["project_typology"]
          units_count: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string
          date_ouverture_cible?: string | null
          delivery_date?: string | null
          google_kgmid?: string | null
          google_place_id?: string | null
          hero_image_url?: string | null
          id?: string
          image_gallery?: string[] | null
          key_features?: string[] | null
          key_features_en?: string[] | null
          lat?: number | null
          lng?: number | null
          long_description?: string | null
          long_description_en?: string | null
          name: string
          short_description: string
          short_description_en?: string | null
          show_address?: boolean
          slug: string
          slug_installation?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          surface_m2: number
          typology: Database["public"]["Enums"]["project_typology"]
          units_count?: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string
          date_ouverture_cible?: string | null
          delivery_date?: string | null
          google_kgmid?: string | null
          google_place_id?: string | null
          hero_image_url?: string | null
          id?: string
          image_gallery?: string[] | null
          key_features?: string[] | null
          key_features_en?: string[] | null
          lat?: number | null
          lng?: number | null
          long_description?: string | null
          long_description_en?: string | null
          name?: string
          short_description?: string
          short_description_en?: string | null
          show_address?: boolean
          slug?: string
          slug_installation?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          surface_m2?: number
          typology?: Database["public"]["Enums"]["project_typology"]
          units_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      specialites: {
        Row: {
          actif: boolean
          cabinet_slug: string | null
          created_at: string
          description_courte: string
          description_longue: string | null
          id: string
          nom: string
          slug: string
          synonymes: string[]
          updated_at: string
        }
        Insert: {
          actif?: boolean
          cabinet_slug?: string | null
          created_at?: string
          description_courte: string
          description_longue?: string | null
          id?: string
          nom: string
          slug: string
          synonymes?: string[]
          updated_at?: string
        }
        Update: {
          actif?: boolean
          cabinet_slug?: string | null
          created_at?: string
          description_courte?: string
          description_longue?: string | null
          id?: string
          nom?: string
          slug?: string
          synonymes?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      taxonomy_candidates: {
        Row: {
          dimension: string
          first_seen_at: string
          id: string
          last_seen_at: string
          occurrences: number
          praticiens_ids: string[]
          resolution_action: string | null
          resolution_canonical: string | null
          resolution_group: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          term: string
          term_normalized: string
        }
        Insert: {
          dimension: string
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          occurrences?: number
          praticiens_ids?: string[]
          resolution_action?: string | null
          resolution_canonical?: string | null
          resolution_group?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          term: string
          term_normalized: string
        }
        Update: {
          dimension?: string
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          occurrences?: number
          praticiens_ids?: string[]
          resolution_action?: string | null
          resolution_canonical?: string | null
          resolution_group?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          term?: string
          term_normalized?: string
        }
        Relationships: []
      }
      temoignages_praticiens: {
        Row: {
          actif: boolean
          cabinet_nom_affichage: string
          cabinet_slug: string
          citation_longue: string
          created_at: string
          id: string
          ordre_affichage: number
          photo_url: string | null
          praticien_nom: string
          praticien_profession: string | null
        }
        Insert: {
          actif?: boolean
          cabinet_nom_affichage: string
          cabinet_slug: string
          citation_longue: string
          created_at?: string
          id?: string
          ordre_affichage?: number
          photo_url?: string | null
          praticien_nom: string
          praticien_profession?: string | null
        }
        Update: {
          actif?: boolean
          cabinet_nom_affichage?: string
          cabinet_slug?: string
          citation_longue?: string
          created_at?: string
          id?: string
          ordre_affichage?: number
          photo_url?: string | null
          praticien_nom?: string
          praticien_profession?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      installation_pages: {
        Row: {
          cabinet_adresse: string | null
          cabinet_nom_complet: string | null
          cabinet_ville: string | null
          date_ouverture: string | null
          profession_id: string | null
          profession_libelle: string | null
          profession_ordre: number | null
          profession_slug: string | null
          projet_id: string | null
          url_path: string | null
          ville_slug: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_praticien_preview: {
        Args: { p_slug: string; p_token: string }
        Returns: {
          actif: boolean
          bio_courte: string | null
          bio_courte_en: string | null
          bio_longue: string | null
          bio_longue_en: string | null
          cabinet_slug: string
          created_at: string
          date_envoi_preview: string | null
          date_validation: string | null
          genre: string | null
          google_cid: string | null
          google_kgmid: string | null
          google_place_id: string | null
          id: string
          lien_rdv: string | null
          nom: string
          notes_internes: string | null
          ordre_affichage: number
          photo_url: string | null
          prenom: string
          preview_token: string
          problematiques: string[]
          problematiques_derivees: string[]
          problematiques_manuelles: string[]
          profession: string
          publics_derives: string[]
          slug: string
          specialites: string[]
          specialites_derivees: string[]
          statut_validation: string
          tags_bio_hash: string | null
          tags_extracted_at: string | null
          tags_extraction_log: Json
          tags_extraction_status: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "praticiens"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      unaccent: { Args: { "": string }; Returns: string }
      upsert_taxonomy_candidate: {
        Args: {
          p_dimension: string
          p_praticien_id: string
          p_term: string
          p_term_normalized: string
        }
        Returns: undefined
      }
    }
    Enums: {
      investor_lead_status: "new" | "contacted" | "qualified" | "not_interested"
      project_status: "en_exploitation" | "en_travaux" | "a_venir"
      project_typology:
        | "cabinet_medical"
        | "pole_pluridisciplinaire"
        | "coworking_sante"
        | "centre_paramedical"
        | "maison_de_sante"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      investor_lead_status: ["new", "contacted", "qualified", "not_interested"],
      project_status: ["en_exploitation", "en_travaux", "a_venir"],
      project_typology: [
        "cabinet_medical",
        "pole_pluridisciplinaire",
        "coworking_sante",
        "centre_paramedical",
        "maison_de_sante",
      ],
    },
  },
} as const
