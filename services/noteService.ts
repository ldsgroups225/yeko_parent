import { INoteDTO } from "@/types/INoteDTO";
import { NOTE_DETAILS_TABLE_ID, supabase } from "@/lib/supabase";

export const note = {
  async getNotes(studentId: string): Promise<INoteDTO[]> {
    try {
      const { data, error } = await supabase
      .from(NOTE_DETAILS_TABLE_ID)
      .select(`
        id,
        note,
        graded_at,
        student_id,
        notes!inner (
          id,
          title,
          total_points,
          created_at,
          school_year_id,
          semester_id,
          is_active,
          is_published
        ),
        subjects!inner (
          id,
          name
        )
      `)
      // TODO: filter notes by selected month from schoolYear
      // .eq('notes.school_year_id', yearId)
      // .eq('notes.semester_id', semesterId)
      .eq('student_id', studentId)
      .eq('notes.is_active', true)
      .eq('notes.is_active', true)
      .eq('notes.is_published', true);

      if (error) throw new Error(error.message);

      return data.map((note) => ({
        id: note.id,
        subjectId: (note.subjects as unknown as { id: string }).id,
        subjectName: (note.subjects as unknown as { name: string }).name,
        note: note.note,
        date: new Date(note.graded_at),
      }));
    } catch (error) {
      console.error("Error getting note records:", error);
      throw error;
    }
  },
};
