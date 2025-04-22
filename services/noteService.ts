import { INoteDTO } from "@/types/INoteDTO";
import { NOTE_TYPE, supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase/types";

// Define specific types for the queries if needed for clarity
type NoteWithSubject = Database['public']['Tables']['notes']['Row'] & {
  subjects: Database['public']['Tables']['subjects']['Row'] | null;
};

type NoteWithSubjectAndDetails = NoteWithSubject & {
  details: Array<Database['public']['Tables']['note_details']['Row']>;
};


export const note = {
  async getNotes(studentId: string, noteType: NOTE_TYPE[], schoolYearId: number, semesterId?: number, month?: number): Promise<INoteDTO[]> {
    const isHomeworkRequest = noteType.length === 1 && noteType[0] === NOTE_TYPE.HOMEWORK;

    try {
      // --- Homework Fetching Logic ---
      if (isHomeworkRequest) {
        // Fetch class ID for the student in the specified school year
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('student_school_class')
          .select('class_id')
          .eq('student_id', studentId)
          .eq('school_year_id', schoolYearId)
          .eq('enrollment_status', 'accepted')
          .eq('is_active', true)
          .maybeSingle();

        if (enrollmentError) throw new Error(`Error fetching enrollment: ${enrollmentError.message}`);
        if (!enrollmentData?.class_id) {
          console.warn(`No active class found for student ${studentId} in school year ${schoolYearId}. Cannot fetch homework.`);
          return [];
        }

        const classId = enrollmentData.class_id;

        // Build homework query
        let homeworkQuery = supabase
          .from('notes')
          .select(`
            id, is_graded, due_date, created_at,
            subjects!inner (id, name)
          `)
          .eq('class_id', classId)
          .eq('note_type', NOTE_TYPE.HOMEWORK)
          .eq('school_year_id', schoolYearId)
          .eq('is_active', true)
          .eq('is_published', true);

        // Apply semester filter
        if (semesterId && !month) {
          homeworkQuery = homeworkQuery.eq('semester_id', semesterId);
        }

        // Apply month filter (using due_date)
        if (month !== undefined && month >= 0 && month <= 11) {
            const calendarYear = month >= 8 ? schoolYearId : schoolYearId + 1; // Sept-Dec use schoolYearId, Jan-Jun use next year
            const startDate = new Date(calendarYear, month, 1); // First day of the month
            const endDate = new Date(calendarYear, month + 1, 0); // Last day of the month

            homeworkQuery = homeworkQuery
                .gte('due_date', startDate.toISOString())
                .lte('due_date', endDate.toISOString());
        }


        const { data: homeworkData, error: homeworkError } = await homeworkQuery
          .order('due_date', { ascending: false })
          .returns<NoteWithSubject[]>();

        if (homeworkError) throw new Error(`Error fetching homework: ${homeworkError.message}`);

        // Map homework data
        return homeworkData.map((hw) => ({
          id: hw.id,
          subjectId: hw.subjects!.id,
          subjectName: hw.subjects!.name,
          note: 0,
          date: new Date(hw.created_at),
          dueDate: hw.due_date ? new Date(hw.due_date) : null,
          isGraded: hw.is_graded,
        } satisfies INoteDTO));

      }

      // --- Non-Homework Note Fetching Logic ---
      else {
        let notesQuery = supabase
          .from('notes')
          .select(`
            id, is_graded, due_date, created_at,
            subjects!inner (id, name),
            details:note_details!inner (id, note, graded_at, student_id)
          `)
          .eq('note_details.student_id', studentId)
          .in('note_type', noteType)
          .eq('school_year_id', schoolYearId)
          .eq('is_active', true)
          .eq('is_published', true);

        // Apply semester filter
        if (semesterId && !month) {
          notesQuery = notesQuery.eq('semester_id', semesterId);
        }

         // Apply month filter (using due_date, consistent with homework)
         if (month !== undefined && month >= 0 && month <= 11) {
            const calendarYear = month >= 8 ? schoolYearId : schoolYearId + 1;
            const startDate = new Date(calendarYear, month, 1);
            const endDate = new Date(calendarYear, month + 1, 0);

            notesQuery = notesQuery
                .gte('due_date', startDate.toISOString())
                .lte('due_date', endDate.toISOString());
        }

        const { data: notesData, error: notesError } = await notesQuery
          .order('due_date', { ascending: false })
          .returns<NoteWithSubjectAndDetails[]>();

        if (notesError) throw new Error(`Error fetching notes: ${notesError.message}`);

        // Map notes data (already filtered by inner join on details)
        return notesData.map((dt) => ({
          id: dt.details[0].id,
          subjectId: dt.subjects!.id,
          subjectName: dt.subjects!.name,
          note: dt.details[0].note ?? 0,
          date: new Date(dt.created_at),
          dueDate: dt.due_date ? new Date(dt.due_date) : null,
          isGraded: dt.is_graded,
        } satisfies INoteDTO));
      }

    } catch (error) {
      console.error("Error getting records:", error);
      if (error instanceof Error) throw error;
      throw new Error("Erreur lors de la récupération des notes");
    }
  },
};
