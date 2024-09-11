import { IHomeworkDTO } from "@modules/app/types/IHomeworkDTO";
import { HOMEWORK_TABLE_ID, supabase } from "@src/lib/supabase";

export const homework = {
  async getHomework(homeworkId: string): Promise<IHomeworkDTO> {
    try {
      const { data, error } = await supabase
        .from(HOMEWORK_TABLE_ID)
        .select("id, subjects(name), due_date, is_graded")
        .eq("id", homeworkId)
        .single();

      if (error) throw new Error(error.message);

      return {
        id: data.id,
        subject: (data.subjects as unknown as { name: string }).name,
        dueDate: data.due_date,
        isGraded: data.is_graded,
      };
    } catch (error) {
      console.error("Error getting homework record:", error);
      throw error;
    }
  },

  async getHomeworks(classId: string): Promise<IHomeworkDTO[]> {
    try {
      const now = new Date();

      const { data, error } = await supabase
        .from(HOMEWORK_TABLE_ID)
        .select("id, subjects(name), due_date, is_graded")
        .eq("class_id", classId)
        .gte("due_date", now.toISOString());

      if (error) throw new Error(error.message);

      return data.map((document) => ({
        id: document.id,
        subject: (document.subjects as unknown as { name: string }).name,
        dueDate: document.due_date,
        isGraded: document.is_graded,
      }));
    } catch (error) {
      console.error("Error getting homework records:", error);
      throw error;
    }
  },
};
