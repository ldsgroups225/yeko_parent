import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ColorSchemeName } from "react-native";
import { IAppState, ProfileCompletion } from "./IAppState";
import { ISchoolYear, ISemester } from "@/types/ISchoolYearDTO";

/**
 * Initial state for the app slice.
 */
const initialState: IAppState = {
  isSignedIn: false,
  userColorScheme: "light",
  isLoading: false,
  user: undefined,
  selectedStudent: undefined,
  authToken: undefined,
  expoToken: undefined,
  profileCompletion: {
    currentStep: 0,
    theme: "auto",
    language: "english",
    avatar: "",
    gender: "",
    country: "",
    city: "",
    grade: "",
    referral: "",
  },
  schoolYears: [],
  semesters: [],
  currentSemester: null,
  currentSchoolYear: null
};

/**
 * A slice of the Redux store that manages app-related state.
 */
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    /**
     * Set the sign-in status of the user.
     * @param state - The current state.
     * @param action - Action containing the sign-in status.
     */
    setIsSignedIn(state: IAppState, action: PayloadAction<boolean>) {
      state.isSignedIn = action.payload;
    },

    /**
     * Set the user's color scheme (light or dark mode).
     * @param state - The current state.
     * @param action - Action containing the color scheme.
     */
    setUserColorScheme(
      state: IAppState,
      action: PayloadAction<ColorSchemeName>
    ) {
      state.userColorScheme = action.payload;
    },

    /**
     * Set the loading state of the application.
     * @param state - The current state.
     * @param action - Action containing the loading status.
     */
    setIsLoading(state: IAppState, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    /**
     * Set the user object and mark the user as signed in.
     * @param state - The current state.
     * @param action - Action containing the user object.
     */
    setUser(state: IAppState, action: PayloadAction<any>) {
      state.user = action.payload;
      state.isSignedIn = true;
    },

    /**
     * Set the current selected student object.
     * @param state - The current state.
     * @param action - Action containing the user object.
     */
    setSelectedStudent(state: IAppState, action: PayloadAction<any>) {
      state.selectedStudent = action.payload;
    },

    /**
     * Log out the user by resetting the relevant state properties.
     * @param state - The current state.
     */
    loggedOut(state: IAppState) {
      state.isSignedIn = false;
      state.authToken = undefined;
      state.expoToken = undefined;
      state.selectedStudent = undefined;
      state.user = undefined;
    },

    /**
     * Set the authentication token.
     * @param state - The current state.
     * @param action - Action containing the authentication token.
     */
    setAuthToken(state: IAppState, action: PayloadAction<string | undefined>) {
      state.authToken = action.payload;
    },

    /**
     * Set the Expo push notification token.
     * @param state - The current state.
     * @param action - Action containing the Expo token.
     */
    setExpoToken(state: IAppState, action: PayloadAction<string | undefined>) {
      state.expoToken = action.payload;
    },

    /**
     * Update the profile completion state with partial updates.
     * @param state - The current state.
     * @param action - Action containing the profile completion details.
     */
    setProfileCompletion(
      state: IAppState,
      action: PayloadAction<Partial<ProfileCompletion>>
    ) {
      state.profileCompletion = {
        ...state.profileCompletion,
        ...action.payload,
      };
    },

    /**
     * Set the current school year and semesters.
     */
    setCurrentSchoolYearAndSemesters(
      state: IAppState,
      action: PayloadAction<{ schoolYears: ISchoolYear[]; semesters: ISemester[] }>
    ) {
      state.schoolYears = action.payload.schoolYears;
      state.semesters = action.payload.semesters;

      state.currentSchoolYear = action.payload.schoolYears[0];
      state.currentSemester = action.payload.semesters.find(
        (semester) => semester.isCurrent
      ) ?? null;
    },
  },
});

export const {
  setIsSignedIn,
  setUserColorScheme,
  setIsLoading,
  setUser,
  setSelectedStudent,
  loggedOut,
  setAuthToken,
  setExpoToken,
  setProfileCompletion,
  setCurrentSchoolYearAndSemesters,
} = appSlice.actions;

export default appSlice.reducer;
