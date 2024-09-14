import { supabase, USERS_TABLE_ID } from "@src/lib/supabase";
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
} from "@supabase/auth-js";
import { ERole } from "@modules/app/types/ILoginDTO";

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
    firstName?: string,
    lastName?: string,
    phone?: string
  ): Promise<AuthResponse> {
    try {
      const newAccountResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
          },
        },
      });

      if (newAccountResponse.error)
        throw new Error(newAccountResponse.error.message);

      // create it role
      const newRoleResponse = await supabase.from("user_roles").insert({
        user_id: newAccountResponse.data.user?.id,
        role_id: ERole.PARENT,
      });

      if (newRoleResponse.error) throw new Error(newRoleResponse.error.message);

      return newAccountResponse;
    } catch (error) {
      console.error("Error creating account:", error);
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
  ): Promise<AuthTokenResponsePassword> {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (response.error) throw new Error(response.error.message);
      return response;
    } catch (error) {
      console.error("Error creating session:", error);
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
  async deleteSession(): Promise<{ error: AuthError | null }> {
    try {
      const response = await supabase.auth.signOut();
      if (response.error) throw new Error(response.error.message);
      return response;
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
};
