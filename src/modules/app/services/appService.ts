import { supabase } from "@src/lib/supabase";
import {
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  AuthError,
} from "@supabase/auth-js";

interface IGetSession {
  data: {
    session: Session | null;
  };
  error: AuthError | null;
}

export const auth = {
  async createAccount(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    phone?: string
  ): Promise<AuthResponse> {
    try {
      const response = await supabase.auth.signUp({
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

      if (response.error) throw new Error(response.error.message);
      return response;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  },

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
};
