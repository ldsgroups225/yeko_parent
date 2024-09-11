import { homework } from "@modules/app/services/homeworkService";
import { IHomeworkDTO } from "@modules/app/types/IHomeworkDTO";
import { useState } from "react";

interface UseHomeworkReturn {
  getHomework: (homeworkId: string) => Promise<IHomeworkDTO | null>;
  getHomeworks: (classId: string) => Promise<IHomeworkDTO[] | null>;
  loading: boolean;
  error: string | null;
}

export const useHomework = (): UseHomeworkReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHomework = async (
    homeworkId: string
  ): Promise<IHomeworkDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      return await homework.getHomework(homeworkId);
    } catch (err) {
      setError("Failed to get homework record.");
      console.error("[E_GET_HOMEWORK]:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getHomeworks = async (
    classId: string
  ): Promise<IHomeworkDTO[] | null> => {
    setLoading(true);
    setError(null);
    try {
      return await homework.getHomeworks(classId);
    } catch (err) {
      setError("Failed to get homework records.");
      console.error("[E_GET_HOMEWORKS]:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getHomework,
    getHomeworks,
    loading,
    error,
  };
};
