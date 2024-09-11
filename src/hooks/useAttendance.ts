import { attendance } from "@modules/app/services/punctualityService";
import { IAttendanceDTO } from "@modules/app/types/IAttendanceDTO";
import { useState } from "react";

interface UseAttendanceReturn {
  getAttendance: (attendanceId: string) => Promise<IAttendanceDTO | null>;
  getAttendances: (studentId: string) => Promise<IAttendanceDTO[] | null>;
  loading: boolean;
  error: string | null;
}

export const useAttendance = (): UseAttendanceReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAttendance = async (
    attendanceId: string
  ): Promise<IAttendanceDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      return await attendance.getAttendance(attendanceId);
    } catch (err) {
      setError("Failed to get attendance record.");
      console.error("[E_GET_ATTENDANCE]:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAttendances = async (
    studentId: string
  ): Promise<IAttendanceDTO[]> => {
    setLoading(true);
    setError(null);
    try {
      return await attendance.getAttendances(studentId);
    } catch (err) {
      setError("Failed to get attendance records.");
      console.error("[E_GET_ATTENDANCES]:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getAttendance,
    getAttendances,
    loading,
    error,
  };
};
