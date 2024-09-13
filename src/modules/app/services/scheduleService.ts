/**
 * @fileoverview Service module for handling schedule-related operations.
 */

import { IScheduleDTO } from "@modules/app/types/IScheduleDTO";
import { supabase } from "@src/lib/supabase";
import { formatting } from "@modules/app/utils";

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
      const { data, error } = await supabase
        .from("schedules")
        .select(
          `
          id,
          class_id,
          subject_id,
          subjects(name),
          teacher_id,
          users(first_name, last_name),
          day_of_week,
          start_time,
          end_time,
          room
        `
        )
        .eq("class_id", classId);

      if (error) throw new Error(error.message);

      const getFullName = (user: { first_name: string; last_name: string }) => {
        return formatting.formatFullName(user.first_name, user.last_name);
      };

      return data.map((record) => ({
        id: record.id,
        classId: record.class_id,
        subjectId: record.subject_id,
        subjectName: (record.subjects as unknown as { name: string }).name,
        teacherId: record.teacher_id,
        teacherName: getFullName(
          record.users as unknown as { first_name: string; last_name: string }
        ),
        dayOfWeek: record.day_of_week,
        startTime: record.start_time,
        endTime: record.end_time,
        room: record.room,
      }));
    } catch (error) {
      console.error("Error getting schedule records:", error);
      throw error;
    }
  },
};
