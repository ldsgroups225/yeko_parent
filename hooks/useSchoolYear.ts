import { ISchoolYear, ISemester } from "@/types/ISchoolYearDTO";
import { schoolYear } from "@/services/schoolYearService";
import { useState } from "react";

interface UseSchoolYearReturn {
  getSchoolYears: () => Promise<ISchoolYear[] | null>;
  getSemesters: (schoolYearId: number) => Promise<ISemester[] | null>;
  loading: boolean;
  error: string | null;
}

export const useSchoolYear = (): UseSchoolYearReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSchoolYears = async (): Promise<ISchoolYear[] | null> => {
    setLoading(true);
    setError(null);
    try {
      return await schoolYear.getSchoolYears();
    } catch (err) {
      setError("Failed to get school years.");
      console.error("[E_GET_SCHOOL_YEARS]:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSemesters = async (
    schoolYearId: number
  ): Promise<ISemester[] | null> => {
    setLoading(true);
    setError(null);
    try {
      return await schoolYear.getSemesters(schoolYearId);
    } catch (err) {
      setError("Failed to get semesters.");
      console.error("[E_GET_SEMESTERS]:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getSchoolYears,
    getSemesters,
    loading,
    error,
  };
};
