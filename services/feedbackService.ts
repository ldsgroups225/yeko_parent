import { FEEDBACK_TABLE_ID, supabase } from "@/lib/supabase";
import { FeedbackFormValues } from "@/utils/validators";

export const feedback = {
  // create feedback
  create: async (formValue: FeedbackFormValues) => {
    try {
      const { error } = await supabase
        .from(FEEDBACK_TABLE_ID)
        .insert({
          feedback_type: formValue.feedbackType,
          message: formValue.message,
          user_email: formValue.userEmail,
        })
        .single();

      if (error) throw new Error(error.message);
    } catch (error) {
      console.error("Error creating feedback:", error);
      throw error;
    }
  },
};
