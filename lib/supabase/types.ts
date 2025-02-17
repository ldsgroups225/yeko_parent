export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendances: {
        Row: {
          class_id: string
          created_at: string | null
          created_by: string | null
          created_date: string | null
          ends_at: string
          id: string
          is_excused: boolean
          reason: string | null
          school_years_id: number | null
          semesters_id: number | null
          starts_at: string
          status: string
          student_id: string
          subject_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          created_by?: string | null
          created_date?: string | null
          ends_at: string
          id?: string
          is_excused?: boolean
          reason?: string | null
          school_years_id?: number | null
          semesters_id?: number | null
          starts_at: string
          status: string
          student_id: string
          subject_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          created_by?: string | null
          created_date?: string | null
          ends_at?: string
          id?: string
          is_excused?: boolean
          reason?: string | null
          school_years_id?: number | null
          semesters_id?: number | null
          starts_at?: string
          status?: string
          student_id?: string
          subject_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendances_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_semesters_foreign"
            columns: ["semesters_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_topics: {
        Row: {
          created_at: string | null
          default_message: string
          id: number
          is_active: boolean | null
          title: string
          topic_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_message: string
          id?: number
          is_active?: boolean | null
          title: string
          topic_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_message?: string
          id?: number
          is_active?: boolean | null
          title?: string
          topic_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          class_id: string
          created_at: string | null
          ended_at: string | null
          id: string
          initiated_by: string | null
          message_count: number | null
          parent_id: string
          school_id: string
          status: string | null
          student_id: string
          teacher_id: string
          topic_id: number | null
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          ended_at?: string | null
          id?: string
          initiated_by?: string | null
          message_count?: number | null
          parent_id: string
          school_id: string
          status?: string | null
          student_id: string
          teacher_id: string
          topic_id?: number | null
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          ended_at?: string | null
          id?: string
          initiated_by?: string | null
          message_count?: number | null
          parent_id?: string
          school_id?: string
          status?: string | null
          student_id?: string
          teacher_id?: string
          topic_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "chats_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "chats_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "chat_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          created_by: string | null
          grade_id: number
          id: string
          is_active: boolean
          main_teacher_id: string | null
          name: string
          school_id: string
          slug: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          grade_id: number
          id?: string
          is_active?: boolean
          main_teacher_id?: string | null
          name: string
          school_id: string
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          grade_id?: number
          id?: string
          is_active?: boolean
          main_teacher_id?: string | null
          name?: string
          school_id?: string
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_main_teacher_id_foreign"
            columns: ["main_teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      cycles: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          feedback_type: string
          id: string
          message: string
          user_email: string | null
        }
        Insert: {
          created_at?: string
          feedback_type: string
          id?: string
          message: string
          user_email?: string | null
        }
        Update: {
          created_at?: string
          feedback_type?: string
          id?: string
          message?: string
          user_email?: string | null
        }
        Relationships: []
      }
      grades: {
        Row: {
          created_at: string | null
          created_by: string | null
          cycle_id: string
          description: string
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          cycle_id: string
          description: string
          id?: number
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          cycle_id?: string
          description?: string
          id?: number
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_cycle_id_foreign"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      homeworks: {
        Row: {
          class_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string
          id: string
          is_graded: boolean
          max_score: number | null
          school_years_id: number | null
          semesters_id: number | null
          subject_id: string
          teacher_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date: string
          id?: string
          is_graded?: boolean
          max_score?: number | null
          school_years_id?: number | null
          semesters_id?: number | null
          subject_id: string
          teacher_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string
          id?: string
          is_graded?: boolean
          max_score?: number | null
          school_years_id?: number | null
          semesters_id?: number | null
          subject_id?: string
          teacher_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homeworks_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homeworks_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homeworks_semesters_foreign"
            columns: ["semesters_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homeworks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homeworks_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_templates: {
        Row: {
          day_before_notification: number | null
          due_date: string
          fixed_amount: number | null
          grade_id: number
          id: string
          installment_number: number
          school_id: string
        }
        Insert: {
          day_before_notification?: number | null
          due_date: string
          fixed_amount?: number | null
          grade_id: number
          id?: string
          installment_number: number
          school_id: string
        }
        Update: {
          day_before_notification?: number | null
          due_date?: string
          fixed_amount?: number | null
          grade_id?: number
          id?: string
          installment_number?: number
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_template_grade"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_template_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_to_school: {
        Row: {
          created_at: string
          created_by: string | null
          expired_at: string
          id: string
          is_used: boolean
          otp: string
          school_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expired_at?: string
          id?: string
          is_used?: boolean
          otp: string
          school_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expired_at?: string
          id?: string
          is_used?: boolean
          otp?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_teacher_school_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_teacher_school_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      link_student_parent: {
        Row: {
          created_at: string
          created_by: string | null
          expired_at: string
          id: string
          is_used: boolean
          otp: string
          parent_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expired_at?: string
          id?: string
          is_used?: boolean
          otp: string
          parent_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expired_at?: string
          id?: string
          is_used?: boolean
          otp?: string
          parent_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_student_parent_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "link_student_parent_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "link_student_parent_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string | null
          id: string
          is_system_message: boolean | null
          read_by: string[] | null
          sender_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string | null
          id?: string
          is_system_message?: boolean | null
          read_by?: string[] | null
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_system_message?: boolean | null
          read_by?: string[] | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      note_details: {
        Row: {
          created_at: string | null
          graded_at: string | null
          id: string
          note: number | null
          note_id: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          graded_at?: string | null
          id?: string
          note?: number | null
          note_id: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          graded_at?: string | null
          id?: string
          note?: number | null
          note_id?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_details_note_id_foreign"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_details_student_id_foreign"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "note_details_student_id_foreign"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "note_details_student_id_foreign"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          class_id: string
          created_at: string
          description: string | null
          due_date: string | null
          grades_processed: boolean | null
          id: string
          is_active: boolean
          is_graded: boolean
          is_published: boolean
          last_processed_at: string | null
          note_type: string
          participation_processed: boolean | null
          published_at: string | null
          school_id: string
          school_year_id: number
          semester_id: number
          subject_id: string
          teacher_id: string
          title: string | null
          total_points: number
          weight: number | null
        }
        Insert: {
          class_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          grades_processed?: boolean | null
          id?: string
          is_active?: boolean
          is_graded?: boolean
          is_published?: boolean
          last_processed_at?: string | null
          note_type: string
          participation_processed?: boolean | null
          published_at?: string | null
          school_id: string
          school_year_id: number
          semester_id: number
          subject_id: string
          teacher_id: string
          title?: string | null
          total_points: number
          weight?: number | null
        }
        Update: {
          class_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          grades_processed?: boolean | null
          id?: string
          is_active?: boolean
          is_graded?: boolean
          is_published?: boolean
          last_processed_at?: string | null
          note_type?: string
          participation_processed?: boolean | null
          published_at?: string | null
          school_id?: string
          school_year_id?: number
          semester_id?: number
          subject_id?: string
          teacher_id?: string
          title?: string | null
          total_points?: number
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_class_id_foreign"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_school_id_foreign"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_school_year_foreign"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_semester_foreign"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_subject_id_foreign"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_teacher_id_foreign"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_chat_limits: {
        Row: {
          chat_count: number | null
          parent_id: string
          week_start: string
        }
        Insert: {
          chat_count?: number | null
          parent_id: string
          week_start: string
        }
        Update: {
          chat_count?: number | null
          parent_id?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_chat_limits_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      participations: {
        Row: {
          class_id: string
          created_at: string | null
          created_by: string | null
          id: string
          school_years_id: number | null
          semesters_id: number | null
          student_id: string
          subject_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          school_years_id?: number | null
          semesters_id?: number | null
          student_id: string
          subject_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          school_years_id?: number | null
          semesters_id?: number | null
          student_id?: string
          subject_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participations_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participations_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participations_semesters_foreign"
            columns: ["semesters_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "participations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "participations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participations_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_installments: {
        Row: {
          amount: number
          due_date: string
          id: string
          payment_plan_id: string
          status: string
        }
        Insert: {
          amount: number
          due_date: string
          id?: string
          payment_plan_id: string
          status?: string
        }
        Update: {
          amount?: number
          due_date?: string
          id?: string
          payment_plan_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_plan"
            columns: ["payment_plan_id"]
            isOneToOne: false
            referencedRelation: "payment_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_payment_plan"
            columns: ["payment_plan_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["payment_plan_id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          amount_paid: number
          created_at: string | null
          enrollment_id: string
          id: string
          payment_status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number
          created_at?: string | null
          enrollment_id: string
          id?: string
          payment_status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          enrollment_id?: string
          id?: string
          payment_status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_enrollment"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "fk_enrollment"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "fk_enrollment"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_school_class"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          id: string
          installment_id: string
          paid_at: string | null
          parent_id: string
          payment_method: string
          reference: string
        }
        Insert: {
          amount: number
          id?: string
          installment_id: string
          paid_at?: string | null
          parent_id: string
          payment_method: string
          reference: string
        }
        Update: {
          amount?: number
          id?: string
          installment_id?: string
          paid_at?: string | null
          parent_id?: string
          payment_method?: string
          reference?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_installment"
            columns: ["installment_id"]
            isOneToOne: false
            referencedRelation: "payment_installments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_installment"
            columns: ["installment_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["payment_installment_id"]
          },
          {
            foreignKeyName: "fk_parent"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          generated_at: string | null
          id: string
          payment_id: string
          pdf_url: string
        }
        Insert: {
          generated_at?: string | null
          id?: string
          payment_id: string
          pdf_url: string
        }
        Update: {
          generated_at?: string | null
          id?: string
          payment_id?: string
          pdf_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          class_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          room: string | null
          start_time: string
          subject_id: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          room?: string | null
          start_time: string
          subject_id: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          room?: string | null
          start_time?: string
          subject_id?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      school_years: {
        Row: {
          academic_year_name: string | null
          end_date: string
          end_year: number
          id: number
          is_current: boolean
          semester_count: number
          start_date: string
          start_year: number
        }
        Insert: {
          academic_year_name?: string | null
          end_date: string
          end_year: number
          id?: number
          is_current?: boolean
          semester_count?: number
          start_date: string
          start_year: number
        }
        Update: {
          academic_year_name?: string | null
          end_date?: string
          end_year?: number
          id?: number
          is_current?: boolean
          semester_count?: number
          start_date?: string
          start_year?: number
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          city: string
          code: string
          created_at: string | null
          created_by: string | null
          cycle_id: string
          email: string
          id: string
          image_url: string | null
          is_technical_education: boolean | null
          name: string
          phone: string
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          city: string
          code: string
          created_at?: string | null
          created_by?: string | null
          cycle_id: string
          email: string
          id?: string
          image_url?: string | null
          is_technical_education?: boolean | null
          name: string
          phone: string
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          code?: string
          created_at?: string | null
          created_by?: string | null
          cycle_id?: string
          email?: string
          id?: string
          image_url?: string | null
          is_technical_education?: boolean | null
          name?: string
          phone?: string
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_cycle_id_foreign"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_state_id_foreign"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      schools_teachers: {
        Row: {
          created_at: string | null
          created_by: string | null
          school_id: string
          status: Database["public"]["Enums"]["status_enum"]
          teacher_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          school_id: string
          status?: Database["public"]["Enums"]["status_enum"]
          teacher_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["status_enum"]
          teacher_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_teachers_school_id_foreign"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_teachers_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      semesters: {
        Row: {
          end_date: string
          id: number
          is_current: boolean
          registration_end_date: string
          registration_start_date: string
          school_year_id: number
          semester_name: string
          start_date: string
        }
        Insert: {
          end_date: string
          id?: number
          is_current?: boolean
          registration_end_date: string
          registration_start_date: string
          school_year_id: number
          semester_name: string
          start_date: string
        }
        Update: {
          end_date?: string
          id?: number
          is_current?: boolean
          registration_end_date?: string
          registration_start_date?: string
          school_year_id?: number
          semester_name?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_school_class: {
        Row: {
          class_id: string | null
          created_at: string | null
          enrollment_status: string
          grade_id: number
          id: string
          is_active: boolean
          is_government_affected: boolean
          school_id: string
          school_year_id: number
          student_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          enrollment_status?: string
          grade_id: number
          id?: string
          is_active?: boolean
          is_government_affected?: boolean
          school_id: string
          school_year_id: number
          student_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          enrollment_status?: string
          grade_id?: number
          id?: string
          is_active?: boolean
          is_government_affected?: boolean
          school_id?: string
          school_year_id?: number
          student_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_grade"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student"
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
          avatar_url: string | null
          class_id: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          first_name: string
          gender: string | null
          grade_id: number | null
          id: string
          id_number: string
          last_name: string
          parent_id: string
          school_id: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          class_id?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          first_name: string
          gender?: string | null
          grade_id?: number | null
          id?: string
          id_number: string
          last_name: string
          parent_id: string
          school_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          class_id?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          first_name?: string
          gender?: string | null
          grade_id?: number | null
          id?: string
          id_number?: string
          last_name?: string
          parent_id?: string
          school_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teacher_class_assignments: {
        Row: {
          class_id: string
          created_at: string | null
          created_by: string | null
          id: string
          is_main_teacher: boolean
          school_id: string
          subject_id: string
          teacher_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_main_teacher?: boolean
          school_id: string
          subject_id: string
          teacher_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_main_teacher?: boolean
          school_id?: string
          subject_id?: string
          teacher_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_class_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_class_assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_class_assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          from_school_id: string
          status: Database["public"]["Enums"]["status_enum"]
          student_id: string
          to_school_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          from_school_id: string
          status?: Database["public"]["Enums"]["status_enum"]
          student_id: string
          to_school_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          from_school_id?: string
          status?: Database["public"]["Enums"]["status_enum"]
          student_id?: string
          to_school_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_from_school_id_foreign"
            columns: ["from_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_student_id_foreign"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "transactions_student_id_foreign"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "transactions_student_id_foreign"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_school_id_foreign"
            columns: ["to_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      tuition_settings: {
        Row: {
          annual_fee: number
          created_at: string | null
          government_discount_percentage: number
          grade_id: number
          id: string
          school_id: string
          updated_at: string | null
        }
        Insert: {
          annual_fee: number
          created_at?: string | null
          government_discount_percentage?: number
          grade_id: number
          id?: string
          school_id: string
          updated_at?: string | null
        }
        Update: {
          annual_fee?: number
          created_at?: string | null
          government_discount_percentage?: number
          grade_id?: number
          id?: string
          school_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_grade"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: number
          user_id: string
        }
        Insert: {
          role_id: number
          user_id: string
        }
        Update: {
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          push_token: string | null
          school_id: string | null
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          push_token?: string | null
          school_id?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          push_token?: string | null
          school_id?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_school_id_foreign"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_state_id_foreign"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      attendances_report_view: {
        Row: {
          absences: number | null
          lates: number | null
          month: string | null
          school_years_id: number | null
          student_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendances_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_details_view: {
        Row: {
          class_id: string | null
          enrollment_id: string | null
          first_name: string | null
          id_number: string | null
          last_name: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_method: string | null
          remaining_amount: number | null
          school_id: string | null
          school_year: number | null
          student_id: string | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_view: {
        Row: {
          enrollment_id: string | null
          is_government_affected: boolean | null
          parent_id: string | null
          payment_installment_id: string | null
          payment_plan_id: string | null
          school_id: string | null
          school_year_id: number | null
          student_id: string | null
          student_id_number: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      auto_archive_chats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_tuition_fees: {
        Args: {
          p_grade_id: number
          p_is_government_affected: boolean
        }
        Returns: number
      }
      create_attendance_and_participator_and_homework: {
        Args: {
          attendances: Json
          participators: Json
          homework?: Json
        }
        Returns: string
      }
      generate_invite_teacher_otp: {
        Args: {
          p_school_id: string
        }
        Returns: string
      }
      generate_slug_text: {
        Args: {
          input_name: string
        }
        Returns: string
      }
      get_class_metrics: {
        Args: {
          p_school_id: string
          p_class_id: string
          p_school_year_id?: number
          p_semester_id?: number
        }
        Returns: {
          total_students: number
          late_rate: number
          absent_rate: number
          average_grade: number
        }[]
      }
      get_classes_by_school: {
        Args: {
          school_id: string
        }
        Returns: {
          grade_name: string
          count: number
          subclasses: Json[]
        }[]
      }
      get_group_label: {
        Args: {
          group_date: string
          grouping_level: string
        }
        Returns: string
      }
      get_last_five_inactive_schools: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          email: string
          phone: string
        }[]
      }
      get_locked_payment_details: {
        Args: {
          _enrollment_id: string
        }
        Returns: Json
      }
      get_monthly_attendance_summary: {
        Args: {
          start_date?: string
          end_date?: string
          grouping_level?: string
          sort_col?: string
        }
        Returns: {
          month_label: string
          attendance_count: number
        }[]
      }
      get_statistics: {
        Args: {
          start_date?: string
          end_date?: string
        }
        Returns: {
          school_count: number
          student_count: number
          new_account_count: number
          reconnection_rate: number
        }[]
      }
      get_student_info: {
        Args: {
          parent_user_id: string
        }
        Returns: {
          student_id: string
          first_name: string
          last_name: string
          id_number: string
          class_id: string
          class_name: string
          school_id: string
          school_name: string
          school_image_url: string
        }[]
      }
      get_student_main_teacher: {
        Args: {
          student_uuid: string
        }
        Returns: string
      }
      get_teacher_data: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      get_unique_notes_by_date: {
        Args: {
          p_subject_id: string
          p_class_id: string
        }
        Returns: {
          id: string
          date: string
          is_published: boolean
          publish_date: string
        }[]
      }
      process_grade_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_participation_notes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_payment:
        | {
            Args: {
              _student_id: string
              _amount: number
              _payment_method: string
            }
            Returns: Json
          }
        | {
            Args: {
              _student_id: string
              _school_id: string
              _amount: number
              _payment_method: string
            }
            Returns: Json
          }
      update_existing_class_slugs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_published_notes: {
        Args: {
          p_date: string
        }
        Returns: undefined
      }
    }
    Enums: {
      status_enum: "pending" | "accepted" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
