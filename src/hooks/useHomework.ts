import { homework } from '@modules/core/services/homeworkService';
import { IHomeworkDTO } from '@modules/core/types/IHomeworkDTO';
import { useState } from 'react';

/**
 * Return type for the `useHomework` hook. */
interface UseHomeworkReturn {
  getHomework: (homeworkId: string) => Promise<IHomeworkDTO | null>;
  getHomeworks: (classId: string) => Promise<IHomeworkDTO[] | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook for managing homework-related data and actions.
 *
 * Provides functions for getting homework records, while managing loading
 * and error states.
 *
 * @returns {UseHomeworkReturn} An object containing functions and state for managing homework data.
 */
export const useHomework = (): UseHomeworkReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Asynchronously gets an homework record by ID.
   *
   * Updates the loading and error states accordingly.
   *
   * @param {string} homeworkId - The ID of the homework record to retrieve.
   * @returns {Promise<Homework | null>} A promise that resolves to the homework object if successful,
   *                                             or null if an error occurs.
   */
  const getHomework = async (homeworkId: string): Promise<IHomeworkDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      return await homework.getHomework(homeworkId);
    } catch (err) {
      setError('Failed to get homework record.');
      console.error('[E_GET_HOMEWORK]:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Asynchronously gets all homework records.
   *
   * Updates the loading and error states accordingly.
   *
   * @returns {Promise<Homework[] | null>} A promise that resolves to an array of homework objects if successful,
   *                                               or null if an error occurs.
   */
  const getHomeworks = async (classId: string): Promise<IHomeworkDTO[] | null> => {
    setLoading(true);
    setError(null);
    try {
      return await homework.getHomeworks(classId);
    } catch (err) {
      setError('Failed to get homework records.');
      console.error('[E_GET_HOMEWORKS]:', err);
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
