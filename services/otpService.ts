// ---- File: otpService.ts ----

import { supabase } from "@/lib/supabase";

/**
 * Generates a random 6-digit OTP string.
 * @returns {string} A 6-digit OTP.
 */
const generateSixDigitOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const otp = {
  /**
   * Generates a 6-digit OTP for the currently authenticated user,
   * stores it in the database, and returns it.
   * The OTP is typically used for enrolling a child account.
   *
   * @async
   * @returns {Promise<string>} A promise that resolves with the generated 6-digit OTP.
   * @throws {Error} If the user is not authenticated or if there's an error during OTP generation/storage.
   */
  async generateOTP(): Promise<string> {
    try {
      // 1. Check if user is authenticated
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error('Unauthorized user trying to generate OTP:', userError?.message);
        throw new Error('Reconnectez-vous pour générer un code.');
      }

      // 2. Generate the 6-digit OTP
      const newestOTP = generateSixDigitOtp();

      // 3. Insert the OTP request into the database
      const { data, error } = await supabase
        .from('parent_otp_requests')
        .insert({
          parent_id: userData.user.id,
          otp: newestOTP,
        })
        .select('otp')
        .single();

      if (error) {
        console.error('[E_OTP_CREATION]', error.message);
        throw new Error('Erreur lors de la génération de votre code. Veuillez réessayer.');
      }

      // 4. Return the generated OTP
      return data.otp;

    } catch (error) {
      console.error("Error generating OTP:", error);
      throw error;
    }
  },
};
