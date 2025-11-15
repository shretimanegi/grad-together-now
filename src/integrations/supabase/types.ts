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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      batch: {
        Row: {
          batch_id: string
          batch_year: number
          created_at: string | null
        }
        Insert: {
          batch_id?: string
          batch_year: number
          created_at?: string | null
        }
        Update: {
          batch_id?: string
          batch_year?: number
          created_at?: string | null
        }
        Relationships: []
      }
      department: {
        Row: {
          created_at: string | null
          dept_id: string
          dept_name: string
        }
        Insert: {
          created_at?: string | null
          dept_id?: string
          dept_name: string
        }
        Update: {
          created_at?: string | null
          dept_id?: string
          dept_name?: string
        }
        Relationships: []
      }
      donation: {
        Row: {
          alumni_id: string
          amount: number
          created_at: string | null
          donation_date: string | null
          donation_id: string
          message: string | null
        }
        Insert: {
          alumni_id: string
          amount: number
          created_at?: string | null
          donation_date?: string | null
          donation_id?: string
          message?: string | null
        }
        Update: {
          alumni_id?: string
          amount?: number
          created_at?: string | null
          donation_date?: string | null
          donation_id?: string
          message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string
          event_id: string
          image_url: string | null
          location: string | null
          organizer_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date: string
          event_id?: string
          image_url?: string | null
          location?: string | null
          organizer_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_id?: string
          image_url?: string | null
          location?: string | null
          organizer_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registration: {
        Row: {
          alumni_id: string
          event_id: string
          reg_id: string
          registered_at: string | null
        }
        Insert: {
          alumni_id: string
          event_id: string
          reg_id?: string
          registered_at?: string | null
        }
        Update: {
          alumni_id?: string
          event_id?: string
          reg_id?: string
          registered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registration_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registration_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["event_id"]
          },
        ]
      }
      job_post: {
        Row: {
          alumni_id: string
          apply_link: string
          company: string
          created_at: string | null
          description: string
          is_active: boolean | null
          job_id: string
          location: string
          salary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          alumni_id: string
          apply_link: string
          company: string
          created_at?: string | null
          description: string
          is_active?: boolean | null
          job_id?: string
          location: string
          salary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          alumni_id?: string
          apply_link?: string
          company?: string
          created_at?: string | null
          description?: string
          is_active?: boolean | null
          job_id?: string
          location?: string
          salary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_post_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship: {
        Row: {
          alumni_id: string
          created_at: string | null
          domain: string
          mentee_email: string
          mentee_name: string
          mentor_id: string
          status: Database["public"]["Enums"]["mentorship_status"] | null
          updated_at: string | null
        }
        Insert: {
          alumni_id: string
          created_at?: string | null
          domain: string
          mentee_email: string
          mentee_name: string
          mentor_id?: string
          status?: Database["public"]["Enums"]["mentorship_status"] | null
          updated_at?: string | null
        }
        Update: {
          alumni_id?: string
          created_at?: string | null
          domain?: string
          mentee_email?: string
          mentee_name?: string
          mentor_id?: string
          status?: Database["public"]["Enums"]["mentorship_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          batch_id: string | null
          bio: string | null
          company: string | null
          created_at: string | null
          department_id: string | null
          email: string
          id: string
          name: string
          phone: string | null
          profession: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          batch_id?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          department_id?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          profession?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          batch_id?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          department_id?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          profession?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch"
            referencedColumns: ["batch_id"]
          },
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "department"
            referencedColumns: ["dept_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      mentorship_status: "pending" | "active" | "completed" | "cancelled"
      user_role: "admin" | "alumni" | "student"
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
      mentorship_status: ["pending", "active", "completed", "cancelled"],
      user_role: ["admin", "alumni", "student"],
    },
  },
} as const
