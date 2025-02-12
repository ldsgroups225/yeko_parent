import { INoteDTO } from "@/types/INoteDTO";
import { NOTE_TYPE, supabase } from "@/lib/supabase";

export const note = {
  async getNotes(studentId: string, noteType: NOTE_TYPE[]): Promise<INoteDTO[]> {
    const isHomework = noteType.length === 1 && noteType[0] === NOTE_TYPE.HOMEWORK;

    try {
      let classId = isHomework ? (await supabase.from('students').select('class_id').eq('id', studentId).single().throwOnError()).data?.class_id : null;
      let query = supabase
        .from('notes')
        .select(`
          id, is_graded, due_date, created_at,
          subjects!inner (id, name),
          details:note_details (id, note, graded_at, student_id)
          `)
        // TODO: filter notes by selected month from schoolYear
        // .eq('notes.school_year_id', yearId)
        // .eq('notes.semester_id', semesterId)
        .eq('is_active', true)
        .eq('is_published', true)
        
        if (classId) {
          query = query
            .eq('class_id', classId)
            .eq('note_type', noteType[0])
            .gte('due_date', new Date())
        } else {
          query = query
            .eq('note_details.student_id', studentId)
            .in('note_type', noteType)
        }
  
      const { data, error } = await query.order('due_date', { ascending: false });
  
      if (error) throw new Error(error.message);
  
      return data.map((dt) => ({
        id:  classId ? dt.id : dt.details[0].id,
        subjectId: dt.subjects.id,
        subjectName: dt.subjects.name,
        note: classId ? 0 : dt.details[0].note ?? 0,
        date: new Date(dt.created_at),
        dueDate: dt.due_date ? new Date(dt.due_date) : null,
        isGraded: dt.is_graded,
      } satisfies INoteDTO));
    } catch (error) {
      console.error("Error getting note records:", error);
      throw error;
    }
  },
};
