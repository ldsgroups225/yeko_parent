import { INoteDTO } from "@/types/INoteDTO";
import { NOTE_DETAILS_TABLE_ID, NOTE_TYPE, supabase } from "@/lib/supabase";

export const note = {
  async getNotes(studentId: string, noteType: NOTE_TYPE[]): Promise<INoteDTO[]> {
    try {
      let query = supabase
        .from('note_details')
        .select(`
          id,
          note,
          graded_at,
          notes!inner (
            id,
            created_at,
            due_date,
            is_graded,
            subjects!inner (
              id,
              name
            )
          )
        `)
        // TODO: filter notes by selected month from schoolYear
        // .eq('notes.school_year_id', yearId)
        // .eq('notes.semester_id', semesterId)
        .eq('student_id', studentId)
        .eq('notes.is_active', true)
        .eq('notes.is_published', true)
  
      if (noteType.length > 1) {
        query = query.in('notes.note_type', noteType)
      } else {
        query = query.eq('notes.note_type', noteType[0])
      }
  
      const { data, error } = await query;
  
      if (error) throw new Error(error.message);
  
      return data.map((noteDetail) => ({
        id: noteDetail.id,
        subjectId: noteDetail.notes.subjects.id,
        subjectName: noteDetail.notes.subjects.name,
        note: noteDetail.note ?? 0,
        date: new Date(noteDetail.notes.created_at),
        dueDate:  noteDetail.notes.due_date && new Date(noteDetail.notes.due_date),
        isGraded: noteDetail.notes.is_graded
      }));
    } catch (error) {
      console.error("Error getting note records:", error);
      throw error;
    }
  },
};
