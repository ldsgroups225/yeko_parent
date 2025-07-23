import { NOTE_TYPE } from "@/lib/supabase";
import { note } from "@/services/noteService";
import { INoteDTO } from "@/types/INoteDTO";
import { useState } from "react";

interface NoteGroup {
  average: number;
  rank: string;
  notes: INoteDTO[];
}

interface UseNoteReturn {
  getNotes: (
    studentId: string,
    classId: string,
    noteType: NOTE_TYPE[],
    schoolYearId: number,
    semesterId?: number,
    month?: number,
  ) => Promise<NoteGroup[] | null>;
  loading: boolean;
  error: string | null;
}

export const useNote = (): UseNoteReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNotes = async (
    studentId: string,
    classId: string,
    noteType: NOTE_TYPE[],
    schoolYearId: number,
    semesterId?: number,
    month?: number,
  ): Promise<NoteGroup[]> => {
    setLoading(true);
    setError(null);
    try {
      return await note.getNotes(studentId, classId, noteType, schoolYearId, semesterId, month);
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
