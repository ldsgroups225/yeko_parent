import { auth } from "@modules/app/services/appService";
import { ERole, IUserDTO } from "@modules/app/types/ILoginDTO";
import { supabase, USERS_TABLE_ID } from "@src/lib/supabase";
import { useEffect, useState } from "react";

/**
 * useAuth hook to handle authentication logic, including registration, login, logout,
 * and checking the current user's session. Handles loading state and performs async operations.
 *
 * @returns {Object} - Contains loading state, register, login, checkAuth, and logout methods.
 */
interface useAuthReturn {
  loading: boolean;
  register: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    phone?: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<IUserDTO | null>;
  checkAuth: () => Promise<IUserDTO | null>;
  logout: () => Promise<void>;
}

export const useAuth = (): useAuthReturn => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    checkAuth().then(() => setLoading(false));
  }, []);

  /**
   * Check if a user session exists and fetch user details if authenticated.
   * @async
   * @returns {Promise<IUserDTO | null>} - Returns the user object or null if no session.
   */
  const checkAuth = async (): Promise<IUserDTO | null> => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await auth.getAccount();

      if (session) {
        const { data: userData } = await supabase
          .from(USERS_TABLE_ID)
          .select(
            "id, push_token, email, first_name, last_name, phone, user_roles!inner(role_id)"
          )
          .eq("id", session.user.id)
          .eq("user_roles.role_id", ERole.PARENT)
          .single();

        if (!userData) {
          await logout();
          return null;
        }

        const { data: studentsData } = await supabase.rpc("get_student_info", {
          parent_user_id: userData.id,
        });

        return {
          id: userData.id || "",
          email: userData.email || "",
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          phone: userData.phone || "",
          pushToken: userData.push_token || "",
          children: studentsData.slice(0, 10).map((s: any) => ({
            id: s.student_id || "",
            firstName: s.first_name || "",
            lastName: s.last_name || "",
            idNumber: s.id_number || "",
            school: {
              id: s.school_id,
              name: s.school_name || "",
              imageUrl: s.school_image_url || "",
            },
            class: {
              id: s.class_id,
              name: s.class_name,
            },
          })),
        };
      } else {
        return null;
      }
    } catch (err) {
      console.error("[E_AUTH_CHECK]:", err);
      await logout();
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user account.
   * @async
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @param {string} [firstName] - User's first name (optional).
   * @param {string} [lastName] - User's last name (optional).
   * @param {string} [phone] - User's phone number (optional).
   * @returns {Promise<boolean>} - Returns true if registration is successful.
   */
  const register = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await auth.createAccount(email, password, firstName, lastName, phone);
      return true;
    } catch (error) {
      console.error("[E_AUTH_REGISTER]:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user using email and password.
   * @async
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @returns {Promise<IUserDTO | null>} - Returns user data if login is successful, otherwise null.
   */
  const login = async (
    email: string,
    password: string
  ): Promise<IUserDTO | null> => {
    try {
      setLoading(true);
      const { error } = await auth.loginWithEmailAndPassword(email, password);
      if (error) {
        console.error("[E_AUTH_LOGIN]:", error);
        return null;
      }
      return await checkAuth();
    } catch (error) {
      console.error("[E_AUTH_LOGIN_ERROR]:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the currently authenticated user.
   * @async
   * @returns {Promise<void>}
   */
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await auth.deleteSession();
      if (error) throw error;
    } catch (error) {
      console.error("[E_AUTH_LOGOUT]:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, register, login, logout, checkAuth };
};
