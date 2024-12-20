import { useAuth } from "@/hooks";
import { supabase } from "@/lib/supabase";
import { setUser } from "@/store/appSlice";
import { IUserDTO } from "@/types/ILoginDTO";
import { Session } from "@supabase/supabase-js";
import { SplashScreen } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {useAppSelector} from "@/store";

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
  const { checkAuth, setPushToken } = useAuth();
	const token = useAppSelector((s) => s?.AppReducer?.expoToken);
	const [userProvided, setUserProvided] = useState<IUserDTO | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [initialized, setInitialized] = useState<boolean>(false);

	useEffect(() => {
		checkAuth().then(r => {
			setSession(r?.session ?? null);
			setUserProvided(r?.user ? r.user : null);
      if (r && r?.user) {
				dispatch(setUser(r.user));
			}
		}).finally(() => {
			setInitialized(true);
		});

		supabase.auth.onAuthStateChange(async (event, session) => {
			setSession(session);
			// TODO: setUser(session ? session.user : null);

			if (event === 'SIGNED_IN') {
				if (token) {
					await setPushToken(session!.user.id, token)
					console.log(`TOKEN: ${token} set for user ${session!.user.id}`)
				}
			}
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
