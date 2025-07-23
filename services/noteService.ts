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
  async getNotes(studentId: string, classId: string, noteType: NOTE_TYPE[], schoolYearId: number, semesterId?: number, month?: number): Promise<{
    average: number;
    rank: string;
    notes: INoteDTO[];
  }[]> {
    const isHomeworkRequest = noteType.length === 1 && noteType[0] === NOTE_TYPE.HOMEWORK;

    try {
      // --- Homework Fetching Logic ---
      if (isHomeworkRequest) {
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
        return [{
          average: 0,
          rank: '0',
          notes: homeworkData.map((hw) => ({
            id: hw.id,
            subjectId: hw.subjects!.id,
            subjectName: hw.subjects!.name,
            note: 0,
            date: new Date(hw.created_at),
            dueDate: hw.due_date ? new Date(hw.due_date) : null,
            isGraded: hw.is_graded,
          } satisfies INoteDTO))
        }];

      }

      // --- Non-Homework Note Fetching Logic ---
      else {
        let averageQs = supabase
          .from('average_grades_view_with_rank')
          .select('average_grade, subject_id, rank')
          .eq('student_id', studentId)
          .eq('school_year_id', schoolYearId)
          .eq('semester_id', semesterId!)

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

        const [
          { data: averages, error: averageError },
          { data: notesData, error: notesError }] = await Promise.all([
            averageQs,
          notesQuery
          .order('due_date', { ascending: false })
          .returns<NoteWithSubjectAndDetails[]>(),
        ])

        if (averageError || notesError) {
          throw new Error(`Error fetching notes: ${notesError?.message} || ${averageError?.message}`);
        }

        // Map notes data (already filtered by inner join on details)
        return averages?.map((avg) => ({
          average: avg.average_grade ?? 0,
          rank: avg.rank ?? '0',
          notes: notesData
            ?.filter((note) => note.subjects!.id === avg.subject_id)
            .map((note) => ({
              id: note.details[0].id,
              subjectId: note.subjects!.id,
              subjectName: note.subjects!.name,
              note: note.details[0].note ?? 0,
              date: new Date(note.created_at),
              dueDate: note.due_date ? new Date(note.due_date) : null,
              isGraded: note.is_graded,
            } satisfies INoteDTO)),
        }));
      }
    } catch (error) {
      console.error("Error getting records:", error);
      if (error instanceof Error) throw error;
      throw new Error("Erreur lors de la récupération des notes");
    }
  },
};
