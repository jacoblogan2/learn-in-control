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
      accounts: {
        Row: {
          account_type: string
          created_at: string
          department: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          linked_user_id: string | null
          permissions: string[] | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_type: string
          created_at?: string
          department?: string | null
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          linked_user_id?: string | null
          permissions?: string[] | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          linked_user_id?: string | null
          permissions?: string[] | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          class_date: string
          course_id: string
          created_at: string
          id: string
          marked_by: string | null
          notes: string | null
          status: string
          student_id: string
        }
        Insert: {
          class_date: string
          course_id: string
          created_at?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          status: string
          student_id: string
        }
        Update: {
          class_date?: string
          course_id?: string
          created_at?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
        ]
      }
      "auth.users": {
        Row: {
          address: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          language_preference: string | null
          last_name: string
          phone: number | null
          profile_photo_url: string | null
          registration_number: number | null
          role: Database["public"]["Enums"]["user_role"]
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          language_preference?: string | null
          last_name: string
          phone?: number | null
          profile_photo_url?: string | null
          registration_number?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          language_preference?: string | null
          last_name?: string
          phone?: number | null
          profile_photo_url?: string | null
          registration_number?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          academic_year: string
          code: string
          created_at: string
          credits: number | null
          description: string | null
          id: string
          lecturer_id: string | null
          name: string
          semester: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          code: string
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          lecturer_id?: string | null
          name: string
          semester: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          code?: string
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          lecturer_id?: string | null
          name?: string
          semester?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_lecturer_id_fkey"
            columns: ["lecturer_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: string
          enrollment_date: string
          final_grade: number | null
          id: string
          status: string | null
          student_id: string
        }
        Insert: {
          course_id: string
          enrollment_date?: string
          final_grade?: number | null
          id?: string
          status?: string | null
          student_id: string
        }
        Update: {
          course_id?: string
          enrollment_date?: string
          final_grade?: number | null
          id?: string
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          assignment_name: string
          course_id: string
          created_at: string
          grade_date: string
          id: string
          lecturer_id: string | null
          max_score: number
          score: number
          student_id: string
        }
        Insert: {
          assignment_name: string
          course_id: string
          created_at?: string
          grade_date?: string
          id?: string
          lecturer_id?: string | null
          max_score?: number
          score: number
          student_id: string
        }
        Update: {
          assignment_name?: string
          course_id?: string
          created_at?: string
          grade_date?: string
          id?: string
          lecturer_id?: string | null
          max_score?: number
          score?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grades_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_lecturer_id_fkey"
            columns: ["lecturer_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_plans: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          installment_number: number
          invoice_id: string
          status: Database["public"]["Enums"]["invoice_status"] | null
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: string
          installment_number: number
          invoice_id: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          installment_number?: number
          invoice_id?: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "installment_plans_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          academic_year: string
          amount: number
          created_at: string
          due_date: string
          fee_type: Database["public"]["Enums"]["fee_type"]
          id: string
          status: Database["public"]["Enums"]["invoice_status"] | null
          student_id: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          amount: number
          created_at?: string
          due_date: string
          fee_type: Database["public"]["Enums"]["fee_type"]
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
          student_id: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          amount?: number
          created_at?: string
          due_date?: string
          fee_type?: Database["public"]["Enums"]["fee_type"]
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"] | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          gender: string | null
          id: string
          linked_user_id: string | null
          name: string
          occupation: string | null
          phone: string
          relationship_to_student: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          linked_user_id?: string | null
          name: string
          occupation?: string | null
          phone: string
          relationship_to_student?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          linked_user_id?: string | null
          name?: string
          occupation?: string | null
          phone?: string
          relationship_to_student?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          reference_number: string | null
          stripe_payment_intent_id: string | null
          student_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          reference_number?: string | null
          stripe_payment_intent_id?: string | null
          student_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          reference_number?: string | null
          stripe_payment_intent_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          registration_number: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          registration_number?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          registration_number?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_parents: {
        Row: {
          created_at: string
          id: string
          parent_id: string
          relationship_type: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_id: string
          relationship_type: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_id?: string
          relationship_type?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_parents_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_parents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          admission_number: string | null
          class_name: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          father_name: string | null
          father_occupation: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          linked_user_id: string | null
          mother_name: string | null
          mother_occupation: string | null
          nationality: string | null
          parent_photo_url: string | null
          permanent_address: string | null
          phone: string | null
          present_address: string | null
          primary_parent_id: string | null
          religion: string | null
          roll_number: string | null
          section: string | null
          student_photo_url: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          admission_number?: string | null
          class_name?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          father_name?: string | null
          father_occupation?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          linked_user_id?: string | null
          mother_name?: string | null
          mother_occupation?: string | null
          nationality?: string | null
          parent_photo_url?: string | null
          permanent_address?: string | null
          phone?: string | null
          present_address?: string | null
          primary_parent_id?: string | null
          religion?: string | null
          roll_number?: string | null
          section?: string | null
          student_photo_url?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          admission_number?: string | null
          class_name?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          father_name?: string | null
          father_occupation?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          linked_user_id?: string | null
          mother_name?: string | null
          mother_occupation?: string | null
          nationality?: string | null
          parent_photo_url?: string | null
          permanent_address?: string | null
          phone?: string | null
          present_address?: string | null
          primary_parent_id?: string | null
          religion?: string | null
          roll_number?: string | null
          section?: string | null
          student_photo_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_primary_parent_id_fkey"
            columns: ["primary_parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          address: string | null
          class_assigned: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          employee_id: string | null
          experience_years: number | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          linked_user_id: string | null
          phone: string | null
          qualification: string | null
          religion: string | null
          section_assigned: string | null
          subject: string | null
          teacher_photo_url: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          class_assigned?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          employee_id?: string | null
          experience_years?: number | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          linked_user_id?: string | null
          phone?: string | null
          qualification?: string | null
          religion?: string | null
          section_assigned?: string | null
          subject?: string | null
          teacher_photo_url?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          class_assigned?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          employee_id?: string | null
          experience_years?: number | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          linked_user_id?: string | null
          phone?: string | null
          qualification?: string | null
          religion?: string | null
          section_assigned?: string | null
          subject?: string | null
          teacher_photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_registration_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      fee_type:
        | "tuition_fee"
        | "registration_fee"
        | "lab_fee"
        | "library_fee"
        | "exam_fee"
      invoice_status: "pending" | "paid" | "overdue" | "partial"
      notification_type:
        | "message"
        | "invoice"
        | "grade"
        | "attendance"
        | "general"
      payment_method:
        | "mtn_mobile_money"
        | "orange_money"
        | "bank_transfer"
        | "cash"
        | "credit_card"
      user_role: "admin" | "student" | "lecturer" | "parent"
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
      fee_type: [
        "tuition_fee",
        "registration_fee",
        "lab_fee",
        "library_fee",
        "exam_fee",
      ],
      invoice_status: ["pending", "paid", "overdue", "partial"],
      notification_type: [
        "message",
        "invoice",
        "grade",
        "attendance",
        "general",
      ],
      payment_method: [
        "mtn_mobile_money",
        "orange_money",
        "bank_transfer",
        "cash",
        "credit_card",
      ],
      user_role: ["admin", "student", "lecturer", "parent"],
    },
  },
} as const
