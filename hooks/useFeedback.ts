import { feedback } from "@/services/feedbackService";
import { FeedbackFormValues } from "@/utils/validators";
import { useState } from "react";

interface UseFeedbackReturn {
  createFeedback: (formValue: FeedbackFormValues) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useFeedback = (): UseFeedbackReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFeedback = async (
    formValue: FeedbackFormValues
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await feedback.create(formValue);
    } catch (err) {
      setError("Failed to create feedback.");
      console.error("[E_CREATE_FEEDBACK]:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    createFeedback,
    loading,
    error,
  };
};
