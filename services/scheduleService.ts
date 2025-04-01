/**
 * @fileoverview Service module for handling schedule-related operations.
 */

import { IScheduleDTO } from "@/types/IScheduleDTO";
import { supabase } from "@/lib/supabase";
import { formatting } from "@/utils";
import type { Database } from "@/lib/supabase/types";

type TeacherInfo = {
  teacher_id: string;
  users: { first_name: string; last_name: string };
};

/**
 * Schedule service object containing methods for schedule-related operations.
 */
export const schedule = {
  /**
   * Retrieves schedules for a specific class.
   *
   * @async
   * @param {string} classId - The UUID of the class to fetch schedules for.
   * @returns {Promise<IScheduleDTO[]>} A promise that resolves to an array of schedule objects.
   * @throws {Error} If there's an error fetching the schedules from the database.
   */
  async getSchedules(classId: string): Promise<IScheduleDTO[]> {
    try {
    const scheduleQs = supabase
          .from("schedules")
          .select(`
            id,
            class_id,
            subject_id,
            subjects(name),
            day_of_week,
            start_time,
            end_time,
            room
          `)
          .eq("class_id", classId)

      const teacherQs = supabase
          .from("teacher_class_assignments")
          .select(`
            teacher_id,
            subject_id,
            users!inner(first_name, last_name)
          `)
          .eq("class_id", classId)

      const [
        { data: schedules, error: schedulesError },
        { data: teachers, error: teachersError }
      ] = await Promise.all([scheduleQs, teacherQs]);

      if (schedulesError) throw new Error(schedulesError.message);
      if (teachersError) throw new Error(teachersError.message);

      const getFullName = (user: { first_name: string; last_name: string }) => {
        return formatting.formatFullName(user.first_name, user.last_name);
      };

      return schedules.map((schedule) => {
        const teacher = teachers.find(t => t.subject_id === schedule.subject_id) as TeacherInfo | undefined;
        
        return {
          id: schedule.id,
          classId: schedule.class_id,
          subjectId: schedule.subject_id,
          subjectName: (schedule.subjects as { name: string }).name,
          teacherId: teacher?.teacher_id ?? '',
          teacherName: teacher ? getFullName(teacher.users) : '',
          dayOfWeek: schedule.day_of_week,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          room: schedule.room,
        };
      });
    } catch (error) {
      console.error("Error getting schedule records:", error);
      throw error;
    }
  },
};
