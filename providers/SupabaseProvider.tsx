import { useAuth, useSchoolYear } from "@/hooks";
import { useDispatch } from "react-redux";
import { supabase } from "@/lib/supabase";
import { setUser } from "@/store/appSlice";
import { SplashScreen } from "expo-router";
import { IUserDTO } from "@/types/ILoginDTO";
import { Session } from "@supabase/supabase-js";
import { setCurrentSchoolYearAndSemesters} from "@/store/appSlice";
import React, { createContext, useContext, useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

type SupabaseContextProps = {
	user: IUserDTO | null;
	session: Session | null;
	initialized?: boolean;
};

type SupabaseProviderProps = {
	children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
	user: null,
	session: null,
	initialized: false,
});

export const useAuthCheck = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const dispatch = useDispatch();
  const { checkAuth } = useAuth();
  const { getSchoolYears, getSemesters } = useSchoolYear();

	const [userProvided, setUserProvided] = useState<IUserDTO | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [initialized, setInitialized] = useState<boolean>(false);

	async function fetchSchoolYears() {
    // Fetch school years
    const schoolYears = await getSchoolYears();

    if (!schoolYears) return;

    // Fetch semesters
    const semesters = await getSemesters(schoolYears[0].id);

    if (!semesters) return;

    // Set school years and semesters
    dispatch(setCurrentSchoolYearAndSemesters({ schoolYears, semesters }));
  }

	useEffect(() => {
		checkAuth().then(r => {
			setSession(r?.session ?? null);
			setUserProvided(r?.user ? r.user : null);
      if (r && r?.user) {
				dispatch(setUser(r.user));
			}

			fetchSchoolYears().then(r => r);
		}).finally(() => {
			setInitialized(true);
		});

		supabase.auth.onAuthStateChange(async (event, session) => {
			setSession(session);
			// if (event === 'SIGNED_IN') {
			// 	if (token) {
			// 		await setPushToken(session!.user.id, token)
			// 		console.log(`TOKEN: ${token} set for user ${session!.user.id}`)
			// 	}
			// }
			// if (event === 'SIGNED_OUT') console.log('SIGNED_OUT');
		});
	}, []);

	return (
		<SupabaseContext.Provider
			value={{
				user: userProvided,
				session,
				initialized,
			}}
		>
			{children}
		</SupabaseContext.Provider>
	);
};
