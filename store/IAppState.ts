import { ColorSchemeName } from "react-native";
import { IStudentDTO, IUserDTO } from "../types/ILoginDTO";
import { ISchoolYear, ISemester } from "@/types/ISchoolYearDTO";

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
  selectedStudent: IStudentDTO | undefined;
  authToken: string | undefined;
  expoToken: string | undefined;
  profileCompletion: ProfileCompletion;

  schoolYears: ISchoolYear[]
  semesters: ISemester[]
  currentSemester: ISemester | null
  currentSchoolYear: ISchoolYear | null
}
