import { note } from "@/services/noteService";
import { INoteDTO } from "@/types/INoteDTO";
import { useState } from "react";

interface UseNoteReturn {
  getNotes: (studentId: string) => Promise<INoteDTO[] | null>;
  loading: boolean;
  error: string | null;
}

export const useNote = (): UseNoteReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNotes = async (
    studentId: string
  ): Promise<INoteDTO[]> => {
    setLoading(true);
    setError(null);
    try {
      return await note.getNotes(studentId);
    } catch (err) {
      setError("Failed to get note records.");
      console.error("[E_GET_NOTES]:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getNotes,
    loading,
    error,
  };
};
