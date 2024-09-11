import { IAttendanceDTO } from "@modules/app/types/IAttendanceDTO";
import { ATTENDANCE_TABLE_ID, supabase } from "@src/lib/supabase";

export const attendance = {
  async getAttendance(attendanceId: string): Promise<IAttendanceDTO> {
    try {
      const { data, error } = await supabase
        .from(ATTENDANCE_TABLE_ID)
        .select(
          "id, status, is_excused, subjects(name), starts_at, ends_at, created_at"
        )
        .eq("id", attendanceId)
        .single();

      if (error) throw new Error(error.message);

      return {
        id: data.id,
        status: data.status,
        isExcused: data.is_excused,
        subject: (data.subjects as unknown as { name: string }).name,
        date: data.created_at,
        startTime: data.starts_at,
        endTime: data.ends_at,
      };
    } catch (error) {
      console.error("Error getting attendance record:", error);
      throw error;
    }
  },

  async getAttendances(studentId: string): Promise<IAttendanceDTO[]> {
    try {
      const { data, error } = await supabase
        .from(ATTENDANCE_TABLE_ID)
        .select(
          "id, status, is_excused, subjects(name), starts_at, ends_at, created_at"
        )
        .eq("student_id", studentId);

      if (error) throw new Error(error.message);

      return data.map((document) => ({
        id: document.id,
        date: document.created_at,
        status: document.status,
        isExcused: document.is_excused,
        subject: (document.subjects as unknown as { name: string }).name,
        startTime: document.starts_at,
        endTime: document.ends_at,
      }));
    } catch (error) {
      console.error("Error getting attendance records:", error);
      throw error;
    }
  },
};
