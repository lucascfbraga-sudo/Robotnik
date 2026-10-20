export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string | null; email: string | null; blocked: boolean; created_at: string; updated_at: string }
        Insert: { id: string; full_name?: string | null; email?: string | null; blocked?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; full_name?: string | null; email?: string | null; blocked?: boolean; created_at?: string; updated_at?: string }
        Relationships: []
      }
      user_roles: {
        Row: { id: string; user_id: string; role: "admin" | "cliente" }
        Insert: { id?: string; user_id: string; role: "admin" | "cliente" }
        Update: { id?: string; user_id?: string; role?: "admin" | "cliente" }
        Relationships: []
      }
      plans: {
        Row: { id: string; name: string; description: string | null; duration_days: number; price: number; published: boolean; display_order: number; created_at: string; updated_at: string }
        Insert: { id?: string; name: string; description?: string | null; duration_days: number; price?: number; published?: boolean; display_order?: number; created_at?: string; updated_at?: string }
        Update: { id?: string; name?: string; description?: string | null; duration_days?: number; price?: number; published?: boolean; display_order?: number; created_at?: string; updated_at?: string }
        Relationships: []
      }
      orders: {
        Row: { id: string; user_id: string; plan_id: string | null; amount: number; status: string; delivery_status: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; plan_id?: string | null; amount: number; status?: string; delivery_status?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string; plan_id?: string | null; amount?: number; status?: string; delivery_status?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      payments: {
        Row: { id: string; order_id: string; user_id: string; provider: string; provider_payment_id: string | null; method: string | null; status: string; amount: number; raw_payload: Json | null; created_at: string; updated_at: string }
        Insert: { id?: string; order_id: string; user_id: string; provider?: string; provider_payment_id?: string | null; method?: string | null; status?: string; amount: number; raw_payload?: Json | null; created_at?: string; updated_at?: string }
        Update: { id?: string; order_id?: string; user_id?: string; provider?: string; provider_payment_id?: string | null; method?: string | null; status?: string; amount?: number; raw_payload?: Json | null; created_at?: string; updated_at?: string }
        Relationships: []
      }
      subscriptions: {
        Row: { id: string; user_id: string; plan_id: string | null; order_id: string | null; status: string; started_at: string; expires_at: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; plan_id?: string | null; order_id?: string | null; status?: string; started_at?: string; expires_at: string; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string; plan_id?: string | null; order_id?: string | null; status?: string; started_at?: string; expires_at?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      subscription_renewals: {
        Row: { id: string; subscription_id: string; order_id: string | null; previous_expires_at: string | null; new_expires_at: string; days_added: number; created_at: string }
        Insert: { id?: string; subscription_id: string; order_id?: string | null; previous_expires_at?: string | null; new_expires_at: string; days_added: number; created_at?: string }
        Update: { id?: string; subscription_id?: string; order_id?: string | null; previous_expires_at?: string | null; new_expires_at?: string; days_added?: number; created_at?: string }
        Relationships: []
      }
      license_keys: {
        Row: { id: string; key_value: string; duration_days: number; status: string; order_id: string | null; user_id: string | null; delivered_at: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; key_value: string; duration_days: number; status?: string; order_id?: string | null; user_id?: string | null; delivered_at?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; key_value?: string; duration_days?: number; status?: string; order_id?: string | null; user_id?: string | null; delivered_at?: string | null; created_at?: string; updated_at?: string }
        Relationships: []
      }
      key_deliveries: {
        Row: { id: string; license_key_id: string; order_id: string; user_id: string; delivered_at: string; created_at: string }
        Insert: { id?: string; license_key_id: string; order_id: string; user_id: string; delivered_at?: string; created_at?: string }
        Update: { id?: string; license_key_id?: string; order_id?: string; user_id?: string; delivered_at?: string; created_at?: string }
        Relationships: []
      }
      payment_events: {
        Row: { id: string; payment_id: string | null; order_id: string | null; provider: string; provider_event_id: string | null; event_type: string; payload: Json | null; processed: boolean; created_at: string }
        Insert: { id?: string; payment_id?: string | null; order_id?: string | null; provider: string; provider_event_id?: string | null; event_type: string; payload?: Json | null; processed?: boolean; created_at?: string }
        Update: { id?: string; payment_id?: string | null; order_id?: string | null; provider?: string; provider_event_id?: string | null; event_type?: string; payload?: Json | null; processed?: boolean; created_at?: string }
        Relationships: []
      }
      audit_logs: {
        Row: { id: string; actor_id: string | null; action: string; entity_type: string | null; entity_id: string | null; details: Json | null; created_at: string }
        Insert: { id?: string; actor_id?: string | null; action: string; entity_type?: string | null; entity_id?: string | null; details?: Json | null; created_at?: string }
        Update: { id?: string; actor_id?: string | null; action?: string; entity_type?: string | null; entity_id?: string | null; details?: Json | null; created_at?: string }
        Relationships: []
      }
      site_settings: {
        Row: { id: string; key: string; value: Json; updated_at: string }
        Insert: { id?: string; key: string; value?: Json; updated_at?: string }
        Update: { id?: string; key?: string; value?: Json; updated_at?: string }
        Relationships: []
      }
      faq_items: {
        Row: { id: string; question: string; answer: string; display_order: number; published: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; question: string; answer: string; display_order?: number; published?: boolean; created_at?: string; updated_at?: string }
        Update: { id?: string; question?: string; answer?: string; display_order?: number; published?: boolean; created_at?: string; updated_at?: string }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: "admin" | "cliente" }
        Returns: boolean
      }
      admin_mark_payment_status: {
        Args: { p_order_id: string; p_new_status: string; p_reason: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "cliente"
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
      app_role: ["admin", "cliente"],
    },
  },
} as const
