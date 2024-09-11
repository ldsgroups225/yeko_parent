import { auth } from "@modules/app/services/appService";
import { ERole, IStudentDTO, IUserDTO } from "@modules/app/types/ILoginDTO";
import { supabase, USERS_TABLE_ID } from "@src/lib/supabase";
import { useEffect, useState } from "react";

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
  checkAuth(): Promise<IUserDTO | null>;
  logout: () => Promise<void>;
}

export const useAuth = (): useAuthReturn => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().then((r) => r);
  }, []);

  const checkAuth = async (): Promise<IUserDTO | null> => {
    try {
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
          id: userData?.id || "",
          email: userData?.email || "",
          firstName: userData?.first_name || "",
          lastName: userData?.last_name || "",
          phone: userData?.phone || "",
          pushToken: userData?.push_token || "",
          children: studentsData
            .slice(0, 10)
            .map(
              (s: {
                student_id: string;
                first_name: string;
                last_name: string;
                id_number: string;
                school_id: string;
                school_name: string;
                school_image_url: string;
                class_id: string;
                class_name: string;
              }) => {
                return {
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
                } satisfies IStudentDTO;
              }
            ),
        };
      } else {
        return null;
      }
    } catch (err) {
      await logout();
      console.error("[E_AUTH_CHECK]:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    phone?: string
  ) => {
    try {
      await auth.createAccount(email, password, firstName, lastName, phone);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await auth.loginWithEmailAndPassword(email, password);
      if (error) {
        console.error("[E_AUTH_LOGIN]:", error);
        return null;
      }
      return await checkAuth();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.deleteSession();
    } catch (error) {
      throw error;
    }
  };

  return { loading, register, login, logout, checkAuth };
};
