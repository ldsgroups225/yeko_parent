/**
 * @fileoverview React hook for managing schedule-related operations.
 */

import { schedule } from "@modules/app/services/scheduleService";
import { IScheduleDTO } from "@modules/app/types/IScheduleDTO";
import { useState } from "react";

/**
 * Interface defining the return type of the useSchedule hook.
 */
interface UseScheduleReturn {
  /**
   * Function to fetch schedules for a given class ID.
   * @param {string} classId - The ID of the class to fetch schedules for.
   * @returns {Promise<IScheduleDTO[] | null>} A promise that resolves to an array of schedule objects or null.
   */
  getSchedules: (classId: string) => Promise<IScheduleDTO[] | null>;

  /**
   * Boolean indicating whether a schedule operation is in progress.
   */
  loading: boolean;

  /**
   * String containing an error message if an operation fails, or null if no error.
   */
  error: string | null;
}

/**
 * Custom React hook for managing schedule operations.
 *
 * @returns {UseScheduleReturn} An object containing schedule operations, loading state, and error state.
 */
export const useSchedule = (): UseScheduleReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches schedules for a given class ID.
   *
   * @async
   * @param {string} classId - The ID of the class to fetch schedules for.
   * @returns {Promise<IScheduleDTO[]>} A promise that resolves to an array of schedule objects.
   */
  const getSchedules = async (classId: string): Promise<IScheduleDTO[]> => {
    setLoading(true);
    setError(null);
    try {
      return await schedule.getSchedules(classId);
    } catch (err) {
      setError("Failed to get schedule records.");
      console.error("[E_GET_SCHEDULES]:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getSchedules,
    loading,
    error,
  };
};
