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
      investor_leads: {
        Row: {
          area_interest: string | null
          consent: boolean
          consent_at: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_contacted_at: string | null
          last_name: string
          message: string | null
          notes_internal: string | null
          phone: string | null
          profile_type: string
          source_page: string
          status: Database["public"]["Enums"]["investor_lead_status"]
          ticket_range: string
        }
        Insert: {
          area_interest?: string | null
          consent?: boolean
          consent_at?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_contacted_at?: string | null
          last_name: string
          message?: string | null
          notes_internal?: string | null
          phone?: string | null
          profile_type: string
          source_page?: string
          status?: Database["public"]["Enums"]["investor_lead_status"]
          ticket_range: string
        }
        Update: {
          area_interest?: string | null
          consent?: boolean
          consent_at?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_contacted_at?: string | null
          last_name?: string
          message?: string | null
          notes_internal?: string | null
          phone?: string | null
          profile_type?: string
          source_page?: string
          status?: Database["public"]["Enums"]["investor_lead_status"]
          ticket_range?: string
        }
        Relationships: []
      }
      projets: {
        Row: {
          address: string | null
          city: string
          created_at: string
          delivery_date: string | null
          hero_image_url: string | null
          id: string
          image_gallery: string[] | null
          key_features: string[] | null
          long_description: string | null
          name: string
          short_description: string
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
          hero_image_url?: string | null
          id?: string
          image_gallery?: string[] | null
          key_features?: string[] | null
          long_description?: string | null
          name: string
          short_description: string
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
          hero_image_url?: string | null
          id?: string
          image_gallery?: string[] | null
          key_features?: string[] | null
          long_description?: string | null
          name?: string
          short_description?: string
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
