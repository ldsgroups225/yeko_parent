// lib/supabase/types.ts

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
    PostgrestVersion: "12.2.1 (d3f7cba)"
  }
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
          image_url: string | null
          is_excused: boolean
          reason: string | null
          school_years_id: number
          semesters_id: number
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
          image_url?: string | null
          is_excused?: boolean
          reason?: string | null
          school_years_id: number
          semesters_id: number
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
          image_url?: string | null
          is_excused?: boolean
          reason?: string | null
          school_years_id?: number
          semesters_id?: number
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
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "attendances_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "attendances_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "attendances_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "attendances_semesters_foreign"
            columns: ["semesters_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["semester_id"]
          },
          {
            foreignKeyName: "attendances_semesters_foreign"
            columns: ["semesters_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_semesters_foreign"
            columns: ["semesters_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["semester_id"]
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
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
          is_last_message_read: boolean | null
          last_message: string | null
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
          is_last_message_read?: boolean | null
          last_message?: string | null
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
          is_last_message_read?: boolean | null
          last_message?: string | null
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
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "chats_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "chats_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
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
          max_student: number
          name: string
          school_id: string
          series: string | null
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
          max_student?: number
          name: string
          school_id: string
          series?: string | null
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
          max_student?: number
          name?: string
          school_id?: string
          series?: string | null
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
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      coefficients: {
        Row: {
          coefficient: number
          created_at: string | null
          grade_id: number
          id: string
          school_year_id: number
          series: string | null
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          coefficient: number
          created_at?: string | null
          grade_id: number
          id?: string
          school_year_id: number
          series?: string | null
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          coefficient?: number
          created_at?: string | null
          grade_id?: number
          id?: string
          school_year_id?: number
          series?: string | null
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coefficients_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coefficients_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "coefficients_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coefficients_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "coefficients_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      conduct_categories: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          icon: string
          id: string
          is_active: boolean
          max_points: number
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string
          created_at?: string | null
          description?: string | null
          icon?: string
          id: string
          is_active?: boolean
          max_points: number
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          max_points?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conduct_incidents: {
        Row: {
          category_id: string
          created_at: string | null
          description: string
          id: string
          is_active: boolean
          points_deducted: number
          reported_at: string
          reported_by: string
          school_year_id: number
          semester_id: number
          student_id: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean
          points_deducted: number
          reported_at?: string
          reported_by: string
          school_year_id: number
          semester_id: number
          student_id: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean
          points_deducted?: number
          reported_at?: string
          reported_by?: string
          school_year_id?: number
          semester_id?: number
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_conduct_incidents_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "conduct_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_reporter"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["semester_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["semester_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      conduct_scores: {
        Row: {
          attendance_score: number
          created_at: string | null
          discipline_score: number
          dresscode_score: number
          grade: string
          id: string
          last_updated: string | null
          morality_score: number
          school_year_id: number
          semester_id: number
          student_id: string
          total_score: number | null
          updated_at: string | null
        }
        Insert: {
          attendance_score?: number
          created_at?: string | null
          discipline_score?: number
          dresscode_score?: number
          grade: string
          id?: string
          last_updated?: string | null
          morality_score?: number
          school_year_id: number
          semester_id: number
          student_id: string
          total_score?: number | null
          updated_at?: string | null
        }
        Update: {
          attendance_score?: number
          created_at?: string | null
          discipline_score?: number
          dresscode_score?: number
          grade?: string
          id?: string
          last_updated?: string | null
          morality_score?: number
          school_year_id?: number
          semester_id?: number
          student_id?: string
          total_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_conduct_scores_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["semester_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["semester_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      cron_job_logs: {
        Row: {
          created_at: string | null
          error: string | null
          executed_at: string
          id: number
          job_name: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          executed_at: string
          id?: number
          job_name: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          executed_at?: string
          id?: number
          job_name?: string
        }
        Relationships: []
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
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "homeworks_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homeworks_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "homeworks_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "homeworks_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homeworks_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "homeworks_semesters_foreign"
            columns: ["semesters_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["semester_id"]
          },
          {
            foreignKeyName: "homeworks_semesters_foreign"
            columns: ["semesters_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homeworks_semesters_foreign"
            columns: ["semesters_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["semester_id"]
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
          amount_of_affected: number | null
          day_before_notification: number | null
          due_date: string
          fixed_amount: number | null
          grade_id: number
          id: string
          installment_number: number
          school_id: string
        }
        Insert: {
          amount_of_affected?: number | null
          day_before_notification?: number | null
          due_date: string
          fixed_amount?: number | null
          grade_id: number
          id?: string
          installment_number: number
          school_id: string
        }
        Update: {
          amount_of_affected?: number | null
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
          email: string | null
          expired_at: string
          id: string
          is_used: boolean
          otp: string
          school_id: string
          use_for: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          expired_at?: string
          id?: string
          is_used?: boolean
          otp: string
          school_id: string
          use_for?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          expired_at?: string
          id?: string
          is_used?: boolean
          otp?: string
          school_id?: string
          use_for?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_to_school_email_fkey"
            columns: ["email"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["email"]
          },
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
      lessons_progress_reports: {
        Row: {
          class_id: string
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean
          lessons_progress_reports_config_id: string
          sessions_completed: number
          started_at: string
          updated_at: string
        }
        Insert: {
          class_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          lessons_progress_reports_config_id: string
          sessions_completed?: number
          started_at?: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          lessons_progress_reports_config_id?: string
          sessions_completed?: number
          started_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lpr_class_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "lpr_class_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lpr_class_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "lpr_config_fkey"
            columns: ["lessons_progress_reports_config_id"]
            isOneToOne: false
            referencedRelation: "lessons_progress_reports_config"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons_progress_reports_config: {
        Row: {
          created_at: string
          grade_id: number
          id: string
          lesson: string
          lesson_order: number
          school_id: string
          school_year_id: number
          series: string | null
          sessions_count: number
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          grade_id: number
          id?: string
          lesson: string
          lesson_order: number
          school_id: string
          school_year_id: number
          series?: string | null
          sessions_count: number
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          grade_id?: number
          id?: string
          lesson?: string
          lesson_order?: number
          school_id?: string
          school_year_id?: number
          series?: string | null
          sessions_count?: number
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lprc_grade_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lprc_school_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lprc_school_year_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "lprc_school_year_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lprc_school_year_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "lprc_subject_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "link_student_parent_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "note_details_student_id_foreign"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
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
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "notes_class_id_foreign"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_class_id_foreign"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
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
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "notes_school_year_foreign"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_school_year_foreign"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "notes_semester_foreign"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["semester_id"]
          },
          {
            foreignKeyName: "notes_semester_foreign"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_semester_foreign"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["semester_id"]
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
      parent_otp_requests: {
        Row: {
          created_at: string
          created_by: string | null
          expired_at: string
          id: string
          is_used: boolean
          otp: string
          parent_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expired_at?: string
          id?: string
          is_used?: boolean
          otp: string
          parent_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expired_at?: string
          id?: string
          is_used?: boolean
          otp?: string
          parent_id?: string
        }
        Relationships: []
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
            referencedRelation: "payment_details_view"
            referencedColumns: ["payment_plan_id"]
          },
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
            referencedRelation: "student_enrollment_view"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "fk_enrollment"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
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
          enrollment_id: string
          id: string
          installment_id: string
          paid_at: string | null
          parent_id: string
          payment_method: string
          reference: string
        }
        Insert: {
          amount: number
          enrollment_id: string
          id?: string
          installment_id: string
          paid_at?: string | null
          parent_id: string
          payment_method: string
          reference: string
        }
        Update: {
          amount?: number
          enrollment_id?: string
          id?: string
          installment_id?: string
          paid_at?: string | null
          parent_id?: string
          payment_method?: string
          reference?: string
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
            referencedRelation: "student_enrollment_view"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "fk_enrollment"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "fk_enrollment"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_school_class"
            referencedColumns: ["id"]
          },
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
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "schedules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "schedules_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      school_subjects: {
        Row: {
          created_at: string
          id: string
          school_id: string
          school_year_id: number
          subject_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          school_id: string
          school_year_id: number
          subject_id: string
        }
        Update: {
          created_at?: string
          id?: string
          school_id?: string
          school_year_id?: number
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_subjects_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_subjects_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "school_subjects_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_subjects_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "school_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
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
          status: Database["public"]["Enums"]["school_status_enum"]
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
          status?: Database["public"]["Enums"]["school_status_enum"]
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
          status?: Database["public"]["Enums"]["school_status_enum"]
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
          coefficient: number
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
          coefficient?: number
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
          coefficient?: number
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
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
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
          is_orphan: boolean
          is_redoublement: boolean
          is_subscribed_to_canteen: boolean
          is_subscribed_to_transportation: boolean
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
          is_orphan?: boolean
          is_redoublement?: boolean
          is_subscribed_to_canteen?: boolean
          is_subscribed_to_transportation?: boolean
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
          is_orphan?: boolean
          is_redoublement?: boolean
          is_subscribed_to_canteen?: boolean
          is_subscribed_to_transportation?: boolean
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
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
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
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
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
          birth_place: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          extra_parent: Json | null
          first_name: string
          gender: string | null
          id: string
          id_number: string
          last_name: string
          medical_condition: Json | null
          nationality: string
          parent_id: string
          parent_phone: string | null
          search_document: unknown | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_place?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          extra_parent?: Json | null
          first_name: string
          gender?: string | null
          id?: string
          id_number: string
          last_name: string
          medical_condition?: Json | null
          nationality?: string
          parent_id: string
          parent_phone?: string | null
          search_document?: unknown | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_place?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          extra_parent?: Json | null
          first_name?: string
          gender?: string | null
          id?: string
          id_number?: string
          last_name?: string
          medical_condition?: Json | null
          nationality?: string
          parent_id?: string
          parent_phone?: string | null
          search_document?: unknown | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string | null
          id: string
          name: string
          order: number | null
          short_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          order?: number | null
          short_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          order?: number | null
          short_name?: string | null
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
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "teacher_class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "transactions_student_id_foreign"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
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
          additional_criteria: Json | null
          annual_fee: number
          canteen_fee: number
          created_at: string | null
          government_annual_fee: number
          grade_id: number
          id: string
          orphan_discount: number
          orphan_discount_amount: number
          school_id: string
          transportation_fee: number
          updated_at: string | null
        }
        Insert: {
          additional_criteria?: Json | null
          annual_fee: number
          canteen_fee?: number
          created_at?: string | null
          government_annual_fee?: number
          grade_id: number
          id?: string
          orphan_discount?: number
          orphan_discount_amount?: number
          school_id: string
          transportation_fee?: number
          updated_at?: string | null
        }
        Update: {
          additional_criteria?: Json | null
          annual_fee?: number
          canteen_fee?: number
          created_at?: string | null
          government_annual_fee?: number
          grade_id?: number
          id?: string
          orphan_discount?: number
          orphan_discount_amount?: number
          school_id?: string
          transportation_fee?: number
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
          month_numeric: number | null
          school_years_id: number | null
          semester_id: number | null
          student_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendances_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "attendances_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_school_years_foreign"
            columns: ["school_years_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "attendances_semesters_foreign"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["semester_id"]
          },
          {
            foreignKeyName: "attendances_semesters_foreign"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_semesters_foreign"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["semester_id"]
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
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
      average_grades_view_with_rank: {
        Row: {
          average_grade: number | null
          class_id: string | null
          conduite: number | null
          rank: string | null
          school_year_id: number | null
          semester_id: number | null
          student_id: string | null
          subject_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_subject_id_foreign"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      class_year_average_view: {
        Row: {
          class_id: string | null
          class_name: string | null
          grade_id: number | null
          grade_name: string | null
          school_year_id: number | null
          semester_data: Json | null
          semesters_with_data: number | null
          series: string | null
          student_count: number | null
          total_semesters: number | null
          year_average: number | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
        ]
      }
      conduct_stats_view: {
        Row: {
          average_score: number | null
          blame_count: number | null
          bonne_count: number | null
          excellence_count: number | null
          excellence_rate: number | null
          mauvaise_count: number | null
          passable_count: number | null
          school_id: string | null
          school_year_id: number | null
          semester_id: number | null
          total_students: number | null
          tres_bonne_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_conduct_scores_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["semester_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["semester_id"]
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
          payment_plan_id: string | null
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
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
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
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
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
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
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
      recent_conduct_incidents_view: {
        Row: {
          category_color: string | null
          category_id: string | null
          category_name: string | null
          class_name: string | null
          description: string | null
          first_name: string | null
          id: string | null
          id_number: string | null
          last_name: string | null
          points_deducted: number | null
          reported_at: string | null
          reporter_first_name: string | null
          reporter_last_name: string | null
          student_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_conduct_incidents_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "conduct_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_details_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "payment_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_conduct_incidents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_conduct_summary_view: {
        Row: {
          absences: number | null
          attendance_rate: number | null
          attendance_score: number | null
          avatar_url: string | null
          class_id: string | null
          class_name: string | null
          discipline_score: number | null
          dresscode_score: number | null
          first_name: string | null
          grade: string | null
          id_number: string | null
          incident_count: number | null
          last_name: string | null
          last_updated: string | null
          lates: number | null
          morality_score: number | null
          recent_incidents: number | null
          school_id: string | null
          school_year_id: number | null
          semester_id: number | null
          student_id: string | null
          total_score: number | null
          total_sessions: number | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["semester_id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conduct_scores_semester"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["semester_id"]
          },
        ]
      }
      student_enrollment_view: {
        Row: {
          class_id: string | null
          class_name: string | null
          created_at: string | null
          enrollment_id: string | null
          enrollment_status: string | null
          first_name: string | null
          id_number: string | null
          is_government_affected: boolean | null
          last_name: string | null
          parent_id: string | null
          school_id: string | null
          school_year_id: number | null
          student_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
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
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
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
      student_financial_summary_view: {
        Row: {
          amount_paid: number | null
          grade_id: number | null
          is_up_to_date: boolean | null
          overdue_amount: number | null
          paid_for_due_installments: number | null
          school_id: string | null
          school_year_id: number | null
          student_id: string | null
          total_due_to_date: number | null
          total_tuition: number | null
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
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
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
      student_payment_status_view: {
        Row: {
          classroom: string | null
          enrollment_id: string | null
          first_name: string | null
          id_number: string | null
          is_up_to_date: boolean | null
          last_name: string | null
          last_payment_amount: number | null
          last_payment_date: string | null
          overdue_amount: number | null
          remaining_amount: number | null
          school_id: string | null
          school_year_id: number | null
          search_document: unknown | null
          student_id: string | null
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
            referencedRelation: "average_grades_view_with_rank"
            referencedColumns: ["school_year_id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_school_year"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "student_semester_average_view"
            referencedColumns: ["school_year_id"]
          },
        ]
      }
      student_semester_average_view: {
        Row: {
          class_id: string | null
          grade_id: number | null
          rank_count: number | null
          rank_in_class: number | null
          school_year_id: number | null
          semester_average: number | null
          semester_id: number | null
          series: string | null
          student_id: string | null
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
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_year_average_view"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["class_id"]
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
            referencedRelation: "student_conduct_summary_view"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_payment_status_view"
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
    }
    Functions: {
      auto_archive_chats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_tuition_fees: {
        Args: {
          p_additional_params?: Json
          p_grade_id: number
          p_is_government_affected: boolean
          p_is_orphan: boolean
          p_is_subscribed_to_canteen: boolean
          p_is_subscribed_to_transportation: boolean
          p_school_id: string
        }
        Returns: number
      }
      create_attendance_and_participator_and_homework: {
        Args: { attendances: Json; homework?: Json; participators: Json }
        Returns: string
      }
      distribute_extra_fee: {
        Args: {
          p_amount: number
          p_multiplier: number
          p_number_of_installment: number
        }
        Returns: Database["public"]["CompositeTypes"]["distribute_installment_extra_fee_result"][]
      }
      generate_invite_teacher_otp: {
        Args: { p_school_id: string }
        Returns: string
      }
      generate_slug_text: {
        Args: { input_name: string }
        Returns: string
      }
      get_class_metrics: {
        Args: {
          p_class_id: string
          p_school_id: string
          p_school_year_id?: number
          p_semester_id?: number
        }
        Returns: {
          absent_rate: number
          average_grade: number
          late_rate: number
          total_students: number
        }[]
      }
      get_classes_by_school: {
        Args: { school_id: string }
        Returns: {
          count: number
          grade_name: string
          subclasses: Json[]
        }[]
      }
      get_group_label: {
        Args: { group_date: string; grouping_level: string }
        Returns: string
      }
      get_last_five_inactive_schools: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          name: string
          phone: string
        }[]
      }
      get_locked_payment_details: {
        Args: { _enrollment_id: string }
        Returns: Json
      }
      get_monthly_attendance_summary: {
        Args: {
          end_date?: string
          grouping_level?: string
          sort_col?: string
          start_date?: string
        }
        Returns: {
          attendance_count: number
          month_label: string
        }[]
      }
      get_statistics: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          new_account_count: number
          reconnection_rate: number
          school_count: number
          student_count: number
        }[]
      }
      get_student_info: {
        Args: { parent_user_id: string }
        Returns: {
          avatar_url: string
          class_id: string
          class_name: string
          first_name: string
          id_number: string
          last_name: string
          school_id: string
          school_image_url: string
          school_name: string
          student_id: string
        }[]
      }
      get_student_main_teacher: {
        Args: { student_uuid: string }
        Returns: string
      }
      get_teacher_data: {
        Args: { user_id: string }
        Returns: Json
      }
      get_unique_notes_by_date: {
        Args: { p_class_id: string; p_subject_id: string }
        Returns: {
          date: string
          id: string
          is_published: boolean
          publish_date: string
        }[]
      }
      mark_chat_read: {
        Args: { chat_id_param: string; user_id_param: string }
        Returns: undefined
      }
      process_payment: {
        Args:
          | {
              _amount: number
              _payment_method: string
              _school_id: string
              _student_id: string
            }
          | { _amount: number; _payment_method: string; _student_id: string }
        Returns: Json
      }
      refresh_average_grades_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_class_year_average_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_student_semester_average_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      toggle_student_service: {
        Args: {
          p_enrollment_id: string
          p_is_subscribing: boolean
          p_service_type: string
        }
        Returns: string
      }
      update_existing_class_slugs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_lesson_progress: {
        Args: {
          p_class_id: string
          p_is_force_completed: boolean
          p_sessions_to_add: number
          p_subject_id: string
        }
        Returns: Json
      }
      update_published_notes: {
        Args: { p_date: string }
        Returns: undefined
      }
      update_student_conduct_scores: {
        Args: {
          p_school_year_id: number
          p_semester_id: number
          p_student_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      school_status_enum: "private" | "public"
      status_enum: "pending" | "accepted" | "rejected"
    }
    CompositeTypes: {
      distribute_installment_extra_fee_result: {
        amount: number | null
      }
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
      school_status_enum: ["private", "public"],
      status_enum: ["pending", "accepted", "rejected"],
    },
  },
} as const
