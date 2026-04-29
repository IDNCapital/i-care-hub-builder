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
      projets: {
        Row: {
          address: string | null
          city: string
          created_at: string
          delivery_date: string | null
          google_kgmid: string | null
          google_place_id: string | null
          hero_image_url: string | null
          id: string
          image_gallery: string[] | null
          key_features: string[] | null
          key_features_en: string[] | null
          long_description: string | null
          long_description_en: string | null
          name: string
          short_description: string
          short_description_en: string | null
          show_address: boolean
          slug: string
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
          delivery_date?: string | null
          google_kgmid?: string | null
          google_place_id?: string | null
          hero_image_url?: string | null
          id?: string
          image_gallery?: string[] | null
          key_features?: string[] | null
          key_features_en?: string[] | null
          long_description?: string | null
          long_description_en?: string | null
          name: string
          short_description: string
          short_description_en?: string | null
          show_address?: boolean
          slug: string
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
          delivery_date?: string | null
          google_kgmid?: string | null
          google_place_id?: string | null
          hero_image_url?: string | null
          id?: string
          image_gallery?: string[] | null
          key_features?: string[] | null
          key_features_en?: string[] | null
          long_description?: string | null
          long_description_en?: string | null
          name?: string
          short_description?: string
          short_description_en?: string | null
          show_address?: boolean
          slug?: string
          status?: Database["public"]["Enums"]["project_status"]
          surface_m2?: number
          typology?: Database["public"]["Enums"]["project_typology"]
          units_count?: number
          updated_at?: string
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
