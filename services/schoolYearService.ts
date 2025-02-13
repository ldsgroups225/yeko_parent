import { ISchoolYear, ISemester } from "@/types/ISchoolYearDTO";
import { supabase } from "@/lib/supabase";

export const schoolYear = {
  getSchoolYears: async (): Promise<ISchoolYear[]> => {
    const { data, error } = await supabase
    .from('school_years')
    .select('id, name:academic_year_name')
    .order('end_year', { ascending: false })
    .throwOnError()

    if (error) {
      console.error('Error fetching school years:', error)
      throw new Error('Erreur lors de la récupération des années scolaires')
    }

    return data.map((document) => ({
      id: document.id,
      name: document.name,
    }))
  },

  getSemesters: async (schoolYearId: number): Promise<ISemester[]> => {
    const { data, error } = await supabase
    .from('semesters')
    .select('id, semester_name, start_date, is_current')
    .eq('school_year_id', schoolYearId)
    .order('start_date', { ascending: true })
    .throwOnError()

    if (error) {
      console.error('Error fetching semesters:', error)
      throw new Error('Erreur lors de la récupération des semestres')
    }

    return data.map((semester) => ({
      id: semester.id,
      name: semester.semester_name,
      startDate: semester.start_date,
      isCurrent: semester.is_current,
    }))
  }
}
