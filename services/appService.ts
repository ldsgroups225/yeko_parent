import { supabase, USERS_TABLE_ID } from "@/lib/supabase";
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
} from "@supabase/auth-js";
import { ERole } from "@/types/ILoginDTO";

interface IGetSession {
  data: {
    session: Session | null;
  };
  error: AuthError | null;
}

/**
 * Authentication service for handling user accounts and sessions using Supabase.
 */
export const auth = {
  /**
   * Creates a new user account and assigns a role.
   *
   * @param {string} email - The email address of the user.
   * @param {string} password - The password for the new account.
   * @param {string} [firstName] - The user's first name (optional).
   * @param {string} [lastName] - The user's last name (optional).
   * @param {string} [phone] - The user's phone number (optional).
   * @returns {Promise<AuthResponse>} - The response from the Supabase sign-up request.
   * @throws {Error} - Throws an error if account creation fails or role assignment fails.
   */
  async createAccount(
    email: string,
    password: string,
    // firstName?: string,
    // lastName?: string,
    // phone?: string
  ): Promise<AuthResponse> {
    try {
      const newAccountResponse = await supabase.auth.signUp({
        email,
        password,
        // options: {
        //   data: {
        //     first_name: firstName,
        //     last_name: lastName,
        //     phone: phone,
        //   },
        // },
      });

      if (newAccountResponse.error) {
        throw new Error("Une erreur est survenue lors de la création du compte. Veuillez réessayer.");
      }

      // create it role
      const { error: newRoleError } = await supabase.from("user_roles").insert({
        user_id: newAccountResponse.data.user!.id,
        role_id: ERole.PARENT,
      });

      if (newRoleError) {
        throw new Error("Une erreur est survenue lors de la création du compte. Veuillez réessayer.");
      }

      return newAccountResponse;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logs in a user using email and password.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<AuthTokenResponsePassword>} - The response containing the session data.
   * @throws {Error} - Throws an error if login fails.
   */
  async loginWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      data.user?.confirmed_at
      if (error) {
        if (error.message === 'Invalid login credentials') throw new Error("Email ou mot de passe incorrect");
        if (error.message === 'Email not confirmed') throw new Error("Veuillez confirmer votre email avec le lien reçu par email.");
        else throw new Error('Une erreur est survenue lors de la connexion');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieves the current session information of the authenticated user.
   *
   * @returns {Promise<IGetSession>} - An object containing session data or an error.
   * @throws {Error} - Throws an error if session retrieval fails.
   */
  async getAccount(): Promise<IGetSession> {
    try {
      const response = await supabase.auth.getSession();
      if (response.error) throw new Error(response.error.message);
      return response;
    } catch (error) {
      console.error("Error getting account information:", error);
      throw error;
    }
  },

  /**
   * Deletes the current user session.
   *
   * @returns {Promise<{ error: AuthError | null }>} - The result of the sign-out request, with potential errors.
   * @throws {Error} - Throws an error if sign-out fails.
   */
  async deleteSession(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut({scope: 'local'});
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  },

  /**
   * Updates the user's push notification token.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {string} token - The new push notification token to be set.
   * @returns {Promise<void>} - Resolves once the token has been successfully updated.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  async setUserPushToken(userId: string, token: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(USERS_TABLE_ID)
        .update({ push_token: token })
        .eq("id", userId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error setting push token:", error);
      throw error;
    }
  },

  /**
   * Handles Google OAuth registration and user/role creation.
   * @returns {Promise<{ url: string }>} - The URL for the Google OAuth redirect.
   */
  async signInWithGoogle(): Promise<{ url: string }> {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw new Error(error.message);
    // The redirect will happen, so this only works for Expo Go or web popup flows
    return { url: data.url };
  },

  /**
   * Completes the user profile after Google OAuth if needed.
   * @param {string} userId - The Supabase user ID.
   * @param {string} email - The user's email.
   * @param {string | null} firstName
   * @param {string | null} lastName
   * @param {string | null} phone
   */
  async completeUserProfile(userId: string, email: string, firstName: string | null, lastName: string | null, phone: string | null) {
      // create it profile and role
      const { error: newProfileError } = await supabase.from("users").upsert({
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
      });

      if (newProfileError) {
        console.error("Error creating profile or role:", newProfileError);
        throw new Error("Une erreur est survenue lors de la création du compte. Veuillez réessayer.")
      }
  },

  /**
   * Resend the confirmation email to the current user.
   */
  async resendConfirmationEmail() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user?.email) {
      throw new Error("Vous devez être connecté pour renvoyer l'email de confirmation.");
    }
    const { error } = await supabase.auth.resend({ type: 'signup', email: userData.user.email });
    if (error) throw new Error(error.message);
  },

  /**
   * Links a parent to students based on phone number matching.
   * Updates students with matching parent_phone to set parent_id.
   * @param {string} parentId - The parent user ID
   * @param {string} phone - The parent's phone number
   * @returns {Promise<number>} - Number of students linked
   */
  async linkParentToStudentsByPhone(parentId: string, phone: string): Promise<number> {
    try {
      // Find students with matching parent_phone and no parent assigned
      const { data: students, error: fetchError } = await supabase
        .from('students')
        .select('id')
        .ilike('parent_phone', phone)
        // .is('parent_id', null);

      if (fetchError) {
        console.error('Error fetching students by phone:', fetchError);
        return 0;
      }

      if (!students || students.length === 0) {
        return 0;
      }

      // Update matching students with parent_id
      const studentIds = students.map(student => student.id);
      const { error: updateError } = await supabase
        .from('students')
        .update({ parent_id: parentId })
        .in('id', studentIds);

      if (updateError) {
        console.error('Error updating students parent_id:', updateError);
        return 0;
      }

      // Check and update parent_phone format to include +225 prefix if missing
      const { data: studentsWithPhone, error: phoneCheckError } = await supabase
        .from('students')
        .select('id, parent_phone')
        .in('id', studentIds)
        .not('parent_phone', 'ilike', '+225%');

      if (!phoneCheckError && studentsWithPhone && studentsWithPhone.length > 0) {
        // Update students whose parent_phone doesn't start with +225
        const phoneUpdates = studentsWithPhone.map(student => ({
          id: student.id,
          parent_phone: `+225${student.parent_phone}`
        }));

        // Update each student's parent_phone individually
        for (const update of phoneUpdates) {
          const { error: phoneUpdateError } = await supabase
            .from('students')
            .update({ parent_phone: update.parent_phone })
            .eq('id', update.id);

          if (phoneUpdateError) {
            console.error(`Error updating parent_phone for student ${update.id}:`, phoneUpdateError);
          }
        }
      }

      return students.length;
    } catch (error) {
      console.error('Error linking parent to students:', error);
      return 0;
    }
  },
};
