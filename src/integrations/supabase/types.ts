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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      customer_orders: {
        Row: {
          arrived_at: string | null
          collected_at: string | null
          created_by: string | null
          customer_name: string
          customer_phone: string | null
          date_ordered: string
          expected_date: string | null
          id: string
          item_name: string
          notes: string | null
          notification_sent: boolean | null
          notified_at: string | null
          order_type: string
          pharmacy_id: string
          status: string
          updated_at: string
        }
        Insert: {
          arrived_at?: string | null
          collected_at?: string | null
          created_by?: string | null
          customer_name: string
          customer_phone?: string | null
          date_ordered?: string
          expected_date?: string | null
          id?: string
          item_name: string
          notes?: string | null
          notification_sent?: boolean | null
          notified_at?: string | null
          order_type: string
          pharmacy_id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          arrived_at?: string | null
          collected_at?: string | null
          created_by?: string | null
          customer_name?: string
          customer_phone?: string | null
          date_ordered?: string
          expected_date?: string | null
          id?: string
          item_name?: string
          notes?: string | null
          notification_sent?: boolean | null
          notified_at?: string | null
          order_type?: string
          pharmacy_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_log: {
        Row: {
          id: string
          item_name: string
          notes: string | null
          pharmacy_id: string
          quantity_received: number
          received_at: string
          received_by: string | null
          supplier: string
        }
        Insert: {
          id?: string
          item_name: string
          notes?: string | null
          pharmacy_id?: string
          quantity_received: number
          received_at?: string
          received_by?: string | null
          supplier: string
        }
        Update: {
          id?: string
          item_name?: string
          notes?: string | null
          pharmacy_id?: string
          quantity_received?: number
          received_at?: string
          received_by?: string | null
          supplier?: string
        }
        Relationships: []
      }
      orders_todo: {
        Row: {
          created_at: string
          created_by: string | null
          current_stock: number
          id: string
          item_name: string
          notes: string | null
          order_quantity: number
          pharmacy_id: string
          status: string
          supplier: string
          supplier_contact: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_stock?: number
          id?: string
          item_name: string
          notes?: string | null
          order_quantity: number
          pharmacy_id?: string
          status?: string
          supplier: string
          supplier_contact?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_stock?: number
          id?: string
          item_name?: string
          notes?: string | null
          order_quantity?: number
          pharmacy_id?: string
          status?: string
          supplier?: string
          supplier_contact?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          created_by: string | null
          date_collected: string | null
          date_created: string
          date_ready: string | null
          dosage: string
          id: string
          insurance_info: string | null
          medication: string
          patient_address: string | null
          patient_dob: string | null
          patient_name: string
          patient_phone: string | null
          pharmacy_id: string
          prescriber: string
          quantity: number
          renewal_due_date: string | null
          renewed_at: string | null
          special_instructions: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_by?: string | null
          date_collected?: string | null
          date_created?: string
          date_ready?: string | null
          dosage: string
          id?: string
          insurance_info?: string | null
          medication: string
          patient_address?: string | null
          patient_dob?: string | null
          patient_name: string
          patient_phone?: string | null
          pharmacy_id?: string
          prescriber: string
          quantity: number
          renewal_due_date?: string | null
          renewed_at?: string | null
          special_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_by?: string | null
          date_collected?: string | null
          date_created?: string
          date_ready?: string | null
          dosage?: string
          id?: string
          insurance_info?: string | null
          medication?: string
          patient_address?: string | null
          patient_dob?: string | null
          patient_name?: string
          patient_phone?: string | null
          pharmacy_id?: string
          prescriber?: string
          quantity?: number
          renewal_due_date?: string | null
          renewed_at?: string | null
          special_instructions?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      reminder_events: {
        Row: {
          channel: string
          id: string
          notes: string | null
          pharmacy_id: string
          prescription_id: string
          reminder_type: string
          sent_at: string
          sent_by: string | null
        }
        Insert: {
          channel: string
          id?: string
          notes?: string | null
          pharmacy_id?: string
          prescription_id: string
          reminder_type: string
          sent_at?: string
          sent_by?: string | null
        }
        Update: {
          channel?: string
          id?: string
          notes?: string | null
          pharmacy_id?: string
          prescription_id?: string
          reminder_type?: string
          sent_at?: string
          sent_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminder_events_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_items: {
        Row: {
          current_stock: number
          id: string
          last_updated: string
          location: string | null
          minimum_stock: number
          name: string
          pharmacy_id: string
          supplier: string | null
          supplier_contact: string | null
          updated_by: string | null
        }
        Insert: {
          current_stock?: number
          id?: string
          last_updated?: string
          location?: string | null
          minimum_stock?: number
          name: string
          pharmacy_id?: string
          supplier?: string | null
          supplier_contact?: string | null
          updated_by?: string | null
        }
        Update: {
          current_stock?: number
          id?: string
          last_updated?: string
          location?: string | null
          minimum_stock?: number
          name?: string
          pharmacy_id?: string
          supplier?: string | null
          supplier_contact?: string | null
          updated_by?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
