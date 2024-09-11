import { ColorSchemeName } from "react-native";
import { IUserDTO } from "../types/ILoginDTO";

export interface ProfileCompletion {
  currentStep: number;
  theme: string;
  language: string;
  avatar: string;
  gender: string;
  country: string;
  city: string;
  grade: string;
  referral: string;
}

export interface IAppState {
  isSignedIn: boolean;
  userColorScheme: ColorSchemeName;
  isLoading: boolean;
  user: IUserDTO | undefined;
  authToken: string | undefined;
  expoToken: string | undefined;
  profileCompletion: ProfileCompletion;
}
